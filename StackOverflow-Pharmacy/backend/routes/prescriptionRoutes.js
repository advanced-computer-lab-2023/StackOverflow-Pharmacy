const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');

// Create a new prescription
router.post('/create', prescriptionController.createPrescription);

// Get all prescriptions
router.get('/all', prescriptionController.getAllPrescriptions);

// Get a specific prescription by ID
router.get('/:id', prescriptionController.getPrescriptionById);

// Update a prescription by ID
router.put('/:id/update', prescriptionController.updatePrescriptionById);

// Delete a prescription by ID
router.delete('/:id/delete', prescriptionController.deletePrescriptionById);
/************************************************************************************************************** */
module.exports = router;
