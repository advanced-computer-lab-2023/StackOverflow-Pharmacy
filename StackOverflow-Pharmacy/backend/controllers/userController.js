const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Patient = require('../models/patient'); // Import the Patient model
const Pharmacist = require('../models/pharmacist'); // Import the Pharmacist model



// Function to generate a JWT token
function generateToken(user) {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
}

// Register a new user (patient or pharmacist)
const registerPatient = async (req, res) => {
  try {
    const {
      username,
      name,
      email,
      password,
      birthdate,
      role,
      gender,
      phone,
      emergencyContacts,
    } = req.body;
    console.log(birthdate)
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Ensure that emergencyContacts is an array
    if (!Array.isArray(emergencyContacts)) {
      return res.status(400).json({ message: 'Invalid emergencyContacts data' });
    }

    // Create a new user document with basic properties
    const newUser = new User({
      username,
      password: hashedPassword,
      role,
    });

    await newUser.save();
console.log(birthdate)
    if (role === 'Patient') {
      for (const contact of emergencyContacts) {
        const patientData = {
          _id: newUser._id, // Assign the user's _id to the patient
          name,
          gender,
          email,
          phone,
          birthdate: birthdate,
          emergencyContact: {
            name: contact.name,
            phone: contact.phone,
            relation: contact.relation,
          },
        };

        // Create a new patient instance and save it
        const newPatient = new Patient(patientData);
        await newPatient.save();
      }
    } else if (role === 'Administrator') {
      // Handle Administrator-specific properties here if needed
    }

    res.status(201).json({ user: newUser });
  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({ error: error.message });
  }
};



const createPendingPharmacist = async (req, res) => {
  try {
    const {
      username,
      name,
      email,
      password,
      birthdate, // Update the variable name
      role,
      hourRate,
      affiliation,
      educationBackground,
    } = req.body;
   
    // Check if the email is already registered
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user document
    const newUser = new User({
      username,
      password: hashedPassword,
      role,
    });

    // If the user is a pharmacist, add relevant properties
    if (role === 'Pharmacist') {
      const pharm = {
        _id: newUser._id,
        hourRate,
        affiliation,
        educationBackground,
        name,
        email,
        birthdate: birthdate, // Convert the birthdate string to a Date object
      };

      // Create a new pharmacist instance and save it
      const newPharmacist = new Pharmacist(pharm);
      await newPharmacist.save();
    } else if (role === 'Administrator') {
      // Add any specific properties for administrators here
    }

    await newUser.save();

    res.status(201).json({ user: newUser });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};




/*const submitRequest = async (req, res) => {
  try {
      const {
          username,
          name,
          email,
          password,
          birthDate,
          hourRate,
          affiliation,
          educationBackground,
      } = req.body;

      // Create a new request document with all pharmacist data
      const request = new Request({
          username,
          name,
          email,
          password,
          birthDate,
          hourRate,
          affiliation,
          educationBackground,
      });

      // Save the request as 'Pending'
      await request.save();

      res.status(201).json({ message: 'Pharmacist request submitted successfully', request });
  } catch (error) {
      console.log(error);
      res.status(500).json({ error: error });
  }
};*/


// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    // Check if the provided password matches the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    // Generate a JWT token for authentication
    const token = generateToken(user);

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ error: 'Could not login user' });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    // Get the user ID from the token
    const userId = req.user.id;

    // Fetch the user profile from the database
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch user profile' });
  }
};

// Add more functions for role-specific actions as needed

module.exports = {
  registerPatient,
  createPendingPharmacist,
  loginUser,
  getUserProfile,
  // Add more controller functions here
};
