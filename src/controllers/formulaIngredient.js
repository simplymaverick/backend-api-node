const express = require('express');
const router = express.Router();
const db = require('../config/firebase');

// Manual schema validation function
function validateFormulaIngredient(data) {
    const errors = [];
    if (!data.formula_id) errors.push('formula_id is required');
    if (!data.item_id) errors.push('item_id is required');
    if (typeof data.quantity_per_bake !== 'number') errors.push('quantity_per_bake is required and must be a number');
    if (!data.unit_of_measure) errors.push('unit_of_measure is required');
    return errors;
}

// Create
router.post('/', async (req, res) => {
    const errors = validateFormulaIngredient(req.body);
    if (errors.length) {
        return res.status(400).json({ errors });
    }
    try {
        const formulaIngredientData = {
            formula_id: req.body.formula_id,
            item_id: req.body.item_id,
            quantity_per_bake: req.body.quantity_per_bake,
            unit_of_measure: req.body.unit_of_measure,
            created_at: new Date(),
            updated_at: new Date()
        };
        const docRef = await db.collection('formula_ingredients').add(formulaIngredientData);
        res.status(201).json({ id: docRef.id, ...formulaIngredientData });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Read all
router.get('/', async (req, res) => {
    try {
        const snapshot = await db.collection('formula_ingredients').get();
        const formulaIngredients = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(formulaIngredients);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Read one
router.get('/:id', async (req, res) => {
    try {
        const doc = await db.collection('formula_ingredients').doc(req.params.id).get();
        if (!doc.exists) return res.status(404).json({ error: 'Not found' });
        res.json({ id: doc.id, ...doc.data() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update
router.put('/:id', async (req, res) => {
    const errors = validateFormulaIngredient(req.body);
    if (errors.length) {
        return res.status(400).json({ errors });
    }
    try {
        const formulaIngredientData = {
            formula_id: req.body.formula_id,
            item_id: req.body.item_id,
            quantity_per_bake: req.body.quantity_per_bake,
            unit_of_measure: req.body.unit_of_measure,
            updated_at: new Date()
        };
        await db.collection('formula_ingredients').doc(req.params.id).update(formulaIngredientData);
        const updatedDoc = await db.collection('formula_ingredients').doc(req.params.id).get();
        res.json({ id: updatedDoc.id, ...updatedDoc.data() });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete
router.delete('/:id', async (req, res) => {
    try {
        await db.collection('formula_ingredients').doc(req.params.id).delete();
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;