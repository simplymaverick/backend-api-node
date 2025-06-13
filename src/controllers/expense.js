const express = require('express');
const router = express.Router();
const db = require('../config/firebase');

// Manual schema validation function
function validateExpense(data) {
    const errors = [];
    if (!data.date_of_expense) errors.push('date_of_expense is required');
    if (!data.description) errors.push('description is required');
    if (typeof data.amount !== 'number') errors.push('amount is required and must be a number');
    if (!data.payment_method || !['Cash', 'EFT'].includes(data.payment_method)) {
        errors.push('payment_method is required and must be "Cash" or "EFT"');
    }
    if (!data.expense_category) errors.push('expense_category is required');
    if (!data.recorded_by_user_id) errors.push('recorded_by_user_id is required');
    // supplier_name, sub_category, branch_id, truck_id, receipt_attachment_path are optional
    // is_flagged_for_review is optional, default to false
    return errors;
}

// Create
router.post('/', async (req, res) => {
    const errors = validateExpense(req.body);
    if (errors.length) {
        return res.status(400).json({ errors });
    }
    try {
        const expenseData = {
            date_of_expense: req.body.date_of_expense ? new Date(req.body.date_of_expense) : new Date(),
            description: req.body.description,
            amount: req.body.amount,
            payment_method: req.body.payment_method,
            supplier_name: req.body.supplier_name || null,
            expense_category: req.body.expense_category,
            sub_category: req.body.sub_category || null,
            branch_id: req.body.branch_id || null,
            truck_id: req.body.truck_id || null,
            recorded_by_user_id: req.body.recorded_by_user_id,
            receipt_attachment_path: req.body.receipt_attachment_path || null,
            is_flagged_for_review: typeof req.body.is_flagged_for_review === 'boolean' ? req.body.is_flagged_for_review : false,
            created_at: new Date(),
            updated_at: new Date()
        };
        const docRef = await db.collection('expenses').add(expenseData);
        res.status(201).json({ id: docRef.id, ...expenseData });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Read all
router.get('/', async (req, res) => {
    try {
        const snapshot = await db.collection('expenses').get();
        const expenses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Read one
router.get('/:id', async (req, res) => {
    try {
        const doc = await db.collection('expenses').doc(req.params.id).get();
        if (!doc.exists) return res.status(404).json({ error: 'Not found' });
        res.json({ id: doc.id, ...doc.data() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update
router.put('/:id', async (req, res) => {
    const errors = validateExpense(req.body);
    if (errors.length) {
        return res.status(400).json({ errors });
    }
    try {
        const expenseData = {
            date_of_expense: req.body.date_of_expense ? new Date(req.body.date_of_expense) : new Date(),
            description: req.body.description,
            amount: req.body.amount,
            payment_method: req.body.payment_method,
            supplier_name: req.body.supplier_name || null,
            expense_category: req.body.expense_category,
            sub_category: req.body.sub_category || null,
            branch_id: req.body.branch_id || null,
            truck_id: req.body.truck_id || null,
            recorded_by_user_id: req.body.recorded_by_user_id,
            receipt_attachment_path: req.body.receipt_attachment_path || null,
            is_flagged_for_review: typeof req.body.is_flagged_for_review === 'boolean' ? req.body.is_flagged_for_review : false,
            updated_at: new Date()
        };
        await db.collection('expenses').doc(req.params.id).update(expenseData);
        const updatedDoc = await db.collection('expenses').doc(req.params.id).get();
        res.json({ id: updatedDoc.id, ...updatedDoc.data() });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete
router.delete('/:id', async (req, res) => {
    try {
        await db.collection('expenses').doc(req.params.id).delete();
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;