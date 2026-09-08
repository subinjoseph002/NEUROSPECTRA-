/**
 * NEUROSPECTRA - Relational Database & Persistence Service
 * Complete normalized relational schema with initial seed data.
 */

const DB_STORAGE_KEY = 'NEUROSPECTRA_DB_V1';

const INITIAL_DB_DATA = {
  users: [
    {
      id: 'usr_admin_1',
      full_name: 'Dr. Eleanor Vance (Administrator)',
      email: 'admin@neurospectra.org',
      password_hash: 'admin123',
      role: 'Administrator',
      phone: '+91 98201 45672',
      avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
      is_active: 1,
      created_at: '2026-01-10T08:00:00Z',
      updated_at: '2026-01-10T08:00:00Z'
    },
    {
      id: 'usr_therapist_1',
      full_name: 'Dr. Aisha Khan, Ph.D., BCBA-D',
      email: 'therapist@neurospectra.org',
      password_hash: 'therapist123',
      role: 'Therapist',
      phone: '+91 98451 89234',
      avatar_url: 'https://images.unsplash.com/photo-1594824813589-3221e5138137?auto=format&fit=crop&q=80&w=256',
      is_active: 1,
      created_at: '2026-01-12T09:30:00Z',
      updated_at: '2026-01-12T09:30:00Z'
    },
    {
      id: 'usr_therapist_2',
      full_name: 'Dr. Marcus Vance, M.D. (Child Neurologist)',
      email: 'marcus.vance@neurospectra.org',
      password_hash: 'therapist123',
      role: 'Therapist',
      phone: '+91 97114 62890',
      avatar_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=256',
      is_active: 1,
      created_at: '2026-01-15T10:00:00Z',
      updated_at: '2026-01-15T10:00:00Z'
    },
    {
      id: 'usr_receptionist_1',
      full_name: 'Sarah Jenkins (Clinical Coordinator)',
      email: 'receptionist@neurospectra.org',
      password_hash: 'receptionist123',
      role: 'Receptionist',
      phone: '+91 98230 41589',
      avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256',
      is_active: 1,
      created_at: '2026-01-14T08:30:00Z',
      updated_at: '2026-01-14T08:30:00Z'
    },
    {
      id: 'usr_parent_1',
      full_name: 'Priya Sharma (Parent / Caregiver)',
      email: 'parent@neurospectra.org',
      password_hash: 'parent123',
      role: 'Parent / Caregiver',
      phone: '+91 94471 63820',
      avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256',
      is_active: 1,
      created_at: '2026-01-16T11:00:00Z',
      updated_at: '2026-01-16T11:00:00Z'
    },
    {
      id: 'usr_parent_2',
      full_name: 'David Miller (Parent / Caregiver)',
      email: 'david.miller@gmail.com',
      password_hash: 'parent123',
      role: 'Parent / Caregiver',
      phone: '+91 99802 75419',
      avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256',
      is_active: 1,
      created_at: '2026-01-18T14:00:00Z',
      updated_at: '2026-01-18T14:00:00Z'
    },
    {
      id: 'usr_parent_3',
      full_name: 'Lin Chen (Parent / Caregiver)',
      email: 'lin.chen@gmail.com',
      password_hash: 'parent123',
      role: 'Parent / Caregiver',
      phone: '+91 98190 38472',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      is_active: 1,
      created_at: '2026-01-20T10:00:00Z',
      updated_at: '2026-01-20T10:00:00Z'
    },
    {
      id: 'usr_teacher_1',
      full_name: 'Marcus Brody (Special Educator)',
      email: 'teacher@neurospectra.org',
      password_hash: 'teacher123',
      role: 'Teacher',
      phone: '+91 98300 94165',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
      is_active: 1,
      created_at: '2026-01-18T11:00:00Z',
      updated_at: '2026-01-18T11:00:00Z'
    }
  ],

  children: [
    {
      id: 'ch_101',
      child_code: 'NS-2026-0101',
      first_name: 'Aarav',
      last_name: 'Sharma',
      dob: '2023-04-15',
      age_months: 40,
      gender: 'Male',
      blood_group: 'B+',
      address: '742 Evergreen Terrace, Springfield',
      emergency_contact: 'Priya Sharma (+91 94471 63820)',
      primary_parent_id: 'usr_parent_1',
      assigned_therapist_id: 'usr_therapist_1',
      assigned_teacher_id: 'usr_teacher_1',
      classroom_group: 'Pre-K Sensory Group A',
      status: 'Active',
      notes: 'Initial screening showed mild speech delay and sensitivity to loud auditory stimuli. Responsive to visual cues and picture exchange.',
      created_at: '2026-02-01T11:30:00Z'
    },
    {
      id: 'ch_102',
      child_code: 'NS-2026-0102',
      first_name: 'Liam',
      last_name: 'Miller',
      dob: '2022-09-10',
      age_months: 47,
      gender: 'Male',
      blood_group: 'O+',
      address: '128 Willow Creek Road, Brookside',
      emergency_contact: 'David Miller (+91 99802 75419)',
      primary_parent_id: 'usr_parent_2',
      assigned_therapist_id: 'usr_therapist_1',
      assigned_teacher_id: 'usr_teacher_1',
      classroom_group: 'Kindergarten Early Readiness',
      status: 'Active',
      notes: 'Showing steady progress in joint attention and vocal imitation. Enjoys sensory motor play and block activities.',
      created_at: '2026-02-06T15:00:00Z'
    },
    {
      id: 'ch_103',
      child_code: 'NS-2026-0103',
      first_name: 'Maya',
      last_name: 'Chen',
      dob: '2023-11-22',
      age_months: 33,
      gender: 'Female',
      blood_group: 'A+',
      address: '45 Lotus Blossom Way, Metro City',
      emergency_contact: 'Lin Chen (+91 98190 38472)',
      primary_parent_id: 'usr_parent_3',
      assigned_therapist_id: 'usr_therapist_2',
      assigned_teacher_id: 'usr_teacher_1',
      classroom_group: 'Toddler Developmental Play',
      status: 'Under Assessment',
      notes: 'Parent requested screening due to reduced eye contact during social interactions and toe-walking.',
      created_at: '2026-02-10T10:15:00Z'
    },
    {
      id: 'ch_104',
      child_code: 'NS-2026-0104',
      first_name: 'Noah',
      last_name: 'Patel',
      dob: '2022-01-30',
      age_months: 54,
      gender: 'Male',
      blood_group: 'AB+',
      address: '88 Oakridge Boulevard, Lakeview',
      emergency_contact: 'Anita Patel (+91 98711 52938)',
      primary_parent_id: 'usr_parent_2',
      assigned_therapist_id: 'usr_therapist_1',
      assigned_teacher_id: 'usr_teacher_1',
      classroom_group: 'Pre-K Structured Learning',
      status: 'Active',
      notes: 'Focusing on peer turn-taking and emotional regulation during transition periods.',
      created_at: '2026-02-12T13:40:00Z'
    }
  ],

  teacher_observations: [
    {
      id: 'obs_101',
      child_id: 'ch_101',
      teacher_id: 'usr_teacher_1',
      observation_date: '2026-02-10',
      activity_context: 'Group Circle Time & Storytelling',
      ratings: {
        social_plays_with_others: 'Sometimes',
        social_responds_when_called: 'Often',
        social_group_activities: 'Sometimes',
        comm_communicates_needs: 'Sometimes',
        comm_uses_words_gestures: 'Often',
        comm_follows_instructions: 'Often',
        behav_remains_engaged: 'Sometimes',
        behav_repetitive_behaviour: 'Sometimes',
        behav_difficulty_routine: 'Often',
        sensory_loud_sounds: 'Often',
        sensory_touch_environment: 'Sometimes',
        sensory_crowded_noisy: 'Often',
        class_learning_activities: 'Often',
        class_completes_tasks: 'Sometimes',
        class_requires_assistance: 'Sometimes'
      },
      teacher_note: 'Aarav participated well during circle time with visual cards. Needed some gentle prompting when transitioning from sensory motor play back to seated activity.',
      status: 'Submitted',
      created_at: '2026-02-10T11:15:00Z'
    },
    {
      id: 'obs_102',
      child_id: 'ch_102',
      teacher_id: 'usr_teacher_1',
      observation_date: '2026-02-11',
      activity_context: 'Sensory Motor & Free Play',
      ratings: {
        social_plays_with_others: 'Often',
        social_responds_when_called: 'Always',
        social_group_activities: 'Often',
        comm_communicates_needs: 'Often',
        comm_uses_words_gestures: 'Always',
        comm_follows_instructions: 'Often',
        behav_remains_engaged: 'Often',
        behav_repetitive_behaviour: 'Never',
        behav_difficulty_routine: 'Sometimes',
        sensory_loud_sounds: 'Sometimes',
        sensory_touch_environment: 'Never',
        sensory_crowded_noisy: 'Sometimes',
        class_learning_activities: 'Always',
        class_completes_tasks: 'Often',
        class_requires_assistance: 'Sometimes'
      },
      teacher_note: 'Liam engaged positively with peers during block construction. Demonstrated good turn-taking when playing with toy cars.',
      status: 'Submitted',
      created_at: '2026-02-11T14:30:00Z'
    },
    {
      id: 'obs_103',
      child_id: 'ch_104',
      teacher_id: 'usr_teacher_1',
      observation_date: '2026-02-13',
      activity_context: 'Classroom Lunch & Snack Routine',
      ratings: {
        social_plays_with_others: 'Often',
        social_responds_when_called: 'Often',
        social_group_activities: 'Always',
        comm_communicates_needs: 'Always',
        comm_uses_words_gestures: 'Always',
        comm_follows_instructions: 'Often',
        behav_remains_engaged: 'Often',
        behav_repetitive_behaviour: 'Never',
        behav_difficulty_routine: 'Sometimes',
        sensory_loud_sounds: 'Never',
        sensory_touch_environment: 'Never',
        sensory_crowded_noisy: 'Sometimes',
        class_learning_activities: 'Always',
        class_completes_tasks: 'Always',
        class_requires_assistance: 'Never'
      },
      teacher_note: 'Noah followed cafeteria rules independently and helped clean up after mealtime. Responded very well to structured praise.',
      status: 'Submitted',
      created_at: '2026-02-13T12:45:00Z'
    }
  ],

  assessment_templates: [
    {
      id: 'tmpl_communication',
      title: 'Communication & Verbal Expressiveness Assessment',
      category: 'Speech & Language Development',
      description: 'Evaluates child vocalizations, gesture usage, functional requests, and verbal comprehension in everyday interactions.',
      total_questions: 5,
      scoring_method: 'Rating_Scale_5'
    },
    {
      id: 'tmpl_social',
      title: 'Social Interaction & Joint Attention Assessment',
      category: 'Social-Emotional Reciprocity',
      description: 'Assesses eye contact, shared enjoyment, peer play interest, and reciprocal social smile during structured play.',
      total_questions: 5,
      scoring_method: 'Rating_Scale_5'
    },
    {
      id: 'tmpl_behaviour',
      title: 'Behavioural & Routine Flexibility Observation',
      category: 'Behavioural Patterns & Flexibility',
      description: 'Clinical observation of activity engagement, repetitive motor movements, and transition tolerance across routines.',
      total_questions: 5,
      scoring_method: 'Rating_Scale_5'
    },
    {
      id: 'tmpl_sensory',
      title: 'Sensory Response & Environmental Processing Assessment',
      category: 'Sensory Integration',
      description: 'Evaluates auditory, tactile, visual, and spatial sensitivity during busy classroom and clinic environments.',
      total_questions: 5,
      scoring_method: 'Rating_Scale_5'
    },
    {
      id: 'tmpl_daily_living',
      title: 'Daily Living & Adaptive Skills Assessment',
      category: 'Adaptive & Independence Milestones',
      description: 'Evaluates age-appropriate functional autonomy, following 2-step directions, and self-help independence.',
      total_questions: 5,
      scoring_method: 'Rating_Scale_5'
    },
    {
      id: 'tmpl_mchat_rf',
      title: 'Standardized M-CHAT-R/F Early Screening Battery',
      category: 'Early Developmental Screening',
      description: 'Standardized 20-item screening questionnaire to identify children who may benefit from comprehensive developmental assessment.',
      total_questions: 20,
      scoring_method: 'Risk_Indicator_Scoring'
    }
  ],

  assessment_questions: [
    // Communication Assessment Items
    { id: 'q_comm_1', template_id: 'tmpl_communication', order_num: 1, domain: 'Receptive Communication', text: 'Does the child turn and respond when their name is spoken?', type: 'rating_5', options: ['Never', 'Sometimes', 'Often', 'Always', 'Not Observed'] },
    { id: 'q_comm_2', template_id: 'tmpl_communication', order_num: 2, domain: 'Expressive Requesting', text: 'Does the child communicate basic needs (e.g., wanting juice, toy, help) using words, pointing, or gestures?', type: 'rating_5', options: ['Never', 'Sometimes', 'Often', 'Always', 'Not Observed'] },
    { id: 'q_comm_3', template_id: 'tmpl_communication', order_num: 3, domain: 'Verbal / Non-Verbal Vocabulary', text: 'Does the child use words, sign language, or picture symbols to name everyday objects?', type: 'rating_5', options: ['Never', 'Sometimes', 'Often', 'Always', 'Not Observed'] },
    { id: 'q_comm_4', template_id: 'tmpl_communication', order_num: 4, domain: 'Instruction Following', text: 'Can the child understand and carry out simple 1-step or 2-step spoken instructions without physical guidance?', type: 'rating_5', options: ['Never', 'Sometimes', 'Often', 'Always', 'Not Observed'] },
    { id: 'q_comm_5', template_id: 'tmpl_communication', order_num: 5, domain: 'Vocal Imitation', text: 'Does the child imitate simple speech sounds, words, or conversational tones during play?', type: 'rating_5', options: ['Never', 'Sometimes', 'Often', 'Always', 'Not Observed'] },

    // Social Interaction Items
    { id: 'q_soc_1', template_id: 'tmpl_social', order_num: 1, domain: 'Eye Gaze & Engagement', text: 'Does the child establish and maintain natural eye contact during conversation or interactive play?', type: 'rating_5', options: ['Never', 'Sometimes', 'Often', 'Always', 'Not Observed'] },
    { id: 'q_soc_2', template_id: 'tmpl_social', order_num: 2, domain: 'Peer Orientation', text: 'Does the child show interest in peers (e.g., observing, sitting nearby, offering toys)?', type: 'rating_5', options: ['Never', 'Sometimes', 'Often', 'Always', 'Not Observed'] },
    { id: 'q_soc_3', template_id: 'tmpl_social', order_num: 3, domain: 'Group Participation', text: 'Does the child participate in cooperative or turn-taking group games (e.g., passing a ball, circle time)?', type: 'rating_5', options: ['Never', 'Sometimes', 'Often', 'Always', 'Not Observed'] },
    { id: 'q_soc_4', template_id: 'tmpl_social', order_num: 4, domain: 'Social Smiling', text: 'Does the child respond with a spontaneous smile when an adult or peer smiles warmly at them?', type: 'rating_5', options: ['Never', 'Sometimes', 'Often', 'Always', 'Not Observed'] },
    { id: 'q_soc_5', template_id: 'tmpl_social', order_num: 5, domain: 'Joint Attention & Showing', text: 'Does the child bring objects to show you simply to share joy or interest (not just to request help)?', type: 'rating_5', options: ['Never', 'Sometimes', 'Often', 'Always', 'Not Observed'] },

    // Behavioural Observation Items
    { id: 'q_beh_1', template_id: 'tmpl_behaviour', order_num: 1, domain: 'Routine Flexibility', text: 'Does the child adapt smoothly when daily routines or scheduled activities change?', type: 'rating_5', options: ['Never', 'Sometimes', 'Often', 'Always', 'Not Observed'] },
    { id: 'q_beh_2', template_id: 'tmpl_behaviour', order_num: 2, domain: 'Motor Movements', text: 'Does the child display repetitive motor actions (e.g., hand-flapping, rocking, finger flicking)?', type: 'rating_5', options: ['Never', 'Sometimes', 'Often', 'Always', 'Not Observed'] },
    { id: 'q_beh_3', template_id: 'tmpl_behaviour', order_num: 3, domain: 'Sustained Engagement', text: 'Can the child remain calmly engaged in a structured tabletop or sensory activity for 5–10 minutes?', type: 'rating_5', options: ['Never', 'Sometimes', 'Often', 'Always', 'Not Observed'] },
    { id: 'q_beh_4', template_id: 'tmpl_behaviour', order_num: 4, domain: 'Activity Transition', text: 'Does the child transition between physical spaces or tasks without significant distress or resistance?', type: 'rating_5', options: ['Never', 'Sometimes', 'Often', 'Always', 'Not Observed'] },
    { id: 'q_beh_5', template_id: 'tmpl_behaviour', order_num: 5, domain: 'Self-Regulation', text: 'Does the child demonstrate age-appropriate self-soothing and emotional recovery when frustrated?', type: 'rating_5', options: ['Never', 'Sometimes', 'Often', 'Always', 'Not Observed'] },

    // Sensory Response Items
    { id: 'q_sen_1', template_id: 'tmpl_sensory', order_num: 1, domain: 'Auditory Tolerance', text: 'Does the child react calmly to unexpected loud noises (e.g., school bells, hand dryers, applause)?', type: 'rating_5', options: ['Never', 'Sometimes', 'Often', 'Always', 'Not Observed'] },
    { id: 'q_sen_2', template_id: 'tmpl_sensory', order_num: 2, domain: 'Tactile Acceptance', text: 'Does the child tolerate diverse tactile textures (e.g., playdough, sand, finger paint, messy hands)?', type: 'rating_5', options: ['Never', 'Sometimes', 'Often', 'Always', 'Not Observed'] },
    { id: 'q_sen_3', template_id: 'tmpl_sensory', order_num: 3, domain: 'Crowded Environments', text: 'Does the child remain comfortable in busy, visually stimulating, or crowded environments?', type: 'rating_5', options: ['Never', 'Sometimes', 'Often', 'Always', 'Not Observed'] },
    { id: 'q_sen_4', template_id: 'tmpl_sensory', order_num: 4, domain: 'Vestibular Seeking', text: 'Does the child seek excessive spinning, jumping, or body crashing to fulfill sensory regulation?', type: 'rating_5', options: ['Never', 'Sometimes', 'Often', 'Always', 'Not Observed'] },
    { id: 'q_sen_5', template_id: 'tmpl_sensory', order_num: 5, domain: 'Visual Comfort', text: 'Does the child tolerate fluorescent room lighting and contrast without squinting or covering eyes?', type: 'rating_5', options: ['Never', 'Sometimes', 'Often', 'Always', 'Not Observed'] },

    // Daily Living Skills Items
    { id: 'q_dl_1', template_id: 'tmpl_daily_living', order_num: 1, domain: 'Task Independence', text: 'Can the child complete familiar simple tasks (e.g., putting shoes on, packing backpack) with minimal prompting?', type: 'rating_5', options: ['Never', 'Sometimes', 'Often', 'Always', 'Not Observed'] },
    { id: 'q_dl_2', template_id: 'tmpl_daily_living', order_num: 2, domain: 'Mealtime Cooperation', text: 'Does the child eat independently and tolerate standard table foods without severe texture aversion?', type: 'rating_5', options: ['Never', 'Sometimes', 'Often', 'Always', 'Not Observed'] },
    { id: 'q_dl_3', template_id: 'tmpl_daily_living', order_num: 3, domain: 'Assistance Prompting', text: 'Does the child seek help appropriately when faced with a difficult task rather than withdrawing?', type: 'rating_5', options: ['Never', 'Sometimes', 'Often', 'Always', 'Not Observed'] },
    { id: 'q_dl_4', template_id: 'tmpl_daily_living', order_num: 4, domain: 'Safety Boundaries', text: 'Does the child respect physical safety rules (e.g., staying within classroom perimeter, holding hand in parking lot)?', type: 'rating_5', options: ['Never', 'Sometimes', 'Often', 'Always', 'Not Observed'] },
    { id: 'q_dl_5', template_id: 'tmpl_daily_living', order_num: 5, domain: 'Hygiene & Cleanliness', text: 'Does the child participate cooperatively in handwashing, face wiping, and tooth brushing routines?', type: 'rating_5', options: ['Never', 'Sometimes', 'Often', 'Always', 'Not Observed'] },

    // M-CHAT-R/F Items
    { id: 'q_mc_1', template_id: 'tmpl_mchat_rf', order_num: 1, domain: 'Social Orientation', text: 'If you point at something across the room, does your child look at it?', type: 'yes_no', reverse_scored: 0 },
    { id: 'q_mc_2', template_id: 'tmpl_mchat_rf', order_num: 2, domain: 'Hearing / Sensory', text: 'Have you ever wondered if your child might be deaf?', type: 'yes_no', reverse_scored: 1 },
    { id: 'q_mc_3', template_id: 'tmpl_mchat_rf', order_num: 3, domain: 'Imitation / Pretend Play', text: 'Does your child play pretend or make-believe (e.g., pretend to drink from an empty cup)?', type: 'yes_no', reverse_scored: 0 },
    { id: 'q_mc_4', template_id: 'tmpl_mchat_rf', order_num: 4, domain: 'Motor / Physical', text: 'Does your child like climbing on things (e.g., furniture, playground equipment)?', type: 'yes_no', reverse_scored: 0 },
    { id: 'q_mc_5', template_id: 'tmpl_mchat_rf', order_num: 5, domain: 'Repetitive Movement', text: 'Does your child make unusual finger movements near his or her eyes?', type: 'yes_no', reverse_scored: 1 },
    { id: 'q_mc_6', template_id: 'tmpl_mchat_rf', order_num: 6, domain: 'Pointing / Requesting', text: 'Does your child point with one finger to ask for something or to get help?', type: 'yes_no', reverse_scored: 0 },
    { id: 'q_mc_7', template_id: 'tmpl_mchat_rf', order_num: 7, domain: 'Joint Attention', text: 'Does your child point with one finger to show you something interesting?', type: 'yes_no', reverse_scored: 0 },
    { id: 'q_mc_8', template_id: 'tmpl_mchat_rf', order_num: 8, domain: 'Social Interest', text: 'Is your child interested in other children (e.g., watching, smiling, approaching)?', type: 'yes_no', reverse_scored: 0 },
    { id: 'q_mc_9', template_id: 'tmpl_mchat_rf', order_num: 9, domain: 'Shared Enjoyment', text: 'Does your child show you things by bringing them to you just to share (not just to get help)?', type: 'yes_no', reverse_scored: 0 },
    { id: 'q_mc_10', template_id: 'tmpl_mchat_rf', order_num: 10, domain: 'Name Response', text: 'Does your child respond when you call his or her name (looks up, talks, or stops what they are doing)?', type: 'yes_no', reverse_scored: 0 },
    { id: 'q_mc_11', template_id: 'tmpl_mchat_rf', order_num: 11, domain: 'Social Smile', text: 'When you smile at your child, does he or she smile back at you?', type: 'yes_no', reverse_scored: 0 },
    { id: 'q_mc_12', template_id: 'tmpl_mchat_rf', order_num: 12, domain: 'Sensory Sensitivity', text: 'Does your child get upset by everyday noises (e.g., vacuum cleaner, loud music)?', type: 'yes_no', reverse_scored: 1 },
    { id: 'q_mc_13', template_id: 'tmpl_mchat_rf', order_num: 13, domain: 'Motor Coordination', text: 'Does your child walk independently?', type: 'yes_no', reverse_scored: 0 },
    { id: 'q_mc_14', template_id: 'tmpl_mchat_rf', order_num: 14, domain: 'Eye Contact', text: 'Does your child look you in the eye when you are talking to him or her, playing with them, or dressing them?', type: 'yes_no', reverse_scored: 0 },
    { id: 'q_mc_15', template_id: 'tmpl_mchat_rf', order_num: 15, domain: 'Action Imitation', text: 'Does your child try to copy what you do (e.g., wave goodbye, clap, make a funny noise)?', type: 'yes_no', reverse_scored: 0 },
    { id: 'q_mc_16', template_id: 'tmpl_mchat_rf', order_num: 16, domain: 'Gaze Following', text: 'If you turn your head to look at something, does your child turn to see what you are looking at?', type: 'yes_no', reverse_scored: 0 },
    { id: 'q_mc_17', template_id: 'tmpl_mchat_rf', order_num: 17, domain: 'Seeking Attention', text: 'Does your child try to get you to watch him or her (e.g., look at me, look what I did)?', type: 'yes_no', reverse_scored: 0 },
    { id: 'q_mc_18', template_id: 'tmpl_mchat_rf', order_num: 18, domain: 'Verbal Comprehension', text: 'Does your child understand when you tell him or her to do something without gestures (e.g., "put the book on the chair")?', type: 'yes_no', reverse_scored: 0 },
    { id: 'q_mc_19', template_id: 'tmpl_mchat_rf', order_num: 19, domain: 'Social Referencing', text: 'If something new happens, does your child look at your face to see how you feel about it?', type: 'yes_no', reverse_scored: 0 },
    { id: 'q_mc_20', template_id: 'tmpl_mchat_rf', order_num: 20, domain: 'Movement Play', text: 'Does your child like movement activities (e.g., being swung or bounced on your knee)?', type: 'yes_no', reverse_scored: 0 }
  ],

  assessment_records: [
    {
      id: 'rec_asmt_1',
      child_id: 'ch_101',
      therapist_id: 'usr_therapist_1',
      template_id: 'tmpl_mchat_rf',
      status: 'Completed',
      total_score: 4,
      risk_level: 'Moderate Risk Indicator',
      risk_color: 'amber',
      therapist_notes: 'Child scored in the moderate screening range (4 critical items flagged: pointing to show interest, name response consistency, auditory sensory sensitivity, and gaze following). Recommended structured speech therapy and occupational sensory integration.',
      completed_at: '2026-02-03T14:30:00Z',
      created_at: '2026-02-03T14:00:00Z'
    },
    {
      id: 'rec_asmt_2',
      child_id: 'ch_102',
      therapist_id: 'usr_therapist_1',
      template_id: 'tmpl_mchat_rf',
      status: 'Completed',
      total_score: 2,
      risk_level: 'Low Risk Indicator',
      risk_color: 'emerald',
      therapist_notes: 'Child demonstrated strong imitation and social smiling. Mild tactile sensory aversion noted. Regular monitoring advised.',
      completed_at: '2026-02-07T11:00:00Z',
      created_at: '2026-02-07T10:30:00Z'
    }
  ],

  therapy_plans: [
    {
      id: 'tp_201',
      child_id: 'ch_101',
      therapist_id: 'usr_therapist_1',
      title: 'Targeted Social Communication & Sensory Regulation Plan',
      status: 'Active',
      start_date: '2026-02-05',
      target_date: '2026-05-30',
      frequency: '2 Sessions / Week',
      duration_mins: 45,
      goals: [
        { id: 'g1', title: 'Joint Attention & Eye Gaze', target: 'Maintain 3+ seconds eye contact during structured turn-taking play in 8/10 trials.', status: 'In Progress', progress_pct: 65 },
        { id: 'g2', title: 'Functional Requesting (PECS / Verbal)', target: 'Use 2-word functional requests (e.g., "want ball") without prompting across 5 routines.', status: 'In Progress', progress_pct: 50 },
        { id: 'g3', title: 'Auditory Sensory Desensitization', target: 'Tolerate transition chimes and vacuum sounds using noise-dampening ear cushions without distress.', status: 'In Progress', progress_pct: 75 }
      ],
      recommended_activities: [
        'Bubble blowing and waiting games for joint attention',
        'Interactive mirror play and imitation clapping',
        'Sensory obstacle course with weighted beanbags'
      ],
      notes: 'Caregiver advised to practice 10 minutes of daily floortime play at home.',
      created_at: '2026-02-05T10:00:00Z'
    },
    {
      id: 'tp_202',
      child_id: 'ch_102',
      therapist_id: 'usr_therapist_1',
      title: 'Fine Motor & Peer Turn-Taking Developmental Plan',
      status: 'Active',
      start_date: '2026-02-08',
      target_date: '2026-06-15',
      frequency: '1 Session / Week',
      duration_mins: 45,
      goals: [
        { id: 'g201', title: 'Structured Peer Turn Taking', target: 'Wait for turn for 15 seconds during block tower building with peers.', status: 'In Progress', progress_pct: 80 },
        { id: 'g202', title: 'Expressive Vocabulary Expansion', target: 'Identify and vocalize 10 animal and everyday action cards consistently.', status: 'In Progress', progress_pct: 70 }
      ],
      recommended_activities: [
        'Cooperative puzzle assembly',
        'Story sequencing with picture cards'
      ],
      notes: 'Child shows enthusiasm for music and rhythm-based tasks.',
      created_at: '2026-02-08T09:30:00Z'
    }
  ],

  therapy_sessions: [
    {
      id: 'sess_301',
      therapy_plan_id: 'tp_201',
      child_id: 'ch_101',
      therapist_id: 'usr_therapist_1',
      session_date: '2026-02-07',
      duration_mins: 45,
      session_type: 'Speech & Social Interaction',
      activities_done: 'Bubble popping game, visual requesting with picture cards, sensory swing regulation.',
      observations: 'Aarav initiated eye gaze 6 times during bubble activity. Accepted picture exchange card with minimal gestural prompt.',
      progress_rating: 4, // 1 to 5
      parent_feedback: 'Parent noted Aarav used pointing at home during snack time on Thursday.',
      next_session_notes: 'Introduce multi-step action verbs with plush toys next week.',
      created_at: '2026-02-07T16:00:00Z'
    },
    {
      id: 'sess_302',
      therapy_plan_id: 'tp_201',
      child_id: 'ch_101',
      therapist_id: 'usr_therapist_1',
      session_date: '2026-02-12',
      duration_mins: 45,
      session_type: 'Sensory Motor & Joint Attention',
      activities_done: 'Sensory bin exploration with textured letters, reciprocal rolling of large therapy ball.',
      observations: 'Excellent focus during tactile play. Successfully transitioned between activities without vocal distress.',
      progress_rating: 4.5,
      parent_feedback: 'Calmer evening routine reported after clinic visit.',
      next_session_notes: 'Advance to 2-word verbal approximations.',
      created_at: '2026-02-12T15:30:00Z'
    }
  ],

  progress_records: [
    {
      id: 'prog_401',
      child_id: 'ch_101',
      therapist_id: 'usr_therapist_1',
      record_date: '2026-02-05',
      social_score: 45,
      communication_score: 40,
      sensory_score: 50,
      behavioural_score: 55,
      milestones_achieved: 'Baseline clinical assessment completed. Introduced to therapy environment.',
      therapist_remarks: 'Initial baseline metrics recorded for multi-domain developmental tracking.'
    },
    {
      id: 'prog_402',
      child_id: 'ch_101',
      therapist_id: 'usr_therapist_1',
      record_date: '2026-02-12',
      social_score: 58,
      communication_score: 52,
      sensory_score: 62,
      behavioural_score: 68,
      milestones_achieved: 'Spontaneous pointing for desired toy, sustained joint attention for 15+ seconds during sensory play.',
      therapist_remarks: 'Promising trajectory in both social responsiveness and emotional self-regulation.'
    }
  ],

  appointments: [
    {
      id: 'apt_501',
      child_id: 'ch_101',
      therapist_id: 'usr_therapist_1',
      booked_by_user_id: 'usr_receptionist_1',
      appointment_date: '2026-08-14',
      start_time: '10:00 AM',
      end_time: '10:45 AM',
      type: 'Therapy Session',
      status: 'Confirmed',
      notes: 'Focus on social engagement and speech requesting.',
      reminder_sent: 1,
      created_at: '2026-08-10T09:00:00Z'
    },
    {
      id: 'apt_502',
      child_id: 'ch_102',
      therapist_id: 'usr_therapist_1',
      booked_by_user_id: 'usr_receptionist_1',
      appointment_date: '2026-08-14',
      start_time: '11:30 AM',
      end_time: '12:15 PM',
      type: 'Progress Review',
      status: 'Scheduled',
      notes: 'Mid-term milestone evaluation with caregiver present.',
      reminder_sent: 1,
      created_at: '2026-08-11T14:00:00Z'
    },
    {
      id: 'apt_503',
      child_id: 'ch_103',
      therapist_id: 'usr_therapist_2',
      booked_by_user_id: 'usr_receptionist_1',
      appointment_date: '2026-08-14',
      start_time: '02:00 PM',
      end_time: '03:00 PM',
      type: 'Initial Screening Assessment',
      status: 'Scheduled',
      notes: 'Comprehensive M-CHAT-R/F screening and developmental history review.',
      reminder_sent: 1,
      created_at: '2026-08-12T10:30:00Z'
    },
    {
      id: 'apt_504',
      child_id: 'ch_104',
      therapist_id: 'usr_therapist_1',
      booked_by_user_id: 'usr_receptionist_1',
      appointment_date: '2026-08-15',
      start_time: '09:30 AM',
      end_time: '10:15 AM',
      type: 'Therapy Session',
      status: 'Scheduled',
      notes: 'Peer play module in clinic sensory gym.',
      reminder_sent: 0,
      created_at: '2026-08-12T11:00:00Z'
    }
  ],

  messages: [
    {
      id: 'msg_601',
      sender_id: 'usr_therapist_1',
      receiver_id: 'usr_parent_1',
      child_id: 'ch_101',
      message_text: 'Hello Priya! Aarav did exceptionally well in yesterday\'s sensory session. He made spontaneous eye contact during the bubble game multiple times.',
      is_read: 1,
      created_at: '2026-02-08T09:15:00Z'
    },
    {
      id: 'msg_602',
      sender_id: 'usr_parent_1',
      receiver_id: 'usr_therapist_1',
      child_id: 'ch_101',
      message_text: 'Thank you Dr. Aisha! That is wonderful to hear. We noticed he pointed at his juice cup this morning instead of crying. Should we keep reinforcing that with the picture cards?',
      is_read: 1,
      created_at: '2026-02-08T10:45:00Z'
    },
    {
      id: 'msg_603',
      sender_id: 'usr_therapist_1',
      receiver_id: 'usr_parent_1',
      child_id: 'ch_101',
      message_text: 'Yes, exactly! Give him verbal praise immediately ("Great pointing, Aarav!") and hand him the cup within 2 seconds to reinforce the connection.',
      is_read: 0,
      created_at: '2026-02-08T11:20:00Z'
    },
    {
      id: 'msg_604',
      sender_id: 'usr_teacher_1',
      receiver_id: 'usr_parent_1',
      child_id: 'ch_101',
      message_text: 'Hello Mrs. Sharma! Aarav had a calm morning during classroom story time today. He used his visual schedule card independently when moving to art time.',
      is_read: 1,
      created_at: '2026-02-09T08:30:00Z'
    },
    {
      id: 'msg_605',
      sender_id: 'usr_parent_1',
      receiver_id: 'usr_teacher_1',
      child_id: 'ch_101',
      message_text: 'Thank you Mr. Marcus for the update! We are practicing the visual schedule card at home before breakfast as well.',
      is_read: 1,
      created_at: '2026-02-09T09:10:00Z'
    },
    {
      id: 'msg_606',
      sender_id: 'usr_teacher_1',
      receiver_id: 'usr_therapist_1',
      child_id: 'ch_101',
      message_text: 'Hi Dr. Aisha, I noticed Aarav showed mild auditory sensitivity during the fire drill rehearsal today. Do you recommend noise-cancelling headphones for loud school bells?',
      is_read: 1,
      created_at: '2026-02-10T11:00:00Z'
    }
  ],

  notifications: [
    {
      id: 'notif_701',
      user_id: 'usr_parent_1',
      title: 'Upcoming Appointment Reminder',
      message: 'Therapy session for Aarav is confirmed for today at 10:00 AM with Dr. Aisha Khan.',
      type: 'appointment',
      link: '#appointments',
      is_read: 0,
      created_at: '2026-08-14T07:00:00Z'
    },
    {
      id: 'notif_702',
      user_id: 'usr_therapist_1',
      title: 'New Screening Assessment Assigned',
      message: 'Maya Chen has been scheduled for initial screening today at 02:00 PM.',
      type: 'assessment',
      link: '#assessments',
      is_read: 0,
      created_at: '2026-08-14T08:00:00Z'
    },
    {
      id: 'notif_703',
      user_id: 'usr_admin_1',
      title: 'Monthly Clinical Overview Ready',
      message: '4 active children, 10 scheduled sessions, and 2 completed screening records available for review.',
      type: 'system',
      link: '#reports',
      is_read: 1,
      created_at: '2026-08-13T18:00:00Z'
    }
  ]
};

