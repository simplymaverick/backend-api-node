const express = require('express');
const router = express.Router();
const db = require('../config/firebase');

// Manual schema validation function
function validateGrv(data) {
    const errors = [];
    // po_id is optional
    if (!data.supplier_id) errors.push('supplier_id is required');
    if (!data.delivery_date) errors.push('delivery_date is required');
    if (!data.received_by_user_id) errors.push('received_by_user_id is required');
    if (typeof data.is_backdated !== 'boolean') errors.push('is_backdated is required and must be a boolean');
    if (data.status && !['Received', 'Partial', 'Discrepancy'].includes(data.status)) {
        errors.push('status must be one of Received, Partial, Discrepancy');
    }
    // backdate_reason is optional
    return errors;
}

// Create
router.post('/', async (req, res) => {
    const errors = validateGrv(req.body);
    if (errors.length) {
        return res.status(400).json({ errors });
    }
    try {
        const grvData = {
            po_number: req.body.po_number || null,
            supplier_id: req.body.supplier_id,
            items_recieved: req.body.items_received || [],
            delivery_date: req.body.delivery_date ? new Date(req.body.delivery_date) : new Date(),
            is_backdated: req.body.is_backdated || false,
            received_by_user_id: req.body.received_by_user_id,
            backdate_reason: req.body.backdate_reason || null,
            status: req.body.status || 'Received',
            created_at: new Date(),
            updated_at: new Date()
        };
        const docRef = await db.collection('grvs').add(grvData);
        res.status(201).json({ id: docRef.id, ...grvData });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Read all
router.get('/', async (req, res) => {
    try {
        const snapshot = await db.collection('grvs').get();
        const grvs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(grvs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Read one
router.get('/:id', async (req, res) => {
    try {
        const doc = await db.collection('grvs').doc(req.params.id).get();
        if (!doc.exists) return res.status(404).json({ error: 'Not found' });
        res.json({ id: doc.id, ...doc.data() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update
router.put('/:id', async (req, res) => {
    const errors = validateGrv(req.body);
    if (errors.length) {
        return res.status(400).json({ errors });
    }
    try {
        const grvData = {

            po_number: req.body.po_number || null,
            supplier_id: req.body.supplier_id,
            items_recieved: req.body.items_received || [],
            delivery_date: req.body.delivery_date ? new Date(req.body.delivery_date) : new Date(),
            is_backdated: req.body.is_backdated || false,
            received_by_user_id: req.body.received_by_user_id,
            backdate_reason: req.body.backdate_reason || null,
            status: req.body.status || 'Received',
            created_at: new Date(),
            updated_at: new Date()
        };
        await db.collection('grvs').doc(req.params.id).update(grvData);
        const updatedDoc = await db.collection('grvs').doc(req.params.id).get();
        res.json({ id: updatedDoc.id, ...updatedDoc.data() });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete
router.delete('/:id', async (req, res) => {
    try {
        await db.collection('grvs').doc(req.params.id).delete();
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;