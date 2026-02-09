import axios from "axios";

const TOKEN_KEY = "cb_token";
const USER_KEY = "cb_user";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

const getAuthToken = () => localStorage.getItem(TOKEN_KEY);
const getStoredUser = () => {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const setAuth = ({ token, user }) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearAuth();
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

const getApplications = () => api.get("/applications");
const createApplication = (data) => api.post("/applications", data);
const updateApplication = (id, data) => api.put(`/applications/${id}`, data);
const deleteApplication = (id) => api.delete(`/applications/${id}`);
const updateApplicationStatus = (id, status) => api.patch(`/applications/${id}/status`, { status });
const updateRoundStatus = (applicationId, roundId, status) =>
  api.patch(`/applications/${applicationId}/rounds/${roundId}`, { status });
const addRound = (applicationId, name) =>
  api.post(`/applications/${applicationId}/rounds`, { name });
const deleteRound = (applicationId, roundId) =>
  api.delete(`/applications/${applicationId}/rounds/${roundId}`);

const uploadAttachment = (applicationId, type, file) => {
  const formData = new FormData();
  formData.append("type", type);
  formData.append("file", file);
  return api.post(`/applications/${applicationId}/attachments`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

const deleteAttachment = (applicationId, attachmentId) =>
  api.delete(`/applications/${applicationId}/attachments/${attachmentId}`);

const registerUser = (data) => api.post("/auth/register", data);
const loginUser = (data) => api.post("/auth/login", data);

export {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
  updateApplicationStatus,
  updateRoundStatus,
  addRound,
  deleteRound,
  uploadAttachment,
  deleteAttachment,
  registerUser,
  loginUser,
  getAuthToken,
  getStoredUser,
  setAuth,
  clearAuth,
};

export default api;
