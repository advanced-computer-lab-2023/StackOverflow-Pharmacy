// AddAdminPage.js
import React, { useState } from "react";
import { Button } from "react-bootstrap";

const AddAdminPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleAddAdmin = async () => {
    // Step 3: Send a POST request to add an admin
    const data = { userName: username, password: password };

    try {
      const response = await fetch("http://localhost:4000/admin/addadmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Admin added successfully!");
      } else {
        alert("Failed to add admin. Please try again.");
      }
    } catch (error) {
      console.error("Error adding admin:", error);
    }
  };

  return (
    <div>
      <h1>Add Admin</h1>
      <div>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Button onClick={handleAddAdmin}>Register Admin</Button>
    </div>
  );
};

export default AddAdminPage;
