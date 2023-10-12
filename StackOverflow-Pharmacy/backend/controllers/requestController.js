const Request = require('../models/requestModel');

// Create a new request
const createRequest = async (req, res) => {
  try {
    const { medicID, ID, degree, licenses, status } = req.body;

    // Create a new request document
    const newRequest = new Request({
      medicID,
      ID,
      degree,
      licenses,
      status,
    });

    await newRequest.save();

    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ error: 'Could not create request' });
  }
};

// Get all requests
const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find();
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch requests' });
  }
};

// Get a specific request by ID
const getRequestById = async (req, res) => {
  try {
    const requestId = req.params.id;
    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch request' });
  }
};

// Update a request by ID
const updateRequestById = async (req, res) => {
  try {
    const requestId = req.params.id;
    const { status } = req.body;

    const request = await Request.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ error: 'Could not update request' });
  }
};

// Delete a request by ID
const deleteRequestById = async (req, res) => {
  try {
    const requestId = req.params.id;
    const request = await Request.findByIdAndRemove(requestId);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.status(204).json(); // No content
  } catch (error) {
    res.status(500).json({ error: 'Could not delete request' });
  }
};

module.exports = {
  createRequest,
  getAllRequests,
  getRequestById,
  updateRequestById,
  deleteRequestById,
};
