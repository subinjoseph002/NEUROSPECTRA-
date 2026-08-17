/**
 * NEUROSPECTRA - Standardized Screening & Assessment Engine
 * Full implementation of M-CHAT-R/F Foundation and Behavioural Baseline questionnaires.
 */

window.currentAssessmentState = {
  childId: null,
  templateId: 'tmpl_mchat_rf',
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

  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">Conduct Screening Assessment</h1>
        <p class="page-subtitle">Standardized developmental screening questionnaire with automated risk scoring.</p>
      </div>
      <button class="btn btn-outline" onclick="window.navigateTo('assessments')">
        &larr; Back to Assessments
      </button>
    </div>

    <!-- Screening Config Card -->
    <div class="card" style="margin-bottom: 20px;">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label">Select Child Patient <span class="required">*</span></label>
          <select class="form-control" onchange="window.currentAssessmentState.childId = this.value; window.renderCurrentView();">
            ${children.map(c => `
              <option value="${c.id}" ${c.id === window.currentAssessmentState.childId ? 'selected' : ''}>
                ${c.first_name} ${c.last_name} (${c.child_code} - Age ${c.age_months} mos)
              </option>
            `).join('')}
          </select>
        </div>

        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label">Screening Instrument <span class="required">*</span></label>
          <select class="form-control" onchange="window.currentAssessmentState.templateId = this.value; window.currentAssessmentState.responses = {}; window.renderCurrentView();">
            ${templates.map(t => `
              <option value="${t.id}" ${t.id === selectedTemplate.id ? 'selected' : ''}>
                ${t.title} (${t.total_questions} Questions)
              </option>
            `).join('')}
          </select>
        </div>
      </div>
    </div>

    <!-- Questionnaire Interactive Area -->
    <div class="card">
      <div class="card-header">
        <div>
          <div class="card-title">${selectedTemplate.title}</div>
          <div style="font-size: 12px; color: var(--slate-500); margin-top: 2px;">
            Targeting early social-communication and repetitive behavior indicators.
          </div>
        </div>
        <div style="text-align: right;">
          <span style="font-size: 12.5px; font-weight: 700; color: var(--primary-600);" id="answered-counter">
            ${Object.keys(window.currentAssessmentState.responses).length} of ${questions.length} Answered
          </span>
        </div>
      </div>

      <!-- Questionnaire Items Form -->
      <form id="assessment-form" onsubmit="window.submitAssessment(event)">
        <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px;">
          ${questions.map((q, idx) => {
            const currentVal = window.currentAssessmentState.responses[q.id];
            return `
              <div class="assessment-card" style="margin-bottom: 0;" id="q-card-${q.id}">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <div class="question-number">Question ${idx + 1} &bull; ${q.domain}</div>
                  ${q.reverse_scored ? '<span class="badge badge-warning" style="font-size: 10px;">Reverse Scored Item</span>' : ''}
                </div>
                <div class="question-text">${q.text}</div>
                <div class="options-group">
                  <label class="option-choice ${currentVal === 'yes' ? 'selected' : ''}" onclick="window.selectAnswer('${q.id}', 'yes')">
                    <input type="radio" name="response_${q.id}" value="yes" ${currentVal === 'yes' ? 'checked' : ''} style="display: none;">
                    <span style="width: 18px; height: 18px; border-radius: 50%; border: 2px solid ${currentVal === 'yes' ? 'var(--primary-600)' : 'var(--slate-300)'}; display: inline-flex; align-items: center; justify-content: center;">
                      ${currentVal === 'yes' ? '<span style="width: 8px; height: 8px; border-radius: 50%; background: var(--primary-600);"></span>' : ''}
                    </span>
                    <span>Yes</span>
                  </label>

                  <label class="option-choice ${currentVal === 'no' ? 'selected' : ''}" onclick="window.selectAnswer('${q.id}', 'no')">
                    <input type="radio" name="response_${q.id}" value="no" ${currentVal === 'no' ? 'checked' : ''} style="display: none;">
                    <span style="width: 18px; height: 18px; border-radius: 50%; border: 2px solid ${currentVal === 'no' ? 'var(--primary-600)' : 'var(--slate-300)'}; display: inline-flex; align-items: center; justify-content: center;">
                      ${currentVal === 'no' ? '<span style="width: 8px; height: 8px; border-radius: 50%; background: var(--primary-600);"></span>' : ''}
                    </span>
                    <span>No</span>
                  </label>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Therapist Clinical Observations -->
        <div class="form-group" style="margin-top: 24px;">
          <label class="form-label">Therapist Clinical Observations & Environmental Context</label>
          <textarea id="therapist-obs-notes" class="form-control" rows="4" placeholder="Enter clinical notes, child engagement observations, and sensory responsiveness during the evaluation...">${window.currentAssessmentState.therapistNotes || ''}</textarea>
          <div class="form-help">Include notes on caregiver reporting consistency and direct clinic observation.</div>
        </div>

        <!-- Medical Disclaimer -->
        <div class="medical-disclaimer-badge" style="margin-bottom: 24px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary-600)" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
          <div><strong>Screening Indicator Notice:</strong> Submission calculates a standardized risk stratification score. This tool is designed to identify children who require further comprehensive clinical diagnostic evaluation and does not constitute a standalone medical diagnosis.</div>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 12px;">
          <button type="button" class="btn btn-outline" onclick="window.navigateTo('assessments')">Cancel</button>
          <button type="button" class="btn btn-secondary" onclick="window.fillDemoAssessmentAnswers()">Auto-Fill Sample Responses</button>
          <button type="submit" class="btn btn-primary btn-lg">Calculate Risk & Submit Assessment</button>
        </div>
      </form>
    </div>
  `;
};

window.selectAnswer = function(questionId, value) {
  window.currentAssessmentState.responses[questionId] = value;
  const card = document.getElementById(`q-card-${questionId}`);
  if (card) {
    const choices = card.querySelectorAll('.option-choice');
    choices.forEach(c => c.classList.remove('selected'));
    const selected = card.querySelector(`input[value="${value}"]`)?.closest('.option-choice');
    if (selected) selected.classList.add('selected');
  }
  const counter = document.getElementById('answered-counter');
  if (counter) {
    const questions = window.neuroDB.getQuestionsByTemplateId(window.currentAssessmentState.templateId);
    counter.innerText = `${Object.keys(window.currentAssessmentState.responses).length} of ${questions.length} Answered`;
  }
};

window.fillDemoAssessmentAnswers = function() {
  const questions = window.neuroDB.getQuestionsByTemplateId(window.currentAssessmentState.templateId);
  // Fill realistic moderate risk sample
  questions.forEach((q, idx) => {
    if ([1, 4, 6, 9].includes(idx)) {
      window.currentAssessmentState.responses[q.id] = q.reverse_scored ? 'yes' : 'no'; // flags risk
    } else {
      window.currentAssessmentState.responses[q.id] = q.reverse_scored ? 'no' : 'yes'; // typical
    }
  });
  window.currentAssessmentState.therapistNotes = 'Child showed good eye contact during physical motor play, but demonstrated reduced response to name calling and delayed joint attention during tabletop testing.';
  window.renderCurrentView();
  window.showToast('Sample screening responses populated for demonstration.', 'info');
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

  // Calculate score
  let totalScore = 0;
  questions.forEach(q => {
    const val = window.currentAssessmentState.responses[q.id];
    if (q.reverse_scored) {
      if (val === 'yes') totalScore += 1;
    } else {
      if (val === 'no') totalScore += 1;
    }
  });

  let riskLevel = 'Low Risk Indicator';
  let riskColor = 'emerald';
  if (totalScore >= 8) {
    riskLevel = 'High Risk Indicator';
    riskColor = 'rose';
  } else if (totalScore >= 3) {
    riskLevel = 'Moderate Risk Indicator';
    riskColor = 'amber';
  }

  const currentUser = window.neuroAuth.getCurrentUser();
  const newRecord = window.neuroDB.saveAssessmentRecord({
    child_id: window.currentAssessmentState.childId,
    therapist_id: currentUser.id,
    template_id: window.currentAssessmentState.templateId,
    total_score: totalScore,
    risk_level: riskLevel,
    risk_color: riskColor,
    therapist_notes: obsNotes,
    responses_json: window.currentAssessmentState.responses
  });

  // Also notify parent
  const child = window.neuroDB.getChildById(window.currentAssessmentState.childId);
  if (child && child.primary_parent_id) {
    window.neuroDB.createNotification({
      user_id: child.primary_parent_id,
      title: 'New Screening Assessment Completed',
      message: `Screening results for ${child.first_name} are now available for review with Dr. Aisha Khan.`,
      type: 'assessment',
      link: '#reports'
    });
  }

  window.showToast('Screening assessment completed and saved successfully!', 'success');
  window.openChildProfileTab(window.currentAssessmentState.childId, 'assessments');
};
