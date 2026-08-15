import React from 'react';
import { Bell, HelpCircle } from 'lucide-react';

const Topnavbar = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between sticky top-0 z-20">
      {/* Title */}
      <h1 className="text-xl font-bold text-[#071B38] tracking-tight">
        AAGS Student Dashboard
      </h1>

      {/* Right Actions */}
      <div className="flex items-center space-x-5">
        <button 
          className="p-1 text-slate-600 hover:text-slate-900 transition-colors" 
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
        </button>

        <button 
          className="p-1 text-slate-600 hover:text-slate-900 transition-colors" 
          aria-label="Help"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        <div className="h-5 w-[1px] bg-slate-300" />

        <button className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">
          Settings
        </button>

        {/* User Profile Avatar */}
        <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 cursor-pointer">
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