import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // Import the js-cookie library
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function PhamaMedicinesList() {
  const [medicines, setMedicines] = useState([]);
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const [userId, setUserId] = useState(""); // Use the useState hook to manage userId
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Fetching medicines...");
    fetch("http://localhost:4000/api/patients/medicines")
      .then((response) => response.json())
      .then((data) => {
        console.log("Medicines fetched:", data);
        setMedicines(data);
      })
      .catch((error) => console.error("Error fetching medicines:", error));
  }, []);

  const getAuthTokenFromCookie = () => {
    const authToken = Cookies.get("jwt", { domain: "localhost", path: "/" });
    console.log("Auth token:", authToken);
    return authToken;
  };
  const authToken = getAuthTokenFromCookie();

  async function getUserId() {
    try {
      // Make a request to the user profile endpoint to fetch the user's profile
      const response = await fetch("http://localhost:4000/api/users/profile", {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${authToken}`, // Include the user's JWT token
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const user = await response.json();
        return user._id; // Assuming your user object has an "id" property
      } else {
        console.error("Error fetching user profile:", response.statusText);
        return null; // Return null or handle the error as needed
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null; // Return null or handle the error as needed
    }
  }

  
  const handleArchive = async (medicineId) => {
    // Make a request to the backend to archive the medicine
    try {
      const response = await fetch(
        `http://localhost:4000/api/pharmacists/medicines/archive/${medicineId}`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success('Medicine archived successfully');
       // Update the local state to mark the medicine as archived
      setMedicines((prevMedicines) =>
      prevMedicines.map((medicine) =>
        medicine._id === medicineId ? { ...medicine, isArchived: true } : medicine
      )
    );
      } else {
        console.error('Error archiving medicine. Status:', response.status);
      }
    } catch (error) {
      console.error('Error archiving medicine:', error);
    }
  };

  const handleUnarchive = async (medicineId) => {
    // Make a request to the backend to unarchive the medicine
    try {
      const response = await fetch(
        `http://localhost:4000/api/pharmacists/medicines/unarchive/${medicineId}`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success('Medicine unarchived successfully');
       // Update the local state to mark the medicine as not archived
      setMedicines((prevMedicines) =>
      prevMedicines.map((medicine) =>
        medicine._id === medicineId ? { ...medicine, isArchived: false } : medicine
      )
    );
      } else {
        console.error('Error unarchiving medicine. Status:', response.status);
      }
    } catch (error) {
      console.error('Error unarchiving medicine:', error);
    }
  };
  
  return (
    <div>
      <h1>Medicines List</h1>
      <main>
        {showLoginMessage && (
          <div className="login-message">
            Please log in to add items to the cart.{" "}
            <button onClick={handleLoginClick}>Login</button>
          </div>
        )}
        <div className="medicine-list">
          {medicines.map((medicine) => (
            <div key={medicine._id} className="medicine-item">
              <img
                className="medicine-image"
                src={medicine.image}
                alt={medicine.name}
              />
              <h3>{medicine.name}</h3>
              <p>Price: ${medicine.price}</p>
              <p>Description: {medicine.description}</p>
              {medicine.isArchived ? (
                <button onClick={() => handleUnarchive(medicine._id)}>
                  Unarchive
                </button>
              ) : (
                <button onClick={() => handleArchive(medicine._id)}>
                  Archive
                </button>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default PhamaMedicinesList;
