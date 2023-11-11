import React from 'react';
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';

import './App.css'
import Home from './home';
import PatientPage from './patientpage';
import LoginForm from './LoginForm';
import CheckoutPage from './checkout';
import ResetPassword from './resetpassword';
import PharmacistRequestView from './adminpage';
import ResetPasswordView from './resetOtp';
import Login from './login';
import Logout from './logout';
import Changep from './changep';
import Viewdocapt from './viewdocapp';
import Viewhealth from './viewhealth';
import DocumentUpload from './uploadmedichistory';
import Viewdocs from './viewrequestdoc';
function App() {
  return (
    <Router>
      <Routes>
      <Route path='/' element={<Home></Home>}></Route>
      <Route path='/patientpage' element={<PatientPage />}></Route>
      <Route path='/checkout' element={<CheckoutPage />}></Route>
      <Route path='/resetOtp' element={<ResetPasswordView />}></Route>
      <Route path='/resetpassword' element={<ResetPassword />}></Route>
      <Route path='/' element={<LoginForm></LoginForm>}></Route>
      <Route path='/adminpage' element={<PharmacistRequestView />}></Route>

     <Route path='/login' element={<Login></Login>}></Route>
      <Route path='/logout' element={<Logout></Logout>}></Route>
      <Route path='/changep' element={<Changep></Changep>}></Route>
      <Route path='/viewdocapp' element={<Viewdocapt></Viewdocapt>}></Route>
      <Route path='/viewhealth' element={<Viewhealth></Viewhealth>}></Route>
<Route path='upload' element={<DocumentUpload></DocumentUpload>}></Route>
<Route path='docs' element={<Viewdocs></Viewdocs>}></Route>
</Routes>
    </Router>
  );
  
}

export default App;