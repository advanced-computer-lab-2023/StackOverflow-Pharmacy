const Admin = require('../models/adminstrator')
const Pharmacist = require('../models/pharmacist')
const Patient = require('../models/doctor')
const Medicine = require('../models/medicine')
//const Package= require('../models/package')
const jwt = require('jsonwebtoken')

const createWebToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET_KEY, {expiresIn: '1d'})
}

const addmedicine = async (req, res) => {
  try {
    const {name,
        description,
        price,
        numStock,
        numSold,
        medicalUse,
        activeIngredients,
        isArchived,
        isOverTheCounter,
        image} = req.body
    if (!name) {
      throw new Error('name required')
    }
    const medicine = await Medicine.create({name,
        description,
        price,
        numStock,
        numSold,
        medicalUse,
        activeIngredients,
        isArchived,
        isOverTheCounter,
        image})
    // if (user) {
    //   const token = createWebToken(user._id)
    //   res.cookie('jwt',token, {httpOnley: true, maxAge: 86400 * 1000})
    //   res.status(200).json({name: user.name, email:user.email, role:user.role})
    // } else {
    //   res.status(500).json({error: 'Failed to create user'})
    // }
  } catch (error) {
    res.status(500).json({error: error.message})
  }
}
const getMedicine = async (req, res) => {
    try {
      const medicine = await Medicine.find({ 'numStock': { $ne: 0 } });
  
      if (medicine.length === 0) {
        return res.status(404).json({ message: "No medicines with stock available." });
      }
  
      res.status(200).json(medicine);
    } catch (error) {
      // Handle any errors that may occur during the database query
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  const viewMedicineStats = async (req, res) => {
    try {
      // Retrieve all medicines
      const medicines = await Workout.find({});
  
      if (medicines.length === 0) {
        return res.status(404).json({ message: "No medicines found." });
      }
  
      // Calculate sales and available quantity for each medicine
      const medicineStats = medicines.map(medicine => ({
        availableQuantity: medicine.numStock,
        sales: medicine.numSold * medicine.price
      }));
  
      res.status(200).json(medicineStats);
    } catch (error) {
      // Handle any errors that may occur during the database query
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  const searchMedicineByName = async (req, res) => {
    try {
      const { name } = req.params;
  
      if (!name) {
        return res.status(400).json({ error: "Please provide a medicine name for searching." });
      }
  
      // Use a case-insensitive regular expression for a partial name match
      const query = { 'Medicine.name': { $regex: new RegExp(name, 'i') } };
  
      // Retrieve medicines matching the name
      const medicines = await Medicine.find(query);
  
      if (medicines.length === 0) {
        return res.status(404).json({ message: "No medicines found with the provided name." });
      }
  
      res.status(200).json(medicines);
    } catch (error) {
      // Handle any errors that may occur during the database query
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  
  const filterMecicineByMedicalUse = async (req, res) => {
    try {
      const { medicalUse } = req.query;
  
      if (!medicalUse) {
        return res.status(400).json({ error: "Please provide a medical use for filtering medicines." });
      }
  
      const medicine = await Medicine.find({ 'Medicine.medicalUse': medicalUse });
  
      if (medicine.length === 0) {
        return res.status(404).json({ message: "No medicines found for the provided medical use." });
      }
  
      res.status(200).json(medicine);
    } catch (error) {
      // Handle any errors that may occur during the database query
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  
  const editMedicine = async (req, res) => {
    try {
      const { name } = req.params;
      const {
        description,
        price,
        numStock,
        numSold,
        medicalUse,
        activeIngredients,
        isArchived,
        isOverTheCounter,
        image
      } = req.body;
  
      // Validate that the required fields are provided
      if (!name) {
        return res.status(400).json({ error: "Please provide the medicine's name for editing." });
      }
  
      // Construct the update object based on provided fields
      const updateFields = {};
      if (description) updateFields['Medicine.description'] = description;
      if (price) updateFields['Medicine.price'] = price;
      if (numStock) updateFields['Medicine.numStock'] = numStock;
      if (numSold) updateFields['Medicine.numSold'] = numSold;
      if (medicalUse) updateFields['Medicine.medicalUse'] = medicalUse;
      if (activeIngredients) updateFields['Medicine.activeIngredients'] = activeIngredients;
      if (isArchived !== undefined) updateFields['Medicine.isArchived'] = isArchived;
      if (isOverTheCounter !== undefined) updateFields['Medicine.isOverTheCounter'] = isOverTheCounter;
      if (image) updateFields['Medicine.image'] = image;
  
      // Find and update the medicine by its name
      const updatedMedicine = await Medicine.findOneAndUpdate({'Medicine.name': name}, { $set: updateFields }, { new: true });
  
      if (!updatedMedicine) {
        return res.status(404).json({ message: "Medicine not found." });
      }
  
      res.status(200).json(updatedMedicine);
    } catch (error) {
      // Handle any errors that may occur during the update
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  // **************** i am not sure of the below method code because i dont understand its related requirment (number 16) ****************
  const addQuantityToMedicine = async (req, res) => {
    try {
      const { name, activeIngredients, price, numStock } = req.body;
  
      // Validate that the required fields are provided
      if (!name || price === undefined || numStock === undefined || !activeIngredients || activeIngredients.length === 0) {
        return res.status(400).json({ error: "Please provide name, activeIngredients, price, and available quantity to add to the medicine." });
      }
  
      // Find the existing medicine by name
      const existingMedicine = await Medicine.findOne({ 'Medicine.name': name });
  
      if (!existingMedicine) {
        return res.status(404).json({ message: "Medicine not found." });
      }
  
      // Update the quantities and activeIngredients
      existingMedicine.Medicine.numStock += numStock;
      existingMedicine.Medicine.numSold = 0; // Reset the numSold when adding more stock
      existingMedicine.Medicine.activeIngredients = activeIngredients;
  
      // Save the updated medicine
      const updatedMedicine = await existingMedicine.save();
  
      res.status(200).json(updatedMedicine);
    } catch (error) {
      // Handle any errors that may occur during the update
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  
  
  







module.exports = {
addmedicine,
getMedicine,
viewMedicineStats,
searchMedicineByName,
filterMecicineByMedicalUse,
editMedicine,
addQuantityToMedicine,
}