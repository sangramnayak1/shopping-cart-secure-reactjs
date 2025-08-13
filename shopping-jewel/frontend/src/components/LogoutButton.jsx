// components/LogoutButton.jsx
import React from 'react';

export default function LogoutButton() {
  return (
    <button onClick={() => window.location.href = '/logout'}>
      Logout
    </button>
  );
}

