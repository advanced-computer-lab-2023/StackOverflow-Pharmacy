const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

// Search for medicines by name
router.get('/medicines/filter', patientController.filterMedicineByMedicalUse);
router.get('/medicines/search', patientController.searchMedicineByName);
router.get('/medicines', patientController.getAvailableMedicines);

// Search for a specific medicine by name


// Filter medicines by medical use

module.exports = router;
