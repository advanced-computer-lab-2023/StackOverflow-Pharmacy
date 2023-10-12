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
      const { name } = req.body;
  
      if (!name) {
        return res.status(400).json({ error: "Please provide a medicine name for searching." });
      }
  

  
      // Retrieve medicines matching the name
      const medicines = await Medicine.find({name});
  
      if (medicines.length === 0) {
        return res.status(404).json({ message: "No medicines found with the provided name." });
      }
  
      res.status(200).json(medicines);
    } catch (error) {
      // Handle any errors that may occur during the database query
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  const filterMedicineByMedicalUse = async (req, res) => {
    try {
      console.log("a")
      const { medicalUse } = req.body;
      console.log("a")
      if (!medicalUse) {
        return res.status(400).json({ error: "Please provide a medical use for filtering medicines." });
      }
      console.log("b")
      const medicines = await Medicine.find({ medicalUse });
      console.log("c")
      if (medicines.length === 0) {
        return res.status(404).json({ message: "No medicines found for the provided medical use." });
      }
      console.log("d")
      res.status(200).json(medicines);
      console.log("e")
    } catch (error) {
      // Handle any errors that may occur during the database query
      res.status(500).json({ error:error.message });
    }
  }

  

module.exports = {
getAvailableMedicines,
searchMedicineByName,
filterMedicineByMedicalUse
}