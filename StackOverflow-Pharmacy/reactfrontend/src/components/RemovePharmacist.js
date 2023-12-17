// RemovePharmacist.js
import React, { useState } from "react";
import { Button } from "react-bootstrap";

const RemovePharmacist = () => {
  const [pharmacistId, setPharmacistId] = useState("");

  const handleRemovePharmacist = async () => {
    const trimmedPharmacistId = pharmacistId.trim();

    if (trimmedPharmacistId === "") {
      alert("Please enter the Pharmacist ID.");
    } else {
      try {
        // Use the entered Pharmacist ID to send a request to remove the pharmacist
        const response = await fetch(
          `http://localhost:4000/admin/pharmacist/${trimmedPharmacistId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          // Handle the response as needed
          console.log("Pharmacist removed successfully.");
          alert("Pharmacist removed successfully.");
        } else {
          alert("Failed to remove pharmacist. Please try again.");
        }
      } catch (error) {
        console.error("Error removing pharmacist:", error);
      }
    }
  };

  return (
    <div>
      <h2>Remove Pharmacist</h2>
      <div>
        <input
          type="text"
          placeholder="Pharmacist ID"
          value={pharmacistId}
          onChange={(e) => setPharmacistId(e.target.value)}
        />
      </div>
      <Button onClick={handleRemovePharmacist}>Remove Pharmacist</Button>
    </div>
  );
};

export default RemovePharmacist;
