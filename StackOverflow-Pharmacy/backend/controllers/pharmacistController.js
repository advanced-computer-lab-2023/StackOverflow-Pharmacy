const mongoose = require('mongoose'); // Import mongoose
const Admin = require('../models/administrator')
const Pharmacist = require('../models/pharmacist')
const Patient = require('../models/patient')
const Medicine = require('../models/medicineModel')
//const Package= require('../models/package')
const jwt = require('jsonwebtoken')

const createWebToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET_KEY, {expiresIn: '1d'})
}

const addmedicine = async (req, res) => {
  try {
    // console.log(req.body.medicine)
    const {name,
      description,
      price,
      numStock,
      numSold,
      medicalUse,
      activeIngredients,
      isArchived,
      isOverTheCounter,
      image} = req.body.medicine
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
        
      console.log('gfgnjzgese    ')      
    // if (user) {
    //   const token = createWebToken(user._id)
    //   res.cookie('jwt',token, {httpOnley: true, maxAge: 86400 * 1000})
    //   res.status(200).json({name: user.name, email:user.email, role:user.role})
    // } else {
    //   res.status(500).json({error: 'Failed to create user'})
    // }
    res.status(200).json(medicine)
  } catch (error) {
    res.status(500).json({error: error.message})
    console.log(error.message)
  }
}
const getAvailableMedicines = async (req, res) => {
  try {
    
    const medicines = await Medicine.find();

    if (medicines.length === 0) {
      return res.status(404).json({ message: 'No matching medicines with stock available.' });
    }

    res.status(200).json(medicines);
  } catch (error) {
    // Handle any errors that may occur during the database query
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const viewMedicineStats = async (req, res) => {
  try {
      // Retrieve all medicines
      const medicines = await Medicine.find({});

      if (medicines.length === 0) {
          return res.status(404).json({ message: "No medicines found." });
      }

      // Calculate sales and available quantity for each medicine and include the name
      const medicineStats = medicines.map(medicine => ({
          name: medicine.name,  // Include the name
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
      const name = req.query.name;
      console.log(name)
      if (!name) {
        return res.status(400).json({ error: "Please provide a medicine name for searching." });
      }
  
      // Perform a case-insensitive search using a regular expression
      const medicines = await Medicine.find({ name: { $regex: new RegExp(name, 'i') } });

      if (medicines.length === 0) {
        return res.status(404).json({ message: "No medicines found with the provided name." });
      }
  
      res.status(200).json(medicines);
    } catch (error) {
      // Handle any errors that may occur during the database query
      res.status(500).json({ error: "Internal Server Error" });
    }
};



const filterMedicineByMedicalUse = async (req, res) => {
  try {
      const { medicalUse } = req.query;

      if (!medicalUse) {
          return res.status(400).json({ error: "Please provide a medical use for filtering medicines." });
      }

      // Create a case-insensitive regular expression pattern for the medicalUse
      const regex = new RegExp(medicalUse, "i");

      // Use the regular expression to filter medicines
      const medicines = await Medicine.find({ medicalUse: regex });

      if (medicines.length === 0) {
          return res.status(404).json({ message: "No medicines found for the provided medical use." });
      }

      res.status(200).json(medicines);
  } catch (error) {
      // Handle any errors that may occur during the database query
      res.status(500).json({ error: "Internal Server Error" });
  }
};


  
  
const editMedicine = async (req, res) => {
  try {
    console.log(req.body.medicine)
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
      image
    } = req.body.medicine;

    // Validate that the required fields are provided
    if (!name) {
      return res.status(400).json({ error: "Please provide the medicine's name for editing." });
    }

    // Find and update the medicine by its name
    const updatedMedicine = await Medicine.findOneAndUpdate({name: name}, req.body.medicine, { new: true });

    if (!updatedMedicine) {
      return res.status(404).json({ message: "Medicine not found." });
    }

    res.status(200).json(updatedMedicine);
  } catch (error) {
    // Handle any errors that may occur during the update
    res.status(500).json({ error: "Internal Server Error" });
    console.log(error.message)
  }
}
// ** i am not sure of the below method code because i dont understand its related requirment (number 16) **
const addQuantityToMedicine = async (req, res) => {
  try {
    const { name, numStock } = req.body;

    // Validate that the required fields are provided
    if (!name || numStock === undefined ) {
      return res.status(400).json({ error: "Please provide name, activeIngredients, price, and available quantity to add to the medicine." });
    }

    // Find the existing medicine by name
    const existingMedicine = await Medicine.findOne({ name });
    //console.log(name)
    if (!existingMedicine) {
      return res.status(404).json({ message: "Medicine not found." });
    }

    // Update the quantities and activeIngredients
    existingMedicine.numStock += numStock;
 //   existingMedicine.Medicine.numSold = 0; // Reset the numSold when adding more stock


    // Save the updated medicine
    const updatedMedicine = await existingMedicine.save();

    res.status(200).json(updatedMedicine);
  } catch (error) {
    // Handle any errors that may occur during the update
    res.status(500).json({ error: error.message });
  }
}
  

module.exports = {
addmedicine,
getAvailableMedicines,
viewMedicineStats,
searchMedicineByName,
filterMedicineByMedicalUse,
editMedicine,
addQuantityToMedicine,
}