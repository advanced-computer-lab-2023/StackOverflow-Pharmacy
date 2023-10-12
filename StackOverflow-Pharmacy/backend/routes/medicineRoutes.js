const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');

// Create a new medicine
router.post('/create', medicineController.createMedicine);

// Get all medicines
router.get('/all', medicineController.getAllMedicines);

// Get a specific medicine by ID
router.get('/:id', medicineController.getMedicineById);

// Update a medicine by ID
router.put('/:id/update', medicineController.updateMedicineById);

// Delete a medicine by ID
router.delete('/:id/delete', medicineController.deleteMedicineById);

module.exports = router;
