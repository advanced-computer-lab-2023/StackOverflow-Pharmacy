import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {
  Button,
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

function OrderDetails() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const [cancelledOrders, setCancelledOrders] = useState([]);

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
        setCancelledOrders((prevCancelledOrders) => [
          ...prevCancelledOrders,
          orderId,
        ]);
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
                      console.error(
                        "Error fetching medicine:",
                        medicineResponse.statusText
                      );
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
    <Container>
      <Typography variant="h4" gutterBottom>
        Your Orders
      </Typography>
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
            <Typography variant="h5" gutterBottom>
              Order #{index + 1} Details
            </Typography>
            <Typography component="p">Order ID: {order._id}</Typography>
            <Typography component="p">Status: {order.status}</Typography>
            <Typography component="p">
              Delivery Price: ${order.deliveryPrice}
            </Typography>
            <Typography component="p">Order Price: ${orderPrice}</Typography>
            <Typography component="p">Total Price: ${totalPrice}</Typography>
            <Typography component="p">
              Date: {new Date(order.date).toLocaleString()}
            </Typography>
            <Typography component="p">
              Delivery Address:{" "}
              {`${order.address.addressLine}, ${order.address.city}, ${order.address.country}`}
            </Typography>
            {order.items && order.items.length > 0 && (
              <div>
                <Typography component="p">Medicines:</Typography>
                <List>
                  {order.items.map((item) => (
                    <ListItem key={item.medicine._id}>
                      <ListItemText
                        primary={`${item.medicine.name} - Quantity: ${item.count}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </div>
            )}
            {order.status !== "Cancelled" &&
              !cancelledOrders.includes(order._id) && (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => cancelOrder(order._id)}
                  disabled={cancelledOrders.includes(order._id)}
                >
                  Cancel Order
                </Button>
              )}
          </div>
        );
      })}
    </Container>
  );
}

export default OrderDetails;
