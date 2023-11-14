import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // Import the js-cookie library

function MedicineList() {
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

  const handleViewCartClick = async () => {
    const fetchedUserId = await getUserId();
    console.log("fetchedUserId:", fetchedUserId);

    if (fetchedUserId) {
      setUserId(fetchedUserId); // Update the userId state
      navigate(`/viewCart/${fetchedUserId}`);
    } else {
      // Handle the case where user ID could not be fetched
    }
  };

  const addToCart = async (medicineId) => {

    try {
      if (!authToken) {
        console.log("User is not authenticated. Showing login message.");
      }

      console.log("Adding medicine to cart...");
      const response = await fetch(
        `http://localhost:4000/api/patients/medicines/cart/${medicineId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Medicine added to cart.");
      } else {
        console.error(
          "Error adding medicine to cart. Status:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error adding medicine to cart:", error);
    }
  };

  const handleLoginClick = () => {
    navigate("/login");
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
              <button
                className="add-to-cart-button"
                onClick={() => addToCart(medicine._id)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </main>
      <button
        className="view-cart-button"
        onClick={handleViewCartClick}
      >
        View My Cart
      </button>
    </div>
  );
}

export default MedicineList;
