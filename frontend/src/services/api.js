import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

const getApplications = () => api.get("/applications");
const createApplication = (data) => api.post("/applications", data);
const updateApplication = (id, data) => api.put(`/applications/${id}`, data);
const deleteApplication = (id) => api.delete(`/applications/${id}`);

export { getApplications, createApplication, updateApplication, deleteApplication };
export default api;
