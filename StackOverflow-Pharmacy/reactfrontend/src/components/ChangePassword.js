// ChangePassword.js
import React, { useState } from 'react';
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const getAuthTokenFromCookie = () => {
    const authToken = Cookies.get("jwt", { domain: "localhost", path: "/" });
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
  const handleChangePassword = async (e) => {
    e.preventDefault();
    console.log('Authentication Token:', authToken);
    if (!validatePassword(newPassword)) {
        toast.error(
          'New password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 digit. Minimum length is 8 characters.'
        );
        return;
      }
    const userId = await getUserId();
    console.log("iddddd : ",userId)
    try {
      const response = await fetch(`http://localhost:4000/api/users/changePassword/${userId}`, {
        method: 'POST',
        credentials: "include",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      console.log('Sending data:', JSON.stringify({ oldPassword, newPassword }));

      if (response.status === 200) {
        // Password change successful, you may want to redirect or show a success message
        console.log('Password changed successfully');
        toast.success("Password changed successfully");
      } else if (response.status === 401) {
        // Invalid old password, handle accordingly
        console.error('Invalid old password');
      } else {
        // Handle other errors
        console.error('Error changing password');
      }
    } catch (error) {
      console.error('Error during password change:', error);
    }
  };
  const validatePassword = (password) => {
    // Define your password validation rules here
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
    return regex.test(password);
  };
  return (
    <div>
      <h1>Change Password</h1>
      <form onSubmit={handleChangePassword}>
        <div>
          <label>Old Password</label>
          <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
        </div>
        <div>
          <label>New Password</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
        </div>
        <div>
          <label>Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
}

export default ChangePassword;
