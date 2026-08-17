import api from './axios';

export const clinicalApi = {
  // Children
  getChildren: async () => {
    const response = await api.get('/children/');
    return response.data;
  },

  getChildById: async (id) => {
    const response = await api.get(`/children/${id}/`);
    return response.data;
  },

  createChild: async (childData) => {
    const response = await api.post('/children/', childData);
    return response.data;
  },

  // Assessments
  getAssessmentTemplates: async () => {
    const response = await api.get('/assessments/templates/');
    return response.data;
  },

  getAssessmentRecords: async (childId = '') => {
    const params = childId ? { child_id: childId } : {};
    const response = await api.get('/assessments/records/', { params });
    return response.data;
  },

  createAssessmentRecord: async (recordData) => {
    const response = await api.post('/assessments/records/', recordData);
    return response.data;
  },

  // Therapy Plans
  getTherapyPlans: async (childId = '') => {
    const params = childId ? { child_id: childId } : {};
    const response = await api.get('/therapy/plans/', { params });
    return response.data;
  },

  createTherapyPlan: async (planData) => {
    const response = await api.post('/therapy/plans/', planData);
    return response.data;
  },

  // Appointments
  getAppointments: async () => {
    const response = await api.get('/appointments/');
    return response.data;
  },

  createAppointment: async (appointmentData) => {
    const response = await api.post('/appointments/', appointmentData);
    return response.data;
  },

  // Notifications
  getNotifications: async () => {
    const response = await api.get('/notifications/');
    return response.data;
  },

  markNotificationRead: async (id) => {
    const response = await api.post(`/notifications/${id}/read/`);
    return response.data;
  },
};
