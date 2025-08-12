import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../api';

export default function LogoutLink() {
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  return (
    <Link to="/login" onClick={handleLogout}>
      Logout
    </Link>
  );
}
