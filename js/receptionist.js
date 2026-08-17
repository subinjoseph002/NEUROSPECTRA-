/**
 * NEUROSPECTRA - Receptionist Dashboard & Scheduling Portal
 */

window.renderReceptionistDashboard = function() {
  const children = window.neuroDB.getChildren();
  const appointments = window.neuroDB.getAppointments();
  const therapists = window.neuroDB.getUsers().filter(u => u.role === 'Therapist' && u.is_active);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayApts = appointments.filter(a => a.appointment_date === todayStr);

  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">Reception & Intake Management</h1>
        <p class="page-subtitle">Patient onboarding, clinical appointment scheduling, daily roster, and reminder dispatching.</p>
      </div>
      <div style="display: flex; gap: 10px; flex-wrap: wrap;">
        <button class="btn btn-primary" onclick="window.showRegisterChildModal()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/><line x1="19" y1="11" x2="19" y2="17"/><line x1="22" y1="14" x2="16" y2="14"/></svg>
          Register New Child
        </button>
        <button class="btn btn-accent" onclick="window.showBookAppointmentModal()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="12" y1="14" x2="12" y2="18"/><line x1="10" y1="16" x2="14" y2="16"/></svg>
          Book Appointment
        </button>
      </div>
    </div>

    <!-- Stat Cards -->
    <div class="grid-4" style="margin-bottom: 24px;">
      <div class="stat-card amber">
        <div>
          <div class="stat-label">Today's Visits</div>
          <div class="stat-value">${todayApts.length}</div>
          <div class="stat-subtext">Clinical consultations & therapy</div>
        </div>
        <div class="stat-icon-wrapper">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        </div>
      </div>

      <div class="stat-card cyan">
        <div>
          <div class="stat-label">Available Therapists</div>
          <div class="stat-value">${therapists.length}</div>
          <div class="stat-subtext">Licensed practitioners on duty</div>
        </div>
        <div class="stat-icon-wrapper">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
        </div>
      </div>

      <div class="stat-card emerald">
        <div>
          <div class="stat-label">Registered Children</div>
          <div class="stat-value">${children.length}</div>
          <div class="stat-subtext">Total active clinic files</div>
        </div>
        <div class="stat-icon-wrapper">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
        </div>
      </div>

      <div class="stat-card">
        <div>
          <div class="stat-label">Total Bookings</div>
          <div class="stat-value">${appointments.length}</div>
          <div class="stat-subtext">${appointments.filter(a => a.status === 'Confirmed').length} Confirmed in system</div>
        </div>
        <div class="stat-icon-wrapper">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
      </div>
    </div>

    <!-- Appointment Management Table -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary-600)" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          Appointment Master Schedule
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-outline btn-sm" onclick="window.sendBatchReminders()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            Send Today's Reminders
          </button>
          <button class="btn btn-primary btn-sm" onclick="window.showBookAppointmentModal()">+ Book Appointment</button>
        </div>
      </div>

      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Child Name</th>
              <th>Therapist</th>
              <th>Session Type</th>
              <th>Status</th>
              <th>Reminder</th>
              <th style="text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${appointments.map(apt => {
              const child = window.neuroDB.getChildById(apt.child_id);
              const therapist = window.neuroDB.getUserById(apt.therapist_id);
              return `
                <tr>
                  <td>
                    <div style="font-weight: 700; color: var(--slate-900); font-size: 13px;">${apt.appointment_date}</div>
                    <div style="font-size: 11.5px; color: var(--primary-600); font-weight: 600;">${apt.start_time} - ${apt.end_time}</div>
                  </td>
                  <td>
                    ${child ? `
                      <div style="font-weight: 700; color: var(--slate-900); font-size: 13px;">${child.first_name} ${child.last_name}</div>
                      <div style="font-size: 11.5px; color: var(--slate-500); font-family: 'JetBrains Mono', monospace;">${child.child_code}</div>
                    ` : 'Unknown Child'}
                  </td>
                  <td>
                    <div style="font-size: 13px; font-weight: 600; color: var(--slate-800);">${therapist ? therapist.full_name : 'Unassigned'}</div>
                  </td>
                  <td style="font-size: 12.5px; color: var(--slate-600);">${apt.type}</td>
                  <td>
                    <span class="badge ${apt.status === 'Confirmed' ? 'badge-confirmed' : apt.status === 'Scheduled' ? 'badge-scheduled' : apt.status === 'Completed' ? 'badge-completed' : 'badge-danger'}">
                      ${apt.status}
                    </span>
                  </td>
                  <td>
                    <span class="badge ${apt.reminder_sent ? 'badge-success' : 'badge-neutral'}">
                      ${apt.reminder_sent ? 'Sent' : 'Pending'}
                    </span>
                  </td>
                  <td style="text-align: right;">
                    <div style="display: inline-flex; gap: 4px;">
                      <button class="btn btn-outline btn-sm" onclick="window.showRescheduleModal('${apt.id}')">Reschedule</button>
                      <button class="btn btn-outline btn-sm" style="color: var(--danger-500);" onclick="window.cancelAppointment('${apt.id}')">Cancel</button>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
};
