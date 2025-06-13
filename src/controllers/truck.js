const express = require('express');
const router = express.Router();
const db = require('../config/firebase');

// Manual schema validation function
function validateTruck(data) {
    const errors = [];
    if (!data.truck_number) errors.push('truck_number is required');
    if (!data.license_plate) errors.push('license_plate is required');
    // route_assigned is optional
    return errors;
}

// Create
router.post('/', async (req, res) => {
    const errors = validateTruck(req.body);
    if (errors.length) {
        return res.status(400).json({ errors });
    }
    try {
        const truckData = {
            truck_number: req.body.truck_number,
            license_plate: req.body.license_plate,
            route_assigned: req.body.route_assigned || null,
            created_at: new Date(),
            updated_at: new Date()
        };
        const docRef = await db.collection('trucks').add(truckData);
        res.status(201).json({ id: docRef.id, ...truckData });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Read all
router.get('/', async (req, res) => {
    try {
        const snapshot = await db.collection('trucks').get();
        const trucks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(trucks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Read one
router.get('/:id', async (req, res) => {
    try {
        const doc = await db.collection('trucks').doc(req.params.id).get();
        if (!doc.exists) return res.status(404).json({ error: 'Not found' });
        res.json({ id: doc.id, ...doc.data() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update
router.put('/:id', async (req, res) => {
    const errors = validateTruck(req.body);
    if (errors.length) {
        return res.status(400).json({ errors });
    }
    try {
        const truckData = {
            truck_number: req.body.truck_number,
            license_plate: req.body.license_plate,
            route_assigned: req.body.route_assigned || null,
            updated_at: new Date()
        };
        await db.collection('trucks').doc(req.params.id).update(truckData);
        const updatedDoc = await db.collection('trucks').doc(req.params.id).get();
        res.json({ id: updatedDoc.id, ...updatedDoc.data() });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete
router.delete('/:id', async (req, res) => {
    try {
        await db.collection('trucks').doc(req.params.id).delete();
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;