/**
 * NEUROSPECTRA - Standardized Screening & Assessment Engine
 * Supports 5-Point Child-Friendly Assessment Batteries & Standardized M-CHAT-R/F,
 * with supporting teacher observation cross-referencing and automated therapy plan linking.
 * Native Healthcare Design System with SVG Icons & Live DB Binding.
 */

window.currentAssessmentState = {
  childId: null,
  templateId: 'tmpl_communication',
  responses: {},
  therapistNotes: '',
  currentQuestionIndex: 0
};

window.renderAssessmentConductView = function(childId) {
  const children = window.neuroDB.getChildren();
  const templates = window.neuroDB.getAssessmentTemplates();
  
  if (childId) {
    window.currentAssessmentState.childId = childId;
  } else if (!window.currentAssessmentState.childId && children.length > 0) {
    window.currentAssessmentState.childId = children[0].id;
  }

  const selectedChild = window.neuroDB.getChildById(window.currentAssessmentState.childId);
  const selectedTemplate = templates.find(t => t.id === window.currentAssessmentState.templateId) || templates[0];
  const questions = window.neuroDB.getQuestionsByTemplateId(selectedTemplate.id);
  const teacherObservations = window.currentAssessmentState.childId 
    ? window.neuroDB.getTeacherObservations({ child_id: window.currentAssessmentState.childId }) 
    : [];

  return `
    <div class="assessment-conduct-view" style="color: #0f172a; font-family: 'Plus Jakarta Sans', sans-serif;">
      
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 14px;">
        <div>
          <h1 style="font-size: 24px; font-weight: 800; color: #0f172a; margin-bottom: 4px;">
            Clinical Developmental Assessment Engine
          </h1>
          <p style="font-size: 13.5px; color: #64748b; margin: 0;">
            Standardized pediatric evaluations cross-referenced with teacher classroom logs.
          </p>
        </div>
        <button class="btn btn-outline btn-sm" onclick="window.navigateTo('assessments')">
          &larr; Back to Assessments
        </button>
      </div>

      <!-- Config & Supporting Teacher Context Grid -->
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-bottom: 24px;">
        
        <!-- Configuration Card -->
        <div class="card" style="padding: 20px; border-radius: 14px; border: 1px solid #e2e8f0; background: #ffffff;">
          <h3 style="font-size: 14px; font-weight: 700; color: #0f172a; text-transform: uppercase; margin-bottom: 14px; display: flex; align-items: center; gap: 8px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            Assessment Configuration
          </h3>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 12px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 6px; text-transform: uppercase;">Child Patient *</label>
              <select class="form-select" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; font-size: 13.5px;" onchange="window.currentAssessmentState.childId = this.value; window.renderCurrentView();">
                ${children.map(c => `
                  <option value="${c.id}" ${c.id === window.currentAssessmentState.childId ? 'selected' : ''}>
                    ${c.first_name} ${c.last_name} (${c.child_code} - Age ${c.age_months ? `${Math.floor(c.age_months / 12)}y ${c.age_months % 12}m` : '3y'})
                  </option>
                `).join('')}
              </select>
            </div>

            <div>
              <label style="display: block; font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 6px; text-transform: uppercase;">Instrument Battery *</label>
              <select class="form-select" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; font-size: 13.5px;" onchange="window.currentAssessmentState.templateId = this.value; window.currentAssessmentState.responses = {}; window.renderCurrentView();">
                ${templates.map(t => `
                  <option value="${t.id}" ${t.id === selectedTemplate.id ? 'selected' : ''}>
                    ${t.title} (${t.total_questions} Items)
                  </option>
                `).join('')}
              </select>
            </div>
          </div>

          <div style="background: #eff6ff; border: 1px solid #dbeafe; border-radius: 8px; padding: 10px 14px; font-size: 12.5px; color: #1e40af;">
            <strong>${selectedTemplate.title}:</strong> ${selectedTemplate.description}
          </div>
        </div>

        <!-- Teacher Observations Context Card -->
        <div class="card" style="padding: 20px; border-radius: 14px; border: 1px solid #e0e7ff; background: #f5f3ff;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <h3 style="font-size: 13.5px; font-weight: 700; color: #3730a3; text-transform: uppercase; margin: 0; display: flex; align-items: center; gap: 6px;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2.2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              Teacher Classroom Logs
            </h3>
            <span class="badge badge-purple" style="font-size: 11px;">${teacherObservations.length} Logs</span>
          </div>

          ${teacherObservations.length === 0 ? `
            <p style="font-size: 12.5px; color: #6b7280; font-style: italic; margin: 0;">No teacher classroom observations logged yet for this child.</p>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 8px; max-height: 180px; overflow-y: auto;">
              ${teacherObservations.slice(0, 2).map(obs => `
                <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; font-size: 12px;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                    <strong style="color: #0f172a;">${obs.observation_date}</strong>
                    <span style="color: #4f46e5; font-weight: 600;">${obs.environmental_context?.activity_type || 'Classroom'}</span>
                  </div>
                  <p style="color: #475569; margin: 0 0 4px; font-style: italic;">"${obs.educator_notes || 'Observed behaviors recorded.'}"</p>
                  <button type="button" class="btn btn-outline btn-sm" onclick="window.teacherModule && window.teacherModule.openObservationModal('${obs.id}')" style="font-size: 10.5px; padding: 2px 6px;">
                    View Ratings &rarr;
                  </button>
                </div>
              `).join('')}
            </div>
          `}
        </div>

      </div>

      <!-- Questionnaire Interactive Form Card -->
      <div class="card" style="padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #f1f5f9; padding-bottom: 14px;">
          <div>
            <h2 style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 0 0 2px;">${selectedTemplate.title}</h2>
            <div style="font-size: 12.5px; color: #64748b;">
              Category: <strong>${selectedTemplate.category}</strong> • Scoring: <strong>${selectedTemplate.scoring_method === 'Rating_Scale_5' ? '5-Point Frequency Scale' : 'Standardized Diagnostic Index'}</strong>
            </div>
          </div>
          <span class="badge badge-info" id="answered-counter" style="font-size: 12px; padding: 6px 12px;">
            ${Object.keys(window.currentAssessmentState.responses).length} of ${questions.length} Answered
          </span>
        </div>

        <form id="assessment-form" onsubmit="window.submitAssessment(event)">
          <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px;">
            ${questions.map((q, idx) => {
              const currentVal = window.currentAssessmentState.responses[q.id];
              const is5Point = q.type === 'rating_5' || (q.options && q.options.length > 2);
              const options = q.options || ['Never', 'Sometimes', 'Often', 'Always', 'Not Observed'];

              return `
                <div id="q-card-${q.id}" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <span style="font-size: 11.5px; font-weight: 700; color: #4338ca; background: #e0e7ff; padding: 2px 8px; border-radius: 6px; text-transform: uppercase;">
                      Item ${idx + 1} • ${q.domain}
                    </span>
                    ${q.reverse_scored ? '<span class="badge badge-warning" style="font-size: 10.5px;">Reverse Scored</span>' : ''}
                  </div>

                  <p style="font-size: 14px; font-weight: 600; color: #0f172a; margin-bottom: 12px;">${q.text}</p>

                  ${is5Point ? `
                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                      ${options.map(opt => `
                        <label style="display: inline-flex; align-items: center; gap: 6px; background: #ffffff; border: 1px solid ${currentVal === opt ? '#2563eb' : '#cbd5e1'}; border-radius: 8px; padding: 6px 14px; font-size: 13px; font-weight: 600; cursor: pointer; color: ${currentVal === opt ? '#2563eb' : '#334155'}; transition: all 0.2s;">
                          <input type="radio" name="response_${q.id}" value="${opt}" ${currentVal === opt ? 'checked' : ''} onchange="window.selectAnswer('${q.id}', '${opt}')" required style="cursor: pointer;">
                          ${opt}
                        </label>
                      `).join('')}
                    </div>
                  ` : `
                    <div style="display: flex; gap: 12px;">
                      <label style="display: inline-flex; align-items: center; gap: 6px; background: #ffffff; border: 1px solid ${currentVal === 'yes' ? '#2563eb' : '#cbd5e1'}; border-radius: 8px; padding: 6px 16px; font-size: 13px; font-weight: 600; cursor: pointer; color: #334155;">
                        <input type="radio" name="response_${q.id}" value="yes" ${currentVal === 'yes' ? 'checked' : ''} onchange="window.selectAnswer('${q.id}', 'yes')" required>
                        Yes
                      </label>
                      <label style="display: inline-flex; align-items: center; gap: 6px; background: #ffffff; border: 1px solid ${currentVal === 'no' ? '#2563eb' : '#cbd5e1'}; border-radius: 8px; padding: 6px 16px; font-size: 13px; font-weight: 600; cursor: pointer; color: #334155;">
                        <input type="radio" name="response_${q.id}" value="no" ${currentVal === 'no' ? 'checked' : ''} onchange="window.selectAnswer('${q.id}', 'no')" required>
                        No
                      </label>
                    </div>
                  `}
                </div>
              `;
            }).join('')}
          </div>

          <!-- Therapist Clinical Observations Synthesis -->
          <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 12px; padding: 18px; margin-bottom: 20px;">
            <label style="display: block; font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 6px; text-transform: uppercase;">
              Therapist Clinical Observations & Synthesis *
            </label>
            <textarea id="therapist-obs-notes" class="form-control" rows="3" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; font-size: 13.5px;" placeholder="Synthesize direct clinical observation findings with supporting teacher classroom logs..." required>${window.currentAssessmentState.therapistNotes || ''}</textarea>
            <p style="font-size: 12px; color: #64748b; margin: 6px 0 0;">Note sensory tolerance, attention span, vocal attempts, and consistency with educator report.</p>
          </div>

          <!-- Action Buttons -->
          <div style="display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid #e2e8f0; padding-top: 18px; flex-wrap: wrap;">
            <button type="button" class="btn btn-outline" onclick="window.navigateTo('assessments')">Cancel</button>
            <button type="button" class="btn btn-secondary" onclick="window.fillDemoAssessmentAnswers()">Auto-Fill Sample Responses</button>
            <button type="submit" class="btn btn-primary" style="font-weight: 600; padding: 10px 20px;">Calculate & Submit Assessment</button>
          </div>
        </form>
      </div>

    </div>
  `;
};

