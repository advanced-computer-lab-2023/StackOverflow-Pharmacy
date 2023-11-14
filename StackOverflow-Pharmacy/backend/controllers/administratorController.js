const mongoose = require('mongoose'); // Import mongoose
const Admin = require('../models/administrator')
const Pharmacist = require('../models/pharmacist')
const Patient = require('../models/patient')
const Medicine = require('../models/medicineModel')
const User = require('../models/userModel')
const bcrypt = require("bcrypt");
//const Package= require('../models/package')
const jwt = require('jsonwebtoken')

const createWebToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET_KEY, {expiresIn: '1d'})
}

const addadmin = async (req, res) => {
  try {
    const { userName, password } = req.body;
    if (!userName || !password) {
      throw new Error('Username and password are required');
    }

    // Create an "admin" document
    

    // Create a "user admin" with the role "Administrator"
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username: userName,
      password: hashedPassword, // Use the provided password
      role: 'Administrator', // Make sure to use 'Administrator' here
    });
    await newUser.save(); // Save the user document
    const admin = await Admin.create({_id: newUser._id, userName, password:hashedPassword });
    res.status(200).json(admin);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const removePharmacist = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({error: 'No such patient'})
  }

  const pharmacist = await Pharmacist.findOneAndDelete({_id: id})

  if(!pharmacist) {
    return res.status(400).json({error: 'No such patient'})
  }

  res.status(200).json(pharmacist)
}
const removePatient = async (req, res) => {
    const { id } = req.params
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({error: 'No such patient'})
    }
  
    const patient = await Patient.findOneAndDelete({_id: id})
  
    if(!patient) {
      return res.status(400).json({error: 'No such patient'})
    }
  
    res.status(200).json(patient)
}
const acceptRequest = async (req, res) => {
  try {
      // Retrieve the request ID that needs to be accepted
      const requestId = req.params.requestId;

      // Find the request by ID
      const request = await Request.findById(requestId);

      if (!request) {
          return res.status(404).json({ message: 'Request not found' });
      }

      // If the request is 'Pending,' you can proceed to create the pharmacist user
      if (request.status === 'Pending') {
          const pharmacistData = { ...request._doc };
          delete pharmacistData._id;
          delete pharmacistData.status;

          // Create the pharmacist user using the data from the request
          const pharmacist = new User({ ...pharmacistData, role: 'Pharmacist' });
          await pharmacist.save();

          // Update the status of the request to 'Accepted'
          request.status = 'Accepted';
          await request.save();

          return res.status(200).json({ message: 'Pharmacist request accepted' });
      } else {
          return res.status(400).json({ message: 'Request has already been processed' });
      }
  } catch (error) {
      console.log(error);
      res.status(500).json({ error: error });
  }
};

  
const getAvailableMedicines = async (req, res) => {
  try {
    const { name } = req.body; // Get the name from query parameters

    if (!name) {
      return res.status(400).json({ message: 'Name parameter is required.' });
    }

    const medicines = await Medicine.find(
      { name: { $regex: new RegExp(name, 'i') }},
      'image price description'
    );

    if (medicines.length === 0) {
      return res.status(404).json({ message: 'No matching medicines with stock available.' });
    }

    res.status(200).json(medicines);
  } catch (error) {
    // Handle any errors that may occur during the database query
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
  const filterMedicineByMedicalUse = async (req, res) => {
    try {
      const { medicalUse } = req.body;
  
      if (!medicalUse) {
        return res.status(400).json({ error: "Please provide a medical use for filtering medicines." });
      }
  
      const medicines = await Medicine.find({ 'medicalUse': medicalUse });
  
      if (medicines.length === 0) {
        return res.status(404).json({ message: "No medicines found for the provided medical use." });
      }
  
      res.status(200).json(medicines);
    } catch (error) {
      // Handle any errors that may occur during the database query
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  
  
  const searchMedicineByName = async (req, res) => {
    try {
      const { name } = req.body;
      console.log("dsscds")
      if (!name) {
        return res.status(400).json({ error: "Please provide a medicine name for searching." });
      }
  
     
      const medicines = await Medicine.find({name});
  
      if (medicines.length === 0) {
        return res.status(404).json({ message: "No medicines found with the provided name." });
      }
  
      res.status(200).json(medicines);
    } catch (error) {
      // Handle any errors that may occur during the database query
      res.status(500).json({ error: error.message });
    }
  }
  
  
  
  const getPharmacistInfo = async (req, res) => {
    try {
      
      const { id } = req.params; // Get the pharmacist's ID from the request parameters
     console.log(id)
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid pharmacist ID' });
      }
   
      const pharmacist = await Pharmacist.findById(id);
      console.log(pharmacist)
      if (!pharmacist) {
        return res.status(404).json({ error: 'Pharmacist not found' });
      }
  
      res.status(200).json(pharmacist);
    } catch (error) {
      // Handle any errors that may occur during the database query
      console.log(error.message)
      res.status(500).json({ error: error.message });
      console.log(error.message)
    }
  }
  
const getPatientBasicInfo = async (req, res) => {
  try {
    const { id } = req.params; // Get the patient's ID from the request parameters

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid patient ID' });
    }

    const user = await Patient.findById(id).select("name username email phone");
console.log(user)

    res.status(200).json(user);
  } catch (error) {
    // Handle any errors that may occur during the database query
    res.status(500).json({ error: error.message });
  }
};

  

const login = async (req, res) => {
  try {
    const {userName, password} = req.body
    const user = await User.findOne({userName})
    if (user && user.password === password) {
      const token = createWebToken(user._id)
      res.cookie('jwt',token, {httpOnley: true, maxAge: 86400 * 1000})
      res.status(200).json({name: user.name, email:user.email, role:user.role})
    }
    if (user) {
      const token = createWebToken(user._id)
      res.cookie('jwt',token, {httpOnley: true, maxAge: 86400 * 1000})
      res.status(200).json({name: user.name, email:user.email, role:user.role})
    } else {
      res.status(500).json({error: 'Failed to create user'})
    }
  } catch (error) {
    res.status(500).json({error: error.message})
  }
}
const getReuesst = async (req, res) => {
  try {
    
  
    const pharmacist = await Pharmacist.find({status: 'Pending'});
    console.log(pharmacist)
    if (!pharmacist) {
      return res.status(404).json({ error: 'Pharmacist not found' });
    }

    res.status(200).json(pharmacist);
  } catch (error) {
    // Handle any errors that may occur during the database query
    console.log(error.message)
    res.status(500).json({ error: error.message });
    console.log(error.message)
  }
}
const getData = async (req, res) => {
  try {
    const user = req.user
    if (user) {
      res.status(200).json({name: user.name, email:user.email, role:user.role})
    } else {
      res.status(500).json({error: 'Failed to get user'})
    }
  } catch (error) {
    res.status(500).json({error: error.message})
  }
}
const logout = async (req, res) => {
  try {
    res.cookie('jwt','', {httpOnley: true, maxAge: 86400 * 1000})
    
      res.status(200).json({message:'Logged out successfully'})
  } catch (error) {
    res.status(500).json({error: error.message})
  }
}

const acceptPharmacistRequest = async (req, res) => {
  try {
    const {pharmacistId} = req.body; // Use _id to match the schema

    // Find the pharmacist by _id and update their status to 'Approved'
    const pharmacist=await Pharmacist.findByIdAndUpdate(pharmacistId, { status: 'Approved' });

    return res.status(200).json({pharmacist});
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'An error occurred while accepting the pharmacist request' });
  }
}
const rejectPharmacistRequest = async (req, res) => {
  try {
    const {pharmacistId} = req.body // Use _id to match the schema
    console.log("jknvxhbh")
    // Find the pharmacist by _id and update their status to 'Rejected'
    const pharmacist=await Pharmacist.findByIdAndUpdate(pharmacistId, { status: 'Rejected' });

    return res.status(200).json({pharmacist});
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'An error occurred while rejecting the pharmacist request' });
  }
}
const viewPharmacist = async (req, res) => {
  try {
     // Use _id to match the schema
     console.log("jbwdbxhdbzssssssssssssssssssssssssssssssssssssssssssss")
    // Find the pharmacist by _id and update their status to 'Rejected'
    const pharmacists =await Pharmacist.find({status:"Pending"});

    return res.status(200).json(pharmacists);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'An error occurred while rejecting the pharmacist request' });
  }
}


module.exports = {
addadmin,
removePharmacist,
logout,
removePatient,
getData,
login,
getPatientBasicInfo,
getPharmacistInfo,
searchMedicineByName,
filterMedicineByMedicalUse,
getAvailableMedicines,
createWebToken,
acceptRequest,
getReuesst,
acceptPharmacistRequest,
rejectPharmacistRequest,
viewPharmacist
}