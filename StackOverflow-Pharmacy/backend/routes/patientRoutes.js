const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { isLoggedIn } = require('../middleware/auth');

// Public route: Get the list of available medicines (no authentication required)
router.get('/medicines', patientController.getAvailableMedicines);
router.get('/medicines/filter', patientController.filterMedicineByMedicalUse);
router.get('/medicines/search', patientController.searchMedicineByName);

// Other routes that require authentication

router.post('/medicines/cart/:medicineId', isLoggedIn, patientController.addToCart);
router.get('/cart/:userId', isLoggedIn, patientController.getPatientCart);
router.put('/medicines/cart/adjust/:medicineId', isLoggedIn, patientController.adjustQuantity);
router.delete('/medicines/cart/:medicineId', isLoggedIn, patientController.removeFromCart);
router.get('/:userId/addresses', isLoggedIn, patientController.getDeliveryAddress);
router.post('/update-delivery-address', isLoggedIn, patientController.updateDeliveryAddress);
router.post('/save-selected-address', isLoggedIn, patientController.saveSelectedAddress);
router.post('/create-order', isLoggedIn, patientController.createOrder);
router.get('/orders/:orderId', isLoggedIn, patientController.getOrderById);
router.put('/orders/:orderId/cancel', isLoggedIn, patientController.cancelOrder);

module.exports = router;
