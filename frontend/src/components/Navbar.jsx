import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, Search, User } from 'lucide-react';

export const Navbar = ({ title = 'Clinical Dashboard' }) => {
  const { user, role } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-9 z-40">
      {/* Title */}
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">{title}</h1>
        <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-md border border-blue-200">
          {role}
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl p-4 text-xs z-50 animate-fadeIn">
              <div className="font-bold text-slate-900 mb-2 pb-2 border-b border-slate-100 flex justify-between">
                <span>Clinical Notifications</span>
                <span className="text-blue-600 cursor-pointer">Mark all read</span>
              </div>
              <div className="space-y-2">
                <div className="p-2 bg-blue-50/50 rounded-lg border border-blue-100">
                  <div className="font-semibold text-slate-800">New Assessment Submitted</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">M-CHAT-R/F for Aarav Sharma requires review.</div>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="font-semibold text-slate-800">Upcoming Session</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">Speech therapy scheduled with Liam Miller at 11:30 AM.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Pill */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
          <img
            src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=128'}
            alt="Avatar"
            className="w-9 h-9 rounded-full object-cover border border-slate-200"
          />
          <div className="text-left hidden sm:block">
            <div className="text-xs font-bold text-slate-900">{user?.full_name || 'Dr. Eleanor Vance'}</div>
            <div className="text-[11px] font-medium text-slate-500">{user?.email || 'admin@neurospectra.org'}</div>
          </div>
        </div>
      </div>
    </header>
  );
};
