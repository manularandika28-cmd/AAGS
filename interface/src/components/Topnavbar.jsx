import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Bell,
  HelpCircle,
  Check,
  CheckCheck,
  LogOut,
  Settings,
  ChevronDown,
  ChevronRight,
  Sun,
  Moon,
  BookOpen,
  MessageCircleQuestion,
  Headset,
  Bug,
  Info,
} from 'lucide-react';

import useTheme from '../hooks/useTheme';
import { useAuth } from '../context/AuthContext';

const API_BASE = 'http://localhost:3000/api';

const Topnavbar = () => {
  const navigate = useNavigate();
  const { isLight, toggle } = useTheme();
  const { user, accessToken, logout } = useAuth();

  const location = useLocation();

const pageTitles = {
  '/admin/dashboard': 'AAGS Admin Dashboard',
  '/admin/users': 'User Management',
  '/admin/pending-approvals': 'Pending Approvals',
  '/admin/audit-logs': 'Audit Trail',
  '/admin/system-configuration': 'System Configuration',
  '/admin/roles-and-permissions': 'Roles & Permissions',

  '/hod/dashboard': 'AAGS HOD Dashboard',
  '/hod/meetings': 'Meeting Requests',
  '/hod/medical': 'Medical Review',

  '/student/dashboard': 'AAGS Student Dashboard',
  '/student/meetings': 'Meeting Scheduler',
  '/student/medical': 'Medical Hub',
  '/student/academic-records': 'Academic Records',

  '/dean/dashboard': 'AAGS Dean Dashboard',
  '/dean/meetings': 'Meeting Requests',

  '/lecturer/dashboard': 'AAGS Lecturer Dashboard',
  '/lecturer/attendance': 'Attendance Management',
  '/lecturer/meetings': 'Meeting Management',

  '/medical-officer/dashboard': 'AAGS Medical Officer Dashboard',
'/medical-officer/medical-reviews': 'Medical Certificate Reviews',

  '/settings': 'Settings',
};

const pageTitle =
  pageTitles[location.pathname.toLowerCase()] || 'AAGS Dashboard';

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const [notificationOpen, setNotificationOpen] = useState(false);
const [profileOpen, setProfileOpen] = useState(false);
const [helpOpen, setHelpOpen] = useState(false);

const notificationRef = useRef(null);
const profileRef = useRef(null);
const helpRef = useRef(null);

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const fetchNotifications = async () => {
    if (!accessToken || !user) return;
    try {
      const response = await fetch(`${API_BASE}/notifications`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!response.ok) throw new Error('Failed to fetch notifications');
      const data = await response.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error('Notification fetch error:', error);
    }
  };

  // ?v=timestamp busts the browser cache when the picture changes
  const fetchProfilePicture = async () => {
    if (!accessToken || !user) return;
    try {
      const response = await fetch(`${API_BASE}/settings/profile`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!response.ok) throw new Error('Failed to fetch profile');
      const data = await response.json();
      setProfilePictureUrl(
        data.profile_picture_url
          ? `${data.profile_picture_url}?v=${Date.now()}`
          : null
      );
    } catch (error) {
      console.error('Profile picture fetch error:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchProfilePicture();
  }, [accessToken, user]);

  useEffect(() => {
    if (!accessToken || !user) return;
    const id = setInterval(fetchProfilePicture, 10 * 1000);
    return () => clearInterval(id);
  }, [accessToken, user]);

  useEffect(() => {
    if (!accessToken || !user) return;
    const id = setInterval(fetchNotifications, 60 * 1000);
    return () => clearInterval(id);
  }, [accessToken, user]);

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      notificationRef.current &&
      !notificationRef.current.contains(event.target)
    ) {
      setNotificationOpen(false);
    }

    if (
      profileRef.current &&
      !profileRef.current.contains(event.target)
    ) {
      setProfileOpen(false);
    }

    if (
      helpRef.current &&
      !helpRef.current.contains(event.target)
    ) {
      setHelpOpen(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);

  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`${API_BASE}/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!response.ok) throw new Error('Failed to mark notification as read');
      setNotifications((prev) =>
        prev.map((n) =>
          n.notification_id === notificationId ? { ...n, is_read: true } : n
        )
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (error) {
      console.error('Mark notification error:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch(`${API_BASE}/notifications/read-all`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!response.ok) throw new Error('Failed to mark all notifications');
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Mark all notifications error:', error);
    }
  };

  const handleLogout = async () => {
    setProfileOpen(false);
    await logout();
  };

  const formatNotificationTime = (date) => {
    if (!date) return '';
    const diff = Math.floor((new Date() - new Date(date)) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return new Date(date).toLocaleDateString();
  };

  if (!user) return null;

  const initials = getInitials(user.name);

  const roleGuides = {
  Admin: 'Administrator Guide',
  Dean: 'Dean Guide',
  HOD: 'HOD Guide',
  Lecturer: 'Lecturer Guide',
  Student: 'Student Guide',
  'Medical Officer': 'Medical Officer Guide',
};

const guideTitle = roleGuides[user.role] || 'User Guide';

  /* ---------- Theme tokens (same palette as Sidenavbar) ---------- */

const headerTheme = isLight
  ? `
      bg-white/60
      backdrop-blur-2xl backdrop-saturate-150
      border-white/70
      text-slate-800
      shadow-[0_12px_40px_rgba(15,23,42,0.08)]
    `
  : `
      bg-[rgba(30,41,59,0.58)]
      backdrop-blur-2xl backdrop-saturate-150
      border-white/10
      text-white
      shadow-[0_12px_40px_rgba(0,0,0,0.25)]
    `;

  const titleColor = isLight ? 'text-[#0A192F]' : 'text-white';
  const mutedText = isLight ? 'text-slate-500' : 'text-white/55';
  const faintText = isLight ? 'text-slate-400' : 'text-white/40';
  const bodyText = isLight ? 'text-slate-600' : 'text-white/65';
  const dividerColor = isLight ? 'border-slate-200' : 'border-white/10';
  const dividerBg = isLight ? 'bg-slate-200' : 'bg-white/20';

  const iconBtn = isLight
    ? 'text-slate-600 hover:bg-slate-100 hover:text-[#0A192F]'
    : 'text-white/65 hover:bg-white/10 hover:text-white';

  const dropdownTheme = isLight
  ? `
      bg-white/95
      backdrop-blur-xl
      border-slate-200
      shadow-[0_8px_32px_rgba(31,38,135,0.15)]
    `
  : `
      bg-[#071B33]/98
      backdrop-blur-xl
      border-white/15
      shadow-2xl shadow-black/40
    `;

  const rowHover = isLight ? 'hover:bg-slate-100' : 'hover:bg-white/10';
  const unreadBg = isLight ? 'bg-slate-100' : 'bg-white/10';
  const badgeBorder = isLight ? 'border-white' : 'border-[#071B33]';

  const avatarTheme = isLight
    ? 'bg-slate-100 text-[#0A192F] border-slate-200'
    : 'bg-white/10 text-white border-white/20';

  const iconBtnBase =
    'w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 focus:outline-none';

  return (
    <header
  className={`
    relative z-50
    h-16
    mt-3
    mx-3
    shrink-0
    px-6
    flex items-center justify-between
    select-none
    rounded-[18px]
    border
    backdrop-blur-2xl
    backdrop-saturate-150
    transition-all duration-300
    ${headerTheme}
  `}
>
      {/* TITLE */}
      <h1 className={`text-[15px] font-bold tracking-tight ${titleColor}`}>
        {pageTitle}
      </h1>

      {/* RIGHT ACTIONS */}
      <div className="flex items-center space-x-2">

        {/* NOTIFICATIONS */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => {
              setNotificationOpen((prev) => !prev);
              setProfileOpen(false);
            }}
            className={`relative ${iconBtnBase} ${iconBtn}`}
            aria-label="Notifications"
          >
            <Bell className="w-[18px] h-[18px]" />

            {unreadCount > 0 && (
              <span
                className={`
                  absolute -top-1 -right-1
                  min-w-[17px] h-[17px] px-1
                  flex items-center justify-center
                  rounded-full
                  bg-brand-orange-500 text-white
                  text-[10px] font-bold
                  border ${badgeBorder}
                `}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {notificationOpen && (
            <div
              className={`
                absolute right-0 top-12 w-[360px]
                backdrop-blur-2xl border rounded-2xl overflow-hidden
                ${dropdownTheme}
              `}
            >
              {/* Header */}
              <div
                className={`px-4 py-3 border-b ${dividerColor} flex items-center justify-between`}
              >
                <div>
                  <h3 className={`text-sm font-bold ${titleColor}`}>Notifications</h3>
                  <p className={`text-[11px] mt-0.5 ${mutedText}`}>{unreadCount} unread</p>
                </div>

                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className={`text-[11px] font-semibold flex items-center gap-1 px-2 py-1 rounded-lg transition-colors ${iconBtn}`}
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}
              </div>

              {/* List */}
              <div className="max-h-[380px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className={`py-10 text-center text-sm ${mutedText}`}>
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    No notifications
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.notification_id}
                      className={`
                        px-4 py-3 border-b ${dividerColor} transition-colors
                        ${notification.is_read ? 'bg-transparent' : unreadBg}
                      `}
                    >
                      <div className="flex gap-3">
                        <div
                          className={`
                            mt-1.5 w-2 h-2 rounded-full shrink-0
                            ${notification.is_read ? 'bg-transparent' : 'bg-brand-orange-500'}
                          `}
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between gap-2">
                            <h4
                              className={`
                                text-[13px] truncate
                                ${notification.is_read
                                  ? bodyText
                                  : `${titleColor} font-semibold`}
                              `}
                            >
                              {notification.title}
                            </h4>

                            <span className={`text-[10px] whitespace-nowrap ${faintText}`}>
                              {formatNotificationTime(notification.created_at)}
                            </span>
                          </div>

                          <p className={`text-xs mt-1 leading-relaxed ${bodyText}`}>
                            {notification.message}
                          </p>

                          {!notification.is_read && (
                            <button
                              onClick={() => markAsRead(notification.notification_id)}
                              className={`mt-2 text-[11px] font-semibold flex items-center gap-1 ${mutedText} ${isLight ? 'hover:text-[#0A192F]' : 'hover:text-white'} transition-colors`}
                            >
                              <Check className="w-3 h-3" />
                              Mark as read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* THEME TOGGLE */}
        <button
          onClick={toggle}
          className={`${iconBtnBase} ${iconBtn}`}
          aria-label="Toggle theme"
        >
          {isLight ? <Moon className="w-[18px] h-[18px]" /> : <Sun className="w-[18px] h-[18px]" />}
        </button>

        {/* HELP & SUPPORT */}
<div className="relative" ref={helpRef}>
  <button
    onClick={() => {
      setHelpOpen((prev) => !prev);
      setNotificationOpen(false);
      setProfileOpen(false);
    }}
    className={`${iconBtnBase} ${iconBtn} ${
      helpOpen ? (isLight ? 'bg-slate-100' : 'bg-white/10') : ''
    }`}
    aria-label="Help and Support"
    aria-expanded={helpOpen}
  >
    <HelpCircle className="w-[18px] h-[18px]" />
  </button>

  {helpOpen && (
    <div
      className={`
        absolute right-0 top-12 w-[320px]
        border rounded-2xl overflow-hidden
        backdrop-blur-2xl
        ${dropdownTheme}
      `}
    >
      {/* Dropdown Header */}
      <div className={`px-4 py-4 border-b ${dividerColor}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-orange-500/10 flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-brand-orange-500" />
          </div>

          <div>
            <h3 className={`text-sm font-bold ${titleColor}`}>
              Help & Support
            </h3>
            <p className={`text-[11px] mt-0.5 ${mutedText}`}>
              How can we help you?
            </p>
          </div>
        </div>
      </div>

      {/* User Guide */}
      <div className="p-2 space-y-1">

        <button
          type="button"
          className={`
            w-full flex items-center gap-3 p-3 rounded-xl
            text-left transition-colors ${rowHover}
          `}
        >
          <BookOpen className={`w-[18px] h-[18px] ${mutedText}`} />

          <div className="flex-1 min-w-0">
            <p className={`text-xs font-bold ${titleColor}`}>
              {guideTitle}
            </p>
            <p className={`text-[10px] mt-0.5 ${mutedText}`}>
              Instructions for using your dashboard
            </p>
          </div>

          <ChevronRight className={`w-4 h-4 ${faintText}`} />
        </button>

        {/* FAQs */}
        <button
          type="button"
          className={`
            w-full flex items-center gap-3 p-3 rounded-xl
            text-left transition-colors ${rowHover}
          `}
        >
          <MessageCircleQuestion className={`w-[18px] h-[18px] ${mutedText}`} />

          <div className="flex-1 min-w-0">
            <p className={`text-xs font-bold ${titleColor}`}>
              Frequently Asked Questions
            </p>
            <p className={`text-[10px] mt-0.5 ${mutedText}`}>
              Find answers to common questions
            </p>
          </div>

          <ChevronRight className={`w-4 h-4 ${faintText}`} />
        </button>

        {/* Contact Support */}
        <button
          type="button"
          className={`
            w-full flex items-center gap-3 p-3 rounded-xl
            text-left transition-colors ${rowHover}
          `}
        >
          <Headset className={`w-[18px] h-[18px] ${mutedText}`} />

          <div className="flex-1 min-w-0">
            <p className={`text-xs font-bold ${titleColor}`}>
              Contact Support
            </p>
            <p className={`text-[10px] mt-0.5 ${mutedText}`}>
              Get technical assistance
            </p>
          </div>

          <ChevronRight className={`w-4 h-4 ${faintText}`} />
        </button>

        {/* Report a Problem */}
        <button
          type="button"
          className={`
            w-full flex items-center gap-3 p-3 rounded-xl
            text-left transition-colors ${rowHover}
          `}
        >
          <Bug className={`w-[18px] h-[18px] ${mutedText}`} />

          <div className="flex-1 min-w-0">
            <p className={`text-xs font-bold ${titleColor}`}>
              Report a Problem
            </p>
            <p className={`text-[10px] mt-0.5 ${mutedText}`}>
              Report bugs or system issues
            </p>
          </div>

          <ChevronRight className={`w-4 h-4 ${faintText}`} />
        </button>

        {/* About AAGS */}
        <button
          type="button"
          className={`
            w-full flex items-center gap-3 p-3 rounded-xl
            text-left transition-colors ${rowHover}
          `}
        >
          <Info className={`w-[18px] h-[18px] ${mutedText}`} />

          <div className="flex-1 min-w-0">
            <p className={`text-xs font-bold ${titleColor}`}>
              About AAGS
            </p>
            <p className={`text-[10px] mt-0.5 ${mutedText}`}>
              Application information
            </p>
          </div>

          <ChevronRight className={`w-4 h-4 ${faintText}`} />
        </button>

      </div>

      {/* Footer */}
      <div className={`px-4 py-3 border-t ${dividerColor}`}>
        <p className={`text-[10px] text-center ${mutedText}`}>
          AAGS · Help & Support
        </p>
      </div>
    </div>
  )}
</div>

        {/* DIVIDER */}
        <div className={`h-5 w-px mx-2 ${dividerBg}`} />

        {/* PROFILE */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setProfileOpen((prev) => !prev);
              setNotificationOpen(false);
            }}
            className="flex items-center gap-2 focus:outline-none"
          >
            <div
              className={`
                w-9 h-9 rounded-full border shadow-sm
                flex items-center justify-center
                font-bold text-xs
                hover:ring-2 hover:ring-brand-orange-500
                transition-all overflow-hidden shrink-0
                ${avatarTheme}
              `}
            >
              {profilePictureUrl ? (
                <img
                  src={profilePictureUrl}
                  alt={user.name}
                  className="w-full h-full object-cover"
                  onError={() => setProfilePictureUrl(null)}
                />
              ) : (
                initials
              )}
            </div>

            <ChevronDown
              className={`w-4 h-4 transition-transform ${mutedText} ${profileOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {profileOpen && (
            <div
              className={`
                absolute right-0 top-12 w-64
                backdrop-blur-2xl border rounded-2xl overflow-hidden
                ${dropdownTheme}
              `}
            >
              {/* User info */}
              <div className={`px-4 py-4 border-b ${dividerColor}`}>
                <div className="flex items-center gap-3">
                  <div
                    className={`
                      w-11 h-11 rounded-full border
                      flex items-center justify-center
                      font-bold overflow-hidden shrink-0
                      ${avatarTheme}
                    `}
                  >
                    {profilePictureUrl ? (
                      <img
                        src={profilePictureUrl}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className={`text-xs font-bold truncate ${titleColor}`}>
                      {user.name}
                    </p>
                    <p className={`text-[11px] truncate mt-0.5 ${mutedText}`}>
                      {user.email}
                    </p>
                    <p
                      className={`text-[10px] mt-1 uppercase tracking-[0.15em] font-semibold ${mutedText}`}
                    >
                      {user.role}
                    </p>
                  </div>
                </div>
              </div>

              {/* Settings + Logout */}
              <div className="p-2 space-y-1">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    navigate('/settings');
                  }}
                  className={`
                    w-full px-3 py-2.5 rounded-xl
                    text-[11px] font-bold tracking-wide text-left
                    flex items-center gap-3
                    transition-all duration-200
                    ${iconBtn}
                  `}
                >
                  <Settings className="w-[18px] h-[18px]" />
                  SETTINGS
                </button>

                <button
                  onClick={handleLogout}
                  className={`
                    w-full px-3 py-2.5 rounded-xl
                    text-[11px] font-bold tracking-wide text-left
                    flex items-center gap-3
                    transition-all duration-200
                    ${isLight
                      ? 'text-rose-600 hover:bg-rose-50'
                      : 'text-rose-300 hover:bg-rose-500/15 hover:text-rose-200'}
                  `}
                >
                  <LogOut className="w-[18px] h-[18px] rotate-180" />
                  LOG OUT
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