import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { v4 as uuidv4 } from 'uuid';
import qrCode from 'qrcode';
import { useAuth } from '../store/auth';

export default function Manufacturer() {
  const { state } = useAuth();
  const { contract } = state;
  const [manufactureDate, setManufactureDate] = useState("");
  const [productID, setProductID] = useState("");
  const [batchNo, setBatchNo] = useState("");
  const [prdName, setPrdName] = useState("");
  const [qrcode, setQRCode] = useState("");
  const [expirationDate, setExpirationDate] = useState("");

  useEffect(() => {
    const initializeProductData = async () => {
      setProductID(generateUniqueID());
      setManufactureDate(getCurrentDate());
      await generateQRCode();
    };

    initializeProductData();
  }, []);

  const generateUniqueID = () => {
    return uuidv4();
  };

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;

    return `${year}-${month}-${day}`;
  };

  const generateQRCode = async () => {
    const url = await qrCode.toDataURL(`http://localhost:${productID}`);
    setQRCode(url);
    console.log(url);
  };

  const convertQRCodeToPNG = (qrCodeUrl) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = qrCodeUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        canvas.toBlob(blob => {
          resolve(new File([blob], 'qrcode.png', { type: 'image/png' }));
        }, 'image/png');
      };
      img.onerror = reject;
    });
  };

  const addProduct = async (e) => {
    e.preventDefault();
    if (qrCode) {
      try {
        const qrCodeUrl = await qrCode.toDataURL(productID);
        const qrCodePng = await convertQRCodeToPNG(qrCodeUrl);
        const formData = new FormData();
        formData.append('file', qrCodePng);

        const resFile = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
          method: "post",
          body: formData,
          headers: {
            pinata_api_key: "2116f8d5d3eda0bd29e1",
            pinata_secret_api_key: "1858c1b96394993389570925ad7bb82be08f04f21d0d31a8520cf9738200b8f7",
          },
        });

        const data = await resFile.json();
        const ImgHash = data.IpfsHash;
        console.log(ImgHash);
        setQRCode(ImgHash);
        const transaction = await contract.uploadProduct(productID);
        await transaction.wait();
        if (transaction) {
          const ans = await fetch("http://localhost:4000/post", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              productID, prdName, batchNo, qrcode: ImgHash, manufactureDate, expirationDate
            })
          })
          if (ans.ok) {
            alert("Product Added Successfully");
            setProductID(generateUniqueID());
            setBatchNo("");
            setPrdName("");
            setExpirationDate("");
            await generateQRCode();
          } else {
            alert("BatchNo. Already Exist");
          }
        }
        else {
          alert("Error Adding Product");
        }


      } catch (error) {
        console.error("Error while adding product:", error);
        alert("Server Busy, Try Again Later");
      }
    }
    else {
      alert("QR Code not Generated yet");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container col-lg-6 col-md-8 col-sm-10">
        <form onSubmit={addProduct}>
          <div className="mb-3">
            <label htmlFor="product_id" className="form-label">Product ID:</label>
            <input type="text" id="product_id" name="product_id" className="form-control" required value={productID} readOnly />
          </div>

          <div className="mb-3">
            <label htmlFor="product_name" className="form-label">Product Name:</label>
            <input type="text" id="product_name" name="product_name" className="form-control" required value={prdName} onChange={(e) => setPrdName(e.target.value)} />
          </div>

          <div className="mb-3">
            <label htmlFor="batch_no" className="form-label">Batch Number:</label>
            <input type="text" id="batch_no" name="batch_no" className="form-control" required value={batchNo} onChange={(e) => setBatchNo(e.target.value)} />
          </div>

          {qrcode && (
            <div className='mb-3'>
              <label htmlFor='qrcode' className="form-label">QR Code:</label>
              <div className='text-center'>
                <img src={qrcode} alt="" className="img-fluid" />
              </div>
            </div>
          )}

          <div className="mb-3">
            <label htmlFor="manufacture_date" className="form-label">Manufacture Date:</label>
            <input type="date" id="manufacture_date" name="manufacture_date" className="form-control" required value={manufactureDate} onChange={(e) => setManufactureDate(e.target.value)} />
          </div>

          <div className="mb-3">
            <label htmlFor="expiration_date" className="form-label">Expiration Date:</label>
            <input type="date" id="expiration_date" name="expiration_date" className="form-control" required value={expirationDate} onChange={(e) => setExpirationDate(e.target.value)} />
          </div>

          <button type="submit" className='btn btn-primary'>Submit</button>
        </form>
      </div>
    </>
  );
}