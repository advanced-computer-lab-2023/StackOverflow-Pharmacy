import React from 'react';
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Home from './home';
import PatientPage from './patientpage';
import ResetPassword from './resetpassword';
import ForgotPassword from './forgotpassword';

function App() {
  return (
    <Router>
      <Routes>
      <Route path='/' element={<Home></Home>}></Route>
      <Route path='/patientpage' element={<PatientPage />}></Route>
      <Route path='/resetpassword' element={<ResetPassword />}></Route>
      <Route path='/forgotpassword' element={<ForgotPassword />}></Route>
      
      
    
      </Routes>
    </Router>
    
    
    
    
  );
}

export default App;
