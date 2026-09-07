import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    GraduationCap,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ShieldCheck,
    ArrowLeft
} from 'lucide-react';
import logo from '../Assets/logo.svg';

const staffRoleOptions = [
    { key: 'HOD', label: 'Head of Department', path: '/hod/dashboard' },
    { key: 'Admin', label: 'Administrator', path: '/admin/dashboard' },
    { key: 'Dean', label: 'Dean', path: '/dean/dashboard' },
    { key: 'Lecturer', label: 'Lecturer', path: '/lecturer/dashboard' },
];

const Login = () => {
    const [step, setStep] = useState('choose-type');
    const [role, setRole] = useState(null);
    const [staffRole, setStaffRole] = useState(null);

    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { loginUser } = useAuth();
    const navigate = useNavigate();

    /*
    |--------------------------------------------------------------------------
    | STEP 1 - Select Student or Staff
    |--------------------------------------------------------------------------
    */
    const handleSelectType = (type) => {
        setRole(type);
        setError('');

        if (type === 'Student') {
            setStep('form');
        } else {
            setStep('choose-staff-role');
        }
    };

    /*
    |--------------------------------------------------------------------------
    | STEP 2 - Select Staff Role
    |--------------------------------------------------------------------------
    */
    const handleSelectStaffRole = (key) => {
        setStaffRole(key);
        setError('');
        setStep('form');
    };

    /*
    |--------------------------------------------------------------------------
    | BACK BUTTON
    |--------------------------------------------------------------------------
    */
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

    /*
    |--------------------------------------------------------------------------
    | LOGIN
    |--------------------------------------------------------------------------
    */
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setIsSubmitting(true);

        try {
            /*
             * Determine which role the user selected.
             *
             * Student -> Student
             * Staff   -> HOD / Lecturer / Dean / Admin
             */
            const selectedRole =
                role === 'Student'
                    ? 'Student'
                    : staffRole;

            /*
             * Send email, password AND selected role
             * to AuthContext.
             */
            const user = await loginUser(
                identifier,
                password,
                selectedRole
            );

            /*
             * Student dashboard
             */
            if (selectedRole === 'Student') {
                navigate('/student/dashboard');
                return;
            }

            /*
             * Find the dashboard belonging to
             * the selected staff role.
             */
            const target = staffRoleOptions.find(
                (r) => r.key === selectedRole
            );

            if (!target) {
                setError('Invalid staff role.');
                return;
            }

            /*
             * Navigate to the selected role's dashboard.
             */
            navigate(target.path);

        } catch (err) {
            setError(
                err.message ||
                'Login failed. Please check your credentials.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">

            <div className="bg-white border border-slate-200 rounded-xl shadow-md max-w-md w-full p-8 space-y-6 min-h-[600px] flex flex-col justify-center">

                {/* ----------------------------------------------------------------
                    HEADER
                ----------------------------------------------------------------- */}
                <div className="text-center space-y-2">

                    <div className="w-15 h-15 rounded-full bg-blue-50 flex items-center justify-center text-[#071B38] mx-auto">
                        <img
                            src={logo}
                            alt="University Logo"
                            className="w-13 h-13"
                        />
                    </div>

                    <h2 className="text-2xl font-bold text-[#071B38]">
                        {step === 'choose-type' && 'Universal Login'}
                        {step === 'choose-staff-role' && 'Login As'}
                        {step === 'form' && 'Enter Credentials'}
                    </h2>

                    <p className="text-xs text-slate-500">
                        Faculty of Technology, University of Colombo
                    </p>

                </div>


                {/* ----------------------------------------------------------------
                    BACK BUTTON
                ----------------------------------------------------------------- */}
                {step !== 'choose-type' && (
                    <button
                        type="button"
                        onClick={handleBack}
                        className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-[#071B38]"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Back
                    </button>
                )}


                {/* ----------------------------------------------------------------
                    ERROR MESSAGE
                ----------------------------------------------------------------- */}
                {error && (
                    <div className="bg-red-50 border border-red-300 text-red-700 text-xs p-3 rounded-md">
                        {error}
                    </div>
                )}


                {/* ----------------------------------------------------------------
                    STEP 1 - STUDENT OR STAFF
                ----------------------------------------------------------------- */}
                {step === 'choose-type' && (
                    <div className="grid grid-cols-2 gap-3">

                        {/* STUDENT */}
                        <button
                            type="button"
                            onClick={() => handleSelectType('Student')}
                            className="flex flex-col items-center gap-2 p-5 border border-slate-200 rounded-lg hover:border-[#071B38] hover:bg-slate-50 transition-colors"
                        >
                            <GraduationCap className="w-6 h-6 text-[#071B38]" />

                            <span className="text-xs font-semibold text-slate-800">
                                Student
                            </span>
                        </button>


                        {/* STAFF */}
                        <button
                            type="button"
                            onClick={() => handleSelectType('Staff')}
                            className="flex flex-col items-center gap-2 p-5 border border-slate-200 rounded-lg hover:border-[#071B38] hover:bg-slate-50 transition-colors"
                        >
                            <ShieldCheck className="w-6 h-6 text-[#071B38]" />

                            <span className="text-xs font-semibold text-slate-800">
                                Staff
                            </span>
                        </button>

                    </div>
                )}


                {/* ----------------------------------------------------------------
                    STEP 2 - SELECT STAFF ROLE
                ----------------------------------------------------------------- */}
                {step === 'choose-staff-role' && (
                    <div className="grid grid-cols-2 gap-3">

                        {staffRoleOptions.map((r) => (
                            <button
                                key={r.key}
                                type="button"
                                onClick={() => handleSelectStaffRole(r.key)}
                                className="flex flex-col items-center justify-center gap-1 p-4 border border-slate-200 rounded-lg hover:border-[#071B38] hover:bg-slate-50 transition-colors text-center"
                            >
                                <span className="text-xs font-semibold text-slate-800">
                                    {r.label}
                                </span>
                            </button>
                        ))}

                    </div>
                )}


                {/* ----------------------------------------------------------------
                    STEP 3 - LOGIN FORM
                ----------------------------------------------------------------- */}
                {step === 'form' && (
                    <>
                        {/* Selected Staff Role */}
                        {role === 'Staff' && (
                            <p className="text-xs text-slate-500 -mt-2">
                                Logging in as{' '}
                                <span className="font-semibold text-[#071B38]">
                                    {staffRole}
                                </span>
                            </p>
                        )}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >

                            {/* EMAIL / ID */}
                            <div>

                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    {role === 'Student'
                                        ? 'University ID / Email'
                                        : 'Email Address'}
                                </label>

                                <div className="relative flex items-center">

                                    <span className="absolute left-3 text-slate-400">
                                        <Mail className="w-4 h-4" />
                                    </span>

                                    <input
                                        type="text"
                                        required
                                        value={identifier}
                                        onChange={(e) =>
                                            setIdentifier(e.target.value)
                                        }
                                        className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-[#071B38] text-xs text-slate-800"
                                        placeholder={
                                            role === 'Student'
                                                ? 'e.g. 2023/T/001'
                                                : 'e.g. user@tech.cmb.ac.lk'
                                        }
                                    />

                                </div>

                            </div>


                            {/* PASSWORD */}
                            <div>

                                <div className="flex justify-between items-center mb-1">

                                    <label className="block text-xs font-semibold text-slate-700">
                                        Password
                                    </label>

                                    <a
                                        href="#"
                                        className="text-xs font-medium text-[#071B38] hover:underline"
                                    >
                                        Forgot password?
                                    </a>

                                </div>

                                <div className="relative flex items-center">

                                    <span className="absolute left-3 text-slate-400">
                                        <Lock className="w-4 h-4" />
                                    </span>

                                    <input
                                        type={
                                            showPassword
                                                ? 'text'
                                                : 'password'
                                        }
                                        required
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        className="w-full pl-9 pr-10 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-[#071B38] text-xs text-slate-800"
                                        placeholder="••••••••"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>

                                </div>

                            </div>


                            {/* MFA MESSAGE FOR STAFF */}
                            {role === 'Staff' && (
                                <div className="bg-[#EFF6FF] border border-[#DBEAFE] rounded-lg p-3 flex gap-2.5 items-start">

                                    <ShieldCheck className="w-4 h-4 text-[#1E40AF] mt-0.5 flex-shrink-0" />

                                    <div className="space-y-0.5">

                                        <p className="text-xs font-semibold text-[#1E3A8A]">
                                            Staff MFA Active
                                        </p>

                                        <p className="text-[11px] text-[#3B82F6] leading-relaxed">
                                            Secondary authentication via authenticator app will be required upon credential verification.
                                        </p>

                                    </div>

                                </div>
                            )}


                            {/* LOGIN BUTTON */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-[#071B38] hover:bg-[#0c2b59] text-white font-semibold py-2.5 rounded-md transition-colors shadow-sm disabled:opacity-50 text-xs flex items-center justify-center gap-2"
                            >
                                <span>
                                    {isSubmitting
                                        ? 'Authenticating...'
                                        : 'Secure Sign In'}
                                </span>

                                {!isSubmitting && (
                                    <span>→</span>
                                )}
                            </button>

                        </form>
                    </>
                )}


                {/* ----------------------------------------------------------------
                    SUPPORT LINK
                ----------------------------------------------------------------- */}
                <div className="border-t border-slate-100 pt-4 text-center space-y-1">

                    <p className="text-xs text-slate-500">
                        Need access assistance?
                    </p>

                    <a
                        href="#"
                        className="text-xs font-semibold text-[#071B38] hover:underline inline-flex items-center gap-1"
                    >
                        <span>🛠️</span>
                        Contact IT Support Desk
                    </a>

                </div>

            </div>


            {/* ----------------------------------------------------------------
                FOOTER
            ----------------------------------------------------------------- */}
            <div className="mt-6 text-center text-white text-[11px] text-slate-400 space-y-0.5">

                <p>
                    © 2026 University of Colombo. All rights reserved.
                </p>

                <div className="space-x-2">

                    <a
                        href="#"
                        className="hover:underline"
                    >
                        Privacy Policy
                    </a>

                    <span>•</span>

                    <a
                        href="#"
                        className="hover:underline"
                    >
                        Terms of Use
                    </a>

                </div>

            </div>

        </div>
    );
};

export default Login;