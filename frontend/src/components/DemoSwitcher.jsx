import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Shield, Stethoscope, ClipboardList, Users, GraduationCap, Globe } from 'lucide-react';

export const DemoSwitcher = () => {
  const { role, switchDemoRole } = useAuth();

  const personas = [
    {
      role: 'Administrator',
      name: 'Dr. Eleanor Vance',
      label: '👑 Administrator',
      icon: Shield,
      email: 'admin@neurospectra.org',
      avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
    },
    {
      role: 'Therapist',
      name: 'Dr. Aisha Khan',
      label: '🩺 Therapist (Dr. Aisha)',
      icon: Stethoscope,
      email: 'therapist@neurospectra.org',
      avatar_url: 'https://images.unsplash.com/photo-1594824813589-3221e5138137?auto=format&fit=crop&q=80&w=256',
    },
    {
      role: 'Receptionist',
      name: 'Sarah Jenkins',
      label: '📋 Receptionist (Sarah)',
      icon: ClipboardList,
      email: 'receptionist@neurospectra.org',
      avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256',
    },
    {
      role: 'Parent / Caregiver',
      name: 'Priya Sharma',
      label: '👨‍👩‍👧 Parent (Priya Sharma)',
      icon: Users,
      email: 'parent@neurospectra.org',
      avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256',
    },
    {
      role: 'Teacher',
      name: 'Marcus Brody',
      label: '🎓 Teacher (Marcus)',
      icon: GraduationCap,
      email: 'teacher@neurospectra.org',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
    },
  ];

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-white px-4 py-2 flex items-center justify-between text-xs sticky top-0 z-50 overflow-x-auto shadow-md">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px] mr-1 hidden sm:inline">
          Live Clinical Switcher:
        </span>
        {personas.map((p) => {
          const isActive = role === p.role;
          return (
            <button
              key={p.role}
              onClick={() => switchDemoRole(p.role, p)}
              className={`px-3 py-1 rounded-full font-semibold transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 pl-4">
        <Link
          to="/"
          className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors flex items-center gap-1.5"
        >
          <Globe className="w-3.5 h-3.5 text-rose-400" />
          <span>Public Landing Page</span>
        </Link>
      </div>
    </div>
  );
};
