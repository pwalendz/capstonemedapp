import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

function OrderDetailsPage() {
    const emailid = useSelector(state => state.email);
    const [orderDetails, setOrderDetails] = useState([]);

    useEffect(() => {
        async function fetchOrderDetails() {
            try {
                const response = await axios.post("http://54.162.14.59:8080/orders/viewOrderDetails2", {
                    email: emailid
        
                    
                });
                setOrderDetails(response.data);
            } catch (error) {
                console.error('Error fetching order details:', error);
            }
        }

        fetchOrderDetails();
    }, []);

    return (
        <div className="container mt-4">
            <h2>Order History</h2>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Order Placed</th>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Order Total</th>
                        <th>Account Number</th>
                        <th>Email</th>
                        
                    </tr>
                </thead>
                <tbody>
                    {orderDetails.map(order => (
                        <tr key={order.orderid}>
                            <td>{order.orderid}</td>
                            <td>{order.orderplaced}</td>
                            <td>{order.pidname}</td>
                            <td>${order.pidprice.toFixed(2)}</td>
                            <td>{order.pidqty}</td>
                            <td>${order.ordertotal.toFixed(2)}</td>
                            <td>{order.account.accno}</td>
                            <td>{order.account.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default OrderDetailsPage;
