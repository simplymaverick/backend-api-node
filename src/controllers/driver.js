const express = require('express');
const router = express.Router();
const db = require('../config/firebase');

// Manual schema validation function
function validateDriver(data) {
    const errors = [];
    if (!data.driver_name) errors.push('driver_name is required');
    if (typeof data.commission_rate_per_loaf !== 'number') errors.push('commission_rate_per_loaf is required and must be a number');
    // employee_id is optional
    return errors;
}

// Create
router.post('/', async (req, res) => {
    const errors = validateDriver(req.body);
    if (errors.length) {
        return res.status(400).json({ errors });
    }
    try {
        const driverData = {
            driver_name: req.body.driver_name,
            employee_id: req.body.employee_id || null,
            commission_rate_per_loaf: req.body.commission_rate_per_loaf,
            created_at: new Date(),
            updated_at: new Date()
        };
        const docRef = await db.collection('drivers').add(driverData);
        res.status(201).json({ id: docRef.id, ...driverData });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Read all
router.get('/', async (req, res) => {
    try {
        const snapshot = await db.collection('drivers').get();
        const drivers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(drivers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Read one
router.get('/:id', async (req, res) => {
    try {
        const doc = await db.collection('drivers').doc(req.params.id).get();
        if (!doc.exists) return res.status(404).json({ error: 'Not found' });
        res.json({ id: doc.id, ...doc.data() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update
router.put('/:id', async (req, res) => {
    const errors = validateDriver(req.body);
    if (errors.length) {
        return res.status(400).json({ errors });
    }
    try {
        const driverData = {
            driver_name: req.body.driver_name,
            employee_id: req.body.employee_id || null,
            commission_rate_per_loaf: req.body.commission_rate_per_loaf,
            updated_at: new Date()
        };
        await db.collection('drivers').doc(req.params.id).update(driverData);
        const updatedDoc = await db.collection('drivers').doc(req.params.id).get();
        res.json({ id: updatedDoc.id, ...updatedDoc.data() });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete
router.delete('/:id', async (req, res) => {
    try {
        await db.collection('drivers').doc(req.params.id).delete();
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;