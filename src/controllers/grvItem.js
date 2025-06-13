const express = require('express');
const router = express.Router();
const db = require('../config/firebase');

// Manual schema validation function
function validateGrvItem(data) {
    const errors = [];
    if (!data.grv_id) errors.push('grv_id is required');
    if (!data.item_id) errors.push('item_id is required');
    if (typeof data.quantity_received !== 'number') errors.push('quantity_received is required and must be a number');
    if (typeof data.discrepancy_flag !== 'boolean') errors.push('discrepancy_flag is required and must be a boolean');
    // discrepancy_details is optional
    return errors;
}

// Create
router.post('/', async (req, res) => {
    const errors = validateGrvItem(req.body);
    if (errors.length) {
        return res.status(400).json({ errors });
    }
    try {
        const grvItemData = {
            grv_id: req.body.grv_id,
            item_id: req.body.item_id,
            quantity_received: req.body.quantity_received,
            discrepancy_flag: req.body.discrepancy_flag,
            discrepancy_details: req.body.discrepancy_details || '',
            created_at: new Date(),
            updated_at: new Date()
        };
        const docRef = await db.collection('grv_items').add(grvItemData);
        res.status(201).json({ id: docRef.id, ...grvItemData });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Read all
router.get('/', async (req, res) => {
    try {
        const snapshot = await db.collection('grv_items').get();
        const grvItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(grvItems);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Read one
router.get('/:id', async (req, res) => {
    try {
        const doc = await db.collection('grv_items').doc(req.params.id).get();
        if (!doc.exists) return res.status(404).json({ error: 'Not found' });
        res.json({ id: doc.id, ...doc.data() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update
router.put('/:id', async (req, res) => {
    const errors = validateGrvItem(req.body);
    if (errors.length) {
        return res.status(400).json({ errors });
    }
    try {
        const grvItemData = {
            grv_id: req.body.grv_id,
            item_id: req.body.item_id,
            quantity_received: req.body.quantity_received,
            discrepancy_flag: req.body.discrepancy_flag,
            discrepancy_details: req.body.discrepancy_details || '',
            updated_at: new Date()
        };
        await db.collection('grv_items').doc(req.params.id).update(grvItemData);
        const updatedDoc = await db.collection('grv_items').doc(req.params.id).get();
        res.json({ id: updatedDoc.id, ...updatedDoc.data() });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete
router.delete('/:id', async (req, res) => {
    try {
        await db.collection('grv_items').doc(req.params.id).delete();
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;