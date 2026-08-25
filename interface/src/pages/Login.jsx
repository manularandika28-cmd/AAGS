import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('student@uoc.lk');
    const [password, setPassword] = useState('password123');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { loginUser } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const user = await loginUser(email, password);
            if (user.role === 'Student') {
                navigate('/dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-xl shadow-md max-w-md w-full p-8 space-y-6">
                <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#071B38] mx-auto">
                        <GraduationCap className="w-7 h-7" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#071B38]">AAGS Portal Login</h2>
                    <p className="text-xs text-slate-500">Faculty of Technology, University of Colombo</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-300 text-red-700 text-xs p-3 rounded-md">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-[#071B38] text-xs text-slate-800"
                            placeholder="e.g. student@uoc.lk"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-[#071B38] text-xs text-slate-800"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#FE7F2D] hover:bg-[#F46001] text-white font-semibold py-2.5 rounded-md transition-colors shadow-sm disabled:opacity-50 text-xs"
                    >
                        {isSubmitting ? 'Authenticating...' : 'Log In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;