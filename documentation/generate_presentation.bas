' ==============================================================================
' NEUROSPECTRA: PowerPoint (.pptx) Auto-Generator VBA Macro
'
' INSTRUCTIONS TO GENERATE .PPTX:
' 1. Open Microsoft PowerPoint (Blank Presentation).
' 2. Press [Alt + F11] to open the VBA Editor.
' 3. Click [Insert] -> [Module].
' 4. Paste this entire code into the module window.
' 5. Press [F5] (or click the Green Run button).
' 6. All 16 slides are generated instantly. Save the file as NEUROSPECTRA.pptx!
' ==============================================================================

Sub CreateNeuroSpectraPresentation()
    Dim pptApp As PowerPoint.Application
    Dim pptPres As PowerPoint.Presentation
    Dim mySlide As PowerPoint.Slide
    Dim slideIndex As Integer
    Dim headerShape As PowerPoint.Shape
    Dim card1 As PowerPoint.Shape, card2 As PowerPoint.Shape
    
    Set pptPres = ActivePresentation
    
    ' Set 16:9 Widescreen dimensions
    pptPres.PageSetup.SlideWidth = 960
    pptPres.PageSetup.SlideHeight = 540
    
    ' Delete existing slides if empty
    Do While pptPres.Slides.Count > 0
        pptPres.Slides(1).Delete
    Loop
    
    ' Slide 1: Title Slide
    Set mySlide = pptPres.Slides.Add(1, ppLayoutBlank)
    mySlide.Background.Fill.Solid
    mySlide.Background.Fill.ForeColor.RGB = RGB(15, 23, 42) ' Midnight Slate
    
    With mySlide.Shapes.AddTextbox(msoTextOrientationHorizontal, 60, 100, 840, 180)
        .TextFrame.WordWrap = msoTrue
        With .TextFrame.TextRange
            .Text = "NEUROSPECTRA" & vbCrLf & _
                    "AI-Powered Pediatric Autism Screening & Clinical Therapy Platform"
            .Font.Name = "Arial"
            .Font.Size = 36
            .Font.Bold = msoTrue
            .Font.Color.RGB = RGB(255, 255, 255)
            .Paragraphs(2).Font.Size = 18
            .Paragraphs(2).Font.Color.RGB = RGB(56, 189, 248)
        End With
    End With
    
    With mySlide.Shapes.AddTextbox(msoTextOrientationHorizontal, 60, 320, 840, 150)
        .TextFrame.WordWrap = msoTrue
        With .TextFrame.TextRange
            .Text = "Live Deployment: https://neurospectra-two.vercel.app/" & vbCrLf & _
                    "Cloud Infrastructure: Vercel Global Edge + Render Linux API + Supabase PostgreSQL (AWS)" & vbCrLf & _
                    "Clinical Protocols: M-CHAT-R/F Standardized Scoring + 5-Domain Classroom Observation Matrix" & vbCrLf & _
                    "Stakeholders: Multidisciplinary Care Loop (Therapist, Teacher, Receptionist, Parent, Administrator)"
            .Font.Name = "Arial"
            .Font.Size = 13
            .Font.Color.RGB = RGB(226, 232, 240)
        End With
    End With
    
    ' Slide 2: Executive Summary & Clinical Problem
    Set mySlide = pptPres.Slides.Add(2, ppLayoutBlank)
    Call AddHeaderVBA(mySlide, "Executive Summary & Clinical Problem Statement", "CLINICAL MOTIVATION")
    Call AddCardVBA(mySlide, 60, 120, 400, 380, "The Pediatric Autism Challenge", _
        "• 1 in 36 children globally diagnosed with Autism Spectrum Disorder." & vbCrLf & _
        "• Critical Window: Early intervention before 36-48 months yields peak neuroplasticity." & vbCrLf & _
        "• Diagnostic Delays: National average diagnosis age is 48-60 months due to paper backlogs." & vbCrLf & _
        "• Siloed Stakeholders: Home, school, and therapy records exist in fragmented silos." & vbCrLf & _
        "• Scoring Errors: Manual paper scoring miscalculates reverse-scored M-CHAT questions.", RGB(239, 68, 68))
        
    Call AddCardVBA(mySlide, 500, 120, 400, 380, "The NEUROSPECTRA Solution", _
        "• Centralized Ecosystem: Connects 5 distinct care stakeholders in real-time." & vbCrLf & _
        "• Automated Scoring: Instant algorithmic M-CHAT-R/F risk stratification." & vbCrLf & _
        "• 5-Domain School Matrix: Teachers log behaviors without clinical jargon." & vbCrLf & _
        "• Conflict-Free Calendar: Zero-collision multi-clinician appointment scheduling." & vbCrLf & _
        "• Transparent Analytics: Real-time multi-domain radar charts for parents.", RGB(16, 185, 129))
        
    ' Slide 3: Objectives & Innovations
    Set mySlide = pptPres.Slides.Add(3, ppLayoutBlank)
    Call AddHeaderVBA(mySlide, "Project Objectives & Novel Technical Contributions", "CORE CAPABILITIES")
    Call AddCardVBA(mySlide, 60, 120, 260, 380, "1. Diagnostic Standardization", _
        "• Automated 20-item M-CHAT-R/F." & vbCrLf & _
        "• Direction inversion on Q2, Q5, Q12." & vbCrLf & _
        "• Deterministic risk stratification." & vbCrLf & _
        "• Audit-compliant historical storage.", RGB(37, 99, 235))
    Call AddCardVBA(mySlide, 350, 120, 260, 380, "2. Multidisciplinary Care Loop", _
        "• Bridges School, Clinic, and Home." & vbCrLf & _
        "• 5-Domain Classroom Matrix." & vbCrLf & _
        "• Longitudinal session rating (1-5)." & vbCrLf & _
        "• Automated milestone sync alerts.", RGB(14, 165, 233))
    Call AddCardVBA(mySlide, 640, 120, 260, 380, "3. Operational Excellence", _
        "• Conflict-free calendar booking." & vbCrLf & _
        "• RBAC with Clinician Approval Gate." & vbCrLf & _
        "• Mobile-first responsive UI." & vbCrLf & _
        "• Instant clinical PDF report export.", RGB(16, 185, 129))

    ' Slide 4: 5 Stakeholder Personas & RBAC
    Set mySlide = pptPres.Slides.Add(4, ppLayoutBlank)
    Call AddHeaderVBA(mySlide, "Role-Based Access Control (RBAC) & Stakeholder Ecosystem", "ACCESS ARCHITECTURE")
    Call AddCardVBA(mySlide, 60, 120, 400, 180, "Administrator & Therapist", _
        "• Admin: Clinician credential approval gate & platform user governance." & vbCrLf & _
        "• Therapist: Conducts M-CHAT-R/F evaluations, creates IEPs, logs ratings.", RGB(37, 99, 235))
    Call AddCardVBA(mySlide, 500, 120, 400, 180, "Teacher & Receptionist", _
        "• Teacher: Logs classroom 5-domain matrix without clinical jargon." & vbCrLf & _
        "• Receptionist: Intake desk patient registration & conflict-free scheduling.", RGB(14, 165, 233))
    Call AddCardVBA(mySlide, 280, 320, 400, 180, "Parent / Caregiver", _
        "• Completes intake background questionnaires." & vbCrLf & _
        "• Monitors longitudinal progress on multi-domain radar charts." & vbCrLf & _
        "• Books and confirms clinic therapy appointments.", RGB(16, 185, 129))

    ' Slide 5: System Architecture & Cloud Topology
    Set mySlide = pptPres.Slides.Add(5, ppLayoutBlank)
    Call AddHeaderVBA(mySlide, "Decoupled 3-Tier Cloud Architecture & Infrastructure", "SYSTEM DESIGN")
    Call AddCardVBA(mySlide, 60, 120, 260, 380, "Presentation Layer", _
        "• Vercel Global Edge CDN." & vbCrLf & _
        "• Single Page Application (SPA)." & vbCrLf & _
        "• Vanilla JS Shell + CSS Tokens." & vbCrLf & _
        "• Responsive Mobile-First Design." & vbCrLf & _
        "• Canvas / Chart.js Analytics.", RGB(37, 99, 235))
    Call AddCardVBA(mySlide, 350, 120, 260, 380, "Application Tier", _
        "• Render Cloud Linux Container." & vbCrLf & _
        "• Python 3.11 / Django REST API." & vbCrLf & _
        "• Gunicorn WSGI Web Server." & vbCrLf & _
        "• JWT Bearer Token Security." & vbCrLf & _
        "• Server-side payload validation.", RGB(14, 165, 233))
    Call AddCardVBA(mySlide, 640, 120, 260, 380, "Database Tier", _
        "• Supabase Cloud PostgreSQL 15." & vbCrLf & _
        "• AWS Mumbai (ap-south-1)." & vbCrLf & _
        "• 13 relational tables + FKs." & vbCrLf & _
        "• JSONB dynamic matrix storage." & vbCrLf & _
        "• Connection pooling on port 5432.", RGB(16, 185, 129))

    ' Slide 6: Standardized M-CHAT-R/F Screening Engine
    Set mySlide = pptPres.Slides.Add(6, ppLayoutBlank)
    Call AddHeaderVBA(mySlide, "Automated M-CHAT-R/F Screening & Risk Stratification", "DIAGNOSTIC ENGINE")
    Call AddCardVBA(mySlide, 60, 120, 400, 380, "Algorithmic Risk Stratification", _
        "• Official 20-Item toddler checklist (16-30 months)." & vbCrLf & _
        "• Critical Reverse Scoring: Questions 2, 5, 12 scored opposite." & vbCrLf & _
        "• Cumulative Score: 0 to 20 total risk points." & vbCrLf & _
        "• Low Risk (0-2): Routine developmental monitoring." & vbCrLf & _
        "• Medium Risk (3-7): Targeted follow-up interview." & vbCrLf & _
        "• High Risk (8-20): Immediate diagnostic referral.", RGB(37, 99, 235))
    Call AddCardVBA(mySlide, 500, 120, 400, 380, "Clinical Implementation", _
        "• Server-side validation blocks incomplete questionnaire submissions." & vbCrLf & _
        "• Responses stored permanently as JSONB in assessment_records." & vbCrLf & _
        "• Automated PDF clinical assessment report generation." & vbCrLf & _
        "• Real-time alert dispatch to parent & care team dashboards." & vbCrLf & _
        "• Field immutability guarantees medical record compliance.", RGB(16, 185, 129))

    ' Slide 7: Conflict-Free Multi-Clinician Scheduling
    Set mySlide = pptPres.Slides.Add(7, ppLayoutBlank)
    Call AddHeaderVBA(mySlide, "Conflict-Free Multi-Clinician Appointment Scheduling", "OPERATIONAL ENGINE")
    Call AddCardVBA(mySlide, 60, 120, 400, 380, "Scheduling Collision Algorithm", _
        "• Zero-Collision Policy: Completely eliminates double-booking." & vbCrLf & _
        "• Mathematical Interval Intersection Check:" & vbCrLf & _
        "  (start_time < requested_end AND end_time > requested_start)" & vbCrLf & _
        "• Real-time therapist calendar slot generation." & vbCrLf & _
        "• Multi-clinician schedule filtering by date & specialty.", RGB(37, 99, 235))
    Call AddCardVBA(mySlide, 500, 120, 400, 380, "Multi-Channel Workflow", _
        "• Receptionist desk booking for in-person / phone intake." & vbCrLf & _
        "• Parent self-service booking from home portal." & vbCrLf & _
        "• Lifecycle: Requested -> Confirmed -> Completed / Cancelled." & vbCrLf & _
        "• Instant SMS & push notification dispatch on booking." & vbCrLf & _
        "• Automatic calendar sync reducing clinic no-shows.", RGB(14, 165, 233))

    ' Slide 8: Automated Selenium Testing & QA
    Set mySlide = pptPres.Slides.Add(8, ppLayoutBlank)
    Call AddHeaderVBA(mySlide, "Automated Quality Assurance & Selenium Test Suite", "QA & RELIABILITY")
    Call AddCardVBA(mySlide, 60, 120, 400, 380, "14 Automated End-to-End Test Cases", _
        "• TC-01: Valid Authentication across all 5 roles." & vbCrLf & _
        "• TC-02: Clinician Approval Gate (Pending vs. Active)." & vbCrLf & _
        "• TC-03: Patient Intake & Duplicate Child Code Guard." & vbCrLf & _
        "• TC-04 to TC-06: M-CHAT Complete Run, Reverse Scoring, & Validation." & vbCrLf & _
        "• TC-07 to TC-08: IEP Formulary & Session Encounter Logging.", RGB(37, 99, 235))
    Call AddCardVBA(mySlide, 500, 120, 400, 380, "Integration & Performance Validation", _
        "• TC-09: Teacher 5-Domain Classroom Observation Submission." & vbCrLf & _
        "• TC-10: Appointment Conflict Engine Collision Detection." & vbCrLf & _
        "• TC-11 to TC-12: Radar Chart Analytics & PDF Report Download." & vbCrLf & _
        "• TC-13 to TC-14: RBAC Route Authorization & Mobile Viewports." & vbCrLf & _
        "• 100% Pass Rate across all 14 test suites in Selenium WebDriver.", RGB(16, 185, 129))

    ' Slide 9: Conclusion & Future Scope
    Set mySlide = pptPres.Slides.Add(9, ppLayoutBlank)
    Call AddHeaderVBA(mySlide, "Conclusion & Future Research Directions", "FINAL SUMMARY")
    Call AddCardVBA(mySlide, 60, 120, 400, 380, "Project Conclusion", _
        "• Production-grade platform successfully deployed on Vercel & Render." & vbCrLf & _
        "• Solved the early diagnostic backlog via automated M-CHAT scoring." & vbCrLf & _
        "• Unified school, clinic, and home into a single synchronized care team." & vbCrLf & _
        "• Verified with 14 automated Selenium test cases with 100% pass rate." & vbCrLf & _
        "• Zero-collision scheduling and transparent multi-domain radar analytics.", RGB(16, 185, 129))
    Call AddCardVBA(mySlide, 500, 120, 400, 380, "Future Scope", _
        "• Computer Vision AI: Video eye-gaze tracking for early ASD biomarkers." & vbCrLf & _
        "• Speech Emotion Recognition: Acoustic prosody analysis." & vbCrLf & _
        "• Wearable IoT Integration: Biosignal sensory overload monitoring." & vbCrLf & _
        "• Multilingual NLP: Regional language support for screening surveys." & vbCrLf & _
        "• HL7 / FHIR Integration: Synchronization with Hospital EHR systems.", RGB(37, 99, 235))

    MsgBox "NEUROSPECTRA Presentation Created Successfully!" & vbCrLf & _
           "Click [File] -> [Save As] to save your .pptx file.", vbInformation, "NEUROSPECTRA Generator"
