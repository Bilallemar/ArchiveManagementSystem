import api from "../api";

export const gitAllMakzanSubmissionReport = () =>
  api.get("/annual-reports-info");

export const getMakzanSubmissionReportById = (id) =>
  api.get(`/annual-reports-info/${id}`);

export const createMakzanSubmissionReport = (reportData) => {
  return api.post("/annual-reports-info", reportData, {
    headers: { "Content-Type": "application/json" },
  });
};

export const updateMakzanSubmissionReport = (id, reportData) => {
  return api.put(`/annual-reports-info/${id}`, reportData, {
    headers: { "Content-Type": "application/json" },
  });
};

export const deleteMakzanSubmissionReport = (id) =>
  api.delete(`/annual-reports-info/${id}`);
