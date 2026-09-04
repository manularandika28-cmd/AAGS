import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowLeft } from 'lucide-react';

const staffRoleOptions = [
    { key: 'HOD', label: 'Head of Department', path: '/hod/dashboard' },
    { key: 'Admin', label: 'Administrator', path: '/admin/dashboard' },
    { key: 'Dean', label: 'Dean', path: '/dean/dashboard' },
    { key: 'Lecturer', label: 'Lecturer', path: '/lecturer/dashboard' },
];

const Login = () => {
    const [step, setStep] = useState('choose-type');   // 'choose-type' | 'choose-staff-role' | 'form'
    const [role, setRole] = useState(null);             // 'Student' | 'Staff'
    const [staffRole, setStaffRole] = useState(null);   // 'HOD' | 'Admin' | 'Dean' | 'Lecturer'

    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { loginUser } = useAuth();
    const navigate = useNavigate();

    const handleSelectType = (type) => {
        setRole(type);
        setError('');
        if (type === 'Student') {
            setStep('form');
        } else {
            setStep('choose-staff-role');
        }
    };

    const handleSelectStaffRole = (key) => {
        setStaffRole(key);
        setError('');
        setStep('form');
    };

    const handleBack = () => {
        setError('');
        if (step === 'form' && role === 'Staff') {
            setStep('choose-staff-role');
        } else {
            setStep('choose-type');
            setRole(null);
            setStaffRole(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const user = await loginUser(identifier, password);

            if (role === 'Student') {
                navigate('/student/dashboard');
                return;
            }

            const allowed = user.roles
                ? user.roles.includes(staffRole)
                : user.role === staffRole;

            if (!allowed) {
                setError(`This account is not authorized to log in as ${staffRole}.`);
                return;
            }

            const target = staffRoleOptions.find((r) => r.key === staffRole);
            navigate(target.path);
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen  flex flex-col items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-xl shadow-md max-w-md w-full p-8 space-y-6 min-h-[600px] flex flex-col justify-center">

                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#071B38] mx-auto">
                        <GraduationCap className="w-7 h-7" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#071B38]">
                        {step === 'choose-type' && 'Universal Login'}
                        {step === 'choose-staff-role' && 'Login As'}
                        {step === 'form' && 'Enter Credentials'}
                    </h2>
                    <p className="text-xs text-slate-500">Faculty of Technology, University of Colombo</p>
                </div>

                {/* Back button, once past step 1 */}
                {step !== 'choose-type' && (
                    <button
                        type="button"
                        onClick={handleBack}
                        className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-[#071B38]"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-300 text-red-700 text-xs p-3 rounded-md">
                        {error}
                    </div>
                )}

                {/* STEP 1: Student or Staff */}
                {step === 'choose-type' && (
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => handleSelectType('Student')}
                            className="flex flex-col items-center gap-2 p-5 border border-slate-200 rounded-lg hover:border-[#071B38] hover:bg-slate-50 transition-colors"
                        >
                            <GraduationCap className="w-6 h-6 text-[#071B38]" />
                            <span className="text-xs font-semibold text-slate-800">Student</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSelectType('Staff')}
                            className="flex flex-col items-center gap-2 p-5 border border-slate-200 rounded-lg hover:border-[#071B38] hover:bg-slate-50 transition-colors"
                        >
                            <ShieldCheck className="w-6 h-6 text-[#071B38]" />
                            <span className="text-xs font-semibold text-slate-800">Staff</span>
                        </button>
                    </div>
                )}

                {/* STEP 2: which staff role (only if Staff was picked) */}
                {step === 'choose-staff-role' && (
                    <div className="grid grid-cols-2 gap-3">
                        {staffRoleOptions.map((r) => (
                            <button
                                key={r.key}
                                type="button"
                                onClick={() => handleSelectStaffRole(r.key)}
                                className="flex flex-col items-center justify-center gap-1 p-4 border border-slate-200 rounded-lg hover:border-[#071B38] hover:bg-slate-50 transition-colors text-center"
                            >
                                <span className="text-xs font-semibold text-slate-800">{r.label}</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* STEP 3: actual login form */}
                {step === 'form' && (
                    <>
                        {role === 'Staff' && (
                            <p className="text-xs text-slate-500 -mt-2">
                                Logging in as <span className="font-semibold text-[#071B38]">{staffRole}</span>
                            </p>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    {role === 'Student' ? 'University ID / Email' : 'Email Address'}
                                </label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-3 text-slate-400">
                                        <Mail className="w-4 h-4" />
                                    </span>
                                    <input
                                        type="text"
                                        required
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-[#071B38] text-xs text-slate-800"
                                        placeholder={role === 'Student' ? 'e.g. 2023/T/001' : 'e.g. user@tech.cmb.ac.lk'}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-xs font-semibold text-slate-700">Password</label>
                                    <a href="#" className="text-xs font-medium text-[#071B38] hover:underline">
                                        Forgot password?
                                    </a>
                                </div>
                                <div className="relative flex items-center">
                                    <span className="absolute left-3 text-slate-400">
                                        <Lock className="w-4 h-4" />
                                    </span>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
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
                            </div>

                            {role === 'Staff' && (
                                <div className="bg-[#EFF6FF] border border-[#DBEAFE] rounded-lg p-3 flex gap-2.5 items-start">
                                    <ShieldCheck className="w-4 h-4 text-[#1E40AF] mt-0.5 flex-shrink-0" />
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-semibold text-[#1E3A8A]">Staff MFA Active</p>
                                        <p className="text-[11px] text-[#3B82F6] leading-relaxed">
                                            Secondary authentication via authenticator app will be required upon credential verification.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-[#071B38] hover:bg-[#0c2b59] text-white font-semibold py-2.5 rounded-md transition-colors shadow-sm disabled:opacity-50 text-xs flex items-center justify-center gap-2"
                            >
                                <span>{isSubmitting ? 'Authenticating...' : 'Secure Sign In'}</span>
                                {!isSubmitting && <span>→</span>}
                            </button>
                        </form>
                    </>
                )}

                {/* Support Link */}
                <div className="border-t border-slate-100 pt-4 text-center space-y-1">
                    <p className="text-xs text-slate-500">Need access assistance?</p>
                    <a href="#" className="text-xs font-semibold text-[#071B38] hover:underline inline-flex items-center gap-1">
                        <span>🛠️</span> Contact IT Support Desk
                    </a>
                </div>
            </div>

            {/* Footer */}
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

export default Login;