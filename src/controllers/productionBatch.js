const express = require('express');
const router = express.Router();
const db = require('../config/firebase');

// Manual schema validation function
function validateProductionBatch(data) {
    const errors = [];
    if (!data.production_date) errors.push('production_date is required');
    if (typeof data.number_of_bakes !== 'number') errors.push('number_of_bakes is required and must be a number');
    if (!data.formula_used) errors.push('formula_used is required');
    if (!data.production_manager_user_id) errors.push('production_manager_user_id is required');
    if (typeof data.output_loaves !== 'number') errors.push('output_loaves is required and must be a number');
    if (!data.shift || !['Day', 'Night'].includes(data.shift)) errors.push('shift is required and must be "Day" or "Night"');
    // bakery_damages is optional, default to 0 if not provided
    return errors;
}

// Create
router.post('/', async (req, res) => {
    const errors = validateProductionBatch(req.body);
    if (errors.length) {
        return res.status(400).json({ errors });
    }
    try {
        const batchData = {
            production_date: req.body.production_date ? new Date(req.body.production_date) : new Date(),
            number_of_bakes: req.body.number_of_bakes,
            formula_used: req.body.formula_used,
            production_manager_user_id: req.body.production_manager_user_id,
            output_loaves: req.body.output_loaves,
            shift: req.body.shift,
            bakery_damages: typeof req.body.bakery_damages === 'number' ? req.body.bakery_damages : 0,
            created_at: new Date(),
            updated_at: new Date()
        };
        const docRef = await db.collection('production_batches').add(batchData);
        res.status(201).json({ id: docRef.id, ...batchData });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Read all
router.get('/', async (req, res) => {
    try {
        const snapshot = await db.collection('production_batches').get();
        const batches = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(batches);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Read one
router.get('/:id', async (req, res) => {
    try {
        const doc = await db.collection('production_batches').doc(req.params.id).get();
        if (!doc.exists) return res.status(404).json({ error: 'Not found' });
        res.json({ id: doc.id, ...doc.data() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update
router.put('/:id', async (req, res) => {
    const errors = validateProductionBatch(req.body);
    if (errors.length) {
        return res.status(400).json({ errors });
    }
    try {
        const batchData = {
            production_date: req.body.production_date ? new Date(req.body.production_date) : new Date(),
            number_of_bakes: req.body.number_of_bakes,
            formula_used: req.body.formula_used,
            production_manager_user_id: req.body.production_manager_user_id,
            output_loaves: req.body.output_loaves,
            shift: req.body.shift,
            bakery_damages: typeof req.body.bakery_damages === 'number' ? req.body.bakery_damages : 0,
            updated_at: new Date()
        };
        await db.collection('production_batches').doc(req.params.id).update(batchData);
        const updatedDoc = await db.collection('production_batches').doc(req.params.id).get();
        res.json({ id: updatedDoc.id, ...updatedDoc.data() });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete
router.delete('/:id', async (req, res) => {
    try {
        await db.collection('production_batches').doc(req.params.id).delete();
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;