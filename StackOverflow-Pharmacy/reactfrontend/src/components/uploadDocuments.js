import React from 'react';
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
const uploadID = async (formData) => {
  // Send a request to remove the medicine from the cart
  const userId = await getUserId();

  if (!userId) {
    // Redirect to login or handle the case where user ID is not available
    navigate('/login');
    return;
  }
  console.log(userId)
//  const userId="6555ac7d28f15aca03b5b303"
   fetch(`http://localhost:4000/api/pharmacists/uploadID/${userId}`, {
    method: 'PUT',
    credentials: 'include',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: formData
  })
    .then((response) => response.json())
    .then((data) => {
      // Handle the response or perform additional actions if needed
    })
    .catch((error) =>
      console.error('Error removing medicine from cart:', error)
    );
};
const uploadPharmacyDegree = async (formData) => {
    // Send a request to remove the medicine from the cart
    const userId = await getUserId();
  
    if (!userId) {
      // Redirect to login or handle the case where user ID is not available
      navigate('/login');
      return;
    }
    console.log(userId)
  //  const userId="6555ac7d28f15aca03b5b303"
     fetch(`http://localhost:4000/api/pharmacists/uploadPharmacyDegree/${userId}`, {
      method: 'PUT',
      credentials: 'include',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: formData
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response or perform additional actions if needed
      })
      .catch((error) =>
        console.error('Error removing medicine from cart:', error)
      );
  };
  const uploadWorkingLicences = async (formData) => {
    // Send a request to remove the medicine from the cart
    const userId = await getUserId();
  
    if (!userId) {
      // Redirect to login or handle the case where user ID is not available
      navigate('/login');
      return;
    }
    console.log(userId)
  //  const userId="6555ac7d28f15aca03b5b303"
     fetch(`http://localhost:4000/api/pharmacists/uploadWorkingLicences/${userId}`, {
      method: 'PUT',
      credentials: 'include',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: formData
    })
      .then((response) => response.json())
      .then((data) => {
        toast.success(
          'Thank you, you can log in after approving your request!'
        );
      })
      .catch((error) =>
        console.error('Error removing medicine from cart:', error)
      );
  };

const UploadDocuments = () => {
const navigate = useNavigate();

  const handleIDUpload = (event) => {
    event.preventDefault();

    // Assuming you have a file input with the name "image"
    const formData = new FormData();
    formData.append('image', event.target.elements.image.files[0]);

    // Send the form data to the server for image upload
    uploadID(formData)

  };
  const handlePharmacyDegreeUpload = (event) => {
    event.preventDefault();

    // Assuming you have a file input with the name "image"
    const formData = new FormData();
    formData.append('image', event.target.elements.image.files[0]);

    // Send the form data to the server for image upload
    uploadPharmacyDegree(formData)

  };
  const handleWorkingLiecencesUpload = (event) => {
    event.preventDefault();

    // Assuming you have a file input with the name "image"
    const formData = new FormData();
    formData.append('image', event.target.elements.image.files[0]);

    // Send the form data to the server for image upload
    uploadWorkingLicences(formData)

  };

  return (
    <>
      <h1>Upload Documents</h1>
      <h2>Upload ID</h2>
      <form onSubmit={handleIDUpload} encType="multipart/form-data">
        {/* Input for selecting an image file */}
        <input type="file" name="image" />

        {/* Submit button */}
        <button type="submit">Upload</button>
      </form>
      <h2>Upload pharmacy degree</h2>
      <form onSubmit={handlePharmacyDegreeUpload} encType="multipart/form-data">
        {/* Input for selecting an image file */}
        <input type="file" name="image" />

        {/* Submit button */}
        <button type="submit">Upload</button>
      </form>
      <h2>Upload working liecnse</h2>
      <form onSubmit={handleWorkingLiecencesUpload} encType="multipart/form-data">
        {/* Input for selecting an image file */}
        <input type="file" name="image" />

        {/* Submit button */}
        <button type="submit">Upload</button>
      </form>
    </>
  );
};

export default UploadDocuments;
