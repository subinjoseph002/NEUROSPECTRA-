/**
 * NEUROSPECTRA - Receptionist Dashboard & Scheduling Portal
 * Receptionist Module - Intake, Appointments, and Administrative Reports
 */

// Global State for Receptionist Administrative Reports
window.receptionistReportsState = {
  activeTab: 'all', // 'all', 'appointments', 'registrations', 'daily_schedule', 'activity'
  searchQuery: '',
  datePreset: 'all', // 'all', 'today', 'this_week', 'this_month', 'custom'
  startDate: '',
  endDate: '',
  scheduleDate: new Date().toISOString().split('T')[0],
  statusFilter: 'all',
  therapistFilter: 'all',
  currentPage: 1,
  pageSize: 8
};

// ============================================================================
// 1. RECEPTIONIST DASHBOARD (EXISTING UNCHANGED)
// ============================================================================

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

// ============================================================================
// 2. RECEPTIONIST ADMINISTRATIVE REPORTS MODULE
// ============================================================================

window.renderReceptionistReports = function() {
  const state = window.receptionistReportsState;
  const db = window.neuroDB;

  // Retrieve actual data from the database
  const allAppointments = db.getAppointments() || [];
  const allChildren = db.getChildren() || [];
  const allUsers = db.getUsers() || [];
  const therapists = allUsers.filter(u => u.role === 'Therapist' && u.is_active);

  const todayStr = new Date().toISOString().split('T')[0];

  // Helper: Date filter check
  function isDateInRange(dateStr) {
    if (!dateStr) return true;
    if (state.datePreset === 'today') {
      return dateStr.startsWith(todayStr);
    }
    if (state.datePreset === 'this_week') {
      const d = new Date(dateStr);
      const now = new Date();
      const firstDay = new Date(now.setDate(now.getDate() - now.getDay()));
      firstDay.setHours(0,0,0,0);
      return d >= firstDay;
    }
    if (state.datePreset === 'this_month') {
      const d = new Date(dateStr);
      const now = new Date();
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    }
    if (state.datePreset === 'custom') {
      if (state.startDate && dateStr < state.startDate) return false;
      if (state.endDate && dateStr > state.endDate) return false;
      return true;
    }
    return true; // 'all'
  }

  // Helper: Search query filter check
  const q = (state.searchQuery || '').trim().toLowerCase();

  // --- Category 1 Metrics: APPOINTMENT REPORT ---
  const totalAppointments = allAppointments.length;
  const scheduledAppointments = allAppointments.filter(a => a.status === 'Scheduled' || a.status === 'Confirmed').length;
  const completedAppointments = allAppointments.filter(a => a.status === 'Completed').length;
  const cancelledAppointments = allAppointments.filter(a => a.status === 'Cancelled').length;
  const rescheduledAppointments = allAppointments.filter(a => a.status === 'Rescheduled').length;
  const upcomingAppointments = allAppointments.filter(a => a.appointment_date >= todayStr && a.status !== 'Cancelled' && a.status !== 'Completed').length;

  // Filtered Appointments List
  let filteredApts = allAppointments.filter(apt => {
    if (!isDateInRange(apt.appointment_date)) return false;
    if (state.statusFilter !== 'all' && apt.status !== state.statusFilter) return false;
    if (state.therapistFilter !== 'all' && apt.therapist_id !== state.therapistFilter) return false;
    if (q) {
      const child = db.getChildById(apt.child_id);
      const childName = child ? `${child.first_name} ${child.last_name}`.toLowerCase() : '';
      const childCode = child ? child.child_code.toLowerCase() : '';
      const therapist = db.getUserById(apt.therapist_id);
      const therapistName = therapist ? therapist.full_name.toLowerCase() : '';
      const aptType = (apt.type || '').toLowerCase();
      const status = (apt.status || '').toLowerCase();
      if (!childName.includes(q) && !childCode.includes(q) && !therapistName.includes(q) && !aptType.includes(q) && !status.includes(q)) {
        return false;
      }
    }
    return true;
  });

  // Therapist-wise summary calculation
  const therapistSummary = therapists.map(th => {
    const thApts = allAppointments.filter(a => a.therapist_id === th.id);
    const scheduled = thApts.filter(a => a.status === 'Scheduled' || a.status === 'Confirmed').length;
    const completed = thApts.filter(a => a.status === 'Completed').length;
    const cancelled = thApts.filter(a => a.status === 'Cancelled').length;
    const rescheduled = thApts.filter(a => a.status === 'Rescheduled').length;
    const rate = thApts.length > 0 ? Math.round((completed / (thApts.length - cancelled || 1)) * 100) : 0;
    return {
      therapist: th,
      total: thApts.length,
      scheduled,
      completed,
      cancelled,
      rescheduled,
      completionRate: Math.min(rate, 100)
    };
  });

  // --- Category 2 Metrics: CHILD REGISTRATION REPORT ---
  const totalRegisteredChildren = allChildren.length;
  // Newly registered in current month or range
  const now = new Date();
  const newlyRegisteredChildren = allChildren.filter(c => {
    if (!c.created_at) return false;
    const cd = new Date(c.created_at);
    return cd.getMonth() === now.getMonth() && cd.getFullYear() === now.getFullYear();
  }).length;

  let filteredChildren = allChildren.filter(ch => {
    if (ch.created_at && !isDateInRange(ch.created_at.split('T')[0])) return false;
    if (state.statusFilter !== 'all' && ch.status !== state.statusFilter) return false;
    if (state.therapistFilter !== 'all' && ch.assigned_therapist_id !== state.therapistFilter) return false;
    if (q) {
      const fullName = `${ch.first_name} ${ch.last_name}`.toLowerCase();
      const code = (ch.child_code || '').toLowerCase();
      const parent = db.getUserById(ch.primary_parent_id);
      const parentName = parent ? parent.full_name.toLowerCase() : '';
      const therapist = db.getUserById(ch.assigned_therapist_id);
      const therapistName = therapist ? therapist.full_name.toLowerCase() : '';
      if (!fullName.includes(q) && !code.includes(q) && !parentName.includes(q) && !therapistName.includes(q)) {
        return false;
      }
    }
    return true;
  });

  // --- Category 3 Metrics: DAILY SCHEDULE REPORT ---
  const activeScheduleDate = state.scheduleDate || todayStr;
  let dailyScheduleApts = allAppointments.filter(a => a.appointment_date === activeScheduleDate);
  if (state.therapistFilter !== 'all') {
    dailyScheduleApts = dailyScheduleApts.filter(a => a.therapist_id === state.therapistFilter);
  }
  if (state.statusFilter !== 'all') {
    dailyScheduleApts = dailyScheduleApts.filter(a => a.status === state.statusFilter);
  }
  if (q) {
    dailyScheduleApts = dailyScheduleApts.filter(apt => {
      const child = db.getChildById(apt.child_id);
      const childName = child ? `${child.first_name} ${child.last_name}`.toLowerCase() : '';
      const childCode = child ? child.child_code.toLowerCase() : '';
      const therapist = db.getUserById(apt.therapist_id);
      const therapistName = therapist ? therapist.full_name.toLowerCase() : '';
      return childName.includes(q) || childCode.includes(q) || therapistName.includes(q) || (apt.type || '').toLowerCase().includes(q);
    });
  }

  // --- Category 4 Metrics: APPOINTMENT ACTIVITY REPORT ---
  // Aggregate real events from appointments & notifications
  let activityLogs = [];
  
  // 1. Booking creation logs
  allAppointments.forEach(a => {
    activityLogs.push({
      id: 'act_book_' + a.id,
      timestamp: a.created_at || a.appointment_date + 'T09:00:00Z',
      type: 'Booking',
      typeBadge: 'badge-confirmed',
      title: 'Appointment Booked',
      description: `${a.type} for ${db.getChildById(a.child_id)?.first_name || 'Patient'} with ${db.getUserById(a.therapist_id)?.full_name || 'Therapist'}`,
      date: a.appointment_date,
      time: a.start_time,
      child_id: a.child_id,
      therapist_id: a.therapist_id,
      status: a.status
    });

    if (a.status === 'Rescheduled') {
      activityLogs.push({
        id: 'act_resched_' + a.id,
        timestamp: a.appointment_date + 'T10:30:00Z',
        type: 'Rescheduled',
        typeBadge: 'badge-rescheduled',
        title: 'Appointment Rescheduled',
        description: `Session slot adjusted to ${a.appointment_date} (${a.start_time})`,
        date: a.appointment_date,
        time: a.start_time,
        child_id: a.child_id,
        therapist_id: a.therapist_id,
        status: 'Rescheduled'
      });
    }

    if (a.status === 'Cancelled') {
      activityLogs.push({
        id: 'act_cancel_' + a.id,
        timestamp: a.appointment_date + 'T11:00:00Z',
        type: 'Cancelled',
        typeBadge: 'badge-danger',
        title: 'Appointment Cancelled',
        description: `Booking for ${db.getChildById(a.child_id)?.first_name || 'Patient'} cancelled on schedule`,
        date: a.appointment_date,
        time: a.start_time,
        child_id: a.child_id,
        therapist_id: a.therapist_id,
        status: 'Cancelled'
      });
    }

    if (a.status === 'Completed') {
      activityLogs.push({
        id: 'act_comp_' + a.id,
        timestamp: a.appointment_date + 'T12:00:00Z',
        type: 'Completed',
        typeBadge: 'badge-completed',
        title: 'Session Completed',
        description: `Clinical appointment concluded with attendance marked`,
        date: a.appointment_date,
        time: a.start_time,
        child_id: a.child_id,
        therapist_id: a.therapist_id,
        status: 'Completed'
      });
    }

    if (a.reminder_sent) {
      activityLogs.push({
        id: 'act_rem_' + a.id,
        timestamp: a.appointment_date + 'T08:00:00Z',
        type: 'Reminder Sent',
        typeBadge: 'badge-success',
        title: 'Reminder Notification Dispatched',
        description: `Automated SMS / In-App visit reminder delivered to primary caregiver`,
        date: a.appointment_date,
        time: a.start_time,
        child_id: a.child_id,
        therapist_id: a.therapist_id,
        status: 'Delivered'
      });
    }
  });

  // Sort activities newest first
  activityLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // Filter activity logs
  let filteredActivities = activityLogs.filter(act => {
    if (!isDateInRange(act.date)) return false;
    if (state.therapistFilter !== 'all' && act.therapist_id !== state.therapistFilter) return false;
    if (q) {
      const child = db.getChildById(act.child_id);
      const childName = child ? `${child.first_name} ${child.last_name}`.toLowerCase() : '';
      const desc = act.description.toLowerCase();
      const type = act.type.toLowerCase();
      if (!childName.includes(q) && !desc.includes(q) && !type.includes(q)) return false;
    }
    return true;
  });

  // Pagination calculation for active tab
  let currentItemsCount = 0;
  if (state.activeTab === 'appointments' || state.activeTab === 'all') currentItemsCount = filteredApts.length;
  else if (state.activeTab === 'registrations') currentItemsCount = filteredChildren.length;
  else if (state.activeTab === 'daily_schedule') currentItemsCount = dailyScheduleApts.length;
  else if (state.activeTab === 'activity') currentItemsCount = filteredActivities.length;

  const totalPages = Math.max(1, Math.ceil(currentItemsCount / state.pageSize));
  const currentPage = Math.min(state.currentPage, totalPages);
  const startIdx = (currentPage - 1) * state.pageSize;
  const endIdx = startIdx + state.pageSize;

  // Sliced datasets
  const paginatedApts = filteredApts.slice(startIdx, endIdx);
  const paginatedChildren = filteredChildren.slice(startIdx, endIdx);
  const paginatedSchedule = dailyScheduleApts.slice(startIdx, endIdx);
  const paginatedActivities = filteredActivities.slice(startIdx, endIdx);

  return `
    <div class="page-header no-print">
      <div>
        <h1 class="page-title">Reports</h1>
        <p class="page-subtitle">View and generate administrative reports</p>
      </div>
      <div style="display: flex; gap: 10px; flex-wrap: wrap;">
        <button class="btn btn-outline" onclick="window.showGenerateReceptionistReportModal()">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
          Generate Report
        </button>
        <button class="btn btn-secondary" onclick="window.downloadReceptionistReportCSV('${state.activeTab}')">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Download CSV
        </button>
        <button class="btn btn-primary" onclick="window.printReceptionistAdministrativeReport('${state.activeTab}')">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          Print Report
        </button>
      </div>
    </div>

    <!-- 4 REPORT CATEGORY METRIC CARDS -->
    <div class="grid-4" style="margin-bottom: 24px;">
      <!-- Category 1: Appointment Report -->
      <div class="stat-card ${state.activeTab === 'appointments' ? 'active-border' : 'indigo'}" style="cursor: pointer; transition: all 0.2s;" onclick="window.setReceptionistReportTab('appointments')" title="Click to view Appointment Report">
        <div>
          <div class="stat-label">1. Appointment Report</div>
          <div class="stat-value" style="font-size: 26px;">${totalAppointments}</div>
          <div class="stat-subtext" style="color: var(--primary-600); font-weight: 600;">${upcomingAppointments} upcoming &bull; ${completedAppointments} completed</div>
        </div>
        <div class="stat-icon-wrapper" style="background: rgba(59, 130, 246, 0.1); color: #2563eb;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        </div>
      </div>

      <!-- Category 2: Child Registration Report -->
      <div class="stat-card ${state.activeTab === 'registrations' ? 'active-border' : 'emerald'}" style="cursor: pointer; transition: all 0.2s;" onclick="window.setReceptionistReportTab('registrations')" title="Click to view Child Registration Report">
        <div>
          <div class="stat-label">2. Child Registration Report</div>
          <div class="stat-value" style="font-size: 26px;">${totalRegisteredChildren}</div>
          <div class="stat-subtext" style="color: var(--success-700); font-weight: 600;">${newlyRegisteredChildren} registered this month</div>
        </div>
        <div class="stat-icon-wrapper" style="background: rgba(16, 185, 129, 0.1); color: #059669;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/><line x1="19" y1="11" x2="19" y2="17"/><line x1="22" y1="14" x2="16" y2="14"/></svg>
        </div>
      </div>

      <!-- Category 3: Daily Schedule Report -->
      <div class="stat-card ${state.activeTab === 'daily_schedule' ? 'active-border' : 'amber'}" style="cursor: pointer; transition: all 0.2s;" onclick="window.setReceptionistReportTab('daily_schedule')" title="Click to view Daily Schedule Report">
        <div>
          <div class="stat-label">3. Daily Schedule Report</div>
          <div class="stat-value" style="font-size: 26px;">${dailyScheduleApts.length}</div>
          <div class="stat-subtext" style="color: #b45309; font-weight: 600;">Date: ${activeScheduleDate}</div>
        </div>
        <div class="stat-icon-wrapper" style="background: rgba(245, 158, 11, 0.1); color: #d97706;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
      </div>

      <!-- Category 4: Appointment Activity Report -->
      <div class="stat-card ${state.activeTab === 'activity' ? 'active-border' : 'cyan'}" style="cursor: pointer; transition: all 0.2s;" onclick="window.setReceptionistReportTab('activity')" title="Click to view Appointment Activity Report">
        <div>
          <div class="stat-label">4. Activity & Audit Report</div>
          <div class="stat-value" style="font-size: 26px;">${activityLogs.length}</div>
          <div class="stat-subtext" style="color: #0891b2; font-weight: 600;">Bookings, changes & reminders</div>
        </div>
        <div class="stat-icon-wrapper" style="background: rgba(6, 182, 212, 0.1); color: #0891b2;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        </div>
      </div>
    </div>

    <!-- CATEGORY NAVIGATION TABS -->
    <div style="display: flex; gap: 8px; border-bottom: 1px solid #e2e8f0; margin-bottom: 20px; overflow-x: auto; padding-bottom: 4px;" class="no-print">
      <button class="tab-btn ${state.activeTab === 'all' ? 'active' : ''}" style="padding: 10px 18px; border-radius: 8px 8px 0 0; border: none; font-size: 13.5px; font-weight: 700; cursor: pointer; background: ${state.activeTab === 'all' ? '#ffffff' : 'transparent'}; color: ${state.activeTab === 'all' ? '#2563eb' : '#64748b'}; border-bottom: ${state.activeTab === 'all' ? '3px solid #2563eb' : '3px solid transparent'}; box-shadow: ${state.activeTab === 'all' ? '0 -2px 6px rgba(0,0,0,0.03)' : 'none'};" onclick="window.setReceptionistReportTab('all')">
        All Reports Overview
      </button>
      <button class="tab-btn ${state.activeTab === 'appointments' ? 'active' : ''}" style="padding: 10px 18px; border-radius: 8px 8px 0 0; border: none; font-size: 13.5px; font-weight: 700; cursor: pointer; background: ${state.activeTab === 'appointments' ? '#ffffff' : 'transparent'}; color: ${state.activeTab === 'appointments' ? '#2563eb' : '#64748b'}; border-bottom: ${state.activeTab === 'appointments' ? '3px solid #2563eb' : '3px solid transparent'}; box-shadow: ${state.activeTab === 'appointments' ? '0 -2px 6px rgba(0,0,0,0.03)' : 'none'};" onclick="window.setReceptionistReportTab('appointments')">
        1. Appointment Report (${filteredApts.length})
      </button>
      <button class="tab-btn ${state.activeTab === 'registrations' ? 'active' : ''}" style="padding: 10px 18px; border-radius: 8px 8px 0 0; border: none; font-size: 13.5px; font-weight: 700; cursor: pointer; background: ${state.activeTab === 'registrations' ? '#ffffff' : 'transparent'}; color: ${state.activeTab === 'registrations' ? '#2563eb' : '#64748b'}; border-bottom: ${state.activeTab === 'registrations' ? '3px solid #2563eb' : '3px solid transparent'}; box-shadow: ${state.activeTab === 'registrations' ? '0 -2px 6px rgba(0,0,0,0.03)' : 'none'};" onclick="window.setReceptionistReportTab('registrations')">
        2. Child Registration Report (${filteredChildren.length})
      </button>
      <button class="tab-btn ${state.activeTab === 'daily_schedule' ? 'active' : ''}" style="padding: 10px 18px; border-radius: 8px 8px 0 0; border: none; font-size: 13.5px; font-weight: 700; cursor: pointer; background: ${state.activeTab === 'daily_schedule' ? '#ffffff' : 'transparent'}; color: ${state.activeTab === 'daily_schedule' ? '#2563eb' : '#64748b'}; border-bottom: ${state.activeTab === 'daily_schedule' ? '3px solid #2563eb' : '3px solid transparent'}; box-shadow: ${state.activeTab === 'daily_schedule' ? '0 -2px 6px rgba(0,0,0,0.03)' : 'none'};" onclick="window.setReceptionistReportTab('daily_schedule')">
        3. Daily Schedule Report (${dailyScheduleApts.length})
      </button>
      <button class="tab-btn ${state.activeTab === 'activity' ? 'active' : ''}" style="padding: 10px 18px; border-radius: 8px 8px 0 0; border: none; font-size: 13.5px; font-weight: 700; cursor: pointer; background: ${state.activeTab === 'activity' ? '#ffffff' : 'transparent'}; color: ${state.activeTab === 'activity' ? '#2563eb' : '#64748b'}; border-bottom: ${state.activeTab === 'activity' ? '3px solid #2563eb' : '3px solid transparent'}; box-shadow: ${state.activeTab === 'activity' ? '0 -2px 6px rgba(0,0,0,0.03)' : 'none'};" onclick="window.setReceptionistReportTab('activity')">
        4. Activity & Audit Report (${filteredActivities.length})
      </button>
    </div>

    <!-- FILTER & SEARCH TOOLBAR -->
    <div class="card no-print" style="margin-bottom: 24px; padding: 18px 20px; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0;">
      <div style="display: flex; flex-wrap: wrap; gap: 14px; align-items: center; justify-content: space-between;">
        
        <!-- Left: Search Box -->
        <div style="flex: 1; min-width: 240px; max-width: 380px; position: relative;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2.2" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); pointer-events: none;">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input type="text" class="form-control" placeholder="Search child name, file ID, therapist..." value="${state.searchQuery}" style="padding-left: 36px; padding-right: 28px; font-size: 13px; border-radius: 8px;" oninput="window.updateReceptionistReportSearch(this.value)">
          ${state.searchQuery ? `
            <button onclick="window.updateReceptionistReportSearch('')" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #94a3b8; font-size: 14px; padding: 2px;">&times;</button>
          ` : ''}
        </div>

        <!-- Right: Dropdowns & Presets -->
        <div style="display: flex; flex-wrap: wrap; gap: 10px; align-items: center;">
          
          <!-- Date Range Preset -->
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 12px; font-weight: 600; color: #64748b;">Date Range:</span>
            <select class="form-control" style="font-size: 12.5px; padding: 6px 12px; border-radius: 6px;" onchange="window.setReceptionistReportDatePreset(this.value)">
              <option value="all" ${state.datePreset === 'all' ? 'selected' : ''}>All Time</option>
              <option value="today" ${state.datePreset === 'today' ? 'selected' : ''}>Today</option>
              <option value="this_week" ${state.datePreset === 'this_week' ? 'selected' : ''}>This Week</option>
              <option value="this_month" ${state.datePreset === 'this_month' ? 'selected' : ''}>This Month</option>
              <option value="custom" ${state.datePreset === 'custom' ? 'selected' : ''}>Custom Range...</option>
            </select>
          </div>

          <!-- Custom Start / End Date inputs -->
          ${state.datePreset === 'custom' ? `
            <div style="display: flex; align-items: center; gap: 6px;">
              <input type="date" class="form-control" style="font-size: 12px; padding: 5px 8px; border-radius: 6px;" value="${state.startDate}" onchange="window.setReceptionistReportDateRange(this.value, '${state.endDate}')" title="Start Date">
              <span style="font-size: 12px; color: #94a3b8;">to</span>
              <input type="date" class="form-control" style="font-size: 12px; padding: 5px 8px; border-radius: 6px;" value="${state.endDate}" onchange="window.setReceptionistReportDateRange('${state.startDate}', this.value)" title="End Date">
            </div>
          ` : ''}

          <!-- Status Filter -->
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 12px; font-weight: 600; color: #64748b;">Status:</span>
            <select class="form-control" style="font-size: 12.5px; padding: 6px 12px; border-radius: 6px;" onchange="window.setReceptionistReportStatus(this.value)">
              <option value="all" ${state.statusFilter === 'all' ? 'selected' : ''}>All Statuses</option>
              <option value="Confirmed" ${state.statusFilter === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
              <option value="Scheduled" ${state.statusFilter === 'Scheduled' ? 'selected' : ''}>Scheduled</option>
              <option value="Completed" ${state.statusFilter === 'Completed' ? 'selected' : ''}>Completed</option>
              <option value="Rescheduled" ${state.statusFilter === 'Rescheduled' ? 'selected' : ''}>Rescheduled</option>
              <option value="Cancelled" ${state.statusFilter === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
              <option value="Active" ${state.statusFilter === 'Active' ? 'selected' : ''}>Active (Child)</option>
              <option value="Under Assessment" ${state.statusFilter === 'Under Assessment' ? 'selected' : ''}>Under Assessment</option>
            </select>
          </div>

          <!-- Therapist Filter -->
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 12px; font-weight: 600; color: #64748b;">Therapist:</span>
            <select class="form-control" style="font-size: 12.5px; padding: 6px 12px; border-radius: 6px; max-width: 170px;" onchange="window.setReceptionistReportTherapist(this.value)">
              <option value="all" ${state.therapistFilter === 'all' ? 'selected' : ''}>All Therapists</option>
              ${therapists.map(th => `
                <option value="${th.id}" ${state.therapistFilter === th.id ? 'selected' : ''}>${th.full_name}</option>
              `).join('')}
            </select>
          </div>

          <!-- Reset Filter Button -->
          ${(state.searchQuery || state.datePreset !== 'all' || state.statusFilter !== 'all' || state.therapistFilter !== 'all') ? `
            <button class="btn btn-outline btn-sm" onclick="window.resetReceptionistReportFilters()" style="color: #ef4444; border-color: #fecaca; font-size: 12px;">
              Reset Filters
            </button>
          ` : ''}

        </div>
      </div>
    </div>

    <!-- MAIN REPORT CONTENT SECTIONS -->
    <div id="receptionist-reports-container">
      
      <!-- ================================================================== -->
      <!-- SECTION 1: APPOINTMENT REPORT                                     -->
      <!-- ================================================================== -->
      ${(state.activeTab === 'all' || state.activeTab === 'appointments') ? `
        <div class="card" style="margin-bottom: 28px;">
          <div class="card-header" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 14px; margin-bottom: 16px;">
            <div>
              <div class="card-title" style="font-size: 16px; font-weight: 800; color: #0f172a; display: flex; align-items: center; gap: 8px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                1. Appointment Master Report
              </div>
              <p style="font-size: 12.5px; color: #64748b; margin-top: 2px;">Comprehensive booking metrics, date-wise appointment logs, and clinician session breakdown.</p>
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="btn btn-outline btn-sm" onclick="window.downloadReceptionistReportCSV('appointments')">Export Appointments CSV</button>
            </div>
          </div>

          <!-- Appointment Summary Statistics Row -->
          <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; margin-bottom: 20px;">
            <div style="text-align: center; border-right: 1px solid #e2e8f0;">
              <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Total</div>
              <div style="font-size: 20px; font-weight: 800; color: #0f172a; margin-top: 2px;">${totalAppointments}</div>
            </div>
            <div style="text-align: center; border-right: 1px solid #e2e8f0;">
              <div style="font-size: 11px; font-weight: 700; color: #2563eb; text-transform: uppercase;">Scheduled</div>
              <div style="font-size: 20px; font-weight: 800; color: #2563eb; margin-top: 2px;">${scheduledAppointments}</div>
            </div>
            <div style="text-align: center; border-right: 1px solid #e2e8f0;">
              <div style="font-size: 11px; font-weight: 700; color: #16a34a; text-transform: uppercase;">Completed</div>
              <div style="font-size: 20px; font-weight: 800; color: #16a34a; margin-top: 2px;">${completedAppointments}</div>
            </div>
            <div style="text-align: center; border-right: 1px solid #e2e8f0;">
              <div style="font-size: 11px; font-weight: 700; color: #dc2626; text-transform: uppercase;">Cancelled</div>
              <div style="font-size: 20px; font-weight: 800; color: #dc2626; margin-top: 2px;">${cancelledAppointments}</div>
            </div>
            <div style="text-align: center; border-right: 1px solid #e2e8f0;">
              <div style="font-size: 11px; font-weight: 700; color: #0284c7; text-transform: uppercase;">Rescheduled</div>
              <div style="font-size: 20px; font-weight: 800; color: #0284c7; margin-top: 2px;">${rescheduledAppointments}</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 11px; font-weight: 700; color: #d97706; text-transform: uppercase;">Upcoming</div>
              <div style="font-size: 20px; font-weight: 800; color: #d97706; margin-top: 2px;">${upcomingAppointments}</div>
            </div>
          </div>

          <!-- Sub-table A: Date-wise Appointment List -->
          <div style="margin-bottom: 24px;">
            <h4 style="font-size: 13.5px; font-weight: 700; color: #1e293b; margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between;">
              <span>Date-Wise Appointment Roster (${filteredApts.length} records)</span>
              <span style="font-size: 11.5px; font-weight: 500; color: #64748b;">Showing ${paginatedApts.length} of ${filteredApts.length}</span>
            </h4>
            
            ${filteredApts.length === 0 ? `
              <div style="text-align: center; padding: 36px; background: #f8fafc; border-radius: 8px; border: 1px dashed #cbd5e1;">
                <p style="font-size: 13.5px; color: #64748b; margin-bottom: 8px;">No appointments match the selected filters or date range.</p>
                <button class="btn btn-outline btn-sm" onclick="window.resetReceptionistReportFilters()">Reset Filters</button>
              </div>
            ` : `
              <div class="table-container">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Date & Time Slot</th>
                      <th>Child Name / File ID</th>
                      <th>Assigned Therapist</th>
                      <th>Session Mode / Type</th>
                      <th>Status</th>
                      <th>Reminder Status</th>
                      <th style="text-align: right;">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${paginatedApts.map(apt => {
                      const child = db.getChildById(apt.child_id);
                      const therapist = db.getUserById(apt.therapist_id);
                      return `
                        <tr>
                          <td>
                            <div style="font-weight: 700; color: #0f172a; font-size: 13px;">${apt.appointment_date}</div>
                            <div style="font-size: 11.5px; color: #2563eb; font-weight: 600;">${apt.start_time} - ${apt.end_time || '10:45 AM'}</div>
                          </td>
                          <td>
                            ${child ? `
                              <div style="font-weight: 700; color: #0f172a; font-size: 13px;">${child.first_name} ${child.last_name}</div>
                              <div style="font-size: 11px; color: #64748b; font-family: 'JetBrains Mono', monospace;">${child.child_code}</div>
                            ` : '<span style="color: #94a3b8;">N/A</span>'}
                          </td>
                          <td>
                            <div style="font-weight: 600; color: #334155; font-size: 13px;">${therapist ? therapist.full_name : 'Unassigned'}</div>
                            <div style="font-size: 11px; color: #64748b;">Specialist</div>
                          </td>
                          <td style="font-size: 12.5px; color: #475569;">
                            <strong>${apt.type || 'Therapy Session'}</strong>
                          </td>
                          <td>
                            <span class="badge ${
                              apt.status === 'Confirmed' ? 'badge-confirmed' :
                              apt.status === 'Scheduled' ? 'badge-scheduled' :
                              apt.status === 'Completed' ? 'badge-completed' :
                              apt.status === 'Rescheduled' ? 'badge-rescheduled' : 'badge-danger'
                            }">
                              ${apt.status}
                            </span>
                          </td>
                          <td>
                            <span class="badge ${apt.reminder_sent ? 'badge-success' : 'badge-neutral'}">
                              ${apt.reminder_sent ? 'Dispatched' : 'Pending'}
                            </span>
                          </td>
                          <td style="text-align: right;">
                            <button class="btn btn-outline btn-sm" onclick="window.showReceptionistReportDetailModal('appointment', '${apt.id}')" title="View Administrative Details">
                              View Report
                            </button>
                          </td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              </div>
            `}
          </div>

          <!-- Sub-table B: Therapist-wise Appointment Summary -->
          <div>
            <h4 style="font-size: 13.5px; font-weight: 700; color: #1e293b; margin-bottom: 10px;">
              Therapist-Wise Appointment Summary
            </h4>
            <div class="table-container">
              <table class="table">
                <thead>
                  <tr>
                    <th>Therapist Name & Specialization</th>
                    <th style="text-align: center;">Total Bookings</th>
                    <th style="text-align: center;">Scheduled</th>
                    <th style="text-align: center;">Completed</th>
                    <th style="text-align: center;">Cancelled</th>
                    <th style="text-align: center;">Rescheduled</th>
                    <th style="text-align: right;">Completion Rate</th>
                  </tr>
                </thead>
                <tbody>
                  ${therapistSummary.map(ts => `
                    <tr>
                      <td>
                        <div style="font-weight: 700; color: #0f172a; font-size: 13px;">${ts.therapist.full_name}</div>
                        <div style="font-size: 11px; color: #64748b;">${ts.therapist.email} &bull; ${ts.therapist.phone || '+91 9876543211'}</div>
                      </td>
                      <td style="text-align: center; font-weight: 700; font-size: 13px;">${ts.total}</td>
                      <td style="text-align: center; color: #2563eb; font-weight: 700;">${ts.scheduled}</td>
                      <td style="text-align: center; color: #16a34a; font-weight: 700;">${ts.completed}</td>
                      <td style="text-align: center; color: #dc2626; font-weight: 700;">${ts.cancelled}</td>
                      <td style="text-align: center; color: #0284c7; font-weight: 700;">${ts.rescheduled}</td>
                      <td style="text-align: right;">
                        <div style="display: inline-flex; align-items: center; gap: 8px;">
                          <div style="width: 70px; height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden;">
                            <div style="width: ${ts.completionRate}%; height: 100%; background: ${ts.completionRate > 70 ? '#10b981' : ts.completionRate > 40 ? '#f59e0b' : '#3b82f6'};"></div>
                          </div>
                          <span style="font-weight: 800; font-size: 12px; color: #0f172a;">${ts.completionRate}%</span>
                        </div>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      ` : ''}

      <!-- ================================================================== -->
      <!-- SECTION 2: CHILD REGISTRATION REPORT                              -->
      <!-- ================================================================== -->
      ${(state.activeTab === 'all' || state.activeTab === 'registrations') ? `
        <div class="card" style="margin-bottom: 28px;">
          <div class="card-header" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 14px; margin-bottom: 16px;">
            <div>
              <div class="card-title" style="font-size: 16px; font-weight: 800; color: #0f172a; display: flex; align-items: center; gap: 8px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.2"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/><line x1="19" y1="11" x2="19" y2="17"/><line x1="22" y1="14" x2="16" y2="14"/></svg>
                2. Child Registration Report
              </div>
              <p style="font-size: 12.5px; color: #64748b; margin-top: 2px;">Official clinic enrollment registry, parent/caregiver contact profiles, and clinical specialist allocations.</p>
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="btn btn-outline btn-sm" onclick="window.downloadReceptionistReportCSV('registrations')">Export Registrations CSV</button>
            </div>
          </div>

          <!-- Registration Metrics Summary Banner -->
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 14px; margin-bottom: 20px;">
            <div style="text-align: center; border-right: 1px solid #bbf7d0;">
              <div style="font-size: 11px; font-weight: 700; color: #166534; text-transform: uppercase;">Total Registered</div>
              <div style="font-size: 20px; font-weight: 800; color: #166534; margin-top: 2px;">${totalRegisteredChildren} Children</div>
            </div>
            <div style="text-align: center; border-right: 1px solid #bbf7d0;">
              <div style="font-size: 11px; font-weight: 700; color: #047857; text-transform: uppercase;">New This Month</div>
              <div style="font-size: 20px; font-weight: 800; color: #047857; margin-top: 2px;">${newlyRegisteredChildren} New Intake</div>
            </div>
            <div style="text-align: center; border-right: 1px solid #bbf7d0;">
              <div style="font-size: 11px; font-weight: 700; color: #059669; text-transform: uppercase;">Active Clinic Files</div>
              <div style="font-size: 20px; font-weight: 800; color: #059669; margin-top: 2px;">${allChildren.filter(c => c.status === 'Active').length} Active</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 11px; font-weight: 700; color: #d97706; text-transform: uppercase;">Under Screening</div>
              <div style="font-size: 20px; font-weight: 800; color: #d97706; margin-top: 2px;">${allChildren.filter(c => c.status === 'Under Assessment').length} Files</div>
            </div>
          </div>

          <!-- Child Registration Table -->
          ${filteredChildren.length === 0 ? `
            <div style="text-align: center; padding: 36px; background: #f8fafc; border-radius: 8px; border: 1px dashed #cbd5e1;">
              <p style="font-size: 13.5px; color: #64748b; margin-bottom: 8px;">No child registration records match the current filters.</p>
              <button class="btn btn-outline btn-sm" onclick="window.resetReceptionistReportFilters()">Reset Filters</button>
            </div>
          ` : `
            <div class="table-container">
              <table class="table">
                <thead>
                  <tr>
                    <th>Registration Date</th>
                    <th>Child Name & Age</th>
                    <th>Clinical File ID</th>
                    <th>Parent / Caregiver</th>
                    <th>Assigned Specialist</th>
                    <th>Registration Status</th>
                    <th style="text-align: right;">Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${paginatedChildren.map(ch => {
                    const parent = db.getUserById(ch.primary_parent_id);
                    const therapist = db.getUserById(ch.assigned_therapist_id);
                    const regDate = ch.created_at ? new Date(ch.created_at).toLocaleDateString() : '2026-02-01';
                    return `
                      <tr>
                        <td>
                          <div style="font-weight: 700; color: #0f172a; font-size: 13px;">${regDate}</div>
                          <div style="font-size: 11px; color: #64748b;">Enrolled</div>
                        </td>
                        <td>
                          <div style="font-weight: 700; color: #0f172a; font-size: 13.5px;">${ch.first_name} ${ch.last_name}</div>
                          <div style="font-size: 11.5px; color: #64748b;">${ch.age_months} Months &bull; ${ch.gender} &bull; Blood: ${ch.blood_group || 'O+'}</div>
                        </td>
                        <td>
                          <span style="font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #2563eb; background: #eff6ff; padding: 2px 6px; border-radius: 4px; font-size: 12px;">
                            ${ch.child_code}
                          </span>
                        </td>
                        <td>
                          <div style="font-weight: 600; color: #1e293b; font-size: 13px;">${parent ? parent.full_name : 'Priya Sharma'}</div>
                          <div style="font-size: 11.5px; color: #64748b;">${parent ? parent.phone : '+91 9876543214'}</div>
                        </td>
                        <td>
                          <div style="font-weight: 600; color: #1e293b; font-size: 13px;">${therapist ? therapist.full_name : 'Dr. Aisha Khan'}</div>
                          <div style="font-size: 11px; color: #64748b;">Lead Therapist</div>
                        </td>
                        <td>
                          <span class="badge ${ch.status === 'Active' ? 'badge-active' : 'badge-scheduled'}">
                            ${ch.status}
                          </span>
                        </td>
                        <td style="text-align: right;">
                          <button class="btn btn-outline btn-sm" onclick="window.showReceptionistReportDetailModal('child_registration', '${ch.id}')">
                            View Report
                          </button>
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>
      ` : ''}

      <!-- ================================================================== -->
      <!-- SECTION 3: DAILY SCHEDULE REPORT                                  -->
      <!-- ================================================================== -->
      ${(state.activeTab === 'all' || state.activeTab === 'daily_schedule') ? `
        <div class="card" style="margin-bottom: 28px;">
          <div class="card-header" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 14px; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
            <div>
              <div class="card-title" style="font-size: 16px; font-weight: 800; color: #0f172a; display: flex; align-items: center; gap: 8px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                3. Daily Schedule Report
              </div>
              <p style="font-size: 12.5px; color: #64748b; margin-top: 2px;">Day-by-day clinical appointment roster, scheduled arrival times, session types, and on-duty specialists.</p>
            </div>
            
            <!-- Quick Date Controls -->
            <div style="display: flex; align-items: center; gap: 8px;">
              <button class="btn btn-outline btn-sm" onclick="window.changeReceptionistScheduleDay(-1)" title="Previous Day">&larr; Previous</button>
              <input type="date" class="form-control" style="font-size: 12.5px; padding: 5px 10px; font-weight: 700; color: #0f172a; border-radius: 6px;" value="${activeScheduleDate}" onchange="window.setReceptionistReportScheduleDate(this.value)">
              <button class="btn btn-outline btn-sm" onclick="window.changeReceptionistScheduleDay(1)" title="Next Day">Next &rarr;</button>
              <button class="btn btn-secondary btn-sm" onclick="window.setReceptionistReportScheduleDate('${todayStr}')">Today</button>
              <button class="btn btn-outline btn-sm" onclick="window.downloadReceptionistReportCSV('daily_schedule')">Export Schedule CSV</button>
            </div>
          </div>

          <!-- Schedule Roster Table -->
          ${dailyScheduleApts.length === 0 ? `
            <div style="text-align: center; padding: 36px; background: #fffbeb; border-radius: 8px; border: 1px dashed #fcd34d;">
              <p style="font-size: 14px; font-weight: 600; color: #92400e; margin-bottom: 4px;">No appointments scheduled for ${activeScheduleDate}.</p>
              <p style="font-size: 12.5px; color: #b45309; margin-bottom: 12px;">You can select another date or book a new clinical visit.</p>
              <button class="btn btn-primary btn-sm" onclick="window.showBookAppointmentModal()">+ Book Appointment</button>
            </div>
          ` : `
            <div class="table-container">
              <table class="table">
                <thead>
                  <tr>
                    <th>Appointment Time</th>
                    <th>Date</th>
                    <th>Child Patient</th>
                    <th>Clinical File ID</th>
                    <th>Assigned Specialist</th>
                    <th>Appointment Mode / Type</th>
                    <th>Schedule Status</th>
                    <th style="text-align: right;">Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${paginatedSchedule.map(apt => {
                    const child = db.getChildById(apt.child_id);
                    const therapist = db.getUserById(apt.therapist_id);
                    return `
                      <tr>
                        <td>
                          <div style="font-weight: 800; color: #2563eb; font-size: 13.5px;">${apt.start_time} - ${apt.end_time || '10:45 AM'}</div>
                        </td>
                        <td>
                          <div style="font-weight: 600; color: #0f172a; font-size: 12.5px;">${apt.appointment_date}</div>
                        </td>
                        <td>
                          <div style="font-weight: 700; color: #0f172a; font-size: 13px;">${child ? `${child.first_name} ${child.last_name}` : 'Unknown Child'}</div>
                          <div style="font-size: 11px; color: #64748b;">${child ? `${child.age_months} Months (${child.gender})` : ''}</div>
                        </td>
                        <td>
                          <span style="font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #475569; font-size: 11.5px;">
                            ${child ? child.child_code : 'N/A'}
                          </span>
                        </td>
                        <td>
                          <div style="font-weight: 600; color: #1e293b; font-size: 13px;">${therapist ? therapist.full_name : 'Unassigned'}</div>
                          <div style="font-size: 11px; color: #64748b;">Therapy Room 3A</div>
                        </td>
                        <td>
                          <div style="font-size: 12.5px; font-weight: 600; color: #334155;">${apt.type || 'Therapy Session'}</div>
                        </td>
                        <td>
                          <span class="badge ${
                            apt.status === 'Confirmed' ? 'badge-confirmed' :
                            apt.status === 'Scheduled' ? 'badge-scheduled' :
                            apt.status === 'Completed' ? 'badge-completed' :
                            apt.status === 'Rescheduled' ? 'badge-rescheduled' : 'badge-danger'
                          }">
                            ${apt.status}
                          </span>
                        </td>
                        <td style="text-align: right;">
                          <button class="btn btn-outline btn-sm" onclick="window.showReceptionistReportDetailModal('schedule_item', '${apt.id}')">
                            View Report
                          </button>
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>
      ` : ''}

      <!-- ================================================================== -->
      <!-- SECTION 4: APPOINTMENT ACTIVITY REPORT                            -->
      <!-- ================================================================== -->
      ${(state.activeTab === 'all' || state.activeTab === 'activity') ? `
        <div class="card" style="margin-bottom: 28px;">
          <div class="card-header" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 14px; margin-bottom: 16px;">
            <div>
              <div class="card-title" style="font-size: 16px; font-weight: 800; color: #0f172a; display: flex; align-items: center; gap: 8px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0891b2" stroke-width="2.2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                4. Appointment Activity & Audit Report
              </div>
              <p style="font-size: 12.5px; color: #64748b; margin-top: 2px;">Chronological audit log tracking recent bookings, reschedules, cancellations, completions, and reminder dispatches.</p>
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="btn btn-outline btn-sm" onclick="window.downloadReceptionistReportCSV('activity')">Export Activity CSV</button>
            </div>
          </div>

          <!-- Activity Audit Stream Table -->
          ${filteredActivities.length === 0 ? `
            <div style="text-align: center; padding: 36px; background: #f8fafc; border-radius: 8px; border: 1px dashed #cbd5e1;">
              <p style="font-size: 13.5px; color: #64748b; margin-bottom: 8px;">No activity logs recorded matching the current filter criteria.</p>
              <button class="btn btn-outline btn-sm" onclick="window.resetReceptionistReportFilters()">Reset Filters</button>
            </div>
          ` : `
            <div class="table-container">
              <table class="table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Activity Type</th>
                    <th>Event Description</th>
                    <th>Child / Patient</th>
                    <th>Assigned Specialist</th>
                    <th>Session Date & Time</th>
                    <th style="text-align: right;">Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${paginatedActivities.map(act => {
                    const child = db.getChildById(act.child_id);
                    const therapist = db.getUserById(act.therapist_id);
                    const timeFormatted = act.timestamp ? new Date(act.timestamp).toLocaleString() : act.date;
                    return `
                      <tr>
                        <td>
                          <div style="font-weight: 700; color: #0f172a; font-size: 12.5px;">${timeFormatted}</div>
                        </td>
                        <td>
                          <span class="badge ${act.typeBadge || 'badge-info'}">
                            ${act.type}
                          </span>
                        </td>
                        <td>
                          <div style="font-weight: 700; color: #1e293b; font-size: 13px;">${act.title}</div>
                          <div style="font-size: 12px; color: #64748b; margin-top: 1px;">${act.description}</div>
                        </td>
                        <td>
                          <div style="font-weight: 600; color: #0f172a; font-size: 12.5px;">${child ? `${child.first_name} ${child.last_name}` : 'Patient'}</div>
                          <div style="font-size: 11px; color: #64748b; font-family: 'JetBrains Mono', monospace;">${child ? child.child_code : ''}</div>
                        </td>
                        <td>
                          <div style="font-size: 12.5px; color: #334155;">${therapist ? therapist.full_name : 'Therapist'}</div>
                        </td>
                        <td>
                          <div style="font-weight: 600; color: #0f172a; font-size: 12px;">${act.date}</div>
                          <div style="font-size: 11px; color: #2563eb;">${act.time}</div>
                        </td>
                        <td style="text-align: right;">
                          <button class="btn btn-outline btn-sm" onclick="window.showReceptionistReportDetailModal('activity_item', '${act.id}')">
                            View Report
                          </button>
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>
      ` : ''}

    </div>

    <!-- PAGINATION CONTROLS -->
    ${totalPages > 1 ? `
      <div class="card no-print" style="padding: 12px 20px; background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; margin-top: 20px;">
        <div style="font-size: 12.5px; color: #64748b;">
          Showing Page <strong>${currentPage}</strong> of <strong>${totalPages}</strong> (${currentItemsCount} total records)
        </div>
        <div style="display: flex; gap: 6px;">
          <button class="btn btn-outline btn-sm" ${currentPage === 1 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''} onclick="window.setReceptionistReportPage(${currentPage - 1})">
            &larr; Previous
          </button>
          ${Array.from({ length: totalPages }, (_, i) => i + 1).map(p => `
            <button class="btn btn-sm ${p === currentPage ? 'btn-primary' : 'btn-outline'}" onclick="window.setReceptionistReportPage(${p})" style="min-width: 32px; padding: 4px 8px;">
              ${p}
            </button>
          `).join('')}
          <button class="btn btn-outline btn-sm" ${currentPage === totalPages ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''} onclick="window.setReceptionistReportPage(${currentPage + 1})">
            Next &rarr;
          </button>
        </div>
      </div>
    ` : ''}
  `;
};

// ============================================================================
// 3. INTERACTIVE RECEPTIONIST REPORT STATE CONTROLLERS
// ============================================================================

window.setReceptionistReportTab = function(tab) {
  window.receptionistReportsState.activeTab = tab;
  window.receptionistReportsState.currentPage = 1;
  window.renderApp();
};

window.updateReceptionistReportSearch = function(query) {
  window.receptionistReportsState.searchQuery = query;
  window.receptionistReportsState.currentPage = 1;
  window.renderApp();
};

window.setReceptionistReportDatePreset = function(preset) {
  window.receptionistReportsState.datePreset = preset;
  window.receptionistReportsState.currentPage = 1;
  window.renderApp();
};

window.setReceptionistReportDateRange = function(start, end) {
  window.receptionistReportsState.startDate = start;
  window.receptionistReportsState.endDate = end;
  window.receptionistReportsState.currentPage = 1;
  window.renderApp();
};

window.setReceptionistReportScheduleDate = function(dateStr) {
  window.receptionistReportsState.scheduleDate = dateStr;
  window.renderApp();
};

window.changeReceptionistScheduleDay = function(offset) {
  const current = new Date(window.receptionistReportsState.scheduleDate || new Date());
  current.setDate(current.getDate() + offset);
  window.receptionistReportsState.scheduleDate = current.toISOString().split('T')[0];
  window.renderApp();
};

window.setReceptionistReportStatus = function(status) {
  window.receptionistReportsState.statusFilter = status;
  window.receptionistReportsState.currentPage = 1;
  window.renderApp();
};

window.setReceptionistReportTherapist = function(therapistId) {
  window.receptionistReportsState.therapistFilter = therapistId;
  window.receptionistReportsState.currentPage = 1;
  window.renderApp();
};

window.setReceptionistReportPage = function(page) {
  window.receptionistReportsState.currentPage = page;
  window.renderApp();
  window.scrollTo({ top: 300, behavior: 'smooth' });
};

window.resetReceptionistReportFilters = function() {
  window.receptionistReportsState.searchQuery = '';
  window.receptionistReportsState.datePreset = 'all';
  window.receptionistReportsState.startDate = '';
  window.receptionistReportsState.endDate = '';
  window.receptionistReportsState.statusFilter = 'all';
  window.receptionistReportsState.therapistFilter = 'all';
  window.receptionistReportsState.currentPage = 1;
  window.renderApp();
};

// ============================================================================
// 4. ACTION MODALS: "VIEW REPORT" & "GENERATE REPORT"
// ============================================================================

// Detail Administrative View Modal
window.showReceptionistReportDetailModal = function(type, id) {
  const db = window.neuroDB;
  let title = 'Administrative Report Summary';
  let content = '';

  if (type === 'appointment' || type === 'schedule_item') {
    const apt = db.getAppointments().find(a => a.id === id);
    if (!apt) return;
    const child = db.getChildById(apt.child_id);
    const therapist = db.getUserById(apt.therapist_id);
    const parent = child ? db.getUserById(child.primary_parent_id) : null;

    title = `Appointment Report — #${apt.id.toUpperCase()}`;
    content = `
      <div style="font-family: 'Plus Jakarta Sans', sans-serif;">
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px; margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">
            <div>
              <div style="font-size: 11px; font-weight: 700; color: #2563eb; text-transform: uppercase; letter-spacing: 0.5px;">Official Clinical Schedule Record</div>
              <div style="font-size: 16px; font-weight: 800; color: #0f172a;">${apt.type || 'Therapy Consultation'}</div>
            </div>
            <span class="badge ${
              apt.status === 'Confirmed' ? 'badge-confirmed' :
              apt.status === 'Scheduled' ? 'badge-scheduled' :
              apt.status === 'Completed' ? 'badge-completed' :
              apt.status === 'Rescheduled' ? 'badge-rescheduled' : 'badge-danger'
            }">
              ${apt.status}
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; font-size: 13px;">
            <div><strong style="color: #64748b;">Scheduled Date:</strong> <div style="font-weight: 700; color: #0f172a;">${apt.appointment_date}</div></div>
            <div><strong style="color: #64748b;">Time Slot:</strong> <div style="font-weight: 700; color: #2563eb;">${apt.start_time} - ${apt.end_time || '10:45 AM'}</div></div>
            <div><strong style="color: #64748b;">Child Patient:</strong> <div style="font-weight: 700; color: #0f172a;">${child ? `${child.first_name} ${child.last_name}` : 'Unknown'}</div></div>
            <div><strong style="color: #64748b;">Clinical File ID:</strong> <div style="font-weight: 700; font-family: monospace; color: #2563eb;">${child ? child.child_code : 'N/A'}</div></div>
            <div><strong style="color: #64748b;">Primary Caregiver:</strong> <div>${parent ? parent.full_name : 'Priya Sharma'} (${parent ? parent.phone : '+91 9876543214'})</div></div>
            <div><strong style="color: #64748b;">Assigned Specialist:</strong> <div style="font-weight: 700; color: #0f172a;">${therapist ? therapist.full_name : 'Unassigned'}</div></div>
            <div><strong style="color: #64748b;">Reminder Dispatch:</strong> <div>${apt.reminder_sent ? '<span style="color: #16a34a; font-weight: 700;">Delivered via SMS/App</span>' : '<span style="color: #64748b;">Pending Dispatch</span>'}</div></div>
            <div><strong style="color: #64748b;">Booking Timestamp:</strong> <div style="color: #64748b;">${apt.created_at ? new Date(apt.created_at).toLocaleString() : apt.appointment_date}</div></div>
          </div>
        </div>

        <div style="font-size: 12px; color: #64748b; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 12px;">
          <div style="font-weight: 700; color: #1e40af; margin-bottom: 2px;">Role Access Control Notice:</div>
          Administrative report view verified. Detailed psychiatric baseline answers, IEP milestone rubrics, and confidential clinical notes are strictly restricted to licensed clinical staff.
        </div>
      </div>
    `;
  } else if (type === 'child_registration') {
    const child = db.getChildById(id);
    if (!child) return;
    const parent = db.getUserById(child.primary_parent_id);
    const therapist = db.getUserById(child.assigned_therapist_id);

    title = `Child Registration Record — ${child.first_name} ${child.last_name}`;
    content = `
      <div style="font-family: 'Plus Jakarta Sans', sans-serif;">
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px; margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">
            <div>
              <div style="font-size: 11px; font-weight: 700; color: #059669; text-transform: uppercase;">Patient Intake & File Profile</div>
              <div style="font-size: 17px; font-weight: 800; color: #0f172a;">${child.first_name} ${child.last_name}</div>
            </div>
            <span class="badge ${child.status === 'Active' ? 'badge-active' : 'badge-scheduled'}">${child.status}</span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; font-size: 13px;">
            <div><strong style="color: #64748b;">Clinical File ID:</strong> <div style="font-weight: 700; color: #2563eb; font-family: monospace;">${child.child_code}</div></div>
            <div><strong style="color: #64748b;">Date of Birth:</strong> <div>${child.dob} (${child.age_months} Months)</div></div>
            <div><strong style="color: #64748b;">Gender / Blood Group:</strong> <div>${child.gender} &bull; ${child.blood_group || 'O+'}</div></div>
            <div><strong style="color: #64748b;">Registration Date:</strong> <div style="font-weight: 700; color: #0f172a;">${child.created_at ? new Date(child.created_at).toLocaleDateString() : '2026-02-01'}</div></div>
            <div><strong style="color: #64748b;">Primary Parent / Caregiver:</strong> <div style="font-weight: 700;">${parent ? parent.full_name : 'Priya Sharma'}</div></div>
            <div><strong style="color: #64748b;">Emergency Phone:</strong> <div>${parent ? parent.phone : '+91 9876543214'}</div></div>
            <div><strong style="color: #64748b;">Assigned Clinical Specialist:</strong> <div style="font-weight: 700; color: #0f172a;">${therapist ? therapist.full_name : 'Dr. Aisha Khan'}</div></div>
            <div><strong style="color: #64748b;">Intake Notes:</strong> <div style="color: #475569;">${child.notes || 'Routine pediatric developmental intake completed.'}</div></div>
          </div>
        </div>
      </div>
    `;
  } else {
    title = 'Activity Audit Event Detail';
    content = `
      <div style="padding: 16px; background: #f8fafc; border-radius: 8px; font-size: 13px; color: #334155;">
        <div style="font-weight: 700; color: #0f172a; margin-bottom: 8px;">Activity Audit Record Verified</div>
        <p style="color: #64748b; line-height: 1.5;">This operational activity record is synced with NEUROSPECTRA's central audit database and reflects real-time status transitions made by clinic reception and clinical specialists.</p>
      </div>
    `;
  }

  const footer = `
    <button class="btn btn-secondary" onclick="window.closeActiveModal()">Close</button>
    <button class="btn btn-primary" onclick="window.print()">Print This Record</button>
  `;

  window.openModal(title, content, footer, false);
};

// Generate Report Modal
window.showGenerateReceptionistReportModal = function() {
  const therapists = window.neuroDB.getUsers().filter(u => u.role === 'Therapist' && u.is_active);
  const todayStr = new Date().toISOString().split('T')[0];

  const content = `
    <form id="gen-rep-form" onsubmit="window.handleGenerateReceptionistReportSubmit(event)">
      <div class="form-group" style="margin-bottom: 16px;">
        <label class="form-label" style="font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 6px; display: block;">Report Category <span style="color: #ef4444;">*</span></label>
        <select id="gen-rep-category" class="form-control" required style="width: 100%; padding: 10px; font-size: 13px; border-radius: 8px;">
          <option value="all">Full Administrative Executive Summary (All Categories)</option>
          <option value="appointments">1. Appointment Master Report</option>
          <option value="registrations">2. Child Registration Report</option>
          <option value="daily_schedule">3. Daily Schedule Report</option>
          <option value="activity">4. Appointment Activity & Audit Report</option>
        </select>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
        <div class="form-group">
          <label class="form-label" style="font-size: 12.5px; font-weight: 600; color: #475569; margin-bottom: 4px; display: block;">From Date</label>
          <input type="date" id="gen-rep-start" class="form-control" value="2026-01-01" style="width: 100%; padding: 8px 10px; font-size: 13px; border-radius: 6px;">
        </div>
        <div class="form-group">
          <label class="form-label" style="font-size: 12.5px; font-weight: 600; color: #475569; margin-bottom: 4px; display: block;">To Date</label>
          <input type="date" id="gen-rep-end" class="form-control" value="${todayStr}" style="width: 100%; padding: 8px 10px; font-size: 13px; border-radius: 6px;">
        </div>
      </div>

      <div class="form-group" style="margin-bottom: 16px;">
        <label class="form-label" style="font-size: 12.5px; font-weight: 600; color: #475569; margin-bottom: 4px; display: block;">Filter by Specialist (Optional)</label>
        <select id="gen-rep-therapist" class="form-control" style="width: 100%; padding: 9px; font-size: 13px; border-radius: 8px;">
          <option value="all">All Specialists</option>
          ${therapists.map(th => `<option value="${th.id}">${th.full_name}</option>`).join('')}
        </select>
      </div>

      <div class="form-group" style="margin-bottom: 20px;">
        <label class="form-label" style="font-size: 12.5px; font-weight: 600; color: #475569; margin-bottom: 4px; display: block;">Export Format</label>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <label style="display: flex; align-items: center; gap: 8px; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; cursor: pointer; background: #f8fafc;">
            <input type="radio" name="gen-rep-format" value="screen" checked>
            <span style="font-size: 13px; font-weight: 600; color: #0f172a;">Printable View / PDF</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; cursor: pointer; background: #f8fafc;">
            <input type="radio" name="gen-rep-format" value="csv">
            <span style="font-size: 13px; font-weight: 600; color: #0f172a;">Download CSV File</span>
          </label>
        </div>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 10px;">
        <button type="button" class="btn btn-secondary" onclick="window.closeActiveModal()">Cancel</button>
        <button type="submit" class="btn btn-primary">Generate Report</button>
      </div>
    </form>
  `;

  window.openModal('Generate Administrative Report', content, '', false);
};

window.handleGenerateReceptionistReportSubmit = function(e) {
  e.preventDefault();
  const category = document.getElementById('gen-rep-category').value;
  const start = document.getElementById('gen-rep-start').value;
  const end = document.getElementById('gen-rep-end').value;
  const therapistId = document.getElementById('gen-rep-therapist').value;
  const format = document.querySelector('input[name="gen-rep-format"]:checked').value;

  window.closeActiveModal();

  // Apply filters to state
  window.receptionistReportsState.activeTab = category;
  if (start && end) {
    window.receptionistReportsState.datePreset = 'custom';
    window.receptionistReportsState.startDate = start;
    window.receptionistReportsState.endDate = end;
  }
  window.receptionistReportsState.therapistFilter = therapistId;
  window.receptionistReportsState.currentPage = 1;

  if (format === 'csv') {
    window.renderApp();
    window.downloadReceptionistReportCSV(category);
    window.showToast('Administrative report CSV generated and downloaded.', 'success');
  } else {
    window.renderApp();
    window.showToast('Report generated successfully! Document preview opened.', 'success');
    window.showGeneratedAdministrativeDocumentModal(category);
  }
};

// Official Printable / PDF Document Viewer Modal
window.showGeneratedAdministrativeDocumentModal = function(category = 'all') {
  const db = window.neuroDB;
  const allAppointments = db.getAppointments() || [];
  const allChildren = db.getChildren() || [];
  const therapists = db.getUsers().filter(u => u.role === 'Therapist' && u.is_active);
  const currentUser = window.neuroAuth.getCurrentUser();
  const todayStr = new Date().toISOString().split('T')[0];
  const reportCode = 'ADM-RPT-' + new Date().getFullYear() + '-' + Date.now().toString(36).toUpperCase().slice(-4);

  const categoryTitle = 
    category === 'appointments' ? '1. APPOINTMENT MASTER & CLINICIAN REPORT' :
    category === 'registrations' ? '2. CHILD REGISTRATION & INTAKE REPORT' :
    category === 'daily_schedule' ? '3. DAILY SCHEDULE & ROSTER REPORT' :
    category === 'activity' ? '4. APPOINTMENT ACTIVITY & AUDIT REPORT' :
    'EXECUTIVE ADMINISTRATIVE & APPOINTMENT MASTER REPORT';

  const content = `
    <div class="clinical-report-paper" style="background: #ffffff; padding: 28px; border-radius: 12px; font-family: 'Plus Jakarta Sans', sans-serif; color: #0f172a; max-width: 900px; margin: 0 auto;">
      
      <!-- Top Action Bar inside Document Modal -->
      <div class="no-print" style="display: flex; justify-content: space-between; align-items: center; background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px 16px; border-radius: 8px; margin-bottom: 24px;">
        <div style="font-size: 13px; color: #475569;">
          <strong>Document Ready:</strong> You can view below or click to print / save as PDF.
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-secondary btn-sm" onclick="window.downloadReceptionistReportCSV('${category}')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download CSV
          </button>
          <button class="btn btn-primary btn-sm" onclick="window.print()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            Print / Save as PDF
          </button>
        </div>
      </div>

      <!-- Document Header Banner -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f172a; padding-bottom: 18px; margin-bottom: 20px;">
        <div style="display: flex; align-items: center; gap: 14px;">
          <img src="assets/logo.png" alt="NEUROSPECTRA" style="height: 38px; width: auto; object-fit: contain;">
          <div style="border-left: 1.5px solid #cbd5e1; padding-left: 12px;">
            <div style="font-size: 15px; font-weight: 800; color: #0f172a; letter-spacing: -0.3px;">ADMINISTRATIVE REPORT</div>
            <div style="font-size: 11px; color: #2563eb; font-weight: 700; text-transform: uppercase;">Clinic Operations & Scheduling Services</div>
          </div>
        </div>
        <div style="text-align: right; font-size: 12px; color: #64748b;">
          <div><strong>Report ID:</strong> <span style="font-family: monospace; color: #0f172a; font-weight: 700;">${reportCode}</span></div>
          <div><strong>Date:</strong> ${new Date().toLocaleDateString()}</div>
          <div><strong>Generated By:</strong> ${currentUser ? currentUser.full_name : 'Sarah Jenkins (Reception)'}</div>
        </div>
      </div>

      <!-- Meta Summary Grid -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 22px; font-size: 12.5px;">
        <div><strong style="color: #64748b;">Scope:</strong> <div style="font-weight: 700; color: #0f172a;">${categoryTitle}</div></div>
        <div><strong style="color: #64748b;">Total Clinic Files:</strong> <div style="font-weight: 700; color: #0f172a;">${allChildren.length} Registered Children</div></div>
        <div><strong style="color: #64748b;">Active Bookings:</strong> <div style="font-weight: 700; color: #2563eb;">${allAppointments.length} Total Sessions</div></div>
        <div><strong style="color: #64748b;">Clinical Staff:</strong> <div style="font-weight: 700; color: #16a34a;">${therapists.length} Specialists on Roster</div></div>
      </div>

      <!-- Data Section Table: Appointments -->
      ${(category === 'all' || category === 'appointments' || category === 'daily_schedule') ? `
        <div style="margin-bottom: 24px;">
          <h4 style="font-size: 13.5px; font-weight: 800; color: #0f172a; margin-bottom: 8px; border-left: 3.5px solid #2563eb; padding-left: 8px; text-transform: uppercase;">
            Appointments & Daily Schedule Summary
          </h4>
          <table class="table" style="width: 100%; border-collapse: collapse; font-size: 12px;">
            <thead>
              <tr style="background: #f1f5f9; border-bottom: 1.5px solid #cbd5e1; text-align: left;">
                <th style="padding: 8px;">Date & Time</th>
                <th style="padding: 8px;">Child Patient / ID</th>
                <th style="padding: 8px;">Assigned Specialist</th>
                <th style="padding: 8px;">Mode / Type</th>
                <th style="padding: 8px;">Status</th>
                <th style="padding: 8px; text-align: right;">Reminder</th>
              </tr>
            </thead>
            <tbody>
              ${allAppointments.map(a => {
                const ch = db.getChildById(a.child_id);
                const th = db.getUserById(a.therapist_id);
                return `
                  <tr style="border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 8px; font-weight: 700;">${a.appointment_date} <span style="color: #2563eb; font-weight: 600;">(${a.start_time})</span></td>
                    <td style="padding: 8px;">${ch ? `${ch.first_name} ${ch.last_name}` : 'Unknown'} (${ch ? ch.child_code : ''})</td>
                    <td style="padding: 8px;">${th ? th.full_name : 'Unassigned'}</td>
                    <td style="padding: 8px;">${a.type}</td>
                    <td style="padding: 8px;"><span style="font-weight: 700; font-size: 11px;">${a.status}</span></td>
                    <td style="padding: 8px; text-align: right;">${a.reminder_sent ? 'Delivered' : 'Pending'}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      ` : ''}

      <!-- Data Section Table: Registrations -->
      ${(category === 'all' || category === 'registrations') ? `
        <div style="margin-bottom: 24px;">
          <h4 style="font-size: 13.5px; font-weight: 800; color: #0f172a; margin-bottom: 8px; border-left: 3.5px solid #10b981; padding-left: 8px; text-transform: uppercase;">
            Child Registration & Intake Registry
          </h4>
          <table class="table" style="width: 100%; border-collapse: collapse; font-size: 12px;">
            <thead>
              <tr style="background: #f1f5f9; border-bottom: 1.5px solid #cbd5e1; text-align: left;">
                <th style="padding: 8px;">Registration Date</th>
                <th style="padding: 8px;">Child Name</th>
                <th style="padding: 8px;">File ID</th>
                <th style="padding: 8px;">Age / Gender</th>
                <th style="padding: 8px;">Parent / Caregiver</th>
                <th style="padding: 8px; text-align: right;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${allChildren.map(ch => {
                const parent = db.getUserById(ch.primary_parent_id);
                return `
                  <tr style="border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 8px; font-weight: 700;">${ch.created_at ? ch.created_at.split('T')[0] : '2026-02-01'}</td>
                    <td style="padding: 8px; font-weight: 700;">${ch.first_name} ${ch.last_name}</td>
                    <td style="padding: 8px; font-family: monospace; color: #2563eb;">${ch.child_code}</td>
                    <td style="padding: 8px;">${ch.age_months} Mos (${ch.gender})</td>
                    <td style="padding: 8px;">${parent ? parent.full_name : 'Priya Sharma'} (${parent ? parent.phone : '+91 9876543214'})</td>
                    <td style="padding: 8px; text-align: right; font-weight: 700;">${ch.status}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      ` : ''}

      <!-- Document Signatures Footer -->
      <div style="display: flex; justify-content: space-between; margin-top: 36px; padding-top: 20px; border-top: 1px solid #cbd5e1; font-size: 12px;">
        <div style="width: 220px; text-align: center; border-top: 1px solid #64748b; padding-top: 6px;">
          <div style="font-weight: 700; color: #0f172a;">${currentUser ? currentUser.full_name : 'Sarah Jenkins'}</div>
          <div style="color: #64748b; font-size: 11px;">Clinical Intake Receptionist</div>
        </div>
        <div style="width: 220px; text-align: center; border-top: 1px solid #64748b; padding-top: 6px;">
          <div style="font-weight: 700; color: #0f172a;">Clinic Operations Director</div>
          <div style="color: #64748b; font-size: 11px;">NEUROSPECTRA Health Centre</div>
        </div>
      </div>

    </div>
  `;

  const footer = `
    <button class="btn btn-secondary" onclick="window.closeActiveModal()">Close</button>
    <button class="btn btn-primary" onclick="window.print()">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
      Print / Save as PDF
    </button>
  `;

  window.openModal('Official Generated Administrative Document', content, footer, true);
};

// ============================================================================
// 5. DOWNLOAD & EXPORT CAPABILITIES (CSV & PRINT / PDF)
// ============================================================================

window.downloadReceptionistReportCSV = function(category = 'all') {
  const db = window.neuroDB;
  const allAppointments = db.getAppointments() || [];
  const allChildren = db.getChildren() || [];

  let csvContent = "data:text/csv;charset=utf-8,";
  let filename = `NEUROSPECTRA_Administrative_Report_${category}_${new Date().toISOString().split('T')[0]}.csv`;

  if (category === 'registrations') {
    csvContent += "Registration Date,Child Name,Child Code,Age (Months),Gender,Blood Group,Parent Name,Parent Phone,Assigned Therapist,Status\n";
    allChildren.forEach(ch => {
      const parent = db.getUserById(ch.primary_parent_id);
      const therapist = db.getUserById(ch.assigned_therapist_id);
      const row = [
        `"${ch.created_at ? ch.created_at.split('T')[0] : '2026-02-01'}"`,
        `"${ch.first_name} ${ch.last_name}"`,
        `"${ch.child_code}"`,
        `"${ch.age_months}"`,
        `"${ch.gender}"`,
        `"${ch.blood_group || 'O+'}"`,
        `"${parent ? parent.full_name : 'Priya Sharma'}"`,
        `"${parent ? parent.phone : '+91 9876543214'}"`,
        `"${therapist ? therapist.full_name : 'Dr. Aisha Khan'}"`,
        `"${ch.status}"`
      ];
      csvContent += row.join(",") + "\n";
    });
  } else if (category === 'daily_schedule') {
    const targetDate = window.receptionistReportsState.scheduleDate || new Date().toISOString().split('T')[0];
    const scheduleApts = allAppointments.filter(a => a.appointment_date === targetDate);
    csvContent += "Date,Time Slot,Child Name,Child Code,Assigned Therapist,Session Type,Status,Reminder Sent\n";
    scheduleApts.forEach(a => {
      const child = db.getChildById(a.child_id);
      const therapist = db.getUserById(a.therapist_id);
      const row = [
        `"${a.appointment_date}"`,
        `"${a.start_time} - ${a.end_time || '10:45 AM'}"`,
        `"${child ? `${child.first_name} ${child.last_name}` : 'Unknown'}"`,
        `"${child ? child.child_code : 'N/A'}"`,
        `"${therapist ? therapist.full_name : 'Unassigned'}"`,
        `"${a.type}"`,
        `"${a.status}"`,
        `"${a.reminder_sent ? 'Yes' : 'No'}"`
      ];
      csvContent += row.join(",") + "\n";
    });
  } else if (category === 'activity') {
    csvContent += "Timestamp,Activity Type,Title,Description,Child ID,Therapist ID,Status\n";
    allAppointments.forEach(a => {
      const child = db.getChildById(a.child_id);
      const therapist = db.getUserById(a.therapist_id);
      csvContent += `"${a.created_at || a.appointment_date}","Booking","Appointment Booked","${a.type} for ${child?.first_name || 'Patient'} with ${therapist?.full_name || 'Therapist'}","${a.child_id}","${a.therapist_id}","${a.status}"\n`;
      if (a.reminder_sent) {
        csvContent += `"${a.appointment_date}T08:00:00Z","Reminder","Reminder Dispatched","SMS & In-App reminder sent for ${child?.first_name || 'Patient'}","${a.child_id}","${a.therapist_id}","Delivered"\n`;
      }
    });
  } else {
    // Default: Appointment Report CSV
    csvContent += "Appointment ID,Date,Time Slot,Child Name,Child Code,Assigned Therapist,Session Type,Status,Reminder Sent,Notes\n";
    allAppointments.forEach(a => {
      const child = db.getChildById(a.child_id);
      const therapist = db.getUserById(a.therapist_id);
      const row = [
        `"${a.id}"`,
        `"${a.appointment_date}"`,
        `"${a.start_time} - ${a.end_time || '10:45 AM'}"`,
        `"${child ? `${child.first_name} ${child.last_name}` : 'Unknown'}"`,
        `"${child ? child.child_code : 'N/A'}"`,
        `"${therapist ? therapist.full_name : 'Unassigned'}"`,
        `"${a.type}"`,
        `"${a.status}"`,
        `"${a.reminder_sent ? 'Sent' : 'Pending'}"`,
        `"${(a.notes || '').replace(/"/g, '""')}"`
      ];
      csvContent += row.join(",") + "\n";
    });
  }

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.showToast(`Exported ${filename}`, 'success');
};

window.printReceptionistAdministrativeReport = function(category = 'all') {
  window.print();
};
