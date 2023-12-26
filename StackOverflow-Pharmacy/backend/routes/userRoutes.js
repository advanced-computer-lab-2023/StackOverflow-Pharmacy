const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isLoggedIn } = require('../middleware/auth');

// Register a new user (patient or pharmacist)
router.post('/register', userController.registerPatient);

// Submit a new request
router.post('/submit', userController.createPendingPharmacist);

router.post('/PharmacistSignUp', userController.pharmacistSignup);
router.post('/PatientSignUp', userController.patientSignup);

// Apply isLoggedIn middleware to routes that require authentication
router.post('/login', userController.login);
router.post('/getData',  userController.getData);
router.get('/profile', isLoggedIn, userController.getUserProfile);
router.post('/logout', userController.logout);

// Routes for password reset
router.post('/changePassword/:userId', isLoggedIn, userController.changePassword);
router.post('/forgotPassword', userController.forgotPassword);
router.post('/checkOTP', userController.checkOTP);
router.post('/updatePassword', userController.updatePassword);
router.get('/getChats', userController.getChats);
router.get('/getUsername', userController.getUserName);
router.get('/getWallet', userController.getWallet);
router.post('/sendmessage', userController.sendMessage);
router.post('/createChat', userController.createchat);
router.post('/searchToChat', userController.searchToChat);

// Add more routes for role-specific actions as needed

// Add more routes for role-specific actions as needed

module.exports = router;
