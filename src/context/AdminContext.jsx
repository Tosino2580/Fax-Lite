/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

const API_URL = 'http://localhost:4000/api/users';

export const AdminProvider = ({ children }) => {
    const [adminToken, setAdminToken] = useState(localStorage.getItem('fax_admin_token') || null);
    const [loading, setLoading] = useState(true);

    // On mount, verify token is still valid
    useEffect(() => {
        if (adminToken) {
            verifyToken();
        } else {
            setLoading(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const verifyToken = async () => {
        try {
            const res = await fetch(`${API_URL}/profile`, {
                headers: { Authorization: `Bearer ${adminToken}` },
            });
            if (res.status === 401) {
                logout();
            }
        } catch {
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const res = await fetch(`${API_URL}/admin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!data.success) {
            throw new Error(data.message || 'Invalid admin credentials');
        }
        setAdminToken(data.token);
        localStorage.setItem('fax_admin_token', data.token);
        return data;
    };

    const logout = () => {
        setAdminToken(null);
        localStorage.removeItem('fax_admin_token');
    };

    const isAdmin = !!adminToken;

    return (
        <AdminContext.Provider value={{ adminToken, loading, login, logout, isAdmin }}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => useContext(AdminContext);
