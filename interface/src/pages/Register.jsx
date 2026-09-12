import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    GraduationCap,
    Mail,
    Lock,
    User,
    Eye,
    EyeOff,
    ShieldCheck,
    ArrowLeft,
    CheckCircle2
} from 'lucide-react';
import logo from '../Assets/logo.svg';

const Register = () => {
    const [step, setStep] = useState('choose-type'); // choose-type | form | success
    const [role, setRole] = useState(null); // 'Student' | 'Lecturer'

    const [fullName, setFullName] = useState('');
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { registerUser } = useAuth();

    const handleSelectType = (type) => {
        setRole(type);
        setError('');
        setStep('form');
    };

    const handleBack = () => {
        setError('');
        setStep('choose-type');
        setRole(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }

        setIsSubmitting(true);

        try {
            await registerUser({
                name: fullName,
                email: identifier,
                password,
                role,
            });

            setStep('success');
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-xl shadow-md max-w-md w-full p-8 space-y-6 min-h-[600px] flex flex-col justify-center">

                <div className="text-center space-y-2">
                    <div className="w-15 h-15 rounded-full bg-blue-50 flex items-center justify-center text-[#071B38] mx-auto">
                        <img src={logo} alt="University Logo" className="w-13 h-13" />
                    </div>

                    <h2 className="text-2xl font-bold text-[#071B38]">
                        {step === 'choose-type' && 'Create Account'}
                        {step === 'form' && 'Your Details'}
                        {step === 'success' && 'Registration Submitted'}
                    </h2>

                    <p className="text-xs text-slate-500">
                        Faculty of Technology, University of Colombo
                    </p>
                </div>

                {step !== 'choose-type' && step !== 'success' && (
                    <button
                        type="button"
                        onClick={handleBack}
                        className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-[#071B38]"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Back
                    </button>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-300 text-red-700 text-xs p-3 rounded-md">
                        {error}
                    </div>
                )}

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
                            onClick={() => handleSelectType('Lecturer')}
                            className="flex flex-col items-center gap-2 p-5 border border-slate-200 rounded-lg hover:border-[#071B38] hover:bg-slate-50 transition-colors"
                        >
                            <ShieldCheck className="w-6 h-6 text-[#071B38]" />
                            <span className="text-xs font-semibold text-slate-800">Lecturer</span>
                        </button>
                    </div>
                )}

                {step === 'form' && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Full Name
                            </label>
                            <div className="relative flex items-center">
                                <span className="absolute left-3 text-slate-400">
                                    <User className="w-4 h-4" />
                                </span>
                                <input
                                    type="text"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-[#071B38] text-xs text-slate-800"
                                    placeholder="e.g. Tony Perera"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Email Address
                            </label>
                            <div className="relative flex items-center">
                                <span className="absolute left-3 text-slate-400">
                                    <Mail className="w-4 h-4" />
                                </span>
                                <input
                                    type="email"
                                    required
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-[#071B38] text-xs text-slate-800"
                                    placeholder="e.g. user@tech.cmb.ac.lk"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Password
                            </label>
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
                                    placeholder="At least 8 characters"
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

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Confirm Password
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

                        <div className="bg-[#EFF6FF] border border-[#DBEAFE] rounded-lg p-3 flex gap-2.5 items-start">
                            <ShieldCheck className="w-4 h-4 text-[#1E40AF] mt-0.5 flex-shrink-0" />
                            <div className="space-y-0.5">
                                <p className="text-xs font-semibold text-[#1E3A8A]">Approval Required</p>
                                <p className="text-[11px] text-[#3B82F6] leading-relaxed">
                                    Your account will be reviewed by an Administrator before you can sign in.
                                </p>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-[#071B38] hover:bg-[#0c2b59] text-white font-semibold py-2.5 rounded-md transition-colors shadow-sm disabled:opacity-50 text-xs flex items-center justify-center gap-2"
                        >
                            <span>{isSubmitting ? 'Submitting...' : 'Submit Registration'}</span>
                            {!isSubmitting && <span>→</span>}
                        </button>
                    </form>
                )}

                {step === 'success' && (
                    <div className="text-center space-y-4">
                        <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
                        <p className="text-sm text-slate-700">
                            Your account has been created and is <span className="font-semibold">pending Admin approval</span>.
                            You'll be able to sign in once it's approved.
                        </p>
                        <Link
                            to="/Login"
                            className="inline-block w-full bg-[#071B38] hover:bg-[#0c2b59] text-white font-semibold py-2.5 rounded-md text-xs"
                        >
                            Back to Sign In
                        </Link>
                    </div>
                )}

                {step !== 'success' && (
                    <div className="border-t border-slate-100 pt-4 text-center space-y-1">
                        <p className="text-xs text-slate-500">
                            Already have an account?{' '}
                            <Link to="/Login" className="font-semibold text-[#071B38] hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Register;