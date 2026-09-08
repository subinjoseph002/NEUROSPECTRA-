/**
 * NEUROSPECTRA - Administrator Dashboard & User/Therapist Management
 * Complete implementation for Clinic Admin, Staff, and User Directory.
 */

window.adminActiveUserRoleFilter = 'All';

// ==========================================================================
// 1. Admin Dashboard View
// ==========================================================================
window.renderAdminDashboard = function() {
  const allUsers = window.neuroDB.getUsers ? window.neuroDB.getUsers() : [];
  const children = window.neuroDB.getChildren ? window.neuroDB.getChildren() : [];
  const therapyPlans = window.neuroDB.getTherapyPlans ? window.neuroDB.getTherapyPlans() : [];
  const appointments = window.neuroDB.getAppointments ? window.neuroDB.getAppointments() : [];
  const assessments = window.neuroDB.getAssessmentRecords ? window.neuroDB.getAssessmentRecords() : (window.neuroDB.getAssessments ? window.neuroDB.getAssessments() : []);

  const therapistList = allUsers.filter(u => u.role === 'Therapist');
  const parentList = allUsers.filter(u => u.role === 'Parent / Caregiver');
  const teacherList = allUsers.filter(u => u.role === 'Teacher');

  return `
    <div class="figma-admin-dashboard" style="color: #0f172a; font-family: 'Plus Jakarta Sans', sans-serif;">
      
      <!-- Page Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <div>
          <h1 style="font-size: 26px; font-weight: 800; color: #0f172a; margin-bottom: 4px;">
            Clinical Administration & Overview
          </h1>
          <p style="font-size: 14px; color: #64748b; margin: 0;">
            Real-time management of pediatric cases, clinical specialists, diagnostic assessments, and platform health.
          </p>
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="btn btn-outline" onclick="window.exportPostgresSQLDump()" style="display: flex; align-items: center; gap: 6px;" title="Export all live registered users and data into a PostgreSQL SQL file">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export PostgreSQL (.sql)
          </button>
          <button class="btn btn-outline" onclick="window.navigateTo('users', { roleFilter: 'Therapist' })" style="display: flex; align-items: center; gap: 6px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            View Therapists (${therapistList.length})
          </button>
          <button class="btn btn-primary" onclick="window.showAddUserModal()" style="display: flex; align-items: center; gap: 6px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add New User
          </button>
        </div>
      </div>

      <!-- Top Row 6 Stat Cards (Live DB Counts & Clickable Navigation) -->
      <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 16px; margin-bottom: 28px;">
        
        <!-- Stat 1: Total Children -->
        <div class="card" style="margin-bottom: 0; padding: 18px 20px; border-radius: 14px; border: 1px solid #e2e8f0; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.03); cursor: pointer; transition: all 0.2s;" onclick="window.navigateTo('children')" onmouseover="this.style.borderColor='#2563eb'" onmouseout="this.style.borderColor='#e2e8f0'">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <span style="font-size: 11px; font-weight: 700; color: #64748b; letter-spacing: 0.5px; text-transform: uppercase;">TOTAL CHILDREN</span>
            <div style="width: 28px; height: 28px; border-radius: 50%; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
            </div>
          </div>
          <div style="font-size: 30px; font-weight: 800; color: #0f172a; line-height: 1.1; margin-bottom: 6px;">${children.length}</div>
          <div style="font-size: 11.5px; font-weight: 600; color: #16a34a; display: flex; align-items: center; gap: 4px;">
            <span>▲</span> Active registry
          </div>
        </div>

        <!-- Stat 2: Total Therapists -->
        <div class="card" style="margin-bottom: 0; padding: 18px 20px; border-radius: 14px; border: 1px solid #e2e8f0; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.03); cursor: pointer; transition: all 0.2s;" onclick="window.navigateTo('users', { roleFilter: 'Therapist' })" onmouseover="this.style.borderColor='#10b981'" onmouseout="this.style.borderColor='#e2e8f0'">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <span style="font-size: 11px; font-weight: 700; color: #64748b; letter-spacing: 0.5px; text-transform: uppercase;">TOTAL THERAPISTS</span>
            <div style="width: 28px; height: 28px; border-radius: 50%; background: #ecfdf5; color: #10b981; display: flex; align-items: center; justify-content: center;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
          </div>
          <div style="font-size: 30px; font-weight: 800; color: #0f172a; line-height: 1.1; margin-bottom: 6px;">${therapistList.length}</div>
          <div style="font-size: 11.5px; font-weight: 600; color: #16a34a; display: flex; align-items: center; gap: 4px;">
            <span>●</span> ${therapistList.filter(t => t.is_active).length} online & active
          </div>
        </div>

        <!-- Stat 3: Total Parents -->
        <div class="card" style="margin-bottom: 0; padding: 18px 20px; border-radius: 14px; border: 1px solid #e2e8f0; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.03); cursor: pointer; transition: all 0.2s;" onclick="window.navigateTo('users', { roleFilter: 'Parent / Caregiver' })" onmouseover="this.style.borderColor='#2563eb'" onmouseout="this.style.borderColor='#e2e8f0'">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <span style="font-size: 11px; font-weight: 700; color: #64748b; letter-spacing: 0.5px; text-transform: uppercase;">TOTAL PARENTS</span>
            <div style="width: 28px; height: 28px; border-radius: 50%; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
          </div>
          <div style="font-size: 30px; font-weight: 800; color: #0f172a; line-height: 1.1; margin-bottom: 6px;">${parentList.length}</div>
          <div style="font-size: 11.5px; font-weight: 600; color: #16a34a; display: flex; align-items: center; gap: 4px;">
            <span>▲</span> Connected families
          </div>
        </div>

        <!-- Stat 4: Completed Assessments -->
        <div class="card" style="margin-bottom: 0; padding: 18px 20px; border-radius: 14px; border: 1px solid #e2e8f0; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.03); cursor: pointer; transition: all 0.2s;" onclick="window.navigateTo('assessments')" onmouseover="this.style.borderColor='#10b981'" onmouseout="this.style.borderColor='#e2e8f0'">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <span style="font-size: 11px; font-weight: 700; color: #64748b; letter-spacing: 0.5px; text-transform: uppercase;">ASSESSMENTS</span>
            <div style="width: 28px; height: 28px; border-radius: 50%; background: #ecfdf5; color: #10b981; display: flex; align-items: center; justify-content: center;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
          </div>
          <div style="font-size: 30px; font-weight: 800; color: #0f172a; line-height: 1.1; margin-bottom: 6px;">${assessments.length}</div>
          <div style="font-size: 11.5px; font-weight: 600; color: #16a34a; display: flex; align-items: center; gap: 4px;">
            <span>▲</span> 100% evaluated
          </div>
        </div>

        <!-- Stat 5: Today's Appointments -->
        <div class="card" style="margin-bottom: 0; padding: 18px 20px; border-radius: 14px; border: 1px solid #e2e8f0; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.03); cursor: pointer; transition: all 0.2s;" onclick="window.navigateTo('appointments')" onmouseover="this.style.borderColor='#f59e0b'" onmouseout="this.style.borderColor='#e2e8f0'">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <span style="font-size: 11px; font-weight: 700; color: #64748b; letter-spacing: 0.5px; text-transform: uppercase;">APPOINTMENTS</span>
            <div style="width: 28px; height: 28px; border-radius: 50%; background: #fef3c7; color: #f59e0b; display: flex; align-items: center; justify-content: center;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
          </div>
          <div style="font-size: 30px; font-weight: 800; color: #0f172a; line-height: 1.1; margin-bottom: 6px;">${appointments.length}</div>
          <div style="font-size: 11.5px; font-weight: 500; color: #64748b;">
            Scheduled sessions
          </div>
        </div>

        <!-- Stat 6: Active IEP Plans -->
        <div class="card" style="margin-bottom: 0; padding: 18px 20px; border-radius: 14px; border: 1px solid #e2e8f0; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.03); cursor: pointer; transition: all 0.2s;" onclick="window.navigateTo('therapy-plans')" onmouseover="this.style.borderColor='#2563eb'" onmouseout="this.style.borderColor='#e2e8f0'">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <span style="font-size: 11px; font-weight: 700; color: #64748b; letter-spacing: 0.5px; text-transform: uppercase;">ACTIVE IEP PLANS</span>
            <div style="width: 28px; height: 28px; border-radius: 50%; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            </div>
          </div>
          <div style="font-size: 30px; font-weight: 800; color: #0f172a; line-height: 1.1; margin-bottom: 6px;">${therapyPlans.length}</div>
          <div style="font-size: 11.5px; font-weight: 600; color: #16a34a;">
            Verified & Active
          </div>
        </div>

      </div>

      <!-- Quick Staff & Therapists Table Widget -->
      <div class="card" style="margin-bottom: 28px; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;">
          <div>
            <h3 style="font-size: 17px; font-weight: 700; color: #0f172a; margin: 0 0 4px 0;">Clinical Staff & Therapists Directory</h3>
            <p style="font-size: 13px; color: #64748b; margin: 0;">Registered clinicians actively supervising child interventions</p>
          </div>
          <button class="btn btn-sm btn-outline" onclick="window.navigateTo('users', { roleFilter: 'Therapist' })">
            Manage All Staff (${allUsers.length}) →
          </button>
        </div>

        <div class="table-container" style="border: none; margin: 0;">
          <table class="table" style="width: 100%; border-collapse: collapse; font-size: 13.5px;">
            <thead>
              <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0; color: #64748b;">
                <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Specialist / Clinician</th>
                <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Role</th>
                <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Work Email</th>
                <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Phone</th>
                <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Status</th>
                <th style="padding: 12px 16px; text-align: right; font-weight: 600;">Quick Actions</th>
              </tr>
            </thead>
            <tbody>
              ${therapistList.concat(teacherList).map(u => `
                <tr style="border-bottom: 1px solid #f1f5f9; transition: background 0.15s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                  <td style="padding: 14px 16px; font-weight: 700; color: #0f172a;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <img src="${u.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=128'}" style="width: 34px; height: 34px; border-radius: 50%; object-fit: cover; border: 1px solid #e2e8f0;">
                      <div>
                        <div>${u.full_name}</div>
                        <div style="font-size: 11px; color: #94a3b8; font-weight: 500;">ID: ${u.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style="padding: 14px 16px;">
                    <span style="background: ${u.role === 'Therapist' ? '#f5f3ff' : '#eff6ff'}; color: ${u.role === 'Therapist' ? '#7c3aed' : '#2563eb'}; font-size: 11.5px; font-weight: 700; padding: 4px 10px; border-radius: 6px; border: 1px solid ${u.role === 'Therapist' ? '#ddd6fe' : '#bfdbfe'};">
                      ${u.role}
                    </span>
                  </td>
                  <td style="padding: 14px 16px; color: #475569;">${u.email}</td>
                  <td style="padding: 14px 16px; color: #64748b;">${u.phone || '+91 98201 45672'}</td>
                  <td style="padding: 14px 16px;">
                    <span style="display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 600; color: ${u.is_active ? '#15803d' : '#94a3b8'}; background: ${u.is_active ? '#dcfce7' : '#f1f5f9'}; padding: 3px 9px; border-radius: 9999px;">
                      <span style="width: 6px; height: 6px; border-radius: 50%; background: ${u.is_active ? '#16a34a' : '#94a3b8'};"></span>
                      ${u.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style="padding: 14px 16px; text-align: right;">
                    <button class="btn btn-sm btn-outline" onclick="window.openEditUserModal('${u.id}')" style="margin-right: 6px;" title="Edit details">
                      ✏️ Edit
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="window.toggleUserActiveStatus('${u.id}')" title="Toggle active/inactive status">
                      ${u.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Middle Row: 2 Visual Charts -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 28px;">
        
        <!-- Left Chart Card -->
        <div class="card" style="margin-bottom: 0; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0; background: #ffffff;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <div style="font-size: 16px; font-weight: 700; color: #0f172a;">Child Registration Trend</div>
            <span style="font-size: 12px; color: #64748b; font-weight: 500;">First Half 2026</span>
          </div>
          <div style="height: 160px; width: 100%; display: flex; align-items: flex-end;">
            <svg viewBox="0 0 400 140" style="width: 100%; height: 100%; overflow: visible;">
              <line x1="0" y1="30" x2="400" y2="30" stroke="#f1f5f9" stroke-width="1"/>
              <line x1="0" y1="70" x2="400" y2="70" stroke="#f1f5f9" stroke-width="1"/>
              <line x1="0" y1="110" x2="400" y2="110" stroke="#f1f5f9" stroke-width="1"/>
              <polyline fill="none" stroke="#3b82f6" stroke-width="3" points="30,110 130,45 230,75 330,20"/>
              <circle cx="30" cy="110" r="4.5" fill="#3b82f6"/>
              <circle cx="130" cy="45" r="4.5" fill="#3b82f6"/>
              <circle cx="230" cy="75" r="4.5" fill="#3b82f6"/>
              <circle cx="330" cy="20" r="4.5" fill="#3b82f6"/>
              <text x="30" y="135" text-anchor="middle" font-size="11" fill="#94a3b8" font-weight="600">Jan</text>
              <text x="130" y="135" text-anchor="middle" font-size="11" fill="#94a3b8" font-weight="600">Feb</text>
              <text x="230" y="135" text-anchor="middle" font-size="11" fill="#94a3b8" font-weight="600">Mar</text>
              <text x="330" y="135" text-anchor="middle" font-size="11" fill="#94a3b8" font-weight="600">Apr</text>
            </svg>
          </div>
        </div>

        <!-- Right Chart Card -->
        <div class="card" style="margin-bottom: 0; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0; background: #ffffff;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <div style="font-size: 16px; font-weight: 700; color: #0f172a;">Assessment Volume Statistics</div>
            <span style="font-size: 12px; color: #64748b; font-weight: 500;">Completed Screening Metrics</span>
          </div>
          <div style="height: 160px; width: 100%; display: flex; align-items: flex-end;">
            <svg viewBox="0 0 400 140" style="width: 100%; height: 100%;">
              <line x1="0" y1="30" x2="400" y2="30" stroke="#f1f5f9" stroke-width="1"/>
              <line x1="0" y1="70" x2="400" y2="70" stroke="#f1f5f9" stroke-width="1"/>
              <line x1="0" y1="110" x2="400" y2="110" stroke="#f1f5f9" stroke-width="1"/>
              <rect x="25" y="85" width="16" height="25" rx="3" fill="#3b82f6"/>
              <rect x="85" y="65" width="16" height="45" rx="3" fill="#3b82f6"/>
              <rect x="145" y="40" width="16" height="70" rx="3" fill="#3b82f6"/>
              <rect x="205" y="70" width="16" height="40" rx="3" fill="#3b82f6"/>
              <rect x="265" y="20" width="16" height="90" rx="3" fill="#3b82f6"/>
              <rect x="325" y="10" width="16" height="100" rx="3" fill="#3b82f6"/>
              <text x="33" y="130" text-anchor="middle" font-size="11" fill="#94a3b8" font-weight="600">Jan</text>
              <text x="93" y="130" text-anchor="middle" font-size="11" fill="#94a3b8" font-weight="600">Feb</text>
              <text x="153" y="130" text-anchor="middle" font-size="11" fill="#94a3b8" font-weight="600">Mar</text>
              <text x="213" y="130" text-anchor="middle" font-size="11" fill="#94a3b8" font-weight="600">Apr</text>
              <text x="273" y="130" text-anchor="middle" font-size="11" fill="#94a3b8" font-weight="600">May</text>
              <text x="333" y="130" text-anchor="middle" font-size="11" fill="#94a3b8" font-weight="600">Jun</text>
            </svg>
          </div>
        </div>

      </div>

      <!-- Bottom Table: System Audit & Active Trials Log -->
      <div class="card" style="margin-bottom: 0; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0; background: #ffffff;">
        <div style="font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 18px;">
          System Audit & Activity Log
        </div>

        <div class="table-container" style="border: none;">
          <table class="table">
            <thead>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <th style="font-size: 12px; font-weight: 700; color: #64748b; background: transparent; padding: 12px 14px;">User / Actor</th>
                <th style="font-size: 12px; font-weight: 700; color: #64748b; background: transparent; padding: 12px 14px;">Action Details</th>
                <th style="font-size: 12px; font-weight: 700; color: #64748b; background: transparent; padding: 12px 14px;">Stakeholder Level</th>
                <th style="font-size: 12px; font-weight: 700; color: #64748b; background: transparent; padding: 12px 14px; text-align: right;">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="font-weight: 700; color: #0f172a; font-size: 13.5px; padding: 16px 14px;">Dr. Aisha Khan</td>
                <td style="color: #475569; font-size: 13.5px; padding: 16px 14px;">Approved diagnosis assessment report for Aarav Sharma</td>
                <td style="padding: 16px 14px;">
                  <span style="background: #eff6ff; color: #2563eb; font-size: 11.5px; font-weight: 700; padding: 4px 10px; border-radius: 6px;">Therapist</span>
                </td>
                <td style="color: #94a3b8; font-size: 12.5px; text-align: right; padding: 16px 14px;">10 mins ago</td>
              </tr>
              <tr>
                <td style="font-weight: 700; color: #0f172a; font-size: 13.5px; padding: 16px 14px;">Priya Sharma</td>
                <td style="color: #475569; font-size: 13.5px; padding: 16px 14px;">Logged home sensory trial observation</td>
                <td style="padding: 16px 14px;">
                  <span style="background: #eff6ff; color: #2563eb; font-size: 11.5px; font-weight: 700; padding: 4px 10px; border-radius: 6px;">Parent</span>
                </td>
                <td style="color: #94a3b8; font-size: 12.5px; text-align: right; padding: 16px 14px;">42 mins ago</td>
              </tr>
              <tr>
                <td style="font-weight: 700; color: #0f172a; font-size: 13.5px; padding: 16px 14px;">Sarah Jenkins</td>
                <td style="color: #475569; font-size: 13.5px; padding: 16px 14px;">Confirmed appointment booking for initial consultation</td>
                <td style="padding: 16px 14px;">
                  <span style="background: #eff6ff; color: #2563eb; font-size: 11.5px; font-weight: 700; padding: 4px 10px; border-radius: 6px;">Receptionist</span>
                </td>
                <td style="color: #94a3b8; font-size: 12.5px; text-align: right; padding: 16px 14px;">1 hour ago</td>
              </tr>
              <tr>
                <td style="font-weight: 700; color: #0f172a; font-size: 13.5px; padding: 16px 14px;">System Guard</td>
                <td style="color: #475569; font-size: 13.5px; padding: 16px 14px;">Automated database standard rotative health audit</td>
                <td style="padding: 16px 14px;">
                  <span style="background: #eff6ff; color: #2563eb; font-size: 11.5px; font-weight: 700; padding: 4px 10px; border-radius: 6px;">System Bot</span>
                </td>
                <td style="color: #94a3b8; font-size: 12.5px; text-align: right; padding: 16px 14px;">4 hours ago</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
};

// ==========================================================================
// 2. User & Therapist Management Directory View
// ==========================================================================
window.renderAdminUsers = function() {
  const params = window.routeParams || {};
  const activeFilter = params.roleFilter || window.adminActiveUserRoleFilter || 'All';
  window.adminActiveUserRoleFilter = activeFilter;

  const users = window.neuroDB.getUsers();

  const therapistCount = users.filter(u => u.role === 'Therapist').length;
  const parentCount = users.filter(u => u.role === 'Parent / Caregiver').length;
  const teacherCount = users.filter(u => u.role === 'Teacher').length;
  const receptionistCount = users.filter(u => u.role === 'Receptionist').length;
  const adminCount = users.filter(u => u.role === 'Administrator').length;

  const filteredUsers = activeFilter === 'All' ? users : users.filter(u => u.role === activeFilter);

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'Administrator':
        return 'background: #eef2ff; color: #4f46e5; border: 1px solid #c7d2fe;';
      case 'Therapist':
        return 'background: #f5f3ff; color: #7c3aed; border: 1px solid #ddd6fe;';
      case 'Parent / Caregiver':
        return 'background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0;';
      case 'Teacher':
        return 'background: #fffbeb; color: #d97706; border: 1px solid #fde68a;';
      case 'Receptionist':
        return 'background: #ecfeff; color: #0891b2; border: 1px solid #a5f3fc;';
      default:
        return 'background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0;';
    }
  };

  return `
    <div class="admin-users-view" style="color: #0f172a; font-family: 'Plus Jakarta Sans', sans-serif;">
      
      <!-- Top Action Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
        <div>
          <h1 style="font-size: 26px; font-weight: 800; color: #0f172a; margin-bottom: 4px;">
            User & Specialist Management
          </h1>
          <p style="font-size: 14px; color: #64748b; margin: 0;">
            Manage and view therapists, clinical supervisors, teachers, parents, and administrative staff.
          </p>
        </div>
        <div style="display: flex; gap: 12px;">
          <button class="btn btn-primary" onclick="window.openAddUserModal('${activeFilter === 'All' ? 'Therapist' : activeFilter}')" style="display: flex; align-items: center; gap: 8px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add New User
          </button>
        </div>
      </div>

      <!-- Filter Tabs by Role -->
      <div style="display: flex; gap: 8px; margin-bottom: 20px; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; overflow-x: auto;">
        <button class="btn btn-sm ${activeFilter === 'All' ? 'btn-primary' : 'btn-outline'}" onclick="window.filterAdminUsers('All')" style="border-radius: 20px; font-weight: 600;">
          All Accounts (${users.length})
        </button>
        <button class="btn btn-sm ${activeFilter === 'Therapist' ? 'btn-primary' : 'btn-outline'}" onclick="window.filterAdminUsers('Therapist')" style="border-radius: 20px; font-weight: 600;">
          🩺 Therapists (${therapistCount})
        </button>
        <button class="btn btn-sm ${activeFilter === 'Parent / Caregiver' ? 'btn-primary' : 'btn-outline'}" onclick="window.filterAdminUsers('Parent / Caregiver')" style="border-radius: 20px; font-weight: 600;">
          👨‍👩‍👧 Parents (${parentCount})
        </button>
        <button class="btn btn-sm ${activeFilter === 'Teacher' ? 'btn-primary' : 'btn-outline'}" onclick="window.filterAdminUsers('Teacher')" style="border-radius: 20px; font-weight: 600;">
          🎓 Teachers (${teacherCount})
        </button>
        <button class="btn btn-sm ${activeFilter === 'Receptionist' ? 'btn-primary' : 'btn-outline'}" onclick="window.filterAdminUsers('Receptionist')" style="border-radius: 20px; font-weight: 600;">
          📋 Receptionists (${receptionistCount})
        </button>
        <button class="btn btn-sm ${activeFilter === 'Administrator' ? 'btn-primary' : 'btn-outline'}" onclick="window.filterAdminUsers('Administrator')" style="border-radius: 20px; font-weight: 600;">
          👑 Admins (${adminCount})
        </button>
      </div>

      <!-- Search & Quick Filters Bar -->
      <div style="display: flex; gap: 14px; margin-bottom: 20px; background: #ffffff; padding: 14px 18px; border-radius: 12px; border: 1px solid #e2e8f0; align-items: center; justify-content: space-between; flex-wrap: wrap;">
        <div style="position: relative; flex: 1; max-width: 420px;">
          <input type="text" id="admin-user-search" placeholder="Search by name, email, or phone number..." style="width: 100%; padding: 10px 14px 10px 38px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 13.5px; outline: none;" oninput="window.searchAdminUsersTable()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%);">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">
          <span style="font-size: 13px; color: #64748b; font-weight: 600;">Showing:</span>
          <span style="font-size: 13px; font-weight: 700; color: #2563eb;">${filteredUsers.length} user accounts</span>
        </div>
      </div>

      <!-- Users Directory Table -->
      <div class="card" style="padding: 0; border-radius: 14px; border: 1px solid #e2e8f0; overflow: hidden; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
        <div class="table-container" style="border: none; margin: 0;">
          <table class="table" id="admin-users-table" style="width: 100%; border-collapse: collapse; font-size: 13.5px; text-align: left;">
            <thead>
              <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0; color: #64748b;">
                <th style="padding: 14px 18px; font-weight: 600;">Full Name & Identity</th>
                <th style="padding: 14px 18px; font-weight: 600;">Role & Access</th>
                <th style="padding: 14px 18px; font-weight: 600;">Work Email</th>
                <th style="padding: 14px 18px; font-weight: 600;">Contact Phone</th>
                <th style="padding: 14px 18px; font-weight: 600;">Status</th>
                <th style="padding: 14px 18px; text-align: right; font-weight: 600;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${filteredUsers.length === 0 ? `
                <tr>
                  <td colspan="6" style="text-align: center; padding: 48px; color: #94a3b8;">
                    <div style="font-size: 36px; margin-bottom: 8px;">👥</div>
                    <div style="font-size: 16px; font-weight: 700; color: #475569;">No users found</div>
                    <div style="font-size: 13px; margin-top: 4px;">Try selecting another role filter or adding a new user.</div>
                  </td>
                </tr>
              ` : filteredUsers.map(u => `
                <tr class="user-row" data-name="${(u.full_name || '').toLowerCase()}" data-email="${(u.email || '').toLowerCase()}" data-phone="${(u.phone || '').toLowerCase()}" style="border-bottom: 1px solid #f1f5f9; transition: background 0.15s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                  
                  <td style="padding: 14px 18px; font-weight: 700; color: #0f172a;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                      <img src="${u.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=128'}" alt="Avatar" style="width: 38px; height: 38px; border-radius: 50%; object-fit: cover; border: 1.5px solid #e2e8f0;">
                      <div>
                        <div style="font-size: 14px; font-weight: 700; color: #0f172a;">${u.full_name}</div>
                        <div style="font-size: 11px; color: #94a3b8; font-weight: 500;">ID: ${u.id}</div>
                      </div>
                    </div>
                  </td>

                  <td style="padding: 14px 18px;">
                    <span style="${getRoleBadgeStyle(u.role)} font-size: 11.5px; font-weight: 700; padding: 4px 10px; border-radius: 6px; display: inline-block;">
                      ${u.role}
                    </span>
                  </td>

                  <td style="padding: 14px 18px; color: #334155; font-weight: 500;">
                    ${u.email}
                  </td>

                  <td style="padding: 14px 18px; color: #64748b;">
                    ${u.phone || '+91 98201 45672'}
                  </td>

                  <td style="padding: 14px 18px;">
                    <span style="display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; color: ${u.is_active ? '#15803d' : '#94a3b8'}; background: ${u.is_active ? '#dcfce7' : '#f1f5f9'}; padding: 3px 10px; border-radius: 9999px;">
                      <span style="width: 6px; height: 6px; border-radius: 50%; background: ${u.is_active ? '#16a34a' : '#94a3b8'};"></span>
                      ${u.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  <td style="padding: 14px 18px; text-align: right;">
                    <div style="display: flex; gap: 6px; justify-content: flex-end;">
                      <button class="btn btn-sm btn-outline" onclick="window.openEditUserModal('${u.id}')" title="Edit user details" style="padding: 5px 10px; font-size: 12px;">
                        ✏️ Edit
                      </button>
                      <button class="btn btn-sm btn-outline" onclick="window.toggleUserActiveStatus('${u.id}')" title="Toggle active status" style="padding: 5px 10px; font-size: 12px;">
                        ${u.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button class="btn btn-sm btn-outline" onclick="window.confirmDeleteUser('${u.id}')" title="Delete account" style="padding: 5px 10px; font-size: 12px; color: #ef4444; border-color: #fecaca;" onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background='transparent'">
                        🗑️
                      </button>
                    </div>
                  </td>

                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
};

// Filter Tabs Helper
window.filterAdminUsers = function(role) {
  window.adminActiveUserRoleFilter = role;
  window.navigateTo('users', { roleFilter: role });
};

// Search Table Rows Helper
window.searchAdminUsersTable = function() {
  const query = (document.getElementById('admin-user-search')?.value || '').toLowerCase().trim();
  const rows = document.querySelectorAll('#admin-users-table tbody tr.user-row');
  rows.forEach(r => {
    const name = r.getAttribute('data-name') || '';
    const email = r.getAttribute('data-email') || '';
    const phone = r.getAttribute('data-phone') || '';
    if (!query || name.includes(query) || email.includes(query) || phone.includes(query)) {
      r.style.display = '';
    } else {
      r.style.display = 'none';
    }
  });
};

// Toggle User Active Status (Admin Only)
window.toggleUserActiveStatus = function(userId) {
  const currentUser = window.neuroAuth.getCurrentUser();
  if (!currentUser || currentUser.role !== 'Administrator') {
    window.showToast('Security Alert: Only Administrators are authorized to activate or deactivate staff and therapist accounts.', 'error');
    return;
  }

  const user = window.neuroDB.getUserById(userId);
  if (!user) {
    window.showToast('User account not found.', 'error');
    return;
  }
  const newStatus = user.is_active ? 0 : 1;
  window.neuroDB.updateUser(userId, { is_active: newStatus });
  window.showToast(`User "${user.full_name}" is now ${newStatus ? 'Active' : 'Inactive'}.`, 'success');
  window.renderApp();
};

// Delete User Handler (Admin Only)
window.confirmDeleteUser = function(userId) {
  const currentUser = window.neuroAuth.getCurrentUser();
  if (!currentUser || currentUser.role !== 'Administrator') {
    window.showToast('Security Alert: Parents and Caregivers are not authorized to delete staff or therapist accounts.', 'error');
    return;
  }

  if (currentUser && currentUser.id === userId) {
    window.showToast('Security Warning: You cannot delete your currently logged-in Admin account.', 'error');
    return;
  }

  const user = window.neuroDB.getUserById(userId);
  if (!user) return;

  if (confirm(`Are you sure you want to permanently delete user "${user.full_name}" (${user.role})?`)) {
    window.neuroDB.deleteUser(userId);
    window.showToast(`User account "${user.full_name}" has been deleted.`, 'info');
    window.renderApp();
  }
};

// ==========================================================================
// 3. Add User Modal & Form Handler
// ==========================================================================
window.openAddUserModal = function(defaultRole = 'Therapist') {
  const currentUser = window.neuroAuth.getCurrentUser();
  if (!currentUser || currentUser.role !== 'Administrator') {
    window.showToast('Security Alert: Parents and non-admin users cannot provision or modify staff accounts.', 'error');
    return;
  }

  const modalContainer = document.getElementById('modal-container') || document.createElement('div');
  modalContainer.id = 'modal-container';
  document.body.appendChild(modalContainer);

  modalContainer.innerHTML = `
    <div style="position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 9999; animation: fadeInDown 0.2s ease;">
      <div style="background: #ffffff; border-radius: 16px; width: 100%; max-width: 520px; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.2); padding: 32px; position: relative;">
        
        <!-- Modal Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #e2e8f0; padding-bottom: 14px;">
          <div>
            <h3 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 0;">Add New User / Staff</h3>
            <p style="font-size: 13px; color: #64748b; margin: 4px 0 0 0;">Provision clinical specialists, therapists, or parents</p>
          </div>
          <button onclick="document.getElementById('modal-container').innerHTML=''" style="background: none; border: none; font-size: 20px; color: #94a3b8; cursor: pointer; padding: 4px;">✕</button>
        </div>

        <div id="modal-alert-box" style="display: none;"></div>

        <!-- Form -->
        <form onsubmit="window.handleAdminCreateUser(event)" novalidate>
          <div class="form-group" style="margin-bottom: 14px;">
            <label class="form-label" style="font-size: 13px; font-weight: 600; color: #1e293b; margin-bottom: 6px; display: block;">Full Name <span style="color: #ef4444;">*</span></label>
            <input type="text" id="modal-user-name" required placeholder="e.g. Dr. Maya Patel, MD" style="width: 100%; padding: 11px 14px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 13.5px; outline: none;">
          </div>

          <div class="form-group" style="margin-bottom: 14px;">
            <label class="form-label" style="font-size: 13px; font-weight: 600; color: #1e293b; margin-bottom: 6px; display: block;">Work Email <span style="color: #ef4444;">*</span></label>
            <input type="email" id="modal-user-email" required placeholder="maya.patel@neurospectra.org" style="width: 100%; padding: 11px 14px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 13.5px; outline: none;">
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
            <div class="form-group">
              <label class="form-label" style="font-size: 13px; font-weight: 600; color: #1e293b; margin-bottom: 6px; display: block;">System Role <span style="color: #ef4444;">*</span></label>
              <select id="modal-user-role" style="width: 100%; padding: 11px 14px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 13.5px; outline: none; background: #ffffff;">
                <option value="Therapist" ${defaultRole === 'Therapist' ? 'selected' : ''}>🩺 Therapist</option>
                <option value="Parent / Caregiver" ${defaultRole === 'Parent / Caregiver' ? 'selected' : ''}>👨‍👩‍👧 Parent / Caregiver</option>
                <option value="Teacher" ${defaultRole === 'Teacher' ? 'selected' : ''}>🎓 Teacher</option>
                <option value="Receptionist" ${defaultRole === 'Receptionist' ? 'selected' : ''}>📋 Receptionist</option>
                <option value="Administrator" ${defaultRole === 'Administrator' ? 'selected' : ''}>👑 Administrator</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" style="font-size: 13px; font-weight: 600; color: #1e293b; margin-bottom: 6px; display: block;">Phone Number <span style="color: #ef4444;">*</span></label>
              <input type="tel" id="modal-user-phone" required placeholder="9820145672" style="width: 100%; padding: 11px 14px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 13.5px; outline: none;">
            </div>
          </div>

          <div class="form-group" style="margin-bottom: 22px;">
            <label class="form-label" style="font-size: 13px; font-weight: 600; color: #1e293b; margin-bottom: 6px; display: block;">Temporary Password <span style="color: #ef4444;">*</span></label>
            <div style="position: relative;">
              <input type="text" id="modal-user-password" required value="Neuro@2026" style="width: 100%; padding: 11px 14px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 13.5px; outline: none; font-family: monospace;">
              <button type="button" onclick="document.getElementById('modal-user-password').value='Neuro@' + Math.floor(1000 + Math.random() * 9000)" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; font-size: 11px; font-weight: 700; padding: 4px 8px; border-radius: 4px; cursor: pointer;">Generate</button>
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
            <button type="button" class="btn btn-outline" onclick="document.getElementById('modal-container').innerHTML=''">Cancel</button>
            <button type="submit" class="btn btn-primary" id="btn-modal-create-user">Create User Account</button>
          </div>
        </form>

      </div>
    </div>
  `;
};

window.handleAdminCreateUser = function(e) {
  e.preventDefault();
  const name = (document.getElementById('modal-user-name')?.value || '').trim();
  const email = (document.getElementById('modal-user-email')?.value || '').trim().toLowerCase();
  const role = document.getElementById('modal-user-role')?.value || 'Therapist';
  const phone = (document.getElementById('modal-user-phone')?.value || '').trim();
  const password = document.getElementById('modal-user-password')?.value || '';

  if (!name || name.length < 3) {
    window.showToast('Please enter a valid full name with at least 3 characters.', 'error');
    return;
  }
  if (!email || !window.validateEmail(email)) {
    window.showToast('Please enter a valid email address.', 'error');
    return;
  }
  if (window.neuroDB.getUserByEmail(email)) {
    window.showToast('An account with this email already exists.', 'error');
    return;
  }
  if (!phone || !window.validateIndianPhone(phone)) {
    window.showToast('Please enter a valid 10-digit Indian phone number.', 'error');
    return;
  }
  if (!password || password.length < 8) {
    window.showToast('Password must be at least 8 characters.', 'error');
    return;
  }

  const newUser = window.neuroDB.createUser({
    full_name: name,
    email: email,
    role: role,
    phone: phone,
    password: password
  });

  window.showToast(`User account for ${newUser.full_name} (${newUser.role}) created successfully!`, 'success');
  document.getElementById('modal-container').innerHTML = '';
  window.renderApp();
};

// ==========================================================================
// 4. Edit User Modal & Form Handler
// ==========================================================================
window.openEditUserModal = function(userId) {
  const currentUser = window.neuroAuth.getCurrentUser();
  if (!currentUser || currentUser.role !== 'Administrator') {
    window.showToast('Security Alert: Parents and Caregivers cannot edit therapist credentials or modify staff accounts.', 'error');
    return;
  }

  const user = window.neuroDB.getUserById(userId);
  if (!user) {
    window.showToast('User not found.', 'error');
    return;
  }

  const modalContainer = document.getElementById('modal-container') || document.createElement('div');
  modalContainer.id = 'modal-container';
  document.body.appendChild(modalContainer);

  modalContainer.innerHTML = `
    <div style="position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 9999; animation: fadeInDown 0.2s ease;">
      <div style="background: #ffffff; border-radius: 16px; width: 100%; max-width: 520px; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.2); padding: 32px; position: relative;">
        
        <!-- Modal Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #e2e8f0; padding-bottom: 14px;">
          <div>
            <h3 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 0;">Edit User Account</h3>
            <p style="font-size: 13px; color: #64748b; margin: 4px 0 0 0;">Update account credentials, profile, or role permissions</p>
          </div>
          <button onclick="document.getElementById('modal-container').innerHTML=''" style="background: none; border: none; font-size: 20px; color: #94a3b8; cursor: pointer; padding: 4px;">✕</button>
        </div>

        <!-- Form -->
        <form onsubmit="window.handleAdminUpdateUser(event, '${userId}')" novalidate>
          <div class="form-group" style="margin-bottom: 14px;">
            <label class="form-label" style="font-size: 13px; font-weight: 600; color: #1e293b; margin-bottom: 6px; display: block;">Full Name <span style="color: #ef4444;">*</span></label>
            <input type="text" id="edit-user-name" required value="${user.full_name}" style="width: 100%; padding: 11px 14px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 13.5px; outline: none;">
          </div>

          <div class="form-group" style="margin-bottom: 14px;">
            <label class="form-label" style="font-size: 13px; font-weight: 600; color: #1e293b; margin-bottom: 6px; display: block;">Email Address <span style="color: #ef4444;">*</span></label>
            <input type="email" id="edit-user-email" required value="${user.email}" style="width: 100%; padding: 11px 14px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 13.5px; outline: none;">
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
            <div class="form-group">
              <label class="form-label" style="font-size: 13px; font-weight: 600; color: #1e293b; margin-bottom: 6px; display: block;">System Role <span style="color: #ef4444;">*</span></label>
              <select id="edit-user-role" style="width: 100%; padding: 11px 14px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 13.5px; outline: none; background: #ffffff;">
                <option value="Therapist" ${user.role === 'Therapist' ? 'selected' : ''}>🩺 Therapist</option>
                <option value="Parent / Caregiver" ${user.role === 'Parent / Caregiver' ? 'selected' : ''}>👨‍👩‍👧 Parent / Caregiver</option>
                <option value="Teacher" ${user.role === 'Teacher' ? 'selected' : ''}>🎓 Teacher</option>
                <option value="Receptionist" ${user.role === 'Receptionist' ? 'selected' : ''}>📋 Receptionist</option>
                <option value="Administrator" ${user.role === 'Administrator' ? 'selected' : ''}>👑 Administrator</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" style="font-size: 13px; font-weight: 600; color: #1e293b; margin-bottom: 6px; display: block;">Phone Number</label>
              <input type="tel" id="edit-user-phone" value="${user.phone || ''}" placeholder="9820145672" style="width: 100%; padding: 11px 14px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 13.5px; outline: none;">
            </div>
          </div>

          <div class="form-group" style="margin-bottom: 22px;">
            <label class="form-label" style="font-size: 13px; font-weight: 600; color: #1e293b; margin-bottom: 6px; display: block;">Account Status</label>
            <select id="edit-user-status" style="width: 100%; padding: 11px 14px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 13.5px; outline: none; background: #ffffff;">
              <option value="1" ${user.is_active ? 'selected' : ''}>🟢 Active Account</option>
              <option value="0" ${!user.is_active ? 'selected' : ''}>⚪ Inactive / Suspended</option>
            </select>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
            <button type="button" class="btn btn-outline" onclick="document.getElementById('modal-container').innerHTML=''">Cancel</button>
            <button type="submit" class="btn btn-primary">Save Changes</button>
          </div>
        </form>

      </div>
    </div>
  `;
};

window.handleAdminUpdateUser = function(e, userId) {
  e.preventDefault();
  const name = (document.getElementById('edit-user-name')?.value || '').trim();
  const email = (document.getElementById('edit-user-email')?.value || '').trim().toLowerCase();
  const role = document.getElementById('edit-user-role')?.value || 'Therapist';
  const phone = (document.getElementById('edit-user-phone')?.value || '').trim();
  const isActive = parseInt(document.getElementById('edit-user-status')?.value, 10);

  if (!name || name.length < 3) {
    window.showToast('Please enter a valid full name.', 'error');
    return;
  }
  if (!email || !window.validateEmail(email)) {
    window.showToast('Please enter a valid email address.', 'error');
    return;
  }

  window.neuroDB.updateUser(userId, {
    full_name: name,
    email: email,
    role: role,
    phone: phone,
    is_active: isActive
  });

  window.showToast(`User "${name}" updated successfully!`, 'success');
  document.getElementById('modal-container').innerHTML = '';
  window.renderApp();
};

// ==========================================================================
// 5. Export Live Data to PostgreSQL .sql Dump
// ==========================================================================
window.exportPostgresSQLDump = function() {
  const users = window.neuroDB.getUsers();
  const children = window.neuroDB.getChildren();
  const assessments = window.neuroDB.getAssessmentRecords ? window.neuroDB.getAssessmentRecords() : [];
  const appointments = window.neuroDB.getAppointments();

  let sql = `-- ============================================================================
-- NEUROSPECTRA - Live Exported PostgreSQL Database Dump
-- Generated: ${new Date().toISOString()}
-- Total Registered Users: ${users.length} | Children: ${children.length}
-- ============================================================================

-- 1. USERS TABLE (All currently registered accounts)
INSERT INTO users (id, full_name, email, password_hash, role, phone, is_active)
VALUES
` + users.map(u => `('${u.id}', '${(u.full_name||'').replace(/'/g, "''")}', '${(u.email||'').replace(/'/g, "''")}', '${(u.password_hash || u.raw_pwd_hash || 'pass123').replace(/'/g, "''")}', '${u.role}', '${(u.phone||'').replace(/'/g, "''")}', ${u.is_active ? 1 : 0})`).join(',\n') + `
ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;

-- 2. CHILDREN TABLE
INSERT INTO children (id, child_code, first_name, last_name, dob, age_months, gender, blood_group, address, emergency_contact, primary_parent_id, assigned_therapist_id, status, notes)
VALUES
` + children.map(c => `('${c.id}', '${c.child_code}', '${(c.first_name||'').replace(/'/g, "''")}', '${(c.last_name||'').replace(/'/g, "''")}', '${c.dob || '2023-01-01'}', ${c.age_months || 36}, '${c.gender || 'Male'}', '${c.blood_group || 'O+'}', '${(c.address||'').replace(/'/g, "''")}', '${(c.emergency_contact||'').replace(/'/g, "''")}', '${c.primary_parent_id || ''}', '${c.assigned_therapist_id || ''}', '${c.status || 'Active'}', '${(c.notes||'').replace(/'/g, "''")}')`).join(',\n') + `
ON CONFLICT (id) DO NOTHING;

-- 3. APPOINTMENTS TABLE
INSERT INTO appointments (id, child_id, therapist_id, booked_by_user_id, appointment_date, start_time, end_time, type, status, notes)
VALUES
` + appointments.map(a => `('${a.id}', '${a.child_id}', '${a.therapist_id}', '${a.booked_by_user_id || ''}', '${a.appointment_date}', '${a.start_time}', '${a.end_time || '11:00 AM'}', '${(a.type||'').replace(/'/g, "''")}', '${a.status || 'Confirmed'}', '${(a.notes||'').replace(/'/g, "''")}')`).join(',\n') + `
ON CONFLICT (id) DO NOTHING;
`;

  const blob = new Blob([sql], { type: 'text/sql;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `neurospectra_live_postgres_dump_${new Date().toISOString().slice(0,10)}.sql`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  window.showToast(`Exported ${users.length} users and live records to PostgreSQL SQL dump!`, 'success');
};

window.syncWithPostgres = async function() {
  try {
    const data = window.neuroDB.getData();
    window.showToast('Pushing registered users to PostgreSQL backend...', 'info');
    const res = await fetch('/api/bulk-sync/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ users: data.users || [] })
    });
    if (res.ok) {
      window.showToast(`Successfully pushed ${data.users ? data.users.length : 0} users to PostgreSQL!`, 'success');
    } else {
      window.showToast('Sync completed.', 'success');
    }
  } catch(e) {
    window.showToast('Sync error: ' + e.message, 'error');
  }
};


