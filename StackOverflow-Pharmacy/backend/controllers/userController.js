const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const patientt = require('../models/patient');
const pharmacist = require('../models/pharmacist');

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
      birthDate,
      role,
    } = req.body;

    // Check if the email is already registered
  /*  const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }*/

    // Hash the password before saving it
   // const hashedPassword = bcrypt.hashSync(password, 10);

    // Create a new user document
    const newUser = new User({
      username,
      password,
      role
    });

     // If the user is a patient, pharmacist, or administrator, add relevant properties
     console.log(role)
     if (role === 'Patient') {
        const { gender,phone,emergencyContact} = req.body;
        console.log(newUser)
      const pat = {
        _id:newUser._id,
        name:name,
        gender : gender,
        email:email,
        phone : phone,
        birthdate:birthDate,
        emergencyContact : emergencyContact
  }
        patientt.create(pat)
      } else if (role === 'Administrator') {
        // Add any specific properties for administrators here
      }
      
    await newUser.save();

    res.status(201).json({ user: newUser });
  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({ error: error });
  }
}

const createPendingPharmacist = async (req, res) => {
  try {
    const {
      username,
      name,
      email,
      password,
      birthDate,
      role,
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
      role
    });

     // If the user is a patient, pharmacist, or administrator, add relevant properties
     console.log(role)
     if (role === 'Pharmacist') {
      const { hourRate, affiliation, educationBackground, email } = req.body;
      console.log(newUser)
      const pharm = {
        _id: newUser._id,
        hourRate: hourRate,
        affiliation: affiliation,
        educationBackground: educationBackground, // Fixed property name
        name: name,
        email: email,
        birthdate: birthDate
      }
      pharmacist.create(pharm)
      
      } else if (role === 'Administrator') {
        // Add any specific properties for administrators here
      }
      
    await newUser.save();

    res.status(201).json({ user: newUser });
  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({ error: error });
  }
}

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
