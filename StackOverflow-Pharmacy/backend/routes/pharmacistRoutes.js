const express = require('express');
const router = express.Router();
const multer = require('multer');
const Pharmacist = require('../models/pharmacist')
const pharmacistController = require('../controllers/pharmacistController');

// Define your pharmacist-related routes
router.post('/addmedicine', pharmacistController.addmedicine);
router.get('/medicines', pharmacistController.getAvailableMedicines);
router.get('/medicines/stats', pharmacistController.viewMedicineStats);
router.get('/medicines/search', pharmacistController.searchMedicineByName);
router.get('/medicines/medical-use', pharmacistController.filterMedicineByMedicalUse);
router.put('/medicines/edit', pharmacistController.editMedicine);
router.put('/medicines/add-quantity', pharmacistController.addQuantityToMedicine);
router.post('/medicines/upload-image', pharmacistController.uploadMedicineImage);
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Specify the directory where uploaded files will be stored
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + '.pdf'); // Ensure the file has a unique name
    },
  });
const upload = multer({ storage: storage });

router.post('/upload-documents', upload.fields([{ name: 'pharmacyDegree', maxCount: 1 }, { name: 'workingLicense', maxCount: 1 }, { name: 'idDocument', maxCount: 1 }]), async (req, res) => {
    try {
      const pharmacistId = req.user._id; // Use the ID of the authenticated pharmacist
  
      const pharmacyDegreeFilePath = req.files.pharmacyDegree[0].path;
      const workingLicenseFilePath = req.files.workingLicense[0].path;
      const idDocumentFilePath = req.files.idDocument[0].path;
  
      // Update the pharmacist's document fields in the database, including PharmacistId and ID document path
      await Pharmacist.findByIdAndUpdate(pharmacistId, {
        pharmacyDegree: pharmacyDegreeFilePath,
        workingLicense: workingLicenseFilePath,
        PharmacistId: req.user.PharmacistId,
        idDocument: idDocumentFilePath,
      });
  
      res.status(200).json({ message: 'Documents uploaded successfully' });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'An error occurred while uploading documents' });
    }
  }); 
module.exports = router;
