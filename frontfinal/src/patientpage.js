import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Home from './home';

const PatientPage = () => {
  const [viewMedicine, setViewMedicine] = useState('');
  const [searchMedicine, setSearchMedicine] = useState('');
  const [filterMedicine, setFilterMedicine] = useState('');
  const [overTheCounter, setOverTheCounter] = useState('');
  const [viewCart, setViewCart] = useState([]);

  // Dummy data for medicines
  const dummyMedicines = ['Medicine A', 'Medicine B', 'Medicine C', 'Medicine D'];

  const labelStyle = {
    backgroundColor: '#fff',   // White background color for labels
    color: '#0074cc',          // Blue text color
    padding: '10px',
    borderRadius: '5px',
    marginRight: '5px',        // Add appropriate margin between labels and inputs
  };

  const buttonStyle = {
    backgroundColor: '#0074cc', // Blue background color for buttons
    color: '#fff',             // White text color
    border: 'none',
    borderRadius: '5px',
    padding: '10px',
    margin: '5px',             // Add appropriate margin between buttons
    cursor: 'pointer',
  };

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    marginTop: '10px',         // Add margin between the "View Cart" list and other elements
  };

  const handleAddToCart = (item) => {
    setViewCart([...viewCart, item]);
  };

  const handleRemoveFromCart = (index) => {
    const updatedCart = [...viewCart];
    updatedCart.splice(index, 1);
    setViewCart(updatedCart);
  };

  const handleLogout = () => {
    // Implement your logout logic here
    console.log('Logout clicked');
  };

  const handleChangePassword = () => {
    // Implement your change password logic here
    console.log('Change Password clicked');
  };

  return (
    <div>
      <label style={labelStyle}>View Medicine:</label>
      <select
        value={viewMedicine}
        onChange={(e) => setViewMedicine(e.target.value)}
        style={buttonStyle} // Keep the same style for the select element
      >
        <option value="">Select Medicine</option>
        {dummyMedicines.map((medicine, index) => (
          <option key={index} value={medicine}>
            {medicine}
          </option>
        ))}
      </select>
      <button style={buttonStyle} onClick={() => handleAddToCart(viewMedicine)}>Add</button>

      <br />

      <label style={labelStyle}>Search for Medicine:</label>
      <input
        type="text"
        value={searchMedicine}
        onChange={(e) => setSearchMedicine(e.target.value)}
        placeholder="Type to search"
        style={buttonStyle} // Keep the same style for the input element
      />
      <button style={buttonStyle} onClick={() => handleAddToCart(searchMedicine)}>Add</button>

      <br />

      <label style={labelStyle}>Filter Medicines:</label>
      <select
        value={filterMedicine}
        onChange={(e) => setFilterMedicine(e.target.value)}
        style={buttonStyle} // Keep the same style for the select element
      >
        <option value="">Select Filter</option>
        {/* Add filter options based on your criteria */}
        <option value="pain-relief">Pain Relief</option>
        <option value="cough-cold">Cough and Cold</option>
        <option value="allergy">Allergy</option>
        <option value="digestive">Digestive</option>
      </select>
      <button style={buttonStyle} onClick={() => handleAddToCart(filterMedicine)}>Add</button>

      <br />

      <label style={labelStyle}>Over the Counter:</label>
      <select
        value={overTheCounter}
        onChange={(e) => setOverTheCounter(e.target.value)}
        style={buttonStyle} // Keep the same style for the select element
      >
        <option value="">Select Medicine</option>
        {dummyMedicines.map((medicine, index) => (
          <option key={index} value={medicine}>
            {medicine}
          </option>
        ))}
      </select>
      <button style={buttonStyle} onClick={() => handleAddToCart(overTheCounter)}>Add</button>

      
      <div style={containerStyle}>
        <label style={labelStyle}>View Cart:</label>
        <ul>
          {viewCart.map((item, index) => (
            <li key={index}>
              {item}
              <button style={buttonStyle} onClick={() => handleRemoveFromCart(index)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>

      <br />
      <Link to="/resetpassword">
      <button style={buttonStyle} onClick={handleChangePassword}>Change Password</button>
      </Link>
     <br />

      <br />
      <Link to="/">
        <button style={buttonStyle} onClick={handleLogout}>Logout</button>
      </Link>
    </div>
  );
};

export default PatientPage;
