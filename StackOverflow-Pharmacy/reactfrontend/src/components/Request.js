import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

function Request() {
  const [pharmacists, setPharmacists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const getAuthTokenFromCookie = () => {
    const authToken = Cookies.get("jwt", { domain: "localhost", path: "/" });
    console.log("Auth token:", authToken);
    return authToken;
  };

  const authToken = getAuthTokenFromCookie();

  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching pharmacists...");
      try {
        const response = await fetch(
          "http://localhost:4000/admin/viewPharmacist",
          {
            method: "GET",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          const data = await response.json();
          setPharmacists(data);
        } else {
          console.error("Error fetching pharmacists:", response.statusText);
          setPharmacists([]);
        }
      } catch (error) {
        console.error("Error fetching pharmacists:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [authToken]);

  const removePharmacistFromList = (pharmacistId) => {
    setPharmacists((prevPharmacists) =>
      prevPharmacists.filter(
        (pharmacist) => pharmacist._id !== pharmacistId
      )
    );
  };

  const rejectRequest = (pharmacistId) => {
    console.log("Rejecting pharmacist with ID:", pharmacistId);
    // Send a request to reject the pharmacist
    fetch(`http://localhost:4000/admin/reject/`, {
      method: "POST",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${authToken}`, // Include the user's JWT token
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pharmacistId }),
    })
      .then((response) => {
        if (response.status === 200) {
          // Update local state immediately after successful request
          removePharmacistFromList(pharmacistId);
        } else {
          console.error("Error rejecting pharmacist:", response.statusText);
        }
      })
      .catch((error) => console.error("Error rejecting pharmacist:", error));
  };

  const acceptRequest = (pharmacistId) => {
    console.log("Accepting pharmacist with ID:", pharmacistId);
    // Send a request to accept the pharmacist
    fetch(`http://localhost:4000/admin/accept/`, {
      method: "POST",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${authToken}`, // Include the user's JWT token
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pharmacistId }),
    })
      .then((response) => {
        if (response.status === 200) {
          // Update local state immediately after successful request
          removePharmacistFromList(pharmacistId);
        } else {
          console.error("Error accepting pharmacist:", response.statusText);
        }
      })
      .catch((error) => console.error("Error accepting pharmacist:", error));
  };

  return (
    <div>
      <h1>Pharmacist Requests</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : pharmacists.length === 0 ? (
        <p>No pharmacists.</p>
      ) : (
        <ul>
          {pharmacists.map((pharmacist) => (
            <li key={pharmacist._id}>
              <h3>Pharmacist Username: {pharmacist.name}</h3>
              <p>
                Pharmacist Education Background:{" "}
                {pharmacist.educationBackground}
              </p>
              {pharmacist.status === "Pending" && (
                <>
                  <button onClick={() => acceptRequest(pharmacist._id)}>
                    Accept
                  </button>
                  <button onClick={() => rejectRequest(pharmacist._id)}>
                    Reject
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Request;
