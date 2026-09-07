/**
 * NEUROSPECTRA - Core Application Router & View Orchestrator
 */

window.currentRoute = 'landing';
window.routeParams = {};
window.activeChildProfileTab = 'overview';

// Global Logo Click handler: reload if on landing, otherwise redirect to landing
window.handleLogoClick = function() {
  if (window.currentRoute === 'landing') {
    window.location.reload();
  } else {
    window.navigateTo('landing');
  }
};

// Navigation entry point
window.navigateTo = function(route, params = {}) {
  // If attempting to access protected routes without authentication, redirect to login
  if (route !== 'landing' && route !== 'login' && route !== 'register' && !window.neuroAuth.isAuthenticated()) {
    window.currentRoute = 'login';
    window.routeParams = {};
  } else {
    window.currentRoute = route;
    window.routeParams = params;
  }

  window.renderApp();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Render Application UI
window.renderApp = function() {
  const root = document.getElementById('app-root');
  if (!root) return;

  const auth = window.neuroAuth;
  const isAuth = auth.isAuthenticated();
  const currentUser = auth.getCurrentUser();
  const currentRole = auth.getRole();

  // If public / auth routes
  if (!isAuth || window.currentRoute === 'landing' || window.currentRoute === 'login' || window.currentRoute === 'register') {
    let publicContent = '';
    if (window.currentRoute === 'login') {
      publicContent = window.renderLoginPage();
    } else if (window.currentRoute === 'register') {
      publicContent = window.renderRegisterPage();
    } else {
      publicContent = window.renderLandingPage();
    }

    root.innerHTML = `
      ${window.renderDemoBanner()}
      ${publicContent}
    `;
    return;
  }

  // Exact Figma Authenticated Shell Layout
  const pageTitle = currentRole === 'Administrator' ? 'System Administration' : 
                    currentRole === 'Therapist' ? 'Therapist Workspace' : 
                    currentRole === 'Receptionist' ? 'Reception Coordination' : 'Parent Caregiver Portal';
  
  const roleSubtitle = currentRole === 'Administrator' ? 'Super Admin' : 
                       currentRole === 'Therapist' ? 'BCBA Specialist' : 
                       currentRole === 'Receptionist' ? 'Clinical Staff' : 'Parent / Family';

  root.innerHTML = `
    ${window.renderDemoBanner()}
    <div class="app-shell" style="background: #f8fafc; min-height: calc(100vh - 38px);">
      <!-- Exact Dark Navy Figma Sidebar -->
      <aside class="app-sidebar" id="app-sidebar" style="background: #0b1329; border-right: 1px solid rgba(255,255,255,0.06); width: 250px;">
        <div class="sidebar-brand" style="padding: 16px 14px; border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; cursor: pointer;" onclick="window.handleLogoClick()" title="NEUROSPECTRA - Back to Home">
          <div style="background: #ffffff; padding: 6px 12px; border-radius: 8px; display: flex; align-items: center; justify-content: center; width: 100%; box-shadow: 0 2px 8px rgba(0,0,0,0.25); transition: all 0.2s;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
            <img src="assets/logo.png" alt="NEUROSPECTRA" style="height: 26px; width: auto; max-width: 100%; object-fit: contain; display: block;">
          </div>
        </div>

        <!-- Role Nav Menu -->
        <nav class="sidebar-nav" style="padding: 16px 10px; display: flex; flex-direction: column; gap: 4px;">
          ${window.renderSidebarNavItems(currentRole)}
        </nav>
      </aside>

      <!-- Main Workspace Area -->
      <main class="app-main" style="background: #f8fafc; flex: 1;">
        <!-- Exact Figma Topbar Header -->
        <header class="app-topbar no-print" style="background: #ffffff; border-bottom: 1px solid #e2e8f0; height: 74px; padding: 0 36px;">
          <div style="display: flex; align-items: center; gap: 16px;">
            <button class="mobile-nav-toggle" onclick="document.getElementById('app-sidebar').classList.toggle('open')">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <h1 style="font-size: 22px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px;">${pageTitle}</h1>
          </div>

          <!-- Center Rounded Search Bar from Figma -->
          <div style="flex: 1; max-width: 440px; margin: 0 24px; position: relative;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2.2" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); pointer-events: none;">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="text" class="form-control" placeholder="Search patients, trials, sessions..." style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 9999px; padding: 9px 18px 9px 40px; font-size: 13px; width: 100%; color: #0f172a;" oninput="window.filterChildrenTable(this.value)">
          </div>

          <!-- Right Header Items -->
          <div style="display: flex; align-items: center; gap: 20px;">
            <!-- Notification Bell with Red Dot -->
            <button style="position: relative; background: transparent; border: none; cursor: pointer; color: #64748b; padding: 8px;" onclick="window.toggleNotificationsPopover()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              <span style="position: absolute; top: 6px; right: 6px; width: 7px; height: 7px; background: #ef4444; border-radius: 50%; border: 1.5px solid #ffffff;"></span>
            </button>

            <!-- Notifications Popover -->
            <div class="notifications-popover" id="notifications-popover" style="right: 180px; top: 64px;">
              <div style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9; font-weight: 700; font-size: 13px; color: #0f172a;">
                Notifications & Clinical Reminders
              </div>
              <div style="max-height: 320px; overflow-y: auto;">
                ${window.renderNotificationsList()}
              </div>
            </div>

            <!-- Profile User Pill -->
            <div style="display: flex; align-items: center; gap: 12px; cursor: pointer;" onclick="window.showUserProfileModal()" title="View & Edit My Profile">
              <div style="text-align: right;">
                <div style="font-size: 14px; font-weight: 700; color: #0f172a;">${currentUser.full_name.split(' ')[0]} ${currentUser.full_name.split(' ')[1] || ''}</div>
                <div style="font-size: 11.5px; color: #64748b; font-weight: 500;">${roleSubtitle}</div>
              </div>
              <img src="${currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=128'}" alt="User Avatar" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 1.5px solid #e2e8f0; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.08)'" onmouseout="this.style.transform='scale(1)'">
            </div>
          </div>
        </header>

        <!-- Dynamic Main Content -->
        <div class="app-content" style="padding: 32px 36px; max-width: 1440px;">
          ${window.renderRouteContent()}
        </div>
      </main>
    </div>
  `;
};

// Exact Figma Sidebar Nav Items
window.renderSidebarNavItems = function(role) {
  if (role === 'Administrator') {
    return `
      <button class="nav-item-btn ${window.currentRoute === 'dashboard' ? 'active' : ''}" style="${window.currentRoute === 'dashboard' ? 'background: #1e293b; color: #ffffff; font-weight: 700; border-radius: 8px;' : 'color: #94a3b8;'}" onclick="window.navigateTo('dashboard')">
        <span class="nav-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg></span>
        Dashboard
      </button>
      <button class="nav-item-btn ${window.currentRoute === 'users' && (!window.routeParams.roleFilter || window.routeParams.roleFilter === 'All') ? 'active' : ''}" style="${window.currentRoute === 'users' && (!window.routeParams.roleFilter || window.routeParams.roleFilter === 'All') ? 'background: #1e293b; color: #ffffff; font-weight: 700; border-radius: 8px;' : 'color: #94a3b8;'}" onclick="window.navigateTo('users', { roleFilter: 'All' })">
        <span class="nav-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></span>
        Users
      </button>
      <button class="nav-item-btn ${window.currentRoute === 'children' ? 'active' : ''}" style="${window.currentRoute === 'children' ? 'background: #1e293b; color: #ffffff; font-weight: 700; border-radius: 8px;' : 'color: #94a3b8;'}" onclick="window.navigateTo('children')">
        <span class="nav-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg></span>
        Children
      </button>
      <button class="nav-item-btn ${window.currentRoute === 'users' && window.routeParams.roleFilter === 'Therapist' ? 'active' : ''}" style="${window.currentRoute === 'users' && window.routeParams.roleFilter === 'Therapist' ? 'background: #1e293b; color: #ffffff; font-weight: 700; border-radius: 8px;' : 'color: #94a3b8;'}" onclick="window.navigateTo('users', { roleFilter: 'Therapist' })">
        <span class="nav-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></span>
        Therapists
      </button>
      <button class="nav-item-btn ${window.currentRoute === 'users' && window.routeParams.roleFilter === 'Teacher' ? 'active' : ''}" style="${window.currentRoute === 'users' && window.routeParams.roleFilter === 'Teacher' ? 'background: #1e293b; color: #ffffff; font-weight: 700; border-radius: 8px;' : 'color: #94a3b8;'}" onclick="window.navigateTo('users', { roleFilter: 'Teacher' })">
        <span class="nav-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/></svg></span>
        Teachers
      </button>
      <button class="nav-item-btn ${window.currentRoute === 'appointments' ? 'active' : ''}" style="color: #94a3b8;" onclick="window.navigateTo('appointments')">
        <span class="nav-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></span>
        Appointments
      </button>
      <button class="nav-item-btn ${window.currentRoute === 'reports' ? 'active' : ''}" style="color: #94a3b8;" onclick="window.navigateTo('reports')">
        <span class="nav-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></span>
        Reports
      </button>
      <button class="nav-item-btn ${window.currentRoute === 'settings' ? 'active' : ''}" style="color: #94a3b8;" onclick="window.showSettingsModal()">
        <span class="nav-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></span>
        Settings
      </button>
      <button class="nav-item-btn" style="color: #94a3b8; margin-top: 8px;" onclick="window.handleLogout()">
        <span class="nav-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></span>
        Logout
      </button>
    `;
  }

  if (role === 'Therapist') {
    return `
      <button class="nav-item-btn ${window.currentRoute === 'dashboard' ? 'active' : ''}" style="${window.currentRoute === 'dashboard' ? 'background: #1e293b; color: #ffffff; font-weight: 700; border-radius: 8px;' : 'color: #94a3b8;'}" onclick="window.navigateTo('dashboard')">
        <span class="nav-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg></span>
        Dashboard
      </button>
      <button class="nav-item-btn ${window.currentRoute === 'my-children' ? 'active' : ''}" style="color: #94a3b8;" onclick="window.navigateTo('my-children')">
        <span class="nav-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg></span>
        Assigned Children
      </button>
      <button class="nav-item-btn ${window.currentRoute === 'assessments' ? 'active' : ''}" style="color: #94a3b8;" onclick="window.navigateTo('assessments')">
        <span class="nav-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></span>
        Assessments
      </button>
      <button class="nav-item-btn ${window.currentRoute === 'therapy-plans' ? 'active' : ''}" style="color: #94a3b8;" onclick="window.navigateTo('therapy-plans')">
        <span class="nav-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span>
        Therapy Plans
      </button>
      <button class="nav-item-btn ${window.currentRoute === 'sessions' ? 'active' : ''}" style="color: #94a3b8;" onclick="window.navigateTo('sessions')">
        <span class="nav-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></span>
        Sessions
      </button>
      <button class="nav-item-btn ${window.currentRoute === 'progress' ? 'active' : ''}" style="color: #94a3b8;" onclick="window.navigateTo('progress')">
        <span class="nav-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></span>
        Progress Reports
      </button>
      <button class="nav-item-btn ${window.currentRoute === 'appointments' ? 'active' : ''}" style="color: #94a3b8;" onclick="window.navigateTo('appointments')">
        <span class="nav-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></span>
        Appointments
      </button>
      <button class="nav-item-btn ${window.currentRoute === 'messages' ? 'active' : ''}" style="color: #94a3b8;" onclick="window.navigateTo('messages')">
        <span class="nav-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></span>
        Messages
      </button>
      <button class="nav-item-btn" style="color: #94a3b8; margin-top: 8px;" onclick="window.handleLogout()">
        <span class="nav-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></span>
        Logout
      </button>
    `;
  }

  // Receptionist / Parent defaults
  return `
    <button class="nav-item-btn ${window.currentRoute === 'dashboard' ? 'active' : ''}" style="${window.currentRoute === 'dashboard' ? 'background: #1e293b; color: #ffffff; font-weight: 700; border-radius: 8px;' : 'color: #94a3b8;'}" onclick="window.navigateTo('dashboard')">
      <span class="nav-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg></span>
      Dashboard
    </button>
    <button class="nav-item-btn ${window.currentRoute === 'children' ? 'active' : ''}" style="${window.currentRoute === 'children' ? 'background: #1e293b; color: #ffffff; font-weight: 700; border-radius: 8px;' : 'color: #94a3b8;'}" onclick="window.navigateTo('children')">
      <span class="nav-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg></span>
      Children
    </button>
    <button class="nav-item-btn ${window.currentRoute === 'appointments' ? 'active' : ''}" style="${window.currentRoute === 'appointments' ? 'background: #1e293b; color: #ffffff; font-weight: 700; border-radius: 8px;' : 'color: #94a3b8;'}" onclick="window.navigateTo('appointments')">
      <span class="nav-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></span>
      Appointments
    </button>
    <button class="nav-item-btn ${window.currentRoute === 'reports' ? 'active' : ''}" style="${window.currentRoute === 'reports' ? 'background: #1e293b; color: #ffffff; font-weight: 700; border-radius: 8px;' : 'color: #94a3b8;'}" onclick="window.navigateTo('reports')">
      <span class="nav-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></span>
      Reports
    </button>
    <button class="nav-item-btn" style="color: #94a3b8;" onclick="window.handleLogout()">
      <span class="nav-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></span>
      Logout
    </button>
  `;
};

// Exact Figma Split-Screen Login Page (Frame 3)
window.renderLoginPage = function() {
  return `
    <div style="min-height: 100vh; display: flex; background: #ffffff; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;">
      
      <!-- Left Column: Photographic Pediatric Clinic Hero Panel -->
      <div style="flex: 1.15; background: linear-gradient(180deg, rgba(15, 23, 42, 0.48) 0%, rgba(15, 23, 42, 0.72) 100%), url('assets/login_bg.jpg'), url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200'), #0f172a; background-size: cover; background-position: center; padding: 64px 64px; display: flex; flex-direction: column; justify-content: space-between; position: relative; color: #ffffff;">
        
        <!-- Top Logo -->
        <div style="display: inline-flex; align-items: center; cursor: pointer; background: rgba(255, 255, 255, 0.95); padding: 8px 16px; border-radius: 10px; backdrop-filter: blur(8px); box-shadow: 0 4px 16px rgba(0,0,0,0.2); width: fit-content; transition: transform 0.2s;" onclick="window.handleLogoClick()" onmouseover="this.style.transform='scale(1.03)'" onmouseout="this.style.transform='scale(1)'" title="NEUROSPECTRA - Back to Home">
          <img src="assets/logo.png" alt="NEUROSPECTRA" style="height: 32px; width: auto; display: block; object-fit: contain;">
        </div>

        <!-- Center Headline & Accent Line -->
        <div style="max-width: 540px; margin: 40px 0;">
          <h2 style="font-size: 42px; font-weight: 800; line-height: 1.2; color: #ffffff; letter-spacing: -0.8px; margin-bottom: 20px;">
            Integrated diagnostic trackers and behavioral analytics at your fingertips.
          </h2>
          <div style="width: 56px; height: 4.5px; background: #3b82f6; border-radius: 3px; margin-bottom: 24px;"></div>
          <p style="font-size: 16px; color: #e2e8f0; line-height: 1.65; font-weight: 400; opacity: 0.95;">
            Connecting pediatric clinics, schools, and home routines to optimize diagnostic accuracy and daily development progress.
          </p>
        </div>

        <!-- Footer Notice -->
        <div style="font-size: 12.5px; color: rgba(255, 255, 255, 0.7); font-weight: 500;">
          &copy; 2026 NEUROSPECTRA. Pediatric Autism Care Portal.
        </div>
      </div>

      <!-- Right Column: Clean White Login Form -->
      <div style="flex: 0.85; min-width: 460px; max-width: 580px; display: flex; align-items: center; justify-content: center; padding: 48px 64px; background: #ffffff;">
        <div style="width: 100%; max-width: 420px;">
          
          <h2 style="font-size: 32px; font-weight: 800; color: #0f172a; letter-spacing: -0.6px; margin-bottom: 8px;">
            Welcome back
          </h2>
          <p style="font-size: 14.5px; color: #64748b; margin-bottom: 28px;">
            Access your personalized clinical dashboard
          </p>

          <!-- Dynamic Form Error Alert -->
          <div id="login-alert-box" style="display: none;"></div>

          <form id="login-form" novalidate onsubmit="window.handleLoginForm(event)">
            
            <div class="form-group" style="margin-bottom: 18px;">
              <label class="form-label" style="font-size: 13px; font-weight: 600; color: #1e293b; margin-bottom: 8px; display: block;">
                Email Address <span style="color: #ef4444;">*</span>
              </label>
              <input type="email" id="login-email" class="form-control" placeholder="therapist@hopecenter.com" required value="therapist@neurospectra.org" style="width: 100%; padding: 12px 16px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 14px; color: #0f172a; outline: none; transition: all 0.2s;" oninput="window.validateLoginEmail(false)" onblur="window.validateLoginEmail(true)">
              <div id="login-email-error" class="field-error-msg" style="display: none;"></div>
            </div>

            <div class="form-group" style="margin-bottom: 18px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <label class="form-label" style="font-size: 13px; font-weight: 600; color: #1e293b; margin-bottom: 0;">
                  Password <span style="color: #ef4444;">*</span>
                </label>
                <a href="#" style="font-size: 12.5px; font-weight: 600; color: #2563eb; text-decoration: none;" onclick="window.showToast('Demo Credentials: Use quick switch pills on top banner anytime.', 'info'); return false;">Forgot Password?</a>
              </div>
              <div style="position: relative;">
                <input type="password" id="login-password" class="form-control" placeholder="••••••••••••" required value="therapist123" style="width: 100%; padding: 12px 42px 12px 16px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 14px; color: #0f172a; outline: none; transition: all 0.2s;" oninput="window.validateLoginPassword(false)" onblur="window.validateLoginPassword(true)">
                <button type="button" onclick="window.togglePasswordVisibility('login-password', this)" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #94a3b8; padding: 4px; display: flex; align-items: center; justify-content: center;" title="Show/Hide password">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
              <div id="login-password-error" class="field-error-msg" style="display: none;"></div>
            </div>

            <!-- Keep me logged in Checkbox -->
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 26px;">
              <input type="checkbox" id="keep-logged-in" checked style="width: 16px; height: 16px; accent-color: #2563eb; cursor: pointer; border-radius: 4px;">
              <label for="keep-logged-in" style="font-size: 13.5px; color: #475569; cursor: pointer; user-select: none;">Keep me logged in for 30 days</label>
            </div>

            <button type="submit" id="btn-login-submit" style="width: 100%; background: #3b82f6; color: #ffffff; font-weight: 700; font-size: 15px; padding: 13px; border-radius: 8px; border: none; cursor: pointer; box-shadow: 0 4px 14px rgba(59, 130, 246, 0.3); transition: all 0.2s;" onmouseover="this.style.background='#2563eb'" onmouseout="this.style.background='#3b82f6'">
              Login to Platform
            </button>
          </form>

          <div style="margin-top: 28px; text-align: center; font-size: 14px; color: #64748b;">
            Don't have an account? <a href="#" style="font-weight: 700; color: #2563eb; text-decoration: none;" onclick="window.navigateTo('register'); return false;">Register here</a>
          </div>

        </div>
      </div>

    </div>
  `;
};

// Exact Figma Split-Screen Register Page (Frame 4)
window.renderRegisterPage = function() {
  return `
    <div style="min-height: 100vh; display: flex; background: #ffffff; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;">
      
      <!-- Left Column: Sensory Gym Background Panel -->
      <div style="flex: 1.15; background: linear-gradient(180deg, rgba(15, 23, 42, 0.48) 0%, rgba(15, 23, 42, 0.72) 100%), url('assets/register_bg.jpg'), url('https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&q=80&w=1200'), #0f172a; background-size: cover; background-position: center; padding: 64px 64px; display: flex; flex-direction: column; justify-content: space-between; position: relative; color: #ffffff;">
        
        <!-- Top Logo -->
        <div style="display: inline-flex; align-items: center; cursor: pointer; background: rgba(255, 255, 255, 0.95); padding: 8px 16px; border-radius: 10px; backdrop-filter: blur(8px); box-shadow: 0 4px 16px rgba(0,0,0,0.2); width: fit-content; transition: transform 0.2s;" onclick="window.handleLogoClick()" onmouseover="this.style.transform='scale(1.03)'" onmouseout="this.style.transform='scale(1)'" title="NEUROSPECTRA - Back to Home">
          <img src="assets/logo.png" alt="NEUROSPECTRA" style="height: 32px; width: auto; display: block; object-fit: contain;">
        </div>

        <!-- Center Headline & Accent Line -->
        <div style="max-width: 540px; margin: 40px 0;">
          <h2 style="font-size: 42px; font-weight: 800; line-height: 1.2; color: #ffffff; letter-spacing: -0.8px; margin-bottom: 20px;">
            Join the leading pediatric autism network
          </h2>
          <div style="width: 56px; height: 4.5px; background: #3b82f6; border-radius: 3px; margin-bottom: 24px;"></div>
          <p style="font-size: 16px; color: #e2e8f0; line-height: 1.65; font-weight: 400; opacity: 0.95;">
            Access secure diagnostic assessment flows, digital milestone trackers, and real-time messaging across pediatric clinics and parenting circles.
          </p>
        </div>

        <!-- Footer Notice -->
        <div style="font-size: 12.5px; color: rgba(255, 255, 255, 0.7); font-weight: 500;">
          &copy; 2026 NEUROSPECTRA. Pediatric Autism Care Portal.
        </div>
      </div>

      <!-- Right Column: Clean White Register Form -->
      <div style="flex: 0.85; min-width: 460px; max-width: 580px; display: flex; align-items: center; justify-content: center; padding: 36px 64px; background: #ffffff; overflow-y: auto;">
        <div style="width: 100%; max-width: 420px;">
          
          <h2 style="font-size: 30px; font-weight: 800; color: #0f172a; letter-spacing: -0.6px; margin-bottom: 6px;">
            Create your account
          </h2>
          <p style="font-size: 14px; color: #64748b; margin-bottom: 20px;">
            Start tracking behavioral trials and diagnostics securely
          </p>

          <!-- Dynamic Form Error Alert -->
          <div id="reg-alert-box" style="display: none;"></div>

          <form id="register-form" novalidate onsubmit="window.handleRegisterForm(event)">
            
            <!-- Segmented Profile Role Selector (Controlled Phase 1 Roles) -->
            <div style="margin-bottom: 15px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <label class="form-label" style="font-size: 12.5px; font-weight: 600; color: #1e293b; margin-bottom: 0; display: block;">Choose your profile role <span style="color: #ef4444;">*</span></label>
                <span id="role-auth-badge" style="font-size: 11px; font-weight: 600; color: #2563eb; background: #eff6ff; padding: 2px 8px; border-radius: 4px;">Self-Service</span>
              </div>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); background: #f1f5f9; padding: 4px; border-radius: 8px; gap: 4px;" id="reg-role-selector">
                <button type="button" class="role-select-pill active" style="padding: 8px; font-size: 12.5px; font-weight: 700; border-radius: 6px; border: none; background: #ffffff; color: #2563eb; box-shadow: 0 1px 3px rgba(0,0,0,0.1); cursor: pointer; transition: all 0.2s;" onclick="window.selectRegRole('Parent / Caregiver', this)">Parent</button>
                <button type="button" class="role-select-pill" style="padding: 8px; font-size: 12.5px; font-weight: 600; border-radius: 6px; border: none; background: transparent; color: #64748b; cursor: pointer; transition: all 0.2s;" onclick="window.selectRegRole('Teacher', this)">Teacher</button>
                <button type="button" class="role-select-pill" style="padding: 8px; font-size: 12.5px; font-weight: 600; border-radius: 6px; border: none; background: transparent; color: #64748b; cursor: pointer; transition: all 0.2s;" onclick="window.selectRegRole('Therapist', this)">Therapist</button>
              </div>
            </div>

            <div class="form-group" style="margin-bottom: 12px;">
              <label class="form-label" style="font-size: 12.5px; font-weight: 600; color: #1e293b; margin-bottom: 5px; display: block;">
                Full Name <span style="color: #ef4444;">*</span>
              </label>
              <input type="text" id="reg-fullname" class="form-control" placeholder="Dr. Evelyn Ross, PsyD" required style="width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 13.5px; color: #0f172a; outline: none; transition: all 0.2s;" oninput="window.validateRegFullName(false)" onblur="window.validateRegFullName(true)">
              <div id="reg-fullname-error" class="field-error-msg" style="display: none;"></div>
            </div>

            <div class="form-group" style="margin-bottom: 12px;">
              <label class="form-label" style="font-size: 12.5px; font-weight: 600; color: #1e293b; margin-bottom: 5px; display: block;">
                Work Email <span style="color: #ef4444;">*</span>
              </label>
              <input type="email" id="reg-email" class="form-control" placeholder="evelyn@center.com" required style="width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 13.5px; color: #0f172a; outline: none; transition: all 0.2s;" oninput="window.validateRegEmail(false)" onblur="window.validateRegEmail(true)">
              <div id="reg-email-error" class="field-error-msg" style="display: none;"></div>
            </div>

            <div class="form-group" style="margin-bottom: 12px;">
              <label class="form-label" style="font-size: 12.5px; font-weight: 600; color: #1e293b; margin-bottom: 5px; display: block;">
                Phone Number (Indian Mobile) <span style="color: #ef4444;">*</span>
              </label>
              <input type="tel" id="reg-phone" class="form-control" placeholder="9876543210" required maxlength="15" style="width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 13.5px; color: #0f172a; outline: none; transition: all 0.2s;" oninput="window.validateRegPhone(false)" onblur="window.validateRegPhone(true)">
              <div id="reg-phone-error" class="field-error-msg" style="display: none;"></div>
            </div>

            <div class="form-group" style="margin-bottom: 12px;">
              <label class="form-label" style="font-size: 12.5px; font-weight: 600; color: #1e293b; margin-bottom: 5px; display: block;">
                Create Password <span style="color: #ef4444;">*</span>
              </label>
              <div style="position: relative;">
                <input type="password" id="reg-password" class="form-control" placeholder="Min. 8 chars (letters, numbers, symbols)" required style="width: 100%; padding: 10px 42px 10px 14px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 13.5px; color: #0f172a; outline: none; transition: all 0.2s;" oninput="window.validateRegPassword(false)" onblur="window.validateRegPassword(true)">
                <button type="button" onclick="window.togglePasswordVisibility('reg-password', this)" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #94a3b8; padding: 4px; display: flex; align-items: center; justify-content: center;" title="Show/Hide password">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
              <div id="reg-password-error" class="field-error-msg" style="display: none;"></div>

              <!-- Live Password Strength & Requirements Checklist -->
              <div id="reg-pwd-meter-container" style="display: none; margin-top: 8px; padding: 8px 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; animation: fadeInDown 0.2s ease;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <span style="font-size: 11px; font-weight: 600; color: #475569;">Password Strength:</span>
                  <span id="pwd-strength-label" style="font-size: 11px; font-weight: 700; color: #ef4444;">Weak</span>
                </div>
                <div style="width: 100%; height: 4px; background: #e2e8f0; border-radius: 2px; overflow: hidden; margin-bottom: 8px;">
                  <div id="pwd-strength-bar" style="width: 25%; height: 100%; background: #ef4444; transition: all 0.3s ease;"></div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 10.5px;">
                  <div id="pwd-req-len" style="display: flex; align-items: center; gap: 5px; padding: 2px 6px; border-radius: 4px; border: 1px solid #e2e8f0; background: #f1f5f9; color: #64748b; font-weight: 500;">
                    <span class="check-icon" style="font-weight: 700;">○</span> 8+ characters
                  </div>
                  <div id="pwd-req-num" style="display: flex; align-items: center; gap: 5px; padding: 2px 6px; border-radius: 4px; border: 1px solid #e2e8f0; background: #f1f5f9; color: #64748b; font-weight: 500;">
                    <span class="check-icon" style="font-weight: 700;">○</span> 1+ number (0-9)
                  </div>
                  <div id="pwd-req-sym" style="display: flex; align-items: center; gap: 5px; padding: 2px 6px; border-radius: 4px; border: 1px solid #e2e8f0; background: #f1f5f9; color: #64748b; font-weight: 500;">
                    <span class="check-icon" style="font-weight: 700;">○</span> 1+ symbol (!@#$)
                  </div>
                  <div id="pwd-req-case" style="display: flex; align-items: center; gap: 5px; padding: 2px 6px; border-radius: 4px; border: 1px solid #e2e8f0; background: #f1f5f9; color: #64748b; font-weight: 500;">
                    <span class="check-icon" style="font-weight: 700;">○</span> Upper & lower
                  </div>
                </div>
              </div>
            </div>

            <!-- Confirm Password Field -->
            <div class="form-group" style="margin-bottom: 14px;">
              <label class="form-label" style="font-size: 12.5px; font-weight: 600; color: #1e293b; margin-bottom: 5px; display: block;">
                Confirm Password <span style="color: #ef4444;">*</span>
              </label>
              <div style="position: relative;">
                <input type="password" id="reg-confirm-password" class="form-control" placeholder="Re-enter your password" required style="width: 100%; padding: 10px 42px 10px 14px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 13.5px; color: #0f172a; outline: none; transition: all 0.2s;" oninput="window.validateRegConfirmPassword(false)" onblur="window.validateRegConfirmPassword(true)">
                <button type="button" onclick="window.togglePasswordVisibility('reg-confirm-password', this)" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #94a3b8; padding: 4px; display: flex; align-items: center; justify-content: center;" title="Show/Hide password">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
              <div id="reg-confirm-password-error" class="field-error-msg" style="display: none;"></div>
            </div>

            <!-- Terms Checkbox -->
            <div style="margin-bottom: 18px;">
              <div style="display: flex; align-items: flex-start; gap: 10px;">
                <input type="checkbox" id="agree-terms" checked required style="width: 16px; height: 16px; accent-color: #2563eb; margin-top: 2px; cursor: pointer; border-radius: 4px;" onchange="window.validateRegTerms(false)">
                <label for="agree-terms" style="font-size: 12.5px; color: #64748b; line-height: 1.5; cursor: pointer; user-select: none;">
                  By continuing, you agree to our <a href="#" style="color: #2563eb; font-weight: 600; text-decoration: none;">Terms of Service</a> and <a href="#" style="color: #2563eb; font-weight: 600; text-decoration: none;">Privacy Policy</a>.
                </label>
              </div>
              <div id="reg-terms-error" class="field-error-msg" style="display: none; margin-left: 26px;"></div>
            </div>

            <button type="submit" id="btn-reg-submit" style="width: 100%; background: #3b82f6; color: #ffffff; font-weight: 700; font-size: 15px; padding: 12px; border-radius: 8px; border: none; cursor: pointer; box-shadow: 0 4px 14px rgba(59, 130, 246, 0.3); transition: all 0.2s;" onmouseover="this.style.background='#2563eb'" onmouseout="this.style.background='#3b82f6'">
              Register Account
            </button>
          </form>

          <div style="margin-top: 20px; text-align: center; font-size: 13.5px; color: #64748b;">
            Already have an account? <a href="#" style="font-weight: 700; color: #2563eb; text-decoration: none;" onclick="window.navigateTo('login'); return false;">Login here</a>
          </div>

        </div>
      </div>

    </div>
  `;
};

window.selectedRegRole = 'Parent / Caregiver';
window.selectRegRole = function(role, btn) {
  window.selectedRegRole = role;
  const container = document.getElementById('reg-role-selector');
  const authBadge = document.getElementById('role-auth-badge');
  if (container) {
    container.querySelectorAll('.role-select-pill').forEach(b => {
      b.style.background = 'transparent';
      b.style.color = '#64748b';
      b.style.boxShadow = 'none';
      b.style.fontWeight = '600';
    });
    btn.style.background = '#ffffff';
    btn.style.color = '#2563eb';
    btn.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
    btn.style.fontWeight = '700';
  }
  if (authBadge) {
    if (role === 'Therapist' || role === 'Administrator' || role === 'Receptionist') {
      authBadge.textContent = 'Requires Auth';
      authBadge.style.background = '#fef2f2';
      authBadge.style.color = '#b91c1c';
    } else {
      authBadge.textContent = 'Self-Service';
      authBadge.style.background = '#eff6ff';
      authBadge.style.color = '#2563eb';
    }
  }
};

// Demo Switcher Banner
window.renderDemoBanner = function() {
  const currentRole = window.neuroAuth.getRole();
  return `
    <div class="demo-role-banner no-print">
      <div class="brand-badge">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
        <span>MCA EVALUATION DEMO SWITCHER:</span>
      </div>
      <div class="role-pills">
        <button class="role-pill-btn ${currentRole === 'Administrator' ? 'active' : ''}" onclick="window.switchDemo('Administrator')">
          👑 Administrator
        </button>
        <button class="role-pill-btn ${currentRole === 'Therapist' ? 'active' : ''}" onclick="window.switchDemo('Therapist')">
          🩺 Therapist (Dr. Aisha)
        </button>
        <button class="role-pill-btn ${currentRole === 'Receptionist' ? 'active' : ''}" onclick="window.switchDemo('Receptionist')">
          📋 Receptionist (Sarah)
        </button>
        <button class="role-pill-btn ${currentRole === 'Parent / Caregiver' ? 'active' : ''}" onclick="window.switchDemo('Parent / Caregiver')">
          👨‍👩‍👧 Parent (Priya Sharma)
        </button>
        <button class="role-pill-btn" style="background: rgba(239, 68, 68, 0.2); border-color: rgba(239, 68, 68, 0.4);" onclick="window.navigateTo('landing')">
          🌐 Public Landing Page
        </button>
      </div>
    </div>
  `;
};

window.switchDemo = function(role) {
  try {
    window.neuroAuth.switchDemoRole(role);
    window.navigateTo('dashboard');
    window.showToast(`Switched active persona to ${role}`, 'success');
  } catch (e) {
    window.showToast(e.message, 'error');
  }
};

window.handleLogout = function() {
  window.neuroAuth.logout();
  window.navigateTo('landing');
  window.showToast('You have been signed out.', 'info');
};

// Route Content Selector
window.renderRouteContent = function() {
  const role = window.neuroAuth.getRole();
  const route = window.currentRoute;
  const params = window.routeParams;

  if (route === 'dashboard') {
    if (role === 'Administrator') return window.renderAdminDashboard();
    if (role === 'Therapist') return window.renderTherapistDashboard();
    if (role === 'Receptionist') return window.renderReceptionistDashboard();
    if (role === 'Teacher') return window.renderTeacherDashboard();
    return window.renderParentDashboard();
  }

  if (route === 'users' && role === 'Administrator') {
    return window.renderAdminUsers();
  }

  if (route === 'children' || route === 'my-children' || route === 'my-child') {
    if (role === 'Parent / Caregiver') {
      const children = window.neuroDB.getChildren().filter(c => c.primary_parent_id === window.neuroAuth.getCurrentUser().id);
      if (children.length > 0) return window.renderChildProfile(children[0].id);
      return window.renderParentDashboard();
    }
    return window.renderChildrenMasterList();
  }

  if (route === 'child-profile') {
    return window.renderChildProfile(params.childId || 'ch_101');
  }

  if (route === 'assessments') {
    return window.renderAssessmentsListView();
  }

  if (route === 'assessment-conduct') {
    return window.renderAssessmentConductView(params.childId);
  }

  if (route === 'therapy-plans' || route === 'therapy-plan') {
    return window.renderTherapyPlansView();
  }

  if (route === 'sessions') {
    return window.renderSessionsListView();
  }

  if (route === 'progress') {
    return window.renderProgressTrackerView(params.childId);
  }

  if (route === 'appointments' || route === 'schedule') {
    return window.renderAppointmentsMasterView();
  }

  if (route === 'reminders') {
    return window.renderRemindersView();
  }

  if (route === 'reports') {
    if (role === 'Receptionist' && window.renderReceptionistReports) {
      return window.renderReceptionistReports();
    }
    return window.renderReportsMasterList();
  }

  if (route === 'report-view') {
    if (role === 'Receptionist') {
      window.showToast('Access Restricted: Detailed clinical findings are restricted to clinical practitioners and caregivers.', 'warning');
      return window.renderReceptionistReports ? window.renderReceptionistReports() : '';
    }
    return window.renderReportView(params.childId);
  }

  if (route === 'messages') {
    return window.renderMessagingView(params.childId);
  }

  if (route === 'profile' || route === 'settings') {
    return window.renderUserProfileView();
  }

  // Fallback
  return window.renderAdminDashboard();
};

window.renderCurrentView = function() {
  window.renderApp();
};

// ==========================================================================
// Form Validation & Interaction Helpers
// ==========================================================================

window.validateEmail = function(email) {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email || '').trim());
};

