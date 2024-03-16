// import { ethers } from "ethers";
import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { useAuth } from "../store/auth";
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const { state, connectWallet } = useAuth();
  const navigate = useNavigate();
  const { contract } = state;
  useEffect(() => {
    connectWallet();
  }, [])

  const [username, setUsername] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [userRole, setUserRole] = useState(4);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const transaction = await contract.addUser(address, username, password, userRole);
      await transaction.wait();

      const response = await fetch('http://localhost:4000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          userRole,
          address,
          password,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        alert("Registration Successful");
        navigate('/login');
      } else {
        console.error("Error registering user on the backend");
        alert("An error occurred while registering the user on the backend. Please try again.");
      }

    } catch (error) {
      if (error.code === 4001) {
        alert("Transaction rejected by user"); // Metamask user rejected the transaction
      } else if (error.code === -32000) {
        alert("Transaction failed: " + error.message);
      } else {
        console.error("Error adding user:", error);
        alert("An error occurred while adding the user. Please try again.");
      }
    }
  };
  

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="form-body">
          <form id="registerForm" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="address">Address:</label>
              <input
                type="text"
                id="address"
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="userRole">User Role:</label>
              <select
                id="userRole"
                name="userRole"
                value={userRole}
                onChange={(e) => setUserRole(parseInt(e.target.value, 10))}
                required
              >
                <option value="1">Manufacturer</option>
                <option value="2">Distributor</option>
                <option value="3">Retailer</option>
                <option value="4">User</option>
              </select>
            </div>
            <div className="form-group">
              <button type="submit">Register</button>
            </div>
          </form>
        </div>
      </div>
      <style>{`
       .container {
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        width: 100%;
        max-width: 400px;
      }
      
      .form-header {
        background-color: #4CAF50;
        color: #fff;
        padding: 20px;
        text-align: center;
      }
      
      .form-body {
        padding: 20px;
      }
      
      .form-group {
        margin-bottom: 20px;
      }
      
      label {
        display: block;
        font-weight: bold;
        margin-bottom: 5px;
      }
      
      input {
        width: 100%;
        padding: 10px;
        box-sizing: border-box;
        border: 1px solid #ccc;
        border-radius: 4px;
        margin-top: 5px;
      }
      
      button {
        background-color: #0d6efd;
        color: #fff;
        padding: 10px 15px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      
      button:hover {
        background-color: #45a049;
      }
      `}</style>
    </>
  );
}
