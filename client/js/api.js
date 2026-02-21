const API_BASE = 'http://localhost:5001/api';

const getToken = () => localStorage.getItem('bc_token');

const api = async (endpoint, method = 'GET', body = null) => {
    const headers = { 'Content-Type': 'application/json' };
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const config = { method, headers };
    if (body) config.body = JSON.stringify(body);
    try {
        const res = await fetch(`${API_BASE}${endpoint}`, config);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Request failed');
        return data;
    } catch (err) {
        throw err;
    }
};

window.API = api;
window.getToken = getToken;
