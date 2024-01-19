//view\src\components\orders\OrderHistory.js
//view\src\components\orders\OrderHistory.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

import './OrderHistory.css';

export default function OrderHistory() {
  const { userid, isAuthenticated } = useSelector(state => {
    console.log('Redux State in Cart:', state); // Add this line
    return state.auth;
  });
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:3000/orders', { withCredentials: true });
        setOrders(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [userid, isAuthenticated]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (orders.length === 0) {
    return <div>You have no order history.</div>;
  }

  return (
    <div className="container">
      <h2>Your Order History</h2>
      {orders.map((order) => (
        <div key={order.orderid} className="order-card">
          <h3>Order ID: {order.orderid}</h3>
          <p>Date: {new Date(order.orderdate).toLocaleDateString()}</p>
          <p>Total Price: ${order.totalprice}</p>
          <p>Shipping Address: {order.shippingaddress}</p>
          <p>Number of Items: {order.orderdetails ? order.orderdetails.length : 0}</p>
          {order.orderdetails && (
            <ul className="order-details">
              {order.orderdetails.map((item) => (
                <li key={item.orderdetailid}>
                  <img src={item.product.image_url} alt={item.product.name} />
                  <div className="item-info">
                    <p>{item.product.name}</p>
                    <p>Quantity: <span className="item-quantity">{item.quantity}</span></p>
                    <p>Total: <span className="item-price">£{item.price * item.quantity}</span> (£{item.price})</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}