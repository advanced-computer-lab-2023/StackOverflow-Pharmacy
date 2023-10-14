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

  

module.exports = {
getAvailableMedicines,
searchMedicineByName,
filterMedicineByMedicalUse
}