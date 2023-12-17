// ViewPatientInfo.js
import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";

const ViewPatientInfo = () => {
  const [patientId, setPatientId] = useState("");
  const [patientInfo, setPatientInfo] = useState(null);

  useEffect(() => {
    const displayPatientInfo = async () => {
      const trimmedPatientId = patientId.trim();

      if (trimmedPatientId !== "") {
        try {
          const response = await fetch(
            `http://localhost:4000/admin/patient/basic-info/${trimmedPatientId}`
          );
          if (response.ok) {
            const data = await response.json();
            setPatientInfo(data);
          } else {
            console.error("Error fetching patient info:", response.statusText);
          }
        } catch (error) {
          console.error("Error fetching patient info:", error);
        }
      }
    };

    displayPatientInfo();
  }, [patientId]);

  const handleViewPatientInfo = () => {
    // You can choose to perform additional actions when the button is clicked
  };

  return (
    <div>
      <h2>Type the id of the patient</h2>
      <div className="wrap-input100 validate-input">
        <input
          className="input100"
          type="text"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          placeholder="Patient ID"
        />
        <span className="focus-input100"></span>
        <span className="symbol-input100">
          <i className="fa fa-user" aria-hidden="true"></i>
        </span>
      </div>
      <div id="patientInfo">
        {patientInfo && (
          <div>
            <p>Name: {patientInfo.name}</p>
            <p>User Name: {patientInfo.username}</p>
            <p>Email: {patientInfo.email}</p>
            <p>Phone: {patientInfo.phone}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewPatientInfo;
