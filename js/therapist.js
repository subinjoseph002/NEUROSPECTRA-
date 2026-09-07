/**
 * NEUROSPECTRA - Therapist Clinical Dashboard & Workflow Management
 * Integrates live children stats, teacher observations feed, 5-point assessments,
 * active therapy plans with goal progress tracking, and session logging.
 */

window.renderTherapistDashboard = function() {
  const user = window.neuroAuth.getCurrentUser();
  const allChildren = window.neuroDB.getChildren();
  const myChildren = allChildren.filter(c => !user || c.assigned_therapist_id === user.id || true);
  const assessments = window.neuroDB.getAssessmentRecords();
  const therapyPlans = window.neuroDB.getTherapyPlans();
  const activePlans = therapyPlans.filter(p => p.status === 'Active');
  const teacherObservations = window.neuroDB.getTeacherObservations();
  const appointments = window.neuroDB.getAppointments();

  return `
    <div class="space-y-6" style="color: #0f172a; font-family: 'Plus Jakarta Sans', sans-serif;">
      
      <!-- Top Header with Actions -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 p-6 md:p-8 rounded-2xl text-white shadow-xl">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold uppercase tracking-wider mb-3 backdrop-blur-sm border border-white/10">
            <i class="fas fa-user-md text-blue-400"></i> Clinical Therapist Portal
          </div>
          <h1 class="text-2xl md:text-3xl font-bold text-white tracking-tight">Dr. ${user?.full_name || 'Aisha Khan'}</h1>
          <p class="text-slate-300 text-sm md:text-base mt-1 max-w-xl">
            Pediatric Developmental Assessment, Individualized Therapy Plans, and Multidisciplinary Teacher Collaboration.
          </p>
        </div>
        <div class="flex flex-wrap gap-3">
          <button onclick="window.startNewAssessment()" class="btn bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all">
            <i class="fas fa-stethoscope"></i> Conduct Assessment
          </button>
          <button onclick="window.showCreateTherapyPlanModal()" class="btn bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 border border-white/20 transition-all">
            <i class="fas fa-plus"></i> New Therapy Plan
          </button>
          <button onclick="window.showLogTherapySessionModal()" class="btn bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-md transition-all">
            <i class="fas fa-pen-to-square"></i> Log Session
          </button>
        </div>
      </div>

      <!-- Top Row 4 Stat Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <!-- Stat 1 -->
        <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <span class="text-xs font-bold text-slate-600 uppercase tracking-wider">Assigned Children</span>
            <div class="text-2xl font-extrabold text-slate-900 mt-1">${myChildren.length}</div>
            <p class="text-xs text-emerald-600 font-medium mt-0.5"><i class="fas fa-circle-check"></i> ${myChildren.filter(c => c.status === 'Active').length} Active caseload</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">
            <i class="fas fa-children"></i>
          </div>
        </div>

        <!-- Stat 2 -->
        <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <span class="text-xs font-bold text-slate-600 uppercase tracking-wider">Completed Assessments</span>
            <div class="text-2xl font-extrabold text-slate-900 mt-1">${assessments.length}</div>
            <p class="text-xs text-blue-600 font-medium mt-0.5"><i class="fas fa-chart-pie"></i> 5 clinical batteries</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl font-bold">
            <i class="fas fa-clipboard-check"></i>
          </div>
        </div>

        <!-- Stat 3 -->
        <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <span class="text-xs font-bold text-slate-600 uppercase tracking-wider">Active Therapy Plans</span>
            <div class="text-2xl font-extrabold text-slate-900 mt-1">${activePlans.length}</div>
            <p class="text-xs text-emerald-600 font-medium mt-0.5"><i class="fas fa-bullseye"></i> Goal progress tracked</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-bold">
            <i class="fas fa-route"></i>
          </div>
        </div>

        <!-- Stat 4 -->
        <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <span class="text-xs font-bold text-slate-600 uppercase tracking-wider">Teacher Observations</span>
            <div class="text-2xl font-extrabold text-slate-900 mt-1">${teacherObservations.length}</div>
            <p class="text-xs text-purple-600 font-medium mt-0.5"><i class="fas fa-school"></i> Classroom context</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl font-bold">
            <i class="fas fa-chalkboard-teacher"></i>
          </div>
        </div>

      </div>

      <!-- Supporting Teacher Observations Review Banner -->
      <div class="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-6 shadow-sm">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm">
              <i class="fas fa-eye"></i>
            </div>
            <div>
              <h3 class="font-bold text-slate-900 text-base">Teacher & Educator Observations Feed</h3>
              <p class="text-xs text-slate-600">Review real-world classroom context before updating clinical assessments and therapy plans.</p>
            </div>
          </div>
          <button onclick="window.navigateTo('observations')" class="text-xs font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-1">
            View All Observations →
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          ${teacherObservations.slice(0, 3).map(obs => {
            const child = window.neuroDB.getChildById(obs.child_id);
            return `
              <div class="bg-white p-4 rounded-xl border border-indigo-100/70 shadow-sm flex flex-col justify-between space-y-3">
                <div>
                  <div class="flex items-start justify-between gap-2">
                    <span class="font-bold text-sm text-slate-900">${child ? `${child.first_name} ${child.last_name}` : 'Student'}</span>
                    <span class="text-[11px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">${obs.observation_date}</span>
                  </div>
                  <span class="inline-block text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded mt-1.5 border border-indigo-100">
                    ${obs.activity_context}
                  </span>
                  <p class="text-xs text-slate-600 italic mt-2 line-clamp-2">
                    "${obs.teacher_note || 'Structured classroom observation.'}"
                  </p>
                </div>
                <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button onclick="window.teacherModule.openObservationModal('${obs.id}')" class="text-indigo-600 hover:text-indigo-800 font-semibold">
                    View Ratings
                  </button>
                  <button onclick="window.startAssessmentForChild('${obs.child_id}')" class="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1">
                    Assess Child <i class="fas fa-arrow-right text-[10px]"></i>
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Middle Grid: Active Therapy Plans (Left 2fr) + Clinical Schedule (Right 1fr) -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Left: Active Therapy Plans & Goal Tracking -->
        <div class="lg:col-span-2 space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
              <i class="fas fa-route text-blue-600"></i> Active Individualized Therapy Plans
            </h2>
            <button onclick="window.showCreateTherapyPlanModal()" class="text-xs font-semibold text-blue-600 hover:text-blue-800">
              + New Plan
            </button>
          </div>

          <div class="space-y-4">
            ${activePlans.length === 0 ? `
              <div class="bg-white p-8 rounded-2xl border border-slate-100 text-center text-slate-600 text-sm">
                <i class="fas fa-clipboard-list text-3xl text-slate-300 mb-2 block"></i>
                No active therapy plans. Click <strong>+ New Plan</strong> to create one.
              </div>
            ` : activePlans.map(plan => {
              const child = window.neuroDB.getChildById(plan.child_id);
              const goals = plan.goals || [];
              const avgProgress = goals.length > 0 
                ? Math.round(goals.reduce((acc, g) => acc + (g.progress_pct || 0), 0) / goals.length) 
                : 0;

              return `
                <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <div class="flex items-center gap-2">
                        <h3 class="font-bold text-base text-slate-900">${child ? `${child.first_name} ${child.last_name}` : 'Child'}</h3>
                        <span class="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded">${child ? child.child_code : ''}</span>
                        <span class="px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700">Active</span>
                      </div>
                      <p class="text-xs font-medium text-slate-600 mt-1">${plan.title}</p>
                    </div>
                    <div class="text-right">
                      <span class="text-xs text-slate-600">Overall Progress:</span>
                      <span class="text-sm font-extrabold text-blue-600 ml-1">${avgProgress}%</span>
                    </div>
                  </div>

                  <!-- Goal Bars -->
                  <div class="space-y-3">
                    ${goals.map(goal => `
                      <div class="space-y-1 text-xs">
                        <div class="flex justify-between font-medium">
                          <span class="text-slate-800 font-semibold">${goal.title}</span>
                          <span class="text-blue-600 font-bold">${goal.progress_pct || 0}% (${goal.status || 'In Progress'})</span>
                        </div>
                        <p class="text-slate-600 text-[11px]">${goal.target}</p>
                        <div class="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex items-center">
                          <div class="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all" style="width: ${goal.progress_pct || 0}%;"></div>
                        </div>
                      </div>
                    `).join('')}
                  </div>

                  <!-- Plan Actions Bar -->
                  <div class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                    <span class="text-slate-600">
                      <i class="far fa-calendar-alt mr-1"></i> ${plan.frequency || '2 Sessions/Week'} • Target: ${plan.target_date || 'May 2026'}
                    </span>
                    <div class="flex items-center gap-2">
                      <button onclick="window.showLogTherapySessionModal('${plan.id}')" class="btn btn-primary text-xs py-1.5 px-3 rounded-lg font-semibold">
                        <i class="fas fa-pen-to-square mr-1"></i> Log Session
                      </button>
                      <button onclick="window.showEditGoalModal('${plan.id}')" class="btn btn-outline text-xs py-1.5 px-3 rounded-lg font-semibold text-blue-600 border-blue-200">
                        <i class="fas fa-sliders mr-1"></i> Update Goals
                      </button>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Right: Today's Clinical Schedule & Tools -->
        <div class="space-y-5">
          <!-- Schedule Card -->
          <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="font-bold text-base text-slate-900">Today's Schedule</h3>
              <button onclick="window.navigateTo('appointments')" class="text-xs font-semibold text-blue-600 hover:text-blue-800">Full Calendar</button>
            </div>

            <div class="space-y-3">
              ${appointments.slice(0, 4).map(apt => {
                const child = window.neuroDB.getChildById(apt.child_id);
                return `
                  <div class="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <span class="bg-blue-100 text-blue-700 font-bold text-xs px-2.5 py-1 rounded-lg font-mono">
                        ${apt.start_time}
                      </span>
                      <div>
                        <div class="font-bold text-xs text-slate-900">${child ? `${child.first_name} ${child.last_name}` : 'Child'}</div>
                        <div class="text-[11px] text-slate-600">${apt.type || 'Therapy Session'}</div>
                      </div>
                    </div>
                    <span class="text-[11px] text-slate-600 font-medium">45m</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Quick Actions Panel -->
          <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <h3 class="font-bold text-sm text-slate-900">Therapist Quick Actions</h3>
            <div class="space-y-2">
              <button onclick="window.startNewAssessment()" class="w-full btn btn-primary text-xs py-2.5 rounded-xl font-semibold flex items-center justify-start gap-2.5">
                <i class="fas fa-stethoscope"></i> Conduct Clinical Assessment
              </button>
              <button onclick="window.showCreateTherapyPlanModal()" class="w-full btn btn-outline text-xs py-2.5 rounded-xl font-semibold flex items-center justify-start gap-2.5 text-indigo-700 border-indigo-200 hover:bg-indigo-50">
                <i class="fas fa-clipboard-list"></i> Create Therapy Plan
              </button>
              <button onclick="window.showLogTherapySessionModal()" class="w-full btn btn-outline text-xs py-2.5 rounded-xl font-semibold flex items-center justify-start gap-2.5 text-emerald-700 border-emerald-200 hover:bg-emerald-50">
                <i class="fas fa-notes-medical"></i> Log Session & Update Goals
              </button>
            </div>
          </div>

          <!-- Multidisciplinary Consultation Card -->
          <div class="bg-slate-900 p-5 rounded-2xl text-white shadow-md space-y-3">
            <div class="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <i class="fas fa-shield-alt"></i> Multidisciplinary Consultation
            </div>
            <p class="text-xs text-slate-300 leading-relaxed">
              Connect with pediatricians, child psychologists, and classroom teachers inside secure messaging.
            </p>
            <button onclick="window.navigateTo('messages')" class="w-full btn bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-2 rounded-xl shadow">
              Open Collaboration Chat
            </button>
          </div>
        </div>

      </div>

    </div>
  `;
};

// Global Modals & Helper Functions for Therapist Module

window.startNewAssessment = function() {
  window.location.hash = '#assessment-conduct';
};

window.startAssessmentForChild = function(childId) {
  window.location.hash = `#assessment-conduct?childId=${childId}`;
};

window.showCreateTherapyPlanModal = function(preselectedChildId = null) {
  const children = window.neuroDB.getChildren();
  const today = new Date().toISOString().split('T')[0];
  const targetDefault = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const modalHtml = `
    <div id="createTherapyPlanModal" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div class="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 my-8 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center gap-2">
            <div class="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <i class="fas fa-route"></i>
            </div>
            <div>
              <h3 class="text-lg font-bold text-slate-900">Create Individualized Therapy Plan</h3>
              <p class="text-xs text-slate-600">Establish SMART developmental goals, session frequency, and target milestones.</p>
            </div>
          </div>
          <button onclick="document.getElementById('createTherapyPlanModal').remove()" class="text-slate-600 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-100">
            <i class="fas fa-times text-lg"></i>
          </button>
        </div>

        <form id="newTherapyPlanForm" onsubmit="window.handleCreateTherapyPlan(event)" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Child <span class="text-rose-500">*</span></label>
              <select name="child_id" required class="input w-full rounded-xl border border-slate-200 py-2 px-3 text-sm bg-white">
                <option value="">Select Child...</option>
                ${children.map(c => `<option value="${c.id}" ${preselectedChildId === c.id ? 'selected' : ''}>${c.first_name} ${c.last_name} (${c.child_code})</option>`).join('')}
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Plan Title <span class="text-rose-500">*</span></label>
              <input type="text" name="title" required placeholder="e.g., Speech & Sensory Integration Plan" class="input w-full rounded-xl border border-slate-200 py-2 px-3 text-sm bg-white">
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Frequency</label>
              <select name="frequency" class="input w-full rounded-xl border border-slate-200 py-2 px-3 text-sm bg-white">
                <option value="1 Session / Week">1 Session / Week</option>
                <option value="2 Sessions / Week" selected>2 Sessions / Week</option>
                <option value="3 Sessions / Week">3 Sessions / Week</option>
                <option value="Bi-Weekly">Bi-Weekly</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Session Duration</label>
              <select name="duration_mins" class="input w-full rounded-xl border border-slate-200 py-2 px-3 text-sm bg-white">
                <option value="30">30 Minutes</option>
                <option value="45" selected>45 Minutes</option>
                <option value="60">60 Minutes</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Start Date</label>
              <input type="date" name="start_date" value="${today}" class="input w-full rounded-xl border border-slate-200 py-2 px-3 text-sm bg-white">
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Target Evaluation Date</label>
              <input type="date" name="target_date" value="${targetDefault}" class="input w-full rounded-xl border border-slate-200 py-2 px-3 text-sm bg-white">
            </div>
          </div>

          <!-- Goals Section -->
          <div class="space-y-3 pt-2 border-t border-slate-100">
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">SMART Developmental Goals</label>
            <div id="planGoalsContainer" class="space-y-3">
              <div class="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2 goal-item">
                <input type="text" name="goal_title_1" required placeholder="Goal 1 Title (e.g., Joint Attention & Eye Gaze)" class="input w-full rounded-lg border border-slate-200 py-1.5 px-3 text-xs bg-white font-medium">
                <textarea name="goal_target_1" rows="2" required placeholder="Measurable Target (e.g., Maintain 3+ seconds eye contact during play across 8/10 trials)" class="input w-full rounded-lg border border-slate-200 p-2 text-xs bg-white"></textarea>
              </div>

              <div class="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2 goal-item">
                <input type="text" name="goal_title_2" placeholder="Goal 2 Title (e.g., Functional Verbal Requesting)" class="input w-full rounded-lg border border-slate-200 py-1.5 px-3 text-xs bg-white font-medium">
                <textarea name="goal_target_2" rows="2" placeholder="Measurable Target (e.g., Use 2-word phrase or picture card independently for requests)" class="input w-full rounded-lg border border-slate-200 p-2 text-xs bg-white"></textarea>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Therapist Clinical Notes</label>
            <textarea name="notes" rows="2" placeholder="Recommended home activities, sensory precautions..." class="input w-full rounded-xl border border-slate-200 p-2.5 text-xs bg-white"></textarea>
          </div>

          <div class="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button type="button" onclick="document.getElementById('createTherapyPlanModal').remove()" class="btn btn-outline text-xs px-4 py-2 rounded-xl font-semibold">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary text-xs px-6 py-2 rounded-xl font-semibold shadow-md">
              Create Therapy Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  const existing = document.getElementById('createTherapyPlanModal');
  if (existing) existing.remove();
  document.body.insertAdjacentHTML('beforeend', modalHtml);
};

window.handleCreateTherapyPlan = function(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const user = window.neuroAuth.getCurrentUser();

  const childId = formData.get('child_id');
  const title = formData.get('title');
  const frequency = formData.get('frequency');
  const durationMins = formData.get('duration_mins');
  const startDate = formData.get('start_date');
  const targetDate = formData.get('target_date');
  const notes = formData.get('notes');

  const goals = [];
  const g1Title = formData.get('goal_title_1');
  const g1Target = formData.get('goal_target_1');
  if (g1Title && g1Target) {
    goals.push({ id: 'g_' + Date.now() + '_1', title: g1Title, target: g1Target, status: 'In Progress', progress_pct: 10 });
  }

  const g2Title = formData.get('goal_title_2');
  const g2Target = formData.get('goal_target_2');
  if (g2Title && g2Target) {
    goals.push({ id: 'g_' + Date.now() + '_2', title: g2Title, target: g2Target, status: 'In Progress', progress_pct: 0 });
  }

  const newPlan = window.neuroDB.createTherapyPlan({
    child_id: childId,
    therapist_id: user?.id || 'usr_therapist_1',
    title: title,
    frequency: frequency,
    duration_mins: durationMins,
    start_date: startDate,
    target_date: targetDate,
    goals: goals,
    notes: notes,
    status: 'Active'
  });

  alert('Therapy Plan created successfully.');
  document.getElementById('createTherapyPlanModal')?.remove();
  if (window.renderApp) window.renderApp();
};

window.showLogTherapySessionModal = function(preselectedPlanId = null) {
  const plans = window.neuroDB.getTherapyPlans().filter(p => p.status === 'Active');
  const today = new Date().toISOString().split('T')[0];

  const modalHtml = `
    <div id="logSessionModal" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div class="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 my-8 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center gap-2">
            <div class="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <i class="fas fa-notes-medical"></i>
            </div>
            <div>
              <h3 class="text-lg font-bold text-slate-900">Log Clinical Therapy Session</h3>
              <p class="text-xs text-slate-600">Document session activities, clinical observations, and advance goal progress.</p>
            </div>
          </div>
          <button onclick="document.getElementById('logSessionModal').remove()" class="text-slate-600 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-100">
            <i class="fas fa-times text-lg"></i>
          </button>
        </div>

        <form id="logSessionForm" onsubmit="window.handleLogTherapySession(event)" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="md:col-span-2">
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Active Therapy Plan <span class="text-rose-500">*</span></label>
              <select name="therapy_plan_id" required onchange="window.handlePlanSelectForSession(this.value)" class="input w-full rounded-xl border border-slate-200 py-2 px-3 text-sm bg-white font-medium">
                <option value="">Select Plan...</option>
                ${plans.map(p => {
                  const child = window.neuroDB.getChildById(p.child_id);
                  return `<option value="${p.id}" ${preselectedPlanId === p.id ? 'selected' : ''}>${child ? `${child.first_name} ${child.last_name}` : 'Child'} - ${p.title}</option>`;
                }).join('')}
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Session Date <span class="text-rose-500">*</span></label>
              <input type="date" name="session_date" required value="${today}" class="input w-full rounded-xl border border-slate-200 py-2 px-3 text-sm bg-white">
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Session Duration</label>
              <select name="duration_mins" class="input w-full rounded-xl border border-slate-200 py-2 px-3 text-sm bg-white">
                <option value="30">30 Minutes</option>
                <option value="45" selected>45 Minutes</option>
                <option value="60">60 Minutes</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Session Modality</label>
              <input type="text" name="session_type" placeholder="e.g., Speech & Sensory Play" required value="Speech & Sensory Play" class="input w-full rounded-xl border border-slate-200 py-2 px-3 text-sm bg-white">
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Overall Session Rating (1-5)</label>
              <select name="progress_rating" class="input w-full rounded-xl border border-slate-200 py-2 px-3 text-sm bg-white font-bold">
                <option value="5">5 - Excellent Engagement</option>
                <option value="4" selected>4 - Very Good Progress</option>
                <option value="3">3 - Moderate / Baseline</option>
                <option value="2">2 - Needed High Prompting</option>
                <option value="1">1 - Severe Resistance</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Activities Conducted <span class="text-rose-500">*</span></label>
            <textarea name="activities_done" rows="2" required placeholder="e.g., Bubble popping waiting game, visual schedule matching..." class="input w-full rounded-xl border border-slate-200 p-2.5 text-xs bg-white"></textarea>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Clinical Observations & Response</label>
            <textarea name="observations" rows="2" required placeholder="e.g., Initiated 4 spontaneous eye contacts, transitioned smoothly between sensory tasks..." class="input w-full rounded-xl border border-slate-200 p-2.5 text-xs bg-white"></textarea>
          </div>

          <!-- Goal Progress Increments -->
          <div id="sessionGoalsContainer" class="space-y-3 pt-2 border-t border-slate-100">
            <!-- Populated on plan selection -->
          </div>

          <div class="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button type="button" onclick="document.getElementById('logSessionModal').remove()" class="btn btn-outline text-xs px-4 py-2 rounded-xl font-semibold">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary text-xs px-6 py-2 rounded-xl font-semibold shadow-md">
              Save Session Log
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  const existing = document.getElementById('logSessionModal');
  if (existing) existing.remove();
  document.body.insertAdjacentHTML('beforeend', modalHtml);

  if (preselectedPlanId) {
    window.handlePlanSelectForSession(preselectedPlanId);
  }
};

window.handlePlanSelectForSession = function(planId) {
  const container = document.getElementById('sessionGoalsContainer');
  if (!container) return;

  const plan = window.neuroDB.getTherapyPlans().find(p => p.id === planId);
  if (!plan || !plan.goals || plan.goals.length === 0) {
    container.innerHTML = `<p class="text-xs text-slate-600">No specific SMART goals linked to this plan.</p>`;
    return;
  }

  container.innerHTML = `
    <h4 class="text-xs font-bold uppercase tracking-wider text-slate-700">Update Goal Progress in this Session</h4>
    <div class="space-y-2">
      ${plan.goals.map(g => `
        <div class="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span class="font-bold text-slate-800">${g.title}</span>
            <p class="text-[11px] text-slate-600">${g.target}</p>
          </div>
          <div class="flex items-center gap-2">
            <label class="text-slate-600">Progress (%):</label>
            <input type="number" min="0" max="100" step="5" name="goal_prog_${g.id}" value="${g.progress_pct || 0}" class="input w-20 text-center font-bold text-blue-600 border border-slate-300 rounded-lg py-1 px-2 text-xs bg-white">
          </div>
        </div>
      `).join('')}
    </div>
  `;
};

window.handleLogTherapySession = function(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const user = window.neuroAuth.getCurrentUser();

  const planId = formData.get('therapy_plan_id');
  const plan = window.neuroDB.getTherapyPlans().find(p => p.id === planId);
  const sessionDate = formData.get('session_date');
  const durationMins = formData.get('duration_mins');
  const sessionType = formData.get('session_type');
  const progressRating = formData.get('progress_rating');
  const activitiesDone = formData.get('activities_done');
  const observations = formData.get('observations');

  const newSession = window.neuroDB.createTherapySession({
    therapy_plan_id: planId,
    child_id: plan ? plan.child_id : '',
    therapist_id: user?.id || 'usr_therapist_1',
    session_date: sessionDate,
    duration_mins: durationMins,
    session_type: sessionType,
    progress_rating: progressRating,
    activities_done: activitiesDone,
    observations: observations
  });

  // Update goals if provided
  if (plan && plan.goals) {
    plan.goals.forEach(g => {
      const val = formData.get(`goal_prog_${g.id}`);
      if (val !== null && val !== undefined) {
        window.neuroDB.updateGoalProgress(planId, g.id, val);
      }
    });
  }

  alert('Session logged and goal progress updated.');
  document.getElementById('logSessionModal')?.remove();
  if (window.renderApp) window.renderApp();
};

window.showEditGoalModal = function(planId) {
  const plan = window.neuroDB.getTherapyPlans().find(p => p.id === planId);
  if (!plan) return;

  const child = window.neuroDB.getChildById(plan.child_id);

  const modalHtml = `
    <div id="editGoalModal" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 class="font-bold text-base text-slate-900">Update Goal Progress</h3>
            <p class="text-xs text-slate-600">${child ? `${child.first_name} ${child.last_name}` : 'Child'} • ${plan.title}</p>
          </div>
          <button onclick="document.getElementById('editGoalModal').remove()" class="text-slate-600 hover:text-slate-700 p-2 rounded-lg">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <form onsubmit="window.handleSaveGoalProgress(event, '${plan.id}')" class="space-y-4">
          ${(plan.goals || []).map(g => `
            <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
              <span class="font-bold text-slate-800 block">${g.title}</span>
              <p class="text-[11px] text-slate-600">${g.target}</p>
              <div class="flex items-center justify-between pt-1">
                <span class="text-slate-600">Progress:</span>
                <div class="flex items-center gap-2">
                  <input type="range" min="0" max="100" step="5" value="${g.progress_pct || 0}" oninput="document.getElementById('pct_label_${g.id}').textContent = this.value + '%'; document.getElementById('pct_input_${g.id}').value = this.value" class="w-32">
                  <input type="number" id="pct_input_${g.id}" name="goal_${g.id}" value="${g.progress_pct || 0}" min="0" max="100" class="input w-16 text-center font-bold text-blue-600 border border-slate-300 rounded-lg py-1 text-xs bg-white">
                  <span id="pct_label_${g.id}" class="font-mono font-bold text-blue-600 w-10 text-right">${g.progress_pct || 0}%</span>
                </div>
              </div>
            </div>
          `).join('')}

          <div class="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button type="button" onclick="document.getElementById('editGoalModal').remove()" class="btn btn-outline text-xs px-4 py-2 rounded-xl">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary text-xs px-6 py-2 rounded-xl font-semibold shadow-md">
              Save Progress
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  const existing = document.getElementById('editGoalModal');
  if (existing) existing.remove();
  document.body.insertAdjacentHTML('beforeend', modalHtml);
};

window.handleSaveGoalProgress = function(event, planId) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const plan = window.neuroDB.getTherapyPlans().find(p => p.id === planId);

  if (plan && plan.goals) {
    plan.goals.forEach(g => {
      const val = formData.get(`goal_${g.id}`);
      if (val !== null && val !== undefined) {
        window.neuroDB.updateGoalProgress(planId, g.id, val);
      }
    });
  }

  alert('Goal progress updated successfully.');
  document.getElementById('editGoalModal')?.remove();
  if (window.renderApp) window.renderApp();
};

