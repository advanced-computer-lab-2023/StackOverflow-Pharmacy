import React, { useState } from 'react';

function DocumentUpload() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = () => {
    // Implement file upload logic here
    if (selectedFile) {
      // You can send the selectedFile to your server or perform other actions.
      console.log('Uploading file:', selectedFile.name);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload</button>
    </div>
  );
}

export default DocumentUpload;
