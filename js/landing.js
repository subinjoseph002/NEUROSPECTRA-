/**
 * NEUROSPECTRA - Responsive Healthcare Landing Page
 * Pixel-perfect adaptation for Desktop, Tablet, and Mobile screens.
 */

window.toggleLandingMobileMenu = function() {
  const menu = document.getElementById('landing-mobile-menu');
  const backdrop = document.getElementById('landing-menu-backdrop');
  if (menu) {
    const isOpen = menu.classList.toggle('open');
    if (backdrop) backdrop.classList.toggle('show', isOpen);
    document.body.classList.toggle('landing-menu-open', isOpen);
  }
};

window.closeLandingMobileMenu = function() {
  const menu = document.getElementById('landing-mobile-menu');
  const backdrop = document.getElementById('landing-menu-backdrop');
  if (menu && menu.classList.contains('open')) {
    menu.classList.remove('open');
  }
  if (backdrop) {
    backdrop.classList.remove('show');
  }
  document.body.classList.remove('landing-menu-open');
};

window.handleExplorePlatform = function() {
  window.closeLandingMobileMenu();
  if (window.neuroAuth && window.neuroAuth.isAuthenticated()) {
    window.navigateTo('dashboard');
  } else {
    window.navigateTo('login');
  }
};

window.renderLandingPage = function() {
  const isAuth = window.neuroAuth && window.neuroAuth.isAuthenticated();
  const currentRole = isAuth ? window.neuroAuth.getRole() : '';
  const currentUser = isAuth ? window.neuroAuth.getCurrentUser() : null;

  return `
    <div class="landing-page-exact">
      
      <!-- Top Navigation Header -->
      <nav class="landing-nav">
        <!-- Brand Logo -->
        <div class="landing-brand">
          ${window.renderBrandLogo ? window.renderBrandLogo('light', 'large', true) : `<span style="font-size: 20px; font-weight: 800; color: #0f172a;">NEURO<span style="color:#2563eb;">SPECTRA</span></span>`}
        </div>

        <!-- Desktop Navigation Links -->
        <div class="landing-nav-links">
          <a href="#home" onclick="window.scrollTo({top: 0, behavior: 'smooth'}); return false;">Home</a>
          <a href="#features" onclick="document.getElementById('features-section').scrollIntoView({behavior:'smooth'}); return false;">Features</a>
          <a href="#about" onclick="document.getElementById('specialists-section').scrollIntoView({behavior:'smooth'}); return false;">About</a>
          <a href="#contact" onclick="document.getElementById('contact-section').scrollIntoView({behavior:'smooth'}); return false;">Contact</a>
        </div>

        <!-- Desktop Auth Actions -->
        <div class="landing-nav-actions">
          ${isAuth ? `
            <button style="background: #2563eb; color: #ffffff; font-weight: 600; font-size: 14px; padding: 9px 18px; border-radius: 8px; border: none; cursor: pointer; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25); transition: all 0.2s;" onclick="window.navigateTo('dashboard')" onmouseover="this.style.background='#1d4ed8'" onmouseout="this.style.background='#2563eb'">
              Dashboard (${currentRole})
            </button>
            <button style="background: transparent; border: none; font-weight: 600; font-size: 14px; color: #64748b; cursor: pointer; padding: 8px 12px;" onclick="window.handleLogout()">
              Sign Out
            </button>
          ` : `
            <button style="background: transparent; border: none; font-weight: 600; font-size: 14.5px; color: #0f172a; cursor: pointer; padding: 8px 12px;" onclick="window.navigateTo('login')">
              Login
            </button>
            <button style="background: #2563eb; color: #ffffff; font-weight: 600; font-size: 14px; padding: 10px 22px; border-radius: 8px; border: none; cursor: pointer; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25); transition: all 0.2s;" onclick="window.navigateTo('register')" onmouseover="this.style.background='#1d4ed8'" onmouseout="this.style.background='#2563eb'">
              Register
            </button>
          `}
        </div>

        <!-- Mobile Hamburger Button -->
        <button class="landing-hamburger-btn" onclick="window.toggleLandingMobileMenu()" aria-label="Toggle Navigation Menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      </nav>

      <!-- Mobile Dropdown Menu Backdrop -->
      <div id="landing-menu-backdrop" class="landing-menu-backdrop" onclick="window.closeLandingMobileMenu()"></div>

      <!-- Mobile Dropdown Menu -->
      <div id="landing-mobile-menu" class="landing-mobile-menu">
        <a href="#home" onclick="window.closeLandingMobileMenu(); window.scrollTo({top: 0, behavior: 'smooth'}); return false;">Home</a>
        <a href="#features" onclick="window.closeLandingMobileMenu(); document.getElementById('features-section').scrollIntoView({behavior:'smooth'}); return false;">Features</a>
        <a href="#about" onclick="window.closeLandingMobileMenu(); document.getElementById('specialists-section').scrollIntoView({behavior:'smooth'}); return false;">About</a>
        <a href="#contact" onclick="window.closeLandingMobileMenu(); document.getElementById('contact-section').scrollIntoView({behavior:'smooth'}); return false;">Contact</a>
        <div class="landing-mobile-menu-divider"></div>
        ${isAuth ? `
          <div style="display: flex; gap: 10px; width: 100%; margin-top: 6px;">
            <button style="flex: 1; min-height: 44px; padding: 11px; background: #2563eb; border: none; border-radius: 8px; font-weight: 700; font-size: 14px; color: #ffffff; cursor: pointer; box-shadow: 0 4px 12px rgba(37,99,235,0.25);" onclick="window.closeLandingMobileMenu(); window.navigateTo('dashboard')">Dashboard (${currentRole})</button>
            <button style="flex: 1; min-height: 44px; padding: 11px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; font-weight: 700; font-size: 14px; color: #64748b; cursor: pointer;" onclick="window.closeLandingMobileMenu(); window.handleLogout()">Sign Out</button>
          </div>
        ` : `
          <div style="display: flex; gap: 10px; width: 100%; margin-top: 6px;">
            <button style="flex: 1; min-height: 44px; padding: 11px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; font-weight: 700; font-size: 14px; color: #0f172a; cursor: pointer;" onclick="window.closeLandingMobileMenu(); window.navigateTo('login')">Login</button>
            <button style="flex: 1; min-height: 44px; padding: 11px; background: #2563eb; border: none; border-radius: 8px; font-weight: 700; font-size: 14px; color: #ffffff; cursor: pointer; box-shadow: 0 4px 12px rgba(37,99,235,0.25);" onclick="window.closeLandingMobileMenu(); window.navigateTo('register')">Register</button>
          </div>
        `}
      </div>

      <!-- Hero Section -->
      <section class="landing-section landing-hero-section">
        <div class="landing-hero-grid">
          <!-- Left Column -->
          <div class="landing-hero-content">
            <!-- Pill Tag -->
            <div class="landing-pill">
              NEXT-GEN AUTISM CARE
            </div>

            <!-- Main Heading -->
            <h1 class="landing-hero-title">
              Empowering Autism Therapy with Smart Technology
            </h1>

            <!-- Subtitle -->
            <p class="landing-hero-desc">
              NEUROSPECTRA is an AI-powered autism screening and therapy management platform designed to streamline clinical workflows, empower therapists, and support families every step of the way.
            </p>

            <!-- Buttons -->
            <div class="landing-hero-ctas">
              <button class="landing-btn-primary" id="landing-explore-btn" style="background: #2563eb; color: #ffffff; font-weight: 600; font-size: 15px; padding: 13px 28px; border-radius: 8px; border: none; cursor: pointer; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3); transition: all 0.2s;" onclick="window.handleExplorePlatform();" onmouseover="this.style.background='#1d4ed8'" onmouseout="this.style.background='#2563eb'">
                Explore Platform
              </button>
              <button class="landing-btn-secondary" style="background: #ffffff; color: #2563eb; font-weight: 600; font-size: 15px; padding: 13px 26px; border-radius: 8px; border: 1.5px solid #2563eb; cursor: pointer; transition: all 0.2s;" onclick="document.getElementById('features-section').scrollIntoView({behavior:'smooth'});" onmouseover="this.style.background='#eff6ff'" onmouseout="this.style.background='#ffffff'">
                Watch Demo
              </button>
            </div>
          </div>

          <!-- Right Column (Hero Photo) -->
          <div class="landing-hero-media">
            <div class="landing-hero-img-wrap">
              <img src="assets/hero_clinic_child.jpg" alt="Pediatric Therapy Clinic" class="landing-hero-img" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1000';">
            </div>
          </div>
        </div>
      </section>

      <!-- Trust Ribbon -->
      <section class="landing-trust-section">
        <div class="landing-trust-container">
          <div class="landing-trust-title">
            TRUSTED BY LEADING CLINICS, THERAPY CENTERS & RESEARCH LABS
          </div>
          <div class="landing-trust-logos">
            <span class="landing-trust-badge">Hope Center for Autism</span>
            <span class="landing-trust-badge">Apex ABA Therapy</span>
            <span class="landing-trust-badge">NeuroLink Clinic</span>
            <span class="landing-trust-badge">Bright Horizons Pediatrics</span>
            <span class="landing-trust-badge">Spectrum Behavioral Health</span>
          </div>
        </div>
      </section>

      <!-- Core Features Section -->
      <section id="features-section" class="landing-section">
        <div class="landing-section-header">
          <div class="landing-tag">
            CORE FEATURES
          </div>
          <h2 class="landing-section-title">
            Everything your center needs to thrive
          </h2>
          <p class="landing-section-desc">
            From initial screening and diagnosis to personalized therapy plans and progress tracking, we have you covered.
          </p>
        </div>

        <!-- 6 Feature Cards Grid -->
        <div class="landing-features-grid">
          
          <!-- Card 1 -->
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 30px; box-shadow: 0 2px 6px rgba(0,0,0,0.03); transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 10px 20px rgba(0,0,0,0.06)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 6px rgba(0,0,0,0.03)'">
            <div style="width: 44px; height: 44px; border-radius: 10px; background: #eff6ff; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; color: #2563eb;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/><line x1="19" y1="11" x2="19" y2="17"/><line x1="22" y1="14" x2="16" y2="14"/>
              </svg>
            </div>
            <h3 style="font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">Child Registration</h3>
            <p style="font-size: 14px; color: #64748b; line-height: 1.55;">
              Easy parent onboarding, comprehensive intake forms, and centralized health records management.
            </p>
          </div>

          <!-- Card 2 -->
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 30px; box-shadow: 0 2px 6px rgba(0,0,0,0.03); transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 10px 20px rgba(0,0,0,0.06)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 6px rgba(0,0,0,0.03)'">
            <div style="width: 44px; height: 44px; border-radius: 10px; background: #eff6ff; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; color: #2563eb;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
              </svg>
            </div>
            <h3 style="font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">Standardized Assessment</h3>
            <p style="font-size: 14px; color: #64748b; line-height: 1.55;">
              Clinically-validated diagnostic tools including M-CHAT-R/F and behavioral observation scales.
            </p>
          </div>

          <!-- Card 3 -->
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 30px; box-shadow: 0 2px 6px rgba(0,0,0,0.03); transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 10px 20px rgba(0,0,0,0.06)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 6px rgba(0,0,0,0.03)'">
            <div style="width: 44px; height: 44px; border-radius: 10px; background: #eff6ff; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; color: #2563eb;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h3 style="font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">Therapy Planning</h3>
            <p style="font-size: 14px; color: #64748b; line-height: 1.55;">
              Individualized milestone goals, activity sequencing, and multi-session therapy roadmaps.
            </p>
          </div>

          <!-- Card 4 -->
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 30px; box-shadow: 0 2px 6px rgba(0,0,0,0.03); transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 10px 20px rgba(0,0,0,0.06)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 6px rgba(0,0,0,0.03)'">
            <div style="width: 44px; height: 44px; border-radius: 10px; background: #eff6ff; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; color: #2563eb;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
            </div>
            <h3 style="font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">Progress Tracking</h3>
            <p style="font-size: 14px; color: #64748b; line-height: 1.55;">
              Real-time multi-domain charts (social, communication, sensory, behavioral) over time.
            </p>
          </div>

          <!-- Card 5 -->
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 30px; box-shadow: 0 2px 6px rgba(0,0,0,0.03); transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 10px 20px rgba(0,0,0,0.06)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 6px rgba(0,0,0,0.03)'">
            <div style="width: 44px; height: 44px; border-radius: 10px; background: #eff6ff; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; color: #2563eb;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <h3 style="font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">Appointment Management</h3>
            <p style="font-size: 14px; color: #64748b; line-height: 1.55;">
              Conflict-free scheduling, automated reminders, and therapist availability rosters.
            </p>
          </div>

          <!-- Card 6 -->
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 30px; box-shadow: 0 2px 6px rgba(0,0,0,0.03); transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 10px 20px rgba(0,0,0,0.06)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 6px rgba(0,0,0,0.03)'">
            <div style="width: 44px; height: 44px; border-radius: 10px; background: #eff6ff; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; color: #2563eb;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <h3 style="font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">Parent Communication</h3>
            <p style="font-size: 14px; color: #64748b; line-height: 1.55;">
              Secure messaging, home exercise guidance, and real-time clinical progress updates.
            </p>
          </div>

        </div>
      </section>

      <!-- Why Healthcare Specialists Choose Us Section -->
      <section id="specialists-section" class="landing-section landing-bg-alt">
        <div class="landing-section-header">
          <div class="landing-tag">
            CLINICAL EXCELLENCE & TRUST
          </div>
          <h2 class="landing-section-title">
            Why healthcare specialists choose us
          </h2>
        </div>

        <!-- 4 Benefit Cards Grid -->
        <div class="landing-specialists-grid">
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 26px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
            <div style="width: 44px; height: 44px; border-radius: 50%; background: #dcfce7; display: flex; align-items: center; justify-content: center; margin-bottom: 18px; color: #16a34a;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h3 style="font-size: 17px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">Evidence-Based</h3>
            <p style="font-size: 13.5px; color: #64748b; line-height: 1.55;">
              Validated screening protocols adhering to international pediatric standards.
            </p>
          </div>

          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 26px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
            <div style="width: 44px; height: 44px; border-radius: 50%; background: #dcfce7; display: flex; align-items: center; justify-content: center; margin-bottom: 18px; color: #16a34a;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <h3 style="font-size: 17px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">Collaborative Ecosystem</h3>
            <p style="font-size: 13.5px; color: #64748b; line-height: 1.55;">
              Seamless communication connecting therapists, parents, and administrative staff.
            </p>
          </div>

          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 26px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
            <div style="width: 44px; height: 44px; border-radius: 50%; background: #dcfce7; display: flex; align-items: center; justify-content: center; margin-bottom: 18px; color: #16a34a;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h3 style="font-size: 17px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">Secure & Protected</h3>
            <p style="font-size: 13.5px; color: #64748b; line-height: 1.55;">
              Enterprise-grade data protection with strict role-based access control.
            </p>
          </div>

          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 26px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
            <div style="width: 44px; height: 44px; border-radius: 50%; background: #dcfce7; display: flex; align-items: center; justify-content: center; margin-bottom: 18px; color: #16a34a;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <h3 style="font-size: 17px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">Time-Saving</h3>
            <p style="font-size: 13.5px; color: #64748b; line-height: 1.55;">
              Reduces documentation overhead by up to 60% with automated workflows.
            </p>
          </div>

        </div>
      </section>

      <!-- Dedicated Portals Section -->
      <section class="landing-section">
        <div class="landing-section-header">
          <div class="landing-tag">
            TAILORED EXPERIENCES
          </div>
          <h2 class="landing-section-title">
            Dedicated portals for every stakeholder
          </h2>
          <p class="landing-section-desc">
            Purpose-built workspaces customized for the distinct needs of each team member and caregiver.
          </p>
        </div>

        <!-- 5 Portal Cards Grid -->
        <div class="landing-portals-grid">
          
          <!-- Portal 1: Admin -->
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; text-align: center; cursor: pointer; transition: transform 0.2s, border-color 0.2s;" onclick="window.switchDemo('Administrator')" onmouseover="this.style.transform='translateY(-4px)'; this.style.borderColor='#2563eb'" onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='#e2e8f0'">
            <div style="width: 44px; height: 44px; border-radius: 10px; background: #eff6ff; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: #2563eb;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h4 style="font-size: 15.5px; font-weight: 700; color: #0f172a; margin-bottom: 6px;">Administrator</h4>
            <p style="font-size: 12.5px; color: #64748b; line-height: 1.5; margin-bottom: 14px;">
              System governance, user provisioning, audit trails, and clinic analytics.
            </p>
            <span style="font-size: 12px; font-weight: 700; color: #2563eb;">Open Portal &rarr;</span>
          </div>

          <!-- Portal 2: Therapist -->
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; text-align: center; cursor: pointer; transition: transform 0.2s, border-color 0.2s;" onclick="window.switchDemo('Therapist')" onmouseover="this.style.transform='translateY(-4px)'; this.style.borderColor='#2563eb'" onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='#e2e8f0'">
            <div style="width: 44px; height: 44px; border-radius: 10px; background: #eff6ff; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: #2563eb;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <h4 style="font-size: 15.5px; font-weight: 700; color: #0f172a; margin-bottom: 6px;">Therapist</h4>
            <p style="font-size: 12.5px; color: #64748b; line-height: 1.5; margin-bottom: 14px;">
              Screening questionnaires, goal roadmaps, session logs, and progress metrics.
            </p>
            <span style="font-size: 12px; font-weight: 700; color: #2563eb;">Open Portal &rarr;</span>
          </div>

          <!-- Portal 3: Receptionist -->
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; text-align: center; cursor: pointer; transition: transform 0.2s, border-color 0.2s;" onclick="window.switchDemo('Receptionist')" onmouseover="this.style.transform='translateY(-4px)'; this.style.borderColor='#2563eb'" onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='#e2e8f0'">
            <div style="width: 44px; height: 44px; border-radius: 10px; background: #eff6ff; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: #2563eb;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <h4 style="font-size: 15.5px; font-weight: 700; color: #0f172a; margin-bottom: 6px;">Receptionist</h4>
            <p style="font-size: 12.5px; color: #64748b; line-height: 1.5; margin-bottom: 14px;">
              Patient onboarding, calendar scheduling, conflict detection, and reminders.
            </p>
            <span style="font-size: 12px; font-weight: 700; color: #2563eb;">Open Portal &rarr;</span>
          </div>

          <!-- Portal 4: Doctor / Pediatrician -->
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; text-align: center; cursor: pointer; transition: transform 0.2s, border-color 0.2s;" onclick="window.switchDemo('Therapist')" onmouseover="this.style.transform='translateY(-4px)'; this.style.borderColor='#2563eb'" onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='#e2e8f0'">
            <div style="width: 44px; height: 44px; border-radius: 10px; background: #eff6ff; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: #2563eb;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
            </div>
            <h4 style="font-size: 15.5px; font-weight: 700; color: #0f172a; margin-bottom: 6px;">Pediatrician</h4>
            <p style="font-size: 12.5px; color: #64748b; line-height: 1.5; margin-bottom: 14px;">
              Clinical baseline review, medical history access, and diagnostic referral notes.
            </p>
            <span style="font-size: 12px; font-weight: 700; color: #2563eb;">Open Portal &rarr;</span>
          </div>

          <!-- Portal 5: Parent -->
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; text-align: center; cursor: pointer; transition: transform 0.2s, border-color 0.2s;" onclick="window.switchDemo('Parent / Caregiver')" onmouseover="this.style.transform='translateY(-4px)'; this.style.borderColor='#2563eb'" onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='#e2e8f0'">
            <div style="width: 44px; height: 44px; border-radius: 10px; background: #eff6ff; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: #2563eb;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <h4 style="font-size: 15.5px; font-weight: 700; color: #0f172a; margin-bottom: 6px;">Caregiver</h4>
            <p style="font-size: 12.5px; color: #64748b; line-height: 1.5; margin-bottom: 14px;">
              Child developmental milestones, session summaries, and direct therapist chat.
            </p>
            <span style="font-size: 12px; font-weight: 700; color: #2563eb;">Open Portal &rarr;</span>
          </div>

        </div>
      </section>

      <!-- Solid Blue Statistics Banner -->
      <section class="landing-stats-section">
        <div class="landing-stats-grid">
          <div>
            <div class="landing-stat-number">48 hours</div>
            <div class="landing-stat-label">Average time saved per therapist / month</div>
          </div>
          <div>
            <div class="landing-stat-number">12,000+</div>
            <div class="landing-stat-label">Screenings & therapy sessions logged</div>
          </div>
          <div>
            <div class="landing-stat-number">94%</div>
            <div class="landing-stat-label">Parent satisfaction & engagement rate</div>
          </div>
          <div>
            <div class="landing-stat-number">100%</div>
            <div class="landing-stat-label">Role-based clinical data security & isolation</div>
          </div>
        </div>
      </section>

      <!-- Testimonials Section -->
      <section class="landing-section landing-bg-alt">
        <div class="landing-section-header">
          <div class="landing-tag">
            COMMUNITY REVIEWS
          </div>
          <h2 class="landing-section-title">
            What our community is saying
          </h2>
        </div>

        <!-- 3 Testimonial Cards -->
        <div class="landing-testimonials-grid">
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 28px; box-shadow: 0 2px 6px rgba(0,0,0,0.02); display: flex; flex-direction: column; justify-content: space-between;">
            <p style="font-size: 14.5px; color: #475569; line-height: 1.65; margin-bottom: 24px; font-style: italic;">
              "NEUROSPECTRA transformed how we track progress and communicate with parents. The automated M-CHAT-R/F scoring alone saves our clinicians hours every week."
            </p>
            <div style="display: flex; align-items: center; gap: 14px;">
              <img src="https://images.unsplash.com/photo-1594824813589-3221e5138137?auto=format&fit=crop&q=80&w=128" alt="Dr. Elena Ramos" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover;" onerror="this.onerror=null; this.src='https://ui-avatars.com/api/?name=Elena+Ramos&background=eff6ff&color=2563eb';">
              <div>
                <div style="font-weight: 700; font-size: 14.5px; color: #0f172a;">Dr. Elena Ramos, Ph.D.</div>
                <div style="font-size: 12px; color: #64748b;">Lead Behavioral Specialist, BrightSteps</div>
              </div>
            </div>
          </div>

          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 28px; box-shadow: 0 2px 6px rgba(0,0,0,0.02); display: flex; flex-direction: column; justify-content: space-between;">
            <p style="font-size: 14.5px; color: #475569; line-height: 1.65; margin-bottom: 24px; font-style: italic;">
              "As a parent, having clear visibility into my son's therapy goals and daily milestones gave our family immense confidence and clarity."
            </p>
            <div style="display: flex; align-items: center; gap: 14px;">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=128" alt="Michael Vance" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover;" onerror="this.onerror=null; this.src='https://ui-avatars.com/api/?name=Michael+Vance&background=eff6ff&color=2563eb';">
              <div>
                <div style="font-weight: 700; font-size: 14.5px; color: #0f172a;">Michael Vance</div>
                <div style="font-size: 12px; color: #64748b;">Parent & Autism Advocate</div>
              </div>
            </div>
          </div>

          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 28px; box-shadow: 0 2px 6px rgba(0,0,0,0.02); display: flex; flex-direction: column; justify-content: space-between;">
            <p style="font-size: 14.5px; color: #475569; line-height: 1.65; margin-bottom: 24px; font-style: italic;">
              "The seamless scheduling and direct messaging between staff and caregivers eliminated missed sessions and improved our clinic workflow dramatically."
            </p>
            <div style="display: flex; align-items: center; gap: 14px;">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=128" alt="Sarah Chen" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover;" onerror="this.onerror=null; this.src='https://ui-avatars.com/api/?name=Sarah+Chen&background=eff6ff&color=2563eb';">
              <div>
                <div style="font-weight: 700; font-size: 14.5px; color: #0f172a;">Sarah Chen, MHA</div>
                <div style="font-size: 12px; color: #64748b;">Clinical Director, Spectrum Center</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- Contact Us & Inquiry Form Section -->
      <section id="contact-section" class="landing-section">
        <div class="landing-contact-grid">
          
          <!-- Left: Contact Information -->
          <div>
            <div class="landing-tag">
              CONTACT US
            </div>
            <h2 class="landing-section-title">
              Have questions? Let's talk.
            </h2>
            <p class="landing-section-desc" style="margin-bottom: 30px;">
              Reach out to our clinical technology team to learn how NEUROSPECTRA can support your center or research initiative.
            </p>

            <div style="display: flex; flex-direction: column; gap: 20px;">
              <div style="display: flex; align-items: center; gap: 16px;">
                <div style="width: 42px; height: 42px; border-radius: 50%; background: #eff6ff; display: flex; align-items: center; justify-content: center; color: #2563eb; flex-shrink: 0;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <div>
                  <div style="font-size: 12px; color: #64748b; font-weight: 600;">Phone Line</div>
                  <div style="font-size: 15px; font-weight: 700; color: #0f172a;">+91 98450 12345</div>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 16px;">
                <div style="width: 42px; height: 42px; border-radius: 50%; background: #eff6ff; display: flex; align-items: center; justify-content: center; color: #2563eb; flex-shrink: 0;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <div>
                  <div style="font-size: 12px; color: #64748b; font-weight: 600;">Email Support</div>
                  <div style="font-size: 15px; font-weight: 700; color: #0f172a;">support@neurospectra.org</div>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 16px;">
                <div style="width: 42px; height: 42px; border-radius: 50%; background: #eff6ff; display: flex; align-items: center; justify-content: center; color: #2563eb; flex-shrink: 0;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div>
                  <div style="font-size: 12px; color: #64748b; font-weight: 600;">Clinical Headquarters</div>
                  <div style="font-size: 15px; font-weight: 700; color: #0f172a;">742 Healthcare Boulevard, Medical District, Suite 400</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Quick Inquiry Form -->
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 20px; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.04);">
            <h3 style="font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 18px;">Send a Quick Inquiry</h3>
            
            <form onsubmit="event.preventDefault(); window.showToast('Thank you! Your clinical inquiry has been received.', 'success'); this.reset();">
              <div class="form-group" style="margin-bottom: 16px;">
                <label class="form-label" style="font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 6px; display: block;">Your Name</label>
                <input type="text" class="form-control" placeholder="Dr. Sarah Jenkins" required style="padding: 11px 14px; border-radius: 8px; width: 100%;">
              </div>

              <div class="form-group" style="margin-bottom: 16px;">
                <label class="form-label" style="font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 6px; display: block;">Work Email</label>
                <input type="email" class="form-control" placeholder="s.jenkins@clinic.org" required style="padding: 11px 14px; border-radius: 8px; width: 100%;">
              </div>

              <div class="form-group" style="margin-bottom: 16px;">
                <label class="form-label" style="font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 6px; display: block;">Role / Organization Type</label>
                <select class="form-control" style="padding: 11px 14px; border-radius: 8px; width: 100%;">
                  <option>Autism Therapy Center</option>
                  <option>Pediatric Clinic</option>
                  <option>Hospital / Medical Center</option>
                  <option>Academic Researcher</option>
                  <option>Parent / Family</option>
                </select>
              </div>

              <div class="form-group" style="margin-bottom: 22px;">
                <label class="form-label" style="font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 6px; display: block;">How can we help you?</label>
                <textarea class="form-control" rows="3" placeholder="Tell us about your screening or therapy tracking requirements..." required style="padding: 11px 14px; border-radius: 8px; width: 100%;"></textarea>
              </div>

              <button type="submit" style="width: 100%; background: #2563eb; color: #ffffff; font-weight: 700; font-size: 14.5px; padding: 13px; border-radius: 8px; border: none; cursor: pointer; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.25); transition: all 0.2s;" onmouseover="this.style.background='#1d4ed8'" onmouseout="this.style.background='#2563eb'">
                Submit Request
              </button>
            </form>
          </div>

        </div>
      </section>

      <!-- Dark Footer -->
      <footer class="landing-footer">
        <div style="max-width: 1280px; margin: 0 auto;">
          <div class="landing-footer-grid">
            
            <!-- Col 1: Brand -->
            <div>
              <div style="margin-bottom: 16px;">
                ${window.renderBrandLogo ? window.renderBrandLogo('dark', 'normal', true) : `<span style="font-size: 18px; font-weight: 800; color: #ffffff;">NEURO<span style="color:#60a5fa;">SPECTRA</span></span>`}
              </div>
              <p style="font-size: 13.5px; color: #64748b; line-height: 1.6; max-width: 320px;">
                AI-powered autism screening and therapy management platform designed to elevate clinical outcomes and empower families.
              </p>
            </div>

            <!-- Col 2: Platform -->
            <div>
              <div style="font-size: 14px; font-weight: 700; color: #ffffff; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px;">Platform</div>
              <div style="display: flex; flex-direction: column; gap: 10px; font-size: 13.5px;">
                <a href="#" style="color: #94a3b8; transition: color 0.2s;" onclick="window.navigateTo('dashboard'); return false;">Dashboard</a>
                <a href="#" style="color: #94a3b8; transition: color 0.2s;" onclick="window.startNewAssessment(); return false;">Screening Engine</a>
                <a href="#" style="color: #94a3b8; transition: color 0.2s;" onclick="window.navigateTo('therapy-plans'); return false;">Therapy Planning</a>
                <a href="#" style="color: #94a3b8; transition: color 0.2s;" onclick="window.navigateTo('progress'); return false;">Progress Tracker</a>
                <a href="#" style="color: #94a3b8; transition: color 0.2s;" onclick="window.navigateTo('reports'); return false;">Clinical Reports</a>
              </div>
            </div>

            <!-- Col 3: Company -->
            <div>
              <div style="font-size: 14px; font-weight: 700; color: #ffffff; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px;">Company</div>
              <div style="display: flex; flex-direction: column; gap: 10px; font-size: 13.5px;">
                <a href="#" style="color: #94a3b8; transition: color 0.2s;" onclick="document.getElementById('specialists-section').scrollIntoView({behavior:'smooth'}); return false;">About Us</a>
                <a href="#" style="color: #94a3b8; transition: color 0.2s;">Clinical Partners</a>
                <a href="#" style="color: #94a3b8; transition: color 0.2s;">Research & MCA Project</a>
                <a href="#" style="color: #94a3b8; transition: color 0.2s;" onclick="document.getElementById('contact-section').scrollIntoView({behavior:'smooth'}); return false;">Contact Us</a>
              </div>
            </div>

            <!-- Col 4: Legal -->
            <div>
              <div style="font-size: 14px; font-weight: 700; color: #ffffff; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px;">Legal & Ethics</div>
              <div style="display: flex; flex-direction: column; gap: 10px; font-size: 13.5px;">
                <a href="#" style="color: #94a3b8; transition: color 0.2s;" onclick="window.showSettingsModal(); return false;">Data Protection Standards</a>
                <a href="#" style="color: #94a3b8; transition: color 0.2s;" onclick="window.showSettingsModal(); return false;">Medical Disclaimer</a>
                <a href="#" style="color: #94a3b8; transition: color 0.2s;" onclick="window.showSettingsModal(); return false;">Terms of Service</a>
                <a href="#" style="color: #94a3b8; transition: color 0.2s;" onclick="window.showSettingsModal(); return false;">Privacy Policy</a>
              </div>
            </div>

          </div>

          <!-- Bottom Bar -->
          <div class="landing-footer-bottom" style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; font-size: 12.5px; color: #64748b;">
            <div>&copy; 2026 NEUROSPECTRA. All rights reserved. MCA Final-Year Research Implementation.</div>
            <div style="display: flex; gap: 16px;">
              <span style="cursor: pointer;" onclick="window.showToast('LinkedIn Clinical Research channel.', 'info')">LinkedIn</span>
              <span style="cursor: pointer;" onclick="window.showToast('Twitter / X clinical updates.', 'info')">Twitter</span>
              <span style="cursor: pointer;" onclick="window.showToast('YouTube clinical demo tutorials.', 'info')">YouTube</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  `;
};

