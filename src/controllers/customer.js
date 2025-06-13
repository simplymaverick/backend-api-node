const express = require('express');
const router = express.Router();
const db = require('../config/firebase');

// Manual schema validation function
function validateCustomer(data) {
    const errors = [];
    if (!data.customer_code) errors.push('customer_code is required');
    if (!data.full_name_or_business_name) errors.push('full_name_or_business_name is required');
    if (!data.customer_type || !['Wholesale', 'Retail', 'Account', 'Cash'].includes(data.customer_type)) {
        errors.push('customer_type is required and must be one of Wholesale, Retail, Account, Cash');
    }
    if (!data.delivery_address) errors.push('delivery_address is required');
    if (data.payment_terms && !['Cash on Delivery', '7-day', '30-day'].includes(data.payment_terms)) {
        errors.push('payment_terms must be one of Cash on Delivery, 7-day, 30-day');
    }
    // opening_balance, is_inactive, notes, area, contact_person, phone_number, route_id are optional
    return errors;
}

// Create
router.post('/', async (req, res) => {
    const errors = validateCustomer(req.body);
    if (errors.length) {
        return res.status(400).json({ errors });
    }
    try {
        const customerData = {
            customer_code: req.body.customer_code,
            full_name_or_business_name: req.body.full_name_or_business_name,
            customer_type: req.body.customer_type,
            contact_person: req.body.contact_person || null,
            phone_number: req.body.phone_number || null,
            delivery_address: req.body.delivery_address,
            area: req.body.area || null,
            route_id: req.body.route_id || null,
            payment_terms: req.body.payment_terms || 'Cash on Delivery',
            opening_balance: typeof req.body.opening_balance === 'number' ? req.body.opening_balance : 0,
            notes: req.body.notes || null,
            is_inactive: typeof req.body.is_inactive === 'boolean' ? req.body.is_inactive : false,
            created_at: new Date(),
            updated_at: new Date()
        };
        const docRef = await db.collection('customers').add(customerData);
        res.status(201).json({ id: docRef.id, ...customerData });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Read all
router.get('/', async (req, res) => {
    try {
        const snapshot = await db.collection('customers').get();
        const customers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(customers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Read one
router.get('/:id', async (req, res) => {
    try {
        const doc = await db.collection('customers').doc(req.params.id).get();
        if (!doc.exists) return res.status(404).json({ error: 'Not found' });
        res.json({ id: doc.id, ...doc.data() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update
router.put('/:id', async (req, res) => {
    const errors = validateCustomer(req.body);
    if (errors.length) {
        return res.status(400).json({ errors });
    }
    try {
        const customerData = {
            customer_code: req.body.customer_code,
            full_name_or_business_name: req.body.full_name_or_business_name,
            customer_type: req.body.customer_type,
            contact_person: req.body.contact_person || null,
            phone_number: req.body.phone_number || null,
            delivery_address: req.body.delivery_address,
            area: req.body.area || null,
            route_id: req.body.route_id || null,
            payment_terms: req.body.payment_terms || 'Cash on Delivery',
            opening_balance: typeof req.body.opening_balance === 'number' ? req.body.opening_balance : 0,
            notes: req.body.notes || null,
            is_inactive: typeof req.body.is_inactive === 'boolean' ? req.body.is_inactive : false,
            updated_at: new Date()
        };
        await db.collection('customers').doc(req.params.id).update(customerData);
        const updatedDoc = await db.collection('customers').doc(req.params.id).get();
        res.json({ id: updatedDoc.id, ...updatedDoc.data() });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete
router.delete('/:id', async (req, res) => {
    try {
        await db.collection('customers').doc(req.params.id).delete();
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;