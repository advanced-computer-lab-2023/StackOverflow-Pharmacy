const mongoose = require('mongoose'); // Import mongoose

const Patient = require('../models/patient')
const Order = require('../models/orderModel')
const cartModel = require('../models/cartModel')
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
const addToCart = async (req, res) => {
  try {
    if (!req.user) {
      console.log('Unauthenticated user attempted to add to cart.');
      return res.status(401).json({ error: 'Unauthenticated' });
    }

    const patientUserId = req.user.id;

    // Find the patient's cart or create a new one if it doesn't exist
    let cart = await cartModel.findOne({ userID: patientUserId });

    if (!cart) {
      // If the patient doesn't have a cart, create a new one
      console.log('Creating a new cart for the patient.');
      cart = new cartModel({ userID: patientUserId, items: [] });
    }

    // Get the medicine ID from the request parameters
    const { medicineId } = req.params;
    console.log('Medicine ID:', medicineId);

    // Find the medicine by ID
    const medicine = await Medicine.findById(medicineId);

    if (!medicine) {
      console.log('Medicine not found for ID:', medicineId);
      return res.status(404).json({ message: 'Medicine not found.' });
    }

    // Check if the medicine is already in the cart
    const existingItem = cart.items.find(item => item.id.toString() === medicineId);

    if (existingItem) {
      // If the medicine is already in the cart, you may want to increment the count instead of adding a new item
      existingItem.count += 1;
      console.log('Incremented count for existing item:', existingItem);
    } else {
      // Add the medicine to the patient's cart
      console.log('Adding a new item to the cart.');
      cart.items.push({ id: medicineId, count: 1 });
    }

    // Save the cart with the new medicine
    await cart.save();
    console.log('Cart updated and saved.');

    res.status(200).json({ message: 'Medicine added to cart.' });
  } catch (error) {
    console.error('Error adding medicine to cart:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



const getPatientCart = async (req, res) => {
  try {
    const userId = req.params.userId; // Get the user ID from the URL parameter
    console.log('User ID:', userId);

    // Find the patient's cart using the provided user ID
    const cart = await cartModel.findOne({ userID: userId }).exec();
    console.log('Cart:', cart);

    if (!cart) {
      console.log('No cart found.');
      // If no cart is found, return an empty JSON object
      return res.status(204).json({});
    }

    // Check if 'items' is defined
    if (cart.items && cart.items.length > 0) {
      console.log('Items found in cart:', cart.items);

      // Manually populate the 'items' array with related 'Medicine' documents
      const populatedCart = {
        ...cart._doc,
        items: await Promise.all(cart.items.map(async (item) => {
          const medicine = await Medicine.findById(item.id);
          return {
            id: medicine,
            count: item.count,
          };
        })),
      };

      console.log('Cart after manual population:', populatedCart);

      res.status(200).json(populatedCart);
    } else {
      // No items in the cart
      res.status(204).json(cart);
    }
  } catch (error) {
    console.error('Error fetching patient cart:', error);
    res.status(500).json({ error: error.message }); // Return the error message
  }
};





const removeFromCart = async (req, res) => {
  try {
    // Log incoming request details
    console.log('Request headers:', req.headers);
    console.log('Request user:', req.user); // Assuming you attach the user to the request object

      // Get the patient's user ID from the request (you need user authentication)
      const patientUserId = req.user.id; // Assuming you have user authentication

      // Get the medicine ID from the request parameters
      const { medicineId } = req.params;

      // Find the patient's cart by their user ID
      const cart = await cartModel.findOne({ userID: patientUserId });

      if (!cart) {
          return res.status(404).json({ message: 'Cart not found for the patient.' });
      }

      // Find the index of the medicine to remove in the cart items array
      const itemIndex = cart.items.findIndex(item => item.id.toString() === medicineId);

      if (itemIndex === -1) {
          return res.status(404).json({ message: 'Medicine not found in the cart.' });
      }

      // Remove the item from the cart
      cart.items.splice(itemIndex, 1);

      // Save the updated cart
      await cart.save();

      // Return a success response
      res.status(200).json({ message: 'Medicine removed from the cart.' });
  } catch (error) {
      // Handle any errors that may occur during the process
      res.status(500).json({ error: 'Internal Server Error' });
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
      return res.status(404).json({ message: 'Cart not found for the patient.' });
    }

    const cartItem = cart.items.find(item => item.id.toString() === medicineId);

    if (!cartItem) {
      return res.status(404).json({ message: 'Medicine not found in the cart.' });
    }

    // Update the quantity of the medicine in the cart
    cartItem.count = quantity;

    await cart.save();

    res.status(200).json({ message: 'Medicine quantity adjusted successfully.', quantity: cartItem.count });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
const getDeliveryAddress = async (req, res) => {
  try {
    const patientUserId = req.user.id; // Assuming you have user authentication

    // Fetch all addresses for the patient
    const patient = await Patient.findOne({ _id: patientUserId });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found.' });
    }

    const addresses = patient.addresses;

    if (!addresses || addresses.length === 0) {
      return res.status(404).json({ message: 'Addresses not found for the patient.' });
    }

    res.status(200).json({ addresses });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateDeliveryAddress = async (req, res) => {
  try {
    const patientUserId = req.user.id; // Assuming you have user authentication
    const newAddress = req.body; // Assuming the request body contains the new address

    // Find the patient by their user ID
    const patient = await Patient.findOne({ _id: patientUserId });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found.' });
    }

    // Add the new address to the patient's addresses
    patient.addresses.push(newAddress);
    await patient.save();

    res.status(201).json({ message: 'Address added successfully.' });
  } catch (error) {
    console.error('Error updating delivery address:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const managePatientAddresses = async (req, res) => {
  try {
      const patientId = req.params.patientId;

      if (!patientId) {
          return res.status(400).json({ message: 'Please provide a patient ID.' });
      }

      const patient = await Patient.findById(patientId);
      if (!patient) {
          return res.status(404).json({ message: 'Patient not found' });
      }

      if (req.method === 'GET') {
          // Return the patient's addresses for a GET request
          return res.status(200).json(patient.addresses);
      } else if (req.method === 'POST') {
          // For a POST request, add a new address
          const newAddress = req.body;

          if (!newAddress) {
              return res.status(400).json({ message: 'Please provide an address to add.' });
          }

          patient.addresses.push(newAddress);
          await patient.save();

          return res.status(201).json(patient.addresses);
      }
  } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
  }
};
const saveSelectedAddress = async (req, res) => {
  try {
    const patientUserId = req.user.id; // Assuming you have user authentication
    const selectedAddress = req.body; // Assuming the request body contains the selected address

    // Find the patient by their user ID
    const patient = await Patient.findOne({ _id: patientUserId });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found.' });
    }

    // Save the selected address to the patient's profile
    patient.selectedAddress = selectedAddress;
    await patient.save();

    res.status(201).json({ message: 'Selected address saved successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
const createOrder = async (req, res) => {
  try {
    const { userID, items, address, phone, deliveryPrice, paymentType } = req.body;

    console.log('Received Order Request:', req.body);

    // Validate the request payload
    if (!userID || !items || !Array.isArray(items) || items.length === 0) {
      console.log('Invalid request payload.');
      return res.status(400).json({ message: 'Invalid request payload.' });
    }

    // Check if paymentType is a valid enum value
    const validPaymentTypes = ['Cash', 'Card', 'Wallet'];
    if (!validPaymentTypes.includes(paymentType)) {
      console.log('Invalid paymentType.');
      return res.status(400).json({ message: 'Invalid paymentType.' });
    }

    // Check if each item in the items array has price and medicine fields
    if (items.some(item => !item.price || !item.medicine)) {
      console.log('Invalid item in the items array.');
      return res.status(400).json({ message: 'Invalid item in the items array.' });
    }

    // Create a new order
    const newOrder = new Order({
      userID,
      items,
      address,
      phone,
      deliveryPrice,
      paymentType,
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();

    console.log('Order created successfully:', savedOrder);

    res.status(201).json({ order: savedOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    // Validate the order ID
    if (!orderId) {
      return res.status(400).json({ message: 'Please provide a valid order ID.' });
    }

    // Find the order by ID
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    // Find the order by its ID
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if the order belongs to the authenticated patient (you need user authentication)
    if (order.userID.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to cancel this order.' });
    }

    // Check if the order status is not 'Cancelled' already
    if (order.status === 'Cancelled') {
      return res.status(400).json({ message: 'This order has already been cancelled.' });
    }

    // Update the order status to 'Cancelled'
    order.status = 'Cancelled';
    await order.save();

    res.status(200).json({ message: 'Order cancelled successfully.', order });
  } catch (error) {
    // Handle any errors that may occur during the process
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getAvailableMedicines,
  searchMedicineByName,
  filterMedicineByMedicalUse,
  addToCart,
  getPatientCart,
  removeFromCart,
  adjustQuantity,
  getDeliveryAddress,
  updateDeliveryAddress,
  saveSelectedAddress,
  createOrder,
  managePatientAddresses,
  getOrderById,
  cancelOrder
};
