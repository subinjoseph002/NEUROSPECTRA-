/**
 * NEUROSPECTRA - Teacher & Educator Module
 * Provides classroom observation logging across 5 developmental domains,
 * student tracking, non-clinical child profiles, and observation history.
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
    // Filter children assigned to this teacher or return all if teacher has all
    const assigned = allChildren.filter(c => c.assigned_teacher_id === user.id);
    return assigned.length > 0 ? assigned : allChildren;
  }

  renderDashboard() {
    const teacher = this.getCurrentTeacher();
    const children = this.getAssignedChildren();
    const observations = window.neuroDB.getTeacherObservations({ teacher_id: teacher?.id });
    
    // Calculate stats
    const totalChildren = children.length;
    const totalObservations = observations.length;
    const thisMonth = new Date().toISOString().slice(0, 7);
    const observationsThisMonth = observations.filter(o => (o.observation_date || o.created_at || '').startsWith(thisMonth)).length;
    const activeChildren = children.filter(c => c.status === 'Active').length;

    return `
      <div class="space-y-6">
        <!-- Header Banner -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-800 p-6 md:p-8 rounded-2xl text-white shadow-xl">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wider mb-3 backdrop-blur-sm">
              <i class="fas fa-chalkboard-teacher"></i> Teacher / Educator Portal
            </div>
            <h1 class="text-2xl md:text-3xl font-bold text-white tracking-tight">Welcome back, ${teacher?.full_name || 'Educator'}</h1>
            <p class="text-blue-100 text-sm md:text-base mt-1 max-w-xl">
              Track classroom behaviors, document structured observations, and provide vital non-clinical context for multidisciplinary therapy teams.
            </p>
          </div>
          <div class="flex flex-wrap gap-3">
            <button onclick="window.location.hash='#observation-create'" class="btn bg-white text-blue-700 hover:bg-blue-50 font-semibold shadow-lg px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all">
              <i class="fas fa-plus-circle"></i> Log Observation
            </button>
            <button onclick="window.location.hash='#observations'" class="btn bg-blue-600/40 text-white hover:bg-blue-600/60 font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 border border-white/20 transition-all">
              <i class="fas fa-list-check"></i> History
            </button>
          </div>
        </div>

        <!-- Non-Clinical Role Notice -->
        <div class="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-xl flex items-start gap-3 shadow-sm">
          <i class="fas fa-info-circle text-amber-600 text-lg mt-0.5"></i>
          <div class="text-sm text-amber-900">
            <span class="font-bold">Observational Context Notice:</span> Teacher observations document real-world classroom routines, peer interactions, and sensory responses. These records support multidisciplinary clinical reviews and do not constitute clinical or medical diagnoses.
          </div>
        </div>

        <!-- Stat Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div class="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold">
              <i class="fas fa-children"></i>
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-600">Assigned Students</p>
              <h3 class="text-2xl font-bold text-slate-900 mt-0.5">${totalChildren}</h3>
              <p class="text-xs text-emerald-600 font-medium mt-0.5"><i class="fas fa-check-circle"></i> ${activeChildren} active in class</p>
            </div>
          </div>

          <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div class="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl font-bold">
              <i class="fas fa-clipboard-list"></i>
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-600">Observations Logged</p>
              <h3 class="text-2xl font-bold text-slate-900 mt-0.5">${totalObservations}</h3>
              <p class="text-xs text-indigo-600 font-medium mt-0.5"><i class="fas fa-layer-group"></i> 5 developmental domains</p>
            </div>
          </div>

          <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div class="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl font-bold">
              <i class="fas fa-calendar-check"></i>
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-600">This Month</p>
              <h3 class="text-2xl font-bold text-slate-900 mt-0.5">${observationsThisMonth}</h3>
              <p class="text-xs text-slate-600 font-medium mt-0.5">Submitted entries</p>
            </div>
          </div>

          <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div class="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-xl font-bold">
              <i class="fas fa-file-signature"></i>
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-600">Reports Integrated</p>
              <h3 class="text-2xl font-bold text-slate-900 mt-0.5">${Math.min(totalObservations, 4)}</h3>
              <p class="text-xs text-purple-600 font-medium mt-0.5"><i class="fas fa-share-nodes"></i> Shared with therapists</p>
            </div>
          </div>
        </div>

        <!-- Main Content 2-Column Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Left Column (2 spans): Assigned Children Cards -->
          <div class="lg:col-span-2 space-y-4">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
                <i class="fas fa-shapes text-blue-600"></i> My Assigned Students
              </h2>
              <span class="text-xs font-medium bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100">
                ${children.length} Students
              </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              ${children.map(child => {
                const childObs = observations.filter(o => o.child_id === child.id);
                const lastObs = childObs[0];
                return `
                  <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                    <div>
                      <div class="flex items-start justify-between gap-3">
                        <div class="flex items-center gap-3">
                          <div class="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-base flex items-center justify-center shadow-sm">
                            ${child.first_name[0]}${child.last_name[0]}
                          </div>
                          <div>
                            <h3 class="font-bold text-slate-900 text-base leading-tight">${child.first_name} ${child.last_name}</h3>
                            <p class="text-xs text-slate-600 font-mono mt-0.5">${child.child_code}</p>
                          </div>
                        </div>
                        <span class="px-2.5 py-1 text-xs font-semibold rounded-full ${
                          child.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }">
                          ${child.status}
                        </span>
                      </div>

                      <div class="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                        <div class="flex justify-between text-slate-600">
                          <span class="text-slate-600"><i class="fas fa-school mr-1.5 text-slate-600"></i>Classroom:</span>
                          <span class="font-medium text-slate-800">${child.classroom_group || 'Kindergarten Readiness'}</span>
                        </div>
                        <div class="flex justify-between text-slate-600">
                          <span class="text-slate-600"><i class="fas fa-calendar mr-1.5 text-slate-600"></i>Age:</span>
                          <span class="font-medium text-slate-800">${child.age_months ? `${Math.floor(child.age_months / 12)}y ${child.age_months % 12}m` : '3y 4m'}</span>
                        </div>
                        <div class="flex justify-between text-slate-600">
                          <span class="text-slate-600"><i class="fas fa-notes-medical mr-1.5 text-slate-600"></i>Observations:</span>
                          <span class="font-semibold text-blue-600">${childObs.length} logged</span>
                        </div>
                        ${lastObs ? `
                          <div class="bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-2">
                            <span class="font-semibold text-slate-700 block mb-0.5">Last observed: ${lastObs.observation_date}</span>
                            <p class="text-slate-600 italic line-clamp-2">"${lastObs.teacher_note || 'Observation recorded.'}"</p>
                          </div>
                        ` : `
                          <div class="bg-amber-50/70 p-2 rounded-lg text-amber-800 italic text-[11px]">
                            No observations logged yet this term.
                          </div>
                        `}
                      </div>
                    </div>

                    <div class="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                      <button onclick="window.location.hash='#observation-create?childId=${child.id}'" class="btn btn-primary text-xs py-2 rounded-xl flex items-center justify-center gap-1.5 font-semibold">
                        <i class="fas fa-plus"></i> Observe
                      </button>
                      <button onclick="window.location.hash='#child-profile?id=${child.id}'" class="btn btn-outline text-xs py-2 rounded-xl flex items-center justify-center gap-1.5 font-semibold">
                        <i class="fas fa-id-card"></i> Profile
                      </button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Right Column: Recent Observation Feed -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
                <i class="fas fa-clock-rotate-left text-indigo-600"></i> Recent Feed
              </h2>
              <a href="#observations" class="text-xs font-semibold text-blue-600 hover:text-blue-800">View All</a>
            </div>

            <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              ${observations.length === 0 ? `
                <div class="text-center py-8 text-slate-600 text-sm">
                  <i class="fas fa-clipboard text-3xl text-slate-300 mb-2 block"></i>
                  No classroom observations recorded yet.
                </div>
              ` : observations.slice(0, 4).map(obs => {
                const child = window.neuroDB.getChildById(obs.child_id);
                return `
                  <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/70 transition-colors">
                    <div class="flex items-start justify-between gap-2">
                      <div>
                        <h4 class="font-bold text-sm text-slate-900">${child ? `${child.first_name} ${child.last_name}` : 'Student'}</h4>
                        <p class="text-xs text-indigo-600 font-medium mt-0.5">
                          <i class="fas fa-tag text-[10px] mr-1"></i>${obs.activity_context || 'Classroom Activity'}
                        </p>
                      </div>
                      <span class="text-[11px] font-mono text-slate-600 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                        ${obs.observation_date}
                      </span>
                    </div>
                    <p class="text-xs text-slate-600 mt-2 line-clamp-2 italic">
                      "${obs.teacher_note || 'Structured behavioral observation logged across domains.'}"
                    </p>
                    <div class="mt-3 flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                      <span class="text-emerald-700 font-medium flex items-center gap-1">
                        <i class="fas fa-check-double text-emerald-500"></i> 5 Domains
                      </span>
                      <button onclick="window.teacherModule.openObservationModal('${obs.id}')" class="text-blue-600 hover:text-blue-800 font-semibold">
                        View Details →
                      </button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>

            <!-- Helpful Educator Tips Card -->
            <div class="bg-gradient-to-br from-indigo-50 to-blue-50 p-5 rounded-2xl border border-indigo-100 shadow-sm">
              <h4 class="font-bold text-indigo-950 text-sm flex items-center gap-2 mb-2">
                <i class="fas fa-lightbulb text-amber-500"></i> Observation Guidelines
              </h4>
              <ul class="text-xs text-indigo-900/80 space-y-1.5 list-disc list-inside">
                <li>Record specific context (circle time, recess, lunch).</li>
                <li>Observe spontaneous vs. prompted behaviors.</li>
                <li>Note sensory reactions to classroom audio/visuals.</li>
                <li>All logs are visible in Therapist diagnostic reviews.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderObservationsListView() {
    const teacher = this.getCurrentTeacher();
    const observations = window.neuroDB.getTeacherObservations({ teacher_id: teacher?.id });
    const children = this.getAssignedChildren();

    return `
      <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Classroom Behavioral Observations</h1>
            <p class="text-sm text-slate-600 mt-1">Structured 5-domain observation log across daily school and developmental routines.</p>
          </div>
          <button onclick="window.location.hash='#observation-create'" class="btn btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold shadow-md">
            <i class="fas fa-plus-circle"></i> New Observation
          </button>
        </div>

        <!-- Filter & Search Bar -->
        <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div class="relative w-full md:w-80">
            <i class="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 text-sm"></i>
            <input type="text" id="obsSearchInput" oninput="window.teacherModule.filterObservationsList()" placeholder="Search by student name or context..." class="input pl-10 pr-4 py-2 text-sm w-full rounded-xl border border-slate-200">
          </div>
          <div class="flex items-center gap-3 w-full md:w-auto">
            <select id="obsChildFilter" onchange="window.teacherModule.filterObservationsList()" class="input py-2 px-3 text-sm rounded-xl border border-slate-200 bg-white">
              <option value="">All Students</option>
              ${children.map(c => `<option value="${c.id}">${c.first_name} ${c.last_name}</option>`).join('')}
            </select>
          </div>
        </div>

        <!-- Observations Table -->
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-sm" id="observationsTable">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-100 text-xs uppercase font-semibold text-slate-600">
                  <th class="py-3.5 px-4">Date</th>
                  <th class="py-3.5 px-4">Student</th>
                  <th class="py-3.5 px-4">Activity Context</th>
                  <th class="py-3.5 px-4">Teacher Observation Notes</th>
                  <th class="py-3.5 px-4">Status</th>
                  <th class="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${observations.length === 0 ? `
                  <tr>
                    <td colspan="6" class="text-center py-12 text-slate-600">
                      <i class="fas fa-clipboard-question text-4xl text-slate-300 mb-3 block"></i>
                      No observations recorded yet. Click <strong>New Observation</strong> to start.
                    </td>
                  </tr>
                ` : observations.map(obs => {
                  const child = window.neuroDB.getChildById(obs.child_id);
                  const studentName = child ? `${child.first_name} ${child.last_name}` : 'Unknown Student';
                  const studentCode = child ? child.child_code : '';
                  return `
                    <tr class="hover:bg-slate-50/70 transition-colors obs-row" data-student="${studentName.toLowerCase()}" data-child-id="${obs.child_id}" data-context="${(obs.activity_context || '').toLowerCase()}">
                      <td class="py-3.5 px-4 font-mono text-xs text-slate-700 whitespace-nowrap">
                        <i class="far fa-calendar text-slate-600 mr-1.5"></i>${obs.observation_date}
                      </td>
                      <td class="py-3.5 px-4">
                        <div class="font-bold text-slate-900">${studentName}</div>
                        <div class="text-xs text-slate-600 font-mono">${studentCode}</div>
                      </td>
                      <td class="py-3.5 px-4">
                        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                          <i class="fas fa-tag text-[10px]"></i>${obs.activity_context || 'General Activity'}
                        </span>
                      </td>
                      <td class="py-3.5 px-4 max-w-xs">
                        <p class="text-xs text-slate-600 line-clamp-2 italic">
                          "${obs.teacher_note || 'Structured 5-domain observation logged.'}"
                        </p>
                      </td>
                      <td class="py-3.5 px-4 whitespace-nowrap">
                        <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                          ${obs.status || 'Submitted'}
                        </span>
                      </td>
                      <td class="py-3.5 px-4 text-right whitespace-nowrap space-x-2">
                        <button onclick="window.teacherModule.openObservationModal('${obs.id}')" class="btn btn-outline text-xs px-3 py-1.5 rounded-lg font-semibold text-blue-600 hover:bg-blue-50 border-blue-200">
                          <i class="fas fa-eye mr-1"></i> View
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
    const searchVal = (document.getElementById('obsSearchInput')?.value || '').toLowerCase().trim();
    const childVal = document.getElementById('obsChildFilter')?.value || '';
    const rows = document.querySelectorAll('.obs-row');

    rows.forEach(row => {
      const student = row.getAttribute('data-student') || '';
      const context = row.getAttribute('data-context') || '';
      const childId = row.getAttribute('data-child-id') || '';

      const matchesSearch = !searchVal || student.includes(searchVal) || context.includes(searchVal);
      const matchesChild = !childVal || childId === childVal;

      if (matchesSearch && matchesChild) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  }

  renderObservationForm(preselectedChildId = null) {
    const children = this.getAssignedChildren();
    const today = new Date().toISOString().split('T')[0];

    // Five domains for teacher observation
    const domains = [
      {
        id: 'domain_social',
        title: '1. Social Interaction & Joint Attention',
        description: 'Observe peer engagement, eye gaze during tasks, and response when addressed.',
        icon: 'fa-users',
        color: 'blue',
        questions: [
          { key: 'social_plays_with_others', label: 'Plays cooperatively or sits harmoniously with other children' },
          { key: 'social_responds_when_called', label: 'Turns head / responds promptly when name is called by teacher or peer' },
          { key: 'social_group_activities', label: 'Participates in group circle time and classroom songs' }
        ]
      },
      {
        id: 'domain_comm',
        title: '2. Communication & Instruction Following',
        description: 'Observe verbal expression, gestural requests, and following teacher instructions.',
        icon: 'fa-comments',
        color: 'indigo',
        questions: [
          { key: 'comm_communicates_needs', label: 'Communicates basic needs (water, bathroom, help) using words/gestures' },
          { key: 'comm_uses_words_gestures', label: 'Uses words, phrases, or visual picture cards during activities' },
          { key: 'comm_follows_instructions', label: 'Follows 1-step or 2-step teacher verbal instructions without physical prompting' }
        ]
      },
      {
        id: 'domain_behav',
        title: '3. Behavioural Patterns & Engagement',
        description: 'Observe focus retention, repetitive motor movements, and routine transition flexibility.',
        icon: 'fa-puzzle-piece',
        color: 'purple',
        questions: [
          { key: 'behav_remains_engaged', label: 'Remains calmly engaged in structured tabletop tasks for 5+ minutes' },
          { key: 'behav_repetitive_behaviour', label: 'Displays repetitive motor actions (hand-flapping, rocking, pacing)' },
          { key: 'behav_difficulty_routine', label: 'Shows distress or resistance when classroom routine or activity shifts' }
        ]
      },
      {
        id: 'domain_sensory',
        title: '4. Sensory Responses in Classroom',
        description: 'Observe sensitivity to auditory noise, tactile textures, and crowded school settings.',
        icon: 'fa-shield-halved',
        color: 'teal',
        questions: [
          { key: 'sensory_loud_sounds', label: 'Reacts with distress to loud sounds (school bells, applause, hand dryers)' },
          { key: 'sensory_touch_environment', label: 'Resists touching messy textures (finger paint, clay, wet sand)' },
          { key: 'sensory_crowded_noisy', label: 'Appears overwhelmed or covers ears in crowded cafeteria or gym' }
        ]
      },
      {
        id: 'domain_classroom',
        title: '5. Classroom Learning & Task Independence',
        description: 'Observe task completion, self-help autonomy, and need for educator assistance.',
        icon: 'fa-graduation-cap',
        color: 'emerald',
        questions: [
          { key: 'class_learning_activities', label: 'Shows interest in books, puzzles, coloring, and learning materials' },
          { key: 'class_completes_tasks', label: 'Completes simple assigned classroom tasks independently' },
          { key: 'class_requires_assistance', label: 'Requires 1-on-1 teacher assistance to stay seated and regulated' }
        ]
      }
    ];

    return `
      <div class="max-w-4xl mx-auto space-y-6">
        <!-- Breadcrumb & Title -->
        <div class="flex items-center justify-between">
          <div>
            <a href="#observations" class="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 mb-2">
              <i class="fas fa-arrow-left"></i> Back to Observations
            </a>
            <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Classroom Behavioural Observation Form</h1>
            <p class="text-sm text-slate-600 mt-1">Structured 5-domain recording for real-world school and developmental context.</p>
          </div>
        </div>

        <!-- Form Card -->
        <form id="teacherObservationForm" onsubmit="window.teacherModule.handleSubmitObservation(event)" class="space-y-6">
          <!-- Metadata Card -->
          <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 class="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <i class="fas fa-user-tag text-blue-600"></i> Student & Activity Details
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Student <span class="text-rose-500">*</span></label>
                <select name="child_id" required class="input w-full rounded-xl border border-slate-200 py-2.5 px-3 text-sm bg-white font-medium">
                  <option value="">Select Student...</option>
                  ${children.map(c => `
                    <option value="${c.id}" ${preselectedChildId === c.id ? 'selected' : ''}>
                      ${c.first_name} ${c.last_name} (${c.child_code})
                    </option>
                  `).join('')}
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Observation Date <span class="text-rose-500">*</span></label>
                <input type="date" name="observation_date" required value="${today}" max="${today}" class="input w-full rounded-xl border border-slate-200 py-2.5 px-3 text-sm bg-white font-medium">
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Activity Context <span class="text-rose-500">*</span></label>
                <input type="text" name="activity_context" required placeholder="e.g., Circle Time, Recess, Free Play" class="input w-full rounded-xl border border-slate-200 py-2.5 px-3 text-sm bg-white font-medium">
              </div>
            </div>
          </div>

          <!-- 5 Domains Section -->
          ${domains.map((dom, dIdx) => `
            <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <div class="flex items-start gap-3 border-b border-slate-100 pb-3">
                <div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-base mt-0.5">
                  <i class="fas ${dom.icon}"></i>
                </div>
                <div>
                  <h3 class="text-base font-bold text-slate-900">${dom.title}</h3>
                  <p class="text-xs text-slate-600 mt-0.5">${dom.description}</p>
                </div>
              </div>

              <div class="space-y-4 pt-1">
                ${dom.questions.map((q, qIdx) => `
                  <div class="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                    <p class="text-sm font-semibold text-slate-800">
                      <span class="text-slate-600 mr-1">${dIdx + 1}.${qIdx + 1}</span> ${q.label}
                    </p>
                    
                    <div class="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      ${this.ratingOptions.map(opt => `
                        <label class="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-blue-50/70 cursor-pointer transition-colors text-xs font-medium text-slate-700">
                          <input type="radio" name="${q.key}" value="${opt}" required class="text-blue-600 focus:ring-blue-500">
                          <span>${opt}</span>
                        </label>
                      `).join('')}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}

          <!-- Teacher Observation Notes Card -->
          <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <h3 class="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <i class="fas fa-pencil-alt text-blue-600"></i> Teacher Context Notes & Specific Observations
            </h3>
            <p class="text-xs text-slate-600">Describe specific classroom triggers, peer interactions, strengths, or prompts used during this observation.</p>
            <textarea name="teacher_note" rows="4" required placeholder="e.g., Child participated enthusiastically when visual schedule cards were used. Showed mild discomfort when transition music began but settled with verbal reassurance..." class="input w-full rounded-xl border border-slate-200 p-3 text-sm bg-white font-normal"></textarea>
          </div>

          <!-- Submit Bar -->
          <div class="flex items-center justify-end gap-3 pt-2">
            <button type="button" onclick="window.location.hash='#observations'" class="btn btn-outline px-6 py-2.5 rounded-xl font-semibold">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary px-8 py-2.5 rounded-xl font-semibold shadow-md flex items-center gap-2">
              <i class="fas fa-check-circle"></i> Submit Observation
            </button>
          </div>
        </form>
      </div>
    `;
  }

  handleSubmitObservation(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    const childId = formData.get('child_id');
    const observationDate = formData.get('observation_date');
    const activityContext = formData.get('activity_context');
    const teacherNote = formData.get('teacher_note');

    if (!childId || !observationDate || !activityContext || !teacherNote) {
      alert('Please fill out all required fields.');
      return;
    }

    const ratings = {};
    const ratingKeys = [
      'social_plays_with_others', 'social_responds_when_called', 'social_group_activities',
      'comm_communicates_needs', 'comm_uses_words_gestures', 'comm_follows_instructions',
      'behav_remains_engaged', 'behav_repetitive_behaviour', 'behav_difficulty_routine',
      'sensory_loud_sounds', 'sensory_touch_environment', 'sensory_crowded_noisy',
      'class_learning_activities', 'class_completes_tasks', 'class_requires_assistance'
    ];

    for (const key of ratingKeys) {
      const val = formData.get(key);
      if (!val) {
        alert('Please complete all 5 domain rating questions.');
        return;
      }
      ratings[key] = val;
    }

    const teacher = this.getCurrentTeacher();
    const newObs = window.neuroDB.createTeacherObservation({
      child_id: childId,
      teacher_id: teacher?.id || 'usr_teacher_1',
      observation_date: observationDate,
      activity_context: activityContext,
      ratings: ratings,
      teacher_note: teacherNote,
      status: 'Submitted'
    });

    // Notify Therapist
    const child = window.neuroDB.getChildById(childId);
    if (child && child.assigned_therapist_id) {
      window.neuroDB.createNotification({
        user_id: child.assigned_therapist_id,
        title: 'New Teacher Observation Logged',
        message: `Teacher ${teacher?.full_name || 'Educator'} logged a classroom observation for ${child.first_name} ${child.last_name} (${activityContext}).`,
        type: 'observation',
        link: '#observations'
      });
    }

    alert('Observation submitted successfully and synchronized for therapist review.');
    window.location.hash = '#observations';
  }

  renderChildProfile(childId) {
    const child = window.neuroDB.getChildById(childId);
    if (!child) {
      return `
        <div class="p-8 text-center bg-white rounded-2xl border border-slate-100 shadow-sm">
          <p class="text-slate-600">Child record not found.</p>
          <a href="#my-children" class="btn btn-primary mt-4 inline-block">Back to My Children</a>
        </div>
      `;
    }

    const observations = window.neuroDB.getTeacherObservations({ child_id: childId });

    return `
      <div class="space-y-6">
        <!-- Breadcrumb & Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <a href="#my-children" class="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 mb-2">
              <i class="fas fa-arrow-left"></i> Back to My Students
            </a>
            <div class="flex items-center gap-3">
              <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xl flex items-center justify-center shadow-md">
                ${child.first_name[0]}${child.last_name[0]}
              </div>
              <div>
                <h1 class="text-2xl font-bold text-slate-900 tracking-tight">${child.first_name} ${child.last_name}</h1>
                <p class="text-xs text-slate-600 font-mono mt-0.5">ID: ${child.child_code} • Classroom: ${child.classroom_group || 'Kindergarten Early Readiness'}</p>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <button onclick="window.location.hash='#observation-create?childId=${child.id}'" class="btn btn-primary px-5 py-2.5 rounded-xl font-semibold shadow-md flex items-center gap-2">
              <i class="fas fa-plus-circle"></i> Log Observation
            </button>
          </div>
        </div>

        <!-- Non-clinical Profile Notice -->
        <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-xl flex items-start gap-3 text-xs text-blue-900 shadow-sm">
          <i class="fas fa-info-circle text-blue-600 text-base mt-0.5"></i>
          <div>
            <strong>Educator View:</strong> This profile provides educational and classroom context for student monitoring. Clinical diagnostic plans and medical therapy charts are managed by the licensed therapy team.
          </div>
        </div>

        <!-- 3-Column Info Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-2">
              <i class="fas fa-id-badge text-blue-600"></i> Student Info
            </h3>
            <div class="space-y-2 text-xs">
              <div class="flex justify-between py-1 border-b border-slate-50"><span class="text-slate-600">Date of Birth:</span> <span class="font-semibold text-slate-800">${child.dob || '2022-04-15'}</span></div>
              <div class="flex justify-between py-1 border-b border-slate-50"><span class="text-slate-600">Age:</span> <span class="font-semibold text-slate-800">${child.age_months ? `${Math.floor(child.age_months / 12)}y ${child.age_months % 12}m` : '3y 10m'}</span></div>
              <div class="flex justify-between py-1 border-b border-slate-50"><span class="text-slate-600">Gender:</span> <span class="font-semibold text-slate-800">${child.gender || 'Male'}</span></div>
              <div class="flex justify-between py-1"><span class="text-slate-600">Status:</span> <span class="font-semibold text-emerald-600">${child.status}</span></div>
            </div>
          </div>

          <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-2">
              <i class="fas fa-school text-indigo-600"></i> Classroom Group
            </h3>
            <div class="space-y-2 text-xs">
              <div class="flex justify-between py-1 border-b border-slate-50"><span class="text-slate-600">Section:</span> <span class="font-semibold text-slate-800">${child.classroom_group || 'Kindergarten Readiness'}</span></div>
              <div class="flex justify-between py-1 border-b border-slate-50"><span class="text-slate-600">Observations:</span> <span class="font-semibold text-blue-600">${observations.length} logs recorded</span></div>
              <div class="flex justify-between py-1"><span class="text-slate-600">Emergency:</span> <span class="font-semibold text-slate-800">${child.emergency_contact || 'Parent contact on file'}</span></div>
            </div>
          </div>

          <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-2">
              <i class="fas fa-comment-dots text-purple-600"></i> Educator Notes
            </h3>
            <p class="text-xs text-slate-600 leading-relaxed italic">
              ${child.notes || 'Student is participating in the structured classroom learning curriculum.'}
            </p>
          </div>
        </div>

        <!-- Student Observation History -->
        <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 class="text-base font-bold text-slate-900 flex items-center gap-2">
              <i class="fas fa-clipboard-list text-blue-600"></i> Classroom Observation History
            </h2>
            <span class="text-xs font-semibold bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
              ${observations.length} Recorded
            </span>
          </div>

          ${observations.length === 0 ? `
            <div class="text-center py-8 text-slate-600 text-sm">
              <i class="fas fa-clipboard text-3xl text-slate-300 mb-2 block"></i>
              No observations recorded yet for this student.
            </div>
          ` : `
            <div class="space-y-3">
              ${observations.map(obs => `
                <div class="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div class="space-y-1">
                    <div class="flex items-center gap-3">
                      <span class="font-mono text-xs font-bold text-slate-700 bg-white px-2.5 py-0.5 rounded-md border border-slate-200">
                        ${obs.observation_date}
                      </span>
                      <span class="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                        ${obs.activity_context}
                      </span>
                    </div>
                    <p class="text-xs text-slate-600 italic mt-1 line-clamp-2">
                      "${obs.teacher_note || '5-domain behavioral observation submitted.'}"
                    </p>
                  </div>
                  <button onclick="window.teacherModule.openObservationModal('${obs.id}')" class="btn btn-outline text-xs px-4 py-2 rounded-xl font-semibold text-blue-600 border-blue-200 whitespace-nowrap">
                    <i class="fas fa-eye mr-1"></i> View Ratings
                  </button>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </div>
    `;
  }

  openObservationModal(observationId) {
    const obs = window.neuroDB.getTeacherObservationById(observationId);
    if (!obs) return;

    const child = window.neuroDB.getChildById(obs.child_id);
    const teacher = window.neuroDB.getUserById(obs.teacher_id);

    const modalHtml = `
      <div id="observationDetailModal" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
        <div class="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 my-8 space-y-5 animate-in fade-in zoom-in-95 duration-150">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
                Teacher Observation Record
              </span>
              <h3 class="text-xl font-bold text-slate-900 mt-1">
                ${child ? `${child.first_name} ${child.last_name}` : 'Student Observation'}
              </h3>
            </div>
            <button onclick="document.getElementById('observationDetailModal').remove()" class="text-slate-600 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-100">
              <i class="fas fa-times text-lg"></i>
            </button>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl text-xs border border-slate-100">
            <div><span class="text-slate-600">Date:</span> <strong class="text-slate-800 block">${obs.observation_date}</strong></div>
            <div><span class="text-slate-600">Activity Context:</span> <strong class="text-indigo-700 block">${obs.activity_context}</strong></div>
            <div><span class="text-slate-600">Educator:</span> <strong class="text-slate-800 block">${teacher ? teacher.full_name : 'Teacher'}</strong></div>
          </div>

          <div class="space-y-3">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-600">5-Domain Rating Breakdown</h4>
            <div class="max-h-60 overflow-y-auto pr-1 space-y-2 text-xs">
              ${Object.entries(obs.ratings || {}).map(([key, val]) => {
                const formattedKey = key
                  .replace(/^(social_|comm_|behav_|sensory_|class_)/, '')
                  .replace(/_/g, ' ')
                  .replace(/\b\w/g, l => l.toUpperCase());
                
                let badgeColor = 'bg-slate-100 text-slate-700';
                if (val === 'Always' || val === 'Often') badgeColor = 'bg-emerald-100 text-emerald-800';
                if (val === 'Sometimes') badgeColor = 'bg-amber-100 text-amber-800';
                if (val === 'Never') badgeColor = 'bg-rose-100 text-rose-800';

                return `
                  <div class="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span class="text-slate-700 font-medium">${formattedKey}</span>
                    <span class="px-2.5 py-0.5 rounded-full font-bold text-[11px] ${badgeColor}">${val}</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <div class="bg-blue-50/60 p-4 rounded-xl border border-blue-100 space-y-1">
            <h4 class="text-xs font-bold uppercase tracking-wider text-blue-900">Educator Observation Notes</h4>
            <p class="text-xs text-blue-950 italic leading-relaxed">
              "${obs.teacher_note || 'No additional notes provided.'}"
            </p>
          </div>

          <div class="flex justify-end pt-2">
            <button onclick="document.getElementById('observationDetailModal').remove()" class="btn btn-primary px-6 py-2 rounded-xl text-xs font-semibold">
              Close
            </button>
          </div>
        </div>
      </div>
    `;

    const existing = document.getElementById('observationDetailModal');
    if (existing) existing.remove();
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }
}

// Global Teacher Module Singleton
window.teacherModule = new TeacherModule();
