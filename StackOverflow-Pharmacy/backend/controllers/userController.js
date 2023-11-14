const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Patient = require("../models/patient"); // Import the Patient model
const Pharmacist = require("../models/pharmacist"); // Import the Pharmacist model
require("dotenv").config();

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
    console.log(birthdate);
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Ensure that emergencyContacts is an array
    if (!Array.isArray(emergencyContacts)) {
      return res
        .status(400)
        .json({ message: "Invalid emergencyContacts data" });
    }

    // Create a new user document with basic properties
    const newUser = new User({
      username,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    console.log(birthdate);
    if (role === "Patient") {
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
    } else if (role === "Administrator") {
      // Handle Administrator-specific properties here if needed
    }

    res.status(201).json({ user: newUser });
  } catch (error) {
    console.log("Error:", error);
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
      return res.status(400).json({ message: "Email already registered" });
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
    if (role === "Pharmacist") {
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
    } else if (role === "Administrator") {
      // Add any specific properties for administrators here
    }

    await newUser.save();

    res.status(201).json({ user: newUser });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    // Get the user ID from the token
    const userId = req.user.id;

    // Fetch the user profile from the database
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch user profile" });
  }
};

/// Function to generate a JWT token
const createToken = (name) => {
  return jwt.sign({ name }, process.env.SECRET_KEY, {
    expiresIn: "24h", // You can set maxAge as appropriate
  });
};

// Register a new user (patient or pharmacist)
const maxAge = 24 * 60 * 60;
const patientSignup = async (req, res) => {
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

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const salt = await bcrypt.genSalt();
    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: hashedPassword, // Make sure the password is set in the user document
      role: "Patient",
    });

    await newUser.save();

    if (!Array.isArray(emergencyContacts)) {
      return res
        .status(400)
        .json({ message: "Invalid emergencyContacts data" });
    }

    for (const contact of emergencyContacts) {
      const patientData = {
        _id: newUser._id,
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

      const newPatient = new Patient(patientData);
      await newPatient.save();
    }

    // Generate a JWT token for the newly registered user
    const token = createToken(newUser.username);

    // Set the JWT token as an HTTP-only cookie
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });

    res.status(201).json({ user: newUser });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

const pharmacistSignup = async (req, res) => {
  try {
    const {
      username,
      name,
      email,
      password,
      birthdate,
      role,
      hourRate,
      affiliation,
      educationBackground,
    } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      role: "Pharmacist",
    });
    await newUser.save();

    const pharmacistData = {
      _id: newUser._id,
      hourRate,
      affiliation,
      educationBackground,
      name,
      email,
      birthdate: birthdate, // Convert the birthdate string to a Date object
    };

    const newPharmacist = new Pharmacist(pharmacistData);
    await newPharmacist.save();

    // Generate a JWT token for the newly registered user
    const token = createToken(newUser);

    // Set the JWT token as an HTTP-only cookie
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });

    res.status(201).json({ user: newUser });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(`Attempting login for username: ${username}`);

    const user = await User.findOne({
      username: { $regex: new RegExp(username, "i") },
    });
    console.log("role :" ,user.role);
    if (!user) {
      console.log(`User not found for username: ${username}`);
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (user) {
      // Check if the provided password matches the stored hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        // Check if the user is a pharmacist
        if (user.role === "Pharmacist") {
          const pharmacist = await Pharmacist.findOne({ _id: user._id });

          if (pharmacist) {
            if (pharmacist.status === "Approved") {
              // Generate a JWT token for the authenticated pharmacist
              const token = createToken(user._id);

              // Set the JWT token as an HTTP-only cookie with a 24-hour expiration (86400 seconds)
              res.cookie("jwt", token, {
                httpOnly: true,
                maxAge: maxAge * 1000,
              });
              console.log("JWT token set as a cookie");

              res
                .status(200)
                .json({
                  username: user.username,
                  email: user.email,
                  role: user.role,
                });
            } else {
              res
                .status(403)
                .json({ error: `Pharmacist status is ${pharmacist.status}` });
            }
          } else {
            res.status(404).json({ error: "Pharmacist profile not found" });
          }
        } else if (user.role === "Patient") {
          // Handle patient login logic
          // For example, you can generate a JWT token for patients and set it as a cookie
          const token = createToken(user.username);
          res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: maxAge * 1000,
          });
          res
            .status(200)
            .json({
              username: user.username,
              email: user.email,
              role: user.role,
            });
        } else if (user.role === "Administrator") {
          const token = createToken(user.username);
          res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: maxAge * 1000,
          });
          res
            .status(200)
            .json({
              username: user.username,
              email: user.email,
              role: user.role,
            });
        } else {
          res
            .status(403)
            .json({ error: `Role ${user.role} is not allowed to log in` });
        }
      } else {
        res.status(401).json({ error: "Invalid password" });
      }
    } else {
      console.log("User not found");
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: error.message });
  }
};

const getData = async (req, res) => {
  try {
    const user = req.user;
    if (user) {
      res
        .status(200)
        .json({ name: user.name, email: user.email, role: user.role });
    } else {
      res.status(500).json({ error: "Failed to get user" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const logout = async (req, res) => {
  try {
    // Set the cookie to expire in the past, effectively deleting it
    console.log("bdbhbvvvvvvvvvhb")
    res.cookie('jwt', '',{
      httpOnly: true,
      maxAge: maxAge * 1000,
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const changePassword = async (req, res) => {
  
  try {
    // Find the user by ID
    const { oldPassword, newPassword } = req.body;
    const _id=req.params;
    const user = await User.findOne({_id}); // Assuming you have the user ID in the request
  // Validate the old password
  const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid old password');
  }
  const user1 = await User.findOneAndUpdate({_id},{password:newPassword},{ new: true });
    res.status(200).json(user1);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
const forgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Step 2: Generate and send OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    sendOtpByEmail(email, otp);

    // Step 3: Store OTP and Expiry Time in the database
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 15); // OTP valid for 15 minutes

    await User.findOneAndUpdate(
      { email },
      { $set: { passwordResetOtp: otp, passwordResetOtpExpiry: otpExpiry } }
    );

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
const checkOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Step 6: Verify OTP
    const user = await User.findOne({ email });

    if (!user || user.passwordResetOtp !== otp || new Date() > user.passwordResetOtpExpiry) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
const updatePassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    // Step 7: Update Password
    const hashedPassword = // Hash the new password (use bcrypt or your preferred method)
    await User.findOneAndUpdate(
      { email },
      { $set: { password: hashedPassword, passwordResetOtp: null, passwordResetOtpExpiry: null } }
    );

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
function sendOtpByEmail(email, otp) {
  // Use Nodemailer or your email service of choice to send the OTP
  // Here's a basic example using Nodemailer (make sure to set up your email transport options)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-email-password',
    },
  });

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Password Reset OTP',
    text: `Your OTP for password reset is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

module.exports = {
  registerPatient,
  createPendingPharmacist,
  getUserProfile,
  patientSignup,
  pharmacistSignup,
  login,
  logout,
  getData,
  createToken,
  changePassword,
  forgetPassword,
  checkOTP,
  updatePassword,
};