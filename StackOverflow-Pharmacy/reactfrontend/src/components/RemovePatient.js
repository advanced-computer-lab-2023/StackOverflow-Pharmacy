// RemovePatient.js
import React, { useState } from "react";
import { Button } from "react-bootstrap";

const RemovePatient = () => {
  const [patientId, setPatientId] = useState("");

  const handleRemovePatient = async () => {
    const trimmedPatientId = patientId.trim();

    if (trimmedPatientId === "") {
      alert("Please enter the Patient ID.");
    } else {
      try {
        // Use the entered Patient ID to send a request to remove the patient
        const response = await fetch(
          `http://localhost:4000/admin/patient/${trimmedPatientId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          // Handle the response as needed
          console.log("Patient removed successfully.");
          alert("Patient removed successfully.");
        } else {
          alert("Failed to remove patient. Please try again.");
        }
      } catch (error) {
        console.error("Error removing patient:", error);
      }
    }
  };

  return (
    <div>
      <h2>Remove Patient</h2>
      <div>
        <input
          type="text"
          placeholder="Patient ID"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
        />
      </div>
      <Button onClick={handleRemovePatient}>Remove Patient</Button>
    </div>
  );
};

export default RemovePatient;
