import React, { useState } from 'react';

function UploadImage() {
  const [medicineName, setMedicineName] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!medicineName || !imageUrl) {
      alert('Please provide both the medicine name and an image URL.');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/pharmacists/medicines/uplooad-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: medicineName, image: imageUrl }),
      });

      if (response.ok) {
        toast.success("Image Uploaded!");
        // You can redirect to the pharmacist dashboard or another page
        // using the React Router or any other navigation method you prefer.
      } else {
        const data = await response.json();
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <main>
      <h1>Upload Medicine Image</h1>
      <form onSubmit={handleUpload}>
        <label htmlFor="medicineName">Medicine Name:</label>
        <input
          type="text"
          id="medicineName"
          name="medicineName"
          value={medicineName}
          onChange={(e) => setMedicineName(e.target.value)}
          required
        />

        <label htmlFor="imageUrl">Image URL:</label>
        <input
          type="text"
          id="imageUrl"
          name="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          required
        />

        <button type="submit">Upload</button>
      </form>
    </main>
  );
}

export default UploadImage;
