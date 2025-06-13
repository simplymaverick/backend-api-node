const express = require('express');
const router = express.Router();
const db = require('../config/firebase');

// Manual schema validation function
function validateProductionBatchIngredient(data) {
    const errors = [];
    if (!data.production_batch_id) errors.push('production_batch_id is required');
    if (!data.item_id) errors.push('item_id is required');
    if (typeof data.quantity_used !== 'number') errors.push('quantity_used is required and must be a number');
    return errors;
}

// Create
router.post('/', async (req, res) => {
    const errors = validateProductionBatchIngredient(req.body);
    if (errors.length) {
        return res.status(400).json({ errors });
    }
    try {
        const ingredientData = {
            production_batch_id: req.body.production_batch_id,
            item_id: req.body.item_id,
            quantity_used: req.body.quantity_used,
            created_at: new Date(),
            updated_at: new Date()
        };
        const docRef = await db.collection('production_batch_ingredients').add(ingredientData);
        res.status(201).json({ id: docRef.id, ...ingredientData });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Read all
router.get('/', async (req, res) => {
    try {
        const snapshot = await db.collection('production_batch_ingredients').get();
        const ingredients = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(ingredients);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Read one
router.get('/:id', async (req, res) => {
    try {
        const doc = await db.collection('production_batch_ingredients').doc(req.params.id).get();
        if (!doc.exists) return res.status(404).json({ error: 'Not found' });
        res.json({ id: doc.id, ...doc.data() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update
router.put('/:id', async (req, res) => {
    const errors = validateProductionBatchIngredient(req.body);
    if (errors.length) {
        return res.status(400).json({ errors });
    }
    try {
        const ingredientData = {
            production_batch_id: req.body.production_batch_id,
            item_id: req.body.item_id,
            quantity_used: req.body.quantity_used,
            updated_at: new Date()
        };
        await db.collection('production_batch_ingredients').doc(req.params.id).update(ingredientData);
        const updatedDoc = await db.collection('production_batch_ingredients').doc(req.params.id).get();
        res.json({ id: updatedDoc.id, ...updatedDoc.data() });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete
router.delete('/:id', async (req, res) => {
    try {
        await db.collection('production_batch_ingredients').doc(req.params.id).delete();
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;