import React from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Baby, Activity, Calendar, FileText, CheckCircle2, Clock } from 'lucide-react';

export const ParentDashboard = () => {
  // Static child profile for demo parent (Priya Sharma -> Aarav Sharma)
  const child = {
    first_name: 'Aarav',
    last_name: 'Sharma',
    child_code: 'NS-2026-0101',
    age_months: 40,
    dob: '2023-04-15',
    status: 'Active',
    therapist: {
      name: 'Dr. Aisha Khan, Ph.D.',
      email: 'therapist@neurospectra.org',
      phone: '+91 98451 89234',
    },
    appointments: [
      { id: '1', date: 'August 18, 2026', time: '10:00 AM', type: 'Occupational Therapy (Sensory Room)', status: 'Confirmed' },
      { id: '2', date: 'August 22, 2026', time: '11:30 AM', type: 'Speech & Communication Therapy', status: 'Confirmed' },
    ],
  };

  const handleDownloadReport = () => {
    window.print();
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Caregiver & Parent Portal" />

        <main className="p-8 max-w-7xl w-full mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Parent / Caregiver Portal</h2>
              <p className="text-xs text-slate-500 mt-1">
                Viewing schedule, therapy milestones, and reports for <strong>{child.first_name} {child.last_name}</strong>.
              </p>
            </div>
            <button
              onClick={handleDownloadReport}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-md flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>Download Progress Report</span>
            </button>
          </div>

          {/* Child Card Header with Read-Only Assigned Specialist */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-blue-950 text-white p-8 rounded-2xl shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center font-black text-2xl shadow-md">
                {child.first_name.charAt(0)}
              </div>
              <div className="space-y-1">
                <span className="px-3 py-0.5 bg-emerald-500/20 text-emerald-300 text-[11px] font-bold rounded-full border border-emerald-400/30">
                  Primary Case: {child.child_code}
                </span>
                <h2 className="text-2xl font-extrabold tracking-tight">{child.first_name} {child.last_name}</h2>
                <div className="text-xs text-slate-300 font-medium">
                  {child.age_months} Months old • DOB: {child.dob}
                </div>
              </div>
            </div>

            {/* Read-Only Specialist Card (No Edit / Deactivate Controls) */}
            <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 text-xs space-y-1 text-right">
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Assigned Specialist (Read-Only)</div>
              <div className="text-sm font-extrabold text-blue-300">{child.therapist.name}</div>
              <div className="text-slate-400 text-[11px]">{child.therapist.email} • {child.therapist.phone}</div>
            </div>
          </div>

          {/* Content Grid: Schedule & Milestones */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Child's Schedule & Appointments */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <h3 className="text-base font-extrabold text-slate-900">Child's Clinical Schedule</h3>
                </div>
                <span className="text-xs font-bold text-slate-500">{child.appointments.length} Upcoming</span>
              </div>

              <div className="space-y-3">
                {child.appointments.map((appt) => (
                  <div key={appt.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-extrabold text-sm text-slate-900">{appt.date} at {appt.time}</div>
                        <div className="text-xs text-slate-500">{appt.type}</div>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                      {appt.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Child's Active Therapy Milestones */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-base font-extrabold text-slate-900">Therapy Milestones (IEP)</h3>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">Active</span>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>Social Orientation & Eye Contact</span>
                    <span className="text-blue-600">82%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: '82%' }} />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>Communication & Vocal Imitation</span>
                    <span className="text-emerald-600">75%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: '75%' }} />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>Sensory Regulation</span>
                    <span className="text-purple-600">68%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-600 h-full rounded-full" style={{ width: '68%' }} />
                  </div>
                </div>
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
};
