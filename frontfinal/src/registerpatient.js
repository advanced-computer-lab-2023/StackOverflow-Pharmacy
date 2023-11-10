import axios from 'axios';
import React, { useState } from 'react';
import './App.css'
const Pateintreg = () => {
  const [formData, setFormData] = useState({
    name:"",
    username:""
    ,email:"",
    password:"",
    birth_date:""
    ,gender:""
    ,mobile_no:"",
    emergencyname:""
    ,emergencyphone:""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
 await axios.post("http://localhost:5000/createpatient",formData)



    console.log('Form submitted:', formData);
    // You can add further logic to handle form submission (e.g., API call).
  };

  return (
    <form    onSubmit={handleSubmit}>

        <label className='title'>
        PATIENT REGISTERARTION
      
      </label> 
      <br />
      <label>
        Name:
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Username:
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Email:
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Password:
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Birthday:
        <input
          type="date"
          name="birth_date"
          value={formData.birth_date}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Gender:
        <input
          type="text"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
        />
      </label>
      <br />

      <label>
        Mobile number:
        <input
          type="Mobile number"
          name="mobile_no"
          value={formData.mobile_no}
          onChange={handleChange}
        />
      </label>
      
      <label>
      emergencyphone:
        <input
          type="Mobile number"
          name="emergencyphone"
          value={formData.emergencyphone}
          onChange={handleChange}
        />
      </label>
      <label>
      emergencyname:
        <input
          type="Mobile number"
          name="emergencyname"
          value={formData.emergencyname}
          onChange={handleChange}
        />
      </label>
      <br />
      <br />      <button type="submit">Register</button>
    </form>
  );
};

export default Pateintreg;