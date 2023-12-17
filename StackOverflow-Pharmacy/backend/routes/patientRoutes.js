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
router.delete('/medicines/cart/:userId', isLoggedIn, patientController.removePatientCart);
router.put('/medicines/cart/adjust/:medicineId', isLoggedIn, patientController.adjustQuantity);
router.delete('/medicines/cartRemove/:medicineId', isLoggedIn, patientController.removeFromCart);
router.get('/:userId/addresses', isLoggedIn, patientController.getDeliveryAddress);
router.post('/update-delivery-address', isLoggedIn, patientController.updateDeliveryAddress);
router.post('/save-selected-address', isLoggedIn, patientController.saveSelectedAddress);
router.post('/create-order', isLoggedIn, patientController.createOrder);
router.get('/orders/user/:userId', isLoggedIn, patientController.getOrdersByUserId);
router.put('/orders/:orderId/cancel', isLoggedIn, patientController.cancelOrder);
router.get('/alternativeMedicines/:id', isLoggedIn, patientController.getAlternativeMedicines);
router.post('/addPrescription', isLoggedIn, patientController.addPrescription);
router.get('/prescriptionMedicines/:userId', isLoggedIn, patientController.getPrescriptionMedicines);
router.post('/payWithWallet', isLoggedIn, patientController.payWithWallet);
router.post('/payWithStripe', patientController.payWithStripe);

module.exports = router;