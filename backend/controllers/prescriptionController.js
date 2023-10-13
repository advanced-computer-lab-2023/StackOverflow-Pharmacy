const Prescription = require('../models/prescriptionModel');

// Create a new prescription
const createPrescription = async (req, res) => {
  try {
    const { doctorID, patientID, content, description } = req.body;

    // Create a new prescription document
    const newPrescription = new Prescription({
      doctorID,
      patientID,
      content,
      description,
    });

    await newPrescription.save();

    res.status(201).json(newPrescription);
  } catch (error) {
    res.status(500).json({ error: 'Could not create prescription' });
  }
};

// Get all prescriptions
const getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find();
    res.status(200).json(prescriptions);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch prescriptions' });
  }
};

// Get a specific prescription by ID
const getPrescriptionById = async (req, res) => {
  try {
    const prescriptionId = req.params.id;
    const prescription = await Prescription.findById(prescriptionId);

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.status(200).json(prescription);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch prescription' });
  }
};

// Update a prescription by ID
const updatePrescriptionById = async (req, res) => {
  try {
    const prescriptionId = req.params.id;
    const { isFilled, isSubmitted } = req.body;

    const prescription = await Prescription.findByIdAndUpdate(
      prescriptionId,
      { isFilled, isSubmitted },
      { new: true }
    );

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.status(200).json(prescription);
  } catch (error) {
    res.status(500).json({ error: 'Could not update prescription' });
  }
};

// Delete a prescription by ID
const deletePrescriptionById = async (req, res) => {
  try {
    const prescriptionId = req.params.id;
    const prescription = await Prescription.findByIdAndRemove(prescriptionId);

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.status(204).json(); // No content
  } catch (error) {
    res.status(500).json({ error: 'Could not delete prescription' });
  }
};

module.exports = {
  createPrescription,
  getAllPrescriptions,
  getPrescriptionById,
  updatePrescriptionById,
  deletePrescriptionById,
};
