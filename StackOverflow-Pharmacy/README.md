

# pharmacy platform

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

Pharmacy platphorm is an online store platform that a patient can use to buy their medicines and pharmacist can use to sell theire product to make the payment easy from anywhere ,and patients can communicate with pharmacist any time if they need to ask for anything.

# Motivation

In the past decade, people worldwide started heading for buying  everything through online store platforms and pharmacist started posting there medicines materials all over the internet. The Main idea behind pharmacy is to allow pharmacist to post theire medicines in the platform and patients can access them easly and contact with pharmacist and doctors easly.


# Build status
  - it will be better ui and ux if we use template
  - There is issue with mergeing with another clinic platphorm so patient can not chat with doctor 

# Features

- If you are a patient, you can:
  - add an over the counter medicine in my cart
  - view cart items
  - remove an item from the cart
  - change the amount of an item in the cart
  - checkout my order 
  - add a new delivery address (or multiple addresses)
  - choose a delivery address from the delivery addresses available
  - choose to pay with wallet, credit card (using Stripe) or cash on delivery
  - view order details and status
  - cancel an order
  - add a prescription medicine to my cart based on my prescription
  - view current and past orders
  - view alternatives to a medicine that is out of stock based on main active ingredient
  - chat with a pharmacist
  - view the amount in my wallet
- If you are a pharmacist, you can:
  - view the available quantity, and sales of each medicine
  - add a medicine with its details (active ingredients) , price and available quantity 
  - edit medicine details and price
  - upload and submit required documents upon registration such as ID, pharmacy degree anf Working licenses  
  - upload medicine image
  - archive/ unarchive a medicine
  - filter sales report based on a medicine/date
  - chat with a doctor
  - Receive a notification once a medicine is out of stock on the system and via email
- If you are an admin, you can:
  - add another adminstrator with a set username and password
  - remove a pharmacist/patient from the system
  - view all of the information uploaded by a pharmacist to apply to join the platform
  - view a pharmacist's information
  - view a patients's basic information
  - accept or reject the request of a pharmacist to join the platform
  - view a total sales report based on a chosen month

# Code Examples
- user  model.

```sh
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
  },
  role: {
    type: String,
    enum: ['Pharmacist', 'Patient', 'Administrator'],
  },
  passwordResetOtp: {
    type: Number, 
  },
  passwordResetOtpExpiry: {
    type: Date,
  },
  wallet:{
    type:Number,
    default:1000
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;

```
- some method from user  controller.

```sh
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
```
- Admin home page in front .

