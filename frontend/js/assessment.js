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
  const role = window.neuroAuth.getRole();
  if (role !== 'Therapist') {
    return `
      <div class="card" style="padding: 40px; text-align: center; border-radius: 16px; margin: 20px auto; max-width: 600px;">
        <div style="width: 60px; height: 60px; border-radius: 16px; background: #fef2f2; color: #ef4444; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 8px;">Access Restricted</h2>
        <p style="font-size: 14px; color: #64748b; line-height: 1.5; margin-bottom: 24px;">
          Diagnostic and standardized M-CHAT-R/F screening assessments can only be conducted by certified Clinical Therapists.
        </p>
        <button class="btn btn-primary" onclick="window.navigateTo('dashboard')">Return to Dashboard</button>
      </div>
    `;
  }

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
            Child Development Assessment
          </h1>
          <p style="font-size: 13.5px; color: #64748b; margin: 0;">
            Guided developmental checks connected with classroom updates.
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
            Assessment Details
          </h3>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 12px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 6px; text-transform: uppercase;">Select Child *</label>
              <select class="form-select" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; font-size: 13.5px;" onchange="window.currentAssessmentState.childId = this.value; window.renderCurrentView();">
                ${children.map(c => `
                  <option value="${c.id}" ${c.id === window.currentAssessmentState.childId ? 'selected' : ''}>
                    ${c.first_name} ${c.last_name} (${c.child_code} - Age ${c.age_months ? `${Math.floor(c.age_months / 12)}y ${c.age_months % 12}m` : '3y'})
                  </option>
                `).join('')}
              </select>
            </div>

            <div>
              <label style="display: block; font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 6px; text-transform: uppercase;">Assessment Type *</label>
              <select class="form-select" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; font-size: 13.5px;" onchange="window.currentAssessmentState.templateId = this.value; window.currentAssessmentState.responses = {}; window.renderCurrentView();">
                ${templates.map(t => `
                  <option value="${t.id}" ${t.id === selectedTemplate.id ? 'selected' : ''}>
                    ${t.title} (${t.total_questions} Questions)
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
              Teacher Classroom Notes
            </h3>
            <span class="badge badge-purple" style="font-size: 11px;">${teacherObservations.length} Notes</span>
          </div>

          ${teacherObservations.length === 0 ? `
            <p style="font-size: 12.5px; color: #6b7280; font-style: italic; margin: 0;">No teacher classroom notes have been added for this child yet.</p>
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
                    View Details &rarr;
                  </button>
                </div>
              `).join('')}
            </div>
          `}
        </div>

      </div>

      <!-- Questionnaire Interactive Form Card -->
      <div class="card" style="padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; border-bottom: 1px solid #f1f5f9; padding-bottom: 14px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h2 style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 0 0 2px;">${selectedTemplate.title}</h2>
            <div style="font-size: 12.5px; color: #64748b;">
              Category: <strong>${selectedTemplate.category}</strong> • Scoring: <strong>${selectedTemplate.scoring_method === 'Rating_Scale_5' ? '1 to 5 Rating Scale' : 'Standard Screening Score'}</strong>
            </div>
          </div>
          <span class="badge ${Object.keys(window.currentAssessmentState.responses).length === questions.length ? 'badge-success' : 'badge-info'}" id="answered-counter" style="font-size: 12px; padding: 6px 12px; font-weight: 700;">
            ${Object.keys(window.currentAssessmentState.responses).length} of ${questions.length} Answered (${Math.round((Object.keys(window.currentAssessmentState.responses).length / questions.length) * 100)}%)
          </span>
        </div>

        <!-- Live Assessment Progress Bar -->
        <div style="width: 100%; height: 7px; background: #e2e8f0; border-radius: 9999px; margin-bottom: 22px; overflow: hidden;">
          <div id="assessment-progress-bar" style="height: 100%; width: ${Math.round((Object.keys(window.currentAssessmentState.responses).length / questions.length) * 100)}%; background: ${Object.keys(window.currentAssessmentState.responses).length === questions.length ? '#16a34a' : '#2563eb'}; transition: width 0.3s ease, background 0.3s ease;"></div>
        </div>

        <form id="assessment-form" novalidate onsubmit="window.submitAssessment(event)">
          <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px;">
            ${questions.map((q, idx) => {
              const currentVal = window.currentAssessmentState.responses[q.id];
              const is5Point = q.type === 'rating_5' || (q.options && q.options.length > 2);
              const options = q.options || ['Never', 'Sometimes', 'Often', 'Always', 'Not Observed'];
              const isAnswered = currentVal !== undefined && currentVal !== null && currentVal !== '';

              return `
                <div id="q-card-${q.id}" class="question-card" style="background: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid ${isAnswered ? '#16a34a' : '#cbd5e1'}; border-radius: 12px; padding: 16px; transition: all 0.2s;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <span style="font-size: 11.5px; font-weight: 700; color: #4338ca; background: #e0e7ff; padding: 2px 8px; border-radius: 6px; text-transform: uppercase;">
                      Question ${idx + 1} • ${q.domain}
                    </span>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      ${q.reverse_scored ? '<span class="badge badge-warning" style="font-size: 10.5px;">Reverse Scored</span>' : ''}
                      <span id="q-status-badge-${q.id}" style="font-size: 11px; font-weight: 700; color: ${isAnswered ? '#16a34a' : '#94a3b8'};">
                        ${isAnswered ? '✓ Answered' : '○ Not answered'}
                      </span>
                    </div>
                  </div>

                  <p style="font-size: 14px; font-weight: 600; color: #0f172a; margin-bottom: 12px; line-height: 1.45;">${q.text}</p>

                  ${is5Point ? `
                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                      ${options.map(opt => `
                        <label id="opt-label-${q.id}-${opt.replace(/\s+/g, '_')}" style="display: inline-flex; align-items: center; gap: 6px; background: ${currentVal === opt ? '#eff6ff' : '#ffffff'}; border: 1.5px solid ${currentVal === opt ? '#2563eb' : '#cbd5e1'}; border-radius: 8px; padding: 7px 14px; font-size: 13px; font-weight: 600; cursor: pointer; color: ${currentVal === opt ? '#1d4ed8' : '#334155'}; transition: all 0.15s;">
                          <input type="radio" name="response_${q.id}" value="${opt}" ${currentVal === opt ? 'checked' : ''} onchange="window.selectAnswer('${q.id}', '${opt}')" style="cursor: pointer;">
                          ${opt}
                        </label>
                      `).join('')}
                    </div>
                  ` : `
                    <div style="display: flex; gap: 12px;">
                      <label id="opt-label-${q.id}-yes" style="display: inline-flex; align-items: center; gap: 6px; background: ${currentVal === 'yes' ? '#eff6ff' : '#ffffff'}; border: 1.5px solid ${currentVal === 'yes' ? '#2563eb' : '#cbd5e1'}; border-radius: 8px; padding: 7px 20px; font-size: 13.5px; font-weight: 600; cursor: pointer; color: ${currentVal === 'yes' ? '#1d4ed8' : '#334155'}; transition: all 0.15s;">
                        <input type="radio" name="response_${q.id}" value="yes" ${currentVal === 'yes' ? 'checked' : ''} onchange="window.selectAnswer('${q.id}', 'yes')" style="cursor: pointer;">
                        Yes
                      </label>
                      <label id="opt-label-${q.id}-no" style="display: inline-flex; align-items: center; gap: 6px; background: ${currentVal === 'no' ? '#eff6ff' : '#ffffff'}; border: 1.5px solid ${currentVal === 'no' ? '#2563eb' : '#cbd5e1'}; border-radius: 8px; padding: 7px 20px; font-size: 13.5px; font-weight: 600; cursor: pointer; color: ${currentVal === 'no' ? '#1d4ed8' : '#334155'}; transition: all 0.15s;">
                        <input type="radio" name="response_${q.id}" value="no" ${currentVal === 'no' ? 'checked' : ''} onchange="window.selectAnswer('${q.id}', 'no')" style="cursor: pointer;">
                        No
                      </label>
                    </div>
                  `}

                  <!-- Validation Error Container for this question -->
                  <div id="q-error-${q.id}" style="display: none; color: #dc2626; font-size: 12px; font-weight: 700; margin-top: 10px; padding: 6px 10px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px;">
                    ⚠️ Please select an answer for Question ${idx + 1}.
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Therapist Clinical Observations Synthesis -->
          <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 12px; padding: 18px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <label style="display: block; font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase;">
                Therapist Clinical Notes & Observations <span style="color: #ef4444;">*</span>
              </label>
              <span id="notes-char-counter" style="font-size: 11.5px; font-weight: 600; color: #64748b;">
                ${(window.currentAssessmentState.therapistNotes || '').trim().length} / 10 min chars
              </span>
            </div>
            <textarea id="therapist-obs-notes" class="form-control" rows="3" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; font-size: 13.5px; transition: border 0.2s;" placeholder="Write clinical notes on how the child engaged, eye contact, sensory responses, and recommendations..." oninput="window.validateTherapistNotes(this)">${window.currentAssessmentState.therapistNotes || ''}</textarea>
            
            <div id="therapist-notes-error" style="display: none; color: #dc2626; font-size: 12px; font-weight: 700; margin-top: 6px;">
              ⚠️ Clinical observation notes are required (minimum 10 characters).
            </div>
            <p style="font-size: 12px; color: #64748b; margin: 6px 0 0;">Note attention, comfort levels, communication, and how well this matches teacher observations.</p>
          </div>

          <!-- Action Buttons -->
          <div style="display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid #e2e8f0; padding-top: 18px; flex-wrap: wrap;">
            <button type="button" class="btn btn-outline" onclick="window.navigateTo('assessments')">Cancel</button>
            <button type="button" class="btn btn-secondary" onclick="window.fillDemoAssessmentAnswers()">Fill Demo Answers</button>
            <button type="submit" class="btn btn-primary" style="font-weight: 600; padding: 10px 24px;">Save Assessment</button>
          </div>
        </form>
      </div>

    </div>
  `;
};

window.validateTherapistNotes = function(el) {
  if (!el) return;
  const val = el.value.trim();
  window.currentAssessmentState.therapistNotes = el.value;
  
  const counter = document.getElementById('notes-char-counter');
  if (counter) {
    counter.innerText = `${val.length} / 10 min chars`;
    counter.style.color = val.length >= 10 ? '#16a34a' : '#64748b';
  }

  const err = document.getElementById('therapist-notes-error');
  if (val.length >= 10) {
    el.style.border = '1px solid #cbd5e1';
    el.style.background = '#ffffff';
    if (err) err.style.display = 'none';
  }
};

window.selectAnswer = function(questionId, value) {
  window.currentAssessmentState.responses[questionId] = value;
  
  // Clear error highlight on this question card
  const card = document.getElementById(`q-card-${questionId}`);
  if (card) {
    card.style.border = '1px solid #e2e8f0';
    card.style.borderLeft = '4px solid #16a34a';
    card.style.background = '#f8fafc';
  }
  const err = document.getElementById(`q-error-${questionId}`);
  if (err) err.style.display = 'none';

  const badge = document.getElementById(`q-status-badge-${questionId}`);
  if (badge) {
    badge.innerText = '✓ Answered';
    badge.style.color = '#16a34a';
  }

  // Update counter & progress bar
  const questions = window.neuroDB.getQuestionsByTemplateId(window.currentAssessmentState.templateId);
  const totalCount = questions.length;
  const answeredCount = Object.keys(window.currentAssessmentState.responses).length;
  const pct = Math.round((answeredCount / totalCount) * 100);

  const counter = document.getElementById('answered-counter');
  if (counter) {
    counter.innerText = `${answeredCount} of ${totalCount} Answered (${pct}%)`;
    counter.className = answeredCount === totalCount ? 'badge badge-success' : 'badge badge-info';
  }

  const bar = document.getElementById('assessment-progress-bar');
  if (bar) {
    bar.style.width = `${pct}%`;
    bar.style.background = answeredCount === totalCount ? '#16a34a' : '#2563eb';
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
  
  // 1. Validate Child Selection
  const childId = window.currentAssessmentState.childId;
  if (!childId) {
    window.showToast('Validation Error: Please select a child for this assessment.', 'error');
    return;
  }

  const questions = window.neuroDB.getQuestionsByTemplateId(window.currentAssessmentState.templateId);

  // 2. Validate Every Question Answered
  const unanswered = questions.filter(q => !window.currentAssessmentState.responses[q.id]);
  
  // Update visual state for all questions
  questions.forEach(q => {
    const card = document.getElementById(`q-card-${q.id}`);
    const err = document.getElementById(`q-error-${q.id}`);
    const isUnanswered = unanswered.includes(q);
    
    if (isUnanswered) {
      if (card) {
        card.style.border = '2px solid #ef4444';
        card.style.borderLeft = '4px solid #ef4444';
        card.style.background = '#fef2f2';
      }
      if (err) err.style.display = 'block';
    } else {
      if (card) {
        card.style.border = '1px solid #e2e8f0';
        card.style.borderLeft = '4px solid #16a34a';
        card.style.background = '#f8fafc';
      }
      if (err) err.style.display = 'none';
    }
  });

  if (unanswered.length > 0) {
    window.showToast(`Validation Failed: Please answer all ${questions.length} questions before saving (${unanswered.length} unanswered).`, 'error');
    const firstUnanswered = document.getElementById(`q-card-${unanswered[0].id}`);
    if (firstUnanswered) {
      firstUnanswered.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }

  // 3. Validate Therapist Observation Notes
  const notesInput = document.getElementById('therapist-obs-notes');
  const obsNotes = notesInput ? notesInput.value.trim() : '';
  const notesError = document.getElementById('therapist-notes-error');

  if (obsNotes.length < 10) {
    if (notesInput) {
      notesInput.style.border = '2px solid #ef4444';
      notesInput.style.background = '#fef2f2';
      notesInput.focus();
    }
    if (notesError) {
      notesError.style.display = 'block';
      notesError.innerText = obsNotes.length === 0 
        ? '⚠️ Clinical observation notes are required. Please describe your observations.' 
        : `⚠️ Clinical notes are too brief (${obsNotes.length}/10 chars minimum). Please provide more detail.`;
    }
    window.showToast('Validation Error: Please enter clinical observation notes (minimum 10 characters).', 'warning');
    return;
  } else {
    if (notesInput) {
      notesInput.style.border = '1px solid #cbd5e1';
      notesInput.style.background = '#ffffff';
    }
    if (notesError) notesError.style.display = 'none';
  }

  // 4. Validate Role Authorization
  const currentUser = window.neuroAuth.getCurrentUser();
  const role = window.neuroAuth.getRole();
  if (role !== 'Therapist') {
    window.showToast('Unauthorized: Only certified Clinical Therapists are permitted to conduct and save screening assessments.', 'error');
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
      title: 'New Assessment Completed',
      message: `Assessment results for ${child.first_name} are ready to view.`,
      type: 'assessment',
      link: '#reports'
    });
  }

  window.showToast('Assessment completed and recorded successfully!', 'success');
  
  if (confirm(`Assessment saved (${riskLevel}). Would you like to create a Therapy Plan for ${child ? child.first_name : 'this child'} now?`)) {
    window.showCreateTherapyPlanModal(window.currentAssessmentState.childId);
  } else {
    window.openChildProfileTab(window.currentAssessmentState.childId, 'assessments');
  }
};
