import React, { useState } from 'react';
import { register } from '../api';

export default function Register(){
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) =>{
    e.preventDefault();
    setError(null);
    if(!form.name || !form.email || !form.password) { setError('Fill all fields'); return; }
    setLoading(true);
    try{
      const res = await register(form);
      if(res.accessToken){
        localStorage.setItem('accessToken', res.accessToken);
        window.location.href = '/profile';
      } else if(res.msg) setError(res.msg);
    }catch(err){ setError('Failed'); }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 480, margin: '40px auto', padding: 16, border: '1px solid #eee' }}>
      <h2>Create an account</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={onSubmit}>
        <div>
          <input name="name" value={form.name} onChange={onChange} placeholder="Full name" />
        </div>
        <div>
          <input name="email" value={form.email} onChange={onChange} placeholder="Email" />
        </div>
        <div>
          <input name="password" type="password" value={form.password} onChange={onChange} placeholder="Password" />
        </div>
        <button type="submit">{loading ? 'Creating...' : 'Register'}</button>
      </form>
    </div>
  );
}