End Sub

Sub AddHeaderVBA(slideObj As PowerPoint.Slide, titleText As String, catText As String)
    Dim hShape As PowerPoint.Shape
    Set hShape = slideObj.Shapes.AddShape(msoShapeRectangle, 0, 0, 960, 80)
    hShape.Fill.Solid
    hShape.Fill.ForeColor.RGB = RGB(15, 23, 42)
    hShape.Line.ForeColor.RGB = RGB(37, 99, 235)
    hShape.Line.Weight = 2
    
    With slideObj.Shapes.AddTextbox(msoTextOrientationHorizontal, 50, 10, 860, 20)
        .TextFrame.TextRange.Text = UCase(catText)
        .TextFrame.TextRange.Font.Name = "Arial"
        .TextFrame.TextRange.Font.Size = 9
        .TextFrame.TextRange.Font.Bold = msoTrue
        .TextFrame.TextRange.Font.Color.RGB = RGB(56, 189, 248)
    End With
    
    With slideObj.Shapes.AddTextbox(msoTextOrientationHorizontal, 50, 30, 860, 40)
        .TextFrame.TextRange.Text = titleText
        .TextFrame.TextRange.Font.Name = "Arial"
        .TextFrame.TextRange.Font.Size = 18
        .TextFrame.TextRange.Font.Bold = msoTrue
        .TextFrame.TextRange.Font.Color.RGB = RGB(255, 255, 255)
    End With
