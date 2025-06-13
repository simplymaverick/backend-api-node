const express = require('express');
const router = express.Router();
const db = require('../config/firebase');

// Manual schema validation function
function validateIngredient(data) {
    const errors = [];
    if (!data.item_name) errors.push('item_name is required');
    if (!data.category) errors.push('category is required');
    if (!data.unit_of_measure) errors.push('unit_of_measure is required');
    if (typeof data.unit_cost !== 'number') errors.push('unit_cost is required and must be a number');
    if (typeof data.reorder_level !== 'number') errors.push('reorder_level is required and must be a number');
    if (typeof data.alert_threshold !== 'number') errors.push('alert_threshold is required and must be a number');
    if (typeof data.batch_tracking_enabled !== 'boolean') errors.push('batch_tracking_enabled is required and must be a boolean');
    if (typeof data.expiry_tracking_enabled !== 'boolean') errors.push('expiry_tracking_enabled is required and must be a boolean');
    return errors;
}

// Create
router.post('/', async (req, res) => {
    const errors = validateIngredient(req.body);
    if (errors.length) {
        return res.status(400).json({ errors });
    }
    try {
        const ingredientData = {
            item_name: req.body.item_name,
            category: req.body.category,
            unit_of_measure: req.body.unit_of_measure,
            unit_cost: req.body.unit_cost,
            reorder_level: req.body.reorder_level,
            alert_threshold: req.body.alert_threshold,
            batch_tracking_enabled: req.body.batch_tracking_enabled,
            expiry_tracking_enabled: req.body.expiry_tracking_enabled,
            created_at: new Date(),
            updated_at: new Date()
        };
        const docRef = await db.collection('ingredients').add(ingredientData);
        res.status(201).json({ id: docRef.id, ...ingredientData });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Read all
router.get('/', async (req, res) => {
    try {
        const snapshot = await db.collection('ingredients').get();
        const ingredients = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(ingredients);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Read one
router.get('/:id', async (req, res) => {
    try {
        const doc = await db.collection('ingredients').doc(req.params.id).get();
        if (!doc.exists) return res.status(404).json({ error: 'Not found' });
        res.json({ id: doc.id, ...doc.data() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update
router.put('/:id', async (req, res) => {
    const errors = validateIngredient(req.body);
    if (errors.length) {
        return res.status(400).json({ errors });
    }
    try {
        const ingredientData = {
            item_name: req.body.item_name,
            category: req.body.category,
            unit_of_measure: req.body.unit_of_measure,
            unit_cost: req.body.unit_cost,
            reorder_level: req.body.reorder_level,
            alert_threshold: req.body.alert_threshold,
            batch_tracking_enabled: req.body.batch_tracking_enabled,
            expiry_tracking_enabled: req.body.expiry_tracking_enabled,
            updated_at: new Date()
        };
        await db.collection('ingredients').doc(req.params.id).update(ingredientData);
        const updatedDoc = await db.collection('ingredients').doc(req.params.id).get();
        res.json({ id: updatedDoc.id, ...updatedDoc.data() });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete
router.delete('/:id', async (req, res) => {
    try {
        await db.collection('ingredients').doc(req.params.id).delete();
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;