const express = require('express');
const router = express.Router();
const db = require('../config/firebase');

// Manual schema validation function
function validateInvoice(data) {
    const errors = [];
    if (!data.invoice_number) errors.push('invoice_number is required');
    if (!data.customer_id) errors.push('customer_id is required');
    if (!data.delivery_date) errors.push('delivery_date is required');
    if (!data.payment_status || !['Paid', 'Unpaid', 'Partially Paid'].includes(data.payment_status)) {
        errors.push('payment_status is required and must be Paid, Unpaid, or Partially Paid');
    }
    if (!data.total_amount && data.total_amount !== 0) errors.push('total_amount is required');
    if (!data.created_by_user_id) errors.push('created_by_user_id is required');
    // Optional: payment_method, discount_amount, notes_or_reference, approved_by_user_id, linked_delivery_id, is_auto_generated
    return errors;
}

// Create
router.post('/', async (req, res) => {
    const errors = validateInvoice(req.body);
    if (errors.length) {
        return res.status(400).json({ errors });
    }
    try {
        const invoiceData = {
            invoice_number: req.body.invoice_number,
            customer_id: req.body.customer_id,
            delivery_date: req.body.delivery_date ? new Date(req.body.delivery_date) : new Date(),
            driver_id: req.body.driver_id || null,
            delivery_route: req.body.delivery_route || null,
            payment_status: req.body.payment_status,
            payment_method: req.body.payment_method || null,
            total_amount: req.body.total_amount,
            discount_amount: req.body.discount_amount || 0,
            notes_or_reference: req.body.notes_or_reference || '',
            created_by_user_id: req.body.created_by_user_id,
            approved_by_user_id: req.body.approved_by_user_id || null,
            linked_delivery_id: req.body.linked_delivery_id || null,
            is_auto_generated: typeof req.body.is_auto_generated === 'boolean' ? req.body.is_auto_generated : false,
            created_at: new Date(),
            updated_at: new Date()
        };
        const docRef = await db.collection('invoices').add(invoiceData);
        res.status(201).json({ id: docRef.id, ...invoiceData });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Read all
router.get('/', async (req, res) => {
    try {
        const snapshot = await db.collection('invoices').get();
        const invoices = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(invoices);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Read one
router.get('/:id', async (req, res) => {
    try {
        const doc = await db.collection('invoices').doc(req.params.id).get();
        if (!doc.exists) return res.status(404).json({ error: 'Not found' });
        res.json({ id: doc.id, ...doc.data() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update
router.put('/:id', async (req, res) => {
    const errors = validateInvoice(req.body);
    if (errors.length) {
        return res.status(400).json({ errors });
    }
    try {
        const invoiceData = {
            invoice_number: req.body.invoice_number,
            customer_id: req.body.customer_id,
            delivery_date: req.body.delivery_date ? new Date(req.body.delivery_date) : new Date(),
            driver_id: req.body.driver_id || null,
            delivery_route: req.body.delivery_route || null,
            payment_status: req.body.payment_status,
            payment_method: req.body.payment_method || null,
            total_amount: req.body.total_amount,
            discount_amount: req.body.discount_amount || 0,
            notes_or_reference: req.body.notes_or_reference || '',
            created_by_user_id: req.body.created_by_user_id,
            approved_by_user_id: req.body.approved_by_user_id || null,
            linked_delivery_id: req.body.linked_delivery_id || null,
            is_auto_generated: typeof req.body.is_auto_generated === 'boolean' ? req.body.is_auto_generated : false,
            updated_at: new Date()
        };
        await db.collection('invoices').doc(req.params.id).update(invoiceData);
        const updatedDoc = await db.collection('invoices').doc(req.params.id).get();
        res.json({ id: updatedDoc.id, ...updatedDoc.data() });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete
router.delete('/:id', async (req, res) => {
    try {
        await db.collection('invoices').doc(req.params.id).delete();
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;