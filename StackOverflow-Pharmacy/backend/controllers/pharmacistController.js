const mongoose = require("mongoose"); // Import mongoose
const Admin = require("../models/administrator");
const Pharmacist = require("../models/pharmacist");
const Patient = require("../models/patient");
const Medicine = require("../models/medicineModel");
const Order = require("../models/orderModel");
//const Package= require('../models/package')
const User = require("../models/userModel");
const Notification = require("../models/notificationModel");

const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const createWebToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET_KEY, { expiresIn: "1d" });
};
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com",
    pass: "your-email-password",
  },
});

// Send email notification
const sendEmailNotification = async (recipientEmail, subject, message) => {
  const mailOptions = {
    from: "your-email@gmail.com",
    to: recipientEmail,
    subject: subject,
    text: message,
  };

  await transporter.sendMail(mailOptions);
};

// Fetch all pharmacists and send email notifications
const sendOutOfStockNotifications = async () => {
  // Fetch users with the role 'Pharmacist'
  const pharmacistUsers = await User.find({ role: "Pharmacist" });

  // Extract pharmacist emails
  const pharmacistEmails = pharmacistUsers.map(
    (pharmacist) => pharmacist.email
  );

  // Send email notifications to each pharmacist
  pharmacistEmails.forEach(async (recipientEmail) => {
    const subject = "Out of Stock Notification";
    const message = "The medicine is out of stock.";

    await sendEmailNotification(recipientEmail, subject, message);
  });
};