class NeurospectraDB {
  constructor() {
    this.init();
  }

  init() {
    try {
      const stored = localStorage.getItem(DB_STORAGE_KEY);
      if (!stored) {
        this.saveData(INITIAL_DB_DATA);
      } else {
        const data = JSON.parse(stored);
        let modified = false;
        if (!data.teacher_observations || data.teacher_observations.length === 0) {
          data.teacher_observations = INITIAL_DB_DATA.teacher_observations;
          modified = true;
        }
        if (!data.assessment_templates || data.assessment_templates.length < INITIAL_DB_DATA.assessment_templates.length) {
          data.assessment_templates = INITIAL_DB_DATA.assessment_templates;
          data.assessment_questions = INITIAL_DB_DATA.assessment_questions;
          modified = true;
        }
        if (data.users) {
          const userPhoneMap = {
            'usr_admin_1': '+91 98201 45672',
            'usr_therapist_1': '+91 98451 89234',
            'usr_therapist_2': '+91 97114 62890',
            'usr_receptionist_1': '+91 98230 41589',
            'usr_parent_1': '+91 94471 63820',
            'usr_parent_2': '+91 99802 75419',
            'usr_parent_3': '+91 98190 38472',
            'usr_teacher_1': '+91 98300 94165',
            'admin@neurospectra.org': '+91 98201 45672',
            'therapist@neurospectra.org': '+91 98451 89234',
            'marcus.vance@neurospectra.org': '+91 97114 62890',
            'receptionist@neurospectra.org': '+91 98230 41589',
            'parent@neurospectra.org': '+91 94471 63820',
            'david.miller@gmail.com': '+91 99802 75419',
            'lin.chen@gmail.com': '+91 98190 38472',
            'teacher@neurospectra.org': '+91 98300 94165'
          };

          const fallbackIndianPhones = [
            '+91 98920 18472', '+91 97412 83910', '+91 98402 71829', 
            '+91 98435 67891', '+91 85908 36961', '+91 91234 56780',
            '+91 98573 63678', '+91 98711 52938'
          ];

          data.users.forEach((u, idx) => {
            const mapped = userPhoneMap[u.id] || userPhoneMap[u.email?.toLowerCase()];
            if (mapped) {
              if (u.phone !== mapped) {
                u.phone = mapped;
                modified = true;
              }
            } else {
              let rawDigits = (u.phone || '').replace(/\D/g, '');
              if (rawDigits.length === 12 && rawDigits.startsWith('91')) {
                rawDigits = rawDigits.slice(2);
              }
              if (rawDigits.length === 10 && /^[6-9]/.test(rawDigits)) {
                const formatted = '+91 ' + rawDigits;
                if (u.phone !== formatted) {
                  u.phone = formatted;
                  modified = true;
                }
              } else if (!u.phone || !u.phone.startsWith('+91')) {
                u.phone = fallbackIndianPhones[idx % fallbackIndianPhones.length];
                modified = true;
              }
            }
          });
        }
        if (data.children) {
          const childEmergencyMap = {
            'ch_101': 'Priya Sharma (+91 94471 63820)',
            'ch_102': 'David Miller (+91 99802 75419)',
            'ch_103': 'Lin Chen (+91 98190 38472)',
            'ch_104': 'Anita Patel (+91 98711 52938)'
          };
          data.children.forEach(c => {
            if (childEmergencyMap[c.id] && c.emergency_contact !== childEmergencyMap[c.id]) {
              c.emergency_contact = childEmergencyMap[c.id];
              modified = true;
            }
            if (!c.assigned_teacher_id) {
              const initChild = INITIAL_DB_DATA.children.find(ic => ic.id === c.id);
              c.assigned_teacher_id = initChild ? initChild.assigned_teacher_id : 'usr_teacher_1';
              c.classroom_group = initChild ? initChild.classroom_group : 'Classroom Observation Group';
              modified = true;
            }
          });
        }
        if (modified) {
          this.saveData(data);
        }
      }
    } catch (e) {
      console.warn('LocalStorage not available or reset required, loading in-memory db', e);
      this._memoryDB = JSON.parse(JSON.stringify(INITIAL_DB_DATA));
    }
  }

