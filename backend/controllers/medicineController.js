const Medicine = require('../models/medicineModel');

// Create a new medicine
const createMedicine = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      numStock,
      numSold,
      medicalUse,
      activeIngredients,
      isArchived,
      isOverTheCounter,
      image,
    } = req.body;

    // Create a new medicine document
    const newMedicine = new Medicine({
      name,
      description,
      price,
      numStock,
      numSold,
      medicalUse,
      activeIngredients,
      isArchived,
      isOverTheCounter,
      image,
    });

    await newMedicine.save();

    res.status(201).json(newMedicine);
  } catch (error) {
    res.status(500).json({ error: 'Could not create medicine' });
  }
};

// Get all medicines
const getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.status(200).json(medicines);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch medicines' });
  }
};

// Get a specific medicine by ID
const getMedicineById = async (req, res) => {
  try {
    const medicineId = req.params.id;
    const medicine = await Medicine.findById(medicineId);

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    res.status(200).json(medicine);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch medicine' });
  }
};

// Update a medicine by ID
const updateMedicineById = async (req, res) => {
  try {
    const medicineId = req.params.id;
    const updatedMedicine = req.body;

    const medicine = await Medicine.findByIdAndUpdate(
      medicineId,
      updatedMedicine,
      { new: true }
    );

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    res.status(200).json(medicine);
  } catch (error) {
    res.status(500).json({ error: 'Could not update medicine' });
  }
};

// Delete a medicine by ID
const deleteMedicineById = async (req, res) => {
  try {
    const medicineId = req.params.id;
    const medicine = await Medicine.findByIdAndRemove(medicineId);

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    res.status(204).json(); // No content
  } catch (error) {
    res.status(500).json({ error: 'Could not delete medicine' });
  }
};

module.exports = {
  createMedicine,
  getAllMedicines,
  getMedicineById,
  updateMedicineById,
  deleteMedicineById,
};
