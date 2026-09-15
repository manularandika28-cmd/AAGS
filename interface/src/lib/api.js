import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const getStoredToken = () => {
  try {
    const sessionStr = sessionStorage.getItem('authSession') || localStorage.getItem('authSession');
    if (sessionStr) {
      const parsed = JSON.parse(sessionStr);
      if (parsed?.accessToken) return parsed.accessToken;
      if (parsed?.token) return parsed.token;
    }
  } catch (e) {
    console.warn('Error reading authSession token:', e);
  }

  return (
    sessionStorage.getItem('accessToken') ||
    localStorage.getItem('accessToken') ||
    localStorage.getItem('aags_token') ||
    null
  );
};

API.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export async function api(path, options = {}) {
  const token = getStoredToken();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(API_BASE_URL + path, { ...options, headers });
  let data = {};
  try { data = await res.json(); } catch {}
  if (!res.ok) throw new Error(data.error || data.message || 'Request failed');
  return data;
}

export default API;