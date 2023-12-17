// AdminHome.js
import React, { useState, useEffect } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function AdminHome() {
  const [searchText, setSearchText] = useState("");
  const [filterText, setFilterText] = useState("");
  const navigate = useNavigate();
  const handleSearch = () => {
    const searchName = searchText.trim();

    if (searchName === "") {
      alert("Please enter a search term.");
    } else {
      fetch(
        `http://localhost:4000/api/patients/medicines/search?name=${encodeURIComponent(
          searchName
        )}`
      )
        .then((response) => response.json())
        .then((data) => {
          navigate("/search-results", { state: { results: data } });
        })
        .catch((error) => console.error("Error fetching data:", error));
    }
  };
  const handleButtonClick = (action, param) => {
    switch (action) {
      case "viewMedicines":
        navigate("/medicines");
        break;
      case "search":
        handleSearch();
        break;
      case "filter":
        handleFilter();
        break;
      default:
        break;
    }
  };
  const handleFilter = () => {
    const filterTerm = filterText.trim();

    if (filterTerm === "") {
      alert("Please enter a filter term.");
    } else {
      navigate(`/filtered?medicalUse=${encodeURIComponent(filterTerm)}`);
    }
  };
  const handleViewTotalSales = () => {
    navigate("/total-sales"); // Update with the correct route
  };
  return (
    <div>
      <h1>Admin Home Page</h1>
      <Link to="/requests">
        <Button>View Requests</Button>
      </Link>
      <Link to="/add-admin">
        <Button>Add Admin</Button>
      </Link>
      <Link to="/remove-pharmacist">
        <Button>Remove Pharmacist</Button>
      </Link>
      <Link to="/remove-patient">
        <Button>Remove Patient</Button>
      </Link>
      <Link to="/view-pharmacist-info">
        <Button> View Pharmacist Info</Button>
      </Link>
      <Link to="/view-Patient-info">
        <Button> View Patient Info</Button>
      </Link>
      <InputButton
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="Search"
        action={() => handleButtonClick("search")}
      />
      <Button onClick={() => handleButtonClick("search")}>
        Search for Medicine
      </Button>
      <InputButton
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        placeholder="Filter"
        action={() => handleButtonClick("filter")}
      />
      <Button onClick={() => handleButtonClick("filter")}>
        Filter Medicine
      </Button>
      <Button onClick={handleViewTotalSales}>View Total Sales Report</Button>
      <Button onClick={() => navigate("/change-password")}>
        Change Password
      </Button>
    </div>
  );
}
const InputButton = ({ value, onChange, placeholder, action }) => (
  <div
    className="wrap-input100 validate-input"
    data-validate={`${placeholder} is required`}
  >
    <input
      className="input100"
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
    />
    <span className="focus-input100"></span>
    <span className="symbol-input100">
      <i className="fa fa-lock" aria-hidden="true"></i>
    </span>
  </div>
);
export default AdminHome;
