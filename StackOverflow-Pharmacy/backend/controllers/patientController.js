const mongoose = require("mongoose"); // Import mongoose
const User = require("../models/userModel");
const Pharmacist = require("../models/pharmacist"); // Import the Pharmacist model
const Patient = require("../models/patient");
const Order = require("../models/orderModel");
const cartModel = require("../models/cartModel");
const Medicine = require("../models/medicineModel");
const Address = require("../models/addressmodel");
const Prescription = require("../models/prescriptionModel");
const Notification = require("../models/notificationModel");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)
const nodemailer = require("nodemailer");
//const Package= require('../models/package')
const jwt = require("jsonwebtoken");
const { Types } = mongoose;
const { ObjectId } = require("mongoose").Types;
const createWebToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET_KEY, { expiresIn: "1d" });
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
const getAlternativeMedicines = async (req, res) => {
  try {
    const { id } = req.params; // Assuming you pass the medicine id in the URL params

    // Find the medicine by ID
    const targetMedicine = await Medicine.findById(id);

    if (!targetMedicine) {
      return res.status(404).json({ message: "Medicine not found." });
    }

    // Get the main active ingredient from the target medicine
    const mainIngredient = targetMedicine.activeIngredients[0];

    // Find alternative medicines with the same main active ingredient
    const alternativeMedicines = await Medicine.find({
      _id: { $ne: targetMedicine._id }, // Exclude the target medicine itself
      activeIngredients: { $elemMatch: { $eq: mainIngredient } },
      numStock: { $gt: 0 }, // Only include medicines with stock available
    });

    if (alternativeMedicines.length === 0) {
      return res
        .status(404)
        .json({ message: "No alternative medicines with stock available." });
    }

    res.status(200).json(alternativeMedicines);
  } catch (error) {
    console.error(error);
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
const addToCart = async (req, res) => {
  try {
    if (!req.user) {
      console.log("Unauthenticated user attempted to add to cart.");
      return res.status(401).json({ error: "Unauthenticated" });
    }

    const patientUserId = req.user.id;

    // Find the patient's cart or create a new one if it doesn't exist
    let cart = await cartModel.findOne({ userID: patientUserId });

    if (!cart) {
      // If the patient doesn't have a cart, create a new one
      console.log("Creating a new cart for the patient.");
      cart = new cartModel({ userID: patientUserId, items: [] });
    }

    // Get the medicine ID from the request parameters
    const { medicineId } = req.params;
    console.log("Medicine ID:", medicineId);

    // Find the medicine by ID
    const medicine = await Medicine.findById(medicineId);

    if (!medicine) {
      console.log("Medicine not found for ID:", medicineId);
      return res.status(404).json({ message: "Medicine not found." });
    }

    // Check if the medicine is already in the cart
    const existingItem = cart.items.find(
      (item) => item.id.toString() === medicineId
    );

    if (existingItem) {
      // If the medicine is already in the cart, you may want to increment the count instead of adding a new item
      existingItem.count += 1;
      console.log("Incremented count for existing item:", existingItem);
    } else {
      // Add the medicine to the patient's cart
      console.log("Adding a new item to the cart.");
      cart.items.push({ id: medicineId, count: 1 });
    }

    // Save the cart with the new medicine
    await cart.save();
    console.log("Cart updated and saved.");

    res.status(200).json({ message: "Medicine added to cart." });
  } catch (error) {
    console.error("Error adding medicine to cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getPatientCart = async (req, res) => {
  try {
    const userId = req.params.userId; // Get the user ID from the URL parameter
    console.log("User ID:", userId);

    // Find the patient's cart using the provided user ID
    const cart = await cartModel.findOne({ userID: userId }).exec();
    console.log("Cart:", cart);

    if (!cart) {
      console.log("No cart found.");
      // If no cart is found, return an empty JSON object
      return res.status(204).json({});
    }

    // Check if 'items' is defined
    if (cart.items && cart.items.length > 0) {
      console.log("Items found in cart:", cart.items);

      // Manually populate the 'items' array with related 'Medicine' documents
      const populatedCart = {
        ...cart._doc,
        items: await Promise.all(
          cart.items.map(async (item) => {
            const medicine = await Medicine.findById(item.id);
            return {
              id: medicine,
              count: item.count,
            };
          })
        ),
      };

      console.log("Cart after manual population:", populatedCart);

      res.status(200).json(populatedCart);
    } else {
      // No items in the cart
      res.status(204).json(cart);
    }
  } catch (error) {
    console.error("Error fetching patient cart:", error);
    res.status(500).json({ error: error.message }); // Return the error message
  }
};

const removePatientCart = async (req, res) => {
  try {
    const userId = req.params.userId; // Get the user ID from the URL parameter
    console.log("User ID:", userId);

    // Find and remove the patient's cart using the provided user ID
    const removedCart = await cartModel
      .findOneAndRemove({ userID: userId })
      .exec();

    if (!removedCart) {
      console.log("No cart found to remove.");
      // If no cart is found, return an empty JSON object or appropriate response
      return res.status(204).json({});
    }

    console.log("Cart removed successfully:", removedCart);

    res.status(200).json({ message: "Cart removed successfully" });
  } catch (error) {
    console.error("Error removing patient cart:", error);
    res.status(500).json({ error: error.message }); // Return the error message
  }
};

const removeFromCart = async (req, res) => {
  try {
    // Log incoming request details
    console.log("Request headers:", req.headers);
    console.log("Request user:", req.user); // Assuming you attach the user to the request object

    // Get the patient's user ID from the request (you need user authentication)
    const patientUserId = req.user.id; // Assuming you have user authentication

    // Get the medicine ID from the request parameters
    const { medicineId } = req.params;

    // Find the patient's cart by their user ID
    const cart = await cartModel.findOne({ userID: patientUserId });

    if (!cart) {
      return res
        .status(404)
        .json({ message: "Cart not found for the patient." });
    }

    // Find the index of the medicine to remove in the cart items array
    const itemIndex = cart.items.findIndex(
      (item) => item.id.toString() === medicineId
    );

    if (itemIndex === -1) {
      return res
        .status(404)
        .json({ message: "Medicine not found in the cart." });
    }

    // Remove the item from the cart
    cart.items.splice(itemIndex, 1);

    // Save the updated cart
    await cart.save();

    // Return a success response
    res.status(200).json({ message: "Medicine removed from the cart." });
  } catch (error) {
    // Handle any errors that may occur during the process
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// Adjust the quantity of a medicine in the cart
const adjustQuantity = async (req, res) => {
  try {
    const patientUserId = req.user.id; // Assuming you have user authentication

    const { medicineId } = req.params;
    const { quantity } = req.body;

    // Find the patient's cart using their user ID
    const cart = await cartModel.findOne({ userID: patientUserId });

    if (!cart) {
      return res
        .status(404)
        .json({ message: "Cart not found for the patient." });
    }

    const cartItem = cart.items.find(
      (item) => item.id.toString() === medicineId
    );

    if (!cartItem) {
      return res
        .status(404)
        .json({ message: "Medicine not found in the cart." });
    }

    // Update the quantity of the medicine in the cart
    cartItem.count = quantity;

    await cart.save();

    res.status(200).json({
      message: "Medicine quantity adjusted successfully.",
      quantity: cartItem.count,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getDeliveryAddress = async (req, res) => {
  try {
    const patientUserId = req.user.id; // Assuming you have user authentication

    // Fetch the patient with populated addresses
    const patient = await Patient.findOne({ _id: patientUserId }).populate(
      "addresses"
    );

    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    const addresses = patient.addresses;

    if (!addresses || addresses.length === 0) {
      return res
        .status(404)
        .json({ message: "Addresses not found for the patient." });
    }

    res.status(200).json({ addresses });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateDeliveryAddress = async (req, res) => {
  try {
    const patientUserId = req.user.id; // Assuming you have user authentication
    const newAddressData = req.body; // Assuming the request body contains the new address data

    console.log("Updating delivery address. User ID:", patientUserId);
    console.log("New Address:", newAddressData); // Log the new address data received in the request

    // Create a new Address document with the provided data
    const newAddress = new Address(newAddressData);

    // Save the new address
    const savedAddress = await newAddress.save();

    // Get the ObjectId of the saved address
    const addressObjectId = savedAddress._id;

    // Update the patient by pushing the new address ObjectId into the addresses array
    const patient = await Patient.findOneAndUpdate(
      { _id: patientUserId },
      { $push: { addresses: addressObjectId } },
      { new: true }
    );

    if (!patient) {
      console.log("Patient not found.");
      return res.status(404).json({ message: "Patient not found." });
    }

    console.log("Address added successfully.");
    res.status(201).json({ message: "Address added successfully." });
  } catch (error) {
    console.error("Error updating delivery address:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const managePatientAddresses = async (req, res) => {
  try {
    const patientId = req.params.patientId;

    if (!patientId) {
      return res.status(400).json({ message: "Please provide a patient ID." });
    }

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    if (req.method === "GET") {
      // Return the patient's addresses for a GET request
      return res.status(200).json(patient.addresses);
    } else if (req.method === "POST") {
      // For a POST request, add a new address
      const newAddress = req.body;

      if (!newAddress) {
        return res
          .status(400)
          .json({ message: "Please provide an address to add." });
      }

      patient.addresses.push(newAddress);
      await patient.save();

      return res.status(201).json(patient.addresses);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
const saveSelectedAddress = async (req, res) => {
  try {
    const patientUserId = req.user.id; // Assuming you have user authentication
    const selectedAddress = req.body; // Assuming the request body contains the selected address

    // Find the patient by their user ID
    const patient = await Patient.findOne({ _id: patientUserId });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    // Save the selected address to the patient's profile
    patient.selectedAddress = selectedAddress;
    await patient.save();

    res.status(201).json({ message: "Selected address saved successfully." });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const createOrder = async (req, res) => {
  try {
    const { userID, items, address, phone, deliveryPrice, paymentType } =
      req.body;

    console.log("Received Order Request:", req.body);

    // Validate the request payload
    if (!userID || !items || !Array.isArray(items) || items.length === 0) {
      console.log("Invalid request payload.");
      return res.status(400).json({ message: "Invalid request payload." });
    }

    // Check if paymentType is a valid enum value
    const validPaymentTypes = ["Cash", "Card", "Wallet"];
    if (!validPaymentTypes.includes(paymentType)) {
      console.log("Invalid paymentType.");
      return res.status(400).json({ message: "Invalid paymentType." });
    }

    // Check if each item in the items array has price and medicine fields
    if (items.some((item) => !item.price || !item.medicine)) {
      console.log("Invalid item in the items array.");
      return res
        .status(400)
        .json({ message: "Invalid item in the items array." });
    }

    // Convert the addressId to a valid ObjectId
    const validAddressId = ObjectId.isValid(address)
      ? new ObjectId(address)
      : null;

    // Find the address by its ID
    const addresss = await Address.findById(validAddressId);

    if (!addresss) {
      console.log("Address not found. Invalid addressId:", address);
      return res.status(404).json({ message: "Address not found." });
    }

    // Check if the numStock is sufficient for each item in the order
    for (const item of items) {
      const { medicine, count } = item;
      const existingMedicine = await Medicine.findById(medicine);

      if (!existingMedicine || existingMedicine.numStock < count) {
        console.log(`Not enough stock for medicine ${medicine}.`);
        return res
          .status(400)
          .json({ message: `Not enough stock for medicine ${medicine}.` });
      }
    }

    // Map the items to the structure expected by the Order schema
    const orderItems = items.map((item) => ({
      medicine: item.medicine,
      count: item.count,
      price: item.price,
    }));

    // Create a new order with the associated address and items
    const newOrder = new Order({
      userID,
      items: orderItems,
      address: validAddressId,
      phone,
      deliveryPrice,
      paymentType,
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();

    console.log("Order created successfully:", savedOrder);

    // Update the numStock and numSold values in the Medicine model
    for (const item of orderItems) {
      const { medicine, count } = item;

      const result = await Medicine.updateOne(
        { _id: medicine, numStock: { $gte: count } },
        {
          $inc: { numStock: -count, numSold: count },
        }
      );
      // Fetch the updated medicine information
      const updatedMedicine = await Medicine.findById(medicine);

      if (updatedMedicine.numStock <= 0) {
        console.log(
          `Sending notification for out-of-stock medicine: ${updatedMedicine.name}`
        );

        // Fetch pharmacists' emails
        const recipientEmails = await fetchPharmacistEmails();

        // Log the recipient emails
        console.log("Recipient emails:", recipientEmails);

        // Send out-of-stock notifications
        await sendOutOfStockNotifications(updatedMedicine.name);
      }
    }

    res.status(201).json({ order: savedOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const fetchPharmacistEmails = async () => {
  try {
    // Fetch users with the role 'Pharmacist'
    const userPharmacists = await User.find({ role: "Pharmacist" });

    // Extract pharmacist IDs
    const pharmacistIds = userPharmacists.map((pharmacist) => pharmacist._id);

    // Fetch pharmacist details using IDs
    const pharmacistDetails = await Pharmacist.find({
      _id: { $in: pharmacistIds },
    });

    // Extract and return pharmacist emails
    return pharmacistDetails.map((pharmacist) => pharmacist.email);
  } catch (error) {
    console.error("Error fetching pharmacist emails:", error);
    return [];
  }
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "boodee19730000@gmail.com",
    pass: "elxi ncik jjpj iwxc",
  },
});

// Send email notification
const sendEmailNotification = async (recipientEmail, subject, message) => {
  const mailOptions = {
    from: "boodee19730000@gmail.com",
    to: recipientEmail,
    subject: subject,
    text: message,
  };

  await transporter.sendMail(mailOptions);
};
// Fetch all pharmacists and send email notifications
const sendOutOfStockNotifications = async (medicineName) => {
  try {
    // Fetch users with the role 'Pharmacist'
    const userPharmacists = await User.find({ role: 'Pharmacist' });

    // Extract pharmacist IDs
    const pharmacistIds = userPharmacists.map((pharmacist) => pharmacist._id);

    if (pharmacistIds.length === 0) {
      console.log("No pharmacists to notify.");
      return; // Exit early if there are no pharmacists
    }

    // Fetch pharmacist details using IDs
    const pharmacistDetails = await Pharmacist.find({
      _id: { $in: pharmacistIds },
    });

    // Extract pharmacist emails
    const pharmacistEmails = pharmacistDetails.map(
      (pharmacist) => pharmacist.email
    );

    // Use Promise.all to wait for all email notifications to be sent
    await Promise.all(
      pharmacistDetails.map(async (pharmacist) => {
        const subject = `Out of Stock Notification - ${medicineName}`;
        const message = `Medicine ${medicineName} is out of stock.`;
    
        // Send email notification
        await sendEmailNotification(pharmacist.email, subject, message);
    
        // Save notification to the database
        await Notification.create({
          pharmacistId: pharmacist._id, // Assuming _id is the pharmacist ID
          message,
        });
      })
    );

    console.log(
      `Out of stock notifications for ${medicineName} sent and saved successfully.`
    );
  } catch (error) {
    console.error("Error sending out of stock notifications:", error);
  }
};


// Add this function to your server-side code
const getOrdersByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Validate the user ID
    if (!Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ message: "Please provide a valid user ID." });
    }

    // Find the orders by user ID and populate the 'address' field
    const orders = await Order.find({ userID: userId }).populate("address");

    if (!orders || orders.length === 0) {
      console.log("No orders found for the provided user ID.");
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders by user ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    // Find the order by its ID
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if the order belongs to the authenticated patient (you need user authentication)
    if (order.userID.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to cancel this order." });
    }

    // Check if the order status is not 'Cancelled' already
    if (order.status === "Cancelled") {
      return res
        .status(400)
        .json({ message: "This order has already been cancelled." });
    }

    // Reverse the logic for each medicine in the order
    for (const item of order.items) {
      const medicineId = item.medicine;

      // Find the medicine by its ID
      const medicine = await Medicine.findById(medicineId);

      if (medicine) {
        // Update the numStock and numSold fields based on the canceled order
        medicine.numStock += item.count; // Add the canceled quantity back to numStock
        medicine.numSold -= item.count; // Subtract the canceled quantity from numSold

        // Save the updated medicine details
        await medicine.save();
      }
    }

    // Update the order status to 'Cancelled'
    order.status = "Cancelled";
    await order.save();

    res.status(200).json({ message: "Order cancelled successfully.", order });
  } catch (error) {
    // Handle any errors that may occur during the process
    console.error("Error cancelling order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const addPrescription = async (req, res) => {
  try {
    const { patientId, medicines, description } = req.body;

    console.log("Request Body:", req.body);

    // Create an array to store the references to the Medicine documents
    const medicineReferences = [];

    // Create or find each medicine and store its ObjectId in the array
    for (const medicine of medicines) {
      const existingMedicine = await Medicine.findOne({ name: medicine.name });

      if (existingMedicine) {
        // Use the existing Medicine's ObjectId
        medicineReferences.push(existingMedicine._id);
      } else {
        // Create a new Medicine
        const newMedicine = new Medicine({ name: medicine.name });
        const savedMedicine = await newMedicine.save();
        medicineReferences.push(savedMedicine._id);
      }
    }

    // Create a new prescription with the array of medicine references
    const newPrescription = new Prescription({
      patientID: patientId,
      content: medicineReferences.map((medicineId, index) => ({
        medicine: medicineId,
        dosage: medicines[index].dosage || "",
      })),
      description: description,
    });

    console.log("New Prescription:", newPrescription);

    // Save the prescription to the database
    const savedPrescription = await newPrescription.save();

    console.log("Saved Prescription:", savedPrescription);

    res.status(201).json({ success: true, prescription: savedPrescription });
  } catch (error) {
    console.error("Error adding prescription:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const getPrescriptionMedicines = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch the latest prescription for the specified user
    const latestPrescription = await Prescription.findOne({
      patientID: userId,
    })
      .sort({ date: -1 }) // Sort by date in descending order to get the latest prescription
      .populate("content.medicine"); // Assuming "content.medicine" is the reference to the Medicine model

    if (!latestPrescription) {
      return res
        .status(404)
        .json({ message: "No prescription found for the user" });
    }

    // Extract medicines from the latest prescription
    const prescriptionMedicines = latestPrescription.content;

    res.status(200).json(prescriptionMedicines);
  } catch (error) {
    console.error("Error fetching prescription medicines:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const payWithStripe = async (req, res) => {
  try {
    const price = req.body.price;
    console.log("priceeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");

   // console.log(req.body.items);

    const lineItems = await Promise.all(req.body.items.map(async (item) => {
      console.log(item.id._id)
      const storeItem = await Medicine.findOne({ _id: item.id._id });
      console.log("jjjjjjj",storeItem.name)
      const unitAmount = Math.round(storeItem.price * 100);
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: storeItem.name,
          },
          unit_amount: unitAmount,
        },
        quantity: item.count,
      };
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: "http://localhost:3000/medicines",
      cancel_url: "http://localhost:3000/checkout",
    });

    res.json({ url: session.url });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ error: e.message });
  }
};const payWithWallet = async (req, res) => {
  try {
    const price = req.body.price;
    const _id=req.body.ID
    console.log(price)
  //  console.log(cart)
    // Find the order by its ID
    const user =User.findOne({_id})
    

    if(user.wallet>=price){
      user.wallet-=price
      return res.status(200).json({ message: 'payment is done successfully.' }); 
    }
    else{
      return res.status(403).json({ message: 'moeny in the wallet is not enough.' });
    }

  } catch (error) {
    // Handle any errors that may occur during the process
    console.log(error.message)
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = {
  getAvailableMedicines,
  getAlternativeMedicines,
  searchMedicineByName,
  filterMedicineByMedicalUse,
  addToCart,
  getPatientCart,
  removePatientCart,
  removeFromCart,
  adjustQuantity,
  getDeliveryAddress,
  updateDeliveryAddress,
  saveSelectedAddress,
  createOrder,
  managePatientAddresses,
  getOrdersByUserId,
  cancelOrder,
  addPrescription,
  getPrescriptionMedicines,
  payWithStripe,
  payWithWallet
  
};
