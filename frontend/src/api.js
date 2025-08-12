const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAccessToken = () => localStorage.getItem('accessToken');

async function request(path, options = {}){
  const opts = { ...options };
  opts.headers = opts.headers || {};
  if (!opts.headers['Content-Type']) opts.headers['Content-Type'] = 'application/json';
  const token = getAccessToken();
  if(token) opts.headers['Authorization'] = `Bearer ${token}`;
  opts.credentials = 'include';
  const res = await fetch(`${API_BASE}${path}`, opts);
  if(res.status === 401 && path !== '/auth/refresh'){
    const refreshed = await fetch(`${API_BASE}/auth/refresh`, { method: 'POST', credentials: 'include' });
    if(refreshed.ok){
      const data = await refreshed.json();
      localStorage.setItem('accessToken', data.accessToken);
      opts.headers['Authorization'] = `Bearer ${data.accessToken}`;
      const retry = await fetch(`${API_BASE}${path}`, opts);
      const text = await retry.text();
      try { return JSON.parse(text); } catch { return text; }
    }
  }
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

export const register = (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) });
export const login = (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) });
export const logout = () => request('/auth/logout', { method: 'POST' });
export const getMe = () => request('/users/me', { method: 'GET' });
export const updateMe = (data) => request('/users/me', { method: 'PUT', body: JSON.stringify(data) });
export const getOrders = () => request('/orders', { method: 'GET' });
export const getOrder = (id) => request(`/orders/${id}`, { method: 'GET' });
