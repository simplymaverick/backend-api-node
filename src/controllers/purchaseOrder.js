const express = require('express');
const router = express.Router();
const db = require('../config/firebase');

// Manual schema validation function
function validatePurchaseOrder(data) {
    const errors = [];
    if (!data.po_number) errors.push('po_number is required');
    if (!data.supplier_id) errors.push('supplier_id is required');
    if (!data.order_date) errors.push('order_date is required');
    if (!data.status) errors.push('status is required');
    if (!['Pending', 'Approved', 'Received', 'Cancelled'].includes(data.status)) {
        errors.push('status must be one of Pending, Approved, Received, Cancelled');
    }
    if (!data.prepared_by_user_id) errors.push('prepared_by_user_id is required');
    return errors;
}

// Create
router.post('/', async (req, res) => {
    const errors = validatePurchaseOrder(req.body);
    if (errors.length) {
        return res.status(400).json({ errors });
    }
    try {
        const orderData = {
            po_number: req.body.po_number,
            supplier_id: req.body.supplier_id,
            order_date: req.body.order_date ? new Date(req.body.order_date) : new Date(),
            status: req.body.status,
            prepared_by_user_id: req.body.prepared_by_user_id,
            created_at: new Date(),
            updated_at: new Date()
        };
        const docRef = await db.collection('purchase_orders').add(orderData);
        res.status(201).json({ id: docRef.id, ...orderData });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Read all
router.get('/', async (req, res) => {
    try {
        const snapshot = await db.collection('purchase_orders').get();
        const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Read one
router.get('/:id', async (req, res) => {
    try {
        const doc = await db.collection('purchase_orders').doc(req.params.id).get();
        if (!doc.exists) return res.status(404).json({ error: 'Not found' });
        res.json({ id: doc.id, ...doc.data() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update
router.put('/:id', async (req, res) => {
    const errors = validatePurchaseOrder(req.body);
    if (errors.length) {
        return res.status(400).json({ errors });
    }
    try {
        const orderData = {
            po_number: req.body.po_number,
            supplier_id: req.body.supplier_id,
            order_date: req.body.order_date ? new Date(req.body.order_date) : new Date(),
            status: req.body.status,
            prepared_by_user_id: req.body.prepared_by_user_id,
            updated_at: new Date()
        };
        await db.collection('purchase_orders').doc(req.params.id).update(orderData);
        const updatedDoc = await db.collection('purchase_orders').doc(req.params.id).get();
        res.json({ id: updatedDoc.id, ...updatedDoc.data() });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete
router.delete('/:id', async (req, res) => {
    try {
        await db.collection('purchase_orders').doc(req.params.id).delete();
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;