const express = require('express');
const router = express.Router();
const db = require('../config/firebase');
const { comparePasswords, generateToken } = require('../utils/helpers');

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const snapshot = await db.collection('users').where('username', '==', username).get();
        if (snapshot.empty) return res.status(401).json({ error: 'Invalid credentials' });
        const userDoc = snapshot.docs[0];
        const user = userDoc.data();
        // const valid = await comparePasswords(password, user.password_hash);
        const valid = password === user.password_hash;
        if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
        const token = generateToken({ user_id: userDoc.id, role: user.role });
        res.json({ token, user: { id: userDoc.id, ...user } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;