const API_BASE = 'http://localhost:8080/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('jwt_token');
    return token ? {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    } : {
        'Content-Type': 'application/json'
    };
};

export const api = {
    // Auth endpoints
    login: async (email, password) => {
        const res = await fetch(`${API_BASE}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (!res.ok) throw new Error('Invalid credentials');
        return res.json();
    },
    
    register: async (email, password) => {
        const res = await fetch(`${API_BASE}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (!res.ok) throw new Error('Registration failed');
        return res.json();
    },

    // Products endpoints
    getProducts: async () => {
        const res = await fetch(`${API_BASE}/products`, {
            headers: getAuthHeaders()
        });
        if (!res.ok) {
            if (res.status === 401) throw new Error("Unauthorized");
            throw new Error('Failed to fetch products');
        }
        return res.json();
    },

    // Orders endpoints
    placeOrder: async (orderData) => {
        const res = await fetch(`${API_BASE}/orders`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(orderData)
        });
        if (!res.ok) throw new Error('Failed to place order');
        return res.json();
    }
};
