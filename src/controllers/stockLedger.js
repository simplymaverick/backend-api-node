const express = require('express');
const router = express.Router();
const db = require('../config/firebase');

// Manual schema validation function
function validateStockLedger(data) {
    const errors = [];
    if (!data.item_id) errors.push('item_id is required');
    if (!data.transaction_type) errors.push('transaction_type is required');
    if (!data.quantity_change && data.quantity_change !== 0) errors.push('quantity_change is required');
    if (!data.date_of_transaction) errors.push('date_of_transaction is required');
    if (!data.cost_per_unit_at_transaction && data.cost_per_unit_at_transaction !== 0) errors.push('cost_per_unit_at_transaction is required');
    if (!data.user_id) errors.push('user_id is required');
    // Optionally, validate enums and types
    const allowedTypes = [
        'Received (GRV)', 'Issued to Production', 'Return from Production', 'Spoilage',
        'Adjustment In', 'Adjustment Out', 'Transfer Out', 'Transfer In', 'Dispatched for Sale'
    ];
    if (data.transaction_type && !allowedTypes.includes(data.transaction_type)) {
        errors.push('transaction_type is invalid');
    }
    return errors;
}

// Create
router.post('/', async (req, res) => {
    const errors = validateStockLedger(req.body);
    if (errors.length) {
        return res.status(400).json({ errors });
    }
    try {
        const entryData = {
            item_id: req.body.item_id,
            transaction_type: req.body.transaction_type,
            quantity_change: req.body.quantity_change,
            date_of_transaction: req.body.date_of_transaction ? new Date(req.body.date_of_transaction) : new Date(),
            related_document_id: req.body.related_document_id || null,
            reason: req.body.reason || null,
            cost_per_unit_at_transaction: req.body.cost_per_unit_at_transaction,
            user_id: req.body.user_id,
            created_at: new Date(),
            updated_at: new Date()
        };
        const docRef = await db.collection('stock_ledger').add(entryData);
        res.status(201).json({ id: docRef.id, ...entryData });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Read all
router.get('/', async (req, res) => {
    try {
        const snapshot = await db.collection('stock_ledger').get();
        const entries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(entries);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Read one
router.get('/:id', async (req, res) => {
    try {
        const doc = await db.collection('stock_ledger').doc(req.params.id).get();
        if (!doc.exists) return res.status(404).json({ error: 'Not found' });
        res.json({ id: doc.id, ...doc.data() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update
router.put('/:id', async (req, res) => {
    const errors = validateStockLedger(req.body);
    if (errors.length) {
        return res.status(400).json({ errors });
    }
    try {
        const entryData = {
            item_id: req.body.item_id,
            transaction_type: req.body.transaction_type,
            quantity_change: req.body.quantity_change,
            date_of_transaction: req.body.date_of_transaction ? new Date(req.body.date_of_transaction) : new Date(),
            related_document_id: req.body.related_document_id || null,
            reason: req.body.reason || null,
            cost_per_unit_at_transaction: req.body.cost_per_unit_at_transaction,
            user_id: req.body.user_id,
            updated_at: new Date()
        };
        await db.collection('stock_ledger').doc(req.params.id).update(entryData);
        const updatedDoc = await db.collection('stock_ledger').doc(req.params.id).get();
        res.json({ id: updatedDoc.id, ...updatedDoc.data() });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete
router.delete('/:id', async (req, res) => {
    try {
        await db.collection('stock_ledger').doc(req.params.id).delete();
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;