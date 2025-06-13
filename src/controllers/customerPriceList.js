const express = require('express');
const router = express.Router();
const db = require('../config/firebase');

// Manual schema validation function
function validateCustomerPriceList(data) {
    const errors = [];
    if (!data.customer_id) errors.push('customer_id is required');
    if (!data.item_id) errors.push('item_id is required');
    if (typeof data.unit_price !== 'number') errors.push('unit_price is required and must be a number');
    if (data.discount_percentage !== undefined && typeof data.discount_percentage !== 'number') {
        errors.push('discount_percentage must be a number');
    }
    return errors;
}

// Create
router.post('/', async (req, res) => {
    const errors = validateCustomerPriceList(req.body);
    if (errors.length) {
        return res.status(400).json({ errors });
    }
    try {
        const customerPriceListData = {
            customer_id: req.body.customer_id,
            item_id: req.body.item_id,
            unit_price: req.body.unit_price,
            discount_percentage: typeof req.body.discount_percentage === 'number' ? req.body.discount_percentage : 0,
            created_at: new Date(),
            updated_at: new Date()
        };
        const docRef = await db.collection('customer_price_lists').add(customerPriceListData);
        res.status(201).json({ id: docRef.id, ...customerPriceListData });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Read all
router.get('/', async (req, res) => {
    try {
        const snapshot = await db.collection('customer_price_lists').get();
        const customerPriceLists = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(customerPriceLists);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Read one
router.get('/:id', async (req, res) => {
    try {
        const doc = await db.collection('customer_price_lists').doc(req.params.id).get();
        if (!doc.exists) return res.status(404).json({ error: 'Not found' });
        res.json({ id: doc.id, ...doc.data() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update
router.put('/:id', async (req, res) => {
    const errors = validateCustomerPriceList(req.body);
    if (errors.length) {
        return res.status(400).json({ errors });
    }
    try {
        const customerPriceListData = {
            customer_id: req.body.customer_id,
            item_id: req.body.item_id,
            unit_price: req.body.unit_price,
            discount_percentage: typeof req.body.discount_percentage === 'number' ? req.body.discount_percentage : 0,
            updated_at: new Date()
        };
        await db.collection('customer_price_lists').doc(req.params.id).update(customerPriceListData);
        const updatedDoc = await db.collection('customer_price_lists').doc(req.params.id).get();
        res.json({ id: updatedDoc.id, ...updatedDoc.data() });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete
router.delete('/:id', async (req, res) => {
    try {
        await db.collection('customer_price_lists').doc(req.params.id).delete();
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;