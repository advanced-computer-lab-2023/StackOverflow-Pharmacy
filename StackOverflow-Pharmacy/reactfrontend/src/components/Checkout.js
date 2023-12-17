import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Container,
  Typography,
  Button,
  Select,
  MenuItem,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Grid,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import theme from "../styles/theme";

const sectionStyle = {
  marginTop: theme.spacing(4),
  padding: theme.spacing(3),
};
const buttonStyle = {
  marginTop: theme.spacing(2),
};
const containerStyle = {
  maxWidth: theme.breakpoints.values.md, // Adjust based on your theme breakpoints
  margin: "0 auto",
  padding: theme.spacing(2),
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
    const userId = getUserId();

    if (!userId) {
      // Redirect to login or handle the case where user ID is not available
      navigate("/login");
      return;
    }
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

  const removeFromCart = (medicineId) => {
    // Extract the medicine ID if it's an object
    const actualMedicineId =
      typeof medicineId === "object" ? medicineId._id : medicineId;
    console.log("actualMedicineId:", actualMedicineId);

    // Send a request to remove the medicine from the cart
    fetch(
      `http://localhost:4000/api/patients/medicines/cartRemove/${actualMedicineId}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${authToken}`, // Include the user's JWT token
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // If the response is successful, no need to parse JSON since there might not be any
        return response.text();
      })
      .then((data) => {
        // Handle success (e.g., show a confirmation message)
        console.log("Medicine removed from cart:", data);

        // Update the cart state by filtering out the removed item
        setCart((prevCart) =>
          prevCart.filter((item) => item.id !== actualMedicineId)
        );

        // Fetch updated cart after successful removal
        fetchUpdatedCart();
      })
      .catch((error) =>
        console.error("Error removing medicine from cart:", error)
      );
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
      console.log("Adding new address:", newAddress); // Log the new address before sending the request

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

  const checkout = async () => {
    try {
      const requestBody = {
        userID: await getUserId(),
        items: cart.map((item) => ({
          medicine: item.id,
          count: item.count,
          price: item.id.price,
        })),
        address: selectedAddress,
        paymentType:
          paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1),
        phone: "", // Default or empty value
        deliveryPrice: 10,
      };

      console.log("Request Body:", requestBody);

      const response = await fetch(
        "http://localhost:4000/api/patients/create-order",
        {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      console.log("Response from Server:", response);

      if (response.status === 201) {
        const order = await response.json();
        toast.success("Order placed !");
        console.log("Order placed successfully:", order);
        setCart([]); // Clear the cart after a successful order placement
        await fetch(
          `http://localhost:4000/api/patients/medicines/cart/${await getUserId()}`,
          {
            method: "DELETE",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${authToken}`, // Include the user's JWT token
              "Content-Type": "application/json",
            },
          }
        );
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

  return (
    <Container maxWidth="md" style={containerStyle}>
      <Typography variant="h4">Your Cart</Typography>
      {cart.length === 0 ? (
        <Typography variant="p">Your cart is empty.</Typography>
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
                      onClick={() => adjustQuantity(item.id, item.count + 1)}
                    >
                      <AddIcon />
                    </IconButton>
                  </Grid>
                  <Grid item>
                    <IconButton
                      edge="end"
                      aria-label="remove"
                      onClick={() => adjustQuantity(item.id, item.count - 1)}
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
      <section className="address">
        <Typography variant="h5">Delivery Address</Typography>
        {addresses.length === 0 ? (
          <Typography variant="p">
            No addresses available. Please add an address.
          </Typography>
        ) : (
          <FormControl fullWidth>
            <InputLabel>Select an address</InputLabel>
            <Select value={selectedAddress} onChange={handleAddressChange}>
              <MenuItem value="">
                <em>Select an address</em>
              </MenuItem>
              {addresses.map((address) => (
                <MenuItem key={address._id} value={address._id}>
                  {address.addressLine}, {address.city}, {address.country}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {isAddingAddress ? (
          <div>
            <TextField
              label="Street"
              placeholder="Street"
              name="addressLine"
              value={newAddress.addressLine}
              onChange={handleNewAddressChange}
            />
            <TextField
              label="City"
              placeholder="City"
              name="city"
              value={newAddress.city}
              onChange={handleNewAddressChange}
            />
            <TextField
              label="Country"
              placeholder="Country"
              name="country"
              value={newAddress.country}
              onChange={handleNewAddressChange}
            />
            <Button onClick={addNewAddress} style={buttonStyle}>
              Save Address
            </Button>
          </div>
        ) : (
          <Button
            onClick={toggleAddingAddress}
            style={buttonStyle}
            startIcon={<AddIcon />}
          >
            Add New Address
          </Button>
        )}
      </section>

      <Paper elevation={3} style={sectionStyle}>
        <Typography variant="h5">Order Summary</Typography>
        <Typography variant="body1">
          Order Price: ${getTotalPrice().toFixed(2)}
        </Typography>
        <Typography variant="body1">Delivery Fee: $10.00</Typography>
        <Typography variant="h6" color="primary">
          Total Price: ${(getTotalPrice() + 10).toFixed(2)}
        </Typography>
      </Paper>

      <Paper elevation={3} style={sectionStyle}>
        <Typography variant="h5">Payment Method</Typography>
        <RadioGroup
          row
          aria-label="payment method"
          name="paymentMethod"
          value={paymentMethod}
          onChange={handlePaymentMethodChange}
        >
          <FormControlLabel value="Wallet" control={<Radio />} label="Wallet" />
          <FormControlLabel
            value="Card"
            control={<Radio />}
            label="Credit Card (Stripe)"
          />
          <FormControlLabel
            value="Cash"
            control={<Radio />}
            label="Cash on Delivery"
          />
        </RadioGroup>
      </Paper>

      <Button
        onClick={checkout}
        variant="contained"
        color="primary"
        style={buttonStyle}
      >
        Place Order
      </Button>
    </Container>
  );
};

export default Checkout;
