const express = require('express');
const router = express.Router();
const db = require('../config/firebase');

// Manual schema validation function
function validateInvoiceItem(data) {
    const errors = [];
    if (!data.invoice_id) errors.push('invoice_id is required');
    if (!data.item_id) errors.push('item_id is required');
    if (typeof data.quantity !== 'number') errors.push('quantity is required and must be a number');
    if (typeof data.unit_price_at_sale !== 'number') errors.push('unit_price_at_sale is required and must be a number');
    if (typeof data.line_total !== 'number') errors.push('line_total is required and must be a number');
    // is_return and is_damage are optional booleans
    return errors;
}

// Create
router.post('/', async (req, res) => {
    const errors = validateInvoiceItem(req.body);
    if (errors.length) {
        return res.status(400).json({ errors });
    }
    try {
        const itemData = {
            invoice_id: req.body.invoice_id,
            item_id: req.body.item_id,
            quantity: req.body.quantity,
            unit_price_at_sale: req.body.unit_price_at_sale,
            line_total: req.body.line_total,
            is_return: typeof req.body.is_return === 'boolean' ? req.body.is_return : false,
            is_damage: typeof req.body.is_damage === 'boolean' ? req.body.is_damage : false,
            created_at: new Date(),
            updated_at: new Date()
        };
        const docRef = await db.collection('invoice_items').add(itemData);
        res.status(201).json({ id: docRef.id, ...itemData });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Read all
router.get('/', async (req, res) => {
    try {
        const snapshot = await db.collection('invoice_items').get();
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Read one
router.get('/:id', async (req, res) => {
    try {
        const doc = await db.collection('invoice_items').doc(req.params.id).get();
        if (!doc.exists) return res.status(404).json({ error: 'Not found' });
        res.json({ id: doc.id, ...doc.data() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update
router.put('/:id', async (req, res) => {
    const errors = validateInvoiceItem(req.body);
    if (errors.length) {
        return res.status(400).json({ errors });
    }
    try {
        const itemData = {
            invoice_id: req.body.invoice_id,
            item_id: req.body.item_id,
            quantity: req.body.quantity,
            unit_price_at_sale: req.body.unit_price_at_sale,
            line_total: req.body.line_total,
            is_return: typeof req.body.is_return === 'boolean' ? req.body.is_return : false,
            is_damage: typeof req.body.is_damage === 'boolean' ? req.body.is_damage : false,
            updated_at: new Date()
        };
        await db.collection('invoice_items').doc(req.params.id).update(itemData);
        const updatedDoc = await db.collection('invoice_items').doc(req.params.id).get();
        res.json({ id: updatedDoc.id, ...updatedDoc.data() });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete
router.delete('/:id', async (req, res) => {
    try {
        await db.collection('invoice_items').doc(req.params.id).delete();
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;