/**
 * NEUROSPECTRA - Teacher & Educator Module
 * Provides classroom observation logging across 5 developmental domains,
 * student tracking, non-clinical child profiles, and observation history.
 * Native Healthcare Design System with SVG Icons & Built-in Modal Engine.
 */

class TeacherModule {
  constructor() {
    this.ratingOptions = ['Never', 'Sometimes', 'Often', 'Always', 'Not Observed'];
  }

  getCurrentTeacher() {
    return window.neuroAuth.getCurrentUser();
  }

  getAssignedChildren() {
    const user = this.getCurrentTeacher();
    const allChildren = window.neuroDB.getChildren();
    if (!user) return allChildren;
    const assigned = allChildren.filter(c => c.assigned_teacher_id === user.id);
    return assigned.length > 0 ? assigned : allChildren;
  }

  // ==========================================================================
  // 1. TEACHER DASHBOARD VIEW
  // ==========================================================================
  renderDashboard() {
    const teacher = this.getCurrentTeacher();
    const children = this.getAssignedChildren();
    const observations = window.neuroDB.getTeacherObservations();
    
    const totalChildren = children.length;
    const totalObservations = observations.length;
    const thisMonth = new Date().toISOString().slice(0, 7);
    const observationsThisMonth = observations.filter(o => (o.observation_date || o.created_at || '').startsWith(thisMonth)).length;
    const activeChildren = children.filter(c => c.status === 'Active').length;

    return `
      <div class="teacher-dashboard-view" style="color: #0f172a; font-family: 'Plus Jakarta Sans', sans-serif;">
        
        <!-- Page Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 16px;">
          <div>
            <div style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 9999px; background: #eff6ff; color: #2563eb; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              Teacher & Educator Portal
            </div>
            <h1 style="font-size: 26px; font-weight: 800; color: #0f172a; margin-bottom: 4px; line-height: 1.2;">
              Welcome, ${teacher?.full_name || 'Educator'}
            </h1>
            <p style="font-size: 14px; color: #64748b; margin: 0;">
              Classroom behavioral tracking, 5-domain structured observations, and non-clinical pediatric developmental context.
            </p>
          </div>

          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button class="btn btn-primary" onclick="window.navigateTo('observation-create')" style="display: flex; align-items: center; gap: 8px; font-weight: 600;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Log Observation
            </button>
            <button class="btn btn-outline" onclick="window.navigateTo('observations')" style="display: flex; align-items: center; gap: 8px; font-weight: 600;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              Observation History
            </button>
          </div>
        </div>

        <!-- Non-Clinical Role Notice Banner -->
        <div style="background: #fffbeb; border: 1px solid #fef3c7; border-left: 4px solid #f59e0b; border-radius: 12px; padding: 14px 18px; margin-bottom: 24px; display: flex; align-items: flex-start; gap: 12px;">
          <div style="color: #d97706; margin-top: 2px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <div style="font-size: 13px; color: #92400e; line-height: 1.5;">
            <strong>Observational Context Notice:</strong> Teacher observations document real-world classroom routines, peer interactions, and sensory responses. These records support multidisciplinary clinical reviews by licensed therapists and do not constitute clinical or medical diagnoses.
          </div>
        </div>

        <!-- Top Row 4 Stat Cards -->
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;">
          
          <!-- Stat 1: Assigned Students -->
          <div class="card" style="margin-bottom: 0; padding: 18px 20px; border-radius: 14px; border: 1px solid #e2e8f0; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.03); cursor: pointer; transition: all 0.2s;" onclick="window.navigateTo('my-children')" onmouseover="this.style.borderColor='#2563eb'" onmouseout="this.style.borderColor='#e2e8f0'">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <span style="font-size: 11px; font-weight: 700; color: #64748b; letter-spacing: 0.5px; text-transform: uppercase;">ASSIGNED STUDENTS</span>
              <div style="width: 28px; height: 28px; border-radius: 50%; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
              </div>
            </div>
            <div style="font-size: 28px; font-weight: 800; color: #0f172a; line-height: 1.1; margin-bottom: 6px;">${totalChildren}</div>
            <div style="font-size: 11.5px; font-weight: 600; color: #16a34a; display: flex; align-items: center; gap: 4px;">
              <span>▲</span> ${activeChildren} active in classroom
            </div>
          </div>

          <!-- Stat 2: Observations Logged -->
          <div class="card" style="margin-bottom: 0; padding: 18px 20px; border-radius: 14px; border: 1px solid #e2e8f0; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.03); cursor: pointer; transition: all 0.2s;" onclick="window.navigateTo('observations')" onmouseover="this.style.borderColor='#8b5cf6'" onmouseout="this.style.borderColor='#e2e8f0'">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <span style="font-size: 11px; font-weight: 700; color: #64748b; letter-spacing: 0.5px; text-transform: uppercase;">OBSERVATIONS LOGGED</span>
              <div style="width: 28px; height: 28px; border-radius: 50%; background: #f5f3ff; color: #8b5cf6; display: flex; align-items: center; justify-content: center;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              </div>
            </div>
            <div style="font-size: 28px; font-weight: 800; color: #0f172a; line-height: 1.1; margin-bottom: 6px;">${totalObservations}</div>
            <div style="font-size: 11.5px; font-weight: 600; color: #8b5cf6; display: flex; align-items: center; gap: 4px;">
              <span>●</span> 5 developmental domains
            </div>
          </div>

          <!-- Stat 3: This Month -->
          <div class="card" style="margin-bottom: 0; padding: 18px 20px; border-radius: 14px; border: 1px solid #e2e8f0; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.03); cursor: pointer; transition: all 0.2s;" onclick="window.navigateTo('observations')" onmouseover="this.style.borderColor='#10b981'" onmouseout="this.style.borderColor='#e2e8f0'">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <span style="font-size: 11px; font-weight: 700; color: #64748b; letter-spacing: 0.5px; text-transform: uppercase;">THIS MONTH</span>
              <div style="width: 28px; height: 28px; border-radius: 50%; background: #ecfdf5; color: #10b981; display: flex; align-items: center; justify-content: center;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
            </div>
            <div style="font-size: 28px; font-weight: 800; color: #0f172a; line-height: 1.1; margin-bottom: 6px;">${observationsThisMonth}</div>
            <div style="font-size: 11.5px; font-weight: 600; color: #10b981; display: flex; align-items: center; gap: 4px;">
              <span>▲</span> Submitted educator logs
            </div>
          </div>

          <!-- Stat 4: Pending Clinical Review -->
          <div class="card" style="margin-bottom: 0; padding: 18px 20px; border-radius: 14px; border: 1px solid #e2e8f0; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.03); cursor: pointer; transition: all 0.2s;" onclick="window.navigateTo('observations')" onmouseover="this.style.borderColor='#f59e0b'" onmouseout="this.style.borderColor='#e2e8f0'">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <span style="font-size: 11px; font-weight: 700; color: #64748b; letter-spacing: 0.5px; text-transform: uppercase;">CLINICAL REVIEWS</span>
              <div style="width: 28px; height: 28px; border-radius: 50%; background: #fffbeb; color: #f59e0b; display: flex; align-items: center; justify-content: center;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
            </div>
            <div style="font-size: 28px; font-weight: 800; color: #0f172a; line-height: 1.1; margin-bottom: 6px;">${totalObservations > 0 ? Math.max(1, Math.floor(totalObservations / 2)) : 0}</div>
            <div style="font-size: 11.5px; font-weight: 600; color: #d97706; display: flex; align-items: center; gap: 4px;">
              <span>●</span> Shared with therapists
            </div>
          </div>

        </div>

        <!-- Main 2-Column Dashboard Layout -->
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px; margin-bottom: 24px;">
          
          <!-- Left Column: Assigned Students & Recent Observations -->
          <div style="display: flex; flex-direction: column; gap: 24px;">
            
            <!-- Assigned Students Roster Card -->
            <div class="card" style="margin-bottom: 0; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;">
                <div>
                  <h3 style="font-size: 16px; font-weight: 700; color: #0f172a; margin: 0;">Assigned Classroom Students</h3>
                  <p style="font-size: 12.5px; color: #64748b; margin: 0;">Students in your classroom roster for behavioral observation.</p>
                </div>
                <button class="btn btn-outline btn-sm" onclick="window.navigateTo('my-children')">View All Students</button>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
                ${children.slice(0, 4).map(child => {
                  const childObs = observations.filter(o => o.child_id === child.id);
                  const latestObs = childObs[0];
                  
                  return `
                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; display: flex; flex-direction: column; justify-content: space-between;">
                      <div>
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
                          <div style="width: 38px; height: 38px; border-radius: 50%; background: #eff6ff; color: #2563eb; font-weight: 700; font-size: 14px; display: flex; align-items: center; justify-content: center;">
                            ${child.first_name[0]}${child.last_name[0]}
                          </div>
                          <div>
                            <div style="font-weight: 700; font-size: 14.5px; color: #0f172a;">${child.first_name} ${child.last_name}</div>
                            <div style="font-size: 12px; color: #64748b;">${child.child_code} • Grade: ${child.classroom_group || 'Preschool A'}</div>
                          </div>
                        </div>

                        <div style="font-size: 12px; color: #475569; margin-bottom: 12px;">
                          <strong>Last Logged:</strong> ${latestObs ? latestObs.observation_date : 'No observations yet'}
                        </div>
                      </div>

                      <div style="display: flex; gap: 8px; border-top: 1px solid #f1f5f9; padding-top: 10px;">
                        <button class="btn btn-primary btn-sm" onclick="window.navigateTo('observation-create', { childId: '${child.id}' })" style="flex: 1; font-size: 12px; padding: 6px 10px;">
                          + Observation
                        </button>
                        <button class="btn btn-outline btn-sm" onclick="window.navigateTo('child-profile', { childId: '${child.id}' })" style="font-size: 12px; padding: 6px 10px;">
                          Profile
                        </button>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Recent Classroom Observations Card -->
            <div class="card" style="margin-bottom: 0; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;">
                <div>
                  <h3 style="font-size: 16px; font-weight: 700; color: #0f172a; margin: 0;">Recent Classroom Observations</h3>
                  <p style="font-size: 12.5px; color: #64748b; margin: 0;">Latest 5-domain submissions shared with therapists.</p>
                </div>
                <button class="btn btn-outline btn-sm" onclick="window.navigateTo('observations')">Full History</button>
              </div>

              ${observations.length === 0 ? `
                <div style="text-align: center; padding: 32px; background: #f8fafc; border-radius: 12px; border: 1px dashed #cbd5e1;">
                  <p style="font-size: 13.5px; color: #64748b; margin: 0 0 10px;">No classroom observations logged yet.</p>
                  <button class="btn btn-primary btn-sm" onclick="window.navigateTo('observation-create')">+ Log First Observation</button>
                </div>
              ` : `
                <div style="display: flex; flex-direction: column; gap: 12px;">
                  ${observations.slice(0, 3).map(obs => {
                    const child = window.neuroDB.getChildById(obs.child_id);
                    const sevColor = obs.overall_severity === 'Significant Concern' ? '#ef4444' : (obs.overall_severity === 'Moderate Concern' ? '#f59e0b' : '#10b981');
                    const sevBg = obs.overall_severity === 'Significant Concern' ? '#fee2e2' : (obs.overall_severity === 'Moderate Concern' ? '#fef3c7' : '#ecfdf5');

                    return `
                      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 16px; display: flex; justify-content: space-between; align-items: center; gap: 14px;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                          <div style="width: 36px; height: 36px; border-radius: 50%; background: #eff6ff; color: #2563eb; font-weight: 700; font-size: 13px; display: flex; align-items: center; justify-content: center;">
                            ${(child?.first_name || 'S')[0]}${(child?.last_name || 'T')[0]}
                          </div>
                          <div>
                            <div style="font-weight: 700; font-size: 14px; color: #0f172a;">${child ? `${child.first_name} ${child.last_name}` : 'Student'}</div>
                            <div style="font-size: 12px; color: #64748b;">${obs.observation_date} • Setting: ${obs.environmental_context?.activity_type || 'Classroom'}</div>
                          </div>
                        </div>

                        <div style="display: flex; align-items: center; gap: 12px;">
                          <span style="background: ${sevBg}; color: ${sevColor}; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 6px;">
                            ${obs.overall_severity || 'Typical'}
                          </span>
                          <button class="btn btn-outline btn-sm" onclick="window.teacherModule.openObservationModal('${obs.id}')" style="font-size: 11.5px; padding: 4px 8px;">
                            View Details
                          </button>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              `}
            </div>

          </div>

          <!-- Right Column: Quick Classroom Actions & Guide -->
          <div style="display: flex; flex-direction: column; gap: 24px;">
            
            <!-- Quick Actions Card -->
            <div class="card" style="margin-bottom: 0; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
              <div style="font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 16px;">Classroom Actions</div>
              <div style="display: flex; flex-direction: column; gap: 10px;">
                <button class="btn btn-primary" onclick="window.navigateTo('observation-create')" style="width: 100%; justify-content: flex-start; padding: 11px 16px;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Log 5-Domain Observation
                </button>
                
                <button class="btn btn-outline" onclick="window.navigateTo('observations')" style="width: 100%; justify-content: flex-start; padding: 11px 16px;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                  Observation Records Log
                </button>

                <button class="btn btn-outline" onclick="window.navigateTo('my-children')" style="width: 100%; justify-content: flex-start; padding: 11px 16px;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
                  Assigned Students List
                </button>
              </div>
            </div>

            <!-- 5-Domain Observation Guide Card -->
            <div class="card" style="margin-bottom: 0; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
              <div style="font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                5-Domain Observation Guide
              </div>
              <p style="font-size: 12.5px; color: #64748b; line-height: 1.5; margin-bottom: 12px;">
                Standardized framework for recording classroom behaviors:
              </p>
              <div style="display: flex; flex-direction: column; gap: 8px; font-size: 12.5px;">
                <div style="display: flex; gap: 6px; align-items: center;"><strong style="color: #2563eb;">1. Social:</strong> Peer play & joint attention</div>
                <div style="display: flex; gap: 6px; align-items: center;"><strong style="color: #8b5cf6;">2. Communication:</strong> Verbal & non-verbal</div>
                <div style="display: flex; gap: 6px; align-items: center;"><strong style="color: #f59e0b;">3. Behaviour:</strong> Repetitive & transitions</div>
                <div style="display: flex; gap: 6px; align-items: center;"><strong style="color: #ec4899;">4. Sensory:</strong> Sounds, touch, light</div>
                <div style="display: flex; gap: 6px; align-items: center;"><strong style="color: #10b981;">5. Learning:</strong> Focus & following rules</div>
              </div>
            </div>

          </div>

        </div>

      </div>
    `;
  }

  // ==========================================================================
  // 2. OBSERVATION CREATION FORM VIEW
  // ==========================================================================
  renderObservationForm(preselectedChildId) {
    const children = this.getAssignedChildren();
    const today = new Date().toISOString().split('T')[0];

    return `
      <div class="observation-form-view" style="color: #0f172a; font-family: 'Plus Jakarta Sans', sans-serif;">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <div>
            <h1 style="font-size: 24px; font-weight: 800; color: #0f172a; margin-bottom: 4px;">
              Log Classroom Observation
            </h1>
            <p style="font-size: 13.5px; color: #64748b; margin: 0;">
              Record structured behavioral notes across the 5 developmental domains.
            </p>
          </div>
          <button class="btn btn-outline btn-sm" onclick="window.navigateTo('observations')">
            &larr; Back to Observations
          </button>
        </div>

        <!-- Non-Clinical Banner -->
        <div style="background: #fffbeb; border: 1px solid #fef3c7; border-left: 4px solid #f59e0b; border-radius: 12px; padding: 12px 16px; margin-bottom: 20px; font-size: 12.5px; color: #92400e;">
          <strong>Classroom Context:</strong> Please evaluate natural behaviors observed in classroom and playground settings.
        </div>

        <!-- Form Card -->
        <div class="card" style="padding: 28px; border-radius: 16px; border: 1px solid #e2e8f0; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
          <form id="observation-create-form" onsubmit="window.teacherModule.handleSubmitObservation(event)">
            
            <!-- Section 1: Child & Context Metadata -->
            <div style="margin-bottom: 24px; border-bottom: 1px solid #f1f5f9; padding-bottom: 20px;">
              <h3 style="font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 14px;">1. Student & Environment Setup</h3>
              
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 16px;">
                <div>
                  <label style="display: block; font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 6px; text-transform: uppercase;">Child Student *</label>
                  <select id="obs-child-id" class="form-select" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; font-size: 14px;" required>
                    ${children.map(c => `<option value="${c.id}" ${c.id === preselectedChildId ? 'selected' : ''}>${c.first_name} ${c.last_name} (${c.child_code})</option>`).join('')}
                  </select>
                </div>

                <div>
                  <label style="display: block; font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 6px; text-transform: uppercase;">Observation Date *</label>
                  <input type="date" id="obs-date" class="form-control" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; font-size: 14px;" value="${today}" required>
                </div>

                <div>
                  <label style="display: block; font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 6px; text-transform: uppercase;">Activity Type</label>
                  <select id="obs-activity" class="form-select" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; font-size: 14px;">
                    <option value="Free Play">Free Play / Recess</option>
                    <option value="Group Circle Time" selected>Group Circle Time</option>
                    <option value="Structured Desk Work">Structured Desk Work</option>
                    <option value="Transition Period">Transition Period</option>
                    <option value="Mealtime">Mealtime / Snack</option>
                  </select>
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div>
                  <label style="display: block; font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 6px; text-transform: uppercase;">Classroom Noise Level</label>
                  <select id="obs-noise" class="form-select" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; font-size: 14px;">
                    <option value="Quiet">Quiet (Individually focused)</option>
                    <option value="Moderate" selected>Moderate (Normal classroom volume)</option>
                    <option value="Loud">Loud (Active group/playground)</option>
                  </select>
                </div>

                <div>
                  <label style="display: block; font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 6px; text-transform: uppercase;">Peer Setting</label>
                  <select id="obs-peers" class="form-select" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; font-size: 14px;">
                    <option value="1-on-1 with Teacher">1-on-1 with Teacher</option>
                    <option value="Small Group (2-4 peers)" selected>Small Group (2-4 peers)</option>
                    <option value="Whole Class (10+ peers)">Whole Class (10+ peers)</option>
                    <option value="Independent">Independent</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Section 2: 5 Developmental Domains Evaluation -->
            <div style="margin-bottom: 24px;">
              <h3 style="font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 14px;">2. 5-Domain Standardized Evaluation</h3>
              
              <div style="display: flex; flex-direction: column; gap: 16px;">
                ${this.renderDomainInput('social', '1. Social Interaction & Peer Play', 'Initiates peer interactions, participates in turn-taking, responds to name call, and shares toys.')}
                ${this.renderDomainInput('communication', '2. Communication & Language Expression', 'Uses words or gestures to request help, expresses needs clearly, understands multi-step verbal cues.')}
                ${this.renderDomainInput('behavioural', '3. Behavioural Patterns & Transitions', 'Adapts smoothly to classroom routine changes, switches tasks without distress, repetitive movements.')}
                ${this.renderDomainInput('sensory', '4. Sensory Responses & Sensitivities', 'Covers ears during loud bells, tolerates finger painting / textured materials, sensitivity to bright lights.')}
                ${this.renderDomainInput('learning', '5. Classroom Learning & Focus', 'Maintains attention on teacher instructions, completes age-appropriate tabletop tasks, follows classroom rules.')}
              </div>
            </div>

            <!-- Section 3: Triggers & Educator Remarks -->
            <div style="margin-bottom: 24px; border-top: 1px solid #f1f5f9; padding-top: 20px;">
              <h3 style="font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 14px;">3. Educator Observations & Triggers</h3>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                <div>
                  <label style="display: block; font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 6px; text-transform: uppercase;">Positive Triggers & What Worked</label>
                  <textarea id="obs-positive-triggers" class="form-control" rows="2" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; font-size: 14px;" placeholder="e.g. Visual schedule card, praise, quiet sensory corner..."></textarea>
                </div>

                <div>
                  <label style="display: block; font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 6px; text-transform: uppercase;">Challenging Triggers Observed</label>
                  <textarea id="obs-challenging-triggers" class="form-control" rows="2" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; font-size: 14px;" placeholder="e.g. Sudden loud school bell, abrupt transition from recess..."></textarea>
                </div>
              </div>

              <div>
                <label style="display: block; font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 6px; text-transform: uppercase;">Educator Notes & Narrative Summary *</label>
                <textarea id="obs-notes" class="form-control" rows="3" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; font-size: 14px;" placeholder="Detailed classroom notes regarding behavior, interactions, and focus..." required></textarea>
              </div>
            </div>

            <!-- Form Actions -->
            <div style="display: flex; justify-content: flex-end; gap: 12px; border-top: 1px solid #e2e8f0; padding-top: 18px;">
              <button type="button" class="btn btn-outline" onclick="window.navigateTo('observations')">Cancel</button>
              <button type="submit" class="btn btn-primary" style="font-weight: 600; padding: 10px 24px;">Submit Classroom Observation</button>
            </div>

          </form>
        </div>

      </div>
    `;
  }

  renderDomainInput(key, title, description) {
    return `
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px;">
        <div style="margin-bottom: 10px;">
          <div style="font-weight: 700; font-size: 14px; color: #0f172a;">${title}</div>
          <div style="font-size: 12px; color: #64748b;">${description}</div>
        </div>

        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          ${this.ratingOptions.map(opt => `
            <label style="display: inline-flex; align-items: center; gap: 6px; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 6px 12px; font-size: 13px; font-weight: 600; cursor: pointer; color: #334155;">
              <input type="radio" name="domain_${key}" value="${opt}" ${opt === 'Sometimes' ? 'checked' : ''} style="cursor: pointer;">
              ${opt}
            </label>
          `).join('')}
        </div>
      </div>
    `;
  }

  handleSubmitObservation(event) {
    event.preventDefault();
    const teacher = this.getCurrentTeacher();
    const childId = document.getElementById('obs-child-id').value;
    const observationDate = document.getElementById('obs-date').value;
    const activityType = document.getElementById('obs-activity').value;
    const noiseLevel = document.getElementById('obs-noise').value;
    const peerSetting = document.getElementById('obs-peers').value;
    const positiveTriggers = document.getElementById('obs-positive-triggers').value;
    const challengingTriggers = document.getElementById('obs-challenging-triggers').value;
    const educatorNotes = document.getElementById('obs-notes').value;

    const getDomainVal = key => {
      const checked = document.querySelector(`input[name="domain_${key}"]:checked`);
      return checked ? checked.value : 'Sometimes';
    };

    const domainRatings = {
      social_interaction: { rating: getDomainVal('social') },
      communication: { rating: getDomainVal('communication') },
      behavioural_patterns: { rating: getDomainVal('behavioural') },
      sensory_responses: { rating: getDomainVal('sensory') },
      classroom_learning: { rating: getDomainVal('learning') }
    };

    // Calculate severity
    let concernCount = 0;
    Object.values(domainRatings).forEach(d => {
      if (d.rating === 'Often' || d.rating === 'Always') concernCount++;
    });

    let overallSeverity = 'Normal/Typical';
    if (concernCount >= 3) overallSeverity = 'Significant Concern';
    else if (concernCount >= 1) overallSeverity = 'Moderate Concern';

    const newObservation = {
      id: 'obs_' + Date.now().toString(36),
      child_id: childId,
      teacher_id: teacher ? teacher.id : 'usr_teacher_1',
      observation_date: observationDate,
      activity_context: activityType,
      domain_ratings: domainRatings,
      overall_severity: overallSeverity,
      environmental_context: {
        activity_type: activityType,
        noise_level: noiseLevel,
        peer_setting: peerSetting
      },
      triggers: {
        positive: positiveTriggers,
        challenging: challengingTriggers
      },
      educator_notes: educatorNotes,
      teacher_note: educatorNotes,
      status: 'Submitted',
      created_at: new Date().toISOString()
    };

    window.neuroDB.createTeacherObservation(newObservation);
    if (window.showToast) window.showToast('Classroom observation logged successfully!', 'success');
    window.navigateTo('observations');
  }

  // ==========================================================================
  // 3. OBSERVATIONS LIST / HISTORY VIEW
  // ==========================================================================
  renderObservationsListView() {
    const observations = window.neuroDB.getTeacherObservations();
    const children = window.neuroDB.getChildren();

    return `
      <div class="observations-list-view" style="color: #0f172a; font-family: 'Plus Jakarta Sans', sans-serif;">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 14px;">
          <div>
            <h1 style="font-size: 24px; font-weight: 800; color: #0f172a; margin-bottom: 4px;">
              Classroom Observations Log
            </h1>
            <p style="font-size: 13.5px; color: #64748b; margin: 0;">
              All recorded behavioral logs across developmental domains.
            </p>
          </div>
          <button class="btn btn-primary" onclick="window.navigateTo('observation-create')" style="display: flex; align-items: center; gap: 6px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            + New Observation
          </button>
        </div>

        <!-- Filter Controls -->
        <div class="card" style="padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0; background: #ffffff; margin-bottom: 20px;">
          <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 14px;">
            <div>
              <input type="text" id="obs-search-input" class="form-control" placeholder="Search by student name or code..." style="width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; padding: 8px 12px; font-size: 13.5px;" oninput="window.teacherModule.filterObservationsList()">
            </div>
            <div>
              <select id="obs-severity-filter" class="form-select" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; padding: 8px 12px; font-size: 13.5px;" onchange="window.teacherModule.filterObservationsList()">
                <option value="All">All Severity Levels</option>
                <option value="Normal/Typical">Normal/Typical</option>
                <option value="Moderate Concern">Moderate Concern</option>
                <option value="Significant Concern">Significant Concern</option>
              </select>
            </div>
            <div>
              <select id="obs-child-filter" class="form-select" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; padding: 8px 12px; font-size: 13.5px;" onchange="window.teacherModule.filterObservationsList()">
                <option value="All">All Students</option>
                ${children.map(c => `<option value="${c.id}">${c.first_name} ${c.last_name}</option>`).join('')}
              </select>
            </div>
          </div>
        </div>

        <!-- Observations Table -->
        <div class="card" style="padding: 0; border-radius: 14px; border: 1px solid #e2e8f0; background: #ffffff; overflow: hidden;">
          <div class="table-responsive">
            <table class="data-table" id="observations-data-table" style="width: 100%; border-collapse: collapse; text-align: left;">
              <thead>
                <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                  <th style="padding: 12px 16px; font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase;">Child Student</th>
                  <th style="padding: 12px 16px; font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase;">Date</th>
                  <th style="padding: 12px 16px; font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase;">Setting / Noise</th>
                  <th style="padding: 12px 16px; font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase;">Overall Severity</th>
                  <th style="padding: 12px 16px; font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase;">Educator Notes</th>
                  <th style="padding: 12px 16px; font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; text-align: right;">Action</th>
                </tr>
              </thead>
              <tbody id="obs-table-body">
                ${observations.map(obs => {
                  const child = window.neuroDB.getChildById(obs.child_id);
                  const sevColor = obs.overall_severity === 'Significant Concern' ? '#ef4444' : (obs.overall_severity === 'Moderate Concern' ? '#f59e0b' : '#10b981');
                  const sevBg = obs.overall_severity === 'Significant Concern' ? '#fee2e2' : (obs.overall_severity === 'Moderate Concern' ? '#fef3c7' : '#ecfdf5');

                  return `
                    <tr style="border-bottom: 1px solid #f1f5f9;">
                      <td style="padding: 12px 16px;">
                        <div style="font-weight: 700; font-size: 14px; color: #0f172a;">${child ? `${child.first_name} ${child.last_name}` : 'Student'}</div>
                        <div style="font-size: 11.5px; color: #64748b;">${child?.child_code || ''}</div>
                      </td>
                      <td style="padding: 12px 16px; font-size: 13px; color: #334155;">${obs.observation_date}</td>
                      <td style="padding: 12px 16px; font-size: 12.5px; color: #475569;">
                        ${obs.environmental_context?.activity_type || 'Classroom'} (${obs.environmental_context?.noise_level || 'Moderate'})
                      </td>
                      <td style="padding: 12px 16px;">
                        <span style="background: ${sevBg}; color: ${sevColor}; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 6px;">
                          ${obs.overall_severity || 'Typical'}
                        </span>
                      </td>
                      <td style="padding: 12px 16px; font-size: 12.5px; color: #64748b; max-width: 260px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                        ${obs.educator_notes || 'Routine observation'}
                      </td>
                      <td style="padding: 12px 16px; text-align: right;">
                        <button class="btn btn-outline btn-sm" onclick="window.teacherModule.openObservationModal('${obs.id}')">
                          View Details
                        </button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;
  }

  filterObservationsList() {
    const search = document.getElementById('obs-search-input')?.value.toLowerCase() || '';
    const sev = document.getElementById('obs-severity-filter')?.value || 'All';
    const childFilter = document.getElementById('obs-child-filter')?.value || 'All';
    const tbody = document.getElementById('obs-table-body');
    if (!tbody) return;

    let observations = window.neuroDB.getTeacherObservations();
    if (sev !== 'All') {
      observations = observations.filter(o => o.overall_severity === sev);
    }
    if (childFilter !== 'All') {
      observations = observations.filter(o => o.child_id === childFilter);
    }
    if (search) {
      observations = observations.filter(o => {
        const child = window.neuroDB.getChildById(o.child_id);
        const name = child ? `${child.first_name} ${child.last_name}`.toLowerCase() : '';
        const code = child?.child_code?.toLowerCase() || '';
        return name.includes(search) || code.includes(search);
      });
    }

    tbody.innerHTML = observations.map(obs => {
      const child = window.neuroDB.getChildById(obs.child_id);
      const sevColor = obs.overall_severity === 'Significant Concern' ? '#ef4444' : (obs.overall_severity === 'Moderate Concern' ? '#f59e0b' : '#10b981');
      const sevBg = obs.overall_severity === 'Significant Concern' ? '#fee2e2' : (obs.overall_severity === 'Moderate Concern' ? '#fef3c7' : '#ecfdf5');

      return `
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 12px 16px;">
            <div style="font-weight: 700; font-size: 14px; color: #0f172a;">${child ? `${child.first_name} ${child.last_name}` : 'Student'}</div>
            <div style="font-size: 11.5px; color: #64748b;">${child?.child_code || ''}</div>
          </td>
          <td style="padding: 12px 16px; font-size: 13px; color: #334155;">${obs.observation_date}</td>
          <td style="padding: 12px 16px; font-size: 12.5px; color: #475569;">
            ${obs.environmental_context?.activity_type || 'Classroom'} (${obs.environmental_context?.noise_level || 'Moderate'})
          </td>
          <td style="padding: 12px 16px;">
            <span style="background: ${sevBg}; color: ${sevColor}; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 6px;">
              ${obs.overall_severity || 'Typical'}
            </span>
          </td>
          <td style="padding: 12px 16px; font-size: 12.5px; color: #64748b; max-width: 260px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            ${obs.educator_notes || 'Routine observation'}
          </td>
          <td style="padding: 12px 16px; text-align: right;">
            <button class="btn btn-outline btn-sm" onclick="window.teacherModule.openObservationModal('${obs.id}')">
              View Details
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  // ==========================================================================
  // 4. CHILD PROFILE VIEW (NON-CLINICAL)
  // ==========================================================================
  renderChildProfile(childId) {
    const child = window.neuroDB.getChildById(childId);
    if (!child) return `<div>Child record not found.</div>`;

    const observations = window.neuroDB.getTeacherObservations({ child_id: childId });

    return `
      <div class="child-profile-view" style="color: #0f172a; font-family: 'Plus Jakarta Sans', sans-serif;">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <div>
            <h1 style="font-size: 24px; font-weight: 800; color: #0f172a; margin-bottom: 4px;">
              ${child.first_name} ${child.last_name}
            </h1>
            <p style="font-size: 13.5px; color: #64748b; margin: 0;">
              Student ID: <strong>${child.child_code}</strong> • Classroom: <strong>${child.classroom_group || 'Preschool A'}</strong>
            </p>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-outline btn-sm" onclick="window.navigateTo('my-children')">Back to Roster</button>
            <button class="btn btn-primary btn-sm" onclick="window.navigateTo('observation-create', { childId: '${child.id}' })">
              + Log Observation
            </button>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 20px;">
          <!-- Left: Student Info Card -->
          <div class="card" style="padding: 20px; border-radius: 14px; border: 1px solid #e2e8f0; background: #ffffff;">
            <div style="text-align: center; margin-bottom: 16px;">
              <div style="width: 64px; height: 64px; border-radius: 50%; background: #eff6ff; color: #2563eb; font-weight: 800; font-size: 22px; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px;">
                ${child.first_name[0]}${child.last_name[0]}
              </div>
              <h3 style="font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 2px;">${child.first_name} ${child.last_name}</h3>
              <span class="badge badge-success" style="font-size: 11px;">Active Student</span>
            </div>

            <div style="border-top: 1px solid #f1f5f9; padding-top: 14px; font-size: 13px; display: flex; flex-direction: column; gap: 8px;">
              <div><strong>Age:</strong> ${child.age_months ? `${Math.floor(child.age_months/12)} yrs ${child.age_months%12} mos` : '3 years'}</div>
              <div><strong>Gender:</strong> ${child.gender || 'Not specified'}</div>
              <div><strong>Primary Language:</strong> ${child.primary_language || 'English'}</div>
              <div><strong>Emergency Contact:</strong> Parent / Caregiver</div>
            </div>
          </div>

          <!-- Right: Past Observations Timeline -->
          <div class="card" style="padding: 20px; border-radius: 14px; border: 1px solid #e2e8f0; background: #ffffff;">
            <h3 style="font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 14px;">Classroom Observation History</h3>
            
            ${observations.length === 0 ? `
              <p style="font-size: 13px; color: #64748b;">No observations logged for this student yet.</p>
            ` : `
              <div style="display: flex; flex-direction: column; gap: 12px;">
                ${observations.map(obs => `
                  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                      <strong style="font-size: 13.5px; color: #0f172a;">${obs.observation_date}</strong>
                      <span class="badge badge-info" style="font-size: 11px;">${obs.overall_severity}</span>
                    </div>
                    <p style="font-size: 13px; color: #475569; margin-bottom: 8px;">${obs.educator_notes}</p>
                    <button class="btn btn-outline btn-sm" onclick="window.teacherModule.openObservationModal('${obs.id}')" style="font-size: 11px; padding: 2px 6px;">
                      View Full Details
                    </button>
                  </div>
                `).join('')}
              </div>
            `}
          </div>
        </div>

      </div>
    `;
  }

  // ==========================================================================
  // 5. OBSERVATION DETAIL MODAL
  // ==========================================================================
  openObservationModal(obsId) {
    const obs = window.neuroDB.getTeacherObservationById(obsId);
    if (!obs) return;
    const child = window.neuroDB.getChildById(obs.child_id);
    const teacher = window.neuroDB.getUserById(obs.teacher_id);

    const ratings = obs.domain_ratings || {};

    const bodyHtml = `
      <div style="color: #0f172a; font-family: 'Plus Jakarta Sans', sans-serif;">
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px 16px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-size: 14.5px; font-weight: 700; color: #0f172a;">${child ? `${child.first_name} ${child.last_name}` : 'Student'}</div>
            <div style="font-size: 12px; color: #64748b;">Code: ${child?.child_code || ''} • Logged by ${teacher?.full_name || 'Teacher'} on ${obs.observation_date}</div>
          </div>
          <span class="badge badge-warning" style="font-size: 12px;">${obs.overall_severity || 'Typical'}</span>
        </div>

        <div style="margin-bottom: 16px;">
          <h4 style="font-size: 12.5px; font-weight: 700; color: #475569; text-transform: uppercase; margin-bottom: 8px;">5-Domain Rating Breakdown</h4>
          <div style="display: flex; flex-direction: column; gap: 6px; font-size: 13px;">
            <div style="display: flex; justify-content: space-between; padding: 7px 12px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px;">
              <span>1. Social Interaction & Peer Play</span>
              <strong style="color: #2563eb;">${ratings.social_interaction?.rating || 'Not Observed'}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 7px 12px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px;">
              <span>2. Communication & Expression</span>
              <strong style="color: #8b5cf6;">${ratings.communication?.rating || 'Not Observed'}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 7px 12px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px;">
              <span>3. Behavioural Patterns & Transitions</span>
              <strong style="color: #f59e0b;">${ratings.behavioural_patterns?.rating || 'Not Observed'}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 7px 12px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px;">
              <span>4. Sensory Responses & Sensitivities</span>
              <strong style="color: #ec4899;">${ratings.sensory_responses?.rating || 'Not Observed'}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 7px 12px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px;">
              <span>5. Classroom Learning & Focus</span>
              <strong style="color: #10b981;">${ratings.classroom_learning?.rating || 'Not Observed'}</strong>
            </div>
          </div>
        </div>

        <div style="margin-bottom: 16px;">
          <h4 style="font-size: 12.5px; font-weight: 700; color: #475569; text-transform: uppercase; margin-bottom: 6px;">Educator Narrative Notes</h4>
          <p style="font-size: 13px; color: #334155; background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 0; line-height: 1.5;">
            "${obs.educator_notes || 'No narrative notes provided.'}"
          </p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 12px; color: #475569;">
          <div><strong>Activity:</strong> ${obs.environmental_context?.activity_type || 'Classroom'}</div>
          <div><strong>Noise Level:</strong> ${obs.environmental_context?.noise_level || 'Moderate'}</div>
        </div>
      </div>
    `;

    const footerHtml = `
      <button class="btn btn-primary" onclick="window.closeActiveModal()">Close</button>
    `;

    window.openModal('Classroom Observation Details', bodyHtml, footerHtml);
  }
}

window.teacherModule = new TeacherModule();
