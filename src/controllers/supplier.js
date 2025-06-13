const express = require('express');
const router = express.Router();
const db = require('../config/firebase');

// Manual schema validation function
function validateSupplier(data) {
    const errors = [];
    if (!data.supplier_name) errors.push('supplier_name is required');
    if (!data.address) errors.push('address is required');
    if (!data.contact_person) errors.push('contact_person is required');
    if (!data.phone_number) errors.push('phone_number is required');
    if (!data.email) errors.push('email is required');
    if (data.payment_status && !['Paid', 'Unpaid'].includes(data.payment_status)) {
        errors.push('payment_status must be "Paid" or "Unpaid"');
    }
    return errors;
}

// Create
router.post('/', async (req, res) => {
    const errors = validateSupplier(req.body);
    if (errors.length) {
        return res.status(400).json({ errors });
    }
    try {
        const supplierData = {
            supplier_name: req.body.supplier_name,
            address: req.body.address,
            contact_person: req.body.contact_person,
            phone_number: req.body.phone_number,
            email: req.body.email,
            payment_status: req.body.payment_status || 'Unpaid',
            created_at: new Date(),
            updated_at: new Date()
        };
        const docRef = await db.collection('suppliers').add(supplierData);
        res.status(201).json({ id: docRef.id, ...supplierData });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Read all
router.get('/', async (req, res) => {
    try {
        const snapshot = await db.collection('suppliers').get();
        const suppliers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(suppliers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Read one
router.get('/:id', async (req, res) => {
    try {
        const doc = await db.collection('suppliers').doc(req.params.id).get();
        if (!doc.exists) return res.status(404).json({ error: 'Not found' });
        res.json({ id: doc.id, ...doc.data() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update
router.put('/:id', async (req, res) => {
    const errors = validateSupplier(req.body);
    if (errors.length) {
        return res.status(400).json({ errors });
    }
    try {
        const supplierData = {
            supplier_name: req.body.supplier_name,
            address: req.body.address,
            contact_person: req.body.contact_person,
            phone_number: req.body.phone_number,
            email: req.body.email,
            payment_status: req.body.payment_status || 'Unpaid',
            updated_at: new Date()
        };
        await db.collection('suppliers').doc(req.params.id).update(supplierData);
        const updatedDoc = await db.collection('suppliers').doc(req.params.id).get();
        res.json({ id: updatedDoc.id, ...updatedDoc.data() });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete
router.delete('/:id', async (req, res) => {
    try {
        await db.collection('suppliers').doc(req.params.id).delete();
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;