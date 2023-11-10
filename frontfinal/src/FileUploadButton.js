import React from 'react';
import { useDropzone } from 'react-dropzone';

const FileUploadButton = ({ onFileUpload }) => {
  const onDrop = (acceptedFiles) => {
    // Handle the uploaded file (you can send it to a server or process it)
    const file = acceptedFiles[0];
    onFileUpload(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} style={dropzoneStyle}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the image here ...</p>
      ) : (
        <p>Upload medicine image</p>
      )}
    </div>
  );
};

const dropzoneStyle = {
  border: '2px dashed #cccccc',
  borderRadius: '4px',
  padding: '10px', // Adjusted padding to minimize button size
  textAlign: 'center',
  cursor: 'pointer',
};

export default FileUploadButton;