const addmedicine = async (req, res) => {
  try {
    // console.log(req.body.medicine)
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
    } = req.body.medicine;
    if (!name) {
      throw new Error("name required");
    }

    const medicine = await Medicine.create({
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

    console.log("gfgnjzgese    ");
    // if (user) {
    //   const token = createWebToken(user._id)
    //   res.cookie('jwt',token, {httpOnley: true, maxAge: 86400 * 1000})
    //   res.status(200).json({name: user.name, email:user.email, role:user.role})
    // } else {
    //   res.status(500).json({error: 'Failed to create user'})
    // }
    res.status(200).json(medicine);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error.message);
  }
};
const getAvailableMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find();

    if (medicines.length === 0) {
      return res
        .status(404)
        .json({ message: "No matching medicines with stock available." });
    }

    res.status(200).json(medicines);
  } catch (error) {
    // Handle any errors that may occur during the database query
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const viewMedicineStats = async (req, res) => {
  try {
    // Retrieve all medicines
    const medicines = await Medicine.find({});

    if (medicines.length === 0) {
      return res.status(404).json({ message: "No medicines found." });
    }

    // Calculate sales and available quantity for each medicine and include the name
    const medicineStats = medicines.map((medicine) => ({
      name: medicine.name, // Include the name
      availableQuantity: medicine.numStock,
      sales: medicine.numSold * medicine.price,
    }));

    res.status(200).json(medicineStats);
  } catch (error) {
    // Handle any errors that may occur during the database query
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const searchMedicineByName = async (req, res) => {
  try {
    const name = req.query.name;
    console.log(name);
    if (!name) {
      return res
        .status(400)
        .json({ error: "Please provide a medicine name for searching." });
    }

    // Perform a case-insensitive search using a regular expression
    const medicines = await Medicine.find({
      name: { $regex: new RegExp(name, "i") },
    });

    if (medicines.length === 0) {
      return res
        .status(404)
        .json({ message: "No medicines found with the provided name." });
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
      return res.status(400).json({
        error: "Please provide a medical use for filtering medicines.",
      });
    }

    // Create a case-insensitive regular expression pattern for the medicalUse
    const regex = new RegExp(medicalUse, "i");

    // Use the regular expression to filter medicines
    const medicines = await Medicine.find({ medicalUse: regex });

    if (medicines.length === 0) {
      return res
        .status(404)
        .json({ message: "No medicines found for the provided medical use." });
    }

    res.status(200).json(medicines);
  } catch (error) {
    // Handle any errors that may occur during the database query
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const editMedicine = async (req, res) => {
  try {
    console.log(req.body.medicine);
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
    } = req.body.medicine;

    // Validate that the required fields are provided
    if (!name) {
      return res
        .status(400)
        .json({ error: "Please provide the medicine's name for editing." });
    }

    // Find and update the medicine by its name
    const updatedMedicine = await Medicine.findOneAndUpdate(
      { name: name },
      req.body.medicine,
      { new: true }
    );

    if (!updatedMedicine) {
      return res.status(404).json({ message: "Medicine not found." });
    }

    res.status(200).json(updatedMedicine);
  } catch (error) {
    // Handle any errors that may occur during the update
    res.status(500).json({ error: "Internal Server Error" });
    console.log(error.message);
  }
};
// ** i am not sure of the below method code because i dont understand its related requirment (number 16) **
const addQuantityToMedicine = async (req, res) => {
  try {
    const { name, numStock } = req.body;

    // Validate that the required fields are provided
    if (!name || numStock === undefined) {
      return res.status(400).json({
        error:
          "Please provide name, activeIngredients, price, and available quantity to add to the medicine.",
      });
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
};


const archiveMedicine = async (req, res) => {
  const { medicineId } = req.params;

  try {
    const medicine = await Medicine.findByIdAndUpdate(
      medicineId,
      { isArchived: true },
      { new: true }
    );

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    res.status(200).json({ message: "Medicine archived successfully" });
  } catch (error) {
    console.error("Error archiving medicine:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const unarchiveMedicine = async (req, res) => {
  const { medicineId } = req.params;

  try {
    const medicine = await Medicine.findByIdAndUpdate(
      medicineId,
      { isArchived: false },
      { new: true }
    );

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    res.status(200).json({ message: "Medicine unarchived successfully" });
  } catch (error) {
    console.error("Error unarchiving medicine:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const viewSales = async (req, res) => {
  try {
    const chosenMonth = parseInt(req.params.month);
    const salesData = await Order.aggregate([
      {
        $match: {
          status: { $ne: "Cancelled" },
        },
      },
      {
        $project: {
          month: { $month: "$date" },
          items: 1,
        },
      },
      {
        $match: {
          month: chosenMonth,
        },
      },
      {
        $unwind: "$items",
      },
      {
        $group: {
          _id: "$items.medicine",
          quantitySold: { $sum: "$items.count" },
          totalSales: { $sum: "$items.price" },
        },
      },
      {
        $lookup: {
          from: "medicines",
          localField: "_id",
          foreignField: "_id",
          as: "medicineDetails",
        },
      },
      {
        $unwind: "$medicineDetails",
      },
      {
        $project: {
          medicineId: "$medicineDetails._id",
          medicineName: "$medicineDetails.name",
          quantitySold: 1,
          totalSales: 1,
        },
      },
    ]);
    console.log("Filtered Sales Data (Backend):", salesData);
    res.json({ salesData });
  } catch (error) {
    console.error("Error fetching total sales:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const viewSalesThree = async (req, res) => {
  try {
    const chosenMonth = parseInt(req.params.month);
    const chosenDate = new Date(req.params.date);
    const medicineName = req.params.medicineName;
    const medicine = await Medicine.findOne({ name: medicineName });
    const medicineId = medicine ? medicine._id : null;

    console.log("Chosen Month:", chosenMonth);
    console.log("Chosen Date:", chosenDate);
    console.log("medicineeeeeeeeeeeeeeeeeeeeeeee:", medicine);

    const salesData = await Order.aggregate([
      {
        $match: {
          status: { $ne: "Cancelled" },
          date: {
            $gte: new Date(
              chosenDate.getFullYear(),
              chosenMonth - 1,
              chosenDate.getDate()
            ),
            $lt: new Date(
              chosenDate.getFullYear(),
              chosenMonth - 1,
              chosenDate.getDate() + 1
            ),
          },
        },
      },
      {
        $unwind: "$items",
      },
      {
        $match: {
          "items.medicine": medicineId,
        },
      },
      {
        $group: {
          _id: "$items.medicine",
          quantitySold: { $sum: "$items.count" },
          totalSales: { $sum: "$items.price" },
        },
      },
      {
        $lookup: {
          from: "medicines",
          localField: "_id",
          foreignField: "_id",
          as: "medicineDetails",
        },
      },
      {
        $unwind: "$medicineDetails",
      },
      {
        $project: {
          medicineId: "$medicineDetails._id",
          medicineName: "$medicineDetails.name",
          quantitySold: 1,
          totalSales: 1,
        },
      },
    ]);

    console.log("Filtered Sales Data (Backend):", salesData);

    res.json({ salesData });
  } catch (error) {
    console.error("Error fetching total sales:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllNotifications = async (req, res) => {
  try {
    const pharmacistId = req.params.pharmacistId;
    const notifications = await Notification.find({ pharmacistId }).sort(
      "-timestamp"
    );
    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const uploadMedicineImage = async (req, res) => {
  try {
    const filename = req.file.filename;
    
    // Validate that the required fields are provided
    const name = req.body.name
    // Find the medicine by its name
    const existingMedicine = await Medicine.findOneAndUpdate({ name },{image:filename},{new:true});

    if (!existingMedicine) {
      return res.status(404).json({ message: "Medicine not found." });
    }
    res.status(200).json(existingMedicine);
  } catch (error) {
    // Handle any errors that may occur during the update
    res.status(500).json({ error: "Internal Server Error" });
    console.error(error.message);
  }
};
const uploadID = async (req, res) => {
  try {
    const filename = req.file.filename;
    const _id= req.query.id;
    // Validate that the required fields are provided
    
    const pharmacist = await Pharmacist.findOneAndUpdate({ _id },{PharmacistId:filename},{new:true});
    
    if (!pharmacist) {
      return res.status(404).json({ message: "Medicine not found." });
    }
    res.status(200).json(pharmacist);
  } catch (error) {
    // Handle any errors that may occur during the updates
    
    res.status(500).json({ error: "Internal Server Error" });
    console.error(error.message);
  }
};
const uploadPharmacyDegree = async (req, res) => {
  try {
    const filename = req.file.filename;
    const _id= req.query.id;
    // Validate that the required fields are provided

    const pharmacist = await Pharmacist.findOneAndUpdate({ _id },{pharmacyDegree:filename},{new:true});

    if (!pharmacist) {
      return res.status(404).json({ message: "Medicine not found." });
    }
    res.status(200).json(pharmacist);
  } catch (error) {
    // Handle any errors that may occur during the update
    res.status(500).json({ error: "Internal Server Error" });
    console.error(error.message);
  }
};
const uploadWorkingLicences = async (req, res) => {
  try {
    const filename = req.file.filename;
    const _id= req.query.id;
    // Validate that the required fields are provided

    const pharmacist = await Pharmacist.findOneAndUpdate({ _id },{workingLicense:filename},{new:true});

    if (!pharmacist) {
      return res.status(404).json({ message: "Medicine not found." });
    }
    res.status(200).json(pharmacist);
  } catch (error) {
    // Handle any errors that may occur during the update
    res.status(500).json({ error: "Internal Server Error" });
    console.error(error.message);
  }
};
module.exports = {
  addmedicine,
  getAvailableMedicines,
  viewMedicineStats,
  searchMedicineByName,
  filterMedicineByMedicalUse,
  editMedicine,
  addQuantityToMedicine,
  uploadMedicineImage,
  archiveMedicine,
  unarchiveMedicine,
  viewSales,
  viewSalesThree,
  sendOutOfStockNotifications,
  getAllNotifications,
  uploadMedicineImage,
  uploadWorkingLicences,
  uploadPharmacyDegree,
  uploadID
  };
