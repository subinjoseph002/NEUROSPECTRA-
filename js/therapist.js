/**
 * NEUROSPECTRA - Therapist Clinical Dashboard & Workflow Management
 * Native Healthcare Design System with SVG Icons & Built-in Modal Engine.
 */

// ============================================================================
// 1. THERAPIST DASHBOARD VIEW
// ============================================================================
window.renderTherapistDashboard = function() {
  const user = window.neuroAuth.getCurrentUser();
  const allChildren = window.neuroDB.getChildren ? window.neuroDB.getChildren() : [];
  const myChildren = allChildren.filter(c => !user || c.assigned_therapist_id === user.id || true);
  const assessments = window.neuroDB.getAssessmentRecords ? window.neuroDB.getAssessmentRecords() : [];
  const therapyPlans = window.neuroDB.getTherapyPlans ? window.neuroDB.getTherapyPlans() : [];
  const activePlans = therapyPlans.filter(p => p.status === 'Active');
  const teacherObservations = window.neuroDB.getTeacherObservations ? window.neuroDB.getTeacherObservations() : [];
  const appointments = window.neuroDB.getAppointments ? window.neuroDB.getAppointments() : [];
  const todayStr = new Date().toISOString().split('T')[0];
  const todayApts = appointments.filter(a => a.appointment_date === todayStr);

  return `
    <div class="therapist-dashboard-view" style="color: #0f172a; font-family: 'Plus Jakarta Sans', sans-serif;">
      
      <!-- Page Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
        <div>
          <div style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 9999px; background: #eff6ff; color: #2563eb; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            Clinical Specialist Portal
          </div>
          <h1 style="font-size: 26px; font-weight: 800; color: #0f172a; margin-bottom: 4px; line-height: 1.2;">
            Welcome, Dr. ${user?.full_name || 'Aisha Khan'}
          </h1>
          <p style="font-size: 14px; color: #64748b; margin: 0;">
            Pediatric clinical evaluations, individualized therapy plan goals, and multidisciplinary teacher collaboration.
          </p>
        </div>

        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button class="btn btn-primary" onclick="window.startNewAssessment()" style="display: flex; align-items: center; gap: 8px; font-weight: 600;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="m9.17 14.83-4.24 4.24"/></svg>
            Conduct Assessment
          </button>
          <button class="btn btn-outline" onclick="window.showCreateTherapyPlanModal()" style="display: flex; align-items: center; gap: 8px; font-weight: 600;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            New Therapy Plan
          </button>
          <button class="btn btn-accent" onclick="window.showLogTherapySessionModal()" style="display: flex; align-items: center; gap: 8px; font-weight: 600;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            Log Session
          </button>
        </div>
      </div>

      <!-- Top Row 4 Stat Cards -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;">
        
        <!-- Stat 1: Assigned Children -->
        <div class="card" style="margin-bottom: 0; padding: 18px 20px; border-radius: 14px; border: 1px solid #e2e8f0; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.03); cursor: pointer; transition: all 0.2s;" onclick="window.navigateTo('children')" onmouseover="this.style.borderColor='#2563eb'" onmouseout="this.style.borderColor='#e2e8f0'">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <span style="font-size: 11px; font-weight: 700; color: #64748b; letter-spacing: 0.5px; text-transform: uppercase;">ACTIVE CASELOAD</span>
            <div style="width: 28px; height: 28px; border-radius: 50%; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
            </div>
          </div>
          <div style="font-size: 28px; font-weight: 800; color: #0f172a; line-height: 1.1; margin-bottom: 6px;">${myChildren.length}</div>
          <div style="font-size: 11.5px; font-weight: 600; color: #16a34a; display: flex; align-items: center; gap: 4px;">
            <span>▲</span> ${myChildren.filter(c => c.status === 'Active').length} Active pediatric cases
          </div>
        </div>

        <!-- Stat 2: Assessments Conducted -->
        <div class="card" style="margin-bottom: 0; padding: 18px 20px; border-radius: 14px; border: 1px solid #e2e8f0; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.03); cursor: pointer; transition: all 0.2s;" onclick="window.navigateTo('assessments')" onmouseover="this.style.borderColor='#10b981'" onmouseout="this.style.borderColor='#e2e8f0'">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <span style="font-size: 11px; font-weight: 700; color: #64748b; letter-spacing: 0.5px; text-transform: uppercase;">ASSESSMENTS</span>
            <div style="width: 28px; height: 28px; border-radius: 50%; background: #ecfdf5; color: #10b981; display: flex; align-items: center; justify-content: center;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            </div>
          </div>
          <div style="font-size: 28px; font-weight: 800; color: #0f172a; line-height: 1.1; margin-bottom: 6px;">${assessments.length}</div>
          <div style="font-size: 11.5px; font-weight: 600; color: #2563eb; display: flex; align-items: center; gap: 4px;">
            <span>●</span> 5-point clinical batteries
          </div>
        </div>

        <!-- Stat 3: Active Therapy Plans -->
        <div class="card" style="margin-bottom: 0; padding: 18px 20px; border-radius: 14px; border: 1px solid #e2e8f0; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.03); cursor: pointer; transition: all 0.2s;" onclick="window.navigateTo('therapy-plans')" onmouseover="this.style.borderColor='#8b5cf6'" onmouseout="this.style.borderColor='#e2e8f0'">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <span style="font-size: 11px; font-weight: 700; color: #64748b; letter-spacing: 0.5px; text-transform: uppercase;">ACTIVE PLANS</span>
            <div style="width: 28px; height: 28px; border-radius: 50%; background: #f5f3ff; color: #8b5cf6; display: flex; align-items: center; justify-content: center;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            </div>
          </div>
          <div style="font-size: 28px; font-weight: 800; color: #0f172a; line-height: 1.1; margin-bottom: 6px;">${activePlans.length}</div>
          <div style="font-size: 11.5px; font-weight: 600; color: #8b5cf6; display: flex; align-items: center; gap: 4px;">
            <span>▲</span> Goal progress tracked
          </div>
        </div>

        <!-- Stat 4: Teacher Observations Feed -->
        <div class="card" style="margin-bottom: 0; padding: 18px 20px; border-radius: 14px; border: 1px solid #e2e8f0; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.03); cursor: pointer; transition: all 0.2s;" onclick="window.navigateTo('observations')" onmouseover="this.style.borderColor='#f59e0b'" onmouseout="this.style.borderColor='#e2e8f0'">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <span style="font-size: 11px; font-weight: 700; color: #64748b; letter-spacing: 0.5px; text-transform: uppercase;">TEACHER LOGS</span>
            <div style="width: 28px; height: 28px; border-radius: 50%; background: #fffbeb; color: #f59e0b; display: flex; align-items: center; justify-content: center;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            </div>
          </div>
          <div style="font-size: 28px; font-weight: 800; color: #0f172a; line-height: 1.1; margin-bottom: 6px;">${teacherObservations.length}</div>
          <div style="font-size: 11.5px; font-weight: 600; color: #d97706; display: flex; align-items: center; gap: 4px;">
            <span>●</span> Classroom context feed
          </div>
        </div>

      </div>

      <!-- Main 2-Column Dashboard Layout -->
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px; margin-bottom: 24px;">
        
        <!-- Left Column: Supporting Teacher Notes & Active Therapy Plans -->
        <div style="display: flex; flex-direction: column; gap: 24px;">
          
          <!-- Supporting Teacher Observations Feed Card -->
          <div class="card" style="margin-bottom: 0; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 32px; height: 32px; border-radius: 8px; background: #fdf2f8; color: #db2777; display: flex; align-items: center; justify-content: center;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                </div>
                <div>
                  <h3 style="font-size: 16px; font-weight: 700; color: #0f172a; margin: 0;">Supporting Teacher Observations (Classroom Feed)</h3>
                  <p style="font-size: 12.5px; color: #64748b; margin: 0;">Real-world classroom behaviors observed by school educators to inform therapy goals.</p>
                </div>
              </div>
              <span class="badge badge-info" style="font-size: 11.5px; padding: 4px 10px;">${teacherObservations.length} Logs Available</span>
            </div>

            ${teacherObservations.length === 0 ? `
              <div style="text-align: center; padding: 32px; background: #f8fafc; border-radius: 12px; border: 1px dashed #cbd5e1;">
                <p style="font-size: 13.5px; color: #64748b; margin: 0;">No classroom observations logged yet by teachers.</p>
              </div>
            ` : `
              <div style="display: flex; flex-direction: column; gap: 12px;">
                ${teacherObservations.slice(0, 3).map(obs => {
                  const child = window.neuroDB.getChildById(obs.child_id);
                  const teacher = window.neuroDB.getUserById(obs.teacher_id);
                  const sevColor = obs.overall_severity === 'Significant Concern' ? '#ef4444' : (obs.overall_severity === 'Moderate Concern' ? '#f59e0b' : '#10b981');
                  const sevBg = obs.overall_severity === 'Significant Concern' ? '#fee2e2' : (obs.overall_severity === 'Moderate Concern' ? '#fef3c7' : '#ecfdf5');
                  
                  return `
                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; transition: all 0.2s;" onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='#f8fafc'">
                      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                          <div style="width: 32px; height: 32px; border-radius: 50%; background: #eff6ff; color: #2563eb; font-weight: 700; font-size: 12.5px; display: flex; align-items: center; justify-content: center;">
                            ${(child?.first_name || 'C')[0]}${(child?.last_name || 'H')[0]}
                          </div>
                          <div>
                            <span style="font-weight: 700; font-size: 14.5px; color: #0f172a;">${child ? `${child.first_name} ${child.last_name}` : 'Student'}</span>
                            <span style="font-size: 12px; color: #64748b; margin-left: 6px;">(${child?.child_code || ''})</span>
                            <div style="font-size: 11.5px; color: #64748b;">Logged by ${teacher?.full_name || 'Teacher'} • ${obs.observation_date || 'Recent'}</div>
                          </div>
                        </div>
                        <span style="background: ${sevBg}; color: ${sevColor}; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 6px;">
                          ${obs.overall_severity || 'Typical'}
                        </span>
                      </div>

                      <p style="font-size: 13px; color: #334155; line-height: 1.45; margin: 8px 0 10px; background: #ffffff; padding: 10px 12px; border-radius: 8px; border: 1px solid #f1f5f9;">
                        "${obs.educator_notes || 'Classroom routine completed with mild sensory seeking behaviors during group circle.'}"
                      </p>

                      <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                          <span style="font-size: 11px; background: #e0e7ff; color: #3730a3; padding: 2px 7px; border-radius: 4px; font-weight: 600;">Activity: ${obs.environmental_context?.activity_type || 'Classroom'}</span>
                          <span style="font-size: 11px; background: #f1f5f9; color: #475569; padding: 2px 7px; border-radius: 4px; font-weight: 600;">Noise: ${obs.environmental_context?.noise_level || 'Moderate'}</span>
                        </div>
                        <button class="btn btn-outline btn-sm" onclick="window.teacherModule && window.teacherModule.openObservationModal('${obs.id}')" style="font-size: 11.5px; padding: 4px 8px;">
                          Review Details &rarr;
                        </button>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            `}
          </div>

          <!-- Active Therapy Plans with Goal Progress Tracking -->
          <div class="card" style="margin-bottom: 0; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;">
              <div>
                <h3 style="font-size: 16px; font-weight: 700; color: #0f172a; margin: 0;">Active Therapy Plans & Goals</h3>
                <p style="font-size: 12.5px; color: #64748b; margin: 0;">Milestone goals with real-time percentage progression.</p>
              </div>
              <button class="btn btn-primary btn-sm" onclick="window.showCreateTherapyPlanModal()" style="display: flex; align-items: center; gap: 4px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add Plan
              </button>
            </div>

            ${activePlans.length === 0 ? `
              <div style="text-align: center; padding: 32px; background: #f8fafc; border-radius: 12px; border: 1px dashed #cbd5e1;">
                <p style="font-size: 13.5px; color: #64748b; margin: 0 0 10px;">No active therapy plans recorded.</p>
                <button class="btn btn-primary btn-sm" onclick="window.showCreateTherapyPlanModal()">Create First Plan</button>
              </div>
            ` : `
              <div style="display: flex; flex-direction: column; gap: 16px;">
                ${activePlans.slice(0, 3).map(plan => {
                  const child = window.neuroDB.getChildById(plan.child_id);
                  const goals = plan.goals || [];
                  const avgProgress = goals.length > 0 
                    ? Math.round(goals.reduce((sum, g) => sum + (g.progress_pct || 0), 0) / goals.length) 
                    : 0;

                  return `
                    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; box-shadow: 0 1px 2px rgba(0,0,0,0.02);">
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <div>
                          <strong style="font-size: 15px; color: #0f172a;">${plan.title || 'Individualized Therapy Plan'}</strong>
                          <div style="font-size: 12px; color: #64748b;">Patient: <strong>${child ? `${child.first_name} ${child.last_name}` : 'Child'}</strong> • ${plan.frequency || '2x Weekly'}</div>
                        </div>
                        <span class="badge badge-success" style="font-size: 11px;">${avgProgress}% Overall</span>
                      </div>

                      <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 12px;">
                        ${goals.slice(0, 2).map(goal => `
                          <div style="background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 8px; padding: 10px 12px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                              <span style="font-size: 12.5px; font-weight: 600; color: #334155;">${goal.goal_text}</span>
                              <span style="font-size: 12px; font-weight: 700; color: #2563eb;">${goal.progress_pct || 0}%</span>
                            </div>
                            <div style="width: 100%; height: 6px; background: #e2e8f0; border-radius: 9999px; overflow: hidden; margin-bottom: 6px;">
                              <div style="width: ${goal.progress_pct || 0}%; height: 100%; background: linear-gradient(90deg, #3b82f6, #10b981); border-radius: 9999px;"></div>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                              <span style="font-size: 11px; color: #94a3b8;">Target: ${goal.target_date || 'Q2 2026'}</span>
                              <button class="btn btn-outline btn-sm" onclick="window.showEditGoalModal('${plan.id}', '${goal.id}')" style="font-size: 11px; padding: 2px 6px;">
                                Update Goal %
                              </button>
                            </div>
                          </div>
                        `).join('')}
                      </div>

                      <div style="display: flex; justify-content: flex-end; gap: 8px;">
                        <button class="btn btn-secondary btn-sm" onclick="window.showLogTherapySessionModal('${plan.id}')" style="font-size: 12px;">
                          + Log Session for Plan
                        </button>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            `}
          </div>

          <!-- Today's Clinical Schedule -->
          <div class="card" style="margin-bottom: 0; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;">
              <div>
                <h3 style="font-size: 16px; font-weight: 700; color: #0f172a; margin: 0;">Today's Clinical Schedule</h3>
                <p style="font-size: 12.5px; color: #64748b; margin: 0;">Consultations and behavioral therapy sessions.</p>
              </div>
              <button class="btn btn-outline btn-sm" onclick="window.showBookAppointmentModal()">+ New Appointment</button>
            </div>

            <div style="display: flex; flex-direction: column; gap: 10px;">
              ${todayApts.length === 0 ? `
                <div style="background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 12px; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between;">
                  <div style="display: flex; align-items: center; gap: 16px;">
                    <span style="background: #eff6ff; color: #2563eb; font-weight: 700; font-size: 12.5px; padding: 6px 12px; border-radius: 8px; font-family: 'JetBrains Mono', monospace;">
                      09:00 AM
                    </span>
                    <div>
                      <div style="font-weight: 700; font-size: 14.5px; color: #0f172a;">Aarav Sharma</div>
                      <div style="font-size: 12px; color: #64748b;">Pediatric Speech & Language Therapy</div>
                    </div>
                  </div>
                  <div style="font-size: 12.5px; color: #94a3b8; font-weight: 500;">45 mins</div>
                </div>

                <div style="background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 12px; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between;">
                  <div style="display: flex; align-items: center; gap: 16px;">
                    <span style="background: #eff6ff; color: #2563eb; font-weight: 700; font-size: 12.5px; padding: 6px 12px; border-radius: 8px; font-family: 'JetBrains Mono', monospace;">
                      11:30 AM
                    </span>
                    <div>
                      <div style="font-weight: 700; font-size: 14.5px; color: #0f172a;">Lucas Miller</div>
                      <div style="font-size: 12px; color: #64748b;">Social Skills Play Therapy</div>
                    </div>
                  </div>
                  <div style="font-size: 12.5px; color: #94a3b8; font-weight: 500;">60 mins</div>
                </div>
              ` : `
                ${todayApts.map(a => {
                  const child = window.neuroDB.getChildById(a.child_id);
                  return `
                    <div style="background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 12px; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between;">
                      <div style="display: flex; align-items: center; gap: 16px;">
                        <span style="background: #eff6ff; color: #2563eb; font-weight: 700; font-size: 12.5px; padding: 6px 12px; border-radius: 8px; font-family: 'JetBrains Mono', monospace;">
                          ${a.start_time || '10:00 AM'}
                        </span>
                        <div>
                          <div style="font-weight: 700; font-size: 14.5px; color: #0f172a;">${child ? `${child.first_name} ${child.last_name}` : 'Child'}</div>
                          <div style="font-size: 12px; color: #64748b;">${a.title || a.service_type || 'Therapy Session'}</div>
                        </div>
                      </div>
                      <span class="badge badge-${a.status === 'Confirmed' ? 'success' : 'info'}">${a.status}</span>
                    </div>
                  `;
                }).join('')}
              `}
            </div>
          </div>

        </div>

        <!-- Right Column: Quick Clinical Actions & Consultation -->
        <div style="display: flex; flex-direction: column; gap: 24px;">
          
          <!-- Quick Clinical Actions Card -->
          <div class="card" style="margin-bottom: 0; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
            <div style="font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 16px;">Quick Clinical Actions</div>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <button class="btn btn-primary" onclick="window.startNewAssessment()" style="width: 100%; justify-content: flex-start; padding: 11px 16px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="m9.17 14.83-4.24 4.24"/></svg>
                Conduct 5-Point Assessment
              </button>
              
              <button class="btn btn-outline" onclick="window.showCreateTherapyPlanModal()" style="width: 100%; justify-content: flex-start; padding: 11px 16px; border-color: #dbeafe; color: #2563eb; background: #eff6ff;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                Create Individualized Plan
              </button>

              <button class="btn btn-outline" onclick="window.showLogTherapySessionModal()" style="width: 100%; justify-content: flex-start; padding: 11px 16px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                Log Therapy Session
              </button>

              <button class="btn btn-outline" onclick="window.navigateTo('reports')" style="width: 100%; justify-content: flex-start; padding: 11px 16px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                Diagnostic & Progress Reports
              </button>
            </div>
          </div>

          <!-- Board Consultation / Interdisciplinary Collaboration Card -->
          <div class="card" style="margin-bottom: 0; padding: 24px; border-radius: 16px; border: 1px solid #334155; background: #1e293b; color: #ffffff;">
            <div style="font-size: 15px; font-weight: 700; color: #ffffff; margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              Multidisciplinary Consultation
            </div>
            <p style="font-size: 12.5px; color: #94a3b8; line-height: 1.55; margin-bottom: 16px;">
              Instantly collaborate with classroom educators, developmental pediatricians, and clinical psychologists.
            </p>
            <button style="width: 100%; background: #2563eb; color: #ffffff; font-weight: 600; font-size: 13.5px; padding: 10px; border-radius: 8px; border: none; cursor: pointer; box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3); transition: all 0.2s;" onclick="window.navigateTo('messages')" onmouseover="this.style.background='#1d4ed8'" onmouseout="this.style.background='#2563eb'">
              Launch Secure Messages
            </button>
          </div>

        </div>

      </div>

    </div>
  `;
};

// ============================================================================
// 2. THERAPY PLAN & GOAL MODAL HANDLERS
// ============================================================================

window.showCreateTherapyPlanModal = function(childId) {
  const children = window.neuroDB.getChildren();
  const selectedChildId = childId || (children.length > 0 ? children[0].id : '');

  const bodyHtml = `
    <form id="create-therapy-plan-form" onsubmit="window.handleCreateTherapyPlan(event)">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
        <div>
          <label style="display: block; font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 6px; text-transform: uppercase;">Child Patient *</label>
          <select id="plan-child-id" class="form-select" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; font-size: 14px;" required>
            ${children.map(c => `<option value="${c.id}" ${c.id === selectedChildId ? 'selected' : ''}>${c.first_name} ${c.last_name} (${c.child_code})</option>`).join('')}
          </select>
        </div>

        <div>
          <label style="display: block; font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 6px; text-transform: uppercase;">Plan Title *</label>
          <input type="text" id="plan-title" class="form-control" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; font-size: 14px;" placeholder="e.g. Speech & Sensory Integration Plan" required>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
        <div>
          <label style="display: block; font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 6px; text-transform: uppercase;">Session Frequency</label>
          <select id="plan-frequency" class="form-select" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; font-size: 14px;">
            <option value="1x Weekly">1x Weekly</option>
            <option value="2x Weekly" selected>2x Weekly</option>
            <option value="3x Weekly">3x Weekly</option>
            <option value="Intensive Daily">Intensive Daily</option>
          </select>
        </div>

        <div>
          <label style="display: block; font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 6px; text-transform: uppercase;">Therapist Focus Area</label>
          <input type="text" id="plan-focus-area" class="form-control" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; font-size: 14px;" placeholder="e.g. Expressive Language & Joint Attention">
        </div>
      </div>

      <!-- Initial Goals Section -->
      <div style="margin-bottom: 16px;">
        <label style="display: block; font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 6px; text-transform: uppercase;">Target Goal 1 *</label>
        <input type="text" id="plan-goal-1" class="form-control" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; font-size: 14px; margin-bottom: 8px;" placeholder="e.g. Increase non-verbal pointing gesture across 4 play trials" required>
        
        <label style="display: block; font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 6px; text-transform: uppercase;">Target Goal 2</label>
        <input type="text" id="plan-goal-2" class="form-control" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; font-size: 14px;" placeholder="e.g. Tolerate sensory auditory changes during transitions without distress">
      </div>
    </form>
  `;

  const footerHtml = `
    <button type="button" class="btn btn-outline" onclick="window.closeActiveModal()">Cancel</button>
    <button type="submit" form="create-therapy-plan-form" class="btn btn-primary" style="font-weight: 600;">Save Therapy Plan</button>
  `;

  window.openModal('Create Individualized Therapy Plan', bodyHtml, footerHtml);
};

window.handleCreateTherapyPlan = function(event) {
  event.preventDefault();
  const user = window.neuroAuth.getCurrentUser();
  const childId = document.getElementById('plan-child-id').value;
  const title = document.getElementById('plan-title').value;
  const frequency = document.getElementById('plan-frequency').value;
  const focusArea = document.getElementById('plan-focus-area').value;
  const goal1Text = document.getElementById('plan-goal-1').value;
  const goal2Text = document.getElementById('plan-goal-2')?.value;

  const goals = [
    {
      id: 'g_' + Date.now() + '_1',
      goal_text: goal1Text,
      target_date: new Date(Date.now() + 60*24*60*60*1000).toISOString().split('T')[0],
      progress_pct: 10,
      notes: 'Baseline initiated'
    }
  ];

  if (goal2Text && goal2Text.trim()) {
    goals.push({
      id: 'g_' + Date.now() + '_2',
      goal_text: goal2Text,
      target_date: new Date(Date.now() + 90*24*60*60*1000).toISOString().split('T')[0],
      progress_pct: 0,
      notes: 'Initial target'
    });
  }

  const newPlan = {
    id: 'plan_' + Date.now(),
    child_id: childId,
    therapist_id: user ? user.id : 'usr_therapist_01',
    title: title,
    frequency: frequency,
    focus_area: focusArea,
    status: 'Active',
    goals: goals,
    created_at: new Date().toISOString()
  };

  const plans = window.neuroDB.getTherapyPlans();
  plans.unshift(newPlan);
  window.neuroDB.saveTherapyPlans(plans);

  window.closeActiveModal();
  if (window.showToast) window.showToast('Therapy Plan created successfully with target goals!', 'success');
  window.renderApp();
};

window.showLogTherapySessionModal = function(preselectedPlanId) {
  const plans = window.neuroDB.getTherapyPlans();
  const children = window.neuroDB.getChildren();

  const bodyHtml = `
    <form id="log-session-form" onsubmit="window.handleLogTherapySession(event)">
      <div style="margin-bottom: 16px;">
        <label style="display: block; font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 6px; text-transform: uppercase;">Associated Therapy Plan *</label>
        <select id="session-plan-id" class="form-select" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; font-size: 14px;" onchange="window.handlePlanSelectForSession(this.value)" required>
          <option value="">-- Select Child & Therapy Plan --</option>
          ${plans.map(p => {
            const child = children.find(c => c.id === p.child_id);
            return `<option value="${p.id}" ${p.id === preselectedPlanId ? 'selected' : ''}>${child ? `${child.first_name} ${child.last_name}` : 'Child'} - ${p.title}</option>`;
          }).join('')}
        </select>
      </div>

      <div id="session-goals-container" style="margin-bottom: 16px;">
        <!-- Dynamically populated goals -->
      </div>

      <div style="margin-bottom: 16px;">
        <label style="display: block; font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 6px; text-transform: uppercase;">Clinical Session Notes & Observations *</label>
        <textarea id="session-notes" class="form-control" rows="3" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; font-size: 14px;" placeholder="Document child's engagement, sensory regulation, and target goal progress..." required></textarea>
      </div>
    </form>
  `;

  const footerHtml = `
    <button type="button" class="btn btn-outline" onclick="window.closeActiveModal()">Cancel</button>
    <button type="submit" form="log-session-form" class="btn btn-primary" style="font-weight: 600;">Save Session Record</button>
  `;

  window.openModal('Log Therapy Session & Update Goal Progress', bodyHtml, footerHtml);
  if (preselectedPlanId) {
    window.handlePlanSelectForSession(preselectedPlanId);
  } else if (plans.length > 0) {
    window.handlePlanSelectForSession(plans[0].id);
  }
};

window.handlePlanSelectForSession = function(planId) {
  const container = document.getElementById('session-goals-container');
  if (!container) return;
  const plan = window.neuroDB.getTherapyPlanById ? window.neuroDB.getTherapyPlanById(planId) : (window.neuroDB.getTherapyPlans().find(p => p.id === planId));
  if (!plan || !plan.goals || plan.goals.length === 0) {
    container.innerHTML = `<div style="font-size: 12.5px; color: #64748b; background: #f8fafc; padding: 10px; border-radius: 8px;">No specific goals attached to this plan.</div>`;
    return;
  }

  container.innerHTML = `
    <label style="display: block; font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 8px; text-transform: uppercase;">Update Goal Progress During This Session</label>
    <div style="display: flex; flex-direction: column; gap: 10px;">
      ${plan.goals.map((g, idx) => `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 12px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-size: 13px; font-weight: 600; color: #334155;">${g.goal_text}</span>
            <span id="goal-val-lbl-${g.id}" style="font-weight: 700; color: #2563eb; font-size: 13px;">${g.progress_pct || 0}%</span>
          </div>
          <input type="range" min="0" max="100" step="5" value="${g.progress_pct || 0}" data-goal-id="${g.id}" style="width: 100%; cursor: pointer;" oninput="document.getElementById('goal-val-lbl-${g.id}').innerText = this.value + '%'">
        </div>
      `).join('')}
    </div>
  `;
};

window.handleLogTherapySession = function(event) {
  event.preventDefault();
  const user = window.neuroAuth.getCurrentUser();
  const planId = document.getElementById('session-plan-id').value;
  const notes = document.getElementById('session-notes').value;
  const plan = window.neuroDB.getTherapyPlans().find(p => p.id === planId);

  // Update goals from range inputs
  const goalSliders = document.querySelectorAll('#session-goals-container input[type="range"]');
  goalSliders.forEach(slider => {
    const goalId = slider.getAttribute('data-goal-id');
    const newPct = parseInt(slider.value, 10);
    window.neuroDB.updateGoalProgress(planId, goalId, newPct, 'Updated in therapy session');
  });

  const newSession = {
    id: 'ses_' + Date.now(),
    plan_id: planId,
    child_id: plan ? plan.child_id : '',
    therapist_id: user ? user.id : 'usr_therapist_01',
    session_date: new Date().toISOString().split('T')[0],
    notes: notes,
    created_at: new Date().toISOString()
  };

  const sessions = window.neuroDB.getTherapySessions ? window.neuroDB.getTherapySessions() : [];
  sessions.unshift(newSession);
  if (window.neuroDB.saveTherapySessions) {
    window.neuroDB.saveTherapySessions(sessions);
  }

  window.closeActiveModal();
  if (window.showToast) window.showToast('Therapy Session logged and goal progress updated!', 'success');
  window.renderApp();
};

window.showEditGoalModal = function(planId, goalId) {
  const plan = window.neuroDB.getTherapyPlans().find(p => p.id === planId);
  if (!plan) return;
  const goal = plan.goals.find(g => g.id === goalId);
  if (!goal) return;

  const bodyHtml = `
    <form id="edit-goal-form" onsubmit="window.handleSaveGoalProgress(event, '${planId}', '${goalId}')">
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 16px;">
        <div style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">Milestone Goal</div>
        <div style="font-size: 14.5px; font-weight: 700; color: #0f172a;">${goal.goal_text}</div>
      </div>

      <div style="margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <label style="font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase;">Completion Level</label>
          <span id="quick-goal-pct-lbl" style="font-weight: 800; color: #2563eb; font-size: 16px;">${goal.progress_pct || 0}%</span>
        </div>
        <input type="range" id="quick-goal-slider" min="0" max="100" step="5" value="${goal.progress_pct || 0}" style="width: 100%; cursor: pointer;" oninput="document.getElementById('quick-goal-pct-lbl').innerText = this.value + '%'">
      </div>

      <div style="margin-bottom: 16px;">
        <label style="display: block; font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 6px; text-transform: uppercase;">Therapist Progress Notes</label>
        <textarea id="quick-goal-notes" class="form-control" rows="2" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; font-size: 14px;" placeholder="Optional notes on progress...">${goal.notes || ''}</textarea>
      </div>
    </form>
  `;

  const footerHtml = `
    <button type="button" class="btn btn-outline" onclick="window.closeActiveModal()">Cancel</button>
    <button type="submit" form="edit-goal-form" class="btn btn-primary" style="font-weight: 600;">Save Progress</button>
  `;

  window.openModal('Update Milestone Goal Progress', bodyHtml, footerHtml);
};

window.handleSaveGoalProgress = function(event, planId, goalId) {
  event.preventDefault();
  const slider = document.getElementById('quick-goal-slider');
  const notes = document.getElementById('quick-goal-notes')?.value;
  const newPct = parseInt(slider.value, 10);

  window.neuroDB.updateGoalProgress(planId, goalId, newPct, notes);
  window.closeActiveModal();
  if (window.showToast) window.showToast('Goal progress successfully updated!', 'success');
  window.renderApp();
};
