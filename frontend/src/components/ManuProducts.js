import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';

const ManuProducts = () => {
    const [items, setItems] = useState([]);

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:4000/get');
            const data = await response.json();
            setItems(data.ans);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    const handleSoldClick = async (productId) => {
        try {
            const response = await fetch(`http://localhost:4000/sold/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ distributor: true })
            });

            if (response.ok) {
                await fetchData();
                console.log(`Product ${productId} is marked as sold.`);
            } else {
                console.error(`Failed to mark product ${productId} as sold.`);
            }
        } catch (error) {
            console.error('Error marking product as sold:', error);
        }
    };

    return (
        <div>
            <Navbar/>
            <h3 className='text-center mt-4'>Product List</h3>

            <table class="table table-dark table-striped container">
                <thead>
                    <tr className='text-center'>
                        <th scope="col">Product ID</th>
                        <th scope="col">Product Name</th>
                        <th scope="col">Batch No</th>
                        <th scope="col">Manufacture Date</th>
                        <th scope="col">Expiration Date</th>
                        <th scope="col">Sell Product</th>
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
                            <td><button className='btn btn-primary' onClick={() => handleSoldClick(item.productID)}>Sold</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManuProducts;