window.validateIndianPhone = function(phone) {
  let digits = String(phone || '').replace(/[\s-]/g, '').trim().replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    digits = digits.substring(2);
  } else if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.substring(1);
  }
  return /^[6-9]\d{9}$/.test(digits);
};

window.validateFullName = function(name) {
  const clean = String(name || '').trim();
  return clean.length >= 3 && clean.length <= 100 && /^[a-zA-Z\s'-]+$/.test(clean);
};

// Password Complexity Checker
window.checkPasswordStrength = function(password) {
  const pwd = String(password || '');
  const hasLength = pwd.length >= 8;
  const hasNumber = /[0-9]/.test(pwd);
  const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(pwd);
  const hasUpper = /[A-Z]/.test(pwd);
  const hasLower = /[a-z]/.test(pwd);
  const hasCase = hasUpper && hasLower;

  let score = 0;
  if (hasLength) score++;
  if (hasNumber) score++;
  if (hasSymbol) score++;
  if (hasCase) score++;

  return {
    hasLength,
    hasNumber,
    hasSymbol,
    hasUpper,
    hasLower,
    hasCase,
    score,
    isValid: hasLength && hasNumber && hasSymbol && hasCase
  };
};

window.showFieldSuccess = function(fieldId, errorId) {
  const field = document.getElementById(fieldId);
  const errEl = document.getElementById(errorId);
  if (field) {
    field.classList.remove('is-invalid');
    field.classList.add('is-valid');
  }
  if (errEl) {
    errEl.innerHTML = '';
    errEl.style.display = 'none';
  }
};

window.showFieldError = function(fieldId, errorId, message) {
  const field = document.getElementById(fieldId);
  const errEl = document.getElementById(errorId);
  if (field) {
    field.classList.add('is-invalid');
    field.classList.remove('is-valid');
  }
  if (errEl) {
    errEl.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <span>${message}</span>
    `;
    errEl.style.display = 'flex';
  }
};

window.clearFieldError = function(fieldId, errorId) {
  const field = document.getElementById(fieldId);
  const errEl = document.getElementById(errorId);
  if (field) {
    field.classList.remove('is-invalid');
  }
  if (errEl) {
    errEl.innerHTML = '';
    errEl.style.display = 'none';
  }
};

window.showFormAlert = function(containerId, message) {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = `
      <div class="form-alert-banner">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span>${message}</span>
      </div>
    `;
    container.style.display = 'block';
  }
};

window.clearFormAlert = function(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = '';
    container.style.display = 'none';
  }
};

window.togglePasswordVisibility = function(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
    btn.title = "Hide password";
  } else {
    input.type = 'password';
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
    btn.title = "Show password";
  }
};

// --- Real-Time Login Validation Triggers ---
window.validateLoginEmail = function(isBlur = false) {
  const input = document.getElementById('login-email');
  const val = input?.value.trim() || '';
  if (!val) {
    if (isBlur) window.showFieldError('login-email', 'login-email-error', 'Email is required.');
    else window.clearFieldError('login-email', 'login-email-error');
    return false;
  }
  if (!window.validateEmail(val)) {
    if (isBlur) window.showFieldError('login-email', 'login-email-error', 'Enter a valid email address.');
    else window.clearFieldError('login-email', 'login-email-error');
    return false;
  }
  window.showFieldSuccess('login-email', 'login-email-error');
  return true;
};

window.validateLoginPassword = function(isBlur = false) {
  const input = document.getElementById('login-password');
  const val = input?.value || '';
  if (!val || val.trim().length === 0) {
    if (isBlur) window.showFieldError('login-password', 'login-password-error', 'Password is required.');
    else window.clearFieldError('login-password', 'login-password-error');
    return false;
  }
  if (val.length < 8) {
    if (isBlur) window.showFieldError('login-password', 'login-password-error', 'Password must be at least 8 characters.');
    else window.clearFieldError('login-password', 'login-password-error');
    return false;
  }
  window.showFieldSuccess('login-password', 'login-password-error');
  return true;
};

// --- Real-Time Registration Validation Triggers ---
window.validateRegFullName = function(isBlur = false) {
  const input = document.getElementById('reg-fullname');
  const val = input?.value.trim() || '';
  if (!val) {
    if (isBlur) window.showFieldError('reg-fullname', 'reg-fullname-error', 'Full name is required.');
    else window.clearFieldError('reg-fullname', 'reg-fullname-error');
    return false;
  }
  if (val.length < 3) {
    if (isBlur) window.showFieldError('reg-fullname', 'reg-fullname-error', 'Full name must contain at least 3 characters.');
    else window.clearFieldError('reg-fullname', 'reg-fullname-error');
    return false;
  }
  if (val.length > 100 || !/^[a-zA-Z\s'-]+$/.test(val)) {
    if (isBlur) window.showFieldError('reg-fullname', 'reg-fullname-error', 'Enter a valid name.');
    else window.clearFieldError('reg-fullname', 'reg-fullname-error');
    return false;
  }
  window.showFieldSuccess('reg-fullname', 'reg-fullname-error');
  return true;
};

window.validateRegEmail = function(isBlur = false) {
  const input = document.getElementById('reg-email');
  const val = input?.value.trim().toLowerCase() || '';
  if (!val) {
    if (isBlur) window.showFieldError('reg-email', 'reg-email-error', 'Email is required.');
    else window.clearFieldError('reg-email', 'reg-email-error');
    return false;
  }
  if (!window.validateEmail(val) || val.length > 100) {
    if (isBlur) window.showFieldError('reg-email', 'reg-email-error', 'Enter a valid email address.');
    else window.clearFieldError('reg-email', 'reg-email-error');
    return false;
  }
  if (window.neuroDB.getUserByEmail(val)) {
    if (isBlur) window.showFieldError('reg-email', 'reg-email-error', 'An account with this email already exists.');
    else window.clearFieldError('reg-email', 'reg-email-error');
    return false;
  }
  window.showFieldSuccess('reg-email', 'reg-email-error');
  return true;
};

window.validateRegPhone = function(isBlur = false) {
  const input = document.getElementById('reg-phone');
  const val = input?.value.trim() || '';
  if (!val) {
    if (isBlur) window.showFieldError('reg-phone', 'reg-phone-error', 'Phone number is required.');
    else window.clearFieldError('reg-phone', 'reg-phone-error');
    return false;
  }
  if (!window.validateIndianPhone(val)) {
    if (isBlur) window.showFieldError('reg-phone', 'reg-phone-error', 'Enter a valid 10-digit mobile number.');
    else window.clearFieldError('reg-phone', 'reg-phone-error');
    return false;
  }
  window.showFieldSuccess('reg-phone', 'reg-phone-error');
  return true;
};

window.validateRegPassword = function(isBlur = false) {
  const input = document.getElementById('reg-password');
  const val = input?.value || '';
  window.updatePasswordLiveFeedback('reg-password');

  if (!val || val.trim().length === 0) {
    if (isBlur) window.showFieldError('reg-password', 'reg-password-error', 'Password is required.');
    else window.clearFieldError('reg-password', 'reg-password-error');
    return false;
  }
  if (val.length < 8) {
    if (isBlur) window.showFieldError('reg-password', 'reg-password-error', 'Password must be at least 8 characters.');
    else window.clearFieldError('reg-password', 'reg-password-error');
    return false;
  }
  const strength = window.checkPasswordStrength(val);
  if (!strength.isValid) {
    if (isBlur) window.showFieldError('reg-password', 'reg-password-error', 'Password must contain an uppercase letter, lowercase letter, number and special character.');
    else window.clearFieldError('reg-password', 'reg-password-error');
    return false;
  }
  window.showFieldSuccess('reg-password', 'reg-password-error');
  return true;
};

window.validateRegConfirmPassword = function(isBlur = false) {
  const pwd = document.getElementById('reg-password')?.value || '';
  const confirm = document.getElementById('reg-confirm-password')?.value || '';
  if (!confirm) {
    if (isBlur) window.showFieldError('reg-confirm-password', 'reg-confirm-password-error', 'Passwords do not match.');
    else window.clearFieldError('reg-confirm-password', 'reg-confirm-password-error');
    return false;
  }
  if (pwd !== confirm) {
    if (isBlur) window.showFieldError('reg-confirm-password', 'reg-confirm-password-error', 'Passwords do not match.');
    else window.clearFieldError('reg-confirm-password', 'reg-confirm-password-error');
    return false;
  }
  window.showFieldSuccess('reg-confirm-password', 'reg-confirm-password-error');
  return true;
};

window.validateRegTerms = function(isBlur = false) {
  const checked = document.getElementById('agree-terms')?.checked;
  if (!checked) {
    window.showFieldError('agree-terms', 'reg-terms-error', 'Please accept the Terms and Conditions.');
    return false;
  }
  window.clearFieldError('agree-terms', 'reg-terms-error');
  return true;
};

window.updatePasswordLiveFeedback = function(inputId) {
  const input = document.getElementById(inputId);
  const val = input ? input.value : '';
  const result = window.checkPasswordStrength(val);

  const meterContainer = document.getElementById('reg-pwd-meter-container');
  if (!meterContainer) return;

  if (!val) {
    meterContainer.style.display = 'none';
    return;
  }
  meterContainer.style.display = 'block';

  // Update pills
  const updatePill = (id, valid) => {
    const el = document.getElementById(id);
    if (!el) return;
    const icon = el.querySelector('.check-icon');
    if (valid) {
      el.style.background = '#dcfce7';
      el.style.color = '#15803d';
      el.style.borderColor = '#86efac';
      if (icon) icon.innerHTML = '✓';
    } else {
      el.style.background = '#f1f5f9';
      el.style.color = '#64748b';
      el.style.borderColor = '#e2e8f0';
      if (icon) icon.innerHTML = '○';
    }
  };

  updatePill('pwd-req-len', result.hasLength);
  updatePill('pwd-req-num', result.hasNumber);
  updatePill('pwd-req-sym', result.hasSymbol);
  updatePill('pwd-req-case', result.hasCase);

  // Update bar
  const bar = document.getElementById('pwd-strength-bar');
  const label = document.getElementById('pwd-strength-label');
  if (bar && label) {
    if (result.score <= 1) {
      bar.style.width = '25%';
      bar.style.background = '#ef4444';
      label.textContent = 'Weak';
      label.style.color = '#ef4444';
    } else if (result.score === 2 || result.score === 3) {
      bar.style.width = result.score === 2 ? '50%' : '75%';
      bar.style.background = '#f59e0b';
      label.textContent = result.score === 2 ? 'Medium' : 'Medium';
      label.style.color = '#f59e0b';
    } else {
      bar.style.width = '100%';
      bar.style.background = '#10b981';
      label.textContent = 'Strong';
      label.style.color = '#10b981';
    }
  }
};

// Login Form Validation & Submission Handler
window.handleLoginForm = function(e) {
  e.preventDefault();
  window.clearFormAlert('login-alert-box');

  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');
  
  // Trim spaces and convert email to lowercase
  const email = (emailInput?.value || '').trim().toLowerCase();
  const password = passwordInput?.value || '';

  let isValid = true;
  let firstInvalid = null;

  // 1. Email Validation
  if (!email) {
    window.showFieldError('login-email', 'login-email-error', 'Email is required.');
    isValid = false;
    if (!firstInvalid) firstInvalid = emailInput;
  } else if (!window.validateEmail(email)) {
    window.showFieldError('login-email', 'login-email-error', 'Enter a valid email address.');
    isValid = false;
    if (!firstInvalid) firstInvalid = emailInput;
  } else {
    window.showFieldSuccess('login-email', 'login-email-error');
  }

  // 2. Password Validation
  if (!password || password.trim().length === 0) {
    window.showFieldError('login-password', 'login-password-error', 'Password is required.');
    isValid = false;
    if (!firstInvalid) firstInvalid = passwordInput;
  } else if (password.length < 8) {
    window.showFieldError('login-password', 'login-password-error', 'Password must be at least 8 characters.');
    isValid = false;
    if (!firstInvalid) firstInvalid = passwordInput;
  } else {
    window.showFieldSuccess('login-password', 'login-password-error');
  }

  if (!isValid) {
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  // Authentication Attempt
  const submitBtn = document.getElementById('btn-login-submit');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span style="display: inline-flex; align-items: center; gap: 8px;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="spin-icon"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        Signing in...
      </span>
    `;
  }

  setTimeout(() => {
    try {
      const user = window.neuroAuth.login(email, password);
      window.showToast(`Welcome back, ${user.full_name}!`, 'success');
      window.navigateTo('dashboard');
    } catch (err) {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Login to Platform';
      }
      // Security Rule: Show generic message without revealing if email or password was wrong
      const genericMsg = 'Invalid email or password.';
      window.showFormAlert('login-alert-box', genericMsg);
      window.showFieldError('login-password', 'login-password-error', genericMsg);
      passwordInput?.focus();
      window.showToast(genericMsg, 'error');
    }
  }, 300);
};

