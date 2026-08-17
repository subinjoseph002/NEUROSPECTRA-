import React from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { GraduationCap, Users, FileText, CheckCircle2 } from 'lucide-react';

export const TeacherDashboard = () => {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Special Educator & Teacher Portal" />

        <main className="p-8 max-w-7xl w-full mx-auto space-y-8">
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-extrabold tracking-tight">Classroom Behavioral Alignment</h2>
            <p className="text-xs text-amber-100 mt-1 max-w-xl leading-relaxed">
              Synchronize IEP objectives, classroom sensory accommodations, and peer interactions directly with clinical therapists.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Enrolled Students under IEP Plans</h3>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-extrabold text-sm text-slate-900">Aarav Sharma (NS-2026-0101)</div>
                <div className="text-xs text-slate-500">Accommodation: Visual transition cards & noise-canceling earmuffs</div>
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                IEP Active
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
