// ViewPharmacistInfo.js
import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";

const ViewPharmacistInfo = () => {
  const [pharmacistId, setPharmacistId] = useState("");
  const [pharmacistInfo, setPharmacistInfo] = useState(null);

  useEffect(() => {
    const displayPharmacistInfo = async () => {
      const trimmedPharmacistId = pharmacistId.trim();

      if (trimmedPharmacistId !== "") {
        try {
          const response = await fetch(
            `http://localhost:4000/admin/pharmacist/${trimmedPharmacistId}`
          );
          if (response.ok) {
            const data = await response.json();
            setPharmacistInfo(data);
          } else {
            console.error("Error fetching pharmacist info:", response.statusText);
          }
        } catch (error) {
          console.error("Error fetching pharmacist info:", error);
        }
      }
    };

    displayPharmacistInfo();
  }, [pharmacistId]);

  const handleViewPharmacistInfo = () => {
    // You can choose to perform additional actions when the button is clicked
  };

  return (
    <div>
      <h2>Type the id of the pharmacist</h2>
      <div className="wrap-input100 validate-input">
        <input
          className="input100"
          type="text"
          value={pharmacistId}
          onChange={(e) => setPharmacistId(e.target.value)}
          placeholder="Pharmacist ID"
        />
        <span className="focus-input100"></span>
        <span className="symbol-input100">
          <i className="fa fa-user" aria-hidden="true"></i>
        </span>
      </div>
      <div id="pharmacistInfo">
        {pharmacistInfo && (
          <div>
            <p>Name: {pharmacistInfo.name}</p>
            <p>Hour Rate: {pharmacistInfo.hourRate}</p>
            <p>Affiliation: {pharmacistInfo.affiliation}</p>
            <p>Education Background: {pharmacistInfo.educationBackground}</p>
            <p>Email: {pharmacistInfo.email}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewPharmacistInfo;
