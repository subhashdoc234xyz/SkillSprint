import axios from 'axios';
import { auth } from './firebase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  try {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error("Error retrieving ID token:", error);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const submitIntake = async (intakeData) => {
  const response = await api.post('/api/intake', intakeData);
  return response.data;
};

export const fetchRoadmap = async (targetRole, department, language) => {
  const response = await api.get('/api/roadmap', {
    params: {
      target_role: targetRole,
      department: department,
      language: language,
    }
  });
  return response.data;
};

export const sendChatMessage = async (message, language, chatHistory = []) => {
  const response = await api.post('/api/chat', {
    message,
    language,
    chat_history: chatHistory,
  });
  return response.data;
};

export const fetchProgress = async () => {
  const response = await api.get('/api/progress');
  return response.data;
};

export const completeSkillNode = async (skillId) => {
  const response = await api.post('/api/progress/complete', {
    skill_id: skillId,
    completed: true,
  });
  return response.data;
};

export default api;
