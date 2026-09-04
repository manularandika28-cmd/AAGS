import React from 'react';
import { Bell, HelpCircle } from 'lucide-react';

const Topnavbar = () => {
  return (
   <header className="h-16 bg-black/35 border-b border-white/20 px-8 flex items-center justify-between sticky top-2 z-20 select-none rounded-xl">
      {/* Title */}
      <h1 className="text-h3 font-bold text-white text-brand-navy-800 tracking-tight">
        AAGS Student Dashboard
      </h1>

      {/* Right Actions */}
      <div className="flex items-center space-x-5">
        {/* Notification Bell */}
        <button
          className="p-1 text-white hover:text-slate-200 transition-colors focus:outline-none"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
        </button>

        {/* Help / Support */}
        <button
          className="p-1 text-white hover:text-slate-200 transition-colors focus:outline-none"
          aria-label="Help"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Divider */}
        <div className="h-5 w-[1px] bg-border-default" />

        {/* Settings Button */}
        <button className="text-body font-medium text-text-secondary text-white hover:text-text-accent transition-colors">
          Settings
        </button>

        {/* User Profile Avatar */}
        <div className="w-9 h-9 rounded-full overflow-hidden border border-border-subtle shadow-sm cursor-pointer hover:ring-2 hover:ring-brand-orange-500 transition-all">
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