window.selectAnswer = function(questionId, value) {
  window.currentAssessmentState.responses[questionId] = value;
  const counter = document.getElementById('answered-counter');
  if (counter) {
    const questions = window.neuroDB.getQuestionsByTemplateId(window.currentAssessmentState.templateId);
    counter.innerText = `${Object.keys(window.currentAssessmentState.responses).length} of ${questions.length} Answered`;
  }
};

window.fillDemoAssessmentAnswers = function() {
  const questions = window.neuroDB.getQuestionsByTemplateId(window.currentAssessmentState.templateId);

  questions.forEach((q, idx) => {
    if (q.type === 'rating_5' || (q.options && q.options.length > 2)) {
      const sampleScale = ['Always', 'Often', 'Sometimes', 'Sometimes', 'Often'];
      window.currentAssessmentState.responses[q.id] = sampleScale[idx % sampleScale.length];
    } else {
      if ([1, 4, 6, 9].includes(idx)) {
        window.currentAssessmentState.responses[q.id] = q.reverse_scored ? 'yes' : 'no';
      } else {
        window.currentAssessmentState.responses[q.id] = q.reverse_scored ? 'no' : 'yes';
      }
    }
  });

  window.currentAssessmentState.therapistNotes = 'Child demonstrated positive engagement with visual props and turn-taking tasks. Corroborates teacher observations regarding sensory sensitivity to auditory stimuli.';
  window.renderCurrentView();
  window.showToast('Sample assessment responses populated for demonstration.', 'info');
};

