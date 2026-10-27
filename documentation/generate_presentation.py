"""
NEUROSPECTRA — Automated PowerPoint (.pptx) Generator
Generates a comprehensive 16-slide academic and clinical presentation in 16:9 widescreen.
Usage:
    pip install python-pptx
    python generate_presentation.py
Output:
    NEUROSPECTRA_Project_Presentation.pptx
"""

import sys
import os

try:
    from pptx import Presentation
    from pptx.util import Inches, Pt
    from pptx.enum.text import PP_ALIGN
    from pptx.dml.color import RGBColor
    from pptx.enum.shapes import MSO_SHAPE
except ImportError:
    print("python-pptx is not installed. Run: pip install python-pptx")
    sys.exit(1)


def create_neurospectra_presentation(output_path="NEUROSPECTRA_Project_Presentation.pptx"):
    prs = Presentation()
    # 16:9 widescreen dimensions
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    # Theme Colors
    COLOR_BG_DARK = RGBColor(15, 23, 42)      # #0f172a Midnight Slate
    COLOR_BG_LIGHT = RGBColor(248, 250, 252)  # #f8fafc Soft Off-White
    COLOR_PRIMARY = RGBColor(37, 99, 235)     # #2563eb Clinical Medical Blue
    COLOR_PRIMARY_DARK = RGBColor(29, 78, 216)# #1d4ed8
    COLOR_ACCENT = RGBColor(14, 165, 233)     # #0ea5e9 Sky Blue
    COLOR_EMERALD = RGBColor(16, 185, 129)    # #10b981 Low Risk / Success
    COLOR_AMBER = RGBColor(245, 158, 11)      # #f59e0b Medium Risk
    COLOR_ROSE = RGBColor(239, 68, 68)        # #ef4444 High Risk
    COLOR_TEXT_MAIN = RGBColor(30, 41, 59)    # #1e293b Charcoal Slate
    COLOR_TEXT_MUTED = RGBColor(100, 116, 139)# #64748b Muted Gray
    COLOR_WHITE = RGBColor(255, 255, 255)     # #ffffff
    COLOR_CARD_BG = RGBColor(255, 255, 255)   # #ffffff Card
    COLOR_CARD_BORDER = RGBColor(226, 232, 240) # #e2e8f0 Border

    blank_layout = prs.slide_layouts[6]

    def add_header(slide, title_text, category_text="NEUROSPECTRA CLINICAL PLATFORM"):
        # Header banner shape
        header_shape = slide.shapes.add_shape(
            MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(1.2)
        )
        header_shape.fill.solid()
        header_shape.fill.fore_color.rgb = COLOR_BG_DARK
        header_shape.line.color.rgb = COLOR_PRIMARY
        header_shape.line.width = Pt(1.5)

        # Header Category Pill / Subtitle
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.15), Inches(11.5), Inches(0.3))
        cat_tf = cat_box.text_frame
        cat_tf.word_wrap = True
        p_cat = cat_tf.paragraphs[0]
        p_cat.text = category_text.upper()
        p_cat.font.size = Pt(10)
        p_cat.font.bold = True
        p_cat.font.color.rgb = COLOR_ACCENT
        p_cat.font.name = "Arial"

        # Header Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.42), Inches(11.5), Inches(0.65))
        title_tf = title_box.text_frame
        title_tf.word_wrap = True
        p_title = title_tf.paragraphs[0]
        p_title.text = title_text
        p_title.font.size = Pt(22)
        p_title.font.bold = True
        p_title.font.color.rgb = COLOR_WHITE
        p_title.font.name = "Arial"

    def add_card(slide, left, top, width, height, title, items, badge_text=None, border_color=COLOR_CARD_BORDER):
        # Card Background
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_CARD_BG
        card.line.color.rgb = border_color
        card.line.width = Pt(1.5)

        # Card Title
        tb = slide.shapes.add_textbox(left + Inches(0.25), top + Inches(0.2), width - Inches(0.5), Inches(0.5))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = COLOR_PRIMARY
        p.font.name = "Arial"

        # Content List
        content_box = slide.shapes.add_textbox(left + Inches(0.25), top + Inches(0.7), width - Inches(0.5), height - Inches(0.85))
        ctf = content_box.text_frame
        ctf.word_wrap = True

        for i, item in enumerate(items):
            p_item = ctf.add_paragraph() if i > 0 else ctf.paragraphs[0]
            p_item.text = f"• {item}"
            p_item.font.size = Pt(12)
            p_item.font.color.rgb = COLOR_TEXT_MAIN
            p_item.font.name = "Arial"
            p_item.space_after = Pt(6)

        return card

    # ==========================================================
    # SLIDE 1: Title Slide
    # ==========================================================
    s1 = prs.slides.add_slide(blank_layout)
    bg1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = COLOR_BG_DARK
    bg1.line.fill.background()

    # Title Banner Accent
    pill = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.2), Inches(1.0), Inches(4.5), Inches(0.45))
    pill.fill.solid()
    pill.fill.fore_color.rgb = COLOR_PRIMARY
    pill.line.fill.background()
    ptf = pill.text_frame
    ptf.paragraphs[0].text = "HEALTHCARE AI & CLINICAL INFORMATICS"
    ptf.paragraphs[0].alignment = PP_ALIGN.CENTER
    ptf.paragraphs[0].font.size = Pt(11)
    ptf.paragraphs[0].font.bold = True
    ptf.paragraphs[0].font.color.rgb = COLOR_WHITE

    # Main Title
    tbox = s1.shapes.add_textbox(Inches(1.2), Inches(1.6), Inches(11.0), Inches(2.2))
    ttf = tbox.text_frame
    ttf.word_wrap = True
    p1 = ttf.paragraphs[0]
    p1.text = "NEUROSPECTRA"
    p1.font.size = Pt(46)
    p1.font.bold = True
    p1.font.color.rgb = COLOR_WHITE
    p1.font.name = "Arial"

    p2 = ttf.add_paragraph()
    p2.text = "AI-Powered Pediatric Autism Spectrum Screening, Clinical Assessment, & Multidisciplinary Therapy Platform"
    p2.font.size = Pt(20)
    p2.font.color.rgb = COLOR_ACCENT
    p2.font.name = "Arial"
    p2.space_before = Pt(8)

    # Metadata Card
    infobox = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.2), Inches(4.2), Inches(11.0), Inches(2.3))
    infobox.fill.solid()
    infobox.fill.fore_color.rgb = RGBColor(30, 41, 59)
    infobox.line.color.rgb = COLOR_PRIMARY
    itf = infobox.text_frame
    itf.word_wrap = True

    lines = [
        ("Platform URLs", "Live App: https://neurospectra-two.vercel.app/ | API: https://neurospectra-backend-m2vl.onrender.com/"),
        ("Architecture", "Single Page Application + Django REST Framework + PostgreSQL (Supabase Cloud AWS)"),
        ("Key Stakeholders", "Multidisciplinary: Administrator, Behavioral Therapist, School Teacher, Receptionist, Parent / Caregiver"),
        ("Core Standard", "Official 20-Item M-CHAT-R/F Protocol + Algorithmic Risk Stratification + 5-Domain Matrix"),
    ]
    for idx, (label, val) in enumerate(lines):
        p = itf.add_paragraph() if idx > 0 else itf.paragraphs[0]
        p.text = f"{label}: {val}"
        p.font.size = Pt(13)
        p.font.color.rgb = COLOR_WHITE if idx % 2 == 0 else COLOR_CARD_BORDER
        p.space_after = Pt(6)

    s1.notes_slide.notes_text_frame.text = (
        "Welcome professors and evaluators. Today I present NEUROSPECTRA, an enterprise clinical platform designed to "
        "bridge the critical diagnostic and therapy gap in pediatric Autism Spectrum Disorder."
    )

    # ==========================================================
    # SLIDE 2: Executive Summary & Motivation
    # ==========================================================
    s2 = prs.slides.add_slide(blank_layout)
    add_header(s2, "Executive Summary & Clinical Problem Statement", "CLINICAL MOTIVATION & PROBLEM SCOPE")

    add_card(s2, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.3), "The Pediatric Autism Challenge", [
        "1 in 36 children globally diagnosed with Autism Spectrum Disorder (ASD).",
        "Clinical Window: Neuroplastic intervention before 36-48 months yields the highest cognitive & adaptive gains.",
        "Diagnostic Bottleneck: Current average age of diagnosis is 48-60 months due to paper backlogs and delayed screening.",
        "Data Fragmentation: Therapy notes, school behaviors, and home routines exist in isolated, disconnected silos.",
        "Scoring Inaccuracies: Manual paper M-CHAT questionnaires often lead to miscalculated reverse-scored items.",
    ], border_color=COLOR_ROSE)

    add_card(s2, Inches(6.8), Inches(1.6), Inches(5.7), Inches(5.3), "The NEUROSPECTRA Solution", [
        "Centralized Digital Ecosystem: Synchronizes 5 distinct care stakeholders in real-time.",
        "Automated M-CHAT-R/F Scoring: Instant algorithmic risk calculation eliminating manual calculation error.",
        "5-Domain Classroom Matrix: Captures daily school observations from teachers without clinical diagnostic jargon.",
        "Conflict-Free Scheduling: Multi-clinician calendar engine with 0-collision validation.",
        "Transparent IEP Progress: Multi-domain radar analytics keeping parents empowered and engaged.",
    ], border_color=COLOR_EMERALD)

    s2.notes_slide.notes_text_frame.text = (
        "Every month of delay in autism intervention represents lost neuroplasticity. NEUROSPECTRA removes administrative friction "
        "and automates screening so that children receive timely behavioral therapy."
    )

    # ==========================================================
    # SLIDE 3: Project Objectives & Innovations
    # ==========================================================
    s3 = prs.slides.add_slide(blank_layout)
    add_header(s3, "Project Objectives & Novel Technical Contributions", "CORE CAPABILITIES")

    add_card(s3, Inches(0.8), Inches(1.6), Inches(3.6), Inches(5.3), "1. Diagnostic Standardization", [
        "Fully automated 20-item M-CHAT-R/F protocol.",
        "Automated direction inversion for reverse-scored items (Q2, Q5, Q12).",
        "Deterministic risk stratification (Low: 0-2, Medium: 3-7, High: 8-20).",
        "Audit trail with historical timestamping.",
    ])

    add_card(s3, Inches(4.8), Inches(1.6), Inches(3.6), Inches(5.3), "2. Multidisciplinary Care Loop", [
        "First platform combining Teacher observations with Clinical Therapy IEPs.",
        "Teacher 5-Domain Matrix: Social, Communication, Sensory, Attention, Behavior.",
        "Longitudinal progress tracking across sessions (1.0 to 5.0 scale).",
        "Automated care team milestone alerts.",
    ])

    add_card(s3, Inches(8.8), Inches(1.6), Inches(3.7), Inches(5.3), "3. Operational Excellence", [
        "Conflict-free scheduling preventing double-booking.",
        "Role-Based Access Control (RBAC) across 5 roles with admin approval gate.",
        "Fully responsive mobile-first UI for clinical tablets and parental smartphones.",
        "Automated PDF & CSV clinical report generation.",
    ])

    # ==========================================================
    # SLIDE 4: 5 Stakeholder Personas & RBAC
    # ==========================================================
    s4 = prs.slides.add_slide(blank_layout)
    add_header(s4, "Role-Based Access Control (RBAC) & Stakeholder Personas", "SECURITY & ACCESS ARCHITECTURE")

    roles = [
        ("Administrator", "System Governance", [
            "Clinician credential verification & approval gate.",
            "Platform user account status management.",
            "System audit logging & data governance.",
        ], Inches(0.8), Inches(1.6)),
        ("Behavioral Therapist", "Clinical Lead", [
            "Administers standardized M-CHAT-R/F screenings.",
            "Formulates Individualized Education Plans (IEP).",
            "Logs therapy encounter ratings (1.0-5.0).",
        ], Inches(4.8), Inches(1.6)),
        ("School Teacher", "Classroom Observer", [
            "Logs 5-domain matrix observations.",
            "Records contextual triggers (lunch, circle time).",
            "Aligns classroom goals with clinical IEP.",
        ], Inches(8.8), Inches(1.6)),
        ("Clinic Receptionist", "Intake & Calendar", [
            "Registers pediatric patient profiles.",
            "Schedules conflict-free appointments.",
            "Manages daily clinic attendance queues.",
        ], Inches(2.8), Inches(4.4)),
        ("Parent / Caregiver", "Home Care Partner", [
            "Completes developmental intake surveys.",
            "Visualizes multi-domain progress radar charts.",
            "Books and confirms therapy sessions.",
        ], Inches(6.8), Inches(4.4)),
    ]

    for title, subtitle, items, left, top in roles:
        add_card(s4, left, top, Inches(3.7), Inches(2.6), f"{title} ({subtitle})", items)

    # ==========================================================
    # SLIDE 5: System Architecture & Cloud Infrastructure
    # ==========================================================
    s5 = prs.slides.add_slide(blank_layout)
    add_header(s5, "Decoupled 3-Tier Cloud Architecture & Infrastructure", "SYSTEM TOPOLOGY")

    add_card(s5, Inches(0.8), Inches(1.6), Inches(3.6), Inches(5.3), "Frontend Presentation Tier", [
        "Vercel Global Edge CDN hosting.",
        "Single Page Application (SPA) architecture.",
        "Vanilla JS clinical shell + modern responsive CSS.",
        "Canvas & Chart.js dynamic radar/trend analytics.",
        "Zero horizontal scrolling on mobile/tablet screens.",
    ])

    add_card(s5, Inches(4.8), Inches(1.6), Inches(3.6), Inches(5.3), "Application & Security Tier", [
        "Render Cloud Linux Web Service (Oregon, USA).",
        "Gunicorn WSGI Application Server.",
        "Django REST Framework & Python 3.11 engine.",
        "Stateless JWT Bearer Token Authentication.",
        "Server-side route guards & payload sanitization.",
    ])

    add_card(s5, Inches(8.8), Inches(1.6), Inches(3.7), Inches(5.3), "Database & Storage Tier", [
        "Supabase Managed PostgreSQL 15 Instance.",
        "Hosted on AWS Asia-Pacific (Mumbai ap-south-1).",
        "Connection transaction pooling on port 5432.",
        "13 normalized relational tables with cascading FKs.",
        "JSONB support for dynamic observation matrices.",
    ])

    # ==========================================================
    # SLIDE 6: Automated M-CHAT-R/F Diagnostic Engine
    # ==========================================================
    s6 = prs.slides.add_slide(blank_layout)
    add_header(s6, "Standardized M-CHAT-R/F Screening & Scoring Engine", "CLINICAL DIAGNOSTIC WORKFLOW")

    add_card(s6, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.3), "The M-CHAT-R/F Scoring Logic", [
        "Standardized 20-Item Toddler Checklist for ages 16-30 months.",
        "Reverse-Scored Critical Items: Questions 2, 5, and 12 indicate normal behavior when answered 'Yes'.",
        "Algorithmic Direction Normalization: All responses converted to a risk vector (0 = Typical, 1 = At-Risk).",
        "Cumulative Score Calculation: Total score mapped from 0 to 20.",
        "Deterministic Clinical Tiers:",
        "  • 0 to 2 Points: Low Risk Indicator (Rescreen at 24 mos)",
        "  • 3 to 7 Points: Medium Risk Indicator (Follow-up interview)",
        "  • 8 to 20 Points: High Risk Indicator (Immediate referral)",
    ], border_color=COLOR_PRIMARY)

    add_card(s6, Inches(6.8), Inches(1.6), Inches(5.7), Inches(5.3), "Implementation Highlights", [
        "Built-in guard prevents clinician submission if any question is skipped.",
        "Responses stored permanently as JSONB in assessment_records table.",
        "Automatic generation of clinical PDF screening report with recommendations.",
        "Instant notification dispatched to parent dashboard upon clinician sign-off.",
        "Audit-compliant record immutability: diagnostic runs cannot be tampered with.",
    ], border_color=COLOR_ACCENT)

    # ==========================================================
    # SLIDE 7: Individualized Education Plan (IEP) Formulary
    # ==========================================================
    s7 = prs.slides.add_slide(blank_layout)
    add_header(s7, "Individualized Education & Therapy Plan (IEP) Management", "LONGITUDINAL INTERVENTION")

    add_card(s7, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.3), "IEP Formulation & Milestones", [
        "Diagnosis Summary & Sensory Profile: Specific triggers, calming techniques, and sensory diets.",
        "Modular Goal Setting: Clinicians create categorized goals across Speech, Occupational, and Behavioral therapy.",
        "Target Completion Dates & Review Cycles (e.g. 3-month or 6-month quarterly reviews).",
        "Milestone Status Tracking: Goals transition through 'In Progress', 'Mastered', and 'Maintenance'.",
        "Care Team Visibility: Teachers and parents can see active targets to reinforce behaviors in natural settings.",
    ])

    add_card(s7, Inches(6.8), Inches(1.6), Inches(5.7), Inches(5.3), "Therapy Encounter Logging", [
        "Therapists log encounters after each 45-60 minute clinical session.",
        "Session Duration, Activities Completed, and Qualitative Clinical Notes.",
        "Quantitative Progress Rating: 1.0 to 5.0 scale for mathematical trendline computation.",
        "Direct link between therapy session ratings and long-term IEP milestone completion.",
        "Automatic roll-up into monthly clinical progress reports.",
    ])

    # ==========================================================
    # SLIDE 8: Teacher Observation Matrix (5 Domains)
    # ==========================================================
    s8 = prs.slides.add_slide(blank_layout)
    add_header(s8, "Teacher Classroom Observation Matrix (5 Domains)", "SCHOOL-CLINIC INTEGRATION")

    add_card(s8, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.3), "The 5 Developmental Domains", [
        "1. Social Interaction & Peer Play: Sharing, cooperative games, eye contact during free play.",
        "2. Functional Communication: Verbal requests, non-verbal gestures, expressive vocabulary in class.",
        "3. Repetitive Behaviors & Stimming: Rocking, hand flapping, intense fixation on objects.",
        "4. Sensory Processing: Sensitivity to loud classroom bells, tactile defensiveness, seeking sensations.",
        "5. Attention & Task Transition: Ability to switch activities between reading circle and lunch.",
    ], border_color=COLOR_PRIMARY)

    add_card(s8, Inches(6.8), Inches(1.6), Inches(5.7), Inches(5.3), "Jargon-Free Educator Interface", [
        "Designed specifically for teachers without requiring clinical psychiatry background.",
        "Intuitive 1-5 Likert scale with descriptive anchors (e.g. 'Requires Full Prompting' to 'Independent').",
        "Activity Context tagging (e.g., 'Free Play', 'Math Group', 'Recess', 'Lunch').",
        "Submitting an observation immediately alerts the assigned therapist with fresh classroom data.",
        "Enables comparing clinic performance vs. real-world classroom generalization.",
    ], border_color=COLOR_EMERALD)

    # ==========================================================
    # SLIDE 9: Conflict-Free Multi-Clinician Scheduling
    # ==========================================================
    s9 = prs.slides.add_slide(blank_layout)
    add_header(s9, "Conflict-Free Multi-Clinician Appointment Scheduling", "OPERATIONAL ENGINE")

    add_card(s9, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.3), "Scheduling & Conflict Algorithm", [
        "Strict 0-Collision Policy: Eliminates clinical double-booking entirely.",
        "Interval Overlap Detection Query:",
        "  SELECT COUNT(*) FROM appointments",
        "  WHERE therapist_id = :id AND status != 'Cancelled'",
        "  AND (start_time < :requested_end AND end_time > :requested_start)",
        "Dynamic Slot Generation: Automatic rendering of 45-minute consultation slots.",
        "Real-time therapist schedule filtering by date and clinical specialty.",
    ])

    add_card(s9, Inches(6.8), Inches(1.6), Inches(5.7), Inches(5.3), "Multi-Channel Workflow", [
        "Receptionist Desk: Immediate booking during initial parent phone intake or walk-in.",
        "Parent Self-Service Portal: Parents select convenient available slots from home.",
        "Status Lifecycle: Requested -> Confirmed -> Completed / Cancelled / Rescheduled.",
        "Instant SMS / Push confirmation generated upon transaction commit.",
        "Automated calendar sync to prevent clinician no-shows.",
    ])

    # ==========================================================
    # SLIDE 10: Multi-Domain Progress & Radar Analytics
    # ==========================================================
    s10 = prs.slides.add_slide(blank_layout)
    add_header(s10, "Multi-Domain Longitudinal Progress & Radar Analytics", "CLINICAL INTELLIGENCE")

    add_card(s10, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.3), "Radar & Longitudinal Trendlines", [
        "Multi-Dimensional Radar Chart: Visualizes current competency across all 5 developmental axes simultaneously.",
        "Longitudinal Line Trends: Plots progress scores over 3, 6, and 12-month therapy intervals.",
        "Multi-Source Data Fusion: Merges clinician encounter ratings with teacher classroom observations.",
        "Objective Outcome Validation: Demonstrates measurable behavioral improvement for parents and pediatricians.",
        "Instant PDF Export: Generates professional multi-page clinical summary reports.",
    ])

    add_card(s10, Inches(6.8), Inches(1.6), Inches(5.7), Inches(5.3), "Clinical Value Delivered", [
        "Parent Empowerment: Replaces confusing clinical jargon with clear visual growth trajectories.",
        "Therapy Optimization: Identifies stalled domains early, prompting clinicians to adapt interventions.",
        "School IEP Meetings: Provides objective data for annual school district accommodation reviews.",
        "Pediatrician Updates: Easy-to-share digital documentation for developmental pediatricians.",
    ])

    # ==========================================================
    # SLIDE 11: Database Schema & Relational Design
    # ==========================================================
    s11 = prs.slides.add_slide(blank_layout)
    add_header(s11, "Relational Database Design & Schema Architecture", "DATA INTEGRITY")

    add_card(s11, Inches(0.8), Inches(1.6), Inches(3.6), Inches(5.3), "Core Identity & Registry", [
        "tbl_users: Handles RBAC, passwords, approval status.",
        "tbl_children: Patient demographics, child_code, age in months.",
        "Foreign Keys: Links children to primary parent, assigned therapist, and assigned teacher.",
        "Field-level profile immutability guards.",
    ])

    add_card(s11, Inches(4.8), Inches(1.6), Inches(3.6), Inches(5.3), "Assessments & Therapy", [
        "tbl_assessment_templates & questions: Standardized 20 M-CHAT items.",
        "tbl_assessment_records: Completed runs, total score, risk level, JSON responses.",
        "tbl_therapy_plans: Active IEP goals, sensory profile, target dates.",
        "tbl_therapy_sessions: Encounter logs, progress ratings (1.0-5.0).",
    ])

    add_card(s11, Inches(8.8), Inches(1.6), Inches(3.7), Inches(5.3), "Observations & Operations", [
        "tbl_teacher_observations: Classroom ratings JSON, context notes.",
        "tbl_appointments: Calendar booking, collision detection.",
        "tbl_progress_records: Synthesized domain summaries.",
        "tbl_notifications & messages: Real-time asynchronous alerts.",
    ])

    # ==========================================================
    # SLIDE 12: UML Collaboration (Communication) Model
    # ==========================================================
    s12 = prs.slides.add_slide(blank_layout)
    add_header(s12, "UML Collaboration (Communication) Architecture", "SOFTWARE ARCHITECTURE")

    add_card(s12, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.3), "Collaborating Objects & Links", [
        "ui:WebClient: Centralized Single Page Application facade.",
        "authSvc:AuthRBACService: Enforces JWT tokens & role permissions.",
        "registry:ChildRegistry: Ingests patient intake & assigns care team.",
        "scheduler:AptScheduler: Verifies availability & commits slots.",
        "screenEngine:AssessmentEngine: Calculates M-CHAT scores & risk.",
        "obsModule:ClassroomObsManager: Processes teacher matrices.",
        "notifSvc:NotificationService: Dispatches multi-channel alerts.",
        "db:PostgreSQL: ACID-compliant relational data store.",
    ])

    add_card(s12, Inches(6.8), Inches(1.6), Inches(5.7), Inches(5.3), "Numbered Message Execution Sequence", [
        "1.0: registerPediatricPatient() -> Receptionist to UI to DB",
        "2.0: bookAppointment() -> Collision check with PostgreSQL",
        "4.0: submitClassroomObservation() -> Teacher logs 5-domain matrix",
        "5.0: administerScreening() -> Automated reverse scoring (Q2, Q5, Q12)",
        "5.4: computeRiskTier() -> Evaluates Low / Medium / High tier",
        "6.0: createIEPPlan() -> Clinician publishes milestone goals",
        "6.3: notifyCareTeam() -> Synchronizes parent and teacher dashboards",
        "7.0: viewChildProgress() -> Parent views longitudinal radar charts",
    ])

    # ==========================================================
    # SLIDE 13: Automated Quality Assurance & Selenium Testing
    # ==========================================================
    s13 = prs.slides.add_slide(blank_layout)
    add_header(s13, "Automated Quality Assurance & Selenium Test Suite", "TESTING & VALIDATION")

    add_card(s13, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.3), "14 End-to-End Automated Test Cases", [
        "TC-01: Valid Clinician / Parent / Staff Authentication.",
        "TC-02: Clinician Approval Gate (Pending vs. Active).",
        "TC-03: Pediatric Patient Intake & Duplicate Validation.",
        "TC-04: M-CHAT-R/F Complete Screening Execution.",
        "TC-05: Reverse Scoring Engine Verification (Q2, Q5, Q12).",
        "TC-06: Incomplete Assessment Guard (Validation Blocks).",
        "TC-07: IEP Therapy Plan Formulation & Goal Creation.",
        "TC-08: Therapy Session Encounter Logging.",
    ])

    add_card(s13, Inches(6.8), Inches(1.6), Inches(5.7), Inches(5.3), "Advanced Integration & Edge Cases", [
        "TC-09: Teacher 5-Domain Classroom Matrix Submission.",
        "TC-10: Conflict-Free Appointment Booking & Collision Rejection.",
        "TC-11: Multi-Domain Radar Analytics Chart Rendering.",
        "TC-12: Clinical Report Synthesis & PDF Download.",
        "TC-13: Cross-Role Route Authorization Guards (403 Forbidden).",
        "TC-14: Mobile Responsive Navigation & Viewport Integrity.",
        "Framework: Selenium WebDriver + pytest + Chrome Headless.",
        "100% Pass Rate across all 14 integration test suites.",
    ])

    # ==========================================================
    # SLIDE 14: Responsive UI/UX & Mobile-First Engineering
    # ==========================================================
    s14 = prs.slides.add_slide(blank_layout)
    add_header(s14, "Mobile-First Responsive Engineering & Accessibility", "USER INTERFACE EXCELLENCE")

    add_card(s14, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.3), "Responsive UI Highlights", [
        "Universal Viewport Support: Perfectly adapted from 320px mobile up to 4K ultra-wide monitors.",
        "Zero Horizontal Scroll: Fluid CSS grid & flex layouts with dynamic card reflow.",
        "Adaptive Navigation: Seamless desktop sidebar transitioning into a smooth mobile slide-out drawer.",
        "Touch-Friendly Controls: 44px+ minimum tap targets for rapid clinic tablet use.",
        "High-Contrast Color Palette: Meets WCAG 2.1 AA accessibility standards.",
    ])

    add_card(s14, Inches(6.8), Inches(1.6), Inches(5.7), Inches(5.3), "Clinical UX Innovations", [
        "Micro-animations: Instant visual feedback on button taps, questionnaire selections, and score calculations.",
        "Color-Coded Risk Indicators: Green (Low Risk), Amber (Medium Risk), Rose Red (High Risk).",
        "Contextual Dialogs: Modal prompts for booking confirmations and clinical alerts.",
        "Offline-Resilient Forms: Prevents data loss during clinical assessment entry.",
    ])

    # ==========================================================
    # SLIDE 15: Live Deployment & Production Status
    # ==========================================================
    s15 = prs.slides.add_slide(blank_layout)
    add_header(s15, "Live Deployment Topology & Production Status", "DEPLOYMENT & DEMO")

    add_card(s15, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.3), "Production Cloud Architecture", [
        "Frontend Hosting: Vercel Edge Global CDN",
        "  • Production URL: https://neurospectra-two.vercel.app/",
        "  • Automated CI/CD deployment on git push to main branch.",
        "Backend API: Render Linux Cloud Container",
        "  • Endpoint: https://neurospectra-backend-m2vl.onrender.com/",
        "  • Gunicorn WSGI server running Python 3.11.",
        "Database Cloud: Supabase Cloud PostgreSQL 15",
        "  • Region: AWS Mumbai (ap-south-1) with transaction pooling.",
        "SSL/TLS 1.3: End-to-end encryption for all patient health data.",
    ])

    add_card(s15, Inches(6.8), Inches(1.6), Inches(5.7), Inches(5.3), "Live Demo Walkthrough Highlights", [
        "1. Receptionist logs in -> Registers new patient CH-001.",
        "2. Books 10:00 AM intake appointment without conflict.",
        "3. Teacher logs into classroom portal -> Submits 5-domain matrix.",
        "4. Therapist opens screening console -> Conducts 20-item M-CHAT.",
        "5. Algorithmic scoring instantly computes risk tier.",
        "6. Therapist creates IEP plan -> Milestone alerts sent to care team.",
        "7. Parent logs in -> Views live radar charts and download clinical PDF.",
    ])

    # ==========================================================
    # SLIDE 16: Conclusion & Future Scope
    # ==========================================================
    s16 = prs.slides.add_slide(blank_layout)
    add_header(s16, "Conclusion & Future Research Directions", "FINAL SUMMARY")

    add_card(s16, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.3), "Conclusion & Achievements", [
        "Built a complete, production-deployed multidisciplinary pediatric autism care platform.",
        "Automated the standardized M-CHAT-R/F protocol with reverse-scoring precision.",
        "Eliminated clinical data silos between therapists, school teachers, and parents.",
        "Prevented calendar booking conflicts through a deterministic scheduling engine.",
        "Validated with 14 automated Selenium test suites and 100% test pass rate.",
    ], border_color=COLOR_EMERALD)

    add_card(s16, Inches(6.8), Inches(1.6), Inches(5.7), Inches(5.3), "Future Research Directions", [
        "Computer Vision AI: Analyzing pediatric eye-gaze and joint attention videos for early screening biomarker detection.",
        "Speech Emotion Recognition: Acoustic analysis of vocal prosody during communication milestones.",
        "Wearable IoT Integration: Ingesting heart-rate variability and sensory overload biosignals.",
        "Multilingual NLP: Expanding questionnaires into regional languages (Hindi, Spanish, Arabic).",
        "HL7 / FHIR Interoperability: Direct synchronization with hospital Electronic Health Record (EHR) systems.",
    ], border_color=COLOR_PRIMARY)

    # Save presentation
    prs.save(output_path)
    print(f"Presentation successfully created at: {output_path}")
    return output_path


if __name__ == "__main__":
    out_file = sys.argv[1] if len(sys.argv) > 1 else "NEUROSPECTRA_Project_Presentation.pptx"
    create_neurospectra_presentation(out_file)
