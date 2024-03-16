import React, { useEffect, useState } from 'react';
import { useAuth } from '../store/auth';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";

const SetDoctorProfile = () => {

    const { state, address, connectWallet } = useAuth();
    const { contract1 } = state;

    const navigate = useNavigate();
    useEffect(() => {
        connectWallet();
    },[])
    
    const [license, setLicense] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');
    const [dob, setDob] = useState('');
    const [qualification, setQualification] = useState('');
    const [major, setMajor] = useState('');

    
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // const tx = await contract1.setDoctor(license, name, phone, gender, dob, qualification, major);
            // await tx.wait();
            const dcount = await contract1.getDoctorCount();
            await dcount.wait();
            window.alert("Doctor count:", dcount);
            // alert("Doctor Profile set Successfully!!!");
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
          <form onSubmit={handleSubmit}>
            <label for="address">Address:</label>
            <input type="text" id="address" name="address" required value={address} />

            <label>License:</label>
            <input type="text" value={license} onChange={(e) => setLicense(e.target.value)} />

            <label>Name:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

            <label>Phone:</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />

            <label>Gender:</label>
            <input type="text" value={gender} onChange={(e) => setGender(e.target.value)} />

            <label>DOB:</label>
            <input type="text" value={dob} onChange={(e) => setDob(e.target.value)} />

            <label>Qualification:</label>
            <input type="text" value={qualification} onChange={(e) => setQualification(e.target.value)} />

            <label>Major:</label>
            <input type="text" value={major} onChange={(e) => setMajor(e.target.value)} />

            <button type="submit">Set Doctor Details</button>
          </form>
        </div >
      </div >
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
  )
}

export default SetDoctorProfile