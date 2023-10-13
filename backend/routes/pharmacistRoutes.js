const express = require('express');
const router = express.Router();
const pharmacistController = require('../controllers/pharmacistController');

// Define your pharmacist-related routes
router.post('/addmedicine', pharmacistController.addmedicine);
router.get('/medicines', pharmacistController.getAvailableMedicines);
router.get('/medicines/stats', pharmacistController.viewMedicineStats);
router.get('/medicines/search', pharmacistController.searchMedicineByName);
router.get('/medicines/medical-use', pharmacistController.filterMedicineByMedicalUse);
router.put('/medicines/edit', pharmacistController.editMedicine);
router.put('/medicines/add-quantity', pharmacistController.addQuantityToMedicine);

module.exports = router;
