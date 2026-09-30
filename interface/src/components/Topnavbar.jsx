import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
     Bell, HelpCircle, Check, CheckCheck, LogOut, Settings, ChevronDown, Sun, Moon
} from 'lucide-react';

import useTheme from '../hooks/useTheme';

import { useAuth } from '../context/AuthContext';

const API_BASE = 'http://localhost:3000/api';

const Topnavbar = () => {
   const navigate = useNavigate();
   const { isLight, toggle } = useTheme();
    const {
        user,
        accessToken,
        logout,
    } = useAuth();

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const [profilePictureUrl, setProfilePictureUrl] =
        useState(null);

    const [notificationOpen, setNotificationOpen] =
        useState(false);

    const [profileOpen, setProfileOpen] =
        useState(false);

    const notificationRef = useRef(null);
    const profileRef = useRef(null);

    /*
    |--------------------------------------------------------------------------
    | Generate user initials
    |--------------------------------------------------------------------------
    */

    const getInitials = (name) => {
        if (!name) return 'U';

        const parts = name.trim().split(/\s+/);

        if (parts.length === 1) {
            return parts[0]
                .substring(0, 2)
                .toUpperCase();
        }

        return (
            parts[0][0] +
            parts[parts.length - 1][0]
        ).toUpperCase();
    };

    /*
    |--------------------------------------------------------------------------
    | Fetch notifications
    |--------------------------------------------------------------------------
    */

    const fetchNotifications = async () => {
        if (!accessToken || !user) return;

        try {
            const response = await fetch(
                `${API_BASE}/notifications`,
                {
                    method: 'GET',
                    headers: {
                        Authorization:
                            `Bearer ${accessToken}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error(
                    'Failed to fetch notifications'
                );
            }

            const data = await response.json();

            setNotifications(
                data.notifications || []
            );

            setUnreadCount(
                data.unreadCount || 0
            );

        } catch (error) {
            console.error(
                'Notification fetch error:',
                error
            );
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Fetch profile picture
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    | We add ?v=timestamp to the URL.
    |
    | Supabase keeps the same object path:
    |
    | profile-pictures/admin/1
    |
    | But the browser sees a new URL each time:
    |
    | profile-pictures/admin/1?v=123
    |
    | This prevents the browser from displaying the old cached image.
    |--------------------------------------------------------------------------
    */

    const fetchProfilePicture = async () => {
        if (!accessToken || !user) return;

        try {
            const response = await fetch(
                `${API_BASE}/settings/profile`,
                {
                    method: 'GET',
                    headers: {
                        Authorization:
                            `Bearer ${accessToken}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error(
                    'Failed to fetch profile'
                );
            }

            const data = await response.json();

            if (data.profile_picture_url) {
                const freshUrl =
                    `${data.profile_picture_url}?v=${Date.now()}`;

                setProfilePictureUrl(freshUrl);
            } else {
                setProfilePictureUrl(null);
            }

        } catch (error) {
            console.error(
                'Profile picture fetch error:',
                error
            );
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Initial load
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        fetchNotifications();
        fetchProfilePicture();
    }, [accessToken, user]);

    /*
    |--------------------------------------------------------------------------
    | Refresh profile picture periodically
    |--------------------------------------------------------------------------
    |
    | This means even if Settings changes the picture while the navbar
    | remains mounted, the navbar will eventually pick up the new image.
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (!accessToken || !user) return;

        const profileInterval =
            setInterval(() => {
                fetchProfilePicture();
            }, 10 * 1000);

        return () =>
            clearInterval(profileInterval);
    }, [accessToken, user]);

    /*
    |--------------------------------------------------------------------------
    | Refresh notifications periodically
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (!accessToken || !user) return;

        const interval = setInterval(() => {
            fetchNotifications();
        }, 60 * 1000);

        return () =>
            clearInterval(interval);
    }, [accessToken, user]);

    /*
    |--------------------------------------------------------------------------
    | Close dropdowns when clicking outside
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(
                    event.target
                )
            ) {
                setNotificationOpen(false);
            }

            if (
                profileRef.current &&
                !profileRef.current.contains(
                    event.target
                )
            ) {
                setProfileOpen(false);
            }
        };

        document.addEventListener(
            'mousedown',
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                'mousedown',
                handleClickOutside
            );
        };
    }, []);

    /*
    |--------------------------------------------------------------------------
    | Mark one notification as read
    |--------------------------------------------------------------------------
    */

    const markAsRead = async (
        notificationId
    ) => {
        try {
            const response = await fetch(
                `${API_BASE}/notifications/${notificationId}/read`,
                {
                    method: 'PATCH',
                    headers: {
                        Authorization:
                            `Bearer ${accessToken}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error(
                    'Failed to mark notification as read'
                );
            }

            setNotifications((prev) =>
                prev.map((notification) =>
                    notification.notification_id ===
                    notificationId
                        ? {
                              ...notification,
                              is_read: true,
                          }
                        : notification
                )
            );

            setUnreadCount((prev) =>
                Math.max(prev - 1, 0)
            );

        } catch (error) {
            console.error(
                'Mark notification error:',
                error
            );
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Mark all notifications as read
    |--------------------------------------------------------------------------
    */

    const markAllAsRead = async () => {
        try {
            const response = await fetch(
                `${API_BASE}/notifications/read-all`,
                {
                    method: 'PATCH',
                    headers: {
                        Authorization:
                            `Bearer ${accessToken}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error(
                    'Failed to mark all notifications'
                );
            }

            setNotifications((prev) =>
                prev.map((notification) => ({
                    ...notification,
                    is_read: true,
                }))
            );

            setUnreadCount(0);

        } catch (error) {
            console.error(
                'Mark all notifications error:',
                error
            );
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Logout
    |--------------------------------------------------------------------------
    */

    const handleLogout = async () => {
        setProfileOpen(false);
        await logout();
    };

    /*
    |--------------------------------------------------------------------------
    | Time formatting
    |--------------------------------------------------------------------------
    */

    const formatNotificationTime = (date) => {
        if (!date) return '';

        const notificationDate =
            new Date(date);

        const now = new Date();

        const difference =
            Math.floor(
                (now - notificationDate) /
                    1000
            );

        if (difference < 60) {
            return 'Just now';
        }

        if (difference < 3600) {
            return `${Math.floor(
                difference / 60
            )}m ago`;
        }

        if (difference < 86400) {
            return `${Math.floor(
                difference / 3600
            )}h ago`;
        }

        if (difference < 604800) {
            return `${Math.floor(
                difference / 86400
            )}d ago`;
        }

        return notificationDate.toLocaleDateString();
    };

    /*
    |--------------------------------------------------------------------------
    | No authenticated user
    |--------------------------------------------------------------------------
    */

    if (!user) {
        return null;
    }

    const initials =
        getInitials(user.name);

    return (
        <header
            className="glass-card !rounded-2xl h-16 mt-[9px] mx-4 shrink-0 px-8 pl-6 flex items-center justify-between z-20 select-none"
        >

            {/* =========================================================
                TITLE
            ========================================================= */}

            <h1
                className="
                    text-h3
                    font-bold
                    text-white
                    tracking-tight
                "
            >
                AAGS {user.role} Dashboard
            </h1>


            {/* =========================================================
                RIGHT ACTIONS
            ========================================================= */}

            <div
                className="
                    flex
                    items-center
                    space-x-5
                "
            >

                {/* =====================================================
                    NOTIFICATIONS
                ===================================================== */}

                <div
                    className="relative"
                    ref={notificationRef}
                >

                    <button
                        onClick={() => {
                            setNotificationOpen(
                                (prev) => !prev
                            );

                            setProfileOpen(false);
                        }}
                        className="
                            relative
                            p-1
                            text-white
                            hover:text-white/70
                            transition-colors
                            focus:outline-none
                        "
                        aria-label="Notifications"
                    >
                        <Bell className="w-5 h-5" />

                        {unreadCount > 0 && (
                            <span
                                className="
                                    absolute
                                    -top-2
                                    -right-2
                                    min-w-[17px]
                                    h-[17px]
                                    px-1
                                    flex
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-red-500
                                    text-white
                                    text-[10px]
                                    font-bold
                                    border
                                    border-[#071B38]
                                "
                            >
                                {unreadCount > 9
                                    ? '9+'
                                    : unreadCount}
                            </span>
                        )}
                    </button>


                    {/* Notification dropdown */}

                    {notificationOpen && (
                        <div
                            className="
                                absolute
                                right-0
                                top-9
                                w-[360px]
                                bg-[#071B38]/95
                                backdrop-blur-2xl
                                border
                                border-white/20
                                rounded-xl
                                shadow-2xl
                                overflow-hidden
                            "
                        >

                            {/* Header */}

                            <div
                                className="
                                    px-4
                                    py-3
                                    border-b
                                    border-white/10
                                    flex
                                    items-center
                                    justify-between
                                "
                            >

                                <div>
                                    <h3
                                        className="
                                            text-white
                                            font-semibold
                                        "
                                    >
                                        Notifications
                                    </h3>

                                    <p
                                        className="
                                            text-white/50
                                            text-xs
                                            mt-0.5
                                        "
                                    >
                                        {unreadCount} unread
                                    </p>
                                </div>

                                {unreadCount > 0 && (
                                    <button
                                        onClick={
                                            markAllAsRead
                                        }
                                        className="
                                            text-xs
                                            text-white/70
                                            hover:text-white
                                            flex
                                            items-center
                                            gap-1
                                        "
                                    >
                                        <CheckCheck
                                            className="
                                                w-3.5
                                                h-3.5
                                            "
                                        />

                                        Mark all read
                                    </button>
                                )}

                            </div>


                            {/* Notification list */}

                            <div
                                className="
                                    max-h-[380px]
                                    overflow-y-auto
                                "
                            >

                                {notifications.length === 0 ? (

                                    <div
                                        className="
                                            py-10
                                            text-center
                                            text-white/50
                                            text-sm
                                        "
                                    >
                                        <Bell
                                            className="
                                                w-8
                                                h-8
                                                mx-auto
                                                mb-2
                                                opacity-40
                                            "
                                        />

                                        No notifications
                                    </div>

                                ) : (

                                    notifications.map(
                                        (notification) => (
                                            <div
                                                key={
                                                    notification.notification_id
                                                }
                                                className={`
                                                    px-4
                                                    py-3
                                                    border-b
                                                    border-white/10
                                                    transition-colors
                                                    ${
                                                        notification.is_read
                                                            ? 'bg-transparent'
                                                            : 'bg-white/10'
                                                    }
                                                `}
                                            >

                                                <div
                                                    className="
                                                        flex
                                                        gap-3
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            mt-1
                                                            w-2
                                                            h-2
                                                            rounded-full
                                                            shrink-0
                                                            bg-blue-400
                                                        "
                                                    />

                                                    <div
                                                        className="
                                                            flex-1
                                                            min-w-0
                                                        "
                                                    >

                                                        <div
                                                            className="
                                                                flex
                                                                justify-between
                                                                gap-2
                                                            "
                                                        >

                                                            <h4
                                                                className={`
                                                                    text-sm
                                                                    truncate
                                                                    ${
                                                                        notification.is_read
                                                                            ? 'text-white/70'
                                                                            : 'text-white font-semibold'
                                                                    }
                                                                `}
                                                            >
                                                                {
                                                                    notification.title
                                                                }
                                                            </h4>

                                                            <span
                                                                className="
                                                                    text-[10px]
                                                                    text-white/40
                                                                    whitespace-nowrap
                                                                "
                                                            >
                                                                {formatNotificationTime(
                                                                    notification.created_at
                                                                )}
                                                            </span>

                                                        </div>

                                                        <p
                                                            className="
                                                                text-xs
                                                                text-white/60
                                                                mt-1
                                                                leading-relaxed
                                                            "
                                                        >
                                                            {
                                                                notification.message
                                                            }
                                                        </p>

                                                        {!notification.is_read && (
                                                            <button
                                                                onClick={() =>
                                                                    markAsRead(
                                                                        notification.notification_id
                                                                    )
                                                                }
                                                                className="
                                                                    mt-2
                                                                    text-[11px]
                                                                    text-white/70
                                                                    hover:text-white
                                                                    flex
                                                                    items-center
                                                                    gap-1
                                                                "
                                                            >
                                                                <Check
                                                                    className="
                                                                        w-3
                                                                        h-3
                                                                    "
                                                                />

                                                                Mark as read
                                                            </button>
                                                        )}

                                                    </div>

                                                </div>

                                            </div>
                                        )
                                    )

                                )}

                            </div>

                        </div>
                    )}

                </div>

<button
  onClick={toggle}
  className="p-1 text-white hover:text-white/70 transition-colors focus:outline-none"
  aria-label="Toggle theme"
>
  {isLight ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
</button>

                {/* =====================================================
                    HELP
                ===================================================== */}

                <button
                    className="
                        p-1
                        text-white
                        hover:text-white/70
                        transition-colors
                        focus:outline-none
                    "
                    aria-label="Help"
                >
                    <HelpCircle className="w-5 h-5" />
                </button>


                {/* =====================================================
                    DIVIDER
                ===================================================== */}

                <div
                    className="
                        h-5
                        w-[1px]
                        bg-white/20
                    "
                />


                {/* =====================================================
                    PROFILE
                ===================================================== */}

                <div
                    className="relative"
                    ref={profileRef}
                >

                    <button
                        onClick={() => {
                            setProfileOpen(
                                (prev) => !prev
                            );

                            setNotificationOpen(false);
                        }}
                        className="
                            flex
                            items-center
                            gap-2
                            focus:outline-none
                        "
                    >

                        {/* Profile avatar */}

                        <div
                            className="
                                w-9
                                h-9
                                rounded-full
                                border
                                border-white/30
                                shadow-sm
                                flex
                                items-center
                                justify-center
                                bg-white/10
                                text-white
                                font-semibold
                                text-xs
                                hover:ring-2
                                hover:ring-brand-orange-500
                                transition-all
                                overflow-hidden
                                shrink-0
                            "
                        >

                            {profilePictureUrl ? (

                                <img
                                    src={profilePictureUrl}
                                    alt={user.name}
                                    className="
                                        w-full
                                        h-full
                                        object-cover
                                    "
                                    onError={() => {
                                        setProfilePictureUrl(
                                            null
                                        );
                                    }}
                                />

                            ) : (

                                initials

                            )}

                        </div>


                        <ChevronDown
                            className={`
                                w-4
                                h-4
                                text-white/70
                                transition-transform
                                ${
                                    profileOpen
                                        ? 'rotate-180'
                                        : ''
                                }
                            `}
                        />

                    </button>


                    {/* =================================================
                        PROFILE DROPDOWN
                    ================================================= */}

                    {profileOpen && (
                        <div
                            className="
                                absolute
                                right-0
                                top-12
                                w-64
                                bg-[#071B38]/95
                                backdrop-blur-2xl
                                border
                                border-white/20
                                rounded-xl
                                shadow-2xl
                                overflow-hidden
                            "
                        >

                            {/* User information */}

                            <div
                                className="
                                    px-4
                                    py-4
                                    border-b
                                    border-white/10
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                    "
                                >

                                    {/* Dropdown profile picture */}

                                    <div
                                        className="
                                            w-11
                                            h-11
                                            rounded-full
                                            bg-white/10
                                            border
                                            border-white/20
                                            flex
                                            items-center
                                            justify-center
                                            text-white
                                            font-bold
                                            overflow-hidden
                                            shrink-0
                                        "
                                    >

                                        {profilePictureUrl ? (

                                            <img
                                                src={
                                                    profilePictureUrl
                                                }
                                                alt={
                                                    user.name
                                                }
                                                className="
                                                    w-full
                                                    h-full
                                                    object-cover
                                                "
                                            />

                                        ) : (

                                            initials

                                        )}

                                    </div>


                                    <div
                                        className="
                                            min-w-0
                                        "
                                    >

                                        <p
                                            className="
                                                text-white
                                                font-semibold
                                                truncate
                                            "
                                        >
                                            {user.name}
                                        </p>

                                        <p
                                            className="
                                                text-white/50
                                                text-xs
                                                truncate
                                            "
                                        >
                                            {user.email}
                                        </p>

                                        <p
                                            className="
                                                text-white/40
                                                text-xs
                                                mt-0.5
                                            "
                                        >
                                            {user.role}
                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/* Settings */}

                            <button
                                onClick={() => {
                                    setProfileOpen(false);
                                    navigate('/settings');
                                }}
                                className="
                                    w-full
                                    px-4
                                    py-3
                                    text-left
                                    text-sm
                                    text-white/80
                                    hover:bg-white/10
                                    flex
                                    items-center
                                    gap-3
                                    transition-colors
                                "
                            >
                                <Settings className="w-4 h-4" />

                                Settings
                            </button>


                            {/* Logout */}

                            <div
                                className="
                                    border-t
                                    border-white/10
                                "
                            >

                                <button
                                    onClick={
                                        handleLogout
                                    }
                                    className="
                                        w-full
                                        px-4
                                        py-3
                                        text-left
                                        text-sm
                                        text-red-300
                                        hover:bg-red-500/10
                                        flex
                                        items-center
                                        gap-3
                                        transition-colors
                                    "
                                >
                                    <LogOut className="w-4 h-4" />

                                    Logout
                                </button>

                            </div>

                        </div>
                    )}

                </div>

            </div>

        </header>
    );
};

export default Topnavbar;