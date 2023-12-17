import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { TextField, Button, Typography, Container, Box } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function AddPrescription() {
  const [prescriptionData, setPrescriptionData] = useState({
    content: [
      {
        medicine: "",
        dosage: "",
      },
    ],
    description: "",
  });

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
    // Fetch available medicines or perform any necessary setup
    // You might want to create a separate function for this
  }, []);

  const handleInputChange = (index, field, value) => {
    const newPrescriptionData = { ...prescriptionData };

    // Validate dosage input (you can customize this validation)
    if (field === 'dosage') {
      // Use your own validation logic here
      // For example, allowing only numbers and certain characters
      const isValidDosage = /^[0-9a-zA-Z]*$/.test(value);

      if (!isValidDosage) {
        // Handle invalid dosage (you can show an error message)
        console.error('Invalid dosage format');
        return;
      }
    }

    // Update the medicine object within the content array
    newPrescriptionData.content[index][field] = value;
    setPrescriptionData(newPrescriptionData);
  };

  const handleAddMedicine = () => {
    setPrescriptionData((prevData) => ({
      ...prevData,
      content: [
        ...prevData.content,
        { medicine: "", dosage: "" },
      ],
    }));
  };

  const handleRemoveMedicine = (index) => {
    setPrescriptionData((prevData) => ({
      ...prevData,
      content: prevData.content.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    const patientId = await getUserId();
    if (!patientId) {
      // Handle the case where patient ID is not available
      return;
    }

    // Format the prescription data before sending to the backend
    const formattedPrescriptionData = {
      patientId,
      medicines: prescriptionData.content.map((medicine) => ({
        name: medicine.medicine,
        dosage: medicine.dosage || '',
      })),
      description: prescriptionData.description,
    };

    // Now you have patientId, formattedPrescriptionData, and authToken to send to the backend
    // Implement your logic to send the prescription data to the server
    // For example:
    try {
      const response = await fetch("http://localhost:4000/api/patients/addPrescription", {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedPrescriptionData),
      });

      if (response.status === 201) {
        // Display a success toast
        toast.success('Prescription added successfully', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        // Clear form inputs after successful submission
        setPrescriptionData({
          content: [
            {
              medicine: "",
              dosage: "",
            },
          ],
          description: "",
        });

        // Redirect to the patient home page
        navigate("/patient-home");
      } else {
        console.error("Error adding prescription:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding prescription:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Add Prescription
      </Typography>
      <form>
        {prescriptionData.content.map((medicine, index) => (
          <Box key={index} marginBottom={2}>
            <TextField
              label="Medicine"
              variant="outlined"
              fullWidth
              value={medicine.medicine}
              onChange={(e) => handleInputChange(index, "medicine", e.target.value)}
            />
            <TextField
              label="Dosage"
              variant="outlined"
              fullWidth
              value={medicine.dosage}
              onChange={(e) => handleInputChange(index, "dosage", e.target.value)}
            />
            {index > 0 && (
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                onClick={() => handleRemoveMedicine(index)}
                size="small"
              >
                Remove Medicine
              </Button>
            )}
          </Box>
        ))}
        <Button
          type="button"
          variant="contained"
          color="primary"
          onClick={handleAddMedicine}
          size="small"
        >
          Add Another Medicine
        </Button>
        <TextField
          label="Description"
          variant="outlined"
          multiline
          fullWidth
          rows={4}
          value={prescriptionData.description}
          onChange={(e) => setPrescriptionData({ ...prescriptionData, description: e.target.value })}
          margin="normal"
        />
        <Button
          type="button"
          variant="contained"
          color="primary"
          onClick={handleSubmit}
        >
          Submit Prescription
        </Button>
      </form>
      <ToastContainer />
    </Container>
  );
}

export default AddPrescription;
