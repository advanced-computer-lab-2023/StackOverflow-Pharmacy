const mongoose = require('mongoose');
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Admin = require("../models/administrator");
const Patient = require("../models/patient"); // Import the Patient model
const Pharmacist = require("../models/pharmacist"); // Import the Pharmacist model
const Chat = require("../models/chatRoomModel");
// const Message = require("../models/chatRoomModel");

require("dotenv").config();
const nodemailer = require("nodemailer");
const ChatRoom = require('../models/chatRoomModel');

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
  console.log("Request body:", req.body);
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
    console.log("User saved:", newUser);
    if (!Array.isArray(emergencyContacts)) {
      console.log("wwwwwwwwwwwwww");
      return res
        .status(400)
        .json({ message: "Invalid emergencyContacts data" });
    }

    for (const contact of emergencyContacts) {
      console.log("looping");

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
      console.log("patient data : ", patientData);
      const newPatient = new Patient(patientData);
      try {
        console.log("Before saving newPatient");
        await newPatient.save();
        console.log("After saving newPatient");
      } catch (error) {
        console.error("Error saving newPatient:", error);
      }
      console.log("Patient saved:", newPatient);

      // Update the User document with the _id of the corresponding Patient document
      newUser.patientId = newPatient._id;
      await newUser.save();
      console.log("User updated with patientId:", newUser);
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
              const token = createToken(user.username);
              res.cookie("jwt", token, {
                httpOnly: true,
                maxAge: maxAge * 1000,
              });
              res.status(200).json({
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
          res.status(200).json({
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
          res.status(200).json({
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
    console.log("bdbhbvvvvvvvvvhb");
    res.cookie("jwt", "", {
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
    const { oldPassword, newPassword } = req.body;
    const { userId } = req.params;
    console.log("Received data:", req.params);
   
    const user = await User.findById(userId);
console.log("User found:", user);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log("Before findByIdAndUpdate");
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid old password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log("Hashed password:", hashedPassword);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    );
    console.log("Updated user:", updatedUser);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error during password change:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const forgotPassword = async (req, res) => {
  console.log("Forgot password method called");
  const { email, username } = req.body;

  try {
    console.log(
      "Received forgot password request for email:",
      email,
      "and username:",
      username
    );

    // Find the user based on the username or email
    let user = await User.findOne({ $or: [{ username }, { email }] });

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ error: "User not found" });
    }

    // Check the role of the user
    if (user.role === "Patient") {
      console.log("User found as Patient:", user);
      // Handle Patient-specific logic
    } else if (user.role === "Pharmacist") {
      console.log("User found as Pharmacist:", user);
      // Handle Pharmacist-specific logic
    } else if (user.role === "Administrator") {
      console.log("User found as Admin:", user);
      // Handle Admin-specific logic
    }

    const otp = generateOTP();
    console.log("Generated OTP:", otp);

    sendOtpByEmail(email, otp);

    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 15);

    console.log("Before updating user:");
    console.log("User found before update:", user || "User not found");

    // Set the passwordResetOtp and passwordResetOtpExpiry for the user
    await User.findByIdAndUpdate(user._id, {
      $set: { passwordResetOtp: otp, passwordResetOtpExpiry: otpExpiry },
    });

    console.log("After updating user:");

    // Fetch the updated user
    const userAfterUpdate = await User.findOne({
      $or: [{ username }, { email }],
    });
    console.log(
      "User found after update:",
      userAfterUpdate || "User not found"
    );

    console.log("OTP sent successfully");
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error during password reset:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const checkOTP = async (req, res) => {
  const { username, otp } = req.body;

  try {
    console.log("Received OTP verification request for email:", username);

    const user = await User.findOne({ username });
    if (!user) {
      console.log("User not found for username:", username);
      return res.status(400).json({ error: "User not found" });
    }

    console.log("User found in the database:", user);
    console.log("User entered OTP:", otp);
    console.log("Stored OTP:", user.passwordResetOtp);
    console.log("Current time:", new Date());
    console.log("Expiry time:", user.passwordResetOtpExpiry);

    if (
      
      user &&
      parseInt(user.passwordResetOtp) === parseInt(otp) &&
      new Date() <= user.passwordResetOtpExpiry
    ) {
      console.log("OTP verified successfully");
      res.status(200).json({ message: "OTP verified successfully" });
    } else {
      console.log("Invalid OTP or OTP expired");
      res.status(400).json({ error: "Invalid OTP or OTP expired" });
    }
  } catch (error) {
    console.error("Error during OTP verification:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



const updatePassword = async (req, res) => {
  const { username, newPassword } = req.body;
  console.log('Received update password request for username:', username);

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log('Hashed password:', hashedPassword);
    await User.findOneAndUpdate(
      { username },
      {
        $set: {
          password: hashedPassword,
          passwordResetOtp: null,
          passwordResetOtpExpiry: null,
        },
      }
    );
    console.log('Password updated successfully');
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error during password update:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const sendOtpByEmail = (email, otp) => {
  // Create a nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "boodee19730000@gmail.com",
      pass: "elxi ncik jjpj iwxc",
    },
  });

  // Email options
  const mailOptions = {
    from: "boodee19730000@gmail.com",
    to: email, // Make sure 'email' is not empty or undefined
    subject: "Password Reset OTP",
    text: `Your OTP for password reset is: ${otp}`,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      // Handle the error, maybe return a response to the client indicating the issue.
    } else {
      console.log("Email sent:", info.response);
    }
  });
};
const getChats = async (req, res) => {
  try {
    const patientId = req.query.firstID
    const pharmacistRole = 'Pharmacist'
    const user=await User.findOne({ _id: patientId })
    console.log(user.role)
    if(user.role==='Patient'){
      const pharmacists = await User.find({ role: pharmacistRole });

      const patientChats = await Chat.find({ $or: [{ firstID: user.username }, { secondID: user.username }] });

      // Identify pharmacists with whom the patient doesn't have a chat
      console.log("ndfffffffffffffffffffffffffffffffffff")
      console.log(patientChats)
      const newChats = pharmacists.filter(pharmacist =>
        !patientChats.some(chat =>
          chat.firstID===user.username && chat.secondID===pharmacist.username
        )
      );
  
      // Create new chats for pharmacists not found in existing chats
      for (const pharmacist of newChats) {
        await Chat.create({
          firstID: user.username,
          secondID: pharmacist.username,
          messages: [],
        });
      }
    }
    if(user.role==='Pharmacist'){
      const patients = await User.find({ role: "Patient" });
      const pharmacistChats = await Chat.find({ $or: [{ firstID: user.username }, { secondID: user.username }] });

      // Identify pharmacists with whom the patient doesn't have a chat
      console.log("ndfffffffffffffffffffffffffffffffffff")
      console.log(pharmacistChats)
      const newChats = patients.filter(patient =>
        !pharmacistChats.some(chat =>
          chat.firstID===patient.username && chat.secondID===user.username
        )
      );
  
      // Create new chats for pharmacists not found in existing chats
      for (const patient of newChats) {
        await Chat.create({
          firstID: patient.username,
          secondID: user.username,
          messages: [],
        });
      }
    }
    if (patientId) {
      
      const chats = await Chat.find({ $or: [{ firstID: user.username }, { secondID: user.username }] });
    //  const names = await getNamesFromChats(chats);
      res.status(200).json({ chats });
    } else {
      res.status(500).json({ error: "Failed to get user ID" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const sendMessage = async (req, res) => {
  let newChat
  try {
    const chat = req.body.chat;
    const text = req.body.text;
    const sender=req.body.sender // Fix the typo here

    if (chat) {
      // const message = await Message.create({ sender: chat.firstID, text: text });
      const message = { sender, text: text }

      newChat = await ChatRoom.findOne(
        { _id: chat._id }
      );
      if (!newChat)
        console.error("None")

      newChat.messages.push(message);
      await newChat.save()
      
      res.status(200).json({ newChat });
    } else {
      res.status(500).json({ error: "Failed to get user ID" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message }); // Fix the typo here
  }
};

const createchat = async (req, res) => {
  try {
    const firstID = req.body.firstID;
    const secondID = req.body.secondID;
    if (firstID) {
      const chat = await Chat.create({ firstID,secondID});
      res.status(200).json({chat});
    }  else {
      res.status(500).json({ error: "Failed to get user ID" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const searchToChat = async (req, res) => {
  try {
    const username = req.query.username
    if (username) {
      const  user = await User.findOne({ username}).select('_id');
      res.status(200).json({user});
    }  else {
      res.status(500).json({ error: "Failed to get user ID" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getUserName = async (req, res) => {
  try {
    const _id = req.query.ID
    if (_id) {
      const  user = await User.findOne({ _id});
      const username=user.username
      res.status(200).json({username});
    }  else {
      res.status(500).json({ error: "Failed to get user ID" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getWallet = async (req, res) => {
  try {
    const _id = req.query.firstID
    if (_id) {
      const  user = await User.findOne({ _id});
      const wallet=user.wallet
      res.status(200).json({wallet});
    }  else {
      res.status(500).json({ error: "Failed to get user ID" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
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
  forgotPassword,
  checkOTP,
  updatePassword,
  getChats,
  sendMessage,
  createchat,
  searchToChat,
  getUserName,
  getWallet
};

