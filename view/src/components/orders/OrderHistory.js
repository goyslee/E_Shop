//view\src\components\orders\OrderHistory.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function OrderHistory() {
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
  }, []);

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
    <div>
      <h2>Your Order History</h2>
      {orders.map((order) => (
        <div key={order.orderid}>
          <h3>Order ID: {order.orderid}</h3>
          <p>Date: {new Date(order.orderdate).toLocaleDateString()}</p>
          <p>Total Price: ${order.totalprice}</p>
          <p>Shipping Address: {order.shippingaddress}</p>
          {/* Additional order details can be displayed here */}
        </div>
      ))}
    </div>
  );
}

