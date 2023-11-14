import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function PatientHome() {
  const [searchText, setSearchText] = useState('');
  const [filterText, setFilterText] = useState('');
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          return;
        }

        const response = await fetch('http://localhost:4000/api/users/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const data = await response.json();
          setUserData(data);
        } else {
          // Handle errors
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleButtonClick = (action, param) => {
    switch (action) {
      case 'viewMedicines':
        navigate('/medicines');
        break;
      case 'search':
        handleSearch();
        break;
      case 'filter':
        handleFilter();
        break;
      case 'viewOrders':
        navigate('/orders');
        break;
      default:
        break;
    }
  };

  const handleSearch = () => {
    const searchName = searchText.trim();

    if (searchName === '') {
      alert('Please enter a search term.');
    } else {
      fetch(`http://localhost:4000/api/patients/medicines/search?name=${encodeURIComponent(searchName)}`)
        .then((response) => response.json())
        .then((data) => {
          navigate('/search-results', { state: { results: data } });
        })
        .catch((error) => console.error('Error fetching data:', error));
    }
  };

  const handleFilter = () => {
    const filterTerm = filterText.trim();

    if (filterTerm === '') {
      alert('Please enter a filter term.');
    } else {
      navigate(`/filtered?medicalUse=${encodeURIComponent(filterTerm)}`);
    }
  };

  return (
    <div>
      <h1>Patient Home Page</h1>
      <h1>Welcome, {userData.name || 'User'}!</h1>

      <div className="container-login100-form-btn">
        <Button onClick={() => handleButtonClick('viewMedicines')}>View Available Medicines</Button>
        <Button onClick={() => handleButtonClick('search')}>Search for Medicine</Button>
        <InputButton
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search"
          action={() => handleButtonClick('search')}
        />
        <Button onClick={() => handleButtonClick('filter')}>Filter Medicine</Button>
        <InputButton
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder="Filter"
          action={() => handleButtonClick('filter')}
        />
        <Button onClick={() => handleButtonClick('viewOrders')}>View Orders</Button>
      </div>
    </div>
  );
}

// Reusable Button component
const Button = ({ onClick, children }) => (
  <div className="container-login100-form-btn">
    <button className="login100-form-btn" onClick={onClick}>
      {children}
    </button>
  </div>
);

// Reusable Input with Button component
const InputButton = ({ value, onChange, placeholder, action }) => (
  <div className="wrap-input100 validate-input" data-validate={`${placeholder} is required`}>
    <input className="input100" type="text" value={value} onChange={onChange} placeholder={placeholder} required />
    <span className="focus-input100"></span>
    <span className="symbol-input100">
      <i className="fa fa-lock" aria-hidden="true"></i>
    </span>
    <Button onClick={action}>Submit</Button>
  </div>
);

export default PatientHome;
