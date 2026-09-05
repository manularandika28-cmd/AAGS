import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

const API_BASE = 'http://localhost:3000/api/auth';

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);

    /*
    |--------------------------------------------------------------------------
    | Restore existing session on page load
    |--------------------------------------------------------------------------
    */
    useEffect(() => {
        const storedSession = sessionStorage.getItem('authSession');

        if (!storedSession) {
            setLoading(false);
            return;
        }

        try {
            const session = JSON.parse(storedSession);
            setUser(session.user);
            setAccessToken(session.accessToken);
        } catch (error) {
            console.error('Invalid session:', error);
            sessionStorage.removeItem('authSession');
        }

        setLoading(false);
    }, []);

    /*
    |--------------------------------------------------------------------------
    | LOGIN
    |--------------------------------------------------------------------------
    */
    const loginUser = async (email, password) => {
        const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // sends/receives the httpOnly refresh cookie
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }

        sessionStorage.setItem(
            'authSession',
            JSON.stringify({ user: data.user, accessToken: data.accessToken })
        );

        setUser(data.user);
        setAccessToken(data.accessToken);

        return data.user;
    };

    /*
    |--------------------------------------------------------------------------
    | LOGOUT
    |--------------------------------------------------------------------------
    */
    const logout = async () => {
        try {
            await fetch(`${API_BASE}/logout`, {
                method: 'POST',
                credentials: 'include',
            });
        } catch (error) {
            console.error('Logout request failed:', error);
        }

        sessionStorage.removeItem('authSession');
        setUser(null);
        setAccessToken(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                accessToken,
                loading,
                loginUser,
                logout,
                isAuthenticated: !!user,
            }}
        >
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

export { AuthProvider };