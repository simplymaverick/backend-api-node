const express = require('express');
const router = express.Router();
const db = require('../config/firebase');

// Manual schema validation function
function validateDriverDelivery(data) {
    const errors = [];
    if (!data.driver_id) errors.push('driver_id is required');
    if (!data.truck_id) errors.push('truck_id is required');
    if (!data.delivery_date) errors.push('delivery_date is required');
    if (!data.route_name) errors.push('route_name is required');
    if (typeof data.total_loaves_loaded !== 'number') errors.push('total_loaves_loaded is required and must be a number');
    if (typeof data.total_loaves_returned !== 'number') errors.push('total_loaves_returned is required and must be a number');
    if (typeof data.expected_revenue !== 'number') errors.push('expected_revenue is required and must be a number');
    if (typeof data.actual_cash_received !== 'number') errors.push('actual_cash_received is required and must be a number');
    if (!data.finance_officer_user_id) errors.push('finance_officer_user_id is required');
    // discrepancy_alert is optional, default to false
    return errors;
}

// Create
router.post('/', async (req, res) => {
    const errors = validateDriverDelivery(req.body);
    if (errors.length) {
        return res.status(400).json({ errors });
    }
    try {
        const deliveryData = {
            driver_id: req.body.driver_id,
            truck_id: req.body.truck_id,
            delivery_date: req.body.delivery_date ? new Date(req.body.delivery_date) : new Date(),
            route_name: req.body.route_name,
            total_loaves_loaded: req.body.total_loaves_loaded,
            total_loaves_returned: req.body.total_loaves_returned,
            expected_revenue: req.body.expected_revenue,
            actual_cash_received: req.body.actual_cash_received,
            discrepancy_alert: typeof req.body.discrepancy_alert === 'boolean' ? req.body.discrepancy_alert : false,
            finance_officer_user_id: req.body.finance_officer_user_id,
            created_at: new Date(),
            updated_at: new Date()
        };
        const docRef = await db.collection('driver_deliveries').add(deliveryData);
        res.status(201).json({ id: docRef.id, ...deliveryData });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Read all
router.get('/', async (req, res) => {
    try {
        const snapshot = await db.collection('driver_deliveries').get();
        const deliveries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(deliveries);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Read one
router.get('/:id', async (req, res) => {
    try {
        const doc = await db.collection('driver_deliveries').doc(req.params.id).get();
        if (!doc.exists) return res.status(404).json({ error: 'Not found' });
        res.json({ id: doc.id, ...doc.data() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update
router.put('/:id', async (req, res) => {
    const errors = validateDriverDelivery(req.body);
    if (errors.length) {
        return res.status(400).json({ errors });
    }
    try {
        const deliveryData = {
            driver_id: req.body.driver_id,
            truck_id: req.body.truck_id,
            delivery_date: req.body.delivery_date ? new Date(req.body.delivery_date) : new Date(),
            route_name: req.body.route_name,
            total_loaves_loaded: req.body.total_loaves_loaded,
            total_loaves_returned: req.body.total_loaves_returned,
            expected_revenue: req.body.expected_revenue,
            actual_cash_received: req.body.actual_cash_received,
            discrepancy_alert: typeof req.body.discrepancy_alert === 'boolean' ? req.body.discrepancy_alert : false,
            finance_officer_user_id: req.body.finance_officer_user_id,
            updated_at: new Date()
        };
        await db.collection('driver_deliveries').doc(req.params.id).update(deliveryData);
        const updatedDoc = await db.collection('driver_deliveries').doc(req.params.id).get();
        res.json({ id: updatedDoc.id, ...updatedDoc.data() });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete
router.delete('/:id', async (req, res) => {
    try {
        await db.collection('driver_deliveries').doc(req.params.id).delete();
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;