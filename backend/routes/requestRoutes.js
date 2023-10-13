const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');

// Create a new request
router.post('/create', requestController.createRequest);

// Get all requests
router.get('/all', requestController.getAllRequests);

// Get a specific request by ID
router.get('/:id', requestController.getRequestById);

// Update a request by ID
router.put('/:id/update', requestController.updateRequestById);

// Delete a request by ID
router.delete('/:id/delete', requestController.deleteRequestById);

module.exports = router;
