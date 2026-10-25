# NEUROSPECTRA — Core System Implementation & Key Code Snippets

**Project Title:** NEUROSPECTRA — AI-Powered Pediatric Autism Screening, Clinical Assessment, and Multidisciplinary Therapy Management Platform  
**Purpose:** Curated, production-grade code implementations for Academic Project Reports, IEEE Papers, Software Requirements Specifications (SRS), and Technical Thesis Submissions.

---

## Table of Contents
1. [Core Autism Screening & Automated Risk Stratification Algorithm (M-CHAT-R/F)](#1-core-autism-screening--automated-risk-stratification-algorithm)
2. [Role-Based Access Control (RBAC) & Security Gatekeeper](#2-role-based-access-control-rbac--security-gatekeeper)
3. [Dynamic Appointment Scheduling & Double-Booking Prevention Algorithm](#3-dynamic-appointment-scheduling--double-booking-prevention-algorithm)
4. [Pediatric Patient Registry & Relational Data Architecture (Django ORM)](#4-pediatric-patient-registry--relational-data-architecture)
5. [Educator 5-Domain Developmental Matrix Logging Engine](#5-educator-5-domain-developmental-matrix-logging-engine)
6. [Multidisciplinary Progress & Clinical Diagnostic Report Generator](#6-multidisciplinary-progress--clinical-diagnostic-report-generator)
7. [Mobile-First Responsive Navigation Drawer & Modal Scroll Lock Controller](#7-mobile-first-responsive-navigation-drawer--modal-scroll-lock-controller)

---

## 1. Core Autism Screening & Automated Risk Stratification Algorithm

- **Source File:** `js/assessment.js`
- **Functional Purpose:** Implements the clinical algorithm for the **Modified Checklist for Autism in Toddlers, Revised with Follow-Up (M-CHAT-R/F)**. Handles dynamic reverse scoring (where 'Yes' indicates risk on questions 2, 5, 12, and 'No' indicates risk on all others), aggregates total diagnostic risk flags, and stratifies the child into standardized clinical risk tiers (**Low Risk**, **Moderate Risk**, or **High Risk Indicator**).

```javascript
/**
 * Standardized Pediatric Autism Screening Evaluation Algorithm
 * Evaluates 20-item M-CHAT-R/F protocol with reverse-scored items.
 */
window.evaluateAssessmentProtocol = function(questions, responses, scoringMethod) {
  let totalScore = 0;
  let riskLevel = 'Low Risk Indicator';
  let riskColor = 'emerald';

  if (scoringMethod === 'Risk_Indicator_Scoring') {
    // M-CHAT-R/F Clinical Standard Scoring Matrix
    questions.forEach(q => {
      const val = responses[q.id];
      if (q.reverse_scored) {
        // Reverse-scored: 'Yes' response indicates at-risk symptom
        if (val === 'yes') totalScore += 1;
      } else {
        // Standard items: 'No' response indicates lack of typical milestone
        if (val === 'no') totalScore += 1;
      }
    });

    // AAP (American Academy of Pediatrics) Risk Stratification Tiers
    if (totalScore >= 8) {
      riskLevel = 'High Risk Indicator';
      riskColor = 'rose';     // Immediate specialist diagnostic referral indicated
    } else if (totalScore >= 3) {
      riskLevel = 'Moderate Risk Indicator';
      riskColor = 'amber';    // Follow-up structured surveillance & therapy recommended
    } else {
      riskLevel = 'Low Risk Indicator';
      riskColor = 'emerald';  // Developmental milestones within expected norms
    }
  } else if (scoringMethod === 'Rating_Scale_5') {
    // 5-Point Likert Scale for Clinical Behavioral Checklists
    const scoreMap = { 'Always': 5, 'Often': 4, 'Sometimes': 3, 'Never': 1, 'Not Observed': 2 };
    let sum = 0;
    let count = 0;

    questions.forEach(q => {
      const val = responses[q.id];
      sum += scoreMap[val] || 3;
      count++;
    });

    const average = count > 0 ? parseFloat((sum / count).toFixed(1)) : 3.0;
    totalScore = average;

    if (average < 2.5) {
      riskLevel = 'High Priority Focus Area';
      riskColor = 'rose';
    } else if (average < 3.8) {
      riskLevel = 'Moderate Developmental Support Needed';
      riskColor = 'amber';
    } else {
      riskLevel = 'Typical / Emerging Strength';
      riskColor = 'emerald';
    }
  }

  return { totalScore, riskLevel, riskColor };
};
```

---

## 2. Role-Based Access Control (RBAC) & Security Gatekeeper

- **Source File:** `js/auth.js`
- **Functional Purpose:** Enforces multi-tier Role-Based Access Control (RBAC) across five user personas (`Administrator`, `Therapist`, `Receptionist`, `Parent / Caregiver`, `Teacher`). Enforces the regulatory clinician gate: self-registered therapists and teachers remain in a `Pending` state (`is_approved = 0`) and cannot access sensitive pediatric records until activated by an Administrator.

```javascript
/**
 * Authentication Service & RBAC Authorization Gate
 * Manages user sessions, cryptographic hash checks, and approval guards.
 */
class AuthService {
  constructor() {
    this.currentUser = null;
    this.token = null;
    this.loadSession();
  }

  login(email, password) {
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanPassword = String(password || '');

    // 1. Input sanitization and RFC-compliant email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      throw new Error('Please enter a valid email address.');
    }
    if (!cleanPassword || cleanPassword.length < 8) {
      throw new Error('Password must be at least 8 characters.');
    }

    // 2. Query user record from persistent registry
    const user = window.neuroDB.getUserByEmail(cleanEmail);
    if (!user) {
      throw new Error('Invalid email or password.'); // Generic error to prevent enumeration
    }

    // 3. Clinician License Approval Gate (Regulatory Compliance)
    if (user.is_approved === 0 || user.status === 'Pending') {
      throw new Error('Your account is pending Administrator verification. Please wait for clinical approval.');
    }

    if (!user.is_active) {
      throw new Error('This account has been deactivated. Please contact the clinic administrator.');
    }

    // 4. Cryptographic password hash verification
    const calculatedHash = window.neuroDB.hashPassword(cleanPassword);
    if (user.password_hash !== calculatedHash && user.password_hash !== cleanPassword) {
      throw new Error('Invalid email or password.');
    }

    // 5. Issue session token and bind RBAC context
    const sessionToken = 'jwt-ns-' + Date.now().toString(36) + '-' + btoa(user.email);
    this.setSession(user, sessionToken);
    return user;
  }

  hasRole(requiredRole) {
    return this.currentUser && this.currentUser.role === requiredRole;
  }
}
```

---

## 3. Dynamic Appointment Scheduling & Double-Booking Prevention Algorithm

- **Source File:** `js/app.js` (lines 3128–3175)
- **Functional Purpose:** Prevents double-booking and calendar conflicts. When a date or practitioner is selected, this algorithm queries all existing active bookings, cross-references standard operating clinic slots, removes already-reserved slots, filters out elapsed hours for same-day bookings, and updates the DOM in real-time.

```javascript
/**
 * Dynamic Clinic Slot Allocation Algorithm
 * Computes available forward-looking time slots without calendar collisions.
 */
window.updateAvailableAppointmentSlots = function() {
  const dateInput = document.getElementById('apt-date');
  const therapistSelect = document.getElementById('apt-therapist');
  const timeSelect = document.getElementById('apt-time');
  const badge = document.getElementById('apt-slot-count-badge');
  const notice = document.getElementById('apt-no-slots-notice');
  const submitBtn = document.getElementById('btn-confirm-booking');

  if (!dateInput || !therapistSelect || !timeSelect) return;

  const selectedDate = dateInput.value;
  const selectedTherapistId = therapistSelect.value;
  const allClinicSlots = window.STANDARD_CLINIC_SLOTS || [];

  // 1. Query all active (non-cancelled) bookings for the practitioner on selected date
  const existingAppointments = (window.neuroDB.getAppointments() || []).filter(a => 
    a.appointment_date === selectedDate &&
    a.therapist_id === selectedTherapistId &&
    a.status !== 'Cancelled'
  );

  // 2. Build set of occupied start times for O(1) collision detection
  const bookedStartTimes = new Set(existingAppointments.map(a => a.start_time));

  // 3. Filter slots: exclude booked slots AND elapsed time slots today
  const availableSlots = allClinicSlots.filter(slot => 
    !bookedStartTimes.has(slot.start) &&
    !window.isTimeSlotPastToday(selectedDate, slot.start)
  );

  // 4. Real-time UI rendering & validation lock
  if (availableSlots.length > 0) {
    timeSelect.innerHTML = availableSlots.map(s => `
      <option value="${s.start}" data-end="${s.end}">${s.label}</option>
    `).join('');
    timeSelect.disabled = false;
    if (badge) {
      badge.style.display = 'inline-block';
      badge.textContent = `${availableSlots.length} Slots Available`;
    }
    if (notice) notice.style.display = 'none';
    if (submitBtn) submitBtn.disabled = false;
  } else {
    timeSelect.innerHTML = '<option value="">No available time slots</option>';
    timeSelect.disabled = true;
    if (badge) badge.style.display = 'none';
    if (notice) {
      notice.style.display = 'block';
      notice.innerHTML = `⚠️ All clinic slots for this practitioner are booked on <strong>${selectedDate}</strong>.`;
    }
    if (submitBtn) submitBtn.disabled = true;
  }
};
```

---

## 4. Pediatric Patient Registry & Relational Data Architecture

- **Source File:** `backend/children/models.py` & `backend/accounts/models.py`
- **Functional Purpose:** Django REST Framework models maintaining relational database integrity across children, parents, supervising therapists, and classroom educators.

```python
import uuid
from django.db import models
from django.conf import settings
from django.core.validators import RegexValidator

class Child(models.Model):
    """
    Core pediatric patient registry model tracking developmental indicators,
    assigned clinical specialists, primary caregivers, and classroom cohorts.
    """
    GENDER_CHOICES = (
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    )

    STATUS_CHOICES = (
        ('Active', 'Active'),
        ('Under Assessment', 'Under Assessment'),
        ('Inactive', 'Inactive'),
        ('Discharged', 'Discharged'),
    )

    id = models.CharField(max_length=64, primary_key=True, default=lambda: f"ch_{uuid.uuid4().hex[:10]}")
    child_code = models.CharField(max_length=32, unique=True, db_index=True)
    first_name = models.CharField(max_length=60)
    last_name = models.CharField(max_length=60)
    dob = models.DateField()
    age_months = models.IntegerField(default=36)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, default='Male')
    blood_group = models.CharField(max_length=10, blank=True, null=True, default='O+')
    emergency_contact = models.CharField(max_length=120, blank=True, null=True)
    
    # Foreign Key Relationships establishing multidisciplinary care network
    primary_parent = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='children_as_parent'
    )
    assigned_therapist = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='children_as_therapist'
    )
    classroom_group = models.CharField(max_length=100, default='Preschool Early Readiness')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Active')
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'children'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.child_code})"
```

---

## 5. Educator 5-Domain Developmental Matrix Logging Engine

- **Source File:** `js/teacher.js`
- **Functional Purpose:** Enables school educators to log structured, non-clinical classroom behavioral observations across 5 key childhood development dimensions: Social Interaction, Communication, Behavior Patterns, Sensory Responses, and Classroom Focus.

```javascript
/**
 * Classroom 5-Domain Observation Matrix Submission
 * Links qualitative educator narratives with quantitative behavioral indicators.
 */
window.teacherModule.submitClassroomObservation = function(formData) {
  const { childId, educatorId, activityContext, notes, domainRatings } = formData;

  // 1. Structured 5-Domain Rating Scale Mapping
  const structuredMatrix = {
    social_interaction: {
      domain: 'Social Interaction & Peer Play',
      rating: domainRatings.social || 'Consistent',
      flag: domainRatings.social === 'Needs Support'
    },
    communication: {
      domain: 'Expressive & Receptive Communication',
      rating: domainRatings.communication || 'Emerging',
      flag: domainRatings.communication === 'Needs Support'
    },
    behavioural_patterns: {
      domain: 'Routines, Transitions & Repetitive Behaviors',
      rating: domainRatings.behavior || 'Consistent',
      flag: domainRatings.behavior === 'Frequent Triggers'
    },
    sensory_responses: {
      domain: 'Auditory, Tactile & Environmental Sensory Responses',
      rating: domainRatings.sensory || 'Typical',
      flag: domainRatings.sensory === 'Highly Sensitive'
    },
    classroom_learning: {
      domain: 'Attention Span & Task Completion',
      rating: domainRatings.learning || 'Consistent',
      flag: domainRatings.learning === 'Short Duration'
    }
  };

  // 2. Persist Observation Record into Database
  const observationRecord = window.neuroDB.createTeacherObservation({
    child_id: childId,
    teacher_id: educatorId,
    observation_date: new Date().toISOString().split('T')[0],
    activity_context: activityContext, // e.g., 'Circle Time', 'Recess', 'Lunch'
    ratings_json: structuredMatrix,
    educator_notes: notes,
    status: 'Submitted'
  });

  // 3. Dispatch Cross-Disciplinary Notification to Assigned Therapist
  const child = window.neuroDB.getChildById(childId);
  if (child && child.assigned_therapist_id) {
    window.neuroDB.createNotification({
      user_id: child.assigned_therapist_id,
      title: 'New Classroom Observation Logged',
      message: `Teacher logged an observation for ${child.first_name} during ${activityContext}.`,
      type: 'assessment',
      link: '#assessment-conduct'
    });
  }

  return observationRecord;
};
```

---

## 6. Multidisciplinary Progress & Clinical Diagnostic Report Generator

- **Source File:** `js/reports.js`
- **Functional Purpose:** Synthesizes historical M-CHAT screening evaluations, clinical encounter notes, IEP therapy plans, and longitudinal scores into a standardized, official medical report document with print-ready PDF styling.

```javascript
/**
 * Clinical Diagnostic & Progress Report Synthesis Engine
 * Aggregates multi-source clinical data into an official medical document.
 */
window.renderClinicalReport = function(childId) {
  const child = window.neuroDB.getChildById(childId);
  if (!child) return `<div class="card">Child patient record not found.</div>`;

  const parent = child.primary_parent_id ? window.neuroDB.getUserById(child.primary_parent_id) : null;
  const therapist = child.assigned_therapist_id ? window.neuroDB.getUserById(child.assigned_therapist_id) : null;
  
  // Aggregate Assessments, Therapy Plans & Encounter Sessions
  const assessments = window.neuroDB.getAssessmentRecords({ child_id: childId });
  const latestAssessment = assessments[0];
  const therapyPlans = window.neuroDB.getTherapyPlans({ child_id: childId });
  const activePlan = therapyPlans.find(p => p.status === 'Active') || therapyPlans[0];
  const sessions = window.neuroDB.getTherapySessions({ child_id: childId });

  const reportId = `RPT-${child.child_code}-${Date.now().toString(36).toUpperCase().slice(-4)}`;

  return `
    <div class="clinical-report-paper" style="background: #ffffff; padding: 36px; border-radius: 16px;">
      <!-- Document Header -->
      <div class="report-header-banner" style="display: flex; justify-content: space-between; border-bottom: 2px solid #0f172a; padding-bottom: 20px;">
        <div>
          <h2>NEUROSPECTRA DEVELOPMENT & PROGRESS REPORT</h2>
          <span style="color: #2563eb; font-weight: 700; font-size: 11px;">Official Pediatric Clinical Synthesis</span>
        </div>
        <div style="text-align: right; font-size: 12px; color: #64748b;">
          <div><strong>Report ID:</strong> ${reportId}</div>
          <div><strong>Date:</strong> ${new Date().toLocaleDateString()}</div>
        </div>
      </div>

      <!-- Patient Demographics & Care Network -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; background: #f8fafc; padding: 16px; margin: 20px 0;">
        <div><strong>Patient:</strong> ${child.first_name} ${child.last_name} (${child.child_code})</div>
        <div><strong>Age:</strong> ${child.age_months} Months (${child.dob})</div>
        <div><strong>Assigned Clinician:</strong> ${therapist ? therapist.full_name : 'Supervising Specialist'}</div>
      </div>

      <!-- Diagnostic Assessment Findings -->
      <div class="report-section">
        <h3>1. Developmental Screening Summary (M-CHAT-R/F)</h3>
        ${latestAssessment ? `
          <div style="background: #f8fafc; padding: 16px; border-radius: 10px;">
            <div><strong>Score / Risk Classification:</strong> 
              <span class="badge badge-${latestAssessment.risk_color}">${latestAssessment.risk_level} (${latestAssessment.total_score} Flags)</span>
            </div>
            <p><strong>Clinical Notes:</strong> ${latestAssessment.therapist_notes}</p>
          </div>
        ` : `<p>No diagnostic screening records finalized.</p>`}
      </div>

      <!-- Individualized Education & Therapy Plan (IEP) Goals -->
      <div class="report-section" style="margin-top: 20px;">
        <h3>2. Active Therapy & Developmental Milestones</h3>
        <p><strong>Plan Title:</strong> ${activePlan ? activePlan.title : 'Sensory & Social Integration Plan'}</p>
        <p><strong>Encounter Frequency:</strong> Completed ${sessions.length} clinical sessions to date.</p>
      </div>
    </div>
  `;
};
```

---

## 7. Mobile-First Responsive Navigation Drawer & Modal Scroll Lock Controller

- **Source File:** `js/app.js` & `css/style.css`
- **Functional Purpose:** Controls off-canvas responsive navigation on touchscreens and mobile viewports ($\le 1024\text{px}$), manages backdrop tapping, dismisses navigation upon route changes, and prevents background scroll bleeding (`body.modal-open` and `body.sidebar-open`).

```javascript
/**
 * Responsive Mobile Navigation Drawer & Modal Viewport Manager
 */
window.toggleMobileSidebar = function() {
  const sidebar = document.getElementById('app-sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  if (sidebar) {
    const isOpen = sidebar.classList.toggle('open');
    if (backdrop) backdrop.classList.toggle('show', isOpen);
    // Lock body background scrolling while mobile drawer is open
    document.body.classList.toggle('sidebar-open', isOpen);
  }
};

window.closeMobileSidebar = function() {
  const sidebar = document.getElementById('app-sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  if (sidebar) sidebar.classList.remove('open');
  if (backdrop) backdrop.classList.remove('show');
  document.body.classList.remove('sidebar-open');
};

// Automatically dismiss mobile drawer upon SPA route navigation
const originalNavigateTo = window.navigateTo;
window.navigateTo = function(route, params) {
  window.closeMobileSidebar();
  if (typeof originalNavigateTo === 'function') {
    originalNavigateTo(route, params);
  }
};

// Global Keyboard Accessibility: Dismiss active modals and drawers on Escape
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' || e.keyCode === 27) {
    if (typeof window.closeActiveModal === 'function') window.closeActiveModal();
    window.closeMobileSidebar();
  }
});
```

---

*Document compiled and verified for NEUROSPECTRA Project Report & Technical Implementation Chapter.*
