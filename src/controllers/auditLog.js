const express = require('express');
const router = express.Router();
const db = require('../config/firebase');

// Manual schema validation function
function validateAuditLog(data) {
    const errors = [];
    if (!data.user_id) errors.push('user_id is required');
    if (!data.action_type) errors.push('action_type is required');
    if (!data.table_name) errors.push('table_name is required');
    if (typeof data.record_id !== 'number') errors.push('record_id is required and must be a number');
    // old_values and new_values are optional (can be any type)
    // timestamp is optional (will be set automatically)
    return errors;
}

// Create
router.post('/', async (req, res) => {
    const errors = validateAuditLog(req.body);
    if (errors.length) {
        return res.status(400).json({ errors });
    }
    try {
        const auditLogData = {
            user_id: req.body.user_id,
            action_type: req.body.action_type,
            table_name: req.body.table_name,
            record_id: req.body.record_id,
            old_values: req.body.old_values || null,
            new_values: req.body.new_values || null,
            timestamp: req.body.timestamp ? new Date(req.body.timestamp) : new Date(),
            created_at: new Date(),
            updated_at: new Date()
        };
        const docRef = await db.collection('audit_logs').add(auditLogData);
        res.status(201).json({ id: docRef.id, ...auditLogData });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Read all
router.get('/', async (req, res) => {
    try {
        const snapshot = await db.collection('audit_logs').get();
        const auditLogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(auditLogs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Read one
router.get('/:id', async (req, res) => {
    try {
        const doc = await db.collection('audit_logs').doc(req.params.id).get();
        if (!doc.exists) return res.status(404).json({ error: 'Not found' });
        res.json({ id: doc.id, ...doc.data() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update
router.put('/:id', async (req, res) => {
    const errors = validateAuditLog(req.body);
    if (errors.length) {
        return res.status(400).json({ errors });
    }
    try {
        const auditLogData = {
            user_id: req.body.user_id,
            action_type: req.body.action_type,
            table_name: req.body.table_name,
            record_id: req.body.record_id,
            old_values: req.body.old_values || null,
            new_values: req.body.new_values || null,
            timestamp: req.body.timestamp ? new Date(req.body.timestamp) : new Date(),
            updated_at: new Date()
        };
        await db.collection('audit_logs').doc(req.params.id).update(auditLogData);
        const updatedDoc = await db.collection('audit_logs').doc(req.params.id).get();
        res.json({ id: updatedDoc.id, ...updatedDoc.data() });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete
router.delete('/:id', async (req, res) => {
    try {
        await db.collection('audit_logs').doc(req.params.id).delete();
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;