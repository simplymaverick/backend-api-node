const express = require('express');
const router = express.Router();

// Import controllers
const userController = require('../controllers/user');
const supplierController = require('../controllers/supplier');
const ingredientController = require('../controllers/ingredient');
const purchaseOrderController = require('../controllers/purchaseOrder');
const purchaseOrderItemController = require('../controllers/purchaseOrderItem');
const grvController = require('../controllers/grv');
const grvItemController = require('../controllers/grvItem');
const stockLedgerController = require('../controllers/stockLedger');
const productionBatchController = require('../controllers/productionBatch');
const productionBatchIngredientController = require('../controllers/productionBatchIngredient');
const driverController = require('../controllers/driver');
const truckController = require('../controllers/truck');
const driverDeliveryController = require('../controllers/driverDelivery');
const driverDeliveryItemController = require('../controllers/driverDeliveryItem');
const dieselLogController = require('../controllers/dieselLog');
const expenseController = require('../controllers/expense');
const customerController = require('../controllers/customer');
const customerPriceListController = require('../controllers/customerPriceList');
const invoiceController = require('../controllers/invoice');
const invoiceItemController = require('../controllers/invoiceItem');
const paymentController = require('../controllers/payment');
const auditLogController = require('../controllers/auditLog');
const formulaController = require('../controllers/formula');
const formulaIngredientController = require('../controllers/formulaIngredient');

// Define routes
router.use('/users', userController);
router.use('/suppliers', supplierController);
router.use('/ingredients', ingredientController);
router.use('/purchase-orders', purchaseOrderController);
router.use('/purchase-order-items', purchaseOrderItemController);
router.use('/grvs', grvController);
router.use('/grv-items', grvItemController);
router.use('/stock-ledgers', stockLedgerController);
router.use('/production-batches', productionBatchController);
router.use('/production-batch-ingredients', productionBatchIngredientController);
router.use('/drivers', driverController);
router.use('/trucks', truckController);
router.use('/driver-deliveries', driverDeliveryController);
router.use('/driver-delivery-items', driverDeliveryItemController);
router.use('/diesel-logs', dieselLogController);
router.use('/expenses', expenseController);
router.use('/customers', customerController);
router.use('/customer-price-lists', customerPriceListController);
router.use('/invoices', invoiceController);
router.use('/invoice-items', invoiceItemController);
router.use('/payments', paymentController);
router.use('/audit-logs', auditLogController);
router.use('/formulas', formulaController);
router.use('/formula-ingredients', formulaIngredientController);

module.exports = router;