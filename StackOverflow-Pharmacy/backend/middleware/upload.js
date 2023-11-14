const express = require('express');
const multer = require('multer');
const path = require('path');



// Set up multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'folders'); // Specify the directory where files will be stored
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
    },
});
const upload = multer({ storage: storage });


// Handle file upload
// app.post('/upload', upload.single('file'), (req, res) => {
//     // Access the uploaded file using req.file
//     const file = req.file;
    

//     // Process the file as needed (save to disk, database, etc.)
//     // In this example, we are logging the file details
//     console.log('File received:', file);

//     res.json({ message: 'File uploaded successfully' });
// });

module.exports = {upload}