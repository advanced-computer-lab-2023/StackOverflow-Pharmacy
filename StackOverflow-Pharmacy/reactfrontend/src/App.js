// App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CssBaseline from '@mui/material/CssBaseline'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import WelcomePage from "./components/WelcomePage";
import Login from "./components/Login";
import SignUpPatient from "./components/SignUpPatient";
import SignUpPharmacist from "./components/SignUpPharmacist";
import ChooseSignUpType from "./components/ChooseSignUpType";
import PharmacistHome from "./components/PharmacistHome";
import PatientHome from "./components/PatientHome";
import AdminHome from "./components/AdminHome";
import MedicineList from "./components/MedicineList";
import PhamaMedicinesList from "./components/PhamaMedicinesList";
import AdminMedicines from "./components/AdminMedicines";
import SearchResults from "./components/SearchResults";
import FilteredMedicines from "./components/FilteredMedicines";
import ViewCart from "./components/ViewCart";
import Checkout from "./components/Checkout";
import OrderDetails from "./components/OrderDetails";
import Request from "./components/Request";
import UploadImage from "./components/UploadImage";
import UploadDocuments from "./components/uploadDocuments";
import ForgotPassword from "./components/ForgotPassword";
import OTPEntry from "./components/OTPEntry";
import SetNewPassword from "./components/SetNewPassword";
import ChangePassword from './components/ChangePassword';
import MedicineStatsPage from "./components/MedicineStatsPage";
import AddMedicine from './components/AddMedicine';
import EditMedicinePage from "./components/EditMedicinePage";
import AddAdminPage from "./components/AddAdminPage";
import RemovePharmacist from "./components/RemovePharmacist";
import RemovePatient from "./components/RemovePatient";
import ViewPharmacistInfo from "./components/ViewPharmacistInfo";
import ViewpatientInfo from "./components/ViewPatientInfo";
import TotalSalesReport from './components/TotalSalesReport';
import PTotalSales from './components/PTotalSales';
import AddPrescription from "./components/AddPrescription";
import PrescriptionMedicinesPage from "./components/PrescriptionMedicinesPage";
import AllNotifications from "./components/AllNotifications";
import ResponsiveAppBar from './components/ResponsiveAppBar';
import Chat from './components/testchat';
import MainComponent from './components/MainComponent';
import Wallet from './components/viewWallet';

import { ThemeProvider } from '@mui/material/styles';
import theme from './styles/theme'; 

function App() {
  const [loginError, setLoginError] = useState("");

  return (
    <ThemeProvider theme={theme}>
       <CssBaseline /> {/* Add CssBaseline here */}
    <Router>
    <ResponsiveAppBar />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route
          path="/login"
          element={<Login setLoginError={setLoginError} />}
        />
        {loginError !== "Invalid password. Please try again." && (
          <>
            <Route path="/signup/patient" element={<SignUpPatient />} />
            <Route path="/signup/pharmacist" element={<SignUpPharmacist />} />
            <Route path="/choose-signup-type" element={<ChooseSignUpType />} />
            <Route path="/pharmacist-home" element={<PharmacistHome />} />
            <Route path="/patient-home" element={<PatientHome />} />
            <Route path="/admin-home" element={<AdminHome />} />
            <Route path="/medicines" element={<MedicineList />} />
            <Route path="/medicines-pharma" element={<PhamaMedicinesList />} />
            <Route path="/medicines-admin" element={<AdminMedicines />} />
            <Route path="/search-results" element={<SearchResults />} />
            <Route path="/filtered" element={<FilteredMedicines />} />
            <Route path="/viewCart/:userId" element={<ViewCart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<OrderDetails />} />
            <Route path="/requests" element={<Request />} />
            <Route path="/upload-image" element={<UploadImage />} />
            <Route path="/upload-Documents" element={<UploadDocuments />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<OTPEntry />} />
            <Route path="/set-new-password" element={<SetNewPassword />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/medicine-stats" element={<MedicineStatsPage />} />
            <Route path="/add-medicine" element={<AddMedicine />} />
            <Route path="/edit-medicine" element={<EditMedicinePage />} />
            <Route path="/add-admin" element={<AddAdminPage />} />
            <Route path="/remove-pharmacist" element={<RemovePharmacist />} />
            <Route path="/remove-patient" element={<RemovePatient />} />
            <Route path="/view-pharmacist-info" element={<ViewPharmacistInfo />} />
            <Route path="/view-patient-info" element={<ViewpatientInfo />} />
            <Route path="/total-sales" element={<TotalSalesReport />} />
            <Route path="/tootal-sales" element={<PTotalSales />} />
            <Route path="/add-prescription" element={<AddPrescription />} />
            <Route path="/prescriptionMedicines/:userId" element={<PrescriptionMedicinesPage />} />
            <Route path="/notifications" element={<AllNotifications />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/MainComponent" element={<MainComponent />} />
            <Route path="/wallet" element={<Wallet />} />
          </>
        )}
      </Routes>
    </Router>
    </ThemeProvider>
  );
}

export default App;
