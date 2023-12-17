import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";


function SignUpPatient() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    birthdate: "",
    gender: "male",
    phone: "",
    emergencyContacts: [],
  });

  const [signUpStatus, setSignUpStatus] = useState({
    success: false,
    message: "",
  });

  const [emergencyContact, setEmergencyContact] = useState({
    name: "",
    phone: "",
    relation: "",
  });

  const addEmergencyContact = () => {
    if (
      emergencyContact.name &&
      emergencyContact.phone &&
      emergencyContact.relation
    ) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        emergencyContacts: [
          ...prevFormData.emergencyContacts,
          {
            name: emergencyContact.name,
            phone: emergencyContact.phone,
            relation: emergencyContact.relation,
          },
        ],
      }));

      setEmergencyContact({
        name: "",
        phone: "",
        relation: "",
      });
    }
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
    return regex.test(password);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    addEmergencyContact();

    if (!validatePassword(formData.password)) {
      // Display an error toast for password validation
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:4000/api/users/PatientSignUp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            emergencyContacts: formData.emergencyContacts.map((contact) => ({
              name: contact.name,
              phone: contact.phone,
              relation: contact.relation,
            })),
          }),
        }
      );

      if (response.status === 201) {
        setSignUpStatus({ success: true, message: "Sign-up successful" });
        navigate("/login");
      } else {
        const data = await response.json();
        setSignUpStatus({ success: false, message: data.message });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Container maxWidth="xs">
       <Typography variant="h4" align="center" gutterBottom sx={{ fontFamily: "cursive" }}>
        Sign Up as a Patient
      </Typography>

      {signUpStatus.message && (
        <Alert
          severity={signUpStatus.success ? "success" : "error"}
          sx={{ width: "100%", mt: 2 }}
        >
          {signUpStatus.message}
        </Alert>
      )}

      <form onSubmit={handleFormSubmit}>
        
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
        />

        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        <TextField
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />

        <TextField
          label="Date of Birth"
          type="date"
          variant="outlined"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={formData.birthdate}
          onChange={(e) =>
            setFormData({ ...formData, birthdate: e.target.value })
          }
        />

        <TextField
          label="Gender"
          select
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.gender}
          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
        >
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </TextField>

        <TextField
          label="Mobile Number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />

        <Typography variant="h6" mt={2} mb={1}>
          Emergency Contact
        </Typography>

        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={emergencyContact.name}
          onChange={(e) =>
            setEmergencyContact({
              ...emergencyContact,
              name: e.target.value,
            })
          }
        />

        <TextField
          label="Phone"
          variant="outlined"
          fullWidth
          margin="normal"
          value={emergencyContact.phone}
          onChange={(e) =>
            setEmergencyContact({
              ...emergencyContact,
              phone: e.target.value,
            })
          }
        />

        <TextField
          label="Relation"
          variant="outlined"
          fullWidth
          margin="normal"
          value={emergencyContact.relation}
          onChange={(e) =>
            setEmergencyContact({
              ...emergencyContact,
              relation: e.target.value,
            })
          }
        />

        <Button
          type="button"
          variant="contained"
          color="primary"
          fullWidth
          onClick={addEmergencyContact}
          sx={{ mt: 1, mb: 2 }}
        >
          Add Emergency Contact
        </Button>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
        >
          Sign Up
        </Button>
      </form>
    </Container>
  );
}

export default SignUpPatient;
