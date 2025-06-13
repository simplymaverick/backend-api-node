const express = require('express');
const router = express.Router();
const db = require('../config/firebase');

// Manual schema validation function
function validateDriverDeliveryItem(data) {
    const errors = [];
    if (!data.delivery_id) errors.push('delivery_id is required');
    if (!data.bread_type) errors.push('bread_type is required');
    if (typeof data.quantity_loaded !== 'number') errors.push('quantity_loaded is required and must be a number');
    if (typeof data.unit_price !== 'number') errors.push('unit_price is required and must be a number');
    // quantity_returned, quantity_sold, revenue_for_type, commission_earned, is_damaged, is_shortage are optional
    return errors;
}

// Create
router.post('/', async (req, res) => {
    const errors = validateDriverDeliveryItem(req.body);
    if (errors.length) {
        return res.status(400).json({ errors });
    }
    try {
        const quantity_returned = typeof req.body.quantity_returned === 'number' ? req.body.quantity_returned : 0;
        const quantity_sold = typeof req.body.quantity_sold === 'number'
            ? req.body.quantity_sold
            : req.body.quantity_loaded - quantity_returned;
        const revenue_for_type = typeof req.body.revenue_for_type === 'number'
            ? req.body.revenue_for_type
            : quantity_sold * req.body.unit_price;
        const commission_earned = typeof req.body.commission_earned === 'number'
            ? req.body.commission_earned
            : 0; // You can add your commission logic here if needed

        const itemData = {
            delivery_id: req.body.delivery_id,
            bread_type: req.body.bread_type,
            quantity_loaded: req.body.quantity_loaded,
            quantity_returned,
            unit_price: req.body.unit_price,
            quantity_sold,
            revenue_for_type,
            commission_earned,
            is_damaged: typeof req.body.is_damaged === 'boolean' ? req.body.is_damaged : false,
            is_shortage: typeof req.body.is_shortage === 'boolean' ? req.body.is_shortage : false,
            created_at: new Date(),
            updated_at: new Date()
        };
        const docRef = await db.collection('driver_delivery_items').add(itemData);
        res.status(201).json({ id: docRef.id, ...itemData });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Read all
router.get('/', async (req, res) => {
    try {
        const snapshot = await db.collection('driver_delivery_items').get();
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Read one
router.get('/:id', async (req, res) => {
    try {
        const doc = await db.collection('driver_delivery_items').doc(req.params.id).get();
        if (!doc.exists) return res.status(404).json({ error: 'Not found' });
        res.json({ id: doc.id, ...doc.data() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update
router.put('/:id', async (req, res) => {
    const errors = validateDriverDeliveryItem(req.body);
    if (errors.length) {
        return res.status(400).json({ errors });
    }
    try {
        const quantity_returned = typeof req.body.quantity_returned === 'number' ? req.body.quantity_returned : 0;
        const quantity_sold = typeof req.body.quantity_sold === 'number'
            ? req.body.quantity_sold
            : req.body.quantity_loaded - quantity_returned;
        const revenue_for_type = typeof req.body.revenue_for_type === 'number'
            ? req.body.revenue_for_type
            : quantity_sold * req.body.unit_price;
        const commission_earned = typeof req.body.commission_earned === 'number'
            ? req.body.commission_earned
            : 0; // You can add your commission logic here if needed

        const itemData = {
            delivery_id: req.body.delivery_id,
            bread_type: req.body.bread_type,
            quantity_loaded: req.body.quantity_loaded,
            quantity_returned,
            unit_price: req.body.unit_price,
            quantity_sold,
            revenue_for_type,
            commission_earned,
            is_damaged: typeof req.body.is_damaged === 'boolean' ? req.body.is_damaged : false,
            is_shortage: typeof req.body.is_shortage === 'boolean' ? req.body.is_shortage : false,
            updated_at: new Date()
        };
        await db.collection('driver_delivery_items').doc(req.params.id).update(itemData);
        const updatedDoc = await db.collection('driver_delivery_items').doc(req.params.id).get();
        res.json({ id: updatedDoc.id, ...updatedDoc.data() });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete
router.delete('/:id', async (req, res) => {
    try {
        await db.collection('driver_delivery_items').doc(req.params.id).delete();
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;