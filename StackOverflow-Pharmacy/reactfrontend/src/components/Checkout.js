import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const containerStyle = {
  maxWidth: "800px",
  margin: "0 auto",
  padding: "20px",
};

const buttonStyle = {
  padding: "10px",
  backgroundColor: "#4CAF50",
  color: "white",
  border: "none",
  cursor: "pointer",
};

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [newAddress, setNewAddress] = useState({
    addressLine: "",
    city: "",
    country: "",
  });
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  const getAuthTokenFromCookie = () => {
    const authToken = Cookies.get("jwt", { domain: "localhost", path: "/" });
    console.log("Auth token:", authToken);
    return authToken;
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const toggleAddingAddress = () => {
    setIsAddingAddress(!isAddingAddress);
  };
  const authToken = getAuthTokenFromCookie();

  const getUserId = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/users/profile", {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const user = await response.json();
        return user._id;
      } else {
        console.error("Error fetching user profile:", response.statusText);
        return null;
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  const fetchAddresses = async () => {
    try {
      const userId = await getUserId();
      if (!userId) {
        return;
      }

      const response = await fetch(
        `http://localhost:4000/api/patients/${userId}/addresses`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const data = await response.json();
        setAddresses(data.addresses || []);
      } else {
        console.error("Error fetching addresses:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const userId = await getUserId();

      if (!userId) {
        // Redirect to login or handle the case where user ID is not available
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:4000/api/patients/cart/${userId}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Cart data:", data);

        if (Array.isArray(data.items)) {
          setCart(data.items);
        } else {
          setCart([]);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    fetchAddresses();
  }, [authToken]);

  const removeFromCart = (medicineId) => {
    // Extract the medicine ID if it's an object
    const actualMedicineId =
      typeof medicineId === "object" ? medicineId._id : medicineId;

    // Send a request to remove the medicine from the cart
    fetch(
      `http://localhost:4000/api/patients/medicines/cart/${actualMedicineId}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${authToken}`, // Include the user's JWT token
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // Handle success (e.g., show a confirmation message)
        console.log("Medicine removed from cart:", data);
        // Update the cart state by filtering out the removed item
        setCart((prevCart) =>
          prevCart.filter((item) => item.id !== actualMedicineId)
        );
      })
      .catch((error) =>
        console.error("Error removing medicine from cart:", error)
      );
  };

  const adjustQuantity = (medicineId, quantity) => {
    // Send a request to adjust the quantity of the medicine in the cart
    const actualMedicineId =
      typeof medicineId === "object" ? medicineId._id : medicineId;
    fetch(
      `http://localhost:4000/api/patients/medicines/cart/adjust/${actualMedicineId}`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${authToken}`, // Include the user's JWT token
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // Handle success (e.g., show a confirmation message)
        console.log("Medicine quantity adjusted:", data);

        // Update the cart state with the new quantity
        setCart((prevCart) =>
          prevCart.map((item) =>
            item.id === actualMedicineId ? { ...item, count: quantity } : item
          )
        );
      })
      .catch((error) =>
        console.error("Error adjusting medicine quantity:", error)
      );
  };

  const handleAddressChange = (event) => {
    setSelectedAddress(event.target.value);
  };

  const handleNewAddressChange = (event) => {
    setNewAddress({
      ...newAddress,
      [event.target.name]: event.target.value,
    });
  };
  const addNewAddress = async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/api/patients/update-delivery-address",
        {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newAddress),
        }
      );

      if (response.status === 201) {
        console.log("Address added successfully.");
        fetchAddresses(); // Refresh the addresses after adding a new one
      } else {
        console.error("Error adding address:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };

  const renderNewAddressForm = () => {
    if (isAddingAddress) {
      return (
        <div>
          <input
            type="text"
            placeholder="Street"
            name="addressLine"
            value={newAddress.addressLine}
            onChange={handleNewAddressChange}
          />
          <input
            type="text"
            placeholder="City"
            name="city"
            value={newAddress.city}
            onChange={handleNewAddressChange}
          />
          <input
            type="text"
            placeholder="Country"
            name="country"
            value={newAddress.country}
            onChange={handleNewAddressChange}
          />
          <button onClick={addNewAddress} style={buttonStyle}>
            Save Address
          </button>
        </div>
      );
    } else {
      return (
        <button onClick={toggleAddingAddress} style={buttonStyle}>
          Add New Address
        </button>
      );
    }
  };

  const checkout = async () => {
    try {
      const requestBody = {
        userID: await getUserId(),
        items: cart.map(item => ({
          medicine: item.id,
          count: item.count,
          price: item.id.price,
        })),
        address: selectedAddress,
        paymentType: paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1),
        phone: '', // Default or empty value
        deliveryPrice: 0,
      };
  
      console.log('Request Body:', requestBody);
  
      const response = await fetch("http://localhost:4000/api/patients/create-order", {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      if (response.status === 201) {
        const order = await response.json();
        console.log("Order placed successfully:", order);
        setCart([]); // Clear the cart after a successful order placement
      } else {
        console.error("Error placing order:", response.statusText);
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };
  
  const getTotalPrice = () => {
    // Calculate the total price of the order based on the prices of medicines in the cart
    return cart.reduce((total, item) => total + item.id.price * item.count, 0);
  };


  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container" style={containerStyle}>
      <h1>Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cart.map((item) => (
            <li key={item.id}>
              <h3>Medicine Name: {item.id.name}</h3>
              <p>Quantity: {item.count}</p>
              <p>Price: ${item.id.price}</p>
              <button onClick={() => adjustQuantity(item.id, item.count + 1)}>
                +
              </button>
              <button onClick={() => adjustQuantity(item.id, item.count - 1)}>
                -
              </button>
              <button onClick={() => removeFromCart(item.id)}>
                Remove from Cart
              </button>
            </li>
          ))}
        </ul>
      )}

      <section className="address">
        <h2>Delivery Address</h2>
        {addresses.length === 0 ? (
          <p>No addresses available. Please add an address.</p>
        ) : (
          <select value={selectedAddress} onChange={handleAddressChange}>
            <option value="">Select an address</option>
            {addresses.map((address) => (
              <option key={address._id} value={address._id}>
                {address.addressLine}, {address.city}, {address.country}
              </option>
            ))}
          </select>
        )}

        {renderNewAddressForm()}
      </section>

      <section className="order-summary">
        <h2>Order Summary</h2>
        <p>Total Price: ${getTotalPrice().toFixed(2)}</p>
      </section>
      <section className="payment-method">
        <h2>Payment Method</h2>
        <label>
          <input
            type="radio"
            value="Wallet"
            checked={paymentMethod === "Wallet"}
            onChange={handlePaymentMethodChange}
          />
          Wallet
        </label>
        <label>
          <input
            type="radio"
            value="Card"
            checked={paymentMethod === "Card"}
            onChange={handlePaymentMethodChange}
          />
          Credit Card (Stripe)
        </label>
        <label>
          <input
            type="radio"
            value="Cash"
            checked={paymentMethod === "Cash"}
            onChange={handlePaymentMethodChange}
          />
          Cash on Delivery
        </label>
      </section>

      <button onClick={checkout} style={buttonStyle}>
        place order
      </button>
    </div>
  );
};

export default Checkout;
