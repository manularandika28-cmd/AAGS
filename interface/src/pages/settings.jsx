import React, { useEffect, useMemo, useState } from 'react';
import {
    User,
    Shield,
    Bell,
    Palette,
    Globe,
    GraduationCap,
    CalendarDays,
    Lock,
    Database,
    HelpCircle,
    Info,
    LogOut,
    Pencil,
    Save,
    X,
    Check,
    Eye,
    EyeOff,
    Monitor,
    Moon,
    Sun,
    ChevronRight,
    BookOpen,
    Building2,
    Mail,
    Clock,
    KeyRound,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Topnavbar from '../components/Topnavbar';

const API_BASE = 'http://localhost:3000/api';

const Settings = () => {
    const {
        user,
        accessToken,
        logout,
    } = useAuth();

    const navigate = useNavigate();

    const [activeSection, setActiveSection] = useState('profile');

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const [editMode, setEditMode] = useState(false);

    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');

    const [savingProfile, setSavingProfile] = useState(false);

    const [preferences, setPreferences] = useState({
        notifications_enabled: true,
        theme: 'dark',
        language: 'English',
        timezone: 'Asia/Colombo',
    });

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const sections = [
        {
            id: 'profile',
            label: 'Profile',
            icon: User,
        },
        {
            id: 'security',
            label: 'Security',
            icon: Shield,
        },
        {
            id: 'notifications',
            label: 'Notifications',
            icon: Bell,
        },
        {
            id: 'appearance',
            label: 'Appearance',
            icon: Palette,
        },
        {
            id: 'regional',
            label: 'Regional',
            icon: Globe,
        },
        {
            id: 'academic',
            label: 'Academic Information',
            icon: GraduationCap,
            roles: ['Student', 'Lecturer', 'HOD', 'Dean'],
        },
        {
            id: 'meetings',
            label: 'Meetings',
            icon: CalendarDays,
        },
        {
            id: 'privacy',
            label: 'Privacy',
            icon: Lock,
        },
        {
            id: 'accessibility',
            label: 'Accessibility',
            icon: Eye,
        },
        {
            id: 'data',
            label: 'My Data',
            icon: Database,
        },
        {
            id: 'help',
            label: 'Help & Support',
            icon: HelpCircle,
        },
        {
            id: 'about',
            label: 'About AAGS',
            icon: Info,
        },
    ];

    const visibleSections = useMemo(() => {
        return sections.filter(
            (section) =>
                !section.roles ||
                section.roles.includes(user?.role)
        );
    }, [user?.role]);

    const fetchProfile = async () => {
        if (!accessToken) return;

        try {
            setLoading(true);
            setError('');

            const response = await fetch(
                `${API_BASE}/settings/profile`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || 'Failed to load profile'
                );
            }

            setProfile(data);

            setEditName(data.name || '');
            setEditEmail(data.email || '');

            if (data.preferences) {
                setPreferences(data.preferences);
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [accessToken]);

    const saveProfile = async () => {
        try {
            setSavingProfile(true);
            setError('');
            setMessage('');

            const response = await fetch(
                `${API_BASE}/settings/profile`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({
                        name: editName,
                        email: editEmail,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || 'Failed to update profile'
                );
            }

            setProfile((prev) => ({
                ...prev,
                ...data.profile,
            }));

            setEditMode(false);
            setMessage('Profile updated successfully.');

        } catch (err) {
            setError(err.message);
        } finally {
            setSavingProfile(false);
        }
    };

    const savePreferences = async (changes) => {
        const updated = {
            ...preferences,
            ...changes,
        };

        setPreferences(updated);

        try {
            setError('');

            const response = await fetch(
                `${API_BASE}/settings/preferences`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(updated),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || 'Failed to update preferences'
                );
            }

            if (data.preferences) {
                setPreferences(data.preferences);
            }

            setMessage('Preference saved.');

        } catch (err) {
            setError(err.message);
        }
    };

    const changePassword = async () => {
        setError('');
        setMessage('');

        if (
            !passwordForm.currentPassword ||
            !passwordForm.newPassword
        ) {
            setError('Please fill in all password fields.');
            return;
        }

        if (
            passwordForm.newPassword !==
            passwordForm.confirmPassword
        ) {
            setError('New passwords do not match.');
            return;
        }

        if (passwordForm.newPassword.length < 8) {
            setError(
                'New password must be at least 8 characters.'
            );
            return;
        }

        try {
            const response = await fetch(
                `${API_BASE}/settings/password`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({
                        currentPassword:
                            passwordForm.currentPassword,
                        newPassword:
                            passwordForm.newPassword,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || 'Failed to change password'
                );
            }

            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });

            setMessage('Password changed successfully.');

        } catch (err) {
            setError(err.message);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/Login');
    };

    const getInitials = (name = '') => {
        return name
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0])
            .join('')
            .toUpperCase();
    };

    if (!user) {
        return null;
    }

    const displayProfile = profile || user;

    return (
        <div className="min-h-screen bg-[#051E3D] text-white">
            <Topnavbar />

            <div className="px-4 md:px-8 py-6">
                <div className="max-w-7xl mx-auto">

                    {/* Page header */}
                    <div className="mb-6">
                        <h1 className="text-2xl md:text-3xl font-bold">
                            Settings
                        </h1>

                        <p className="text-white/60 mt-1">
                            Manage your AAGS profile, preferences and account.
                        </p>
                    </div>

                    {/* Messages */}
                    {(message || error) && (
                        <div
                            className={`mb-5 rounded-xl border px-4 py-3 flex items-center gap-3 ${
                                error
                                    ? 'bg-red-500/10 border-red-400/20 text-red-200'
                                    : 'bg-green-500/10 border-green-400/20 text-green-200'
                            }`}
                        >
                            {error ? (
                                <X className="w-5 h-5" />
                            ) : (
                                <Check className="w-5 h-5" />
                            )}

                            <span>
                                {error || message}
                            </span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">

                        {/* Settings navigation */}
                        <aside className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-3 h-fit">

                            <div className="px-3 py-3 mb-2">
                                <p className="text-xs uppercase tracking-wider text-white/40">
                                    Settings
                                </p>
                            </div>

                            <nav className="space-y-1">
                                {visibleSections.map((section) => {
                                    const Icon = section.icon;
                                    const active =
                                        activeSection === section.id;

                                    return (
                                        <button
                                            key={section.id}
                                            onClick={() =>
                                                setActiveSection(
                                                    section.id
                                                )
                                            }
                                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition ${
                                                active
                                                    ? 'bg-white/15 text-white'
                                                    : 'text-white/65 hover:bg-white/10 hover:text-white'
                                            }`}
                                        >
                                            <Icon className="w-4 h-4 shrink-0" />

                                            <span className="text-sm">
                                                {section.label}
                                            </span>

                                            {active && (
                                                <ChevronRight className="w-4 h-4 ml-auto" />
                                            )}
                                        </button>
                                    );
                                })}
                            </nav>

                            <div className="mt-4 pt-4 border-t border-white/10">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-300 hover:bg-red-500/10 transition"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span className="text-sm">
                                        Log out
                                    </span>
                                </button>
                            </div>
                        </aside>

                        {/* Main settings content */}
                        <main className="min-w-0">

                            {loading ? (
                                <SettingsLoading />
                            ) : (
                                <>
                                    {activeSection === 'profile' && (
                                        <ProfileSection
                                            profile={displayProfile}
                                            editMode={editMode}
                                            setEditMode={setEditMode}
                                            editName={editName}
                                            setEditName={setEditName}
                                            editEmail={editEmail}
                                            setEditEmail={setEditEmail}
                                            saveProfile={saveProfile}
                                            savingProfile={savingProfile}
                                            getInitials={getInitials}
                                        />
                                    )}

                                    {activeSection === 'security' && (
                                        <SecuritySection
                                            passwordForm={passwordForm}
                                            setPasswordForm={setPasswordForm}
                                            showCurrentPassword={showCurrentPassword}
                                            setShowCurrentPassword={setShowCurrentPassword}
                                            showNewPassword={showNewPassword}
                                            setShowNewPassword={setShowNewPassword}
                                            changePassword={changePassword}
                                        />
                                    )}

                                    {activeSection === 'notifications' && (
                                        <NotificationsSection
                                            preferences={preferences}
                                            savePreferences={savePreferences}
                                        />
                                    )}

                                    {activeSection === 'appearance' && (
                                        <AppearanceSection
                                            preferences={preferences}
                                            savePreferences={savePreferences}
                                        />
                                    )}

                                    {activeSection === 'regional' && (
                                        <RegionalSection
                                            preferences={preferences}
                                            savePreferences={savePreferences}
                                        />
                                    )}

                                    {activeSection === 'academic' && (
                                        <AcademicSection
                                            profile={profile}
                                        />
                                    )}

                                    {activeSection === 'meetings' && (
                                        <MeetingsSection />
                                    )}

                                    {activeSection === 'privacy' && (
                                        <PrivacySection />
                                    )}

                                    {activeSection === 'accessibility' && (
                                        <AccessibilitySection />
                                    )}

                                    {activeSection === 'data' && (
                                        <DataSection />
                                    )}

                                    {activeSection === 'help' && (
                                        <HelpSection />
                                    )}

                                    {activeSection === 'about' && (
                                        <AboutSection />
                                    )}
                                </>
                            )}
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
};


/* =========================================================
   PROFILE
========================================================= */

const ProfileSection = ({
    profile,
    editMode,
    setEditMode,
    editName,
    setEditName,
    editEmail,
    setEditEmail,
    saveProfile,
    savingProfile,
    getInitials,
}) => {
    return (
        <SettingsCard
            title="Profile"
            description="Your personal and institutional information."
            icon={User}
        >
            <div className="flex flex-col md:flex-row md:items-center gap-5 pb-6 border-b border-white/10">

                <div className="w-20 h-20 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-xl font-bold">
                    {getInitials(profile?.name)}
                </div>

                <div>
                    <h2 className="text-xl font-semibold">
                        {profile?.name}
                    </h2>

                    <p className="text-white/50 mt-1">
                        {profile?.role}
                    </p>

                    {profile?.department_name && (
                        <p className="text-sm text-white/40 mt-1">
                            {profile.department_name}
                        </p>
                    )}
                </div>

                <button
                    onClick={() => setEditMode(!editMode)}
                    className="md:ml-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition"
                >
                    {editMode ? (
                        <>
                            <X className="w-4 h-4" />
                            Cancel
                        </>
                    ) : (
                        <>
                            <Pencil className="w-4 h-4" />
                            Edit Profile
                        </>
                    )}
                </button>
            </div>

            {editMode ? (
                <div className="pt-6 space-y-5">

                    <InputField
                        label="Full name"
                        value={editName}
                        onChange={setEditName}
                    />

                    <InputField
                        label="Email address"
                        type="email"
                        value={editEmail}
                        onChange={setEditEmail}
                    />

                    <div className="flex justify-end">
                        <button
                            onClick={saveProfile}
                            disabled={savingProfile}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#051E3D] font-semibold hover:bg-white/90 disabled:opacity-50 transition"
                        >
                            <Save className="w-4 h-4" />
                            {savingProfile
                                ? 'Saving...'
                                : 'Save Changes'}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8">

                    <InfoRow
                        icon={Mail}
                        label="Email address"
                        value={profile?.email}
                    />

                    <InfoRow
                        icon={KeyRound}
                        label="User ID"
                        value={profile?.user_id}
                    />

                    <InfoRow
                        icon={Shield}
                        label="Role"
                        value={profile?.role}
                    />

                    <InfoRow
                        icon={Building2}
                        label="Department"
                        value={
                            profile?.department_name ||
                            'Not assigned'
                        }
                    />

                    <InfoRow
                        icon={Globe}
                        label="Country"
                        value="Sri Lanka"
                    />

                    <InfoRow
                        icon={Clock}
                        label="Timezone"
                        value={
                            profile?.preferences?.timezone ||
                            'Asia/Colombo'
                        }
                    />

                    <InfoRow
                        icon={Info}
                        label="Account status"
                        value={
                            profile?.is_active
                                ? 'Active'
                                : 'Inactive'
                        }
                    />

                    <InfoRow
                        icon={Clock}
                        label="Account created"
                        value={
                            profile?.created_at
                                ? new Date(
                                      profile.created_at
                                  ).toLocaleDateString()
                                : '—'
                        }
                    />
                </div>
            )}
        </SettingsCard>
    );
};


/* =========================================================
   SECURITY
========================================================= */

const SecuritySection = ({
    passwordForm,
    setPasswordForm,
    showCurrentPassword,
    setShowCurrentPassword,
    showNewPassword,
    setShowNewPassword,
    changePassword,
}) => {
    return (
        <SettingsCard
            title="Security"
            description="Protect your AAGS account and credentials."
            icon={Shield}
        >
            <div className="space-y-6">

                <div>
                    <h3 className="font-semibold">
                        Change password
                    </h3>

                    <p className="text-sm text-white/50 mt-1">
                        Use a strong password that you do not reuse elsewhere.
                    </p>
                </div>

                <PasswordField
                    label="Current password"
                    value={passwordForm.currentPassword}
                    visible={showCurrentPassword}
                    setVisible={setShowCurrentPassword}
                    onChange={(value) =>
                        setPasswordForm((prev) => ({
                            ...prev,
                            currentPassword: value,
                        }))
                    }
                />

                <PasswordField
                    label="New password"
                    value={passwordForm.newPassword}
                    visible={showNewPassword}
                    setVisible={setShowNewPassword}
                    onChange={(value) =>
                        setPasswordForm((prev) => ({
                            ...prev,
                            newPassword: value,
                        }))
                    }
                />

                <InputField
                    label="Confirm new password"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(value) =>
                        setPasswordForm((prev) => ({
                            ...prev,
                            confirmPassword: value,
                        }))
                    }
                />

                <button
                    onClick={changePassword}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#051E3D] font-semibold hover:bg-white/90 transition"
                >
                    <Lock className="w-4 h-4" />
                    Change Password
                </button>

                <div className="pt-6 border-t border-white/10">
                    <h3 className="font-semibold">
                        Two-factor authentication
                    </h3>

                    <p className="text-sm text-white/50 mt-1">
                        Multi-factor authentication can be added to AAGS in a future security release.
                    </p>

                    <span className="inline-block mt-3 px-3 py-1 rounded-full bg-yellow-400/10 text-yellow-200 text-xs">
                        Coming soon
                    </span>
                </div>
            </div>
        </SettingsCard>
    );
};


/* =========================================================
   NOTIFICATIONS
========================================================= */

const NotificationsSection = ({
    preferences,
    savePreferences,
}) => {
    return (
        <SettingsCard
            title="Notifications"
            description="Control how AAGS delivers your notifications."
            icon={Bell}
        >
            <PreferenceRow
                title="In-app notifications"
                description="Receive alerts about meetings, attendance, medical submissions and system events."
            >
                <Toggle
                    checked={preferences.notifications_enabled}
                    onChange={(value) =>
                        savePreferences({
                            notifications_enabled: value,
                        })
                    }
                />
            </PreferenceRow>

            <PreferenceRow
                title="Notification badge"
                description="Show the unread notification count in the navigation bar."
            >
                <Toggle
                    checked={preferences.notifications_enabled}
                    onChange={() =>
                        savePreferences({
                            notifications_enabled:
                                !preferences.notifications_enabled,
                        })
                    }
                />
            </PreferenceRow>

            <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-sm text-white/60">
                    AAGS currently uses the central notification system for
                    meeting, attendance, medical and system alerts.
                </p>
            </div>
        </SettingsCard>
    );
};


/* =========================================================
   APPEARANCE
========================================================= */

const AppearanceSection = ({
    preferences,
    savePreferences,
}) => {
    return (
        <SettingsCard
            title="Appearance"
            description="Customize the AAGS interface."
            icon={Palette}
        >
            <div>
                <h3 className="font-semibold mb-3">
                    Theme
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <ThemeButton
                        icon={Moon}
                        label="Dark"
                        active={preferences.theme === 'dark'}
                        onClick={() =>
                            savePreferences({
                                theme: 'dark',
                            })
                        }
                    />

                    <ThemeButton
                        icon={Sun}
                        label="Light"
                        active={preferences.theme === 'light'}
                        onClick={() =>
                            savePreferences({
                                theme: 'light',
                            })
                        }
                    />

                    <ThemeButton
                        icon={Monitor}
                        label="System"
                        active={preferences.theme === 'system'}
                        onClick={() =>
                            savePreferences({
                                theme: 'system',
                            })
                        }
                    />
                </div>
            </div>

            <div className="mt-8">
                <PreferenceRow
                    title="Reduce animations"
                    description="Accessibility option for users who prefer less motion."
                >
                    <Toggle
                        checked={
                            localStorage.getItem(
                                'aags_reduce_motion'
                            ) === 'true'
                        }
                        onChange={(value) => {
                            localStorage.setItem(
                                'aags_reduce_motion',
                                String(value)
                            );

                            window.dispatchEvent(
                                new Event(
                                    'aags-preferences-changed'
                                )
                            );
                        }}
                    />
                </PreferenceRow>
            </div>
        </SettingsCard>
    );
};


/* =========================================================
   REGIONAL
========================================================= */

const RegionalSection = ({
    preferences,
    savePreferences,
}) => {
    return (
        <SettingsCard
            title="Regional Preferences"
            description="Set language and regional display preferences."
            icon={Globe}
        >
            <div className="space-y-6">

                <SelectField
                    label="Preferred language"
                    value={preferences.language}
                    options={[
                        'English',
                        'Sinhala',
                        'Tamil',
                    ]}
                    onChange={(value) =>
                        savePreferences({
                            language: value,
                        })
                    }
                />

                <SelectField
                    label="Timezone"
                    value={preferences.timezone}
                    options={[
                        'Asia/Colombo',
                        'Asia/Kolkata',
                        'Asia/Dubai',
                        'UTC',
                    ]}
                    onChange={(value) =>
                        savePreferences({
                            timezone: value,
                        })
                    }
                />

                <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                        Date format
                    </label>

                    <select className="w-full bg-[#071B38] border border-white/15 rounded-xl px-4 py-3 text-white outline-none">
                        <option>DD/MM/YYYY</option>
                        <option>YYYY-MM-DD</option>
                        <option>MM/DD/YYYY</option>
                    </select>
                </div>
            </div>
        </SettingsCard>
    );
};


/* =========================================================
   ACADEMIC
========================================================= */

const AcademicSection = ({
    profile,
}) => {
    const courses = profile?.courses || [];

    return (
        <SettingsCard
            title="Academic Information"
            description="Academic information associated with your AAGS account."
            icon={GraduationCap}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">

                <AcademicInfo
                    label="Role"
                    value={profile?.role}
                />

                <AcademicInfo
                    label="Department"
                    value={
                        profile?.department_name ||
                        'Not assigned'
                    }
                />

                <AcademicInfo
                    label="User ID"
                    value={profile?.user_id}
                />

                {profile?.role === 'Student' && (
                    <AcademicInfo
                        label="Enrolled courses"
                        value={courses.length}
                    />
                )}
            </div>

            {profile?.role === 'Student' && (
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <BookOpen className="w-5 h-5" />

                        <h3 className="font-semibold">
                            Enrolled Courses
                        </h3>
                    </div>

                    {courses.length === 0 ? (
                        <div className="p-5 rounded-xl bg-white/5 border border-white/10 text-white/50">
                            No enrolled courses found.
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {courses.map((course) => (
                                <div
                                    key={course.course_id}
                                    className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col md:flex-row md:items-center gap-3"
                                >
                                    <div className="font-semibold min-w-24">
                                        {course.course_code}
                                    </div>

                                    <div className="flex-1">
                                        {course.course_name}
                                    </div>

                                    <div className="text-sm text-white/45">
                                        {course.credit} credits
                                    </div>

                                    <div className="text-sm text-white/45">
                                        {course.semester}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </SettingsCard>
    );
};


/* =========================================================
   MEETINGS
========================================================= */

const MeetingsSection = () => {
    return (
        <SettingsCard
            title="Meeting Preferences"
            description="Configure how you receive meeting-related information."
            icon={CalendarDays}
        >
            <PreferenceRow
                title="Meeting reminders"
                description="Meeting reminder preferences will be connected to the AAGS calendar system."
            >
                <span className="px-3 py-1 rounded-full bg-yellow-400/10 text-yellow-200 text-xs">
                    Coming soon
                </span>
            </PreferenceRow>

            <PreferenceRow
                title="Calendar integration"
                description="Automatically add approved meetings to your calendar."
            >
                <span className="px-3 py-1 rounded-full bg-yellow-400/10 text-yellow-200 text-xs">
                    Coming soon
                </span>
            </PreferenceRow>
        </SettingsCard>
    );
};


/* =========================================================
   PRIVACY
========================================================= */

const PrivacySection = () => {
    return (
        <SettingsCard
            title="Privacy"
            description="Control how your information is handled within AAGS."
            icon={Lock}
        >
            <PreferenceRow
                title="Profile visibility"
                description="Your name and role may be visible to authorized AAGS users when required for academic workflows."
            >
                <span className="text-sm text-white/50">
                    System controlled
                </span>
            </PreferenceRow>

            <PreferenceRow
                title="Email visibility"
                description="Email addresses are used for account communication and authorized academic workflows."
            >
                <span className="text-sm text-white/50">
                    System controlled
                </span>
            </PreferenceRow>

            <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-sm text-white/60">
                    Sensitive information such as medical submissions is
                    protected by AAGS role-based access controls.
                </p>
            </div>
        </SettingsCard>
    );
};


/* =========================================================
   ACCESSIBILITY
========================================================= */

const AccessibilitySection = () => {
    const [largeText, setLargeText] = useState(
        localStorage.getItem('aags_large_text') === 'true'
    );

    const [reduceMotion, setReduceMotion] = useState(
        localStorage.getItem('aags_reduce_motion') === 'true'
    );

    const updateLargeText = (value) => {
        setLargeText(value);
        localStorage.setItem(
            'aags_large_text',
            String(value)
        );
    };

    const updateReduceMotion = (value) => {
        setReduceMotion(value);
        localStorage.setItem(
            'aags_reduce_motion',
            String(value)
        );
    };

    return (
        <SettingsCard
            title="Accessibility"
            description="Make AAGS easier and more comfortable to use."
            icon={Eye}
        >
            <PreferenceRow
                title="Larger interface text"
                description="Increase the default interface text size."
            >
                <Toggle
                    checked={largeText}
                    onChange={updateLargeText}
                />
            </PreferenceRow>

            <PreferenceRow
                title="Reduce motion"
                description="Reduce interface animations and transitions."
            >
                <Toggle
                    checked={reduceMotion}
                    onChange={updateReduceMotion}
                />
            </PreferenceRow>

            <PreferenceRow
                title="Keyboard navigation"
                description="AAGS interfaces are designed to remain keyboard accessible."
            >
                <span className="text-green-300 text-sm">
                    Supported
                </span>
            </PreferenceRow>
        </SettingsCard>
    );
};


/* =========================================================
   DATA
========================================================= */

const DataSection = () => {
    return (
        <SettingsCard
            title="My Data"
            description="Information associated with your AAGS account."
            icon={Database}
        >
            <DataItem
                title="Profile information"
                description="Name, email, role and institutional information."
            />

            <DataItem
                title="Academic information"
                description="Courses, attendance and academic records associated with your account."
            />

            <DataItem
                title="Meetings"
                description="Meeting requests and scheduling records."
            />

            <DataItem
                title="Notifications"
                description="Notifications delivered to your AAGS account."
            />

            <div className="mt-6 p-4 rounded-xl bg-yellow-400/5 border border-yellow-400/10">
                <p className="text-sm text-yellow-100/70">
                    Data export functionality can be connected to the
                    backend when the AAGS data-export API is implemented.
                </p>
            </div>
        </SettingsCard>
    );
};


/* =========================================================
   HELP
========================================================= */

const HelpSection = () => {
    return (
        <SettingsCard
            title="Help & Support"
            description="Get assistance with using AAGS."
            icon={HelpCircle}
        >
            <SupportItem
                title="AAGS User Guide"
                description="Learn how to use the major AAGS modules."
            />

            <SupportItem
                title="Frequently Asked Questions"
                description="Find answers to common questions."
            />

            <SupportItem
                title="Report a problem"
                description="Report technical problems to the AAGS administrator."
            />

            <SupportItem
                title="Contact administrator"
                description="Contact the system administrator for account-related assistance."
            />
        </SettingsCard>
    );
};


/* =========================================================
   ABOUT
========================================================= */

const AboutSection = () => {
    return (
        <SettingsCard
            title="About AAGS"
            description="Information about the Academic & Administrative Governance System."
            icon={Info}
        >
            <div className="text-center py-8">

                <div className="w-20 h-20 mx-auto rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-2xl font-bold">
                    A
                </div>

                <h2 className="text-2xl font-bold mt-5">
                    AAGS
                </h2>

                <p className="text-white/50 mt-1">
                    Academic & Administrative Governance System
                </p>

                <div className="mt-6 space-y-2 text-sm text-white/50">
                    <p>University of Colombo</p>
                    <p>Faculty of Technology</p>
                    <p>Department of Information & Communication Technology</p>
                </div>

                <div className="mt-6">
                    <span className="px-3 py-1 rounded-full bg-white/10 text-white/60 text-xs">
                        Version 1.0.0
                    </span>
                </div>
            </div>
        </SettingsCard>
    );
};


/* =========================================================
   REUSABLE COMPONENTS
========================================================= */

const SettingsCard = ({
    title,
    description,
    icon: Icon,
    children,
}) => {
    return (
        <section className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden">

            <div className="px-6 py-5 border-b border-white/10 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                </div>

                <div>
                    <h2 className="text-lg font-semibold">
                        {title}
                    </h2>

                    <p className="text-sm text-white/50 mt-1">
                        {description}
                    </p>
                </div>
            </div>

            <div className="p-6">
                {children}
            </div>
        </section>
    );
};


const InfoRow = ({
    icon: Icon,
    label,
    value,
}) => {
    return (
        <div className="py-4 border-b border-white/10 flex items-start gap-3">
            <Icon className="w-4 h-4 mt-0.5 text-white/40 shrink-0" />

            <div className="min-w-0">
                <p className="text-xs uppercase tracking-wide text-white/35">
                    {label}
                </p>

                <p className="text-sm text-white/85 mt-1 break-words">
                    {value || '—'}
                </p>
            </div>
        </div>
    );
};


const AcademicInfo = ({
    label,
    value,
}) => {
    return (
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-xs uppercase tracking-wide text-white/35">
                {label}
            </p>

            <p className="mt-1 font-medium">
                {value || '—'}
            </p>
        </div>
    );
};


const PreferenceRow = ({
    title,
    description,
    children,
}) => {
    return (
        <div className="py-5 border-b border-white/10 flex items-center justify-between gap-5">
            <div>
                <h3 className="font-medium">
                    {title}
                </h3>

                <p className="text-sm text-white/45 mt-1 max-w-2xl">
                    {description}
                </p>
            </div>

            <div className="shrink-0">
                {children}
            </div>
        </div>
    );
};


const Toggle = ({
    checked,
    onChange,
}) => {
    return (
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className={`relative w-12 h-6 rounded-full transition ${
                checked
                    ? 'bg-white'
                    : 'bg-white/20'
            }`}
        >
            <span
                className={`absolute top-1 w-4 h-4 rounded-full transition ${
                    checked
                        ? 'left-7 bg-[#051E3D]'
                        : 'left-1 bg-white/60'
                }`}
            />
        </button>
    );
};


const ThemeButton = ({
    icon: Icon,
    label,
    active,
    onClick,
}) => {
    return (
        <button
            onClick={onClick}
            className={`p-4 rounded-xl border flex items-center gap-3 transition ${
                active
                    ? 'bg-white/15 border-white/30'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
        >
            <Icon className="w-5 h-5" />

            <span className="text-sm">
                {label}
            </span>

            {active && (
                <Check className="w-4 h-4 ml-auto" />
            )}
        </button>
    );
};


const InputField = ({
    label,
    type = 'text',
    value,
    onChange,
}) => {
    return (
        <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
                {label}
            </label>

            <input
                type={type}
                value={value}
                onChange={(e) =>
                    onChange(e.target.value)
                }
                className="w-full bg-[#071B38] border border-white/15 rounded-xl px-4 py-3 text-white outline-none focus:border-white/30"
            />
        </div>
    );
};


const PasswordField = ({
    label,
    value,
    visible,
    setVisible,
    onChange,
}) => {
    return (
        <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
                {label}
            </label>

            <div className="relative">
                <input
                    type={visible ? 'text' : 'password'}
                    value={value}
                    onChange={(e) =>
                        onChange(e.target.value)
                    }
                    className="w-full bg-[#071B38] border border-white/15 rounded-xl px-4 py-3 pr-12 text-white outline-none focus:border-white/30"
                />

                <button
                    type="button"
                    onClick={() =>
                        setVisible(!visible)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                    {visible ? (
                        <EyeOff className="w-5 h-5" />
                    ) : (
                        <Eye className="w-5 h-5" />
                    )}
                </button>
            </div>
        </div>
    );
};


const SelectField = ({
    label,
    value,
    options,
    onChange,
}) => {
    return (
        <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
                {label}
            </label>

            <select
                value={value}
                onChange={(e) =>
                    onChange(e.target.value)
                }
                className="w-full bg-[#071B38] border border-white/15 rounded-xl px-4 py-3 text-white outline-none"
            >
                {options.map((option) => (
                    <option
                        key={option}
                        value={option}
                    >
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
};


const DataItem = ({
    title,
    description,
}) => {
    return (
        <div className="py-5 border-b border-white/10">
            <h3 className="font-medium">
                {title}
            </h3>

            <p className="text-sm text-white/45 mt-1">
                {description}
            </p>
        </div>
    );
};


const SupportItem = ({
    title,
    description,
}) => {
    return (
        <button className="w-full text-left py-5 border-b border-white/10 hover:bg-white/5 transition px-2 rounded-xl">
            <h3 className="font-medium">
                {title}
            </h3>

            <p className="text-sm text-white/45 mt-1">
                {description}
            </p>
        </button>
    );
};


const SettingsLoading = () => {
    return (
        <div className="bg-white/10 border border-white/20 rounded-2xl p-10 text-center">
            <div className="animate-pulse text-white/50">
                Loading settings...
            </div>
        </div>
    );
};

export default Settings;