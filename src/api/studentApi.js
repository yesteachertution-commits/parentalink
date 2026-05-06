import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const studentApi = {
  getStudents: async ({ page = 1, limit = 50, classes = '' }) => {
    const params = { page, limit };
    if (classes && classes !== 'All Classes') params.classes = classes;
    
    const response = await axios.get(`${backendUrl}/api/create/students`, {
      headers: getAuthHeader(),
      params
    });
    return response.data;
  },

  createStudent: async (studentData) => {
    const response = await axios.post(`${backendUrl}/api/create/students`, studentData, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  updateStudent: async ({ id, data }) => {
    const response = await axios.put(`${backendUrl}/api/create/students/${id}`, data, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  deleteStudent: async (id) => {
    const response = await axios.delete(`${backendUrl}/api/create/students/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  bulkDeleteStudents: async (studentIds) => {
    const response = await axios.post(`${backendUrl}/api/create/students/bulk-delete`, { studentIds }, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  saveAttendance: async (attendanceData) => {
    const response = await axios.post(`${backendUrl}/api/save/attendance`, attendanceData, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  updateGrade: async (gradeData) => {
    const response = await axios.post(`${backendUrl}/api/grades/update`, gradeData, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  deleteGrade: async (gradeData) => {
    const response = await axios.delete(`${backendUrl}/api/grades/delete`, {
      headers: getAuthHeader(),
      data: gradeData
    });
    return response.data;
  },

  notifyAttendance: async (notificationData) => {
    const response = await axios.post(`${backendUrl}/api/notification/notify-parents`, notificationData, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  notifyMarks: async (notificationData) => {
    const response = await axios.post(`${backendUrl}/api/notification/notify-parents-mark`, notificationData, {
      headers: getAuthHeader()
    });
    return response.data;
  }
};
