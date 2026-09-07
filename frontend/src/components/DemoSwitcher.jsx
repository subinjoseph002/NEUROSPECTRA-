import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Shield, Stethoscope, ClipboardList, Users, GraduationCap, Globe } from 'lucide-react';
import { userApi } from '../api/userApi';

export const DemoSwitcher = () => {
  const { role, switchDemoRole } = useAuth();
  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await userApi.getUsers();
        if (Array.isArray(users) && users.length > 0) {
          setUsersList(users);
        }
      } catch (e) {}
    };
    fetchUsers();
  }, []);

  const findUserByRole = (targetRole, fallback) => {
    const matched = usersList.find(u => u.role === targetRole && (u.is_active === 1 || u.is_active === true || u.is_active === undefined));
    if (matched) return matched;
    return fallback;
  };

  const admin = findUserByRole('Administrator', { id: 'usr_admin_1', full_name: 'Dr. Eleanor Vance', email: 'admin@neurospectra.org', role: 'Administrator' });
  const therapist = findUserByRole('Therapist', { id: 'usr_therapist_1', full_name: 'Dr. Aisha Khan, Ph.D.', email: 'therapist@neurospectra.org', role: 'Therapist' });
  const receptionist = findUserByRole('Receptionist', { id: 'usr_receptionist_1', full_name: 'Sarah Jenkins', email: 'receptionist@neurospectra.org', role: 'Receptionist' });
  const parent = findUserByRole('Parent / Caregiver', { id: 'usr_parent_1', full_name: 'Priya Sharma', email: 'parent@neurospectra.org', role: 'Parent / Caregiver' });
  const teacher = findUserByRole('Teacher', { id: 'usr_teacher_1', full_name: 'Marcus Brody', email: 'teacher@neurospectra.org', role: 'Teacher' });

  const personas = [
    {
      role: 'Administrator',
      full_name: admin.full_name,
      label: '👑 Admin',
      icon: Shield,
      email: admin.email,
      avatar_url: admin.avatar_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
    },
    {
      role: 'Therapist',
      full_name: therapist.full_name,
      label: '🩺 Therapist',
      icon: Stethoscope,
      email: therapist.email,
      avatar_url: therapist.avatar_url || 'https://images.unsplash.com/photo-1594824813589-3221e5138137?auto=format&fit=crop&q=80&w=256',
    },
    {
      role: 'Receptionist',
      full_name: receptionist.full_name,
      label: '📋 Receptionist',
      icon: ClipboardList,
      email: receptionist.email,
      avatar_url: receptionist.avatar_url || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256',
    },
    {
      role: 'Parent / Caregiver',
      full_name: parent.full_name,
      label: '👨‍👩‍👧 Parent',
      icon: Users,
      email: parent.email,
      avatar_url: parent.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256',
    },
    {
      role: 'Teacher',
      full_name: teacher.full_name,
      label: '🎓 Teacher',
      icon: GraduationCap,
      email: teacher.email,
      avatar_url: teacher.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
    },
  ];

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-white px-3 py-1 flex items-center justify-between text-[11px] sticky top-0 z-50 overflow-x-auto shadow-sm min-h-[28px]">
      <div className="flex items-center gap-1.5 flex-nowrap">
        <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mr-1 hidden sm:inline">
          Switch Role:
        </span>
        {personas.map((p) => {
          const isActive = role === p.role;
          return (
            <button
              key={p.role}
              onClick={() => switchDemoRole(p.role, p)}
              className={`px-2 py-0.5 rounded-full font-semibold transition-all flex items-center gap-1 text-[10.5px] ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-1.5 pl-3">
        <Link
          to="/"
          className="px-2 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors flex items-center gap-1 text-[10.5px]"
        >
          <Globe className="w-3 h-3 text-rose-400" />
          <span>Landing</span>
        </Link>
      </div>
    </div>
  );
};