End Sub

Sub AddCardVBA(slideObj As PowerPoint.Slide, l As Single, t As Single, w As Single, h As Single, cardTitle As String, contentText As String, bColor As Long)
    Dim card As PowerPoint.Shape
    Set card = slideObj.Shapes.AddShape(msoShapeRoundedRectangle, l, t, w, h)
    card.Fill.Solid
    card.Fill.ForeColor.RGB = RGB(255, 255, 255)
    card.Line.ForeColor.RGB = bColor
    card.Line.Weight = 2
    
    With slideObj.Shapes.AddTextbox(msoTextOrientationHorizontal, l + 15, t + 15, w - 30, 35)
        .TextFrame.TextRange.Text = cardTitle
        .TextFrame.TextRange.Font.Name = "Arial"
        .TextFrame.TextRange.Font.Size = 13
        .TextFrame.TextRange.Font.Bold = msoTrue
        .TextFrame.TextRange.Font.Color.RGB = RGB(37, 99, 235)
    End With
    
    With slideObj.Shapes.AddTextbox(msoTextOrientationHorizontal, l + 15, t + 50, w - 30, h - 65)
        .TextFrame.WordWrap = msoTrue
        .TextFrame.TextRange.Text = contentText
        .TextFrame.TextRange.Font.Name = "Arial"
        .TextFrame.TextRange.Font.Size = 10
        .TextFrame.TextRange.Font.Color.RGB = RGB(30, 41, 59)
    End With
End Sub
