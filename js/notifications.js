/**
 * NEUROSPECTRA - Messaging, In-App Notifications & Toast Dispatcher
 */

// Toast Alerts
window.showToast = function(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  let iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
  if (type === 'success') {
    iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
  } else if (type === 'error') {
    iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
  } else if (type === 'warning') {
    iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
  }

  toast.innerHTML = `
    <div style="display: flex; align-items: center; gap: 10px;">
      ${iconSvg}
      <span>${message}</span>
    </div>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
};

// In-App Notification Dropdown Toggle
window.toggleNotificationsPopover = function() {
  const popover = document.getElementById('notifications-popover');
  if (popover) {
    popover.classList.toggle('show');
  }
};

window.renderNotificationsList = function() {
  const currentUser = window.neuroAuth.getCurrentUser();
  if (!currentUser) return '';
  const notifs = window.neuroDB.getNotifications(currentUser.id);

  if (notifs.length === 0) {
    return `
      <div style="padding: 24px; text-align: center; color: var(--slate-500); font-size: 12.5px;">
        No notifications right now.
      </div>
    `;
  }

  return notifs.map(n => `
    <div class="notification-item ${n.is_read ? '' : 'unread'}" onclick="window.handleNotificationClick('${n.id}', '${n.link}')">
      <div style="font-weight: 700; color: var(--slate-900); font-size: 13px; margin-bottom: 2px;">${n.title}</div>
      <div style="color: var(--slate-600); line-height: 1.4;">${n.message}</div>
      <div style="font-size: 10.5px; color: var(--slate-400); margin-top: 4px;">${new Date(n.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
    </div>
  `).join('');
};

window.handleNotificationClick = function(id, link) {
  const popover = document.getElementById('notifications-popover');
  if (popover) popover.classList.remove('show');
  if (link && link !== '#') {
    const route = link.replace(/^#/, '');
    if (window.navigateTo) {
      window.navigateTo(route);
    } else {
      window.location.hash = link;
    }
  }
};

// Messaging Interface (Multidisciplinary: Teacher <-> Therapist <-> Parent)
window.renderMessagingView = function(selectedChildId, selectedReceiverId = null) {
  const currentUser = window.neuroAuth.getCurrentUser();
  const children = window.neuroDB.getChildren();
  
  // Filter children relevant to current user
  let availableChildren = [];
  if (currentUser.role === 'Parent / Caregiver') {
    availableChildren = children.filter(c => c.primary_parent_id === currentUser.id);
  } else if (currentUser.role === 'Therapist') {
    availableChildren = children.filter(c => c.assigned_therapist_id === currentUser.id);
  } else if (currentUser.role === 'Teacher') {
    availableChildren = children.filter(c => c.assigned_teacher_id === currentUser.id);
    if (availableChildren.length === 0) availableChildren = children;
  } else {
    availableChildren = children;
  }

  if (availableChildren.length === 0) {
    return `
      <div class="card" style="text-align: center; padding: 40px;">
        <h3 style="font-size: 16px; font-weight: 700; color: var(--slate-800); margin-bottom: 6px;">No Active Messages</h3>
        <p style="font-size: 13px; color: var(--slate-500);">You do not currently have any linked child cases to message.</p>
      </div>
    `;
  }

  const activeChildId = selectedChildId || availableChildren[0].id;
  const activeChild = window.neuroDB.getChildById(activeChildId);
  const parent = window.neuroDB.getUserById(activeChild.primary_parent_id) || window.neuroDB.getUsers().find(u => u.role === 'Parent / Caregiver');
  const therapist = window.neuroDB.getUserById(activeChild.assigned_therapist_id) || window.neuroDB.getUsers().find(u => u.role === 'Therapist');
  const teacher = window.neuroDB.getUserById(activeChild.assigned_teacher_id) || window.neuroDB.getUsers().find(u => u.role === 'Teacher');

  // Determine potential conversation partners on this child's care team
  const careTeam = [];
  if (therapist && therapist.id !== currentUser.id) careTeam.push({ label: 'Therapist', roleText: 'Clinical Therapist', user: therapist });
  if (teacher && teacher.id !== currentUser.id) careTeam.push({ label: 'Classroom Teacher', roleText: 'Special Educator', user: teacher });
  if (parent && parent.id !== currentUser.id) careTeam.push({ label: 'Parent / Caregiver', roleText: 'Primary Family Contact', user: parent });

  let otherPerson = null;
  if (selectedReceiverId) {
    otherPerson = window.neuroDB.getUserById(selectedReceiverId);
  }
  if (!otherPerson && careTeam.length > 0) {
    otherPerson = careTeam[0].user;
  }

  // Strictly query messages between currentUser and otherPerson for this specific child
  const messages = window.neuroDB.getMessages(activeChild.id, currentUser.id, otherPerson ? otherPerson.id : null);

  // Mark incoming messages as read for this specific partner
  if (otherPerson) {
    window.neuroDB.markMessagesRead(activeChild.id, currentUser.id, otherPerson.id);
  }

  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">Multidisciplinary Collaboration Messages</h1>
        <p class="page-subtitle">Direct, confidential messaging between clinical therapists, classroom teachers, and parents.</p>
      </div>
    </div>

    <div class="grid-1-2">
      <!-- Left: Conversations List -->
      <div class="card" style="padding: 16px;">
        <div style="font-weight: 700; font-size: 13.5px; color: var(--slate-900); margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid var(--slate-100);">
          Active Child Care Cases
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${availableChildren.map(c => {
            const isSelected = c.id === activeChild.id;

            return `
              <div onclick="window.navigateTo('messages', { childId: '${c.id}', receiverId: '${otherPerson ? otherPerson.id : ''}' })" 
                   style="padding: 12px 14px; border-radius: var(--radius-md); border: 1px solid ${isSelected ? 'var(--primary-500)' : 'var(--slate-200)'}; background: ${isSelected ? 'var(--primary-50)' : 'var(--white)'}; cursor: pointer; transition: var(--transition);">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div style="font-weight: 700; font-size: 13.5px; color: var(--slate-900);">${c.first_name} ${c.last_name}</div>
                  <span class="badge ${isSelected ? 'badge-active' : 'badge-neutral'}" style="font-size: 10px;">${c.child_code}</span>
                </div>
                <div style="font-size: 11.5px; color: var(--slate-600); margin-top: 3px;">
                  Care Team: Therapist, Teacher & Parent
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Right: Active Chat Window -->
      <div class="chat-container">
        <div class="chat-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div class="user-avatar" style="width: 38px; height: 38px; font-size: 14px; font-weight: 700;">${otherPerson ? otherPerson.full_name.charAt(0) : 'C'}</div>
            <div>
              <div style="font-weight: 700; font-size: 14px; color: #ffffff;">${otherPerson ? otherPerson.full_name : 'Care Team Specialist'}</div>
              <div style="font-size: 11.5px; color: #93c5fd;">
                Role: <strong>${otherPerson ? otherPerson.role : 'Specialist'}</strong> &bull; Child: <strong>${activeChild.first_name} ${activeChild.last_name} (${activeChild.child_code})</strong>
              </div>
            </div>
          </div>

          <!-- Recipient Switcher Tabs -->
          <div style="display: flex; gap: 6px; background: rgba(255,255,255,0.08); padding: 4px; border-radius: 8px;">
            ${careTeam.map(member => {
              const isActive = otherPerson?.id === member.user.id;
              return `
                <button type="button" class="btn btn-sm" onclick="window.navigateTo('messages', { childId: '${activeChild.id}', receiverId: '${member.user.id}' })" style="font-size: 11.5px; padding: 4px 10px; border-radius: 6px; ${isActive ? 'background: #2563eb; color: #ffffff; font-weight: 700; border: 1px solid #3b82f6;' : 'background: transparent; color: #cbd5e1; border: 1px solid transparent;'}">
                  ${member.label}
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <div class="chat-messages" id="chat-messages-container" style="min-height: 280px; max-height: 420px; overflow-y: auto;">
          ${messages.length > 0 ? messages.map(m => {
            const isSentByMe = m.sender_id === currentUser.id;
            const sender = window.neuroDB.getUserById(m.sender_id);
            return `
              <div class="message-bubble ${isSentByMe ? 'sent' : 'received'}">
                <div style="font-size: 11px; font-weight: 700; opacity: 0.85; margin-bottom: 3px;">${isSentByMe ? 'You' : (sender ? sender.full_name : 'Care Team')}</div>
                <div>${m.message_text}</div>
                <span class="message-time">${new Date(m.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
            `;
          }).join('') : `
            <div style="text-align: center; color: var(--slate-400); font-size: 13px; margin: auto; padding: 30px;">
              No messages yet in this consultation thread between you and ${otherPerson ? otherPerson.full_name : 'the specialist'}. Start the conversation below.
            </div>
          `}
        </div>

        <form class="chat-input-bar" onsubmit="window.handleSendMessage(event, '${activeChild.id}', '${otherPerson ? otherPerson.id : ''}')">
          <input type="text" id="chat-message-input" class="form-control" placeholder="Type your message to ${otherPerson ? otherPerson.full_name.split(' ')[0] : 'care team'} regarding ${activeChild.first_name}..." required autocomplete="off">
          <button type="submit" class="btn btn-primary" style="display: flex; align-items: center; gap: 6px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            Send
          </button>
        </form>
      </div>
    </div>
  `;
};

window.handleSendMessage = function(e, childId, receiverId) {
  e.preventDefault();
  const input = document.getElementById('chat-message-input');
  if (!input || !input.value.trim()) return;

  const currentUser = window.neuroAuth.getCurrentUser();
  const text = input.value.trim();
  input.value = '';

  window.neuroDB.sendMessage({
    sender_id: currentUser.id,
    receiver_id: receiverId,
    child_id: childId,
    message_text: text
  });

  // Create in-app notification for receiver
  const child = window.neuroDB.getChildById(childId);
  window.neuroDB.createNotification({
    user_id: receiverId,
    title: `New Message from ${currentUser.full_name}`,
    message: text.length > 60 ? text.substring(0, 60) + '...' : text,
    type: 'message',
    link: '#messages'
  });

  window.navigateTo('messages', { childId: childId, receiverId: receiverId });
  setTimeout(() => {
    const container = document.getElementById('chat-messages-container');
    if (container) container.scrollTop = container.scrollHeight;
  }, 50);
};
