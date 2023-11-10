import React from 'react';
import { Link } from 'react-router-dom';
import FileUploadButton from './FileUploadButton';

const PharmacistPage = () => {
  const handleFileUpload = (file) => {
    // Handle the file upload, you can store it or send it to a server
    console.log('File uploaded:', file);
  };

  return (
    <div>
      <h1>Pharmacist Page</h1>
      <Link to="/">Home</Link>
      <FileUploadButton onFileUpload={handleFileUpload} />
    </div>
  );
};

export default PharmacistPage;