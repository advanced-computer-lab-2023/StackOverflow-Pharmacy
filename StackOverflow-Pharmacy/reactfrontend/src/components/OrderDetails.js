import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function OrderDetails() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const [isCancelled, setIsCancelled] = useState(false);

  const getAuthTokenFromCookie = () => {
    const authToken = Cookies.get("jwt", { domain: "localhost", path: "/" });
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
      } else if (response.status === 401) {
        console.error("Unauthorized: Please check your authentication token.");
        navigate("/login");
        return null;
      } else {
        console.error("Error fetching user profile:", response.statusText);
        return null;
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/patients/orders/${orderId}/cancel`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setIsCancelled(true);
        setOrders((prevOrders) =>
          prevOrders.map((prevOrder) =>
            prevOrder._id === orderId
              ? { ...prevOrder, status: "Cancelled" }
              : prevOrder
          )
        );
      } else {
        console.error("Error cancelling order:", response.statusText);
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      const userId = await getUserId();

      try {
        const response = await fetch(
          `http://localhost:4000/api/patients/orders/user/${userId}`,
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
          // Fetch medicine details for each item
          const ordersWithMedicines = await Promise.all(
            data.map(async (order) => {
              const itemsWithMedicines = await Promise.all(
                order.items.map(async (item) => {
                  try {
                    const medicineResponse = await fetch(
                      `http://localhost:4000/api/medicines/${item.medicine}`
                    );
                    if (medicineResponse.status === 200) {
                      const medicineData = await medicineResponse.json();
                      return {
                        ...item,
                        medicine: medicineData,
                      };
                    } else {
                      console.error("Error fetching medicine:", medicineResponse.statusText);
                      return item;
                    }
                  } catch (error) {
                    console.error("Error fetching medicine:", error);
                    return item;
                  }
                })
              );
              return {
                ...order,
                items: itemsWithMedicines,
              };
            })
          );

          setOrders(ordersWithMedicines);
        } else if (response.status === 404) {
          console.error("Orders not found.");
        } else {
          console.error("Error fetching orders:", response.statusText);
          console.error("Full error object:", await response.json());
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [authToken]);

  if (orders.length === 0) {
    return <div>No orders found.</div>;
  }

  return (
    <div>
      <h1>Your Orders</h1>
      {orders.map((order, index) => {
        // Calculate order price
        const orderPrice = order.items.reduce(
          (total, item) => total + item.count * item.medicine.price,
          0
        );

        // Calculate total price
        const totalPrice = orderPrice + order.deliveryPrice;

        return (
          <div key={order._id}>
            <h2>Order #{index + 1} Details</h2>
            <p>Order ID: {order._id}</p>
            <p>Status: {order.status}</p>
            <p>Delivery Price: ${order.deliveryPrice}</p>
            <p>Order Price: ${orderPrice}</p>
            <p>Total Price: ${totalPrice}</p>
            <p>Date: {new Date(order.date).toLocaleString()}</p>
            <p>Delivery Address: {`${order.address.addressLine}, ${order.address.city}, ${order.address.country}`}</p>
            {order.items && order.items.length > 0 && (
              <div>
                <p>Medicines:</p>
                <ul>
                  {order.items.map((item) => (
                    <li key={item.medicine._id}>
                      {item.medicine.name} - Quantity: {item.count}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {order.status !== "Cancelled" && !isCancelled && (
              <button
                onClick={() => cancelOrder(order._id)}
                disabled={isCancelled}
              >
                Cancel Order
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default OrderDetails;