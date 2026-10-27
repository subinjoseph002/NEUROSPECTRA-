' ==============================================================================
' NEUROSPECTRA: Simple 8-Slide Panel Presentation (.pptx) Auto-Generator
'
' INSTRUCTIONS:
' 1. Open Microsoft PowerPoint (Blank Presentation).
' 2. Press [Alt + F11] to open the VBA Editor.
' 3. Click [Insert] -> [Module].
' 4. Paste this code and press [F5] (Run).
' 5. Click [File] -> [Save As] -> Save as NEUROSPECTRA_Panel_Presentation.pptx!
' ==============================================================================

Sub CreateSimplePanelPresentation()
    Dim pres As PowerPoint.Presentation
    Dim s As PowerPoint.Slide
    
    Set pres = ActivePresentation
    pres.PageSetup.SlideWidth = 960
    pres.PageSetup.SlideHeight = 540
    
    Do While pres.Slides.Count > 0
        pres.Slides(1).Delete
    Loop
    
    ' Slide 1: Title
    Set s = pres.Slides.Add(1, ppLayoutBlank)
    s.Background.Fill.Solid
    s.Background.Fill.ForeColor.RGB = RGB(15, 23, 42)
    
    With s.Shapes.AddTextbox(msoTextOrientationHorizontal, 60, 120, 840, 160)
        .TextFrame.WordWrap = msoTrue
        With .TextFrame.TextRange
            .Text = "NEUROSPECTRA" & vbCrLf & "AI-Powered Pediatric Autism Screening & Multidisciplinary Therapy Platform"
            .Font.Name = "Arial"
            .Font.Size = 36
            .Font.Bold = msoTrue
            .Font.Color.RGB = RGB(255, 255, 255)
            .Paragraphs(2).Font.Size = 18
            .Paragraphs(2).Font.Color.RGB = RGB(56, 189, 248)
        End With
    End With
    
    With s.Shapes.AddTextbox(msoTextOrientationHorizontal, 60, 320, 840, 140)
        .TextFrame.WordWrap = msoTrue
        With .TextFrame.TextRange
            .Text = "Live Web App: https://neurospectra-two.vercel.app/" & vbCrLf & _
                    "Backend API: https://neurospectra-backend-m2vl.onrender.com/" & vbCrLf & _
                    "Architecture: Vercel Global Edge + Render Linux API + Supabase PostgreSQL (AWS Mumbai)" & vbCrLf & _
                    "Evaluation: Project Defense / Panel Presentation"
            .Font.Name = "Arial"
            .Font.Size = 13
            .Font.Color.RGB = RGB(226, 232, 240)
        End With
    End With
    
    ' Slide 2: Problem Statement & Solution
    Set s = pres.Slides.Add(2, ppLayoutBlank)
    Call AddSimpleHeader(s, "Problem Statement & Proposed Solution", "PROJECT BACKGROUND")
    Call AddSimpleCard(s, 60, 120, 400, 380, "Existing System Bottlenecks", _
        "• Delayed Diagnosis: Average diagnosis age is 48-60 months, missing peak neuroplastic window (<36 months)." & vbCrLf & _
        "• Manual Paper Scoring: Scoring errors on critical reverse-scored M-CHAT items." & vbCrLf & _
        "• Disconnected Silos: School, clinic, and home records remain separated." & vbCrLf & _
        "• Scheduling Conflicts: Double-booking and clinic calendar collisions." & vbCrLf & _
        "• Lack of Transparency: Parents cannot track quantitative developmental growth.", RGB(239, 68, 68))
        
    Call AddSimpleCard(s, 500, 120, 400, 380, "The NEUROSPECTRA Solution", _
        "• Automated Screening: Algorithmic M-CHAT-R/F scoring with reverse item inversion." & vbCrLf & _
        "• School-Clinic Bridge: Jargon-free 5-domain matrix for classroom teachers." & vbCrLf & _
        "• 0-Collision Scheduler: Mathematical interval overlap detection." & vbCrLf & _
        "• Structured IEP Formulary: Milestone goal roadmaps and 1-5 encounter ratings." & vbCrLf & _
        "• Visual Radar Analytics: Real-time multi-domain radar charts for parents.", RGB(16, 185, 129))
        
    ' Slide 3: Stakeholders & Roles
    Set s = pres.Slides.Add(3, ppLayoutBlank)
    Call AddSimpleHeader(s, "System Objectives & 5 Stakeholder Personas", "RBAC & ACCESS")
    Call AddSimpleCard(s, 60, 120, 400, 180, "Administrator & Therapist", _
        "• Admin: Clinician credential approval gate & platform user management." & vbCrLf & _
        "• Therapist: Administers M-CHAT screening, creates IEP plans, logs ratings.", RGB(37, 99, 235))
    Call AddSimpleCard(s, 500, 120, 400, 180, "Teacher & Receptionist", _
        "• Teacher: Logs classroom 5-domain matrix without clinical jargon." & vbCrLf & _
        "• Receptionist: Intake desk patient registration & conflict-free scheduling.", RGB(14, 165, 233))
    Call AddSimpleCard(s, 280, 320, 400, 180, "Parent / Caregiver", _
        "• Completes developmental intake surveys." & vbCrLf & _
        "• Visualizes longitudinal progress on multi-domain radar charts." & vbCrLf & _
        "• Books and confirms clinic therapy appointments.", RGB(16, 185, 129))

    ' Slide 4: Core Functional Modules
    Set s = pres.Slides.Add(4, ppLayoutBlank)
    Call AddSimpleHeader(s, "Core Functional Modules (Main Components)", "PLATFORM CAPABILITIES")
    Call AddSimpleCard(s, 60, 120, 400, 180, "1. M-CHAT-R/F Screening Engine", _
        "• 20 standardized questions for toddlers 16-30 months." & vbCrLf & _
        "• Auto reverse-scoring for Q2, Q5, Q12." & vbCrLf & _
        "• Risk Tiers: Low (0-2), Medium (3-7), High (8-20).", RGB(37, 99, 235))
    Call AddSimpleCard(s, 500, 120, 400, 180, "2. Teacher 5-Domain Matrix", _
        "• Social, Communication, Stimming, Sensory, Focus." & vbCrLf & _
        "• 1-5 Likert scale with descriptive classroom anchors." & vbCrLf & _
        "• Instantly alerts assigned clinician with school baseline.", RGB(14, 165, 233))
    Call AddSimpleCard(s, 60, 320, 400, 180, "3. Conflict-Free Scheduler", _
        "• Strict 0-collision validation via interval overlap query." & vbCrLf & _
        "• Eliminates double-booking across rooms and specialists." & vbCrLf & _
        "• Instant SMS & push notification dispatch.", RGB(16, 185, 129))
    Call AddSimpleCard(s, 500, 320, 400, 180, "4. IEP & Radar Analytics", _
        "• Dynamic milestone goals across Speech, OT, Behavior." & vbCrLf & _
        "• Session encounter ratings on 1.0 to 5.0 scale." & vbCrLf & _
        "• Real-time radar charts & clinical PDF report export.", RGB(245, 158, 11))

    ' Slide 5: System Architecture & Tech Stack
    Set s = pres.Slides.Add(5, ppLayoutBlank)
    Call AddSimpleHeader(s, "System Architecture & Technology Stack", "TECHNICAL DESIGN")
    Call AddSimpleCard(s, 60, 120, 260, 380, "Presentation Layer", _
        "• Vercel Global Edge CDN." & vbCrLf & _
        "• Single Page App (SPA)." & vbCrLf & _
        "• HTML5 / CSS Tokens / Vanilla JS." & vbCrLf & _
        "• Responsive (320px to 4K)." & vbCrLf & _
        "• Canvas & Chart.js Analytics.", RGB(37, 99, 235))
    Call AddSimpleCard(s, 350, 120, 260, 380, "Application Tier", _
        "• Render Cloud Linux Container." & vbCrLf & _
        "• Python 3.11 / Django REST API." & vbCrLf & _
        "• Gunicorn WSGI Web Server." & vbCrLf & _
        "• JWT Bearer Token Security." & vbCrLf & _
        "• Clinician approval gate.", RGB(14, 165, 233))
    Call AddSimpleCard(s, 640, 120, 260, 380, "Database Tier", _
        "• Supabase Cloud PostgreSQL 15." & vbCrLf & _
        "• AWS Mumbai (ap-south-1)." & vbCrLf & _
        "• 13 relational tables + FKs." & vbCrLf & _
        "• JSONB dynamic rating storage." & vbCrLf & _
        "• Transaction connection pooler.", RGB(16, 185, 129))

    ' Slide 6: System Collaboration & Data Flow
    Set s = pres.Slides.Add(6, ppLayoutBlank)
    Call AddSimpleHeader(s, "System Workflow & Chronological Data Flow", "COLLABORATION")
    Call AddSimpleCard(s, 60, 120, 400, 380, "Clinical Workflow Steps", _
        "1. Intake: Receptionist registers child (CH-001) & assigns staff." & vbCrLf & _
        "2. Booking: Conflict-free appointment scheduled." & vbCrLf & _
        "3. School Baseline: Teacher logs 5-domain classroom matrix." & vbCrLf & _
        "4. Screening: Therapist conducts 20-item M-CHAT-R/F." & vbCrLf & _
        "5. Scoring: Algorithm auto-scores & computes Risk Tier." & vbCrLf & _
        "6. IEP Plan: Clinician formulates milestone targets." & vbCrLf & _
        "7. Review: Parent views live radar charts and trends.", RGB(37, 99, 235))
    Call AddSimpleCard(s, 500, 120, 400, 380, "Key Technical Safeguards", _
        "• 0-Collision Constraint: Strict calendar overlap prevention." & vbCrLf & _
        "• Reverse-Scoring Accuracy: Deterministic direction inversion." & vbCrLf & _
        "• Clinician Gate: Admin approves credentials before access." & vbCrLf & _
        "• Medical Immutability: Assessment records cannot be edited." & vbCrLf & _
        "• Instant Alerts: Multi-stakeholder synchronization.", RGB(16, 185, 129))

    ' Slide 7: Testing & Live Deployment
    Set s = pres.Slides.Add(7, ppLayoutBlank)
    Call AddSimpleHeader(s, "Automated Testing & Live Deployment", "QA & DEPLOYMENT")
    Call AddSimpleCard(s, 60, 120, 400, 380, "Automated Selenium Test Suite", _
        "• Framework: Selenium WebDriver + pytest + Chrome Headless." & vbCrLf & _
        "• 14 End-to-End Test Scenarios:" & vbCrLf & _
        "  - Multi-role login & RBAC route authorization." & vbCrLf & _
        "  - Patient intake & duplicate ID prevention." & vbCrLf & _
        "  - M-CHAT-R/F complete screening & reverse scoring." & vbCrLf & _
        "  - Teacher 5-domain matrix & IEP goal formulation." & vbCrLf & _
        "  - Appointment conflict rejection & radar chart rendering." & vbCrLf & _
        "• Result: 100% Pass Rate across all 14 test suites.", RGB(37, 99, 235))
    Call AddSimpleCard(s, 500, 120, 400, 380, "Live Production Status", _
        "• Frontend URL: https://neurospectra-two.vercel.app/" & vbCrLf & _
        "• Backend API: https://neurospectra-backend-m2vl.onrender.com/" & vbCrLf & _
        "• Cloud Database: Supabase PostgreSQL (AWS Mumbai)." & vbCrLf & _
        "• CI/CD Pipeline: Automated deployment on git push to main." & vbCrLf & _
        "• Security: End-to-end TLS 1.3 encryption." & vbCrLf & _
        "• Status: 100% Live & Ready for Panel Evaluation.", RGB(16, 185, 129))

    ' Slide 8: Conclusion & Key Takeaways
    Set s = pres.Slides.Add(8, ppLayoutBlank)
    Call AddSimpleHeader(s, "Conclusion & Key Takeaways", "SUMMARY")
    Call AddSimpleCard(s, 60, 120, 400, 380, "Project Achievements", _
        "• Automated standard M-CHAT-R/F with reverse-scoring precision." & vbCrLf & _
        "• Unified school, clinic, and home into a single care ecosystem." & vbCrLf & _
        "• Eliminated appointment double-booking with 0-collision scheduling." & vbCrLf & _
        "• Transparent multi-domain radar analytics for parents." & vbCrLf & _
        "• Production-grade platform verified with 14 automated test suites.", RGB(16, 185, 129))
    Call AddSimpleCard(s, 500, 120, 400, 380, "Future Scope", _
        "• Computer Vision AI: Video eye-gaze tracking for early ASD biomarkers." & vbCrLf & _
        "• Speech Emotion Recognition: Acoustic prosody analysis." & vbCrLf & _
        "• Wearable IoT: Biosignal sensory overload monitoring." & vbCrLf & _
        "• Regional Languages: Multilingual screening questionnaires." & vbCrLf & _
        "• HL7 / FHIR Integration: Synchronization with Hospital EHRs.", RGB(37, 99, 235))

    MsgBox "Simple 8-Slide Presentation Created Successfully!" & vbCrLf & _
           "Click [File] -> [Save As] to save your .pptx file.", vbInformation, "NEUROSPECTRA"
