import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  CircularProgress,
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

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
  }, [authToken]);

  const fetchUpdatedCart = async () => {
    try {
      const userId = await getUserId();
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
      console.log("Updated Cart data:", data);

      if (Array.isArray(data.items)) {
        setCart(data.items);
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error("Error fetching updated cart:", error);
    }
  };

  const removeFromCart = async (medicineId) => {
    // Extract the medicine ID if it's an object
    const actualMedicineId =
      typeof medicineId === "object" ? medicineId._id : medicineId;
    console.log("actualMedicineId:", actualMedicineId);

    try {
      // Send a request to remove the medicine from the cart
      const response = await fetch(
        `http://localhost:4000/api/patients/medicines/cartRemove/${actualMedicineId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${authToken}`, // Include the user's JWT token
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // If the response is successful, update the cart state by filtering out the removed item
      setCart((prevCart) =>
        prevCart.filter((item) => item.id !== actualMedicineId)
      );

      // Check if the cart is empty after removal
      const updatedCart = prevCart.filter(
        (item) => item.id !== actualMedicineId
      );
      if (updatedCart.length === 0) {
        // If the cart is empty, navigate to a different page or show a message
        // For now, let's redirect to the home page if the cart becomes empty
        navigate("/");
      }

      // Handle success (e.g., show a confirmation message)
      console.log("Medicine removed from cart successfully!");
    } catch (error) {
      console.error("Error removing medicine from cart:", error);
      // Handle the error or show a notification to the user
    }
    fetchUpdatedCart();
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

    fetchUpdatedCart();
  };

  const checkout = () => {
    // Implement your checkout logic here
    navigate("/checkout");
  };

  return (
    <Container>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontFamily: "cursive" }}
      >
        Your Cart
      </Typography>
      {isLoading ? (
        <div style={{ textAlign: "center" }}>
          <CircularProgress />
        </div>
      ) : (
        <div>
          {cart.length === 0 ? (
            <Typography variant="subtitle1">Your cart is empty.</Typography>
          ) : (
            <List>
              {cart.map((item) => (
                <ListItem key={item.id._id}>
                  <ListItemText
                    primary={`Medicine Name: ${item.id.name}`}
                    secondary={`Quantity: ${item.count} - Price: $${(
                      item.id.price * item.count
                    ).toFixed(2)}`}
                  />
                  <ListItemSecondaryAction>
                    <Grid container spacing={1}>
                      <Grid item>
                        <IconButton
                          edge="end"
                          aria-label="add"
                          onClick={() =>
                            adjustQuantity(item.id, item.count + 1)
                          }
                        >
                          <AddIcon />
                        </IconButton>
                      </Grid>
                      <Grid item>
                        <IconButton
                          edge="end"
                          aria-label="remove"
                          onClick={() =>
                            adjustQuantity(item.id, item.count - 1)
                          }
                        >
                          <RemoveIcon />
                        </IconButton>
                      </Grid>
                      <Grid item>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
          <Button variant="contained" color="primary" onClick={checkout}>
            Checkout
          </Button>
        </div>
      )}
    </Container>
  );
}

export default ViewCart;
