import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Baby,
  Stethoscope,
  GraduationCap,
  Calendar,
  FileText,
  Settings,
  LogOut,
  Activity,
  ClipboardCheck,
  MessageSquare,
} from 'lucide-react';

export const Sidebar = () => {
  const { user, role, logout } = useAuth();

  const getNavLinks = () => {
    switch (role) {
      case 'Administrator':
        return [
          { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/admin/users', label: 'Users & Staff', icon: Users },
          { to: '/admin/children', label: 'Children Registry', icon: Baby },
          { to: '/admin/therapists', label: 'Therapists', icon: Stethoscope },
          { to: '/admin/teachers', label: 'Teachers', icon: GraduationCap },
          { to: '/admin/appointments', label: 'Appointments', icon: Calendar },
          { to: '/admin/reports', label: 'Reports', icon: FileText },
        ];
      case 'Therapist':
        return [
          { to: '/therapist/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/therapist/children', label: 'Assigned Children', icon: Baby },
          { to: '/therapist/assessments', label: 'M-CHAT-R/F Screenings', icon: ClipboardCheck },
          { to: '/therapist/therapy-plans', label: 'Therapy Plans (IEP)', icon: Activity },
          { to: '/therapist/sessions', label: 'Session Logs', icon: FileText },
          { to: '/therapist/appointments', label: 'Appointments', icon: Calendar },
          { to: '/therapist/messages', label: 'Messages', icon: MessageSquare },
        ];
      case 'Receptionist':
        return [
          { to: '/receptionist/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/receptionist/intake', label: 'Child Intake', icon: Baby },
          { to: '/receptionist/appointments', label: 'Appointment Schedule', icon: Calendar },
        ];
      case 'Parent / Caregiver':
        return [
          { to: '/parent/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/parent/my-child', label: 'Child Milestones', icon: Baby },
          { to: '/parent/therapy-plan', label: 'Therapy Goals', icon: Activity },
          { to: '/parent/appointments', label: 'Visits & Schedule', icon: Calendar },
          { to: '/parent/reports', label: 'Reports & Export', icon: FileText },
        ];
      case 'Teacher':
        return [
          { to: '/teacher/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/teacher/students', label: 'Students Roster', icon: GraduationCap },
          { to: '/teacher/observations', label: 'Behavioral Logs', icon: FileText },
        ];
      default:
        return [{ to: '/parent/dashboard', label: 'Dashboard', icon: LayoutDashboard }];
    }
  };

  const navLinks = getNavLinks();

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 min-h-screen border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-5 flex items-center gap-3 border-b border-slate-800">
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-500/30">
          N
        </div>
        <div>
          <div className="font-extrabold text-base tracking-tight text-white">NEUROSPECTRA</div>
          <div className="text-[11px] font-semibold text-blue-400">Pediatric Care Portal</div>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
