/**
 * NEUROSPECTRA - Standardized Screening & Assessment Engine
 * Supports 5-Point Child-Friendly Assessment Batteries & Standardized M-CHAT-R/F,
 * with supporting teacher observation cross-referencing and automated therapy plan linking.
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
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Clinical Developmental Assessment</h1>
          <p class="text-sm text-slate-600 mt-1">Multi-battery developmental assessment engine with teacher classroom observations cross-referencing.</p>
        </div>
        <button class="btn btn-outline text-xs px-4 py-2 rounded-xl font-semibold" onclick="window.navigateTo('assessments')">
          &larr; Back to Assessments
        </button>
      </div>

      <!-- Config & Supporting Teacher Context Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <!-- Configuration Card (2 cols) -->
        <div class="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <i class="fas fa-sliders text-blue-600"></i> Assessment Battery Configuration
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Child Patient <span class="text-rose-500">*</span></label>
              <select class="input w-full rounded-xl border border-slate-200 py-2 px-3 text-sm bg-white font-medium" onchange="window.currentAssessmentState.childId = this.value; window.renderCurrentView();">
                ${children.map(c => `
                  <option value="${c.id}" ${c.id === window.currentAssessmentState.childId ? 'selected' : ''}>
                    ${c.first_name} ${c.last_name} (${c.child_code} - Age ${c.age_months ? `${Math.floor(c.age_months / 12)}y ${c.age_months % 12}m` : '3y'})
                  </option>
                `).join('')}
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Assessment Instrument <span class="text-rose-500">*</span></label>
              <select class="input w-full rounded-xl border border-slate-200 py-2 px-3 text-sm bg-white font-medium" onchange="window.currentAssessmentState.templateId = this.value; window.currentAssessmentState.responses = {}; window.renderCurrentView();">
                ${templates.map(t => `
                  <option value="${t.id}" ${t.id === selectedTemplate.id ? 'selected' : ''}>
                    ${t.title} (${t.total_questions} Items)
                  </option>
                `).join('')}
              </select>
            </div>
          </div>

          <div class="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-900 flex items-start gap-2.5">
            <i class="fas fa-info-circle text-blue-600 mt-0.5"></i>
            <div>
              <strong>${selectedTemplate.title}:</strong> ${selectedTemplate.description}
            </div>
          </div>
        </div>

        <!-- Teacher Observations Context Card (1 col) -->
        <div class="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-2xl border border-indigo-100 shadow-sm space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-bold uppercase tracking-wider text-indigo-950 flex items-center gap-1.5">
              <i class="fas fa-school text-indigo-600"></i> Teacher Observations
            </h3>
            <span class="text-[11px] font-bold bg-white text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
              ${teacherObservations.length} Logs
            </span>
          </div>

          ${teacherObservations.length === 0 ? `
            <p class="text-xs text-indigo-900/70 italic py-2">No teacher observations logged yet for this child.</p>
          ` : `
            <div class="space-y-2 max-h-48 overflow-y-auto pr-1">
              ${teacherObservations.slice(0, 2).map(obs => `
                <div class="p-2.5 bg-white rounded-xl border border-indigo-100 text-xs space-y-1">
                  <div class="flex justify-between font-medium text-[11px] text-indigo-950">
                    <span><i class="far fa-calendar-alt text-slate-600 mr-1"></i>${obs.observation_date}</span>
                    <span class="font-semibold text-indigo-600">${obs.activity_context}</span>
                  </div>
                  <p class="text-slate-600 text-[11px] italic line-clamp-2">"${obs.teacher_note || 'Observation recorded.'}"</p>
                  <button type="button" onclick="window.teacherModule.openObservationModal('${obs.id}')" class="text-indigo-600 hover:text-indigo-800 text-[11px] font-semibold block pt-1">
                    View 5-Domain Ratings →
                  </button>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </div>

      <!-- Questionnaire Interactive Area -->
      <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 class="text-lg font-bold text-slate-900">${selectedTemplate.title}</h2>
            <p class="text-xs text-slate-600 mt-0.5">Category: ${selectedTemplate.category} • Scoring: ${selectedTemplate.scoring_method === 'Rating_Scale_5' ? '5-Point Developmental Scale' : 'Standardized Risk Index'}</p>
          </div>
          <span class="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100 self-start sm:self-auto" id="answered-counter">
            ${Object.keys(window.currentAssessmentState.responses).length} of ${questions.length} Answered
          </span>
        </div>

        <!-- Questionnaire Items Form -->
        <form id="assessment-form" onsubmit="window.submitAssessment(event)" class="space-y-6">
          <div class="space-y-4">
            ${questions.map((q, idx) => {
              const currentVal = window.currentAssessmentState.responses[q.id];
              const is5Point = q.type === 'rating_5' || (q.options && q.options.length > 2);
              const options = q.options || ['Never', 'Sometimes', 'Often', 'Always', 'Not Observed'];

              return `
                <div class="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3" id="q-card-${q.id}">
                  <div class="flex items-center justify-between gap-2">
                    <span class="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                      Item ${idx + 1} • ${q.domain}
                    </span>
                    ${q.reverse_scored ? '<span class="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">Reverse Scored</span>' : ''}
                  </div>
                  
                  <p class="text-sm font-semibold text-slate-900">${q.text}</p>

                  ${is5Point ? `
                    <div class="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                      ${options.map(opt => `
                        <label class="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-blue-50/80 cursor-pointer transition-colors text-xs font-medium text-slate-700 ${currentVal === opt ? 'border-blue-500 bg-blue-50 text-blue-800 ring-2 ring-blue-500/20' : ''}">
                          <input type="radio" name="response_${q.id}" value="${opt}" ${currentVal === opt ? 'checked' : ''} onchange="window.selectAnswer('${q.id}', '${opt}')" required class="text-blue-600 focus:ring-blue-500">
                          <span>${opt}</span>
                        </label>
                      `).join('')}
                    </div>
                  ` : `
                    <div class="grid grid-cols-2 gap-3 pt-1 max-w-md">
                      <label class="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-white hover:bg-blue-50 cursor-pointer transition-colors text-xs font-bold text-slate-800 ${currentVal === 'yes' ? 'border-blue-500 bg-blue-50 text-blue-800 ring-2 ring-blue-500/20' : ''}">
                        <input type="radio" name="response_${q.id}" value="yes" ${currentVal === 'yes' ? 'checked' : ''} onchange="window.selectAnswer('${q.id}', 'yes')" required class="text-blue-600">
                        <span>Yes</span>
                      </label>
                      <label class="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-white hover:bg-blue-50 cursor-pointer transition-colors text-xs font-bold text-slate-800 ${currentVal === 'no' ? 'border-blue-500 bg-blue-50 text-blue-800 ring-2 ring-blue-500/20' : ''}">
                        <input type="radio" name="response_${q.id}" value="no" ${currentVal === 'no' ? 'checked' : ''} onchange="window.selectAnswer('${q.id}', 'no')" required class="text-blue-600">
                        <span>No</span>
                      </label>
                    </div>
                  `}
                </div>
              `;
            }).join('')}
          </div>

          <!-- Therapist Clinical Observations -->
          <div class="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Therapist Clinical Observations & Environmental Synthesis <span class="text-rose-500">*</span>
            </label>
            <textarea id="therapist-obs-notes" class="input w-full rounded-xl border border-slate-200 p-3 text-xs bg-white font-normal" rows="3" required placeholder="Synthesize direct clinical observation findings with supporting teacher classroom logs...">${window.currentAssessmentState.therapistNotes || ''}</textarea>
            <p class="text-[11px] text-slate-600">Note child sensory tolerance, attention span, vocal attempts, and consistency with educator report.</p>
          </div>

          <!-- Clinical Disclaimer -->
          <div class="p-3.5 bg-amber-50 border-l-4 border-amber-500 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
            <i class="fas fa-shield-alt text-amber-600 mt-0.5"></i>
            <div>
              <strong>Clinical Assessment Notice:</strong> Submitting this battery calculates developmental milestone metrics and risk indicators to structure targeted therapy plans.
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-wrap items-center justify-end gap-3 pt-2">
            <button type="button" class="btn btn-outline text-xs px-4 py-2 rounded-xl font-semibold" onclick="window.navigateTo('assessments')">Cancel</button>
            <button type="button" class="btn btn-secondary text-xs px-4 py-2 rounded-xl font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200" onclick="window.fillDemoAssessmentAnswers()">Auto-Fill Sample Responses</button>
            <button type="submit" class="btn btn-primary text-xs px-6 py-2.5 rounded-xl font-semibold shadow-md flex items-center gap-2">
              <i class="fas fa-calculator"></i> Calculate & Submit Assessment
            </button>
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
  const selectedTemplate = window.neuroDB.getAssessmentTemplates().find(t => t.id === window.currentAssessmentState.templateId);

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
  
  // Show quick prompt to create therapy plan if needed
  if (confirm(`Assessment saved (Result: ${riskLevel}). Would you like to create an Individualized Therapy Plan for ${child ? child.first_name : 'this child'} now?`)) {
    window.showCreateTherapyPlanModal(window.currentAssessmentState.childId);
  } else {
    window.openChildProfileTab(window.currentAssessmentState.childId, 'assessments');
  }
};

