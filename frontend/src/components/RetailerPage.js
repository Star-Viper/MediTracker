import React, { useEffect, useRef, useState } from 'react';
import Navbar from './Navbar';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useAuth } from '../store/auth';

export default function User() {
    const { state } = useAuth();
    const { contract } = state;
    const [items, setItems] = useState([]);
    const scannerRef = useRef();
    const [res, setRes] = useState("");

    const [Result, setResult] = useState({
        prd_id: null,
        prd_name: null,
        batch_no: null,
        expirationDate: null,
        manufacturingDate: null
    });



    const getData = async () => {
        try {
            const response = await fetch('http://localhost:4000/retailer_get_distributor');
            const data = await response.json();
            setItems(data.ans);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    useEffect(async () => {
        getData();
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


    async function markProductAsSold(id) {
        try {
            const response = await fetch(`http://localhost:4000/solded/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const result = await response.json();
                setItems(prevItems => prevItems.filter(item => item._id !== id));
                alert("Product Marked As Sold");
            } else {
                console.log("Failed to mark product as sold");
            }
        } catch (error) {
            console.error("Error marking product as sold:", error);
        }
    }



    let mongores;
    async function fetchData(id) {
        try {
            const response = await fetch(`http://localhost:4000/fetch/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if (response.ok) {
                const data = await response.json();
                await markProductAsSold(data.ans._id);
            } else {
                console.log("Failed to fetch data");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }



    const isFake = async () => {
        await fetchData(res);
    };


    return (
        <>
            <Navbar />
            <div className="container mt-5">
                <div className="input-group mb-4">
                    <input type="text" className="form-control" placeholder="Enter Product ID" aria-label="Recipient's username" aria-describedby="basic-addon2" value={res} onChange={(e) => setRes(e.target.value)} />
                    <span className="input-group-text btn btn-outline-primary ms-2 fw-semibold" id="basic-addon2" onClick={isFake}>Solded</span>
                </div>
                <h4 className='text-center'>OR</h4>
                <div style={{ width: '400px', marginInline: "auto" }} ref={scannerRef}></div>
            </div>

            <h3 className='text-center m-4'>Product List</h3>

            {items.length === 0 ? (
                <h2 className="text-center">No products available</h2>
            ) : (
                <table class="table table-dark table-striped container">
                    <thead>
                        <tr className='text-center'>
                            <th scope="col">Product ID</th>
                            <th scope="col">Product Name</th>
                            <th scope="col">Batch No</th>
                            <th scope="col">Manufacture Date</th>
                            <th scope="col">Expiration Date</th>

                        </tr>
                    </thead>
                    <tbody>

                        {items.map(item => (
                            <tr key={item._id} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }} className='text-center'>
                                <td>{item.productID}</td>
                                <td>{item.prdName}</td>
                                <td>{item.batchNo}</td>
                                <td>{new Date(item.manufactureDate).toLocaleDateString()}</td>
                                <td>{new Date(item.expirationDate).toLocaleDateString()}</td>

                            </tr>
                        ))}
                    </tbody>
                </table>

            )}

        </>
    );
}
