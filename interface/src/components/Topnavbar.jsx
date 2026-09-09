import React from 'react';
import { Bell, HelpCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Topnavbar = () => {
  const { user } = useAuth();

  return (
 <header className="h-16 mt-[9px] mx-4 shrink-0 bg-white/10 backdrop-blur-xl border border-white/20 px-8 pl-6 flex items-center justify-between z-20 select-none rounded-xl shadow-lg">
      {/* Title */}
      <h1 className="text-h3 font-bold text-white tracking-tight">
        AAGS {user.role} Dashboard
      </h1>

      {/* Right Actions */}
      <div className="flex items-center space-x-5">
        {/* Notification Bell */}
        <button
          className="p-1 text-white hover:text-white/70 transition-colors focus:outline-none"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
        </button>

        {/* Help / Support */}
        <button
          className="p-1 text-white hover:text-white/70 transition-colors focus:outline-none"
          aria-label="Help"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Divider */}
        <div className="h-5 w-[1px] bg-white/20" />

        {/* Settings Button */}
        <button className="text-body font-medium text-white hover:text-white/70 transition-colors">
          Settings
        </button>

        {/* User Profile Avatar */}
        <div className="w-9 h-9 rounded-full overflow-hidden border border-white/30 shadow-sm cursor-pointer hover:ring-2 hover:ring-brand-orange-500 transition-all">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
            alt="Alex Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
};

export default Topnavbar;