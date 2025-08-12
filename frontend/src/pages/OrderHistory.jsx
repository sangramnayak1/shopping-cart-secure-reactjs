import React, { useEffect, useState } from 'react';
import { getOrders } from '../api'; // your API call

function OrderHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        // Ensure we get an array
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setOrders([]);
      }
    };
    fetchOrders();
  }, []);

  return (
  <div>
    <h2>Your Orders</h2>
    {orders.length > 0 ? (
      orders.map(order => (
        <div
          key={order._id}
          style={{
            border: '1px solid #ccc',
            padding: '1rem',
            marginBottom: '1rem'
          }}
        >
          <h3>Order #{order._id}</h3>
          <p>Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
          <p>Status: <strong>{order.status}</strong></p>

          <ul>
            {order.orderItems?.map((item, idx) => (
              <li key={idx}>
                {item.product?.name} — {item.qty} × ${item.product?.price}
              </li>
            ))}
          </ul>

          <p><strong>Total:</strong> ${order.totalPrice.toFixed(2)}</p>
        </div>
      ))
    ) : (
      <p>No orders found.</p>
    )}
  </div>
);

}

export default OrderHistory;
