-- ============================================================================
-- NEUROSPECTRA - Production PostgreSQL Relational Database Schema
-- Pediatric Autism Screening & Clinical Therapy Management Platform
-- Compatible with PostgreSQL 12+ (AWS RDS, Supabase, Neon, Local PostgreSQL)
-- ============================================================================

-- 1. Create Database (Run if executing in fresh pgAdmin / psql terminal)
-- CREATE DATABASE neurospectra_db WITH ENCODING 'UTF8';
-- \c neurospectra_db;

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- ENUM TYPES
-- ============================================================================
DO $$ BEGIN
    CREATE TYPE user_role_enum AS ENUM (
        'Administrator',
        'Therapist',
        'Receptionist',
        'Parent / Caregiver',
        'Teacher'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE gender_enum AS ENUM (
        'Male',
        'Female',
        'Other'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE child_status_enum AS ENUM (
        'Active',
        'Under Assessment',
        'Inactive',
        'Discharged'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE risk_level_enum AS ENUM (
        'Low Risk Indicator',
        'Medium Risk Indicator',
        'High Risk Indicator'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE appointment_status_enum AS ENUM (
        'Confirmed',
        'Pending',
        'Completed',
        'Cancelled'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE notification_type_enum AS ENUM (
        'appointment',
        'assessment',
        'system',
        'therapy',
        'message',
        'info'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

ALTER TYPE notification_type_enum ADD VALUE IF NOT EXISTS 'info';

-- ============================================================================
-- 2. CORE TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Table: users
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role_enum NOT NULL DEFAULT 'Parent / Caregiver',
    phone VARCHAR(30),
    avatar_url TEXT,
    is_active SMALLINT NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ----------------------------------------------------------------------------
-- Table: children
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS children (
    id VARCHAR(64) PRIMARY KEY,
    child_code VARCHAR(32) UNIQUE NOT NULL,
    first_name VARCHAR(60) NOT NULL,
    last_name VARCHAR(60) NOT NULL,
    dob DATE NOT NULL,
    age_months INT NOT NULL,
    gender gender_enum NOT NULL DEFAULT 'Male',
    blood_group VARCHAR(10),
    address TEXT,
    emergency_contact VARCHAR(120),
    primary_parent_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    assigned_therapist_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    assigned_teacher_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    classroom_group VARCHAR(100) DEFAULT 'Kindergarten Early Readiness',
    status child_status_enum NOT NULL DEFAULT 'Active',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_children_parent ON children(primary_parent_id);
CREATE INDEX IF NOT EXISTS idx_children_therapist ON children(assigned_therapist_id);
CREATE INDEX IF NOT EXISTS idx_children_teacher ON children(assigned_teacher_id);

-- ----------------------------------------------------------------------------
-- Table: teacher_observations (Non-Clinical Classroom Observations)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS teacher_observations (
    id VARCHAR(64) PRIMARY KEY,
    child_id VARCHAR(64) NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    teacher_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    observation_date DATE NOT NULL,
    activity_context VARCHAR(120) NOT NULL,
    ratings_json JSONB DEFAULT '{}'::jsonb,
    teacher_note TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Submitted',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_teacher_obs_child ON teacher_observations(child_id);
CREATE INDEX IF NOT EXISTS idx_teacher_obs_teacher ON teacher_observations(teacher_id);

-- ----------------------------------------------------------------------------
-- Table: assessment_templates
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS assessment_templates (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    total_questions INT NOT NULL DEFAULT 20,
    scoring_method VARCHAR(60) DEFAULT 'Risk_Indicator_Scoring',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- Table: assessment_questions
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS assessment_questions (
    id VARCHAR(64) PRIMARY KEY,
    template_id VARCHAR(64) NOT NULL REFERENCES assessment_templates(id) ON DELETE CASCADE,
    order_num INT NOT NULL,
    domain VARCHAR(100) NOT NULL,
    text TEXT NOT NULL,
    type VARCHAR(30) NOT NULL DEFAULT 'yes_no',
    reverse_scored SMALLINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_questions_template ON assessment_questions(template_id, order_num);

-- ----------------------------------------------------------------------------
-- Table: assessment_records
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS assessment_records (
    id VARCHAR(64) PRIMARY KEY,
    child_id VARCHAR(64) NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    therapist_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    template_id VARCHAR(64) NOT NULL REFERENCES assessment_templates(id) ON DELETE CASCADE,
    status VARCHAR(30) NOT NULL DEFAULT 'Completed',
    total_score INT NOT NULL DEFAULT 0,
    risk_level risk_level_enum NOT NULL DEFAULT 'Low Risk Indicator',
    risk_color VARCHAR(30) DEFAULT 'emerald',
    therapist_notes TEXT,
    responses_json JSONB DEFAULT '{}'::jsonb,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_assessment_child ON assessment_records(child_id);
CREATE INDEX IF NOT EXISTS idx_assessment_therapist ON assessment_records(therapist_id);

-- ----------------------------------------------------------------------------
-- Table: therapy_plans (Individualized Education & Therapy Plan / IEP)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS therapy_plans (
    id VARCHAR(64) PRIMARY KEY,
    child_id VARCHAR(64) NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    therapist_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    review_date DATE,
    diagnosis_summary TEXT,
    sensory_profile TEXT,
    goals_json JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(30) NOT NULL DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_therapy_plans_child ON therapy_plans(child_id);

-- ----------------------------------------------------------------------------
-- Table: therapy_sessions
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS therapy_sessions (
    id VARCHAR(64) PRIMARY KEY,
    therapy_plan_id VARCHAR(64) REFERENCES therapy_plans(id) ON DELETE SET NULL,
    child_id VARCHAR(64) NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    therapist_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_date DATE NOT NULL,
    duration_mins INT NOT NULL DEFAULT 45,
    session_type VARCHAR(100) DEFAULT 'Sensory Integration & Communication',
    activities_done TEXT,
    observations TEXT,
    progress_rating NUMERIC(3, 1) DEFAULT 4.0,
    parent_feedback TEXT,
    next_session_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sessions_child ON therapy_sessions(child_id);
CREATE INDEX IF NOT EXISTS idx_sessions_therapist ON therapy_sessions(therapist_id);

-- ----------------------------------------------------------------------------
-- Table: progress_records
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS progress_records (
    id VARCHAR(64) PRIMARY KEY,
    child_id VARCHAR(64) NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    therapist_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    record_date DATE NOT NULL,
    social_score INT NOT NULL DEFAULT 50,
    communication_score INT NOT NULL DEFAULT 50,
    sensory_score INT NOT NULL DEFAULT 50,
    behavioural_score INT NOT NULL DEFAULT 50,
    milestones_achieved TEXT,
    therapist_remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_progress_child ON progress_records(child_id);

-- ----------------------------------------------------------------------------
-- Table: appointments
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS appointments (
    id VARCHAR(64) PRIMARY KEY,
    child_id VARCHAR(64) NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    therapist_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    booked_by_user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    appointment_date DATE NOT NULL,
    start_time VARCHAR(20) NOT NULL,
    end_time VARCHAR(20) NOT NULL,
    type VARCHAR(100) NOT NULL DEFAULT 'Clinical Therapy Session',
    status appointment_status_enum NOT NULL DEFAULT 'Confirmed',
    notes TEXT,
    reminder_sent SMALLINT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_appointments_date_therapist ON appointments(appointment_date, therapist_id);

-- ----------------------------------------------------------------------------
-- Table: messages
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS messages (
    id VARCHAR(64) PRIMARY KEY,
    sender_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    child_id VARCHAR(64) REFERENCES children(id) ON DELETE SET NULL,
    message_text TEXT NOT NULL,
    is_read SMALLINT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_messages_participants ON messages(sender_id, receiver_id);

-- ----------------------------------------------------------------------------
-- Table: notifications
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type notification_type_enum DEFAULT 'system',
    link VARCHAR(255) DEFAULT '#',
    is_read SMALLINT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);


-- ============================================================================
-- 3. INITIAL SEED DATA (Clinical Benchmark Data)
-- ============================================================================

-- Users
INSERT INTO users (id, full_name, email, password_hash, role, phone, is_active)
VALUES
('usr_admin_1', 'Dr. Eleanor Vance (Administrator)', 'admin@neurospectra.org', 'admin123', 'Administrator', '+91 98201 45672', 1),
('usr_therapist_1', 'Dr. Aisha Khan, Ph.D., BCBA-D', 'therapist@neurospectra.org', 'therapist123', 'Therapist', '+91 98451 89234', 1),
('usr_therapist_2', 'Dr. Marcus Vance, M.D.', 'marcus.vance@neurospectra.org', 'therapist123', 'Therapist', '+91 97114 62890', 1),
('usr_receptionist_1', 'Sarah Jenkins (Coordinator)', 'receptionist@neurospectra.org', 'receptionist123', 'Receptionist', '+91 98230 41589', 1),
('usr_parent_1', 'Priya Sharma (Parent)', 'parent@neurospectra.org', 'parent123', 'Parent / Caregiver', '+91 94471 63820', 1),
('usr_parent_2', 'David Miller (Caregiver)', 'david.miller@gmail.com', 'parent123', 'Parent / Caregiver', '+91 99802 75419', 1),
('usr_parent_3', 'Lin Chen (Parent)', 'lin.chen@gmail.com', 'parent123', 'Parent / Caregiver', '+91 98190 38472', 1),
('usr_teacher_1', 'Marcus Brody (Special Educator)', 'teacher@neurospectra.org', 'teacher123', 'Teacher', '+91 98300 94165', 1)
ON CONFLICT (id) DO NOTHING;

-- Children
INSERT INTO children (id, child_code, first_name, last_name, dob, age_months, gender, blood_group, address, emergency_contact, primary_parent_id, assigned_therapist_id, status, notes)
VALUES
('ch_101', 'NS-2026-0101', 'Aarav', 'Sharma', '2023-04-15', 40, 'Male', 'B+', '742 Evergreen Terrace, Springfield', 'Priya Sharma (+91 94471 63820)', 'usr_parent_1', 'usr_therapist_1', 'Active', 'Initial screening showed mild speech delay and sensitivity to loud auditory stimuli. Responsive to visual cues.'),
('ch_102', 'NS-2026-0102', 'Liam', 'Miller', '2022-09-10', 47, 'Male', 'O+', '128 Willow Creek Road, Brookside', 'David Miller (+91 99802 75419)', 'usr_parent_2', 'usr_therapist_1', 'Active', 'Showing steady progress in joint attention and vocal imitation. Enjoys sensory motor play.'),
('ch_103', 'NS-2026-0103', 'Maya', 'Chen', '2023-11-22', 33, 'Female', 'A+', '45 Lotus Blossom Way, Metro City', 'Lin Chen (+91 98190 38472)', 'usr_parent_3', 'usr_therapist_2', 'Under Assessment', 'Parent requested screening due to reduced eye contact during social interactions and toe-walking.'),
('ch_104', 'NS-2026-0104', 'Noah', 'Patel', '2022-01-30', 54, 'Male', 'AB+', '88 Oakridge Boulevard, Lakeview', 'Anita Patel (+91 98711 52938)', 'usr_parent_1', 'usr_therapist_1', 'Active', 'Focusing on peer turn-taking and emotional regulation during transition periods.')
ON CONFLICT (id) DO NOTHING;

-- Assessment Templates
INSERT INTO assessment_templates (id, title, category, description, total_questions, scoring_method)
VALUES
('tmpl_mchat_rf', 'M-CHAT-R/F Screening Foundation (Toddler 16–30 Months)', 'Early Developmental Screening', 'Standardized 20-item screening questionnaire to identify children who may benefit from comprehensive developmental assessment.', 20, 'Risk_Indicator_Scoring'),
('tmpl_behavioral_baseline', 'Behavioural & Communication Spectrum Observation', 'Therapist Clinical Baseline', 'Clinical observation checklist evaluating social interaction, communication responsiveness, and sensory-motor patterns on a 5-point scale.', 10, 'Rating_Scale_5')
ON CONFLICT (id) DO NOTHING;

-- Assessment Questions (M-CHAT-R/F)
INSERT INTO assessment_questions (id, template_id, order_num, domain, text, type, reverse_scored)
VALUES
('q_mc_1', 'tmpl_mchat_rf', 1, 'Social Orientation', 'If you point at something across the room, does your child look at it?', 'yes_no', 0),
('q_mc_2', 'tmpl_mchat_rf', 2, 'Hearing / Sensory', 'Have you ever wondered if your child might be deaf?', 'yes_no', 1),
('q_mc_3', 'tmpl_mchat_rf', 3, 'Imitation / Pretend Play', 'Does your child play pretend or make-believe (e.g., pretend to drink from an empty cup)?', 'yes_no', 0),
('q_mc_4', 'tmpl_mchat_rf', 4, 'Motor / Physical', 'Does your child like climbing on things (e.g., furniture, playground equipment)?', 'yes_no', 0),
('q_mc_5', 'tmpl_mchat_rf', 5, 'Repetitive Movement', 'Does your child make unusual finger movements near his or her eyes?', 'yes_no', 1),
('q_mc_6', 'tmpl_mchat_rf', 6, 'Pointing / Requesting', 'Does your child point with one finger to ask for something or to get help?', 'yes_no', 0),
('q_mc_7', 'tmpl_mchat_rf', 7, 'Joint Attention', 'Does your child point with one finger to show you something interesting?', 'yes_no', 0),
('q_mc_8', 'tmpl_mchat_rf', 8, 'Social Interest', 'Is your child interested in other children (e.g., watching, smiling, approaching)?', 'yes_no', 0),
('q_mc_9', 'tmpl_mchat_rf', 9, 'Shared Enjoyment', 'Does your child show you things by bringing them to you just to share (not just to get help)?', 'yes_no', 0),
('q_mc_10', 'tmpl_mchat_rf', 10, 'Name Response', 'Does your child respond when you call his or her name (looks up, talks, or stops what they are doing)?', 'yes_no', 0),
('q_mc_11', 'tmpl_mchat_rf', 11, 'Social Smile', 'When you smile at your child, does he or she smile back at you?', 'yes_no', 0),
('q_mc_12', 'tmpl_mchat_rf', 12, 'Sensory Sensitivity', 'Does your child get upset by everyday noises (e.g., vacuum cleaner, loud music)?', 'yes_no', 1),
('q_mc_13', 'tmpl_mchat_rf', 13, 'Motor Coordination', 'Does your child walk independently?', 'yes_no', 0),
('q_mc_14', 'tmpl_mchat_rf', 14, 'Eye Contact', 'Does your child look you in the eye when you are talking to him or her, playing with them, or dressing them?', 'yes_no', 0),
('q_mc_15', 'tmpl_mchat_rf', 15, 'Action Imitation', 'Does your child try to copy what you do (e.g., wave goodbye, clap, make a funny noise)?', 'yes_no', 0),
('q_mc_16', 'tmpl_mchat_rf', 16, 'Gaze Following', 'If you turn your head to look at something, does your child turn to see what you are looking at?', 'yes_no', 0),
('q_mc_17', 'tmpl_mchat_rf', 17, 'Seeking Attention', 'Does your child try to get you to watch him or her (e.g., look at me, look what I did)?', 'yes_no', 0),
('q_mc_18', 'tmpl_mchat_rf', 18, 'Verbal Comprehension', 'Does your child understand when you tell him or her to do something without gestures (e.g., "put the book on the chair")?', 'yes_no', 0),
('q_mc_19', 'tmpl_mchat_rf', 19, 'Social Referencing', 'If something new happens, does your child look at your face to see how you feel about it?', 'yes_no', 0),
('q_mc_20', 'tmpl_mchat_rf', 20, 'Movement Play', 'Does your child like movement activities (e.g., being swung or bounced on your knee)?', 'yes_no', 0)
ON CONFLICT (id) DO NOTHING;

-- Completed Assessments
INSERT INTO assessment_records (id, child_id, therapist_id, template_id, status, total_score, risk_level, risk_color, therapist_notes, completed_at)
VALUES
('rec_asmt_1', 'ch_101', 'usr_therapist_1', 'tmpl_mchat_rf', 'Completed', 1, 'Low Risk Indicator', 'emerald', 'Child scored 1 on M-CHAT-R/F (mild noise sensitivity on Q12). All critical social communication benchmarks satisfied.', '2026-02-05T14:30:00Z'),
('rec_asmt_2', 'ch_102', 'usr_therapist_1', 'tmpl_mchat_rf', 'Completed', 4, 'Medium Risk Indicator', 'amber', 'Demonstrates difficulty with name response (Q10) and gaze following (Q16). Recommend structured Speech & Occupational Therapy.', '2026-02-08T11:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- Appointments
INSERT INTO appointments (id, child_id, therapist_id, booked_by_user_id, appointment_date, start_time, end_time, type, status, notes)
VALUES
('apt_1', 'ch_101', 'usr_therapist_1', 'usr_parent_1', '2026-08-14', '10:00 AM', '10:45 AM', 'Occupational Therapy', 'Confirmed', 'Sensory regulation and fine motor coordination activities.'),
('apt_2', 'ch_102', 'usr_therapist_1', 'usr_parent_2', '2026-08-14', '11:30 AM', '12:15 PM', 'Speech & Language Therapy', 'Confirmed', 'Vocal imitation and peer communication exercises.'),
('apt_3', 'ch_103', 'usr_therapist_2', 'usr_parent_1', '2026-08-14', '02:00 PM', '03:00 PM', 'Initial Screening Assessment', 'Confirmed', 'Comprehensive M-CHAT-R/F screening and parent intake interview.')
ON CONFLICT (id) DO NOTHING;
