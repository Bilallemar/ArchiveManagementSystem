import api from "../api";

export const getAllSawanih = () => api.get("/sawanih");

export const getSawanihById = (id) => api.get(`/sawanih/${id}`);

export const createSawanih = (formDataToSend) => {
  return api.post("/sawanih", formDataToSend);
};

export const updateSawanih = (id, formDataToSend) => {
  return api.put(`/sawanih/${id}`, formDataToSend);
};

export const deleteSawanih = (id) => api.delete(`/sawanih/${id}`);