window.submitAssessment = function(e) {
  if (e) e.preventDefault();
  const obsNotes = document.getElementById('therapist-obs-notes')?.value || '';
  const questions = window.neuroDB.getQuestionsByTemplateId(window.currentAssessmentState.templateId);

  // Validate all answered
  const unanswered = questions.filter(q => !window.currentAssessmentState.responses[q.id]);
  if (unanswered.length > 0) {
    window.showToast(`Please answer all questions before submitting (${unanswered.length} remaining).`, 'warning');
    const firstUnanswered = document.getElementById(`q-card-${unanswered[0].id}`);
    if (firstUnanswered) firstUnanswered.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  // Calculate score depending on template scoring method
  const template = window.neuroDB.getAssessmentTemplates().find(t => t.id === window.currentAssessmentState.templateId);
  let totalScore = 0;
  let riskLevel = 'Low Risk Indicator';
  let riskColor = 'emerald';

  if (template?.scoring_method === 'Rating_Scale_5') {
    const scoreMap = { 'Always': 5, 'Often': 4, 'Sometimes': 3, 'Never': 1, 'Not Observed': 2 };
    let sum = 0;
    let count = 0;
    questions.forEach(q => {
      const val = window.currentAssessmentState.responses[q.id];
      sum += scoreMap[val] || 3;
      count++;
    });
    const avg = count > 0 ? (sum / count) : 3;
    totalScore = parseFloat(avg.toFixed(1));
    if (avg < 2.5) {
      riskLevel = 'High Priority Focus Area';
      riskColor = 'rose';
    } else if (avg < 3.8) {
      riskLevel = 'Moderate Developmental Support Needed';
      riskColor = 'amber';
    } else {
      riskLevel = 'Typical / Emerging Strength';
      riskColor = 'emerald';
    }
  } else {
    // M-CHAT-R/F Standard
    questions.forEach(q => {
      const val = window.currentAssessmentState.responses[q.id];
      if (q.reverse_scored) {
        if (val === 'yes') totalScore += 1;
      } else {
        if (val === 'no') totalScore += 1;
      }
    });

    if (totalScore >= 8) {
      riskLevel = 'High Risk Indicator';
      riskColor = 'rose';
    } else if (totalScore >= 3) {
      riskLevel = 'Moderate Risk Indicator';
      riskColor = 'amber';
    }
  }

  const currentUser = window.neuroAuth.getCurrentUser();
  const newRecord = window.neuroDB.saveAssessmentRecord({
    child_id: window.currentAssessmentState.childId,
    therapist_id: currentUser ? currentUser.id : 'usr_therapist_1',
    template_id: window.currentAssessmentState.templateId,
    total_score: totalScore,
    risk_level: riskLevel,
    risk_color: riskColor,
    therapist_notes: obsNotes,
    responses_json: window.currentAssessmentState.responses
  });

  // Prompt to create or link therapy plan
  const child = window.neuroDB.getChildById(window.currentAssessmentState.childId);
  if (child && child.primary_parent_id) {
    window.neuroDB.createNotification({
      user_id: child.primary_parent_id,
      title: 'New Clinical Assessment Completed',
      message: `Assessment results for ${child.first_name} are ready for review.`,
      type: 'assessment',
      link: '#reports'
    });
  }

  window.showToast('Assessment completed and recorded successfully!', 'success');
  
  if (confirm(`Assessment saved (Result: ${riskLevel}). Would you like to create an Individualized Therapy Plan for ${child ? child.first_name : 'this child'} now?`)) {
    window.showCreateTherapyPlanModal(window.currentAssessmentState.childId);
  } else {
    window.openChildProfileTab(window.currentAssessmentState.childId, 'assessments');
  }
};