End Sub

Sub AddSimpleHeader(slideObj As PowerPoint.Slide, titleText As String, catText As String)
    Dim h As PowerPoint.Shape
    Set h = slideObj.Shapes.AddShape(msoShapeRectangle, 0, 0, 960, 80)
    h.Fill.Solid
    h.Fill.ForeColor.RGB = RGB(15, 23, 42)
    h.Line.ForeColor.RGB = RGB(37, 99, 235)
    h.Line.Weight = 2
    
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

Sub AddSimpleCard(slideObj As PowerPoint.Slide, l As Single, t As Single, w As Single, h As Single, cTitle As String, cText As String, bColor As Long)
    Dim card As PowerPoint.Shape
    Set card = slideObj.Shapes.AddShape(msoShapeRoundedRectangle, l, t, w, h)
    card.Fill.Solid
    card.Fill.ForeColor.RGB = RGB(255, 255, 255)
    card.Line.ForeColor.RGB = bColor
    card.Line.Weight = 2
    
    With slideObj.Shapes.AddTextbox(msoTextOrientationHorizontal, l + 15, t + 15, w - 30, 35)
        .TextFrame.TextRange.Text = cTitle
        .TextFrame.TextRange.Font.Name = "Arial"
        .TextFrame.TextRange.Font.Size = 13
        .TextFrame.TextRange.Font.Bold = msoTrue
        .TextFrame.TextRange.Font.Color.RGB = RGB(37, 99, 235)
    End With
    
    With slideObj.Shapes.AddTextbox(msoTextOrientationHorizontal, l + 15, t + 50, w - 30, h - 65)
        .TextFrame.WordWrap = msoTrue
        .TextFrame.TextRange.Text = cText
        .TextFrame.TextRange.Font.Name = "Arial"
        .TextFrame.TextRange.Font.Size = 10.5
        .TextFrame.TextRange.Font.Color.RGB = RGB(30, 41, 59)
    End With
End Sub
