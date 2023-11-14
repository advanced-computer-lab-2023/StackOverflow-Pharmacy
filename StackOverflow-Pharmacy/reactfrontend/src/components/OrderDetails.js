import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from "js-cookie";

function OrderDetails() {
  const [order, setOrder] = useState(null);
  const { orderId } = useParams();
  const getAuthTokenFromCookie = () => {
    const authToken = Cookies.get("jwt", { domain: "localhost", path: "/" });
    console.log("Auth token:", authToken);
    return authToken;
  };

  const authToken = getAuthTokenFromCookie();
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/patients/orders/${orderId}`, {
          method: 'GET',
          credentials: "include",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          const data = await response.json();
          setOrder(data.order);
        } else if (response.status === 404) {
          // Handle case where the order is not found
          console.error('Order not found.');
        } else {
          // Handle other errors
          console.error('Error fetching order details:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Order Details</h1>
      <p>Order ID: {order._id}</p>
      <p>User ID: {order.userID}</p>
      {/* Display other order details as needed */}
      <p>Status: {order.status}</p>
      <p>Delivery Address: {order.address}</p>
      {/* Display more order details as needed */}
    </div>
  );
}

export default OrderDetails;
