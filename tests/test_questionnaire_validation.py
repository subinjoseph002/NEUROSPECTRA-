import time
import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager

BASE_URL = "http://localhost:3000"

def get_driver():
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--window-size=1440,900")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    service = Service(ChromeDriverManager().install())
    return webdriver.Chrome(service=service, options=options)

def test_questionnaire_validations():
    driver = get_driver()
    try:
        print("[TEST] Loading NeuroSpectra Application...")
        driver.get(BASE_URL)
        time.sleep(1.5)

        # ====================================================================
        # TEST 1: THERAPIST QUESTIONNAIRE VALIDATION
        # ====================================================================
        print("\n--- 1. Testing Therapist Screening Questionnaire Validation ---")
        driver.execute_script("window.neuroAuth.switchDemoRole('Therapist');")
        time.sleep(0.5)
        driver.execute_script("window.navigateTo('assessment-conduct');")
        time.sleep(0.8)

        # Case 1A: Attempt submission when no child selected
        print("[1A] Verifying validation blocks submission when no child selected...")
        driver.execute_script("window.currentAssessmentState.childId = null; window.submitAssessment();")
        time.sleep(0.5)
        toast = driver.execute_script("const toasts = document.querySelectorAll('.toast'); return toasts.length > 0 ? toasts[toasts.length - 1].innerText : '';")
        print(f"     Toast observed: {toast}")
        assert "Validation Error" in toast or "select a child" in toast.lower(), f"Expected child selection error toast, got: {toast}"
        print("     [PASS] Child selection validation passed.")

        # Case 1B: Select a child, but leave questions unanswered
        print("[1B] Verifying validation blocks submission when questions are unanswered...")
        state_debug = driver.execute_script("""
            const children = window.neuroDB.getChildren();
            if (children && children.length > 0) {
                window.currentAssessmentState.childId = children[0].id;
            }
            window.currentAssessmentState.responses = {}; // clear answers
            return {
                childrenCount: children ? children.length : 0,
                selectedChildId: window.currentAssessmentState.childId,
                templateId: window.currentAssessmentState.templateId
            };
        """)
        print(f"     State debug before submit: {state_debug}")
        driver.execute_script("window.submitAssessment();")
        time.sleep(0.5)
        toast = driver.execute_script("const toasts = document.querySelectorAll('.toast'); return toasts.length > 0 ? toasts[toasts.length - 1].innerText : '';")
        print(f"     Toast observed: {toast}")
        assert "Validation Failed" in toast or "answer all" in toast.lower(), f"Expected unanswered questions error toast, got: {toast}"
        
        # Check red border styling on first question card
        q1_style = driver.execute_script("const card = document.querySelector('[id^=\"q-card-\"]'); return card ? (card.style.borderTop + ' ' + card.style.background) : '';")
        print(f"     Question card border/background style: {q1_style}")
        assert "2px solid" in q1_style or "ef4444" in q1_style or "239, 68, 68" in q1_style or "fef2f2" in q1_style
        print("     [PASS] Unanswered questions validation & red border highlight passed.")

        # Case 1C: Answer all questions, but leave notes empty / too short (<10 chars)
        print("[1C] Verifying validation blocks submission when clinical notes < 10 characters...")
        driver.execute_script("""
            const questions = window.neuroDB.getQuestionsByTemplateId(window.currentAssessmentState.templateId);
            questions.forEach(q => { window.currentAssessmentState.responses[q.id] = 'yes'; });
            const notes = document.getElementById('therapist-obs-notes');
            if (notes) { notes.value = 'Short'; }
            window.submitAssessment();
        """)
        time.sleep(0.5)
        toast = driver.execute_script("const toasts = document.querySelectorAll('.toast'); return toasts.length > 0 ? toasts[toasts.length - 1].innerText : '';")
        print(f"     Toast observed: {toast}")
        assert "Validation Error" in toast or "10 characters" in toast.lower() or "notes" in toast.lower(), f"Expected notes error toast, got: {toast}"
        print("     [PASS] Notes minimum length validation passed.")

        # Case 1D: Valid complete submission
        print("[1D] Verifying successful submission when all questions and valid notes provided...")
        initial_count = driver.execute_script("return window.neuroDB.getAssessmentRecords().length;")
        driver.execute_script("""
            window.confirm = () => false;
            const notes = document.getElementById('therapist-obs-notes');
            if (notes) { notes.value = 'Child demonstrates positive social interaction and steady engagement.'; }
            window.submitAssessment();
        """)
        time.sleep(0.5)
        new_count = driver.execute_script("return window.neuroDB.getAssessmentRecords().length;")
        print(f"     Assessment records count: {initial_count} -> {new_count}")
        assert new_count == initial_count + 1, "Expected assessment record to be saved successfully."
        print("     [PASS] Therapist complete questionnaire validation & save passed!")

        # ====================================================================
        # TEST 2: TEACHER OBSERVATION QUESTIONNAIRE VALIDATION
        # ====================================================================
        print("\n--- 2. Testing Teacher Observation Questionnaire Validation ---")
        driver.execute_script("window.neuroAuth.switchDemoRole('Teacher');")
        time.sleep(0.5)
        driver.execute_script("window.navigateTo('observation-create');")
        time.sleep(0.8)

        # Case 2A: Submit without student selected
        print("[2A] Verifying validation blocks submission when no student is selected...")
        driver.execute_script("""
            document.getElementById('obs-child-id').value = '';
            window.teacherModule.handleSubmitObservation();
        """)
        time.sleep(0.5)
        toast = driver.execute_script("const toasts = document.querySelectorAll('.toast'); return toasts.length > 0 ? toasts[toasts.length - 1].innerText : '';")
        print(f"     Toast observed: {toast}")
        assert "Validation Error" in toast or "select a student" in toast.lower(), f"Expected student selection error, got: {toast}"
        print("     [PASS] Student selection validation passed.")

        # Case 2B: Select student, but leave domains unrated
        print("[2B] Verifying validation blocks submission when 5 developmental domains are unrated...")
        driver.execute_script("""
            const sel = document.getElementById('obs-child-id');
            if (sel.options.length > 1) sel.selectedIndex = 1;
            // uncheck any checked domain radios
            document.querySelectorAll('input[name^=\"domain_\"]').forEach(r => r.checked = false);
            window.teacherModule.handleSubmitObservation();
        """)
        time.sleep(0.5)
        toast = driver.execute_script("const toasts = document.querySelectorAll('.toast'); return toasts.length > 0 ? toasts[toasts.length - 1].innerText : '';")
        print(f"     Toast observed: {toast}")
        assert "Validation Failed" in toast or "all 5 developmental domains" in toast.lower(), f"Expected domain evaluation error, got: {toast}"

        # Check domain card red border highlight
        d_style = driver.execute_script("const card = document.getElementById('domain-card-social'); return card ? (card.style.borderTop + ' ' + card.style.background) : '';")
        print(f"     Domain card border/background style: {d_style}")
        assert "2px solid" in d_style or "ef4444" in d_style or "239, 68, 68" in d_style or "fef2f2" in d_style
        print("     [PASS] 5-Domain mandatory questionnaire validation passed.")

        # Case 2C: Rate all 5 domains, but leave notes < 10 characters
        print("[2C] Verifying validation blocks submission when teacher notes < 10 characters...")
        driver.execute_script("""
            const domainKeys = ['social', 'communication', 'behavioural', 'sensory', 'learning'];
            domainKeys.forEach(k => {
                const radio = document.querySelector(`input[name=\"domain_${k}\"][value=\"Sometimes\"]`);
                if (radio) radio.checked = true;
            });
            document.getElementById('obs-notes').value = 'Too brief';
            window.teacherModule.handleSubmitObservation();
        """)
        time.sleep(0.5)
        toast = driver.execute_script("const toasts = document.querySelectorAll('.toast'); return toasts.length > 0 ? toasts[toasts.length - 1].innerText : '';")
        print(f"     Toast observed: {toast}")
        assert "Validation Error" in toast or "10 characters" in toast.lower() or "notes" in toast.lower(), f"Expected teacher notes error, got: {toast}"
        print("     [PASS] Teacher notes minimum length validation passed.")

        # Case 2D: Complete valid submission
        print("[2D] Verifying successful submission when all 5 domains and valid notes provided...")
        init_obs_count = driver.execute_script("return window.neuroDB.getTeacherObservations().length;")
        driver.execute_script("""
            document.getElementById('obs-notes').value = 'Student engaged well with peers during table activities and followed transitions.';
            window.teacherModule.handleSubmitObservation();
        """)
        time.sleep(0.5)
        new_obs_count = driver.execute_script("return window.neuroDB.getTeacherObservations().length;")
        print(f"     Teacher observations count: {init_obs_count} -> {new_obs_count}")
        assert new_obs_count == init_obs_count + 1, "Expected teacher observation to be saved."
        print("     [PASS] Teacher complete observation questionnaire validation & save passed!")

        print("\n=======================================================")
        print("ALL QUESTIONNAIRE VALIDATION TESTS PASSED 100%!")
        print("=======================================================")

    finally:
        driver.quit()

if __name__ == "__main__":
    test_questionnaire_validations()
