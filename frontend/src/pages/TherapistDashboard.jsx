import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { ClipboardCheck, Baby, Activity, Calendar, FileText, ChevronRight, CheckCircle2 } from 'lucide-react';

export const TherapistDashboard = () => {
  const [activeTab, setActiveTab] = useState('assigned');

  const assignedChildren = [
    { id: 'ch_101', code: 'NS-2026-0101', name: 'Aarav Sharma', age: '3 yrs 4 mos', parent: 'Priya Sharma', lastScore: '1 (Low Risk)', nextSession: 'Today, 10:00 AM' },
    { id: 'ch_102', code: 'NS-2026-0102', name: 'Liam Miller', age: '3 yrs 11 mos', parent: 'David Miller', lastScore: '4 (Medium Risk)', nextSession: 'Today, 11:30 AM' },
    { id: 'ch_104', code: 'NS-2026-0104', name: 'Noah Patel', age: '4 yrs 6 mos', parent: 'Anita Patel', lastScore: '2 (Low Risk)', nextSession: 'Tomorrow, 02:00 PM' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Therapist Clinical Dashboard" />

        <main className="p-8 max-w-7xl w-full mx-auto space-y-8">
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="relative z-10 max-w-xl space-y-2">
              <span className="px-3 py-1 bg-blue-500/30 text-blue-200 text-xs font-bold rounded-full border border-blue-400/30">
                Dr. Aisha Khan, Ph.D., BCBA-D
              </span>
              <h2 className="text-2xl font-extrabold tracking-tight">Active Clinical Interventions</h2>
              <p className="text-xs text-blue-200 leading-relaxed">
                Supervising 3 pediatric cases with personalized M-CHAT-R/F screening evaluations, sensory integration therapy, and speech milestones.
              </p>
            </div>
          </div>

          {/* Children Roster */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Assigned Pediatric Cases</h3>
                <p className="text-xs text-slate-500">Children under active clinical supervision and therapy formulations</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {assignedChildren.map((child) => (
                <div key={child.id} className="p-5 rounded-xl border border-slate-200 hover:border-blue-500 transition-all bg-white hover:shadow-md space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                      {child.name.charAt(0)}
                    </div>
                    <span className="text-[11px] font-bold text-slate-400">{child.code}</span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">{child.name}</h4>
                    <div className="text-xs text-slate-500">{child.age} • Parent: {child.parent}</div>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-lg text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">M-CHAT Score:</span>
                      <span className="font-bold text-slate-800">{child.lastScore}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Next Session:</span>
                      <span className="font-bold text-blue-600">{child.nextSession}</span>
                    </div>
                  </div>

                  <button className="w-full py-2 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1">
                    <span>Clinical Profile</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};
