"""
NEUROSPECTRA — Simple 8-Slide Panel Presentation (.pptx) Generator
Generates a concise, high-impact presentation deck for panel evaluation / viva.
Usage:
    pip install python-pptx
    python generate_simple_presentation.py
Output:
    NEUROSPECTRA_Panel_Presentation.pptx
"""

import sys

try:
    from pptx import Presentation
    from pptx.util import Inches, Pt
    from pptx.enum.text import PP_ALIGN
    from pptx.dml.color import RGBColor
    from pptx.enum.shapes import MSO_SHAPE
except ImportError:
    print("python-pptx is not installed. Run: pip install python-pptx")
    sys.exit(1)


def create_simple_presentation(output_path="NEUROSPECTRA_Panel_Presentation.pptx"):
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    COLOR_DARK = RGBColor(15, 23, 42)       # Midnight Slate (#0f172a)
    COLOR_BLUE = RGBColor(37, 99, 235)      # Medical Blue (#2563eb)
    COLOR_SKY = RGBColor(14, 165, 233)      # Sky Accent (#0ea5e9)
    COLOR_CARD = RGBColor(255, 255, 255)    # Card White
    COLOR_BORDER = RGBColor(226, 232, 240)  # Border Light Slate
    COLOR_TEXT = RGBColor(30, 41, 59)       # Main Text
    COLOR_WHITE = RGBColor(255, 255, 255)
    COLOR_GREEN = RGBColor(16, 185, 129)    # Emerald (#10b981)
    COLOR_RED = RGBColor(239, 68, 68)       # Red (#ef4444)

    blank_layout = prs.slide_layouts[6]

    def add_header(slide, title, category="PANEL PRESENTATION"):
        header = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(1.15))
        header.fill.solid()
        header.fill.fore_color.rgb = COLOR_DARK
        header.line.color.rgb = COLOR_BLUE
        header.line.width = Pt(1.5)

        tb = slide.shapes.add_textbox(Inches(0.8), Inches(0.12), Inches(11.5), Inches(0.3))
        p_cat = tb.text_frame.paragraphs[0]
        p_cat.text = category.upper()
        p_cat.font.size = Pt(10)
        p_cat.font.bold = True
        p_cat.font.color.rgb = COLOR_SKY

        tb2 = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.5), Inches(0.65))
        p_title = tb2.text_frame.paragraphs[0]
        p_title.text = title
        p_title.font.size = Pt(22)
        p_title.font.bold = True
        p_title.font.color.rgb = COLOR_WHITE

    def add_card(slide, left, top, width, height, title, items, border_color=COLOR_BORDER):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_CARD
        card.line.color.rgb = border_color
        card.line.width = Pt(1.5)

        tb = slide.shapes.add_textbox(left + Inches(0.25), top + Inches(0.2), width - Inches(0.5), Inches(0.45))
        p = tb.text_frame.paragraphs[0]
        p.text = title
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = COLOR_BLUE

        content_box = slide.shapes.add_textbox(left + Inches(0.25), top + Inches(0.65), width - Inches(0.5), height - Inches(0.8))
        ctf = content_box.text_frame
        ctf.word_wrap = True

        for i, item in enumerate(items):
            p_item = ctf.add_paragraph() if i > 0 else ctf.paragraphs[0]
            p_item.text = f"• {item}"
            p_item.font.size = Pt(13)
            p_item.font.color.rgb = COLOR_TEXT
            p_item.space_after = Pt(7)

        return card

    # ==========================================================
    # SLIDE 1: Title Slide
    # ==========================================================
    s1 = prs.slides.add_slide(blank_layout)
    bg1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = COLOR_DARK
    bg1.line.fill.background()

    pill = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.2), Inches(1.2), Inches(3.8), Inches(0.45))
    pill.fill.solid()
    pill.fill.fore_color.rgb = COLOR_BLUE
    pill.line.fill.background()
    ptf = pill.text_frame
    ptf.paragraphs[0].text = "ACADEMIC PROJECT DEFENSE"
    ptf.paragraphs[0].alignment = PP_ALIGN.CENTER
    ptf.paragraphs[0].font.size = Pt(11)
    ptf.paragraphs[0].font.bold = True
    ptf.paragraphs[0].font.color.rgb = COLOR_WHITE

    tbox = s1.shapes.add_textbox(Inches(1.2), Inches(1.8), Inches(11.0), Inches(2.0))
    ttf = tbox.text_frame
    ttf.word_wrap = True
    p1 = ttf.paragraphs[0]
    p1.text = "NEUROSPECTRA"
    p1.font.size = Pt(46)
    p1.font.bold = True
    p1.font.color.rgb = COLOR_WHITE

    p2 = ttf.add_paragraph()
    p2.text = "AI-Powered Pediatric Autism Screening & Multidisciplinary Therapy Platform"
    p2.font.size = Pt(20)
    p2.font.color.rgb = COLOR_SKY
    p2.space_before = Pt(6)

    infobox = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.2), Inches(4.3), Inches(11.0), Inches(2.2))
    infobox.fill.solid()
    infobox.fill.fore_color.rgb = RGBColor(30, 41, 59)
    infobox.line.color.rgb = COLOR_BLUE
    itf = infobox.text_frame
    itf.word_wrap = True

    meta = [
        ("Live Web Application", "https://neurospectra-two.vercel.app/"),
        ("Backend REST API", "https://neurospectra-backend-m2vl.onrender.com/"),
        ("Key Stakeholders", "5 Personas: Therapist, Teacher, Receptionist, Parent, Administrator"),
        ("Core Standards", "Official 20-Item M-CHAT-R/F + 5-Domain Classroom Matrix + Conflict-Free Scheduling"),
    ]
    for idx, (label, val) in enumerate(meta):
        p = itf.add_paragraph() if idx > 0 else itf.paragraphs[0]
        p.text = f"{label}: {val}"
        p.font.size = Pt(13)
        p.font.color.rgb = COLOR_WHITE if idx % 2 == 0 else COLOR_SKY
        p.space_after = Pt(6)

    s1.notes_slide.notes_text_frame.text = "Introduce the project name, live deployed URL, and core domain: Pediatric Autism Spectrum Disorder care."

    # ==========================================================
    # SLIDE 2: Problem Statement & Existing Drawbacks
    # ==========================================================
    s2 = prs.slides.add_slide(blank_layout)
    add_header(s2, "Problem Statement & Clinical Motivation", "PROJECT BACKGROUND")

    add_card(s2, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.3), "Existing System Bottlenecks", [
        "Delayed Diagnosis: Average diagnosis occurs at 48-60 months, missing peak neuroplasticity (<36 months).",
        "Manual Paper Scoring: M-CHAT questionnaires scored on paper often miscalculate critical reverse-scored questions.",
        "Disconnected Silos: School observations, clinic therapy notes, and home routines exist in separate silos.",
        "Scheduling Conflicts: Clinic calendars suffer from room collisions and therapist double-booking.",
        "Lack of Transparency: Parents cannot visualize objective progress trends across developmental domains.",
    ], border_color=COLOR_RED)

    add_card(s2, Inches(6.8), Inches(1.6), Inches(5.7), Inches(5.3), "The NEUROSPECTRA Solution", [
        "Automated Clinical Screening: Instant M-CHAT-R/F scoring with direction inversion on reverse items.",
        "School-Clinic Bridge: Jargon-free 5-domain matrix for classroom teachers to log daily behaviors.",
        "Conflict-Free Booking: Strict 0-collision mathematical scheduling engine.",
        "Individualized Education Plans (IEP): Structured milestone tracking and encounter ratings (1.0 to 5.0).",
        "Visual Radar Analytics: Real-time multi-domain radar charts empowering parents with objective data.",
    ], border_color=COLOR_GREEN)

    # ==========================================================
    # SLIDE 3: System Objectives & Stakeholder Personas
    # ==========================================================
    s3 = prs.slides.add_slide(blank_layout)
    add_header(s3, "System Objectives & 5 Stakeholder Personas", "RBAC & USER ROLES")

    roles = [
        ("Administrator", [
            "Clinician credential verification & approval gate.",
            "Platform user governance & audit logging.",
        ], Inches(0.8), Inches(1.6), Inches(5.6), Inches(2.4)),
        ("Behavioral Therapist", [
            "Administers standardized M-CHAT-R/F screenings.",
            "Formulates dynamic IEPs & logs session ratings.",
        ], Inches(6.8), Inches(1.6), Inches(5.7), Inches(2.4)),
        ("School Teacher", [
            "Logs 5-domain classroom observation matrix.",
            "Captures behavioral triggers without clinical jargon.",
        ], Inches(0.8), Inches(4.3), Inches(3.6), Inches(2.6)),
        ("Clinic Receptionist", [
            "Registers pediatric patient profiles.",
            "Schedules conflict-free appointments.",
        ], Inches(4.8), Inches(4.3), Inches(3.6), Inches(2.6)),
        ("Parent / Caregiver", [
            "Monitors progress on radar charts.",
            "Books & confirms clinic therapy sessions.",
        ], Inches(8.8), Inches(4.3), Inches(3.7), Inches(2.6)),
    ]
    for title, items, l, t, w, h in roles:
        add_card(s3, l, t, w, h, title, items)

    # ==========================================================
    # SLIDE 4: Main Components / Core Modules
    # ==========================================================
    s4 = prs.slides.add_slide(blank_layout)
    add_header(s4, "Core Functional Modules (Main Components)", "PLATFORM CAPABILITIES")

    add_card(s4, Inches(0.8), Inches(1.6), Inches(5.6), Inches(2.4), "1. M-CHAT-R/F Screening Engine", [
        "20 standardized questions for toddlers aged 16-30 months.",
        "Automatic direction inversion for reverse-scored items (Q2, Q5, Q12).",
        "Deterministic Risk Tiers: Low (0-2), Medium (3-7), High (8-20).",
    ])

    add_card(s4, Inches(6.8), Inches(1.6), Inches(5.7), Inches(2.4), "2. Teacher 5-Domain Matrix", [
        "Captures Social, Communication, Stimming, Sensory, and Focus.",
        "Intuitive 1-5 Likert scale with descriptive classroom anchors.",
        "Instantly alerts assigned therapist with real-world school baseline.",
    ])

    add_card(s4, Inches(0.8), Inches(4.3), Inches(5.6), Inches(2.6), "3. Conflict-Free Scheduler", [
        "Strict 0-collision validation via mathematical interval overlap check.",
        "Prevents clinical double-booking across therapists and rooms.",
        "Instant SMS / Push confirmation dispatch on booking.",
    ])

    add_card(s4, Inches(6.8), Inches(4.3), Inches(5.7), Inches(2.6), "4. IEP & Radar Analytics", [
        "Modular IEP goals with milestone targets across Speech, OT, Behavior.",
        "Encounter logging with quantitative progress ratings (1.0 to 5.0).",
        "Multi-domain radar charts and automatic clinical PDF report export.",
    ])

    # ==========================================================
    # SLIDE 5: System Architecture & Technology Stack
    # ==========================================================
    s5 = prs.slides.add_slide(blank_layout)
    add_header(s5, "System Architecture & Technology Stack", "TECHNICAL DESIGN")

    add_card(s5, Inches(0.8), Inches(1.6), Inches(3.6), Inches(5.3), "Frontend Client Layer", [
        "Technology: HTML5, CSS Tokens, Vanilla JS Clinical Shell.",
        "Responsive: Mobile-first design (320px to 4K ultra-wide).",
        "Data Visualization: Canvas & Chart.js dynamic radar/trendlines.",
        "Zero horizontal scrolling on mobile & tablet viewports.",
        "Hosting: Vercel Global Edge Network.",
    ])

    add_card(s5, Inches(4.8), Inches(1.6), Inches(3.6), Inches(5.3), "Backend API Gateway", [
        "Technology: Python 3.11 / Django REST Framework.",
        "Application Server: Gunicorn WSGI runtime.",
        "Security: Stateless JWT Bearer Token Authentication.",
        "Role Guards: Field-level immutability and clinician approval gate.",
        "Hosting: Render Linux Cloud Container (Oregon, USA).",
    ])

    add_card(s5, Inches(8.8), Inches(1.6), Inches(3.7), Inches(5.3), "Persistence & Database", [
        "Database Engine: Managed PostgreSQL 15.",
        "Hosting: Supabase Cloud (AWS Mumbai ap-south-1).",
        "Connection Pooling: Transaction pooler on port 5432.",
        "Data Model: 13 relational tables with cascading foreign keys.",
        "Semi-structured Storage: JSONB for dynamic matrix ratings.",
    ])

    # ==========================================================
    # SLIDE 6: Workflow & Data Flow (Collaboration)
    # ==========================================================
    s6 = prs.slides.add_slide(blank_layout)
    add_header(s6, "Workflow & Chronological Data Flow", "SYSTEM COLLABORATION")

    add_card(s6, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.3), "Step-by-Step Clinical Flow", [
        "Step 1 (Intake): Receptionist registers pediatric patient (CH-001) and assigns therapist & teacher.",
        "Step 2 (Booking): Collision-free appointment booked with clinician.",
        "Step 3 (School Baseline): Teacher logs 5-domain matrix from classroom.",
        "Step 4 (Clinical Screening): Therapist administers 20-item M-CHAT-R/F.",
        "Step 5 (Scoring): Algorithm auto-inverts Q2/Q5/Q12 and computes Risk Tier.",
        "Step 6 (IEP Formulation): Clinician creates therapy plan & milestone goals.",
        "Step 7 (Progress Review): Parent views live multi-domain radar chart.",
    ], border_color=COLOR_BLUE)

    add_card(s6, Inches(6.8), Inches(1.6), Inches(5.7), Inches(5.3), "Key Architectural Safeguards", [
        "Zero-Collision Guarantee: Interval overlap check eliminates scheduling errors.",
        "Reverse-Scoring Precision: Algorithmic scoring eliminates human calculation bias.",
        "Credentialing Approval Gate: Clinicians must be approved by Admin before accessing patient records.",
        "Medical Immutability: Completed screening runs cannot be altered post-submission.",
        "Instant Asynchronous Alerts: Automated notifications synchronize care stakeholders in real-time.",
    ], border_color=COLOR_GREEN)

    # ==========================================================
    # SLIDE 7: Quality Assurance, Testing & Deployment
    # ==========================================================
    s7 = prs.slides.add_slide(blank_layout)
    add_header(s7, "Automated Testing & Live Cloud Deployment", "VERIFICATION & VALIDATION")

    add_card(s7, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.3), "Automated Selenium Test Suite", [
        "Test Framework: Selenium WebDriver + pytest + Chrome Headless.",
        "14 End-to-End Test Scenarios:",
        "  • TC-01: Multi-role authentication & session persistence.",
        "  • TC-02: Clinician Approval Gate (Pending vs. Active).",
        "  • TC-03: Patient intake & duplicate ID prevention.",
        "  • TC-04 to TC-06: M-CHAT screening & reverse scoring logic.",
        "  • TC-07 to TC-08: IEP creation & therapy session logging.",
        "  • TC-09 to TC-10: Teacher matrix & appointment conflict engine.",
        "  • TC-11 to TC-14: Radar charts, PDF export, RBAC, & mobile UI.",
        "Results: 100% Pass Rate across all 14 integration test suites.",
    ])

    add_card(s7, Inches(6.8), Inches(1.6), Inches(5.7), Inches(5.3), "Live Production Status", [
        "Frontend Live: https://neurospectra-two.vercel.app/",
        "Backend Live: https://neurospectra-backend-m2vl.onrender.com/",
        "Database Cloud: Supabase Managed PostgreSQL (AWS Mumbai).",
        "Continuous Deployment: Automated CI/CD on git push to main branch.",
        "Security Standards: HTTPS / TLS 1.3 encryption across all tiers.",
        "Demonstrated Live: Ready for live demonstration to the evaluation panel.",
    ])

    # ==========================================================
    # SLIDE 8: Conclusion & Key Takeaways
    # ==========================================================
    s8 = prs.slides.add_slide(blank_layout)
    add_header(s8, "Conclusion & Key Takeaways", "SUMMARY & IMPACT")

    add_card(s8, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.3), "Key Achievements", [
        "Clinical Standardization: Successfully automated the M-CHAT-R/F protocol with reverse-scoring precision.",
        "Multidisciplinary Bridge: Eliminated data silos between clinic, classroom, and home.",
        "Operational Efficiency: Eliminated appointment double-booking with 0-collision scheduling.",
        "Objective Progress Tracking: Real-time radar analytics empower parents and clinicians.",
        "Production-Grade: Deployed live on Vercel, Render, and Supabase PostgreSQL.",
    ], border_color=COLOR_GREEN)

    add_card(s8, Inches(6.8), Inches(1.6), Inches(5.7), Inches(5.3), "Future Enhancements", [
        "Computer Vision AI: Video eye-gaze and joint attention tracking for early biomarker detection.",
        "Speech Emotion Recognition: Acoustic prosody analysis during communication sessions.",
        "Wearable IoT Biosignals: Real-time sensory overload and heart-rate variability monitoring.",
        "Regional Language Support: Multilingual screening questionnaires.",
        "Hospital EHR Integration: HL7 / FHIR data exchange with pediatric hospital systems.",
    ], border_color=COLOR_BLUE)

    prs.save(output_path)
    print(f"Simple Panel Presentation created at: {output_path}")
    return output_path


if __name__ == "__main__":
    out_file = sys.argv[1] if len(sys.argv) > 1 else "NEUROSPECTRA_Panel_Presentation.pptx"
    create_simple_presentation(out_file)
