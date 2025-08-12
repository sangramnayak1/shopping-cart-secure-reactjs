import { Link } from 'react-router-dom';
import LogoutLink from './LogoutLink';

export default function Navbar() {
  return (
    <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', background: '#eee' }}>
      <Link to="/">Home</Link>
      <Link to="/orders">Orders</Link>
      <Link to="/profile">Profile</Link>
      <LogoutLink />
    </nav>
  );
}

