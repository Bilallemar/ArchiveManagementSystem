import api from "../api";

export const getAnnualReports = (keyword = "", field = "bookNumber") => {
  return api.get("/annual-reports/search", {
    params: { keyword, field },
  });
};

export const getAnnualReportById = (id) => api.get(`/annual-reports/${id}`);

// const headers = {
//   "Content-Type": "multipart/form-data",
// };
// export const createAnnualReport = (formData) => {
//   return api.post("/annual-reports", formData, { headers });
// };
export const createAnnualReport = (data) => {
  return api.post("/annual-reports", data);
};

export const uploadFile = (formData) => {
  return api.post("/upload", formData); // Content-Type نه ورکوو
};

export const updateAnnualReport = (id, annualReportData) => {
  const config = {
    headers: {
      "Content-Type":
        annualReportData instanceof FormData
          ? "multipart/form-data"
          : "application/json",
    },
  };
  return api.put(`/annual-reports/${id}`, annualReportData, config);
};

export const deleteAnnualReport = (id) => api.delete(`/annual-reports/${id}`);
export const downloadFile = (filename) => {
  return api.get(`/annual-reports/upload/${filename}`, {
    responseType: "blob",
  });
};

//  private String bookNumber;
//     private String pravince;
//     private String district;
//     private LocalDate year;
//     private String waseqaType;
//     private String summaryOfWaseqa;
//     private String remarks;

//     annual-reports
