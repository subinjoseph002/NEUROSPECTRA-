import React from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Calendar, Baby, Clock, CheckCircle2, Plus } from 'lucide-react';

export const ReceptionistDashboard = () => {
  const appointments = [
    { id: '1', time: '10:00 AM', child: 'Aarav Sharma', therapist: 'Dr. Aisha Khan', type: 'Occupational Therapy', status: 'Confirmed' },
    { id: '2', time: '11:30 AM', child: 'Liam Miller', therapist: 'Dr. Aisha Khan', type: 'Speech & Language Therapy', status: 'Confirmed' },
    { id: '3', time: '02:00 PM', child: 'Maya Chen', therapist: 'Dr. Marcus Vance', type: 'Initial Screening Assessment', status: 'Confirmed' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Reception & Clinical Intake" />

        <main className="p-8 max-w-7xl w-full mx-auto space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Today's Appointments & Intake</h2>
              <p className="text-xs text-slate-500 mt-1">Manage parent arrivals, screening sessions, and clinician calendar schedule.</p>
            </div>
            <button className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-md flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Scheduled Sessions (August 15, 2026)</h3>
            <div className="divide-y divide-slate-100">
              {appointments.map((appt) => (
                <div key={appt.id} className="py-4 flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex flex-col items-center justify-center font-bold text-xs flex-shrink-0">
                      <Clock className="w-4 h-4 mb-0.5" />
                      <span>{appt.time.split(' ')[0]}</span>
                    </div>
                    <div>
                      <div className="font-extrabold text-sm text-slate-900">{appt.child}</div>
                      <div className="text-xs text-slate-500">{appt.type} • {appt.therapist}</div>
                    </div>
                  </div>

                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-full flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{appt.status}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};
