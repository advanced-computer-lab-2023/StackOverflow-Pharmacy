import React, { useState } from 'react';
import { Button, TextField, Typography, Container, CssBaseline } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UploadImage() {
  const [medicineName, setMedicineName] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!medicineName || !imageUrl) {
      toast.error('Please provide both the medicine name and an image URL.');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/pharmacists/medicines/upload-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: medicineName, image: imageUrl }),
      });

      if (response.ok) {
        toast.success('Image Uploaded!');
        // You can redirect to the pharmacist dashboard or another page
        // using the React Router or any other navigation method you prefer.
      } else {
        const data = await response.json();
        toast.error(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Upload Medicine Image
        </Typography>
        <form onSubmit={handleUpload} style={{ width: '100%', marginTop: '16px' }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="medicineName"
            label="Medicine Name"
            name="medicineName"
            value={medicineName}
            onChange={(e) => setMedicineName(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="imageUrl"
            label="Image URL"
            name="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <Button type="submit" fullWidth variant="contained" color="primary" style={{ marginTop: '16px' }}>
            Upload
          </Button>
        </form>
      </div>
    </Container>
  );
}

export default UploadImage;
