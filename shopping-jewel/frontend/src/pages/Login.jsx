import React, { useState } from 'react';
import { login } from '../api';

export default function Login(){
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = async (e) =>{
    e.preventDefault();
    setErr(null);
    try{
      const res = await login(form);
      if(res.accessToken){
        localStorage.setItem('accessToken', res.accessToken);
        window.location.href = '/profile';
      } else setErr('Login failed');
    }catch(err){ setErr('Login failed'); }
  };

  return (
    <div style={{ maxWidth: 480, margin: '40px auto', padding: 16 }}>
      <h2>Login</h2>
      {err && <div style={{ color: 'red' }}>{err}</div>}
      <form onSubmit={onSubmit}>
        <input name="email" onChange={onChange} placeholder="Email" />
        <input name="password" type="password" onChange={onChange} placeholder="Password" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
