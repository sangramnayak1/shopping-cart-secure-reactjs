import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import OrderHistory from './pages/OrderHistory';
import LogoutLink from './pages/Logout';

function Nav(){
  return (
    <nav style={{ marginBottom: 12 }}>
      <Link to="/register" style={{ marginRight: 8 }}>Register</Link>
      <Link to="/login" style={{ marginRight: 8 }}>Login</Link>
      <Link to="/profile" style={{ marginRight: 8 }}>Profile</Link>
      <Link to="/orders" style={{ marginRight: 8 }}>Orders</Link>
      <LogoutLink />
    </nav>
  );
}

export default function App(){
  return (
    <Router>
      <div style={{ padding: 16 }}>
        <Nav />
        <Routes>
          <Route path="/register" element={<Register/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/orders" element={<OrderHistory/>} />
          <Route path="/" element={<div>Welcome — use the nav</div>} />
        </Routes>
      </div>
    </Router>
  );
}