// Registration Form Validation & Submission Handler
window.handleRegisterForm = function(e) {
  e.preventDefault();
  window.clearFormAlert('reg-alert-box');

  const fullNameInput = document.getElementById('reg-fullname');
  const emailInput = document.getElementById('reg-email');
  const phoneInput = document.getElementById('reg-phone');
  const passwordInput = document.getElementById('reg-password');
  const confirmInput = document.getElementById('reg-confirm-password');
  const termsCheckbox = document.getElementById('agree-terms');

  const fullName = (fullNameInput?.value || '').trim();
  const email = (emailInput?.value || '').trim().toLowerCase();
  const phone = (phoneInput?.value || '').trim();
  const password = passwordInput?.value || '';
  const confirmPassword = confirmInput?.value || '';
  const termsChecked = termsCheckbox?.checked || false;

  let isValid = true;
  let firstInvalid = null;

  // 1. Full Name Validation (3-100 chars, letters, spaces, hyphens, apostrophes only)
  if (!fullName) {
    window.showFieldError('reg-fullname', 'reg-fullname-error', 'Full name is required.');
    isValid = false;
    if (!firstInvalid) firstInvalid = fullNameInput;
  } else if (fullName.length < 3) {
    window.showFieldError('reg-fullname', 'reg-fullname-error', 'Full name must contain at least 3 characters.');
    isValid = false;
    if (!firstInvalid) firstInvalid = fullNameInput;
  } else if (fullName.length > 100 || !/^[a-zA-Z\s'-]+$/.test(fullName)) {
    window.showFieldError('reg-fullname', 'reg-fullname-error', 'Enter a valid name.');
    isValid = false;
    if (!firstInvalid) firstInvalid = fullNameInput;
  } else {
    window.showFieldSuccess('reg-fullname', 'reg-fullname-error');
  }

  // 2. Email Validation (RFC, max 100, unique)
  if (!email) {
    window.showFieldError('reg-email', 'reg-email-error', 'Email is required.');
    isValid = false;
    if (!firstInvalid) firstInvalid = emailInput;
  } else if (!window.validateEmail(email) || email.length > 100) {
    window.showFieldError('reg-email', 'reg-email-error', 'Enter a valid email address.');
    isValid = false;
    if (!firstInvalid) firstInvalid = emailInput;
  } else if (window.neuroDB.getUserByEmail(email)) {
    window.showFieldError('reg-email', 'reg-email-error', 'An account with this email already exists.');
    isValid = false;
    if (!firstInvalid) firstInvalid = emailInput;
  } else {
    window.showFieldSuccess('reg-email', 'reg-email-error');
  }

  // 3. Indian Phone Number Validation (10 digits starting with 6,7,8,9)
  if (!phone) {
    window.showFieldError('reg-phone', 'reg-phone-error', 'Phone number is required.');
    isValid = false;
    if (!firstInvalid) firstInvalid = phoneInput;
  } else if (!window.validateIndianPhone(phone)) {
    window.showFieldError('reg-phone', 'reg-phone-error', 'Enter a valid 10-digit mobile number.');
    isValid = false;
    if (!firstInvalid) firstInvalid = phoneInput;
  } else {
    window.showFieldSuccess('reg-phone', 'reg-phone-error');
  }

  // 4. Password Validation (min 8 chars, upper, lower, number, symbol)
  const strength = window.checkPasswordStrength(password);
  if (!password || password.trim().length === 0) {
    window.showFieldError('reg-password', 'reg-password-error', 'Password is required.');
    isValid = false;
    if (!firstInvalid) firstInvalid = passwordInput;
  } else if (password.length < 8) {
    window.showFieldError('reg-password', 'reg-password-error', 'Password must be at least 8 characters.');
    isValid = false;
    if (!firstInvalid) firstInvalid = passwordInput;
  } else if (!strength.isValid) {
    window.showFieldError('reg-password', 'reg-password-error', 'Password must contain an uppercase letter, lowercase letter, number and special character.');
    isValid = false;
    if (!firstInvalid) firstInvalid = passwordInput;
  } else {
    window.showFieldSuccess('reg-password', 'reg-password-error');
  }

  // 5. Confirm Password Validation
  if (!confirmPassword) {
    window.showFieldError('reg-confirm-password', 'reg-confirm-password-error', 'Passwords do not match.');
    isValid = false;
    if (!firstInvalid) firstInvalid = confirmInput;
  } else if (password !== confirmPassword) {
    window.showFieldError('reg-confirm-password', 'reg-confirm-password-error', 'Passwords do not match.');
    isValid = false;
    if (!firstInvalid) firstInvalid = confirmInput;
  } else {
    window.showFieldSuccess('reg-confirm-password', 'reg-confirm-password-error');
  }

  // 6. Terms of Service & Privacy Policy Validation
  if (!termsChecked) {
    window.showFieldError('agree-terms', 'reg-terms-error', 'Please accept the Terms and Conditions.');
    isValid = false;
    if (!firstInvalid) firstInvalid = termsCheckbox;
  } else {
    window.clearFieldError('agree-terms', 'reg-terms-error');
  }

  if (!isValid) {
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  const role = window.selectedRegRole || 'Parent / Caregiver';

  const submitBtn = document.getElementById('btn-reg-submit');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span style="display: inline-flex; align-items: center; gap: 8px;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="spin-icon"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        Creating Account...
      </span>
    `;
  }

  setTimeout(() => {
    try {
      const user = window.neuroAuth.register({
        full_name: fullName,
        email: email,
        phone: phone,
        password: password,
        confirm_password: confirmPassword,
        role: role,
        terms: termsChecked
      });
      
      // Step 6: Registration Success -> Show message -> Redirect to Login
      window.showToast('Account created successfully! Please login with your credentials.', 'success');
      window.navigateTo('login');
    } catch (err) {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Register Account';
      }
      window.showFormAlert('reg-alert-box', err.message);
      window.showToast(err.message, 'error');
    }
  }, 350);
};

// Children Master List & Profile Tabs
window.renderChildrenMasterList = function() {
  const children = window.neuroDB.getChildren();
  const currentRole = window.neuroAuth.getRole();

  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">Child Master Directory</h1>
        <p class="page-subtitle">Centralized patient profiles, developmental histories, and clinical assignments.</p>
      </div>
      ${currentRole === 'Receptionist' || currentRole === 'Administrator' ? `
        <button class="btn btn-primary" onclick="window.showRegisterChildModal()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/><line x1="19" y1="11" x2="19" y2="17"/><line x1="22" y1="14" x2="16" y2="14"/></svg>
          Register Child
        </button>
      ` : ''}
    </div>

    <div class="card">
      <div class="toolbar-container">
        <div class="search-input-wrapper">
          <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" class="form-control" placeholder="Search by name, ID or guardian..." oninput="window.filterChildrenTable(this.value)">
        </div>
      </div>

      <div class="table-container">
        <table class="table" id="children-table">
          <thead>
            <tr>
              <th>Child Profile</th>
              <th>Age & Gender</th>
              <th>Blood Group</th>
              <th>Parent / Caregiver</th>
              <th>Assigned Therapist</th>
              <th>Status</th>
              <th style="text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${children.map(ch => {
              const parent = window.neuroDB.getUserById(ch.primary_parent_id);
              const therapist = window.neuroDB.getUserById(ch.assigned_therapist_id);
              return `
                <tr>
                  <td>
                    <div style="font-weight: 700; color: var(--slate-900); font-size: 13.5px;">${ch.first_name} ${ch.last_name}</div>
                    <div style="font-size: 11.5px; color: var(--slate-500); font-family: 'JetBrains Mono', monospace;">${ch.child_code}</div>
                  </td>
                  <td style="font-size: 13px;">${ch.age_months} mos (${ch.dob}) &bull; ${ch.gender}</td>
                  <td style="font-size: 13px;"><span class="badge badge-neutral">${ch.blood_group}</span></td>
                  <td>
                    <div style="font-weight: 600; font-size: 13px; color: var(--slate-800);">${parent ? parent.full_name : 'N/A'}</div>
                    <div style="font-size: 11.5px; color: var(--slate-500);">${parent ? parent.phone : ''}</div>
                  </td>
                  <td>
                    <div style="font-size: 13px; font-weight: 600; color: var(--primary-700);">${therapist ? therapist.full_name : 'Unassigned'}</div>
                  </td>
                  <td>
                    <span class="badge ${ch.status === 'Active' ? 'badge-active' : 'badge-warning'}">${ch.status}</span>
                  </td>
                  <td style="text-align: right;">
                    <button class="btn btn-primary btn-sm" onclick="window.openChildProfile('${ch.id}')">View Profile</button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
};

// Full Child Profile Tabbed View
window.openChildProfile = function(childId) {
  window.activeChildProfileTab = 'overview';
  window.navigateTo('child-profile', { childId });
};

window.openChildProfileTab = function(childId, tab) {
  window.activeChildProfileTab = tab;
  window.navigateTo('child-profile', { childId });
};

window.renderChildProfile = function(childId) {
  const child = window.neuroDB.getChildById(childId);
  if (!child) return `<div class="card"><p>Child profile not found.</p></div>`;

  const parent = window.neuroDB.getUserById(child.primary_parent_id);
  const therapist = window.neuroDB.getUserById(child.assigned_therapist_id);
  const assessments = window.neuroDB.getAssessmentRecords({ child_id: child.id });
  const therapyPlans = window.neuroDB.getTherapyPlans({ child_id: child.id });
  const sessions = window.neuroDB.getTherapySessions({ child_id: child.id });
  const appointments = window.neuroDB.getAppointments({ child_id: child.id });
  const activePlan = therapyPlans.find(p => p.status === 'Active') || therapyPlans[0];

  const currentTab = window.activeChildProfileTab || 'overview';

  return `
    <div class="page-header">
      <div>
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 6px;">
          <h1 class="page-title">${child.first_name} ${child.last_name}</h1>
          <span class="badge badge-active">${child.status}</span>
          <span style="font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--slate-500); font-weight: 700;">${child.child_code}</span>
        </div>
        <p class="page-subtitle">${child.age_months} Months &bull; DOB: ${child.dob} &bull; Gender: ${child.gender} &bull; Blood: ${child.blood_group}</p>
      </div>

      <div style="display: flex; gap: 10px; flex-wrap: wrap;">
        <button class="btn btn-primary" onclick="window.startAssessmentForChild('${child.id}')">
          Conduct Screening
        </button>
        <button class="btn btn-accent" onclick="window.generateAndPrintChildReport('${child.id}')">
          Clinical Report
        </button>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="tabs-nav">
      <button class="tab-btn ${currentTab === 'overview' ? 'active' : ''}" onclick="window.activeChildProfileTab='overview'; window.renderCurrentView();">Overview & Bio</button>
      <button class="tab-btn ${currentTab === 'assessments' ? 'active' : ''}" onclick="window.activeChildProfileTab='assessments'; window.renderCurrentView();">Screening Assessments (${assessments.length})</button>
      <button class="tab-btn ${currentTab === 'therapy-plan' ? 'active' : ''}" onclick="window.activeChildProfileTab='therapy-plan'; window.renderCurrentView();">Therapy Plan</button>
      <button class="tab-btn ${currentTab === 'sessions' ? 'active' : ''}" onclick="window.activeChildProfileTab='sessions'; window.renderCurrentView();">Session Logs (${sessions.length})</button>
      <button class="tab-btn ${currentTab === 'appointments' ? 'active' : ''}" onclick="window.activeChildProfileTab='appointments'; window.renderCurrentView();">Appointments (${appointments.length})</button>
      <button class="tab-btn ${currentTab === 'progress' ? 'active' : ''}" onclick="window.activeChildProfileTab='progress'; window.renderCurrentView();">Progress Tracker</button>
      <button class="tab-btn ${currentTab === 'messages' ? 'active' : ''}" onclick="window.navigateTo('messages', { childId: '${child.id}' })">Therapist Chat</button>
    </div>

    <!-- Tab Content -->
    ${currentTab === 'overview' ? `
      <div class="grid-2">
        <div class="card">
          <div class="card-header"><div class="card-title">Caregiver & Contact Information</div></div>
          <div style="display: flex; flex-direction: column; gap: 12px; font-size: 13px;">
            <div><strong>Primary Caregiver:</strong> ${parent ? parent.full_name : 'Unlinked'}</div>
            <div><strong>Contact Phone:</strong> ${parent ? parent.phone : 'N/A'}</div>
            <div><strong>Email:</strong> ${parent ? parent.email : 'N/A'}</div>
            <div><strong>Residential Address:</strong> ${child.address || 'Springfield'}</div>
            <div><strong>Emergency Contact:</strong> ${child.emergency_contact || 'N/A'}</div>
          </div>
        </div>

        <div class="card">
          <div class="card-header"><div class="card-title">Clinical Notes & Assignment</div></div>
          <div style="display: flex; flex-direction: column; gap: 12px; font-size: 13px;">
            <div><strong>Assigned Therapist:</strong> ${therapist ? therapist.full_name : 'Unassigned'}</div>
            <div><strong>Registration Date:</strong> ${new Date(child.created_at).toLocaleDateString()}</div>
            <div><strong>Clinical History & Presentation:</strong></div>
            <div style="padding: 12px; background: var(--slate-50); border: 1px solid var(--slate-200); border-radius: var(--radius-md); font-size: 12.5px; color: var(--slate-700); line-height: 1.5;">
              ${child.notes || 'No baseline notes recorded.'}
            </div>
          </div>
        </div>
      </div>
    ` : ''}

    ${currentTab === 'assessments' ? `
      <div class="card">
        <div class="card-header">
          <div class="card-title">Screening Assessment History</div>
          <button class="btn btn-primary btn-sm" onclick="window.startAssessmentForChild('${child.id}')">+ New Screening</button>
        </div>
        ${assessments.length > 0 ? `
          <div style="display: flex; flex-direction: column; gap: 16px;">
            ${assessments.map(a => `
              <div style="background: var(--slate-50); border: 1px solid var(--slate-200); border-radius: var(--radius-md); padding: 18px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <div>
                    <span style="font-weight: 700; font-size: 14.5px; color: var(--slate-900);">M-CHAT-R/F Early Screening</span>
                    <div style="font-size: 12px; color: var(--slate-500); margin-top: 2px;">Completed on ${new Date(a.completed_at).toLocaleDateString()}</div>
                  </div>
                  <span class="badge badge-${a.risk_color === 'amber' ? 'moderate-risk' : a.risk_color === 'emerald' ? 'low-risk' : 'high-risk'}" style="font-size: 12px; padding: 4px 12px;">
                    ${a.risk_level} (${a.total_score} Flagged Items)
                  </span>
                </div>
                <div style="font-size: 12.5px; color: var(--slate-700); line-height: 1.5; margin-top: 10px;">
                  <strong>Therapist Notes:</strong> ${a.therapist_notes}
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <p style="color: var(--slate-500); font-size: 13px;">No screening assessments completed for this child.</p>
        `}
      </div>
    ` : ''}

    ${currentTab === 'therapy-plan' ? `
      <div class="card">
        <div class="card-header">
          <div class="card-title">Active Individualized Therapy Plan</div>
          <button class="btn btn-primary btn-sm" onclick="window.showCreateTherapyPlanModal('${child.id}')">Formulate New Plan</button>
        </div>
        ${activePlan ? `
          <div style="margin-bottom: 20px;">
            <h3 style="font-size: 16px; font-weight: 800; color: var(--slate-900);">${activePlan.title}</h3>
            <div style="font-size: 12.5px; color: var(--slate-600); margin-top: 4px;">
              <strong>Frequency:</strong> ${activePlan.frequency} &bull; <strong>Duration:</strong> ${activePlan.duration_mins} mins &bull; <strong>Target Completion:</strong> ${activePlan.target_date}
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 20px;">
            ${(activePlan.goals || []).map(g => `
              <div style="padding: 14px; background: var(--slate-50); border: 1px solid var(--slate-200); border-radius: var(--radius-md);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <span style="font-weight: 700; font-size: 13.5px; color: var(--slate-900);">${g.title}</span>
                  <span style="font-size: 12.5px; font-weight: 700; color: var(--primary-600);">${g.progress_pct}%</span>
                </div>
                <div class="progress-bar-container" style="margin-bottom: 8px;">
                  <div class="progress-bar-fill" style="width: ${g.progress_pct}%;"></div>
                </div>
                <div style="font-size: 12px; color: var(--slate-600);">${g.target}</div>
              </div>
            `).join('')}
          </div>
        ` : `
          <p style="color: var(--slate-500); font-size: 13px;">No active therapy plan assigned to this child.</p>
        `}
      </div>
    ` : ''}

    ${currentTab === 'sessions' ? `
      <div class="card">
        <div class="card-header">
          <div class="card-title">Therapy Session Log Chronology</div>
          <button class="btn btn-accent btn-sm" onclick="window.showRecordSessionForChild('${child.id}')">+ Record Session</button>
        </div>
        ${sessions.length > 0 ? `
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Session Date</th>
                  <th>Focus / Type</th>
                  <th>Clinical Observations</th>
                  <th>Rating</th>
                  <th>Home Notes</th>
                </tr>
              </thead>
              <tbody>
                ${sessions.map(s => `
                  <tr>
                    <td style="font-weight: 700; font-size: 13px;">${s.session_date}</td>
                    <td style="font-size: 12.5px;">${s.session_type}</td>
                    <td style="font-size: 12.5px; max-width: 280px;">${s.observations}</td>
                    <td style="font-weight: 700; color: var(--accent-600);">${s.progress_rating}/5.0</td>
                    <td style="font-size: 12px; color: var(--slate-600); max-width: 200px;">${s.next_session_notes}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : `
          <p style="color: var(--slate-500); font-size: 13px;">No therapy sessions recorded yet.</p>
        `}
      </div>
    ` : ''}

    ${currentTab === 'appointments' ? `
      <div class="card">
        <div class="card-header">
          <div class="card-title">Appointment History</div>
          <button class="btn btn-primary btn-sm" onclick="window.showBookAppointmentForChild('${child.id}')">+ Book Appointment</button>
        </div>
        ${appointments.length > 0 ? `
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Session Type</th>
                  <th>Status</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                ${appointments.map(a => `
                  <tr>
                    <td style="font-weight: 700; font-size: 13px;">${a.appointment_date} (${a.start_time})</td>
                    <td style="font-size: 12.5px;">${a.type}</td>
                    <td><span class="badge badge-${a.status === 'Confirmed' ? 'active' : 'scheduled'}">${a.status}</span></td>
                    <td style="font-size: 12.5px; color: var(--slate-600);">${a.notes || '—'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : `
          <p style="color: var(--slate-500); font-size: 13px;">No appointments on record.</p>
        `}
      </div>
    ` : ''}

    ${currentTab === 'progress' ? window.renderChildProgressDetails(child.id) : ''}
  `;
};

// Progress Tracker View
window.renderProgressTrackerView = function(childId) {
  const children = window.neuroDB.getChildren();
  const targetId = childId || (children[0] ? children[0].id : null);
  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">Developmental Progress Tracker</h1>
        <p class="page-subtitle">Multi-domain developmental trajectory across Social, Communication, Sensory & Behavioural domains.</p>
      </div>
      <div style="display: flex; gap: 8px;">
        <select class="form-control" style="width: auto;" onchange="window.navigateTo('progress', { childId: this.value })">
          ${children.map(c => `<option value="${c.id}" ${c.id === targetId ? 'selected' : ''}>${c.first_name} ${c.last_name} (${c.child_code})</option>`).join('')}
        </select>
        <button class="btn btn-primary" onclick="window.showAddProgressRecordModal('${targetId}')">+ Update Progress</button>
      </div>
    </div>

    ${targetId ? window.renderChildProgressDetails(targetId) : '<div class="card"><p>No child selected.</p></div>'}
  `;
};

window.renderChildProgressDetails = function(childId) {
  const records = window.neuroDB.getProgressRecords(childId);
  const latest = records[records.length - 1] || { social_score: 50, communication_score: 50, sensory_score: 50, behavioural_score: 50 };

  return `
    <div class="grid-2">
      <!-- Domain Metrics Card -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">Developmental Domain Scores</div>
          <span class="badge badge-info">Phase 1 Clinical Index</span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span style="font-weight: 700; font-size: 13px;">Social Orientation & Joint Attention</span>
              <span style="font-weight: 800; color: var(--primary-600);">${latest.social_score}%</span>
            </div>
            <div class="progress-bar-container"><div class="progress-bar-fill" style="width: ${latest.social_score}%;"></div></div>
          </div>

          <div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span style="font-weight: 700; font-size: 13px;">Functional Communication & Requesting</span>
              <span style="font-weight: 800; color: var(--accent-600);">${latest.communication_score}%</span>
            </div>
            <div class="progress-bar-container"><div class="progress-bar-fill" style="width: ${latest.communication_score}%; background: linear-gradient(90deg, #0d9488, #06b6d4);"></div></div>
          </div>

          <div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span style="font-weight: 700; font-size: 13px;">Sensory Processing & Regulation</span>
              <span style="font-weight: 800; color: #8b5cf6;">${latest.sensory_score}%</span>
            </div>
            <div class="progress-bar-container"><div class="progress-bar-fill" style="width: ${latest.sensory_score}%; background: linear-gradient(90deg, #7c3aed, #a855f7);"></div></div>
          </div>

          <div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span style="font-weight: 700; font-size: 13px;">Behavioural Flexibility & Transitions</span>
              <span style="font-weight: 800; color: var(--success-500);">${latest.behavioural_score}%</span>
            </div>
            <div class="progress-bar-container"><div class="progress-bar-fill" style="width: ${latest.behavioural_score}%; background: linear-gradient(90deg, #10b981, #34d399);"></div></div>
          </div>
        </div>
      </div>

      <!-- Milestone Achievements Log -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">Chronological Milestones & Therapist Remarks</div>
        </div>
        ${records.length > 0 ? `
          <div style="display: flex; flex-direction: column; gap: 14px;">
            ${records.map(r => `
              <div style="background: var(--slate-50); border: 1px solid var(--slate-200); border-radius: var(--radius-md); padding: 14px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <strong style="font-size: 13px; color: var(--slate-900);">${r.record_date}</strong>
                  <span class="badge badge-active">Logged</span>
                </div>
                <div style="font-size: 12.5px; color: var(--slate-700); margin-bottom: 4px;"><strong>Milestones:</strong> ${r.milestones_achieved}</div>
                <div style="font-size: 12px; color: var(--slate-500);"><strong>Remarks:</strong> ${r.therapist_remarks}</div>
              </div>
            `).join('')}
          </div>
        ` : `
          <p style="color: var(--slate-500); font-size: 13px;">No progress entries recorded yet.</p>
        `}
      </div>
    </div>
  `;
};

// Additional Views: Assessments List, Therapy Plans, Session List, Appointments Master, Reports Master, Reminders
window.renderAssessmentsListView = function() {
  const assessments = window.neuroDB.getAssessmentRecords();
  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">Screening & Assessment Repository</h1>
        <p class="page-subtitle">Standardized M-CHAT-R/F checklists and clinical behavioral observations.</p>
      </div>
      <button class="btn btn-primary" onclick="window.startNewAssessment()">
        + Conduct Screening
      </button>
    </div>

    <div class="card">
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Child Patient</th>
              <th>Instrument</th>
              <th>Therapist</th>
              <th>Risk Indicator</th>
              <th>Observations</th>
              <th style="text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${assessments.map(a => {
              const child = window.neuroDB.getChildById(a.child_id);
              const therapist = window.neuroDB.getUserById(a.therapist_id);
              return `
                <tr>
                  <td style="font-size: 12.5px; font-weight: 600;">${new Date(a.completed_at).toLocaleDateString()}</td>
                  <td>
                    ${child ? `
                      <div style="font-weight: 700; color: var(--slate-900); font-size: 13px;">${child.first_name} ${child.last_name}</div>
                      <div style="font-size: 11.5px; color: var(--slate-500); font-family: 'JetBrains Mono', monospace;">${child.child_code}</div>
                    ` : 'N/A'}
                  </td>
                  <td style="font-size: 12.5px;">M-CHAT-R/F</td>
                  <td style="font-size: 12.5px;">${therapist ? therapist.full_name : 'Specialist'}</td>
                  <td>
                    <span class="badge badge-${a.risk_color === 'amber' ? 'moderate-risk' : a.risk_color === 'emerald' ? 'low-risk' : 'high-risk'}">
                      ${a.risk_level} (${a.total_score} Flags)
                    </span>
                  </td>
                  <td style="font-size: 12px; color: var(--slate-600); max-width: 250px;">${a.therapist_notes}</td>
                  <td style="text-align: right;">
                    <button class="btn btn-outline btn-sm" onclick="window.openChildProfileTab('${a.child_id}', 'assessments')">View Details</button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
};

window.renderTherapyPlansView = function() {
  const plans = window.neuroDB.getTherapyPlans();
  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">Therapy Plans & Intervention Goals</h1>
        <p class="page-subtitle">Structured, goal-oriented therapy roadmaps for child developmental support.</p>
      </div>
      <button class="btn btn-primary" onclick="window.showCreateTherapyPlanModal()">+ New Therapy Plan</button>
    </div>

    <div class="grid-2">
      ${plans.map(p => {
        const child = window.neuroDB.getChildById(p.child_id);
        const therapist = window.neuroDB.getUserById(p.therapist_id);
        return `
          <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
              <div>
                <span class="badge ${p.status === 'Active' ? 'badge-active' : 'badge-on-hold'}" style="margin-bottom: 6px;">${p.status}</span>
                <h3 style="font-size: 16px; font-weight: 800; color: var(--slate-900);">${p.title}</h3>
                <div style="font-size: 12px; color: var(--slate-500);">Child: <strong>${child ? child.first_name + ' ' + child.last_name : 'N/A'}</strong> &bull; Clinician: ${therapist ? therapist.full_name : ''}</div>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px;">
              ${(p.goals || []).map(g => `
                <div style="background: var(--slate-50); border: 1px solid var(--slate-200); border-radius: var(--radius-md); padding: 10px 12px;">
                  <div style="display: flex; justify-content: space-between; font-size: 12.5px; font-weight: 700; margin-bottom: 4px;">
                    <span>${g.title}</span>
                    <span style="color: var(--primary-600);">${g.progress_pct}%</span>
                  </div>
                  <div class="progress-bar-container"><div class="progress-bar-fill" style="width: ${g.progress_pct}%;"></div></div>
                </div>
              `).join('')}
            </div>

            <button class="btn btn-outline btn-sm" onclick="window.openChildProfileTab('${p.child_id}', 'therapy-plan')">Manage Plan</button>
          </div>
        `;
      }).join('')}
    </div>
  `;
};

window.renderSessionsListView = function() {
  const sessions = window.neuroDB.getTherapySessions();
  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">Therapy Session Management</h1>
        <p class="page-subtitle">Chronological clinical logs, observation records, and parent recommendations.</p>
      </div>
      <button class="btn btn-accent" onclick="window.showRecordSessionModal()">+ Record New Session</button>
    </div>

    <div class="card">
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Child</th>
              <th>Duration</th>
              <th>Session Type</th>
              <th>Observations</th>
              <th>Rating</th>
              <th style="text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${sessions.map(s => {
              const child = window.neuroDB.getChildById(s.child_id);
              return `
                <tr>
                  <td style="font-weight: 700; font-size: 13px;">${s.session_date}</td>
                  <td>${child ? child.first_name + ' ' + child.last_name : 'N/A'}</td>
                  <td>${s.duration_mins} mins</td>
                  <td>${s.session_type}</td>
                  <td style="max-width: 300px; font-size: 12.5px;">${s.observations}</td>
                  <td style="font-weight: 700; color: var(--accent-600);">${s.progress_rating}/5.0</td>
                  <td style="text-align: right;">
                    <button class="btn btn-outline btn-sm" onclick="window.openChildProfileTab('${s.child_id}', 'sessions')">View</button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
};

window.renderAppointmentsMasterView = function() {
  const currentUser = window.neuroAuth.getCurrentUser();
  let appointments = window.neuroDB.getAppointments();

  // If Parent / Caregiver, only show appointments for their own registered children
  if (currentUser && currentUser.role === 'Parent / Caregiver') {
    const myChildIds = window.neuroDB.getChildren().filter(c => c.primary_parent_id === currentUser.id).map(c => c.id);
    appointments = appointments.filter(a => myChildIds.includes(a.child_id));
  }

  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">${currentUser && currentUser.role === 'Parent / Caregiver' ? "My Child's Appointment Schedule" : "Appointment Master Schedule"}</h1>
        <p class="page-subtitle">${currentUser && currentUser.role === 'Parent / Caregiver' ? "View your child's upcoming therapy sessions and clinical consultations." : "Schedule, reschedule, filter and confirm clinical sessions."}</p>
      </div>
      ${currentUser && currentUser.role !== 'Parent / Caregiver' ? `
        <button class="btn btn-primary" onclick="window.showBookAppointmentModal()">+ Book Appointment</button>
      ` : ''}
    </div>

    <div class="card">
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Child Patient</th>
              <th>Assigned Therapist</th>
              <th>Type</th>
              <th>Status</th>
              <th>Notes</th>
              ${currentUser && currentUser.role !== 'Parent / Caregiver' ? `<th style="text-align: right;">Action</th>` : ''}
            </tr>
          </thead>
          <tbody>
            ${appointments.length === 0 ? `
              <tr>
                <td colspan="7" style="text-align: center; padding: 36px; color: var(--slate-500);">
                  No appointments scheduled for your registered child.
                </td>
              </tr>
            ` : appointments.map(a => {
              const child = window.neuroDB.getChildById(a.child_id);
              const therapist = window.neuroDB.getUserById(a.therapist_id);
              return `
                <tr>
                  <td>
                    <div style="font-weight: 700; font-size: 13px;">${a.appointment_date}</div>
                    <div style="font-size: 11.5px; color: var(--primary-600); font-weight: 600;">${a.start_time} - ${a.end_time || '11:00 AM'}</div>
                  </td>
                  <td style="font-weight: 700;">${child ? child.first_name + ' ' + child.last_name : 'N/A'}</td>
                  <td>${therapist ? therapist.full_name : 'Clinic Specialist'}</td>
                  <td>${a.type}</td>
                  <td><span class="badge badge-${a.status === 'Confirmed' ? 'active' : a.status === 'Scheduled' ? 'scheduled' : 'neutral'}">${a.status}</span></td>
                  <td style="font-size: 12px; color: var(--slate-600);">${a.notes || '—'}</td>
                  ${currentUser && currentUser.role !== 'Parent / Caregiver' ? `
                    <td style="text-align: right;">
                      <button class="btn btn-outline btn-sm" onclick="window.showRescheduleModal('${a.id}')">Reschedule</button>
                    </td>
                  ` : ''}
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
};

window.renderReportsMasterList = function() {
  const currentUser = window.neuroAuth.getCurrentUser();
  const role = window.neuroAuth.getRole();

  // Receptionist administrative reports delegate
  if (role === 'Receptionist' && window.renderReceptionistReports) {
    return window.renderReceptionistReports();
  }

  let children = window.neuroDB.getChildren();

  // If user is Parent / Caregiver, strictly scope list to only their own children
  if (currentUser && currentUser.role === 'Parent / Caregiver') {
    children = children.filter(ch => ch.primary_parent_id === currentUser.id);
  }

  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">${currentUser && currentUser.role === 'Parent / Caregiver' ? "My Child's Clinical Reports" : "Clinical Reports Center"}</h1>
        <p class="page-subtitle">${currentUser && currentUser.role === 'Parent / Caregiver' ? "View and download official screening summaries and milestone progress evaluations for your child." : "Generate official printable screening summaries and progress evaluations."}</p>
      </div>
    </div>

    <div class="grid-2">
      ${children.length === 0 ? `
        <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
          <p style="color: var(--slate-500); font-size: 14px;">No registered child profile associated with your caregiver account.</p>
        </div>
      ` : children.map(ch => `
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
            <div>
              <h3 style="font-size: 16px; font-weight: 800; color: var(--slate-900);">${ch.first_name} ${ch.last_name}</h3>
              <div style="font-size: 12px; color: var(--slate-500); font-family: 'JetBrains Mono', monospace;">${ch.child_code} &bull; Age: ${ch.age_months} Months</div>
            </div>
            <span class="badge badge-active">${ch.status}</span>
          </div>
          <p style="font-size: 12.5px; color: var(--slate-600); margin-bottom: 16px;">Comprehensive clinical evaluation including M-CHAT-R/F screening, active therapy goals, and chronological session logs.</p>
          <button class="btn btn-primary btn-sm" onclick="window.generateAndPrintChildReport('${ch.id}')">
            View & Print Clinical Report
          </button>
        </div>
      `).join('')}
    </div>
  `;
};

// Modals Management
window.closeActiveModal = function() {
  const backdrop = document.getElementById('modal-backdrop');
  if (backdrop) {
    backdrop.classList.remove('active');
    backdrop.innerHTML = '';
  }
};

window.openModal = function(title, bodyHtml, footerHtml, isLarge = false) {
  const backdrop = document.getElementById('modal-backdrop');
  if (!backdrop) return;

  backdrop.innerHTML = `
    <div class="modal-dialog ${isLarge ? 'lg' : ''}" onclick="event.stopPropagation()">
      <div class="modal-header">
        <div class="modal-title">${title}</div>
        <button class="btn-icon" onclick="window.closeActiveModal()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body">
        ${bodyHtml}
      </div>
      <div class="modal-footer">
        ${footerHtml}
      </div>
    </div>
  `;

  backdrop.classList.add('active');
};

// Add User Modal
window.showAddUserModal = function() {
  const body = `
    <form id="add-user-form" onsubmit="window.handleAddUserSubmit(event)">
      <div class="form-group">
        <label class="form-label">Full Name <span class="required">*</span></label>
        <input type="text" id="new-user-name" class="form-control" placeholder="e.g. Dr. Jennifer Hayes" required>
      </div>
      <div class="form-group">
        <label class="form-label">Email Address <span class="required">*</span></label>
        <input type="email" id="new-user-email" class="form-control" placeholder="jennifer.hayes@neurospectra.org" required>
      </div>
      <div class="form-group">
        <label class="form-label">Role Designation <span class="required">*</span></label>
        <select id="new-user-role" class="form-control" required>
          <option value="Therapist">Therapist</option>
          <option value="Receptionist">Receptionist</option>
          <option value="Parent / Caregiver">Parent / Caregiver</option>
          <option value="Administrator">Administrator</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Phone Number</label>
        <input type="tel" id="new-user-phone" class="form-control" placeholder="+1 (555) 123-4567">
      </div>
      <div class="form-group">
        <label class="form-label">Temporary Password <span class="required">*</span></label>
        <input type="password" id="new-user-pwd" class="form-control" placeholder="••••••••" required value="password123">
      </div>
    </form>
  `;
  const footer = `
    <button class="btn btn-outline" onclick="window.closeActiveModal()">Cancel</button>
    <button class="btn btn-primary" onclick="document.getElementById('add-user-form').requestSubmit()">Create User</button>
  `;
  window.openModal('Provision New System User', body, footer);
};

window.handleAddUserSubmit = function(e) {
  e.preventDefault();
  const name = document.getElementById('new-user-name')?.value;
  const email = document.getElementById('new-user-email')?.value;
  const role = document.getElementById('new-user-role')?.value;
  const phone = document.getElementById('new-user-phone')?.value;
  const password = document.getElementById('new-user-pwd')?.value;

  try {
    window.neuroDB.createUser({ full_name: name, email, role, phone, password });
    window.closeActiveModal();
    window.showToast(`User ${name} created successfully!`, 'success');
    window.renderCurrentView();
  } catch (err) {
    window.showToast(err.message, 'error');
  }
};

// Edit User Modal
window.showEditUserModal = function(userId) {
  const user = window.neuroDB.getUserById(userId);
  if (!user) return;

  const body = `
    <form id="edit-user-form" onsubmit="window.handleEditUserSubmit(event, '${user.id}')">
      <div class="form-group">
        <label class="form-label">Full Name <span class="required">*</span></label>
        <input type="text" id="edit-user-name" class="form-control" value="${user.full_name}" required>
      </div>
      <div class="form-group">
        <label class="form-label">Email Address <span class="required">*</span></label>
        <input type="email" id="edit-user-email" class="form-control" value="${user.email}" required>
      </div>
      <div class="form-group">
        <label class="form-label">Role Designation <span class="required">*</span></label>
        <select id="edit-user-role" class="form-control" required>
          <option value="Administrator" ${user.role === 'Administrator' ? 'selected' : ''}>Administrator</option>
          <option value="Therapist" ${user.role === 'Therapist' ? 'selected' : ''}>Therapist</option>
          <option value="Receptionist" ${user.role === 'Receptionist' ? 'selected' : ''}>Receptionist</option>
          <option value="Parent / Caregiver" ${user.role === 'Parent / Caregiver' ? 'selected' : ''}>Parent / Caregiver</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Phone Number</label>
        <input type="tel" id="edit-user-phone" class="form-control" value="${user.phone || ''}">
      </div>
      <div class="form-group">
        <label class="form-label">Account Status</label>
        <select id="edit-user-status" class="form-control">
          <option value="1" ${user.is_active ? 'selected' : ''}>Active</option>
          <option value="0" ${!user.is_active ? 'selected' : ''}>Inactive (Deactivated)</option>
        </select>
      </div>
    </form>
  `;
  const footer = `
    <button class="btn btn-outline" onclick="window.closeActiveModal()">Cancel</button>
    <button class="btn btn-primary" onclick="document.getElementById('edit-user-form').requestSubmit()">Save Changes</button>
  `;
  window.openModal('Edit User Profile & Permissions', body, footer);
};

window.handleEditUserSubmit = function(e, userId) {
  e.preventDefault();
  const name = document.getElementById('edit-user-name')?.value;
  const email = document.getElementById('edit-user-email')?.value;
  const role = document.getElementById('edit-user-role')?.value;
  const phone = document.getElementById('edit-user-phone')?.value;
  const isActive = parseInt(document.getElementById('edit-user-status')?.value, 10);

  window.neuroDB.updateUser(userId, { full_name: name, email, role, phone, is_active: isActive });
  window.closeActiveModal();
  window.showToast('User record updated successfully.', 'success');
  window.renderCurrentView();
};

window.toggleUserActiveStatus = function(userId) {
  const user = window.neuroDB.getUserById(userId);
  if (!user) return;
  const newState = user.is_active ? 0 : 1;
  window.neuroDB.updateUser(userId, { is_active: newState });
  window.showToast(`User account ${newState ? 'activated' : 'deactivated'}.`, 'info');
  window.renderCurrentView();
};

// Register Child Modal
window.showRegisterChildModal = function() {
  const parents = window.neuroDB.getUsers().filter(u => u.role === 'Parent / Caregiver' && u.is_active);
  const therapists = window.neuroDB.getUsers().filter(u => u.role === 'Therapist' && u.is_active);

  const body = `
    <form id="register-child-form" onsubmit="window.handleRegisterChildSubmit(event)">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
        <div class="form-group">
          <label class="form-label">First Name <span class="required">*</span></label>
          <input type="text" id="ch-first-name" class="form-control" placeholder="e.g. Leo" required>
        </div>
        <div class="form-group">
          <label class="form-label">Last Name <span class="required">*</span></label>
          <input type="text" id="ch-last-name" class="form-control" placeholder="e.g. Watson" required>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px;">
        <div class="form-group">
          <label class="form-label">Date of Birth <span class="required">*</span></label>
          <input type="date" id="ch-dob" class="form-control" value="2023-05-10" required>
        </div>
        <div class="form-group">
          <label class="form-label">Gender <span class="required">*</span></label>
          <select id="ch-gender" class="form-control">
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Blood Group</label>
          <select id="ch-blood" class="form-control">
            <option value="O+">O+</option>
            <option value="A+">A+</option>
            <option value="B+">B+</option>
            <option value="AB+">AB+</option>
          </select>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
        <div class="form-group">
          <label class="form-label">Primary Parent / Caregiver <span class="required">*</span></label>
          <select id="ch-parent" class="form-control" required>
            ${parents.map(p => `<option value="${p.id}">${p.full_name} (${p.phone || p.email})</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Assigned Therapist <span class="required">*</span></label>
          <select id="ch-therapist" class="form-control" required>
            ${therapists.map(t => `<option value="${t.id}">${t.full_name}</option>`).join('')}
          </select>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Residential Address</label>
        <input type="text" id="ch-address" class="form-control" placeholder="Street, City, Postal Code">
      </div>

      <div class="form-group">
        <label class="form-label">Intake Notes / Reason for Referral</label>
        <textarea id="ch-notes" class="form-control" rows="2" placeholder="Initial screening concerns, referral from pediatrician, communication observations..."></textarea>
      </div>
    </form>
  `;
  const footer = `
    <button class="btn btn-outline" onclick="window.closeActiveModal()">Cancel</button>
    <button class="btn btn-primary" onclick="document.getElementById('register-child-form').requestSubmit()">Register Child Profile</button>
  `;
  window.openModal('Register New Child Patient', body, footer, true);
};

window.handleRegisterChildSubmit = function(e) {
  e.preventDefault();
  const firstName = document.getElementById('ch-first-name')?.value;
  const lastName = document.getElementById('ch-last-name')?.value;
  const dob = document.getElementById('ch-dob')?.value;
  const gender = document.getElementById('ch-gender')?.value;
  const bloodGroup = document.getElementById('ch-blood')?.value;
  const parentId = document.getElementById('ch-parent')?.value;
  const therapistId = document.getElementById('ch-therapist')?.value;
  const address = document.getElementById('ch-address')?.value;
  const notes = document.getElementById('ch-notes')?.value;

  const newChild = window.neuroDB.createChild({
    first_name: firstName,
    last_name: lastName,
    dob: dob,
    gender: gender,
    blood_group: bloodGroup,
    primary_parent_id: parentId,
    assigned_therapist_id: therapistId,
    address: address,
    notes: notes,
    age_months: 38
  });

  window.closeActiveModal();
  window.showToast(`Child file ${newChild.child_code} successfully registered!`, 'success');
  window.openChildProfile(newChild.id);
};

// Book Appointment Modal
window.showBookAppointmentModal = function(preselectedChildId = null) {
  const children = window.neuroDB.getChildren();
  const therapists = window.neuroDB.getUsers().filter(u => u.role === 'Therapist' && u.is_active);

  const body = `
    <form id="book-appointment-form" onsubmit="window.handleBookAppointmentSubmit(event)">
      <div class="form-group">
        <label class="form-label">Child Patient <span class="required">*</span></label>
        <select id="apt-child" class="form-control" required>
          ${children.map(c => `<option value="${c.id}" ${c.id === preselectedChildId ? 'selected' : ''}>${c.first_name} ${c.last_name} (${c.child_code})</option>`).join('')}
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Therapist Practitioner <span class="required">*</span></label>
        <select id="apt-therapist" class="form-control" required>
          ${therapists.map(t => `<option value="${t.id}">${t.full_name}</option>`).join('')}
        </select>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
        <div class="form-group">
          <label class="form-label">Appointment Date <span class="required">*</span></label>
          <input type="date" id="apt-date" class="form-control" value="${new Date().toISOString().split('T')[0]}" required>
        </div>
        <div class="form-group">
          <label class="form-label">Time Slot <span class="required">*</span></label>
          <select id="apt-time" class="form-control" required>
            <option value="09:00 AM">09:00 AM - 09:45 AM</option>
            <option value="10:00 AM">10:00 AM - 10:45 AM</option>
            <option value="11:30 AM">11:30 AM - 12:15 PM</option>
            <option value="02:00 PM">02:00 PM - 02:45 PM</option>
            <option value="03:30 PM">03:30 PM - 04:15 PM</option>
            <option value="04:30 PM">04:30 PM - 05:15 PM</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Session Purpose / Type <span class="required">*</span></label>
        <select id="apt-type" class="form-control">
          <option value="Initial Screening Assessment">Initial Screening Assessment</option>
          <option value="Therapy Session">Therapy Session (Sensory & Speech)</option>
          <option value="Progress Review">Progress Review Consultation</option>
          <option value="Parent Guidance & Debrief">Parent Guidance & Debrief</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Clinical / Intake Notes</label>
        <input type="text" id="apt-notes" class="form-control" placeholder="Special equipment, parent participation requested...">
      </div>
    </form>
  `;
  const footer = `
    <button class="btn btn-outline" onclick="window.closeActiveModal()">Cancel</button>
    <button class="btn btn-primary" onclick="document.getElementById('book-appointment-form').requestSubmit()">Confirm Booking</button>
  `;
  window.openModal('Schedule Clinical Appointment', body, footer);
};

window.showBookAppointmentForChild = function(childId) {
  window.showBookAppointmentModal(childId);
};

window.handleBookAppointmentSubmit = function(e) {
  e.preventDefault();
  const childId = document.getElementById('apt-child')?.value;
  const therapistId = document.getElementById('apt-therapist')?.value;
  const date = document.getElementById('apt-date')?.value;
  const time = document.getElementById('apt-time')?.value;
  const type = document.getElementById('apt-type')?.value;
  const notes = document.getElementById('apt-notes')?.value;

  try {
    const currentUser = window.neuroAuth.getCurrentUser();
    window.neuroDB.createAppointment({
      child_id: childId,
      therapist_id: therapistId,
      booked_by_user_id: currentUser.id,
      appointment_date: date,
      start_time: time,
      type: type,
      notes: notes,
      status: 'Confirmed'
    });

    window.closeActiveModal();
    window.showToast('Appointment successfully scheduled and confirmed!', 'success');
    window.renderCurrentView();
  } catch (err) {
    window.showToast(err.message, 'error');
  }
};

window.showRescheduleModal = function(aptId) {
  const apt = window.neuroDB.getAppointments().find(a => a.id === aptId);
  if (!apt) return;

  const body = `
    <form id="reschedule-form" onsubmit="window.handleRescheduleSubmit(event, '${apt.id}')">
      <div class="form-group">
        <label class="form-label">New Appointment Date <span class="required">*</span></label>
        <input type="date" id="resched-date" class="form-control" value="${apt.appointment_date}" required>
      </div>
      <div class="form-group">
        <label class="form-label">New Time Slot <span class="required">*</span></label>
        <select id="resched-time" class="form-control" required>
          <option value="09:00 AM">09:00 AM - 09:45 AM</option>
          <option value="10:00 AM">10:00 AM - 10:45 AM</option>
          <option value="11:30 AM">11:30 AM - 12:15 PM</option>
          <option value="02:00 PM">02:00 PM - 02:45 PM</option>
          <option value="03:30 PM">03:30 PM - 04:15 PM</option>
        </select>
      </div>
    </form>
  `;
  const footer = `
    <button class="btn btn-outline" onclick="window.closeActiveModal()">Cancel</button>
    <button class="btn btn-primary" onclick="document.getElementById('reschedule-form').requestSubmit()">Update Schedule</button>
  `;
  window.openModal('Reschedule Appointment', body, footer);
};

window.handleRescheduleSubmit = function(e, aptId) {
  e.preventDefault();
  const date = document.getElementById('resched-date')?.value;
  const time = document.getElementById('resched-time')?.value;

  window.neuroDB.updateAppointment(aptId, { appointment_date: date, start_time: time, status: 'Rescheduled' });
  window.closeActiveModal();
  window.showToast('Appointment rescheduled.', 'success');
  window.renderCurrentView();
};

window.cancelAppointment = function(aptId) {
  window.neuroDB.updateAppointment(aptId, { status: 'Cancelled' });
  window.showToast('Appointment cancelled.', 'info');
  window.renderCurrentView();
};

// Session Logger Modal
window.showRecordSessionModal = function(preselectedChildId = null) {
  const children = window.neuroDB.getChildren();
  const currentUser = window.neuroAuth.getCurrentUser();

  const body = `
    <form id="record-session-form" onsubmit="window.handleRecordSessionSubmit(event)">
      <div class="form-group">
        <label class="form-label">Child Patient <span class="required">*</span></label>
        <select id="sess-child" class="form-control" required>
          ${children.map(c => `<option value="${c.id}" ${c.id === preselectedChildId ? 'selected' : ''}>${c.first_name} ${c.last_name} (${c.child_code})</option>`).join('')}
        </select>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px;">
        <div class="form-group">
          <label class="form-label">Session Date <span class="required">*</span></label>
          <input type="date" id="sess-date" class="form-control" value="${new Date().toISOString().split('T')[0]}" required>
        </div>
        <div class="form-group">
          <label class="form-label">Duration (Minutes)</label>
          <input type="number" id="sess-duration" class="form-control" value="45" min="15" max="120">
        </div>
        <div class="form-group">
          <label class="form-label">Progress Rating (1–5)</label>
          <select id="sess-rating" class="form-control">
            <option value="5.0">5.0 - Exceptional Engagement</option>
            <option value="4.5">4.5 - Strong Progress</option>
            <option value="4.0" selected>4.0 - Good Response</option>
            <option value="3.5">3.5 - Moderate / Some Distress</option>
            <option value="3.0">3.0 - Baseline Maintenance</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Activities Conducted</label>
        <input type="text" id="sess-activities" class="form-control" placeholder="e.g. Mirror imitation, bubble blowing for eye contact, sensory swing regulation" required>
      </div>

      <div class="form-group">
        <label class="form-label">Clinical Observations & Child Response <span class="required">*</span></label>
        <textarea id="sess-obs" class="form-control" rows="3" placeholder="Observed vocalizations, joint attention latency, sensory tolerance..." required></textarea>
      </div>

      <div class="form-group">
        <label class="form-label">Recommendations & Home Activity for Parent</label>
        <input type="text" id="sess-home-notes" class="form-control" placeholder="e.g. Practice 10 mins of floor play using pointing gestures daily.">
      </div>
    </form>
  `;
  const footer = `
    <button class="btn btn-outline" onclick="window.closeActiveModal()">Cancel</button>
    <button class="btn btn-primary" onclick="document.getElementById('record-session-form').requestSubmit()">Save Session Record</button>
  `;
  window.openModal('Log Clinical Therapy Session', body, footer, true);
};

window.showRecordSessionForChild = function(childId) {
  window.showRecordSessionModal(childId);
};

window.handleRecordSessionSubmit = function(e) {
  e.preventDefault();
  const childId = document.getElementById('sess-child')?.value;
  const date = document.getElementById('sess-date')?.value;
  const duration = document.getElementById('sess-duration')?.value;
  const rating = document.getElementById('sess-rating')?.value;
  const activities = document.getElementById('sess-activities')?.value;
  const obs = document.getElementById('sess-obs')?.value;
  const homeNotes = document.getElementById('sess-home-notes')?.value;

  const currentUser = window.neuroAuth.getCurrentUser();
  window.neuroDB.createTherapySession({
    child_id: childId,
    therapist_id: currentUser.id,
    session_date: date,
    duration_mins: duration,
    progress_rating: rating,
    activities_done: activities,
    observations: obs,
    next_session_notes: homeNotes
  });

  window.closeActiveModal();
  window.showToast('Clinical session logged and synchronized.', 'success');
  window.openChildProfileTab(childId, 'sessions');
};

// Create Therapy Plan Modal
window.showCreateTherapyPlanModal = function(preselectedChildId = null) {
  const children = window.neuroDB.getChildren();
  const body = `
    <form id="new-therapy-plan-form" onsubmit="window.handleCreateTherapyPlanSubmit(event)">
      <div class="form-group">
        <label class="form-label">Child Patient <span class="required">*</span></label>
        <select id="tp-child" class="form-control" required>
          ${children.map(c => `<option value="${c.id}" ${c.id === preselectedChildId ? 'selected' : ''}>${c.first_name} ${c.last_name} (${c.child_code})</option>`).join('')}
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Plan Title <span class="required">*</span></label>
        <input type="text" id="tp-title" class="form-control" placeholder="e.g. Social Communication & Joint Attention Roadmap" required>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
        <div class="form-group">
          <label class="form-label">Target Completion Date</label>
          <input type="date" id="tp-target-date" class="form-control" value="2026-06-30" required>
        </div>
        <div class="form-group">
          <label class="form-label">Weekly Frequency</label>
          <select id="tp-freq" class="form-control">
            <option value="2 Sessions / Week">2 Sessions / Week</option>
            <option value="1 Session / Week">1 Session / Week</option>
            <option value="3 Sessions / Week">3 Sessions / Week</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Primary Goal 1</label>
        <input type="text" id="tp-goal-1" class="form-control" placeholder="e.g. Joint Attention & Eye Gaze for 3+ seconds in 8/10 trials" required>
      </div>

      <div class="form-group">
        <label class="form-label">Primary Goal 2</label>
        <input type="text" id="tp-goal-2" class="form-control" placeholder="e.g. Expressive 2-word requesting approximations">
      </div>
    </form>
  `;
  const footer = `
    <button class="btn btn-outline" onclick="window.closeActiveModal()">Cancel</button>
    <button class="btn btn-primary" onclick="document.getElementById('new-therapy-plan-form').requestSubmit()">Save Therapy Plan</button>
  `;
  window.openModal('Formulate Individualized Therapy Plan', body, footer);
};

window.handleCreateTherapyPlanSubmit = function(e) {
  e.preventDefault();
  const childId = document.getElementById('tp-child')?.value;
  const title = document.getElementById('tp-title')?.value;
  const targetDate = document.getElementById('tp-target-date')?.value;
  const freq = document.getElementById('tp-freq')?.value;
  const goal1 = document.getElementById('tp-goal-1')?.value;
  const goal2 = document.getElementById('tp-goal-2')?.value;

  const goals = [
    { id: 'g_' + Date.now(), title: goal1, target: goal1, progress_pct: 20, status: 'In Progress' }
  ];
  if (goal2) {
    goals.push({ id: 'g_' + (Date.now() + 1), title: goal2, target: goal2, progress_pct: 15, status: 'In Progress' });
  }

  const currentUser = window.neuroAuth.getCurrentUser();
  window.neuroDB.createTherapyPlan({
    child_id: childId,
    therapist_id: currentUser.id,
    title: title,
    target_date: targetDate,
    frequency: freq,
    goals: goals
  });

  window.closeActiveModal();
  window.showToast('Therapy plan formulated successfully.', 'success');
  window.openChildProfileTab(childId, 'therapy-plan');
};

// System Settings Modal & Reset
window.showSettingsModal = function() {
  const body = `
    <div style="font-size: 13.5px; color: var(--slate-700); line-height: 1.6;">
      <h4 style="font-weight: 700; color: var(--slate-900); margin-bottom: 8px;">Clinic Configuration & Research Baseline</h4>
      <p style="margin-bottom: 16px;">NEUROSPECTRA operates under clinical data privacy architecture patterns with client-side relational persistence for fast MCA project evaluation.</p>

      <div style="background: var(--slate-50); border: 1px solid var(--slate-200); border-radius: var(--radius-md); padding: 14px; margin-bottom: 16px;">
        <div><strong>Screening Standard:</strong> M-CHAT-R/F (20 items, automated risk categorization)</div>
        <div style="margin-top: 4px;"><strong>Database Version:</strong> 1.0.0-relational (Indexed Local Engine)</div>
        <div style="margin-top: 4px;"><strong>Active Environment:</strong> Production Evaluation Mode</div>
      </div>

      <div style="border-top: 1px solid var(--slate-200); padding-top: 14px;">
        <h4 style="font-weight: 700; color: var(--danger-500); margin-bottom: 6px;">Reset Demo Data</h4>
        <p style="font-size: 12.5px; color: var(--slate-500); margin-bottom: 10px;">Reset all children, appointments, assessments and therapy plans back to pristine factory demo seed data.</p>
        <button class="btn btn-danger btn-sm" onclick="window.resetDatabaseDefaults()">Reset Seed Database</button>
      </div>
    </div>
  `;
  const footer = `
    <button class="btn btn-primary" onclick="window.closeActiveModal()">Done</button>
  `;
  window.openModal('NEUROSPECTRA System Settings', body, footer);
};

window.resetDatabaseDefaults = function() {
  window.neuroDB.resetToDefaults();
  window.closeActiveModal();
  window.showToast('Database reset to fresh MCA demo seed records!', 'success');
  window.renderCurrentView();
};

// ============================================================================
// Distinct Role-Based User Profiles
// ============================================================================

window.renderUserProfileView = function() {
  const currentUser = window.neuroAuth.getCurrentUser();
  if (!currentUser) return '';
  const db = window.neuroDB;
  const role = currentUser.role;

  let roleBadgeBg = '#eff6ff';
  let roleBadgeColor = '#2563eb';
  let roleTitle = 'Platform User';

  if (role === 'Administrator') {
    roleBadgeBg = '#fdf4ff';
    roleBadgeColor = '#a855f7';
    roleTitle = 'System Administrator (Super Admin)';
  } else if (role === 'Therapist') {
    roleBadgeBg = '#f0fdf4';
    roleBadgeColor = '#16a34a';
    roleTitle = 'Licensed Clinical Specialist (BCBA-D)';
  } else if (role === 'Receptionist') {
    roleBadgeBg = '#fffbeb';
    roleBadgeColor = '#d97706';
    roleTitle = 'Clinical Intake & Scheduling Coordinator';
  } else if (role === 'Parent / Caregiver') {
    roleBadgeBg = '#ecfdf5';
    roleBadgeColor = '#059669';
    roleTitle = 'Primary Family Caregiver';
  } else if (role === 'Teacher') {
    roleBadgeBg = '#f0f9ff';
    roleBadgeColor = '#0284c7';
    roleTitle = 'Special Educator & Classroom Partner';
  }

  const allChildren = db.getChildren();
  const allAppointments = db.getAppointments();

  let roleSectionHtml = '';
  if (role === 'Administrator') {
    const allUsers = db.getUsers();
    roleSectionHtml = `
      <div class="card" style="margin-bottom: 24px;">
        <h3 style="font-size: 15px; font-weight: 800; color: #0f172a; margin-bottom: 14px; display: flex; align-items: center; gap: 8px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Administrator Scope & System Permissions
        </h3>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 16px;">
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; text-align: center;">
            <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Total Users</div>
            <div style="font-size: 22px; font-weight: 800; color: #0f172a; margin-top: 4px;">${allUsers.length}</div>
            <div style="font-size: 11.5px; color: #a855f7; font-weight: 600;">System Wide</div>
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; text-align: center;">
            <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Registered Children</div>
            <div style="font-size: 22px; font-weight: 800; color: #0f172a; margin-top: 4px;">${allChildren.length}</div>
            <div style="font-size: 11.5px; color: #16a34a; font-weight: 600;">Clinical Registry</div>
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; text-align: center;">
            <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Total Bookings</div>
            <div style="font-size: 22px; font-weight: 800; color: #0f172a; margin-top: 4px;">${allAppointments.length}</div>
            <div style="font-size: 11.5px; color: #2563eb; font-weight: 600;">Appointments</div>
          </div>
        </div>
        <div style="font-size: 12.5px; color: #475569; background: #faf5ff; border: 1px solid #f3e8ff; border-radius: 8px; padding: 12px; line-height: 1.5;">
          <strong>Super Admin Privileges:</strong> Full authorization to manage user roles, audit clinical records, add therapists/teachers, and perform database maintenance.
        </div>
      </div>
    `;
  } else if (role === 'Therapist') {
    const myChildren = allChildren.filter(c => c.assigned_therapist_id === currentUser.id);
    const myApts = allAppointments.filter(a => a.therapist_id === currentUser.id);
    const myPlans = (db.getTherapyPlans() || []).filter(p => p.therapist_id === currentUser.id);

    roleSectionHtml = `
      <div class="card" style="margin-bottom: 24px;">
        <h3 style="font-size: 15px; font-weight: 800; color: #0f172a; margin-bottom: 14px; display: flex; align-items: center; gap: 8px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          Clinical Specialist Credentials & Caseload
        </h3>
        
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 18px;">
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 14px; text-align: center;">
            <div style="font-size: 11px; font-weight: 700; color: #166534; text-transform: uppercase;">Assigned Patients</div>
            <div style="font-size: 22px; font-weight: 800; color: #166534; margin-top: 4px;">${myChildren.length} Children</div>
          </div>
          <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 14px; text-align: center;">
            <div style="font-size: 11px; font-weight: 700; color: #1e40af; text-transform: uppercase;">Therapy Roadmaps</div>
            <div style="font-size: 22px; font-weight: 800; color: #1e40af; margin-top: 4px;">${myPlans.length} Active IEPs</div>
          </div>
          <div style="background: #faf5ff; border: 1px solid #f3e8ff; border-radius: 8px; padding: 14px; text-align: center;">
            <div style="font-size: 11px; font-weight: 700; color: #7e22ce; text-transform: uppercase;">Clinical Sessions</div>
            <div style="font-size: 22px; font-weight: 800; color: #7e22ce; margin-top: 4px;">${myApts.length} Scheduled</div>
          </div>
        </div>

        <div>
          <div style="font-size: 13px; font-weight: 700; color: #1e293b; margin-bottom: 8px;">My Assigned Child Patients:</div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            ${myChildren.map(c => `
              <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 8px 14px; display: flex; align-items: center; gap: 10px; cursor: pointer; transition: all 0.2s;" onclick="window.navigateTo('child-profile', { childId: '${c.id}' })" onmouseover="this.style.borderColor='#3b82f6'" onmouseout="this.style.borderColor='#cbd5e1'">
                <div>
                  <div style="font-weight: 700; font-size: 13px; color: #0f172a;">${c.first_name} ${c.last_name}</div>
                  <div style="font-size: 11px; color: #64748b; font-family: monospace;">${c.child_code} &bull; ${c.age_months} Months</div>
                </div>
                <span class="badge ${c.status === 'Active' ? 'badge-active' : 'badge-scheduled'}">${c.status}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  } else if (role === 'Receptionist') {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayApts = allAppointments.filter(a => a.appointment_date === todayStr);

    roleSectionHtml = `
      <div class="card" style="margin-bottom: 24px;">
        <h3 style="font-size: 15px; font-weight: 800; color: #0f172a; margin-bottom: 14px; display: flex; align-items: center; gap: 8px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2.2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          Reception & Intake Coordination Desk
        </h3>
        
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 16px;">
          <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 14px; text-align: center;">
            <div style="font-size: 11px; font-weight: 700; color: #b45309; text-transform: uppercase;">Today's Clinic Visits</div>
            <div style="font-size: 22px; font-weight: 800; color: #b45309; margin-top: 4px;">${todayApts.length} Visits</div>
          </div>
          <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 14px; text-align: center;">
            <div style="font-size: 11px; font-weight: 700; color: #1e40af; text-transform: uppercase;">Total Bookings</div>
            <div style="font-size: 22px; font-weight: 800; color: #1e40af; margin-top: 4px;">${allAppointments.length} Managed</div>
          </div>
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 14px; text-align: center;">
            <div style="font-size: 11px; font-weight: 700; color: #166534; text-transform: uppercase;">Registered Children</div>
            <div style="font-size: 22px; font-weight: 800; color: #166534; margin-top: 4px;">${allChildren.length} Files</div>
          </div>
        </div>

        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button class="btn btn-primary btn-sm" onclick="window.showRegisterChildModal()">+ Register New Child</button>
          <button class="btn btn-accent btn-sm" onclick="window.showBookAppointmentModal()">+ Book Appointment</button>
          <button class="btn btn-outline btn-sm" onclick="window.navigateTo('reports')">View Administrative Reports</button>
        </div>
      </div>
    `;
  } else if (role === 'Parent / Caregiver') {
    const myChildren = allChildren.filter(c => c.primary_parent_id === currentUser.id);
    const myChild = myChildren[0] || allChildren[0];
    const therapist = myChild ? db.getUserById(myChild.assigned_therapist_id) : null;

    roleSectionHtml = `
      <div class="card" style="margin-bottom: 24px;">
        <h3 style="font-size: 15px; font-weight: 800; color: #0f172a; margin-bottom: 14px; display: flex; align-items: center; gap: 8px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.2"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
          Linked Child Profile & Clinical Care Team
        </h3>
        
        ${myChild ? `
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <div>
                <div style="font-size: 11px; font-weight: 700; color: #059669; text-transform: uppercase;">Linked Child Patient</div>
                <div style="font-size: 16px; font-weight: 800; color: #0f172a;">${myChild.first_name} ${myChild.last_name}</div>
              </div>
              <span style="font-family: monospace; font-weight: 700; color: #2563eb; background: #eff6ff; padding: 3px 8px; border-radius: 6px; font-size: 12px;">${myChild.child_code}</span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; font-size: 12.5px;">
              <div><strong style="color: #64748b;">Age & Gender:</strong> <div>${myChild.age_months} Months (${myChild.gender})</div></div>
              <div><strong style="color: #64748b;">Assigned Specialist:</strong> <div style="font-weight: 700; color: #0f172a;">${therapist ? therapist.full_name : 'Dr. Aisha Khan, Ph.D.'}</div></div>
              <div><strong style="color: #64748b;">Caregiver Contact:</strong> <div>${currentUser.phone || '+91 9876543214'}</div></div>
            </div>
          </div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="btn btn-primary btn-sm" onclick="window.navigateTo('child-profile', { childId: '${myChild.id}' })">View Full Child Profile</button>
            <button class="btn btn-outline btn-sm" onclick="window.navigateTo('progress', { childId: '${myChild.id}' })">Milestone Progress</button>
            <button class="btn btn-secondary btn-sm" onclick="window.navigateTo('reports')">Clinical Reports</button>
          </div>
        ` : `
          <p style="font-size: 13px; color: #64748b;">No linked child registered under this caregiver profile yet.</p>
        `}
      </div>
    `;
  } else if (role === 'Teacher') {
    roleSectionHtml = `
      <div class="card" style="margin-bottom: 24px;">
        <h3 style="font-size: 15px; font-weight: 800; color: #0f172a; margin-bottom: 14px; display: flex; align-items: center; gap: 8px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2.2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/></svg>
          Special Educator Classroom & Behavioral Coordination
        </h3>
        <p style="font-size: 13px; color: #475569; line-height: 1.5; margin-bottom: 12px;">
          Collaborates with pediatric clinic specialists to align classroom sensory adaptations, peer interactions, and IEP milestone tracking in educational settings.
        </p>
        <button class="btn btn-outline btn-sm" onclick="window.navigateTo('dashboard')">View Classroom IEP Dashboard</button>
      </div>
    `;
  }

  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">My Account & Profile</h1>
        <p class="page-subtitle">Personal information, role credentials, and account customization for <strong>${currentUser.full_name}</strong>.</p>
      </div>
      <div style="display: flex; gap: 10px;">
        <button class="btn btn-outline" onclick="window.navigateTo('dashboard')">
          &larr; Back to Dashboard
        </button>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 340px 1fr; gap: 24px;">
      
      <!-- Left Column: User Identity Card -->
      <div class="card" style="text-align: center; padding: 28px 20px;">
        <div style="position: relative; display: inline-block; margin-bottom: 16px;">
          <img id="profile-avatar-preview" src="${currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}" alt="${currentUser.full_name}" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 3px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
          <span style="position: absolute; bottom: 4px; right: 4px; width: 18px; height: 18px; background: #10b981; border: 3px solid #ffffff; border-radius: 50%;" title="Active Account"></span>
        </div>

        <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 4px;">${currentUser.full_name}</h2>
        <div style="font-size: 13px; color: #64748b; margin-bottom: 12px;">${currentUser.email}</div>

        <div style="display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; background: ${roleBadgeBg}; color: ${roleBadgeColor}; margin-bottom: 16px;">
          ${role}
        </div>

        <div style="text-align: left; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; font-size: 12.5px; color: #475569; margin-bottom: 18px;">
          <div style="margin-bottom: 6px;"><strong>User ID:</strong> <span style="font-family: monospace; color: #0f172a;">${currentUser.id}</span></div>
          <div style="margin-bottom: 6px;"><strong>Phone:</strong> <span style="color: #0f172a;">${currentUser.phone || '+91 9876543210'}</span></div>
          <div><strong>Status:</strong> <span style="color: #16a34a; font-weight: 700;">Active Account</span></div>
        </div>

        <button class="btn btn-outline btn-sm" style="width: 100%;" onclick="window.handleLogout()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Sign Out of Account
        </button>
      </div>

      <!-- Right Column: Role Details & Edit Form -->
      <div>
        ${roleSectionHtml}

        <!-- Edit Profile Form Card -->
        <div class="card">
          <div class="card-header" style="border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 18px;">
            <div class="card-title" style="font-size: 16px; font-weight: 800; color: #0f172a;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Edit Profile & Credentials
            </div>
          </div>

          <form id="edit-user-profile-form" onsubmit="window.handleUpdateProfileSubmit(event)">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label">Full Name <span class="required">*</span></label>
                <input type="text" id="edit-profile-name" class="form-control" value="${currentUser.full_name}" required>
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label">Phone Number (Indian Mobile) <span class="required">*</span></label>
                <input type="tel" id="edit-profile-phone" class="form-control" value="${currentUser.phone || ''}" placeholder="+91 9876543210" required>
              </div>
            </div>

            <div class="form-group" style="margin-bottom: 16px;">
              <label class="form-label">Work / Account Email</label>
              <input type="email" class="form-control" value="${currentUser.email}" disabled style="background: #f1f5f9; color: #64748b; cursor: not-allowed;" title="Email cannot be modified directly">
              <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Email is tied to your NEUROSPECTRA clinical authorization ID.</div>
            </div>

            <div class="form-group" style="margin-bottom: 16px;">
              <label class="form-label">Profile Avatar URL</label>
              <input type="url" id="edit-profile-avatar" class="form-control" value="${currentUser.avatar_url || ''}" placeholder="https://..." oninput="const p = document.getElementById('profile-avatar-preview'); if (p) p.src = this.value">
              
              <!-- Quick Avatar Selection Presets -->
              <div style="margin-top: 8px;">
                <div style="font-size: 11.5px; font-weight: 600; color: #64748b; margin-bottom: 6px;">Or choose a quick avatar preset:</div>
                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                  ${[
                    'https://images.unsplash.com/photo-1594824813589-3221e5138137?auto=format&fit=crop&q=80&w=256',
                    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=256',
                    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
                    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256',
                    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256'
                  ].map(url => `
                    <img src="${url}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; cursor: pointer; border: 2px solid ${currentUser.avatar_url === url ? '#2563eb' : '#e2e8f0'};" onclick="window.selectAvatarPreset('${url}')">
                  `).join('')}
                </div>
              </div>
            </div>

            <!-- Password Update (Optional) -->
            <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; margin-bottom: 20px;">
              <h4 style="font-size: 13.5px; font-weight: 700; color: #0f172a; margin-bottom: 10px;">Change Password (Optional)</h4>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div class="form-group" style="margin-bottom: 0;">
                  <label class="form-label" style="font-size: 12px;">New Password</label>
                  <input type="password" id="edit-profile-newpwd" class="form-control" placeholder="Leave blank to keep current">
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                  <label class="form-label" style="font-size: 12px;">Confirm New Password</label>
                  <input type="password" id="edit-profile-confirmpwd" class="form-control" placeholder="Re-enter new password">
                </div>
              </div>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 10px;">
              <button type="submit" class="btn btn-primary">
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>

      </div>

    </div>
  `;
};

// Open distinct user profile in modal dialog
window.showUserProfileModal = function() {
  const currentUser = window.neuroAuth.getCurrentUser();
  if (!currentUser) return;
  const db = window.neuroDB;
  const role = currentUser.role;

  let roleBadgeBg = '#eff6ff';
  let roleBadgeColor = '#2563eb';
  let roleDesc = 'Authenticated NEUROSPECTRA user profile.';

  if (role === 'Administrator') {
    roleBadgeBg = '#fdf4ff';
    roleBadgeColor = '#a855f7';
    roleDesc = 'Full administrative control, clinician provisioning, database management, and clinic compliance.';
  } else if (role === 'Therapist') {
    roleBadgeBg = '#f0fdf4';
    roleBadgeColor = '#16a34a';
    roleDesc = 'Licensed Clinical Specialist (BCBA-D) conducting M-CHAT-R/F screenings & formulation of active IEP milestone plans.';
  } else if (role === 'Receptionist') {
    roleBadgeBg = '#fffbeb';
    roleBadgeColor = '#d97706';
    roleDesc = 'Front-Desk & Intake Coordinator managing registrations, appointments, daily roster, and reminder dispatches.';
  } else if (role === 'Parent / Caregiver') {
    roleBadgeBg = '#ecfdf5';
    roleBadgeColor = '#059669';
    roleDesc = 'Primary Family Caregiver monitoring developmental milestone achievements and clinical therapy sessions.';
  } else if (role === 'Teacher') {
    roleBadgeBg = '#f0f9ff';
    roleBadgeColor = '#0284c7';
    roleDesc = 'Special Educator coordinating classroom behavioral adjustments and student IEP alignments.';
  }

  const allChildren = db.getChildren();
  const allAppointments = db.getAppointments();

  // Role specific extra summary details inside modal
  let extraDetailsHtml = '';
  if (role === 'Therapist') {
    const myChildren = allChildren.filter(c => c.assigned_therapist_id === currentUser.id);
    extraDetailsHtml = `
      <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px; margin-bottom: 16px; font-size: 12.5px;">
        <div style="font-weight: 700; color: #166534; margin-bottom: 4px;">Assigned Caseload (${myChildren.length} Children):</div>
        <div style="color: #15803d;">${myChildren.map(c => `${c.first_name} ${c.last_name} (${c.child_code})`).join(', ') || 'No active cases assigned'}</div>
      </div>
    `;
  } else if (role === 'Parent / Caregiver') {
    const myChildren = allChildren.filter(c => c.primary_parent_id === currentUser.id);
    const myChild = myChildren[0] || allChildren[0];
    const therapist = myChild ? db.getUserById(myChild.assigned_therapist_id) : null;
    extraDetailsHtml = `
      <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 12px; margin-bottom: 16px; font-size: 12.5px;">
        <div style="font-weight: 700; color: #065f46; margin-bottom: 2px;">Linked Child Patient: ${myChild ? `${myChild.first_name} ${myChild.last_name} (${myChild.child_code})` : 'None'}</div>
        <div style="color: #047857;">Assigned Clinical Specialist: <strong>${therapist ? therapist.full_name : 'Dr. Aisha Khan, Ph.D.'}</strong></div>
      </div>
    `;
  } else if (role === 'Receptionist') {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayApts = allAppointments.filter(a => a.appointment_date === todayStr);
    extraDetailsHtml = `
      <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 12px; margin-bottom: 16px; font-size: 12.5px;">
        <div style="font-weight: 700; color: #b45309; margin-bottom: 2px;">Intake & Roster Status:</div>
        <div style="color: #92400e;"><strong>${todayApts.length} Visits Today</strong> &bull; ${allChildren.length} Registered Clinic Files &bull; Full Administrative Report Access</div>
      </div>
    `;
  }

  const content = `
    <div style="font-family: 'Plus Jakarta Sans', sans-serif;">
      
      <!-- Top Profile Identity Banner -->
      <div style="display: flex; align-items: center; gap: 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 20px;">
        <div style="position: relative;">
          <img id="modal-avatar-preview" src="${currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}" alt="${currentUser.full_name}" style="width: 72px; height: 72px; border-radius: 50%; object-fit: cover; border: 2.5px solid #2563eb;">
          <span style="position: absolute; bottom: 2px; right: 2px; width: 14px; height: 14px; background: #10b981; border: 2px solid #ffffff; border-radius: 50%;" title="Active"></span>
        </div>
        <div style="flex: 1;">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
            <h3 style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 0;">${currentUser.full_name}</h3>
            <span style="padding: 2px 8px; border-radius: 6px; font-size: 11.5px; font-weight: 700; background: ${roleBadgeBg}; color: ${roleBadgeColor};">${role}</span>
          </div>
          <div style="font-size: 13px; color: #64748b; margin-bottom: 4px;">${currentUser.email} &bull; ${currentUser.phone || '+91 9876543210'}</div>
          <div style="font-size: 12px; color: #475569; line-height: 1.4;">${roleDesc}</div>
        </div>
      </div>

      ${extraDetailsHtml}

      <!-- Edit Profile Form -->
      <form id="edit-user-profile-form" onsubmit="window.handleUpdateProfileSubmit(event)">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label" style="font-size: 12.5px; font-weight: 600; color: #1e293b; margin-bottom: 4px; display: block;">Full Name <span style="color: #ef4444;">*</span></label>
            <input type="text" id="edit-profile-name" class="form-control" value="${currentUser.full_name}" required style="padding: 8px 12px; font-size: 13px;">
          </div>
          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label" style="font-size: 12.5px; font-weight: 600; color: #1e293b; margin-bottom: 4px; display: block;">Phone Number <span style="color: #ef4444;">*</span></label>
            <input type="tel" id="edit-profile-phone" class="form-control" value="${currentUser.phone || ''}" placeholder="+91 9876543210" required style="padding: 8px 12px; font-size: 13px;">
          </div>
        </div>

        <div class="form-group" style="margin-bottom: 14px;">
          <label class="form-label" style="font-size: 12.5px; font-weight: 600; color: #1e293b; margin-bottom: 4px; display: block;">Profile Avatar URL</label>
          <input type="url" id="edit-profile-avatar" class="form-control" value="${currentUser.avatar_url || ''}" placeholder="https://..." style="padding: 8px 12px; font-size: 13px;" oninput="const p = document.getElementById('modal-avatar-preview'); if (p) p.src = this.value">
          
          <div style="margin-top: 6px; display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 11px; color: #64748b;">Preset Avatars:</span>
            ${[
              'https://images.unsplash.com/photo-1594824813589-3221e5138137?auto=format&fit=crop&q=80&w=256',
              'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=256',
              'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
              'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256',
              'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256'
            ].map(url => `
              <img src="${url}" style="width: 26px; height: 26px; border-radius: 50%; object-fit: cover; cursor: pointer; border: 1.5px solid ${currentUser.avatar_url === url ? '#2563eb' : '#cbd5e1'};" onclick="window.selectAvatarPreset('${url}')">
            `).join('')}
          </div>
        </div>

        <!-- Password update -->
        <div style="border-top: 1px solid #e2e8f0; padding-top: 12px; margin-bottom: 16px;">
          <div style="font-size: 12px; font-weight: 700; color: #334155; margin-bottom: 8px;">Change Password (Optional)</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <input type="password" id="edit-profile-newpwd" class="form-control" placeholder="New password" style="padding: 7px 10px; font-size: 12.5px;">
            <input type="password" id="edit-profile-confirmpwd" class="form-control" placeholder="Confirm new password" style="padding: 7px 10px; font-size: 12.5px;">
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 10px;">
          <button type="button" class="btn btn-secondary" onclick="window.closeActiveModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Save Profile Changes</button>
        </div>
      </form>
    </div>
  `;

  window.openModal(`My Profile — ${currentUser.full_name}`, content, '', true);
};

window.handleUpdateProfileSubmit = function(e) {
  e.preventDefault();
  const name = document.getElementById('edit-profile-name').value.trim();
  const phone = document.getElementById('edit-profile-phone').value.trim();
  const avatar = document.getElementById('edit-profile-avatar').value.trim();
  const newPwd = document.getElementById('edit-profile-newpwd')?.value;
  const confirmPwd = document.getElementById('edit-profile-confirmpwd')?.value;

  if (name.length < 3) {
    window.showToast('Full name must be at least 3 characters.', 'error');
    return;
  }

  if (newPwd) {
    if (newPwd.length < 8) {
      window.showToast('New password must be at least 8 characters long.', 'error');
      return;
    }
    if (newPwd !== confirmPwd) {
      window.showToast('New passwords do not match.', 'error');
      return;
    }
  }

  const currentUser = window.neuroAuth.getCurrentUser();
  if (!currentUser) return;

  const updates = {
    full_name: name,
    phone: phone,
    avatar_url: avatar || currentUser.avatar_url
  };

  if (newPwd) {
    updates.password_hash = window.neuroDB.hashPassword(newPwd);
    updates.raw_pwd_hash = newPwd;
  }

  const updatedUser = window.neuroDB.updateUser(currentUser.id, updates);
  if (updatedUser) {
    window.neuroAuth.setSession(updatedUser, window.neuroAuth.token);
    window.closeActiveModal();
    window.showToast('Profile updated successfully!', 'success');
    window.renderApp();
  } else {
    window.showToast('Failed to update profile.', 'error');
  }
};

window.selectAvatarPreset = function(url) {
  const input = document.getElementById('edit-profile-avatar');
  const preview1 = document.getElementById('profile-avatar-preview');
  const preview2 = document.getElementById('modal-avatar-preview');
  if (input) input.value = url;
  if (preview1) preview1.src = url;
  if (preview2) preview2.src = url;
};

// Interactive Actions
window.startNewAssessment = function() {
  window.navigateTo('assessment-conduct');
};

window.startAssessmentForChild = function(childId) {
  window.navigateTo('assessment-conduct', { childId });
};

// Filter Tables
window.filterUsersTable = function() {
  const query = document.getElementById('user-search-input')?.value.toLowerCase().trim() || '';
  const roleFilter = document.getElementById('user-role-filter')?.value || '';
  const rows = document.querySelectorAll('#users-table tbody tr');

  rows.forEach(r => {
    const name = r.getAttribute('data-name') || '';
    const email = r.getAttribute('data-email') || '';
    const role = r.getAttribute('data-role') || '';

    const matchesQuery = !query || name.includes(query) || email.includes(query);
    const matchesRole = !roleFilter || role === roleFilter;

    r.style.display = matchesQuery && matchesRole ? '' : 'none';
  });
};

window.filterChildrenTable = function(query) {
  const q = (query || '').toLowerCase().trim();
  const rows = document.querySelectorAll('#children-table tbody tr');
  rows.forEach(r => {
    const text = r.innerText.toLowerCase();
    r.style.display = !q || text.includes(q) ? '' : 'none';
  });
};

window.renderTeacherDashboard = function() {
  const children = window.neuroDB.getChildren();
  const user = window.neuroAuth.getCurrentUser();

  return `
    <div class="page-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
      <div>
        <h1 class="page-title" style="font-size: 26px; font-weight: 800; color: #0f172a; margin-bottom: 4px;">
          Teacher & Classroom Workspace
        </h1>
        <p class="page-subtitle" style="font-size: 14px; color: #64748b;">
          Welcome, ${user?.full_name || 'Educator'}. Track classroom accommodations, sensory milestones, and IEP progress.
        </p>
      </div>
      <div style="display: flex; gap: 10px;">
        <button class="btn btn-primary" onclick="window.navigateTo('progress')">
          📊 View Progress Charts
        </button>
      </div>
    </div>

    <!-- KPI Metric Cards -->
    <div class="metrics-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px;">
      <div class="metric-card" style="background: #ffffff; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
        <div style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 6px;">Students in Care</div>
        <div style="font-size: 28px; font-weight: 800; color: #2563eb;">${children.length}</div>
        <div style="font-size: 12px; color: #10b981; margin-top: 4px; font-weight: 600;">Active Individual Plans</div>
      </div>
      <div class="metric-card" style="background: #ffffff; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
        <div style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 6px;">Sensory Accommodations</div>
        <div style="font-size: 28px; font-weight: 800; color: #059669;">100%</div>
        <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Quiet corner & visual schedules</div>
      </div>
      <div class="metric-card" style="background: #ffffff; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
        <div style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 6px;">Therapist Coordinated</div>
        <div style="font-size: 28px; font-weight: 800; color: #7c3aed;">4 Active</div>
        <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Interdisciplinary sync weekly</div>
      </div>
      <div class="metric-card" style="background: #ffffff; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
        <div style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 6px;">IEP Reviews Due</div>
        <div style="font-size: 28px; font-weight: 800; color: #f59e0b;">2 This Month</div>
        <div style="font-size: 12px; color: #f59e0b; margin-top: 4px; font-weight: 600;">Upcoming multidisciplinary meet</div>
      </div>
    </div>

    <!-- Student Tracking Roster Table -->
    <div style="background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
      <div style="padding: 18px 24px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
        <h3 style="font-size: 16px; font-weight: 700; color: #0f172a; margin: 0;">Classroom Students & Milestones</h3>
        <span style="font-size: 12px; color: #64748b;">Click on any student to view detailed diagnostic chart</span>
      </div>
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; font-size: 13.5px; text-align: left;">
          <thead>
            <tr style="background: #f8fafc; color: #64748b; border-bottom: 1px solid #e2e8f0;">
              <th style="padding: 14px 20px; font-weight: 600;">Student</th>
              <th style="padding: 14px 20px; font-weight: 600;">Age / DOB</th>
              <th style="padding: 14px 20px; font-weight: 600;">Assigned Therapist</th>
              <th style="padding: 14px 20px; font-weight: 600;">Classroom Support Notes</th>
              <th style="padding: 14px 20px; font-weight: 600;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${children.map(c => `
              <tr style="border-bottom: 1px solid #f1f5f9; transition: background 0.15s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                <td style="padding: 14px 20px; font-weight: 700; color: #0f172a;">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 32px; height: 32px; border-radius: 50%; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px;">
                      ${c.first_name[0]}${c.last_name[0]}
                    </div>
                    <div>
                      <div>${c.first_name} ${c.last_name}</div>
                      <span style="font-size: 11px; color: #94a3b8; font-weight: 500;">${c.child_code}</span>
                    </div>
                  </div>
                </td>
                <td style="padding: 14px 20px; color: #475569;">${c.age_months} mos (${c.dob})</td>
                <td style="padding: 14px 20px; color: #2563eb; font-weight: 600;">Dr. Aisha Khan</td>
                <td style="padding: 14px 20px; color: #64748b; max-width: 280px; font-size: 12.5px;">${c.notes || 'Routine sensory breaks and visual task boards enabled.'}</td>
                <td style="padding: 14px 20px;">
                  <button class="btn btn-sm btn-outline" onclick="window.navigateTo('child-profile', { childId: '${c.id}' })">
                    View Record
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
};

// Initialize Application on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  window.renderApp();
});
