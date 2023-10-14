const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Register a new user (patient or pharmacist)
router.post('/register', userController.registerPatient);

//submit a new request 
router.post('/submit',userController.createPendingPharmacist);

// Login user
router.post('/login', userController.loginUser);

// Get user profile
router.get('/profile', userController.getUserProfile);

// Add more routes for role-specific actions as needed

module.exports = router;
