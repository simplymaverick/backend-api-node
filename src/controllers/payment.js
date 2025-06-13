const express = require('express');
const router = express.Router();
const db = require('../config/firebase');

// Manual schema validation function
function validatePayment(data) {
    const errors = [];
    if (!data.invoice_id) errors.push('invoice_id is required');
    if (!data.payment_date) errors.push('payment_date is required');
    if (typeof data.amount_paid !== 'number') errors.push('amount_paid is required and must be a number');
    if (!data.payment_method) errors.push('payment_method is required');
    if (!data.recorded_by_user_id) errors.push('recorded_by_user_id is required');
    return errors;
}

// Create
router.post('/', async (req, res) => {
    const errors = validatePayment(req.body);
    if (errors.length) {
        return res.status(400).json({ errors });
    }
    try {
        const paymentData = {
            invoice_id: req.body.invoice_id,
            payment_date: req.body.payment_date ? new Date(req.body.payment_date) : new Date(),
            amount_paid: req.body.amount_paid,
            payment_method: req.body.payment_method,
            recorded_by_user_id: req.body.recorded_by_user_id,
            created_at: new Date(),
            updated_at: new Date()
        };
        const docRef = await db.collection('payments').add(paymentData);
        res.status(201).json({ id: docRef.id, ...paymentData });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Read all
router.get('/', async (req, res) => {
    try {
        const snapshot = await db.collection('payments').get();
        const payments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(payments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Read one
router.get('/:id', async (req, res) => {
    try {
        const doc = await db.collection('payments').doc(req.params.id).get();
        if (!doc.exists) return res.status(404).json({ error: 'Not found' });
        res.json({ id: doc.id, ...doc.data() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update
router.put('/:id', async (req, res) => {
    const errors = validatePayment(req.body);
    if (errors.length) {
        return res.status(400).json({ errors });
    }
    try {
        const paymentData = {
            invoice_id: req.body.invoice_id,
            payment_date: req.body.payment_date ? new Date(req.body.payment_date) : new Date(),
            amount_paid: req.body.amount_paid,
            payment_method: req.body.payment_method,
            recorded_by_user_id: req.body.recorded_by_user_id,
            updated_at: new Date()
        };
        await db.collection('payments').doc(req.params.id).update(paymentData);
        const updatedDoc = await db.collection('payments').doc(req.params.id).get();
        res.json({ id: updatedDoc.id, ...updatedDoc.data() });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete
router.delete('/:id', async (req, res) => {
    try {
        await db.collection('payments').doc(req.params.id).delete();
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;