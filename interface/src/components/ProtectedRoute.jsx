import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    // =========================================
    // CHECKING AUTHENTICATION
    // =========================================
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-sm text-slate-600">
                    Checking authentication...
                </div>
            </div>
        );
    }

    // =========================================
    // NOT LOGGED IN
    // =========================================
    if (!user) {
        return (
            <Navigate
                to="/Login"
                replace
                state={{ from: location.pathname }}
            />
        );
    }

    // =========================================
    // ROLE AUTHORIZATION
    // =========================================
    if (
        allowedRoles &&
        !allowedRoles.includes(user.role)
    ) {
        // User is logged in but doesn't have
        // permission to access this page.

        return (
            <Navigate
                to={user.dashboard || '/Login'}
                replace
            />
        );
    }

    // =========================================
    // AUTHORIZED
    // =========================================
    return children;
};

export default ProtectedRoute;