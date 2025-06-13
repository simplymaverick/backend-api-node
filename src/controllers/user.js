const express = require('express');
const router = express.Router();
const db = require('../config/firebase');

// User fields
const userFields = [
    'username',
    'password_hash',
    'email',
    'role',
    'first_name',
    'last_name',
    'created_at',
    'updated_at'
];

// Manual schema validation function
function validateUser(data) {
    const errors = [];
    if (!data.username) errors.push('username is required');
    if (!data.password_hash) errors.push('password_hash is required');
    if (!data.email) errors.push('email is required');
    if (!data.role) errors.push('role is required');
    return errors;
}

// Helper to pick allowed fields and set timestamps
function buildUserData(body, isNew = false) {
    const data = {};
    userFields.forEach(field => {
        if (body[field] !== undefined) data[field] = body[field];
    });
    const now = new Date();
    if (isNew) data.created_at = now;
    data.updated_at = now;
    return data;
}

// Create
router.post('/', async (req, res) => {
    const errors = validateUser(req.body);
    if (errors.length) {
        return res.status(400).json({ errors });
    }
    try {
        const userData = buildUserData(req.body, true);
        const docRef = await db.collection('users').add(userData);
        res.status(201).json({ id: docRef.id, ...userData });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Read all
router.get('/', async (req, res) => {
    try {
        const snapshot = await db.collection('users').get();
        const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Read one
router.get('/:id', async (req, res) => {
    try {
        const doc = await db.collection('users').doc(req.params.id).get();
        if (!doc.exists) return res.status(404).json({ error: 'Not found' });
        res.json({ id: doc.id, ...doc.data() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update
router.put('/:id', async (req, res) => {
    const errors = validateUser(req.body);
    if (errors.length) {
        return res.status(400).json({ errors });
    }
    try {
        const userData = buildUserData(req.body);
        await db.collection('users').doc(req.params.id).update(userData);
        const updatedDoc = await db.collection('users').doc(req.params.id).get();
        res.json({ id: updatedDoc.id, ...updatedDoc.data() });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete
router.delete('/:id', async (req, res) => {
    try {
        await db.collection('users').doc(req.params.id).delete();
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;