```sh
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";


function AdminHome() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Admin Home Page</h1>
      <Link to="/requests">
        <button >ViewRequests</button>
        </Link>
        <Button onClick={() => navigate("/change-password")}>
          Change Password
        </Button>
    </div>
  );
}

export default AdminHome;
```
# API Refrences 
- http://localhost:4000/api/users/register
- http://localhost:4000/api/users/submit
- http://localhost:4000/api/users/PharmacistSignUp
- http://localhost:4000/api/users/PatientSignUp
- http://localhost:4000/api/users/login
- http://localhost:4000/api/users/getData
- http://localhost:4000/api/users/profile
- http://localhost:4000/api/users/logout
- http://localhost:4000/api/users/changePassword/:userId
- http://localhost:4000/api/users/forgotPassword
- http://localhost:4000/api/users/checkOTP
- http://localhost:4000/api/users/updatePassword
- http://localhost:4000/api/users/getChats
- http://localhost:4000/api/users/getUsername
- http://localhost:4000/api/users/sendmessage
- http://localhost:4000/api/users/createChat
- http://localhost:4000/api/users/searchToChat
- http://localhost:4000/api/users/getWallet
- http://localhost:4000/api/pharmacists/addmedicine
- http://localhost:4000/api/pharmacists/medicines
- http://localhost:4000/api/pharmacists/medicines/stats
- http://localhost:4000/api/pharmacists/medicines/search
- http://localhost:4000/api/pharmacists/medicines/medical-use
- http://localhost:4000/api/pharmacists/medicines/edit
- http://localhost:4000/api/pharmacists/medicines/add-quantity
- http://localhost:4000/api/pharmacists/medicines/upload-image
- http://localhost:4000/api/pharmacists/uploadID/:id
- http://localhost:4000/api/pharmacists/uploadWorkingLicences/:iduploadPharmacyDegree/:id
- http://localhost:4000/api/pharmacists
- http://localhost:4000/api/pharmacists
- http://localhost:4000/api/patient/medicines
- http://localhost:4000/api/patient/medicines/filter
- http://localhost:4000/api/patient/medicines/search
- http://localhost:4000/api/patient/medicines/cart/:medicineId
- http://localhost:4000/api/patient/cart/:userId
- http://localhost:4000/api/patient/medicines/cart/adjust/:medicineId
- http://localhost:4000/api/patient/:userId/addresses
- http://localhost:4000/api/patient/update-delivery-address
- http://localhost:4000/api/patient/save-selected-address
- http://localhost:4000/api/patient/create-order
- http://localhost:4000/api/patient/payWithStripe
- http://localhost:4000/api/patient/payWithWallet
- http://localhost:4000/api/patient/orders/:orderId/cancel
- http://localhost:4000/api/patient/orders/user/:userId
- http://localhost:4000/admin/addadmin
- http://localhost:4000/admin/pharmacist/:id
- http://localhost:4000/admin/patient/:id
- http://localhost:4000/admin/pharmacist/:id
- http://localhost:4000/admin/medicines/search
- http://localhost:4000/admin/medicines/filter
- http://localhost:4000/admin/logout
- http://localhost:4000/admin/viewPharmacist
- http://localhost:4000/admin/login
- http://localhost:4000/admin/user
- http://localhost:4000/admin/logout
- http://localhost:4000/admin/accept
- http://localhost:4000/admin/reject
# Tests
- we use postman to  test our backend 
# How to Use 
first you should register if you do not have an acount and then you can login you will be in homepage 
there is a dashboard in the right you can hover in it to choose any thing you want like chat or view order and if you want to buy  items you can go to view medicine if you want to logout you can use logout button beside dashboard
# Screenshots

### welcome

  <img src = "./reactfrontend/public/welcome.jpeg" style = "width: 100%;">



### Sign Up

  <img src = "./reactfrontend/public/sign up.jpeg" style = "width: 100%;">

### Log in

  <img src = "./reactfrontend/public/login.jpeg" style = "width: 100%;">


### medicines

  <img src = "./reactfrontend/public/medicines.jpeg" style = "width: 100%;">



# Code Style

The application is built in Client/Server architecture, where the server logic is written in the `server` directory and the client is in the `client` directory.

## Technology and Framework

pharmacy uses a number of open-source projects to work properly:

- [React](https://reactjs.org/) - Front-end
- [mui](https://mui.com/) - UI
- [node.js] - Backend
- [Express] - Backend
- [MongoDB](https://www.mongodb.com/home) - Database

## Installation & Running

Install the dependencies and start the server.

```sh
cd StackOverflow-Pharmacy
cd backend
npm i --force
cd ..
cd reactfrontend
npm i
npm start
```



# Credits

This project is delivered by a group of 2 Engineering students at the German University in Cairo:

- [omar mansour mohamed](https://github.com/omar100abdelaal)
- [abdallah ibrahim arrafat](https://github.com/abdullah-ibrahim0)


with the help of all the amazing and supportive TAs and the great professor Dr. Mervat Abu-ElKheir.

# Contribute

If you want to contribute to this project, email us at (om707732@gmail.com). And if you have suggestions don't hesitate to open an issue about it.

# License

This application is licensed under [Stripe] Licenses.

[//]: # "These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format it nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax"
[node.js]: http://nodejs.org
[express]: http://expressjs.com
