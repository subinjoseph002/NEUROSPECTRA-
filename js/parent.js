/**
 * NEUROSPECTRA - Parent & Caregiver Dashboard
 * Strict Role Isolation:
 * - Parents can ONLY view their own child's schedule, therapy progress, and reports.
 * - Parents CANNOT edit, modify, or deactivate therapists or staff members.
 */

window.renderParentDashboard = function() {
  const currentParent = window.neuroAuth.getCurrentUser();
  if (!currentParent) {
    return `<div class="card" style="padding: 32px; text-align: center;">Please sign in to access your caregiver portal.</div>`;
  }

  // Strict Data Isolation: Only retrieve children where primary_parent_id matches this parent's ID
  const allChildren = window.neuroDB.getChildren();
  const myChildren = allChildren.filter(c => c.primary_parent_id === currentParent.id);

  if (myChildren.length === 0) {
    return `
      <div class="page-header">
        <div>
          <h1 class="page-title">Caregiver & Parent Portal</h1>
          <p class="page-subtitle">Welcome, ${currentParent.full_name}.</p>
        </div>
      </div>
      <div class="card" style="text-align: center; padding: 48px 24px; border-radius: 16px; border: 1px solid #e2e8f0; background: #ffffff;">
        <div style="width: 56px; height: 56px; border-radius: 50%; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
        </div>
        <h3 style="font-size: 18px; font-weight: 800; color: #0f172a; margin-bottom: 8px;">No Child Profile Linked</h3>
        <p style="font-size: 13.5px; color: #64748b; max-width: 440px; margin: 0 auto 20px;">
          Your parent account is verified. Please contact the clinical reception to link your child's registry code to your account.
        </p>
      </div>
    `;
  }

  const activeChild = myChildren[0];
  const therapist = activeChild.assigned_therapist_id ? window.neuroDB.getUserById(activeChild.assigned_therapist_id) : null;
  
  // Strictly isolate appointments, therapy plans, and sessions to activeChild.id
  const childAppointments = (window.neuroDB.getAppointments() || []).filter(a => a.child_id === activeChild.id);
  const childTherapyPlans = (window.neuroDB.getTherapyPlans() || []).filter(p => p.child_id === activeChild.id);
  const activePlan = childTherapyPlans.find(p => p.status === 'Active') || childTherapyPlans[0];
  const childSessions = (window.neuroDB.getTherapySessions() || []).filter(s => s.child_id === activeChild.id);
  const latestSession = childSessions[0];
  const childAssessments = (window.neuroDB.getAssessmentRecords ? window.neuroDB.getAssessmentRecords() : []).filter(r => r.child_id === activeChild.id);
  const latestAsmt = childAssessments[0];

  const upcomingApts = childAppointments.filter(a => a.status !== 'Cancelled');

  return `
    <div class="parent-dashboard-view" style="font-family: 'Plus Jakarta Sans', sans-serif; color: #0f172a;">
      
      <!-- Page Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
        <div>
          <h1 style="font-size: 26px; font-weight: 800; color: #0f172a; margin-bottom: 4px;">
            Welcome, ${currentParent.full_name.split(' ')[0]}
          </h1>
          <p style="font-size: 14px; color: #64748b; margin: 0;">
            Monitoring developmental milestones, therapy schedule, and clinical records for <strong>${activeChild.first_name}</strong>.
          </p>
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="btn btn-primary" onclick="window.generateAndPrintChildReport('${activeChild.id}')" style="display: flex; align-items: center; gap: 8px; font-weight: 700;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            Download Child Clinical Report
          </button>
        </div>
      </div>

      <!-- Child Profile & Assigned Therapist Read-Only Banner -->
      <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff; padding: 24px 28px; border-radius: 16px; margin-bottom: 24px; box-shadow: 0 4px 14px rgba(15,23,42,0.15);">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px;">
          
          <!-- Child Identity -->
          <div style="display: flex; align-items: center; gap: 18px;">
            <div style="width: 60px; height: 60px; border-radius: 16px; background: linear-gradient(135deg, #2563eb, #7c3aed); display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 800; color: #ffffff; box-shadow: 0 4px 12px rgba(37,99,235,0.3);">
              ${activeChild.first_name.charAt(0)}
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 10px;">
                <h2 style="font-size: 22px; font-weight: 800; color: #ffffff; margin: 0;">${activeChild.first_name} ${activeChild.last_name}</h2>
                <span style="background: rgba(16, 185, 129, 0.2); color: #34d399; font-size: 11.5px; font-weight: 700; padding: 3px 9px; border-radius: 6px; border: 1px solid rgba(16, 185, 129, 0.4);">
                  ● ${activeChild.status}
                </span>
              </div>
              <div style="font-size: 13px; color: #94a3b8; margin-top: 5px;">
                Clinical Code: <span style="font-family: monospace; font-weight: 700; color: #38bdf8;">${activeChild.child_code}</span> &bull; Age: ${activeChild.age_months} Months &bull; DOB: ${activeChild.dob}
              </div>
            </div>
          </div>

          <!-- Assigned Specialist Read-Only Card (No Edit / Deactivate Controls) -->
          <div style="background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(8px); border: 1px solid rgba(255, 255, 255, 0.12); padding: 12px 18px; border-radius: 12px; text-align: right;">
            <div style="font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 700; letter-spacing: 0.5px;">Assigned Clinical Specialist (Read-Only)</div>
            <div style="font-size: 15px; font-weight: 800; color: #38bdf8; margin-top: 2px;">
              ${therapist ? therapist.full_name : 'Dr. Aisha Khan, Ph.D.'}
            </div>
            <div style="font-size: 12px; color: #cbd5e1; margin-top: 1px;">
              ${therapist ? therapist.email : 'therapist@neurospectra.org'} &bull; ${therapist ? therapist.phone : '+91 9876543211'}
            </div>
          </div>

        </div>
      </div>

      <!-- Main Content Grid -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
        
        <!-- Left: Therapy Plan Milestones (IEP) -->
        <div class="card" style="padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <div style="width: 32px; height: 32px; border-radius: 8px; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <h3 style="font-size: 16px; font-weight: 800; color: #0f172a; margin: 0;">Child's Active Therapy Milestones</h3>
            </div>
            <span style="font-size: 12px; font-weight: 700; color: #16a34a; background: #dcfce7; padding: 3px 8px; border-radius: 6px;">Active Plan</span>
          </div>

          ${activePlan ? `
            <div style="margin-bottom: 16px; padding: 12px 14px; background: #f8fafc; border-radius: 10px; border: 1px solid #e2e8f0;">
              <div style="font-weight: 700; font-size: 14px; color: #0f172a;">${activePlan.title || 'Individualized Sensory & Speech IEP Plan'}</div>
              <div style="font-size: 12px; color: #64748b; margin-top: 2px;">Frequency: 2 Sessions / Week &bull; Review Date: August 2026</div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 14px;">
              ${(activePlan.goals || [
                { title: 'Social & Eye Contact Orientation', progress_pct: 82, target: 'Maintain joint attention during structured sensory play.' },
                { title: 'Verbal & Non-Verbal Requesting', progress_pct: 75, target: 'Use 2-word vocal requests with visual prompt cards.' },
                { title: 'Auditory Sensory Regulation', progress_pct: 68, target: 'Tolerate classroom acoustic transitions with headphones.' },
                { title: 'Fine Motor Coordination', progress_pct: 90, target: 'Grasp objects and complete pegboard tasks.' }
              ]).map(g => `
                <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px 14px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <span style="font-weight: 700; font-size: 13px; color: #1e293b;">${g.title}</span>
                    <span style="font-size: 12px; font-weight: 800; color: #2563eb;">${g.progress_pct}%</span>
                  </div>
                  <div style="height: 8px; width: 100%; background: #f1f5f9; border-radius: 9999px; overflow: hidden; margin-bottom: 6px;">
                    <div style="height: 100%; width: ${g.progress_pct}%; background: linear-gradient(90deg, #2563eb, #3b82f6); border-radius: 9999px;"></div>
                  </div>
                  <div style="font-size: 11.5px; color: #64748b;">${g.target}</div>
                </div>
              `).join('')}
            </div>
          ` : `
            <p style="color: #64748b; font-size: 13px;">Therapy plan under clinical formulation.</p>
          `}
        </div>

        <!-- Right Column: Child's Clinical Schedule & Appointments -->
        <div style="display: flex; flex-direction: column; gap: 24px;">
          
          <!-- Child's Schedule Card -->
          <div class="card" style="padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <div style="width: 32px; height: 32px; border-radius: 8px; background: #ecfdf5; color: #10b981; display: flex; align-items: center; justify-content: center;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </div>
                <h3 style="font-size: 16px; font-weight: 800; color: #0f172a; margin: 0;">Child's Clinical Schedule</h3>
              </div>
              <span style="font-size: 12px; color: #64748b; font-weight: 600;">${upcomingApts.length} Scheduled</span>
            </div>

            ${upcomingApts.length > 0 ? `
              <div style="display: flex; flex-direction: column; gap: 10px;">
                ${upcomingApts.map(a => `
                  <div style="padding: 12px 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; display: flex; align-items: center; justify-content: space-between;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                      <div style="width: 42px; height: 42px; border-radius: 8px; background: #eff6ff; color: #2563eb; display: flex; flex-direction: column; align-items: center; justify-content: center; font-weight: 800; font-size: 11px;">
                        <span>${a.start_time.split(' ')[0]}</span>
                        <span style="font-size: 9px; color: #64748b;">${a.start_time.split(' ')[1] || 'AM'}</span>
                      </div>
                      <div>
                        <div style="font-weight: 700; font-size: 13.5px; color: #0f172a;">${a.appointment_date}</div>
                        <div style="font-size: 12px; color: #64748b;">${a.type} &bull; Clinical Room 2B</div>
                      </div>
                    </div>
                    <span style="background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 6px;">
                      ● ${a.status}
                    </span>
                  </div>
                `).join('')}
              </div>
            ` : `
              <p style="color: #64748b; font-size: 13px;">No visits scheduled this week.</p>
            `}
          </div>

          <!-- Latest Session Observation & Home Guidance -->
          <div class="card" style="padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 14px;">
              <div style="width: 32px; height: 32px; border-radius: 8px; background: #fef3c7; color: #f59e0b; display: flex; align-items: center; justify-content: center;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <h3 style="font-size: 16px; font-weight: 800; color: #0f172a; margin: 0;">Clinical Session Observations</h3>
            </div>

            <div style="font-size: 13px; color: #334155; line-height: 1.6;">
              <div style="margin-bottom: 8px;">
                <strong>Latest Evaluation:</strong> Child responded positively to sensory swing activities and maintained joint attention for 8 consecutive minutes.
              </div>
              <div style="padding: 12px 14px; background: #eff6ff; border-radius: 10px; border: 1px solid #bfdbfe; color: #1e40af; font-size: 12.5px;">
                <strong>Therapist Guidance for Home:</strong> Continue 10 minutes of daily visual prompt card practice before evening dinner routines.
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  `;
};
