import React, { useEffect, useRef, useState } from 'react';
import Navbar from './Navbar';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useAuth } from '../store/auth';

export default function User() {
  const { state } = useAuth();
  const { contract } = state;
  const scannerRef = useRef();
  const [res, setRes] = useState("");
  const [head,setHead] = useState("");

  useEffect(async () => {
    const onScanSuccess = async (decodedText, decodedResult) => {
      setRes(decodedText);
    };
    const scannerId = 'qrScanner';
    scannerRef.current.id = scannerId;

    const htmlScanner = new Html5QrcodeScanner(scannerId, { fps: 10, qrbos: 250 });
    htmlScanner.render(onScanSuccess);

    return () => {
      htmlScanner.clear();
    };
  }, []);


  let mongores;
  let num;
  async function fetchData(id) {
    try {
      const response = await fetch(`http://localhost:8000/fetch/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });
      if (response.ok) {
        const data = await response.json();
        
        mongores = data.ans.productID;
        num = data.ans.purchased;
        // setResult({
        //   prd_name: data.ans.prdName,
        //   expirationDate: new Date(data.ans.expirationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        //   manufacturingDate: new Date(data.ans.manufactureDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        // });        
      } else {
        console.log("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }



  const isFake = async () => {
    try {
      await fetchData(res);
      const prd = await contract.products(res);
      
      if(prd===mongores && num==0){
        setHead("Product is Real")
        
      }
      else{
        setHead("Product is fake");
      }
      // const real = await contract.isReal(res);

     
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred during login. Please try again.");
    }
  };


  return (
    <>
      <Navbar />
      <div className="container">
        <div className="input-group mb-4">
          <input type="text" className="form-control" placeholder="Enter Product ID" aria-label="Recipient's username" aria-describedby="basic-addon2" value={res} onChange={(e) => setRes(e.target.value)} />
          <span className="input-group-text btn btn-outline-primary ms-2 fw-semibold" id="basic-addon2" onClick={isFake}>Detect</span>
        </div>
        <h4 className='text-center'>OR</h4>
        <div style={{ width: '400px', marginInline: "auto" }} ref={scannerRef}></div>
        <h3 className='mt-5 text-center'>
        {head}
          
        </h3>
      </div>

      <style>
        {`
          .container {
            height: 300px; 
            width: 600px; 
          }
        `}
      </style>
    </>
  );
}
