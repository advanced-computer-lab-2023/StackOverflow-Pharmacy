const express = require('express');
const router = express.Router();

const administratorController = require('../controllers/administratorController');

// Create a new administrator
router.post('/addadmin', administratorController.addadmin);

// Remove a pharmacist by ID
router.delete('/pharmacist/:id', administratorController.removePharmacist);

// Remove a patient by ID
router.delete('/patient/:id', administratorController.removePatient);

// Get basic information of a patient
router.get('/patient/basic-info/:id', administratorController.getPatientBasicInfo);

// Get information of a pharmacist by ID
router.get('/pharmacist/:id', administratorController.getPharmacistInfo);

// Search for medicines by name
router.get('/medicines/search', administratorController.searchMedicineByName);

// Filter medicines by medical use
router.get('/medicines/filter', administratorController.filterMedicineByMedicalUse);

// Get available medicines by name
router.get('/medicines/available', administratorController.getAvailableMedicines);

//view a pharmacist request
router.get('/reuests', administratorController.getReuesst);

router.post('/accept/', administratorController.acceptPharmacistRequest);

router.post('/reject/', administratorController.rejectPharmacistRequest);
router.get('/viewPharmacist', administratorController.viewPharmacist);
// User login
router.post('/login', administratorController.login);

// Get user data
router.get('/user', administratorController.getData);

// User logout
router.post('/logout', administratorController.logout);

module.exports = router;