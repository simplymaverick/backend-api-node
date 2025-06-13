const express = require('express');
const router = express.Router();
const db = require('../config/firebase');

// Manual schema validation function
function validatePurchaseOrderItem(data) {
    const errors = [];
    if (!data.po_id) errors.push('po_id is required');
    if (!data.item_id) errors.push('item_id is required');
    if (typeof data.quantity_ordered !== 'number') errors.push('quantity_ordered is required and must be a number');
    if (typeof data.unit_cost_at_order !== 'number') errors.push('unit_cost_at_order is required and must be a number');
    return errors;
}

// Create
router.post('/', async (req, res) => {
    const errors = validatePurchaseOrderItem(req.body);
    if (errors.length) {
        return res.status(400).json({ errors });
    }
    try {
        const total_cost = req.body.quantity_ordered * req.body.unit_cost_at_order;
        const itemData = {
            po_id: req.body.po_id,
            item_id: req.body.item_id,
            quantity_ordered: req.body.quantity_ordered,
            unit_cost_at_order: req.body.unit_cost_at_order,
            total_cost,
            created_at: new Date(),
            updated_at: new Date()
        };
        const docRef = await db.collection('purchase_order_items').add(itemData);
        res.status(201).json({ id: docRef.id, ...itemData });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Read all
router.get('/', async (req, res) => {
    try {
        const snapshot = await db.collection('purchase_order_items').get();
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Read one
router.get('/:id', async (req, res) => {
    try {
        const doc = await db.collection('purchase_order_items').doc(req.params.id).get();
        if (!doc.exists) return res.status(404).json({ error: 'Not found' });
        res.json({ id: doc.id, ...doc.data() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update
router.put('/:id', async (req, res) => {
    const errors = validatePurchaseOrderItem(req.body);
    if (errors.length) {
        return res.status(400).json({ errors });
    }
    try {
        const total_cost = req.body.quantity_ordered * req.body.unit_cost_at_order;
        const itemData = {
            po_id: req.body.po_id,
            item_id: req.body.item_id,
            quantity_ordered: req.body.quantity_ordered,
            unit_cost_at_order: req.body.unit_cost_at_order,
            total_cost,
            updated_at: new Date()
        };
        await db.collection('purchase_order_items').doc(req.params.id).update(itemData);
        const updatedDoc = await db.collection('purchase_order_items').doc(req.params.id).get();
        res.json({ id: updatedDoc.id, ...updatedDoc.data() });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete
router.delete('/:id', async (req, res) => {
    try {
        await db.collection('purchase_order_items').doc(req.params.id).delete();
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;