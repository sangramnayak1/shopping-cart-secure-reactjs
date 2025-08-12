import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.get('/api/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <p>Loading...</p>;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return '#28a745';
      case 'Processing':
        return '#ffc107';
      case 'Pending':
        return '#17a2b8';
      case 'Cancelled':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Your Orders</h2>
      {orders.length > 0 ? (
        orders.map(order => (
          <div
            key={order._id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1.5rem',
              background: '#fff',
              boxShadow: '0px 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div>
                <strong>Order ID:</strong> {order._id}
                <br />
                <small>Placed on: {new Date(order.createdAt).toLocaleDateString()}</small>
              </div>
              <span
                style={{
                  backgroundColor: getStatusColor(order.status),
                  color: '#fff',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                  height: 'fit-content'
                }}
              >
                {order.status}
              </span>
            </div>
            <hr />

            {order.orderItems?.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '0.75rem'
                }}
              >
                <img
                  src={item.product?.image || '/placeholder.png'}
                  alt={item.product?.name}
                  style={{
                    width: '60px',
                    height: '60px',
                    objectFit: 'cover',
                    borderRadius: '5px',
                    marginRight: '1rem'
                  }}
                />
                <div>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>{item.product?.name}</p>
                  <small>
                    {item.qty} × ${item.product?.price?.toFixed(2) || '0.00'}
                  </small>
                </div>
              </div>
            ))}

            <p>
              <strong>Total:</strong> ${order.totalPrice?.toFixed(2) || '0.00'}
            </p>
            <Link
              to={`/order/${order._id}`}
              style={{
                display: 'inline-block',
                marginTop: '0.5rem',
                padding: '0.4rem 0.8rem',
                backgroundColor: '#007bff',
                color: '#fff',
                borderRadius: '5px',
                textDecoration: 'none',
                fontSize: '0.85rem'
              }}
            >
              View Details
            </Link>
          </div>
        ))
      ) : (
        <div
          style={{
            textAlign: 'center',
            marginTop: '3rem',
            padding: '2rem',
            background: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #ddd'
          }}
        >
          <h3>No orders found</h3>
          <p>Looks like you haven’t placed any orders yet.</p>
          <Link
            to="/products"
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#007bff',
              color: '#fff',
              borderRadius: '5px',
              textDecoration: 'none'
            }}
          >
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
}

export default OrderHistory;

