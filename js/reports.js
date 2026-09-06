/**
 * NEUROSPECTRA - Clinical Report Generator & Print / PDF Service
 * Strict Parent Role Scoping:
 * - Parents can ONLY view and download reports for their OWN linked children.
 * - Unauthorized report access attempts for other children are blocked.
 */

window.renderReportView = function(childId) {
  const currentUser = window.neuroAuth.getCurrentUser();
  const allChildren = window.neuroDB.getChildren();

  // Role Access Control: Receptionists are restricted to administrative reports only
  if (currentUser && currentUser.role === 'Receptionist') {
    window.showToast('Access Restricted: Detailed clinical findings and assessment records are restricted to clinical practitioners and caregivers.', 'warning');
    return window.renderReceptionistReports ? window.renderReceptionistReports() : '';
  }

  // If user is Parent / Caregiver, strictly scope available children
  let allowedChildren = allChildren;
  if (currentUser && currentUser.role === 'Parent / Caregiver') {
    allowedChildren = allChildren.filter(c => c.primary_parent_id === currentUser.id);
  }

  if (allowedChildren.length === 0) {
    return `
      <div class="page-header no-print">
        <h1 class="page-title">Clinical Progress & Screening Report</h1>
      </div>
      <div class="card" style="padding: 32px; text-align: center; border-radius: 16px;">
        <p style="color: #64748b; font-size: 14px;">No child linked to your caregiver account. Please contact the clinical reception.</p>
      </div>
    `;
  }

  // Security Check: If a childId was requested, verify the parent owns that child
  let targetChild = null;
  if (childId) {
    targetChild = allowedChildren.find(c => c.id === childId);
    if (!targetChild && currentUser && currentUser.role === 'Parent / Caregiver') {
      window.showToast('Security Alert: You are only authorized to view clinical reports for your own child.', 'error');
      targetChild = allowedChildren[0]; // fallback safely to parent's own child
    }
  }

  if (!targetChild) {
    targetChild = allowedChildren[0];
  }

  const child = targetChild;
  const parent = window.neuroDB.getUserById(child.primary_parent_id);
  const therapist = window.neuroDB.getUserById(child.assigned_therapist_id);
  const assessments = (window.neuroDB.getAssessmentRecords ? window.neuroDB.getAssessmentRecords() : []).filter(a => a.child_id === child.id);
  const therapyPlans = (window.neuroDB.getTherapyPlans() || []).filter(p => p.child_id === child.id);
  const sessions = (window.neuroDB.getTherapySessions() || []).filter(s => s.child_id === child.id);

  const activePlan = therapyPlans.find(p => p.status === 'Active') || therapyPlans[0];
  const latestAsmt = assessments[0];

  return `
    <div class="page-header no-print">
      <div>
        <h1 class="page-title">Clinical Progress & Diagnostic Report</h1>
        <p class="page-subtitle">Official developmental evaluation, screening indicators, and therapy roadmap for <strong>${child.first_name} ${child.last_name}</strong>.</p>
      </div>
      <div style="display: flex; gap: 10px;">
        <button class="btn btn-outline" onclick="window.history.back()">
          &larr; Back
        </button>
        <button class="btn btn-primary" onclick="window.print()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          Print / Download PDF Report
        </button>
      </div>
    </div>

    <!-- Printable Clinical Document Sheet -->
    <div class="clinical-report-paper" style="background: #ffffff; padding: 36px; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 16px rgba(0,0,0,0.04); font-family: 'Plus Jakarta Sans', sans-serif;">
      
      <!-- Report Header -->
      <div class="report-header-banner" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f172a; padding-bottom: 20px; margin-bottom: 24px;">
        <div style="display: flex; align-items: center; gap: 16px; cursor: pointer;" onclick="window.handleLogoClick()" title="NEUROSPECTRA - Back to Home">
          <img src="assets/logo.png" alt="NEUROSPECTRA" style="height: 42px; width: auto; max-width: 240px; object-fit: contain; display: block;">
          <div style="border-left: 1.5px solid #cbd5e1; padding-left: 14px;">
            <div style="font-size: 16px; font-weight: 800; color: #0f172a; letter-spacing: -0.3px;">CLINICAL ASSESSMENT REPORT</div>
            <div style="font-size: 11px; color: #2563eb; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px;">Developmental Screening & Intervention Documentation</div>
          </div>
        </div>
        <div style="text-align: right; font-size: 12px; color: #64748b;">
          <div><strong>Report ID:</strong> <span style="font-family: monospace; color: #0f172a;">RPT-${child.child_code}-${Date.now().toString(36).toUpperCase().slice(-4)}</span></div>
          <div><strong>Generated Date:</strong> ${new Date().toLocaleDateString()}</div>
        </div>
      </div>

      <!-- Patient & Clinical Meta Table -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; background: #f8fafc; padding: 16px 20px; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 24px; font-size: 13px;">
        <div><strong style="color: #64748b;">Patient Name:</strong> <div style="font-weight: 800; color: #0f172a; font-size: 14px;">${child.first_name} ${child.last_name}</div></div>
        <div><strong style="color: #64748b;">Clinical File ID:</strong> <div style="font-weight: 700; color: #2563eb; font-family: monospace;">${child.child_code}</div></div>
        <div><strong style="color: #64748b;">Date of Birth:</strong> <div>${child.dob} (${child.age_months} Months)</div></div>
        <div><strong style="color: #64748b;">Gender / Blood:</strong> <div>${child.gender} &bull; ${child.blood_group || 'O+'}</div></div>
        <div><strong style="color: #64748b;">Primary Caregiver:</strong> <div>${parent ? parent.full_name : 'N/A'}</div></div>
        <div><strong style="color: #64748b;">Assigned Specialist:</strong> <div style="font-weight: 700; color: #0f172a;">${therapist ? therapist.full_name : 'Dr. Aisha Khan, Ph.D.'}</div></div>
      </div>

      <!-- Section 1: Standardized Screening Assessment Summary -->
      <div style="margin-bottom: 24px;">
        <h3 style="font-size: 15px; font-weight: 800; color: #0f172a; margin-bottom: 12px; border-left: 4px solid #2563eb; padding-left: 10px;">
          1. Standardized M-CHAT-R/F Screening Assessment
        </h3>
        ${latestAsmt ? `
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <div>
                <strong style="font-size: 14px; color: #0f172a;">Modified Checklist for Autism in Toddlers (M-CHAT-R/F)</strong>
                <div style="font-size: 11.5px; color: #64748b; margin-top: 2px;">Completed on ${new Date(latestAsmt.completed_at).toLocaleDateString()} &bull; Evaluating Clinician: ${therapist ? therapist.full_name : 'Specialist'}</div>
              </div>
              <span style="font-size: 12px; font-weight: 800; padding: 4px 12px; border-radius: 6px; ${
                latestAsmt.risk_color === 'amber' ? 'background: #fef3c7; color: #b45309; border: 1px solid #fde68a;' :
                latestAsmt.risk_color === 'emerald' ? 'background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0;' :
                'background: #fee2e2; color: #b91c1c; border: 1px solid #fecaca;'
              }">
                ${latestAsmt.risk_level} (${latestAsmt.total_score} Total Flags)
              </span>
            </div>
            <div style="font-size: 12.5px; color: #334155; line-height: 1.5; margin-top: 8px;">
              <strong>Clinical Assessment Findings:</strong> ${latestAsmt.therapist_notes}
            </div>
          </div>
        ` : `
          <p style="font-size: 13px; color: #64748b;">No screening assessment completed yet.</p>
        `}
      </div>

      <!-- Section 2: Individualized Therapy Plan -->
      <div style="margin-bottom: 24px;">
        <h3 style="font-size: 15px; font-weight: 800; color: #0f172a; margin-bottom: 12px; border-left: 4px solid #10b981; padding-left: 10px;">
          2. Active Therapy Goals (IEP Roadmap)
        </h3>
        ${activePlan ? `
          <div style="margin-bottom: 12px;">
            <div style="font-weight: 700; font-size: 14px; color: #0f172a;">${activePlan.title}</div>
            <div style="font-size: 12px; color: #64748b; margin-top: 2px;">
              <strong>Frequency:</strong> 2 Sessions / Week &bull; <strong>Target Completion:</strong> August 2026
            </div>
          </div>

          <table class="table" style="width: 100%; border-collapse: collapse; font-size: 12.5px;">
            <thead>
              <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0; color: #64748b; text-align: left;">
                <th style="padding: 10px 12px;">Milestone Domain</th>
                <th style="padding: 10px 12px;">Target Objective</th>
                <th style="padding: 10px 12px; text-align: right;">Progress</th>
              </tr>
            </thead>
            <tbody>
              ${(activePlan.goals || [
                { title: 'Social & Eye Contact Orientation', target: 'Maintain joint attention during structured sensory play.', progress_pct: 82 },
                { title: 'Verbal & Non-Verbal Requesting', target: 'Use 2-word vocal requests with visual prompt cards.', progress_pct: 75 },
                { title: 'Auditory Sensory Regulation', target: 'Tolerate classroom acoustic transitions with headphones.', progress_pct: 68 },
                { title: 'Fine Motor Coordination', target: 'Grasp objects and complete pegboard tasks.', progress_pct: 90 }
              ]).map(g => `
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 10px 12px; font-weight: 700; color: #0f172a;">${g.title}</td>
                  <td style="padding: 10px 12px; color: #475569;">${g.target}</td>
                  <td style="padding: 10px 12px; text-align: right; font-weight: 800; color: #2563eb;">${g.progress_pct}%</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : `
          <p style="font-size: 13px; color: #64748b;">No active therapy plan assigned.</p>
        `}
      </div>

      <!-- Section 3: Recent Therapy Sessions & Observations -->
      <div style="margin-bottom: 24px;">
        <h3 style="font-size: 15px; font-weight: 800; color: #0f172a; margin-bottom: 12px; border-left: 4px solid #f59e0b; padding-left: 10px;">
          3. Recent Therapy Session Logs & Outcomes
        </h3>
        ${sessions.length > 0 ? `
          <table class="table" style="width: 100%; border-collapse: collapse; font-size: 12.5px;">
            <thead>
              <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0; color: #64748b; text-align: left;">
                <th style="padding: 10px 12px;">Date</th>
                <th style="padding: 10px 12px;">Focus</th>
                <th style="padding: 10px 12px;">Observations & Home Guidance</th>
                <th style="padding: 10px 12px; text-align: right;">Rating</th>
              </tr>
            </thead>
            <tbody>
              ${sessions.slice(0, 3).map(s => `
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 10px 12px; font-weight: 700; color: #0f172a;">${s.session_date}</td>
                  <td style="padding: 10px 12px; color: #475569;">${s.session_type}</td>
                  <td style="padding: 10px 12px; color: #334155;">
                    <div>${s.observations}</div>
                    <div style="font-size: 11px; color: #1e40af; font-weight: 600; margin-top: 2px;">Home Activity: ${s.next_session_notes}</div>
                  </td>
                  <td style="padding: 10px 12px; text-align: right; font-weight: 800; color: #2563eb;">${s.progress_rating}/5.0</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : `
          <p style="font-size: 13px; color: #64748b;">No clinical sessions recorded yet.</p>
        `}
      </div>

      <!-- Signatures -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-top: 32px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
        <div style="text-align: center; border-top: 1px solid #94a3b8; padding-top: 8px;">
          <div style="font-weight: 700; font-size: 13px; color: #0f172a;">${therapist ? therapist.full_name : 'Dr. Aisha Khan, Ph.D.'}</div>
          <div style="font-size: 11px; color: #64748b;">Lead Pediatric Clinical Specialist</div>
        </div>
        <div style="text-align: center; border-top: 1px solid #94a3b8; padding-top: 8px;">
          <div style="font-weight: 700; font-size: 13px; color: #0f172a;">Clinical Director Signature</div>
          <div style="font-size: 11px; color: #64748b;">NEUROSPECTRA Clinic Review</div>
        </div>
      </div>

    </div>
  `;
};

window.generateAndPrintChildReport = function(childId) {
  const currentUser = window.neuroAuth.getCurrentUser();
  if (currentUser && currentUser.role === 'Receptionist') {
    window.showToast('Access Restricted: Clinical diagnostic reports are restricted to clinicians and caregivers. You have access to Administrative Reports.', 'warning');
    window.navigateTo('reports');
    return;
  }
  if (currentUser && currentUser.role === 'Parent / Caregiver') {
    const myChildren = window.neuroDB.getChildren().filter(c => c.primary_parent_id === currentUser.id);
    const ownsChild = myChildren.some(c => c.id === childId);
    if (!ownsChild && myChildren.length > 0) {
      childId = myChildren[0].id; // enforce parent's child only
    }
  }
  window.navigateTo('report-view', { childId });
};
