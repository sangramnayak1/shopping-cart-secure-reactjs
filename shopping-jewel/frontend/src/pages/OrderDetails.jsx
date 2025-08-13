import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.get(`/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrder(res.data);
      } catch (err) {
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

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

  if (loading) return <p>Loading...</p>;
  if (!order) return <p>Order not found</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <Link to="/orders" style={{ marginBottom: '1rem', display: 'inline-block' }}>
        &larr; Back to Orders
      </Link>
      <h2>Order Details</h2>

      <div style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '1rem',
        background: '#fff',
        boxShadow: '0px 2px 4px rgba(0,0,0,0.1)'
      }}>
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Placed on:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
        <p>
          <strong>Status:</strong>{' '}
          <span style={{
            backgroundColor: getStatusColor(order.status),
            color: '#fff',
            padding: '0.25rem 0.75rem',
            borderRadius: '12px',
            fontSize: '0.85rem'
          }}>
            {order.status}
          </span>
        </p>

        {/* Shipping Info (if you have it in order schema) */}
        {order.shippingAddress && (
          <div style={{ marginTop: '1rem' }}>
            <h4>Shipping Address</h4>
            <p>{order.shippingAddress.address}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
            <p>{order.shippingAddress.country}</p>
          </div>
        )}

        <hr />
        <h4>Items</h4>
        {order.orderItems?.map((item, idx) => (
          <div key={idx} style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '0.75rem'
          }}>
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
              <small>{item.qty} × ${item.product?.price?.toFixed(2) || '0.00'}</small>
            </div>
          </div>
        ))}
        <hr />
        <p><strong>Total:</strong> ${order.totalPrice?.toFixed(2) || '0.00'}</p>
      </div>
    </div>
  );
}

export default OrderDetails;

