import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import logo from '../Assets/logo.svg';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || 'Something went wrong. Please try again.');
            }

            // Backend always returns the same generic message whether or
            // not the email exists, so we just show the "check your inbox" state.
            setSubmitted(true);
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
                        {submitted ? 'Check Your Email' : 'Reset Password'}
                    </h2>

                    <p className="text-xs text-slate-500">
                        Faculty of Technology, University of Colombo
                    </p>
                </div>

                {/* BACK BUTTON */}
                <Link
                    to="/login"
                    className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-[#071B38]"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to Sign In
                </Link>

                {/* ERROR MESSAGE */}
                {error && (
                    <div className="bg-red-50 border border-red-300 text-red-700 text-xs p-3 rounded-md">
                        {error}
                    </div>
                )}

                {submitted ? (
                    <div className="text-center space-y-3">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                        <p className="text-xs text-slate-600 leading-relaxed">
                            If an account exists for <span className="font-semibold text-slate-800">{email}</span>,
                            we've sent a password reset link. It expires in 20 minutes.
                        </p>
                        <p className="text-xs text-slate-500">
                            Didn't get it? Check your spam folder, or{' '}
                            <button
                                type="button"
                                onClick={() => setSubmitted(false)}
                                className="font-semibold text-[#071B38] hover:underline"
                            >
                                try again
                            </button>.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Registered Email
                            </label>

                            <div className="relative flex items-center">
                                <span className="absolute left-3 text-slate-400">
                                    <Mail className="w-4 h-4" />
                                </span>

                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-[#071B38] text-xs text-slate-800"
                                    placeholder="e.g. user@tech.cmb.ac.lk"
                                />
                            </div>

                            <p className="text-[11px] text-slate-400 mt-1.5">
                                Works for students, lecturers, HODs, deans and admins.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-[#071B38] hover:bg-[#0c2b59] text-white font-semibold py-2.5 rounded-md transition-colors shadow-sm disabled:opacity-50 text-xs flex items-center justify-center gap-2"
                        >
                            <span>{isSubmitting ? 'Sending...' : 'Send Reset Link'}</span>
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

export default ForgotPassword;