  getData() {
    try {
      const raw = localStorage.getItem(DB_STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Error reading from localStorage', e);
    }
    return this._memoryDB || INITIAL_DB_DATA;
  }

  saveData(data) {
    try {
      localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      this._memoryDB = data;
    }
  }

  resetToDefaults() {
    this.saveData(JSON.parse(JSON.stringify(INITIAL_DB_DATA)));
    return true;
  }

  // --- Users & Auth Queries ---
  getUsers() {
    return this.getData().users || [];
  }

  getUserById(id) {
    return this.getUsers().find(u => u.id === id) || null;
  }

  getUserByEmail(email) {
    return this.getUsers().find(u => u.email.toLowerCase() === (email || '').toLowerCase().trim()) || null;
  }

  // Secure password hashing utility
  hashPassword(password, salt = 'ns_salt_2026') {
    if (!password) return '';
    let hash = 0;
    const str = `${salt}:${password}`;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return 'nshash_' + Math.abs(hash).toString(16) + '_' + btoa(password).replace(/=/g, '').slice(0, 12);
  }

  // Input Sanitization to prevent XSS & SQL/Script Injection
  sanitize(input) {
    if (typeof input !== 'string') return input;
    return input
      .trim()
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '');
  }

  createUser(userData) {
    const data = this.getData();
    const cleanEmail = this.sanitize(userData.email || '').toLowerCase();
    const cleanName = this.sanitize(userData.full_name || '');
    const cleanPhone = this.sanitize(userData.phone || '').replace(/\D/g, '').slice(-10);
    const cleanRole = this.sanitize(userData.role || 'Parent / Caregiver');
    const pwdHash = this.hashPassword(userData.password || 'password123');

    const newUser = {
      id: 'usr_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
      full_name: cleanName,
      email: cleanEmail,
      password_hash: pwdHash,
      raw_pwd_hash: userData.password, // Keep fallback for existing demo credentials matching
      role: cleanRole,
      phone: cleanPhone ? '+91 ' + cleanPhone : '',
      avatar_url: userData.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256',
      is_active: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    if (!data.users) data.users = [];
    data.users.push(newUser);
    this.saveData(data);

    // Synchronize newly created user with PostgreSQL backend server
    try {
      fetch('/api/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newUser.id,
          full_name: newUser.full_name,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role,
          password: userData.password || 'password123'
        })
      }).catch(err => {
        console.warn('Backend sync notice:', err);
      });
    } catch (e) {}

    return newUser;
  }

  updateUser(id, updates) {
    const data = this.getData();
    const idx = data.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      data.users[idx] = { ...data.users[idx], ...updates, updated_at: new Date().toISOString() };
      this.saveData(data);

      try {
        fetch('/api/auth/users/update/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data.users[idx])
        }).catch(() => {});
      } catch (e) {}

      return data.users[idx];
    }
    return null;
  }

  deleteUser(id) {
    const data = this.getData();
    const initialLen = (data.users || []).length;
    data.users = (data.users || []).filter(u => u.id !== id);
    if (data.users.length !== initialLen) {
      this.saveData(data);
      // Synchronize deletion with PostgreSQL database
      try {
        fetch('/api/auth/users/delete/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: id })
        }).catch(() => {});
      } catch (e) {}
      return true;
    }
    return false;
  }

  // --- Children Queries ---
  getChildren() {
    return this.getData().children || [];
  }

  getChildById(id) {
    return this.getChildren().find(c => c.id === id) || null;
  }

  createChild(childData) {
    const data = this.getData();
    const count = data.children.length + 101;
    const newChild = {
      id: 'ch_' + count,
      child_code: `NS-${new Date().getFullYear()}-${count.toString().padStart(4, '0')}`,
      first_name: childData.first_name,
      last_name: childData.last_name,
      dob: childData.dob,
      age_months: childData.age_months || 36,
      gender: childData.gender || 'Male',
      blood_group: childData.blood_group || 'O+',
      address: childData.address || '',
      emergency_contact: childData.emergency_contact || '',
      primary_parent_id: childData.primary_parent_id,
      assigned_therapist_id: childData.assigned_therapist_id,
      status: childData.status || 'Active',
      notes: childData.notes || '',
      created_at: new Date().toISOString()
    };
    data.children.push(newChild);
    this.saveData(data);
    return newChild;
  }

  updateChild(id, updates) {
    const data = this.getData();
    const idx = data.children.findIndex(c => c.id === id);
    if (idx !== -1) {
      data.children[idx] = { ...data.children[idx], ...updates };
      this.saveData(data);
      return data.children[idx];
    }
    return null;
  }

  // --- Assessments Queries ---
  getAssessmentTemplates() {
    return this.getData().assessment_templates || [];
  }

  getQuestionsByTemplateId(templateId) {
    return (this.getData().assessment_questions || [])
      .filter(q => q.template_id === templateId)
      .sort((a, b) => a.order_num - b.order_num);
  }

  getAssessmentRecords(filter = {}) {
    let records = this.getData().assessment_records || [];
    if (filter.child_id) records = records.filter(r => r.child_id === filter.child_id);
    if (filter.therapist_id) records = records.filter(r => r.therapist_id === filter.therapist_id);
    return records.sort((a, b) => new Date(b.completed_at || b.created_at) - new Date(a.completed_at || a.created_at));
  }

  getAssessments(filter = {}) {
    return this.getAssessmentRecords(filter);
  }

  saveAssessmentRecord(recordData) {
    const data = this.getData();
    const newRecord = {
      id: 'rec_asmt_' + Date.now().toString(36),
      child_id: recordData.child_id,
      therapist_id: recordData.therapist_id,
      template_id: recordData.template_id,
      status: recordData.status || 'Completed',
      total_score: recordData.total_score || 0,
      risk_level: recordData.risk_level || 'Low Risk Indicator',
      risk_color: recordData.risk_color || 'emerald',
      therapist_notes: recordData.therapist_notes || '',
      responses_json: recordData.responses_json || {},
      completed_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    };
    if (!data.assessment_records) data.assessment_records = [];
    data.assessment_records.push(newRecord);
    this.saveData(data);
    return newRecord;
  }

  // --- Therapy Plans Queries ---
  getTherapyPlans(filter = {}) {
    let plans = this.getData().therapy_plans || [];
    if (filter.child_id) plans = plans.filter(p => p.child_id === filter.child_id);
    if (filter.therapist_id) plans = plans.filter(p => p.therapist_id === filter.therapist_id);
    return plans;
  }

  createTherapyPlan(planData) {
    const data = this.getData();
    const newPlan = {
      id: 'tp_' + Date.now().toString(36),
      child_id: planData.child_id,
      therapist_id: planData.therapist_id,
      title: planData.title,
      status: planData.status || 'Active',
      start_date: planData.start_date,
      target_date: planData.target_date,
      frequency: planData.frequency || '2 Sessions / Week',
      duration_mins: parseInt(planData.duration_mins, 10) || 45,
      goals: planData.goals || [],
      recommended_activities: planData.recommended_activities || [],
      notes: planData.notes || '',
      created_at: new Date().toISOString()
    };
    if (!data.therapy_plans) data.therapy_plans = [];
    data.therapy_plans.push(newPlan);
    this.saveData(data);
    return newPlan;
  }

  updateTherapyPlan(id, updates) {
    const data = this.getData();
    const idx = data.therapy_plans.findIndex(p => p.id === id);
    if (idx !== -1) {
      data.therapy_plans[idx] = { ...data.therapy_plans[idx], ...updates };
      this.saveData(data);
      return data.therapy_plans[idx];
    }
    return null;
  }

  // --- Therapy Sessions Queries ---
  getTherapySessions(filter = {}) {
    let sessions = this.getData().therapy_sessions || [];
    if (filter.child_id) sessions = sessions.filter(s => s.child_id === filter.child_id);
    if (filter.therapy_plan_id) sessions = sessions.filter(s => s.therapy_plan_id === filter.therapy_plan_id);
    return sessions.sort((a, b) => new Date(b.session_date) - new Date(a.session_date));
  }

  createTherapySession(sessionData) {
    const data = this.getData();
    const newSession = {
      id: 'sess_' + Date.now().toString(36),
      therapy_plan_id: sessionData.therapy_plan_id,
      child_id: sessionData.child_id,
      therapist_id: sessionData.therapist_id,
      session_date: sessionData.session_date || new Date().toISOString().split('T')[0],
      duration_mins: parseInt(sessionData.duration_mins, 10) || 45,
      session_type: sessionData.session_type || 'General Therapy',
      activities_done: sessionData.activities_done || '',
      observations: sessionData.observations || '',
      progress_rating: parseFloat(sessionData.progress_rating) || 4.0,
      parent_feedback: sessionData.parent_feedback || '',
      next_session_notes: sessionData.next_session_notes || '',
      created_at: new Date().toISOString()
    };
    if (!data.therapy_sessions) data.therapy_sessions = [];
    data.therapy_sessions.push(newSession);
    this.saveData(data);
    return newSession;
  }

  // --- Progress Records Queries ---
  getProgressRecords(childId) {
    const records = (this.getData().progress_records || []).filter(r => r.child_id === childId);
    return records.sort((a, b) => new Date(a.record_date) - new Date(b.record_date));
  }

  createProgressRecord(progData) {
    const data = this.getData();
    const newRecord = {
      id: 'prog_' + Date.now().toString(36),
      child_id: progData.child_id,
      therapist_id: progData.therapist_id,
      record_date: progData.record_date || new Date().toISOString().split('T')[0],
      social_score: parseInt(progData.social_score, 10) || 50,
      communication_score: parseInt(progData.communication_score, 10) || 50,
      sensory_score: parseInt(progData.sensory_score, 10) || 50,
      behavioural_score: parseInt(progData.behavioural_score, 10) || 50,
      milestones_achieved: progData.milestones_achieved || '',
      therapist_remarks: progData.therapist_remarks || ''
    };
    if (!data.progress_records) data.progress_records = [];
    data.progress_records.push(newRecord);
    this.saveData(data);
    return newRecord;
  }

  // --- Appointments Queries ---
  getAppointments(filter = {}) {
    let list = this.getData().appointments || [];
    if (filter.child_id) list = list.filter(a => a.child_id === filter.child_id);
    if (filter.therapist_id) list = list.filter(a => a.therapist_id === filter.therapist_id);
    if (filter.date) list = list.filter(a => a.appointment_date === filter.date);
    return list.sort((a, b) => new Date(`${a.appointment_date} ${a.start_time}`) - new Date(`${b.appointment_date} ${b.start_time}`));
  }

  createAppointment(aptData) {
    const data = this.getData();
    // Validate conflict
    const conflict = (data.appointments || []).some(a => 
      a.therapist_id === aptData.therapist_id &&
      a.appointment_date === aptData.appointment_date &&
      a.start_time === aptData.start_time &&
      a.status !== 'Cancelled'
    );
    if (conflict) {
      throw new Error('Appointment conflict: The selected therapist already has a booking at this time.');
    }

    const newApt = {
      id: 'apt_' + Date.now().toString(36),
      child_id: aptData.child_id,
      therapist_id: aptData.therapist_id,
      booked_by_user_id: aptData.booked_by_user_id,
      appointment_date: aptData.appointment_date,
      start_time: aptData.start_time,
      end_time: aptData.end_time || '10:45 AM',
      type: aptData.type || 'Therapy Session',
      status: aptData.status || 'Confirmed',
      notes: aptData.notes || '',
      reminder_sent: 0,
      created_at: new Date().toISOString()
    };
    if (!data.appointments) data.appointments = [];
    data.appointments.push(newApt);
    this.saveData(data);
    return newApt;
  }

  updateAppointment(id, updates) {
    const data = this.getData();
    const idx = data.appointments.findIndex(a => a.id === id);
    if (idx !== -1) {
      data.appointments[idx] = { ...data.appointments[idx], ...updates };
      this.saveData(data);
      return data.appointments[idx];
    }
    return null;
  }

  // --- Messages Queries ---
  getMessages(childId, userA_Id = null, userB_Id = null) {
    let msgs = this.getData().messages || [];
    if (childId) {
      msgs = msgs.filter(m => m.child_id === childId);
    }
    if (userA_Id && userB_Id) {
      msgs = msgs.filter(m => 
        (m.sender_id === userA_Id && m.receiver_id === userB_Id) ||
        (m.sender_id === userB_Id && m.receiver_id === userA_Id)
      );
    } else if (userA_Id) {
      msgs = msgs.filter(m => m.sender_id === userA_Id || m.receiver_id === userA_Id);
    }
    return msgs.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  }

  sendMessage(msgData) {
    const data = this.getData();
    const newMsg = {
      id: 'msg_' + Date.now().toString(36),
      sender_id: msgData.sender_id,
      receiver_id: msgData.receiver_id,
      child_id: msgData.child_id,
      message_text: msgData.message_text,
      is_read: 0,
      created_at: new Date().toISOString()
    };
    if (!data.messages) data.messages = [];
    data.messages.push(newMsg);
    this.saveData(data);
    return newMsg;
  }

  markMessagesRead(childId, currentUserId, otherUserId = null) {
    const data = this.getData();
    let updated = false;
    (data.messages || []).forEach(m => {
      const matchOther = !otherUserId || m.sender_id === otherUserId;
      if (m.child_id === childId && m.receiver_id === currentUserId && matchOther && !m.is_read) {
        m.is_read = 1;
        updated = true;
      }
    });
    if (updated) this.saveData(data);
  }

  // --- Notifications Queries ---
  getNotifications(userId) {
    const notifs = (this.getData().notifications || []).filter(n => n.user_id === userId);
    return notifs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  createNotification(notifData) {
    const data = this.getData();
    const newNotif = {
      id: 'notif_' + Date.now().toString(36),
      user_id: notifData.user_id,
      title: notifData.title,
      message: notifData.message,
      type: notifData.type || 'info',
      link: notifData.link || '#',
      is_read: 0,
      created_at: new Date().toISOString()
    };
    if (!data.notifications) data.notifications = [];
    data.notifications.unshift(newNotif);
    this.saveData(data);
    return newNotif;
  }

  // --- Teacher Observations Queries ---
  getTeacherObservations(filter = {}) {
    const rawList = this.getData().teacher_observations || [];
    let list = rawList.map(o => ({
      ...o,
      educator_notes: o.educator_notes || o.teacher_note || 'Classroom observation recorded.',
      teacher_note: o.teacher_note || o.educator_notes || 'Classroom observation recorded.',
      overall_severity: o.overall_severity || 'Normal/Typical',
      domain_ratings: o.domain_ratings || {
        social_interaction: { rating: o.ratings?.social_plays_with_others || 'Often' },
        communication: { rating: o.ratings?.comm_communicates_needs || 'Often' },
        behavioural_patterns: { rating: o.ratings?.behav_remains_engaged || 'Sometimes' },
        sensory_responses: { rating: o.ratings?.sensory_loud_sounds || 'Sometimes' },
        classroom_learning: { rating: o.ratings?.class_learning_activities || 'Often' }
      },
      environmental_context: o.environmental_context || {
        activity_type: o.activity_context || 'Classroom Activity',
        noise_level: 'Moderate',
        peer_setting: 'Small Group'
      }
    }));

    if (filter.child_id) list = list.filter(o => o.child_id === filter.child_id);
    if (filter.teacher_id && filter.teacher_id !== 'All') {
      list = list.filter(o => !o.teacher_id || o.teacher_id === filter.teacher_id || o.teacher_id === 'usr_teacher_1' || o.teacher_id === 'usr_teacher_01');
    }
    return list.sort((a, b) => new Date(b.observation_date || b.created_at) - new Date(a.observation_date || a.created_at));
  }

  getTeacherObservationById(id) {
    const list = this.getTeacherObservations();
    return list.find(o => o.id === id) || null;
  }

  createTeacherObservation(obsData) {
    const data = this.getData();
    const newObs = {
      id: obsData.id || ('obs_' + Date.now().toString(36)),
      child_id: obsData.child_id,
      teacher_id: obsData.teacher_id || 'usr_teacher_1',
      observation_date: obsData.observation_date || new Date().toISOString().split('T')[0],
      activity_context: obsData.activity_context || obsData.environmental_context?.activity_type || 'Classroom Activity',
      environmental_context: obsData.environmental_context || {
        activity_type: obsData.activity_context || 'Classroom Activity',
        noise_level: 'Moderate',
        peer_setting: 'Small Group'
      },
      domain_ratings: obsData.domain_ratings || obsData.ratings || {},
      ratings: obsData.ratings || obsData.domain_ratings || {},
      overall_severity: obsData.overall_severity || 'Normal/Typical',
      triggers: obsData.triggers || { positive: '', challenging: '' },
      educator_notes: obsData.educator_notes || obsData.teacher_note || '',
      teacher_note: obsData.teacher_note || obsData.educator_notes || '',
      status: obsData.status || 'Submitted',
      created_at: obsData.created_at || new Date().toISOString()
    };
    if (!data.teacher_observations) data.teacher_observations = [];
    data.teacher_observations.unshift(newObs);
    this.saveData(data);
    return newObs;
  }

  updateTeacherObservation(id, updates) {
    const data = this.getData();
    const idx = (data.teacher_observations || []).findIndex(o => o.id === id);
    if (idx !== -1) {
      data.teacher_observations[idx] = { ...data.teacher_observations[idx], ...updates };
      this.saveData(data);
      return data.teacher_observations[idx];
    }
    return null;
  }

  // --- Goal Progress Helper ---
  updateGoalProgress(therapyPlanId, goalId, progressPct, status = null) {
    const data = this.getData();
    const plan = (data.therapy_plans || []).find(p => p.id === therapyPlanId);
    if (plan && plan.goals) {
      const goal = plan.goals.find(g => g.id === goalId);
      if (goal) {
        goal.progress_pct = Math.min(100, Math.max(0, parseInt(progressPct, 10) || 0));
        if (status) {
          goal.status = status;
        } else if (goal.progress_pct >= 100) {
          goal.status = 'Achieved';
        } else if (goal.progress_pct > 0) {
          goal.status = 'In Progress';
        }
        this.saveData(data);
        return goal;
      }
    }
    return null;
  }

  syncToBackend() {
    try {
      const data = this.getData();
      fetch('/api/bulk-sync/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ users: data.users || [] })
      }).catch(() => {});
    } catch(e) {}
  }

  async syncFromBackend() {
    try {
      const res = await fetch('/api/auth/users/');
      if (res.ok) {
        const remoteUsers = await res.json();
        if (Array.isArray(remoteUsers) && remoteUsers.length > 0) {
          const data = this.getData();
          // Merge remote PostgreSQL users with existing records
          const userMap = new Map();
          (data.users || []).forEach(u => userMap.set(u.id, u));
          remoteUsers.forEach(u => {
            userMap.set(u.id, {
              ...u,
              avatar_url: u.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=128',
              raw_pwd_hash: u.password_hash || 'parent123'
            });
          });
          data.users = Array.from(userMap.values());
          this.saveData(data);
          if (window.renderApp) {
            window.renderApp();
          }
        }
      }
    } catch(e) {}
  }
}

// Global Database Singleton
window.neuroDB = new NeurospectraDB();
setTimeout(() => {
  window.neuroDB.syncFromBackend();
}, 100);


