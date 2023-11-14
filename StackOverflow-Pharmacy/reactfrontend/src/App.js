// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Header from './components/Header';
import WelcomePage from './components/WelcomePage';
import Login from './components/Login';
import SignUpPatient from './components/SignUpPatient';
import SignUpPharmacist from './components/SignUpPharmacist';
import ChooseSignUpType from './components/ChooseSignUpType';
import PharmacistHome from './components/PharmacistHome';
import PatientHome from './components/PatientHome';
import AdminHome from './components/AdminHome';
import MedicineList from './components/MedicineList';
import SearchResults from './components/SearchResults'; 
import FilteredMedicines from './components/FilteredMedicines';
import ViewCart from './components/ViewCart';
import Checkout from './components/Checkout';
import OrderDetails from './components/OrderDetails';
import PrivateRoute from './PrivateRoute';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup/patient" element={<SignUpPatient />} />
        <Route path="/signup/pharmacist" element={<SignUpPharmacist />} />
        <Route path="/choose-signup-type" element={<ChooseSignUpType />} />
        <Route path="/pharmacist-home" element={<PharmacistHome />} />
        <Route path="/patient-home" element={<PatientHome />} />
        <Route path="/admin-home" element={<AdminHome />} />
        <Route path="/medicines" element={<MedicineList />} />
        <Route path="/search-results" element={<SearchResults />} /> 
        <Route path="/filtered" element={<FilteredMedicines />} />
        <Route path="/viewCart/:userId" element={<ViewCart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<OrderDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
