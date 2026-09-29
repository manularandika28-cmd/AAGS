import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle2 } from 'lucide-react';
import logo from '../Assets/logo.svg';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get('token') || '';
    const email = searchParams.get('email') || '';

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!token || !email) {
            setError('This reset link is missing required information. Please request a new one.');
            return;
        }
        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, token, newPassword })
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                throw new Error(data.error || 'Could not reset your password.');
            }

            setSuccess(true);
            setTimeout(() => navigate('/login'), 2500);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">

            <div className="bg-white border border-slate-200 rounded-xl shadow-md max-w-md w-full p-8 space-y-6 min-h-[600px] flex flex-col justify-center">

                {/* HEADER */}
                <div className="text-center space-y-2">
                    <div className="w-15 h-15 rounded-full bg-blue-50 flex items-center justify-center text-[#071B38] mx-auto">
                        <img src={logo} alt="University Logo" className="w-13 h-13" />
                    </div>

                    <h2 className="text-2xl font-bold text-[#071B38]">
                        {success ? 'Password Updated' : 'Set New Password'}
                    </h2>

                    <p className="text-xs text-slate-500">
                        Faculty of Technology, University of Colombo
                    </p>
                </div>

                <Link
                    to="/login"
                    className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-[#071B38]"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to Sign In
                </Link>

                {error && (
                    <div className="bg-red-50 border border-red-300 text-red-700 text-xs p-3 rounded-md">
                        {error}
                    </div>
                )}

                {success ? (
                    <div className="text-center space-y-3">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                        <p className="text-xs text-slate-600 leading-relaxed">
                            Your password has been updated. Redirecting you to sign in...
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {email && (
                            <p className="text-xs text-slate-500 -mt-2">
                                Resetting password for{' '}
                                <span className="font-semibold text-[#071B38]">{email}</span>
                            </p>
                        )}

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                New Password
                            </label>
                            <div className="relative flex items-center">
                                <span className="absolute left-3 text-slate-400">
                                    <Lock className="w-4 h-4" />
                                </span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    minLength={8}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full pl-9 pr-10 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-[#071B38] text-xs text-slate-800"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-1">At least 8 characters.</p>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Confirm New Password
                            </label>
                            <div className="relative flex items-center">
                                <span className="absolute left-3 text-slate-400">
                                    <Lock className="w-4 h-4" />
                                </span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-[#071B38] text-xs text-slate-800"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-[#071B38] hover:bg-[#0c2b59] text-white font-semibold py-2.5 rounded-md transition-colors shadow-sm disabled:opacity-50 text-xs flex items-center justify-center gap-2"
                        >
                            <span>{isSubmitting ? 'Updating...' : 'Update Password'}</span>
                            {!isSubmitting && <span>→</span>}
                        </button>
                    </form>
                )}
            </div>

            {/* FOOTER */}
            <div className="mt-6 text-center text-white text-[11px] text-slate-400 space-y-0.5">
                <p>© 2026 University of Colombo. All rights reserved.</p>
                <div className="space-x-2">
                    <a href="#" className="hover:underline">Privacy Policy</a>
                    <span>•</span>
                    <a href="#" className="hover:underline">Terms of Use</a>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
