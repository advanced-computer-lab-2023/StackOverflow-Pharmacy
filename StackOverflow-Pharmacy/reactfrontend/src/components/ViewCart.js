import React, { useState, useEffect } from 'react';
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';

function ViewCart() {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const getAuthTokenFromCookie = () => {
    const authToken = Cookies.get("jwt", { domain: "localhost", path: "/" });
    console.log("Auth token:", authToken);
    return authToken;
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

  useEffect(() => {
    const fetchData = async () => {
      const userId = await getUserId();

      if (!userId) {
        // Redirect to login or handle the case where user ID is not available
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`http://localhost:4000/api/patients/cart/${userId}`, {
          method: 'GET',
          credentials: "include",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });

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
        console.error('Error fetching cart:', error);
      } finally {
        setIsLoading(false);
      }
    };


    fetchData();
  }, [authToken]);

  const removeFromCart = (medicineId) => {
    // Extract the medicine ID if it's an object
    const actualMedicineId = typeof medicineId === 'object' ? medicineId._id : medicineId;
    console.log("actualMedicineId:", actualMedicineId);
    // Send a request to remove the medicine from the cart
    fetch(`http://localhost:4000/api/patients/medicines/cart/${actualMedicineId}`, {
      method: 'DELETE',
      credentials: "include",
        headers: {
          Authorization: `Bearer ${authToken}`, // Include the user's JWT token
          "Content-Type": "application/json",
        },
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle success (e.g., show a confirmation message)
        console.log('Medicine removed from cart:', data);
        fetchData();
        // Update the cart state by filtering out the removed item
        setCart((prevCart) => prevCart.filter((item) => item.id !== actualMedicineId));
      })
      .catch((error) =>
        console.error('Error removing medicine from cart:', error)
      );
  };

  const adjustQuantity = (medicineId, quantity) => {
    // Send a request to adjust the quantity of the medicine in the cart
    const actualMedicineId = typeof medicineId === 'object' ? medicineId._id : medicineId;
    fetch(`http://localhost:4000/api/patients/medicines/cart/adjust/${actualMedicineId}`, {
      method: 'PUT',
      credentials: "include",
        headers: {
          Authorization: `Bearer ${authToken}`, // Include the user's JWT token
          "Content-Type": "application/json",
        },
      body: JSON.stringify({ quantity }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle success (e.g., show a confirmation message)
        console.log('Medicine quantity adjusted:', data);

        // Update the cart state with the new quantity
        setCart((prevCart) =>
          prevCart.map((item) =>
            item.id === actualMedicineId ? { ...item, count: quantity } : item
          )
        );
      })
      .catch((error) =>
        console.error('Error adjusting medicine quantity:', error)
      );
  };

  const checkout = () => {
    // Implement your checkout logic here
    navigate('/checkout');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
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
              <button onClick={() => adjustQuantity(item.id, item.count + 1)}>+</button>
              <button onClick={() => adjustQuantity(item.id, item.count - 1)}>-</button>
              <button onClick={() => removeFromCart(item.id)}>Remove from Cart</button>
            </li>
          ))}
        </ul>
      )}
      <button onClick={checkout}>Checkout</button>
    </div>
  );
}

export default ViewCart;