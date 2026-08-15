import React from 'react';
import { 
  LayoutGrid, 
  CalendarDays, 
  BriefcaseMedical, 
  GraduationCap, 
  LogOut,
  GraduationCap as UniversityIcon 
} from 'lucide-react';

const Sidenavbar = ({ activeTab = 'Dashboard', onTabChange }) => {
  const navItems = [
    { name: 'DASHBOARD', icon: LayoutGrid, key: 'Dashboard' },
    { name: 'MEETING SCHEDULER', icon: CalendarDays, key: 'Meeting Scheduler' },
    { name: 'MEDICAL HUB', icon: BriefcaseMedical, key: 'Medical Hub' },
    { name: 'ACADEMIC RECORDS', icon: GraduationCap, key: 'Academic Records' },
  ];

  return (
    <aside className="w-64 bg-[#071B38] text-white flex flex-col justify-between min-h-screen shrink-0 select-none">
      <div>
        {/* University Header / Brand */}
        <div className="p-6 flex items-center space-x-3 border-b border-slate-800/60">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#071B38] shrink-0">
            <UniversityIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-white leading-tight">Faculty of<br />Technology</h2>
            <p className="text-xs text-slate-400 font-light mt-0.5">University of Colombo</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="mt-6 px-3 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onTabChange && onTabChange(item.key)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-xs font-semibold tracking-wider transition-all duration-150 ${
                  isActive
                    ? 'bg-[#FF5B4A] text-white shadow-md'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout Link */}
      <div className="p-4 mb-4">
        <button 
          onClick={() => console.log('Logout clicked')}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-xs font-semibold tracking-wider text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0 rotate-180" />
          <span>LOG OUT</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidenavbar;