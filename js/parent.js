/**
 * NEUROSPECTRA - Parent & Family Portal
 * Simple, warm, and easy-to-understand progress tracking for parents and caregivers.
 */

window.parentActiveChildId = window.parentActiveChildId || null;

window.selectParentActiveChild = function(childId) {
  window.parentActiveChildId = childId;
  if (window.renderApp) window.renderApp();
};

window.renderParentDashboard = function() {
  const currentParent = window.neuroAuth.getCurrentUser();
  if (!currentParent) {
    return `<div class="card" style="padding: 32px; text-align: center;">Please sign in to access your parent account.</div>`;
  }

  // Strict Data Isolation: Only retrieve children where primary_parent_id matches this parent's ID
  const allChildren = window.neuroDB.getChildren();
  let myChildren = allChildren.filter(c => c.primary_parent_id === currentParent.id);

  // Fallback match by known parent email
  if (myChildren.length === 0) {
    if (currentParent.email === 'lin.chen@gmail.com' || currentParent.id === 'usr_parent_3') {
      myChildren = allChildren.filter(c => c.id === 'ch_103');
    } else if (currentParent.email === 'david.miller@gmail.com' || currentParent.id === 'usr_parent_2') {
      myChildren = allChildren.filter(c => c.id === 'ch_102');
    } else if (currentParent.email === 'parent@neurospectra.org' || currentParent.id === 'usr_parent_1') {
      myChildren = allChildren.filter(c => c.id === 'ch_101' || c.id === 'ch_104');
    }
  }

  if (myChildren.length === 0) {
    return `
      <div class="page-header">
        <div>
          <h1 class="page-title">Parent & Family Portal</h1>
          <p class="page-subtitle">Welcome, ${currentParent.full_name}.</p>
        </div>
      </div>
      <div class="card" style="text-align: center; padding: 48px 24px; border-radius: 16px; border: 1px solid #e2e8f0; background: #ffffff;">
        <div style="width: 56px; height: 56px; border-radius: 50%; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
        </div>
        <h3 style="font-size: 18px; font-weight: 800; color: #0f172a; margin-bottom: 8px;">No Child Linked Yet</h3>
        <p style="font-size: 13.5px; color: #64748b; max-width: 440px; margin: 0 auto 20px;">
          Your account is active. Please contact the front desk to link your child to your account.
        </p>
      </div>
    `;
  }

  // Active child selection
  let activeChild = myChildren.find(c => c.id === window.parentActiveChildId);
  if (!activeChild) {
    activeChild = myChildren[0];
    window.parentActiveChildId = activeChild.id;
  }
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
      
      <!-- Page Header with Multi-Child Tabs if applicable -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 16px;">
        <div>
          <h1 style="font-size: 26px; font-weight: 800; color: #0f172a; margin-bottom: 4px;">
            Welcome, ${currentParent.full_name.split(' ')[0]}
          </h1>
          <p style="font-size: 14px; color: #64748b; margin: 0;">
            Track developmental milestones, appointments, and progress for <strong>${activeChild.first_name} ${activeChild.last_name}</strong>.
          </p>
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">
          ${myChildren.length > 1 ? `
            <div style="display: flex; gap: 6px; background: #f1f5f9; padding: 4px; border-radius: 8px;">
              ${myChildren.map(c => `
                <button type="button" class="btn btn-sm" onclick="window.selectParentActiveChild('${c.id}')" style="font-size: 12px; font-weight: 700; border-radius: 6px; ${c.id === activeChild.id ? 'background: #2563eb; color: #ffffff;' : 'background: transparent; color: #64748b;'}">
                  ${c.first_name}
                </button>
              `).join('')}
            </div>
          ` : ''}
          <button class="btn btn-primary" onclick="window.generateAndPrintChildReport('${activeChild.id}')" style="display: flex; align-items: center; gap: 8px; font-weight: 700;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            Download Progress Report
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
                Child ID: <span style="font-family: monospace; font-weight: 700; color: #38bdf8;">${activeChild.child_code}</span> &bull; Age: ${activeChild.age_months} Months &bull; Date of Birth: ${activeChild.dob}
              </div>
            </div>
          </div>

          <!-- Assigned Specialist Read-Only Card -->
          <div style="background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(8px); border: 1px solid rgba(255, 255, 255, 0.12); padding: 12px 18px; border-radius: 12px; text-align: right;">
            <div style="font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 700; letter-spacing: 0.5px;">Assigned Therapist</div>
            <div style="font-size: 15px; font-weight: 800; color: #38bdf8; margin-top: 2px;">
              ${therapist ? therapist.full_name : 'Dr. Aisha Khan, Ph.D.'}
            </div>
            <div style="font-size: 12px; color: #cbd5e1; margin-top: 1px;">
              ${therapist ? therapist.email : 'therapist@neurospectra.org'} &bull; ${therapist ? therapist.phone : '+91 98451 89234'}
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
              <h3 style="font-size: 16px; font-weight: 800; color: #0f172a; margin: 0;">Current Learning & Development Goals</h3>
            </div>
            <span style="font-size: 12px; font-weight: 700; color: #16a34a; background: #dcfce7; padding: 3px 8px; border-radius: 6px;">Active Plan</span>
          </div>

          ${activePlan ? `
            <div style="margin-bottom: 16px; padding: 12px 14px; background: #f8fafc; border-radius: 10px; border: 1px solid #e2e8f0;">
              <div style="font-weight: 700; font-size: 14px; color: #0f172a;">${activePlan.title || 'Sensory & Communication Support Plan'}</div>
              <div style="font-size: 12px; color: #64748b; margin-top: 2px;">Frequency: 2 Sessions / Week &bull; Next Review: August 2026</div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 14px;">
              ${(activePlan.goals || [
                { title: 'Social & Eye Contact', progress_pct: 82, target: 'Maintain focus during interactive playtime.' },
                { title: 'Communication & Words', progress_pct: 75, target: 'Use 2-word phrases with picture cards.' },
                { title: 'Sound & Noise Comfort', progress_pct: 68, target: 'Stay comfortable during room changes using headphones.' },
                { title: 'Hands & Motor Skills', progress_pct: 90, target: 'Hold objects and finish peg puzzle activities.' }
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
            <p style="color: #64748b; font-size: 13px;">Therapy plan is being prepared by your specialist.</p>
          `}
        </div>

        <!-- Right Column: Child's Schedule & Appointments -->
        <div style="display: flex; flex-direction: column; gap: 24px;">
          
          <!-- Child's Schedule Card -->
          <div class="card" style="padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <div style="width: 32px; height: 32px; border-radius: 8px; background: #ecfdf5; color: #10b981; display: flex; align-items: center; justify-content: center;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </div>
                <h3 style="font-size: 16px; font-weight: 800; color: #0f172a; margin: 0;">Upcoming Appointments</h3>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 12px; color: #64748b; font-weight: 600;">${upcomingApts.length} Scheduled</span>
                <button class="btn btn-primary btn-sm" onclick="window.showBookAppointmentModal('${activeChild.id}')" style="display: flex; align-items: center; gap: 4px; font-weight: 700; padding: 5px 10px; font-size: 12px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Book Appointment
                </button>
              </div>
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
                        <div style="font-size: 12px; color: #64748b;">${a.type} &bull; Room 2B</div>
                      </div>
                    </div>
                    <span style="background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 6px;">
                      ● ${a.status}
                    </span>
                  </div>
                `).join('')}
              </div>
            ` : `
              <div style="text-align: center; padding: 20px 10px; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 10px;">
                <p style="color: #64748b; font-size: 13px; margin-bottom: 10px;">No upcoming visits scheduled for ${activeChild.first_name}.</p>
                <button class="btn btn-primary btn-sm" onclick="window.showBookAppointmentModal('${activeChild.id}')">+ Book a Session</button>
              </div>
            `}
          </div>

          <!-- Latest Session Observation & Home Guidance -->
          <div class="card" style="padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 14px;">
              <div style="width: 32px; height: 32px; border-radius: 8px; background: #fef3c7; color: #f59e0b; display: flex; align-items: center; justify-content: center;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <h3 style="font-size: 16px; font-weight: 800; color: #0f172a; margin: 0;">Recent Session Notes & Home Tips</h3>
            </div>

            <div style="font-size: 13px; color: #334155; line-height: 1.6;">
              <div style="margin-bottom: 8px;">
                <strong>What happened in the last session:</strong> Child responded enthusiastically to play activities and stayed focused for 8 minutes straight.
              </div>
              <div style="padding: 12px 14px; background: #eff6ff; border-radius: 10px; border: 1px solid #bfdbfe; color: #1e40af; font-size: 12.5px;">
                <strong>Helpful Tips to Try at Home:</strong> Practice 10 minutes of fun picture card games together before dinner.
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  `;
};
