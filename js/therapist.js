/**
 * NEUROSPECTRA - Exact Figma Therapist Dashboard Implementation
 */

window.renderTherapistDashboard = function() {
  return `
    <div class="figma-therapist-dashboard" style="color: #0f172a; font-family: 'Plus Jakarta Sans', sans-serif;">
      
      <!-- Top Row 4 Stat Cards -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 24px;">
        
        <!-- Stat 1 -->
        <div class="card" style="margin-bottom: 0; padding: 22px 24px; border-radius: 16px; border: 1px solid #e2e8f0; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <span style="font-size: 11.5px; font-weight: 700; color: #64748b; letter-spacing: 0.5px; text-transform: uppercase;">ASSIGNED CHILDREN</span>
            <div style="width: 30px; height: 30px; border-radius: 50%; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
            </div>
          </div>
          <div style="font-size: 36px; font-weight: 800; color: #0f172a; line-height: 1.1;">24</div>
        </div>

        <!-- Stat 2 -->
        <div class="card" style="margin-bottom: 0; padding: 22px 24px; border-radius: 16px; border: 1px solid #e2e8f0; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <span style="font-size: 11.5px; font-weight: 700; color: #64748b; letter-spacing: 0.5px; text-transform: uppercase;">PENDING ASSESSMENTS</span>
            <div style="width: 30px; height: 30px; border-radius: 50%; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
          </div>
          <div style="font-size: 36px; font-weight: 800; color: #0f172a; line-height: 1.1;">7</div>
        </div>

        <!-- Stat 3 -->
        <div class="card" style="margin-bottom: 0; padding: 22px 24px; border-radius: 16px; border: 1px solid #e2e8f0; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <span style="font-size: 11.5px; font-weight: 700; color: #64748b; letter-spacing: 0.5px; text-transform: uppercase;">TODAY'S SESSIONS</span>
            <div style="width: 30px; height: 30px; border-radius: 50%; background: #ecfdf5; color: #10b981; display: flex; align-items: center; justify-content: center;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
          </div>
          <div style="font-size: 36px; font-weight: 800; color: #0f172a; line-height: 1.1;">5</div>
        </div>

        <!-- Stat 4 -->
        <div class="card" style="margin-bottom: 0; padding: 22px 24px; border-radius: 16px; border: 1px solid #e2e8f0; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <span style="font-size: 11.5px; font-weight: 700; color: #64748b; letter-spacing: 0.5px; text-transform: uppercase;">RECENT REPORTS</span>
            <div style="width: 30px; height: 30px; border-radius: 50%; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            </div>
          </div>
          <div style="font-size: 36px; font-weight: 800; color: #0f172a; line-height: 1.1;">12</div>
        </div>

      </div>

      <!-- Middle Grid: Schedule (Left 2fr) + Actions (Right 1fr) -->
      <div style="display: grid; grid-template-columns: 2.1fr 1fr; gap: 24px; margin-bottom: 24px;">
        
        <!-- Left: Today's Clinical Schedule -->
        <div class="card" style="margin-bottom: 0; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0; background: #ffffff;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <div style="font-size: 16px; font-weight: 700; color: #0f172a;">Today's Clinical Schedule</div>
            <a href="#" style="font-size: 12.5px; color: #2563eb; font-weight: 600;" onclick="window.navigateTo('appointments'); return false;">View Full Calendar</a>
          </div>

          <div style="display: flex; flex-direction: column; gap: 12px;">
            
            <!-- Schedule Item 1 -->
            <div style="background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 12px; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 16px;">
                <span style="background: #eff6ff; color: #2563eb; font-weight: 700; font-size: 12.5px; padding: 6px 12px; border-radius: 8px; font-family: 'JetBrains Mono', monospace;">
                  09:00 AM
                </span>
                <div>
                  <div style="font-weight: 700; font-size: 14.5px; color: #0f172a;">Toby Jenkins</div>
                  <div style="font-size: 12px; color: #64748b;">DSM-5 Assessment Review</div>
                </div>
              </div>
              <div style="font-size: 12.5px; color: #94a3b8; font-weight: 500;">45 mins</div>
            </div>

            <!-- Schedule Item 2 -->
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

            <!-- Schedule Item 3 -->
            <div style="background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 12px; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 16px;">
                <span style="background: #eff6ff; color: #2563eb; font-weight: 700; font-size: 12.5px; padding: 6px 12px; border-radius: 8px; font-family: 'JetBrains Mono', monospace;">
                  02:00 PM
                </span>
                <div>
                  <div style="font-weight: 700; font-size: 14.5px; color: #0f172a;">Emma Watson</div>
                  <div style="font-size: 12px; color: #64748b;">Behavior Trial Session</div>
                </div>
              </div>
              <div style="font-size: 12.5px; color: #94a3b8; font-weight: 500;">45 mins</div>
            </div>

            <!-- Schedule Item 4 -->
            <div style="background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 12px; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 16px;">
                <span style="background: #eff6ff; color: #2563eb; font-weight: 700; font-size: 12.5px; padding: 6px 12px; border-radius: 8px; font-family: 'JetBrains Mono', monospace;">
                  04:30 PM
                </span>
                <div>
                  <div style="font-weight: 700; font-size: 14.5px; color: #0f172a;">Noah Bennett</div>
                  <div style="font-size: 12px; color: #64748b;">Parent Counseling Consultation</div>
                </div>
              </div>
              <div style="font-size: 12.5px; color: #94a3b8; font-weight: 500;">30 mins</div>
            </div>

          </div>
        </div>

        <!-- Right: Quick Actions & Need Board Consultation -->
        <div style="display: flex; flex-direction: column; gap: 20px;">
          
          <!-- Quick Actions Card -->
          <div class="card" style="margin-bottom: 0; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0; background: #ffffff;">
            <div style="font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 16px;">Quick Actions</div>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <button style="background: #2563eb; color: #ffffff; font-weight: 600; font-size: 14px; padding: 11px 16px; border-radius: 8px; border: none; cursor: pointer; display: flex; align-items: center; gap: 10px; justify-content: flex-start; transition: all 0.2s;" onclick="window.startNewAssessment()" onmouseover="this.style.background='#1d4ed8'" onmouseout="this.style.background='#2563eb'">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="11" x2="19" y2="17"/><line x1="22" y1="14" x2="16" y2="14"/></svg>
                New Assessment
              </button>
              
              <button style="background: #eff6ff; color: #2563eb; font-weight: 600; font-size: 14px; padding: 11px 16px; border-radius: 8px; border: 1px solid #dbeafe; cursor: pointer; display: flex; align-items: center; gap: 10px; justify-content: flex-start; transition: all 0.2s;" onclick="window.showCreateTherapyPlanModal()" onmouseover="this.style.background='#dbeafe'" onmouseout="this.style.background='#eff6ff'">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                Create Therapy Plan
              </button>

              <button style="background: #f8fafc; color: #0f172a; font-weight: 600; font-size: 14px; padding: 11px 16px; border-radius: 8px; border: 1px solid #e2e8f0; cursor: pointer; display: flex; align-items: center; gap: 10px; justify-content: flex-start; transition: all 0.2s;" onclick="window.showBookAppointmentModal()" onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='#f8fafc'">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Schedule Session
              </button>
            </div>
          </div>

          <!-- Need Board Consultation Card -->
          <div class="card" style="margin-bottom: 0; padding: 24px; border-radius: 16px; border: 1px solid #334155; background: #1e293b; color: #ffffff;">
            <div style="font-size: 15px; font-weight: 700; color: #ffffff; margin-bottom: 8px;">Need Board Consultation?</div>
            <p style="font-size: 12.5px; color: #94a3b8; line-height: 1.55; margin-bottom: 16px;">
              Instantly connect with senior board-certified pediatricians and behavior analysts (BCBA-D) inside your secure environment.
            </p>
            <button style="width: 100%; background: #2563eb; color: #ffffff; font-weight: 600; font-size: 13.5px; padding: 10px; border-radius: 8px; border: none; cursor: pointer; box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3); transition: all 0.2s;" onclick="window.navigateTo('messages')" onmouseover="this.style.background='#1d4ed8'" onmouseout="this.style.background='#2563eb'">
              Launch Secure Chat
            </button>
          </div>

        </div>

      </div>

      <!-- Bottom Section: Recent Progress Reports -->
      <div class="card" style="margin-bottom: 0; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0; background: #ffffff;">
        <div style="font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 18px;">Recent Progress Reports</div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <strong style="font-size: 14.5px; color: #0f172a;">Toby Jenkins</strong>
              <span style="font-size: 12px; color: #94a3b8;">Jan 12</span>
            </div>
            <div style="font-size: 13px; font-weight: 700; color: #2563eb; margin-bottom: 6px;">Milestone IEP #4</div>
            <div style="font-size: 13px; color: #64748b; line-height: 1.5;">
              Improved non-verbal social gestures by 20% over 5 trials.
            </div>
          </div>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <strong style="font-size: 14.5px; color: #0f172a;">Emma Watson</strong>
              <span style="font-size: 12px; color: #94a3b8;">Jan 11</span>
            </div>
            <div style="font-size: 13px; font-weight: 700; color: #2563eb; margin-bottom: 6px;">Eye-Contact Baseline</div>
            <div style="font-size: 13px; color: #64748b; line-height: 1.5;">
              Met baseline objectives during intensive play simulation.
            </div>
          </div>

        </div>
      </div>

    </div>
  `;
};
