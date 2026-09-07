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
      <Link 
        to="/"
        className="p-4 border-b border-slate-800 flex items-center gap-2.5 hover:opacity-95 transition-opacity select-none"
        title="NEUROSPECTRA - Back to Home"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-md flex-shrink-0">
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04z"/>
            <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04z"/>
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-white text-[15px] tracking-wide leading-none">
            NEURO<span className="text-blue-400">SPECTRA</span>
          </span>
          <span className="text-[9px] font-semibold text-slate-400 tracking-wider uppercase mt-0.5">
            Autism Care Platform
          </span>
        </div>
      </Link>

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
