const express = require('express');
const router = express.Router();
const db = require('../config/firebase');

// Manual schema validation function
function validateDieselLog(data) {
    const errors = [];
    if (!data.date_of_issue) errors.push('date_of_issue is required');
    if (!data.route_or_destination) errors.push('route_or_destination is required');
    if (typeof data.litres_issued !== 'number') errors.push('litres_issued is required and must be a number');
    if (!data.captured_by_user_id) errors.push('captured_by_user_id is required');
    // driver_id, truck_id, diesel_price_per_litre, total_cost, notes, linked_delivery_id are optional
    return errors;
}

// Create
router.post('/', async (req, res) => {
    const errors = validateDieselLog(req.body);
    if (errors.length) {
        return res.status(400).json({ errors });
    }
    try {
        const dieselLogData = {
            date_of_issue: req.body.date_of_issue ? new Date(req.body.date_of_issue) : new Date(),
            driver_id: req.body.driver_id || null,
            truck_id: req.body.truck_id || null,
            route_or_destination: req.body.route_or_destination,
            litres_issued: req.body.litres_issued,
            diesel_price_per_litre: typeof req.body.diesel_price_per_litre === 'number' ? req.body.diesel_price_per_litre : null,
            total_cost: typeof req.body.total_cost === 'number' ? req.body.total_cost : null,
            notes: req.body.notes || null,
            captured_by_user_id: req.body.captured_by_user_id,
            linked_delivery_id: req.body.linked_delivery_id || null,
            created_at: new Date(),
            updated_at: new Date()
        };
        const docRef = await db.collection('diesel_logs').add(dieselLogData);
        res.status(201).json({ id: docRef.id, ...dieselLogData });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Read all
router.get('/', async (req, res) => {
    try {
        const snapshot = await db.collection('diesel_logs').get();
        const dieselLogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(dieselLogs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Read one
router.get('/:id', async (req, res) => {
    try {
        const doc = await db.collection('diesel_logs').doc(req.params.id).get();
        if (!doc.exists) return res.status(404).json({ error: 'Not found' });
        res.json({ id: doc.id, ...doc.data() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update
router.put('/:id', async (req, res) => {
    const errors = validateDieselLog(req.body);
    if (errors.length) {
        return res.status(400).json({ errors });
    }
    try {
        const dieselLogData = {
            date_of_issue: req.body.date_of_issue ? new Date(req.body.date_of_issue) : new Date(),
            driver_id: req.body.driver_id || null,
            truck_id: req.body.truck_id || null,
            route_or_destination: req.body.route_or_destination,
            litres_issued: req.body.litres_issued,
            diesel_price_per_litre: typeof req.body.diesel_price_per_litre === 'number' ? req.body.diesel_price_per_litre : null,
            total_cost: typeof req.body.total_cost === 'number' ? req.body.total_cost : null,
            notes: req.body.notes || null,
            captured_by_user_id: req.body.captured_by_user_id,
            linked_delivery_id: req.body.linked_delivery_id || null,
            updated_at: new Date()
        };
        await db.collection('diesel_logs').doc(req.params.id).update(dieselLogData);
        const updatedDoc = await db.collection('diesel_logs').doc(req.params.id).get();
        res.json({ id: updatedDoc.id, ...updatedDoc.data() });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete
router.delete('/:id', async (req, res) => {
    try {
        await db.collection('diesel_logs').doc(req.params.id).delete();
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;