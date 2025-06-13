const express = require('express');
const router = express.Router();
const db = require('../config/firebase');

// Manual schema validation function
function validateFormula(data) {
    const errors = [];
    if (!data.formula_name) errors.push('formula_name is required');
    // description is optional
    return errors;
}

// Create
router.post('/', async (req, res) => {
    const errors = validateFormula(req.body);
    if (errors.length) {
        return res.status(400).json({ errors });
    }
    try {
        const formulaData = {
            formula_name: req.body.formula_name,
            description: req.body.description || null,
            created_at: new Date(),
            updated_at: new Date()
        };
        const docRef = await db.collection('formulas').add(formulaData);
        res.status(201).json({ id: docRef.id, ...formulaData });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Read all
router.get('/', async (req, res) => {
    try {
        const snapshot = await db.collection('formulas').get();
        const formulas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(formulas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Read one
router.get('/:id', async (req, res) => {
    try {
        const doc = await db.collection('formulas').doc(req.params.id).get();
        if (!doc.exists) return res.status(404).json({ error: 'Not found' });
        res.json({ id: doc.id, ...doc.data() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update
router.put('/:id', async (req, res) => {
    const errors = validateFormula(req.body);
    if (errors.length) {
        return res.status(400).json({ errors });
    }
    try {
        const formulaData = {
            formula_name: req.body.formula_name,
            description: req.body.description || null,
            updated_at: new Date()
        };
        await db.collection('formulas').doc(req.params.id).update(formulaData);
        const updatedDoc = await db.collection('formulas').doc(req.params.id).get();
        res.json({ id: updatedDoc.id, ...updatedDoc.data() });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete
router.delete('/:id', async (req, res) => {
    try {
        await db.collection('formulas').doc(req.params.id).delete();
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;