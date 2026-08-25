import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check auth session on startup via refresh cookie
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axios.get('http://localhost:3000/api/auth/refresh', {
                    withCredentials: true,
                });
                setAuth({
                    accessToken: res.data.accessToken,
                    user: res.data.user,
                });
            } catch (err) {
                setAuth(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    // Login handler
    const loginUser = async (email, password) => {
        const res = await axios.post(
            'http://localhost:3000/api/auth/login',
            { email, password },
            { withCredentials: true }
        );
        setAuth({
            accessToken: res.data.accessToken,
            user: res.data.user,
        });
        return res.data.user;
    };

    // Logout handler
    const logoutUser = async () => {
        try {
            await axios.post(
                'http://localhost:3000/api/auth/logout',
                {},
                { withCredentials: true }
            );
        } catch (e) {
            console.error('Logout error:', e);
        } finally {
            setAuth(null);
        }
    };

    return (
        <AuthContext.Provider value={{ auth, setAuth, loading, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};