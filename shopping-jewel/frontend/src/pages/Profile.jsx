import React, { useEffect, useState } from 'react';
import { getMe, updateMe } from '../api';

export default function Profile(){
  const [profile, setProfile] = useState({ name:'', email:'', address:'', phone:'' });
  const [msg, setMsg] = useState(null);

  useEffect(()=>{
    async function load(){ const me = await getMe(); setProfile(me || {}); }
    load();
  },[]);

  const handleChange = e => setProfile({ ...profile, [e.target.name]: e.target.value });
  const handleSave = async () => {
    const res = await updateMe(profile);
    setMsg(res?.message || 'Saved');
  };

  return (
    <div style={{ maxWidth: 720, margin: '24px auto' }}>
      <h2>Profile</h2>
      <div><input name="name" value={profile.name||''} onChange={handleChange} /></div>
      <div><input name="phone" value={profile.phone||''} onChange={handleChange} /></div>
      <div><textarea name="address" value={profile.address||''} onChange={handleChange} /></div>
      <div><button onClick={handleSave}>Save</button></div>
    </div>
  );
}
