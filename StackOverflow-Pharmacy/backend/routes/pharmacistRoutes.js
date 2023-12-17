const express = require('express');
const router = express.Router();
const multer = require('multer');
const Pharmacist = require('../models/pharmacist')
const pharmacistController = require('../controllers/pharmacistController');
const {upload} = require('../middleware/upload');

// Define your pharmacist-related routes
router.post('/addmedicine', pharmacistController.addmedicine);
router.get('/medicines', pharmacistController.getAvailableMedicines);
router.get('/medicines/stats', pharmacistController.viewMedicineStats);
router.get('/medicines/search', pharmacistController.searchMedicineByName);
router.get('/medicines/medical-use', pharmacistController.filterMedicineByMedicalUse);
router.put('/medicines/edit', pharmacistController.editMedicine);
router.put('/medicines/add-quantity', pharmacistController.addQuantityToMedicine);
router.post('/medicines/archive/:medicineId', pharmacistController.archiveMedicine);
router.post('/medicines/unarchive/:medicineId', pharmacistController.unarchiveMedicine);
router.get('/total-sales/:month', pharmacistController.viewSales);
router.get('/total-sales/:month/:date/:medicineName', pharmacistController.viewSalesThree);
router.get('/notifications/:pharmacistId', pharmacistController.getAllNotifications);
router.post('/medicines/upload-image',upload.single('image'),pharmacistController.uploadMedicineImage);
router.post('/uploadID/:id',upload.single('image'),pharmacistController.uploadID);
router.post('/uploadPharmacyDegree/:id',upload.single('image'),pharmacistController.uploadPharmacyDegree);
router.post('/uploadWorkingLicences/:id',upload.single('image'),pharmacistController.uploadWorkingLicences);


module.exports = router;
