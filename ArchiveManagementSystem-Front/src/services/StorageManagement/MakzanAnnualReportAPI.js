import api from "../api";

export const gitAllAnnualReports = () => api.get("/makzan-annual-reports");

export const getAnnualReportById = (id) =>
  api.get(`/makzan-annual-reports/${id}`);

// export const createAnnualReport = (reportData) => {
//   return api.post("/makzan-annual-reports", reportData, {
//     headers: { "Content-Type": "application/json" },
//   });
// };
export const createAnnualReport = (reportData) => {
  return api.post("/makzan-annual-reports", reportData);
};
export const updateAnnualReport = (id, reportData) => {
  return api.put(`/makzan-annual-reports/${id}`, reportData, {
    headers: { "Content-Type": "application/json" },
  });
};

export const deleteAnnualReport = (id) =>
  api.delete(`/makzan-annual-reports/${id}`);
