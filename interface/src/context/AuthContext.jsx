import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);


const DEMO_USERS = [
    {
        id: 'STU001',
        username: 'student',
        password: 'student123',
        name: 'Demo Student',
        role: 'Student',
        roles: ['Student'],
        dashboard: '/student/dashboard',
    },
    {
        id: 'HOD001',
        username: 'hod',
        password: 'hod123',
        name: 'Demo Head of Department',
        role: 'HOD',
        roles: ['HOD'],
        dashboard: '/hod/dashboard',
    },
    {
        id: 'DEAN001',
        username: 'dean',
        password: 'dean123',
        name: 'Demo Dean',
        role: 'Dean',
        roles: ['Dean'],
        dashboard: '/dean/dashboard',
    },
    {
        id: 'ADM001',
        username: 'admin',
        password: 'admin123',
        name: 'Demo Administrator',
        role: 'Admin',
        roles: ['Admin'],
        dashboard: '/admin/dashboard',
    },
    {
        id: 'LEC001',
        username: 'lecturer',
        password: 'lecturer123',
        name: 'Demo Lecturer',
        role: 'Lecturer',
        roles: ['Lecturer'],
        dashboard: '/lecturer/dashboard',
    },
];

/*
|--------------------------------------------------------------------------
| SESSION CONFIGURATION
|--------------------------------------------------------------------------
*/

const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    /*
    |--------------------------------------------------------------------------
    | Restore existing session
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const storedSession = sessionStorage.getItem('demoSession');

        if (!storedSession) {
            setLoading(false);
            return;
        }

        try {
            const session = JSON.parse(storedSession);

            if (Date.now() > session.expiresAt) {
                sessionStorage.removeItem('demoSession');
                setUser(null);
            } else {
                setUser(session.user);
            }
        } catch (error) {
            console.error('Invalid session:', error);
            sessionStorage.removeItem('demoSession');
            setUser(null);
        }

        setLoading(false);
    }, []);

    /*
    |--------------------------------------------------------------------------
    | LOGIN
    |--------------------------------------------------------------------------
    */

    const loginUser = async (identifier, password) => {
        // Simulates API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        const foundUser = DEMO_USERS.find(
            (demoUser) =>
                demoUser.username.toLowerCase() === identifier.toLowerCase() &&
                demoUser.password === password
        );

        if (!foundUser) {
            const error = new Error('Invalid username or password.');
            error.response = {
                data: {
                    error: 'Invalid username or password.',
                },
            };
            throw error;
        }

        const sessionUser = {
            id: foundUser.id,
            username: foundUser.username,
            name: foundUser.name,
            role: foundUser.role,
            roles: foundUser.roles,
            dashboard: foundUser.dashboard,
        };

        const session = {
            user: sessionUser,
            createdAt: Date.now(),
            expiresAt: Date.now() + SESSION_DURATION,
        };

        sessionStorage.setItem('demoSession', JSON.stringify(session));

        setUser(sessionUser);

        return sessionUser;
    };

    /*
    |--------------------------------------------------------------------------
    | LOGOUT
    |--------------------------------------------------------------------------
    */

    const logout = () => {
        sessionStorage.removeItem('demoSession');
        setUser(null);
    };

    /*
    |--------------------------------------------------------------------------
    | SESSION CHECK
    |--------------------------------------------------------------------------
    */

    const isSessionValid = () => {
        const storedSession = sessionStorage.getItem('demoSession');

        if (!storedSession) {
            return false;
        }

        try {
            const session = JSON.parse(storedSession);

            if (Date.now() > session.expiresAt) {
                sessionStorage.removeItem('demoSession');
                setUser(null);
                return false;
            }

            return true;
        } catch {
            sessionStorage.removeItem('demoSession');
            setUser(null);
            return false;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                loginUser,
                logout,
                isSessionValid,
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