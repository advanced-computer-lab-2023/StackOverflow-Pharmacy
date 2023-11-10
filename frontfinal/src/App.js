import React from 'react';
import './App.css';
import Home from './home';
import PharmacistPage from './PharmacistPage';
import LoginForm from './LoginForm';
import ResetPassword from './resetpassword';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Updated import

import Login from './login';
import Logout from './logout';

function App() {
  return (
    <Router>
      <Routes> {/* Use Routes instead of Switch */}
        <Route path='/' element={<Home></Home>}></Route>
        <Route path='/PharmacistPage' element={<PharmacistPage />}></Route>
        <Route path='/resetpassword' element={<ResetPassword />}></Route>

        <Route path='/login' element={<Login></Login>}></Route>
        <Route path='/logout' element={<Logout></Logout>}></Route>
        <Route path='/pharmacist' element={<PharmacistPage />}></Route> {/* Include PharmacistPage route here */}
        <Route path='/*' element={<LoginForm></LoginForm>}></Route> {/* A catch-all route for LoginForm */}
      </Routes>
    </Router>
  );
}

export default App;