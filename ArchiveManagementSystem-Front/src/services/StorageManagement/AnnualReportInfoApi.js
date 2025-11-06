import api from "../api";

export const getAnnualReportsInfo = (keyword = "", field = "bookNumber") => {
  return api.get("/annual-reports-info/search", {
    params: { keyword, field },
  });
};

export const getAnnualReporInfotById = (id) =>
  api.get(`/annual-reports-info/${id}`);

// const headers = {
//   "Content-Type": "multipart/form-data",
// };
// export const createAnnualReport = (formData) => {
//   return api.post("/annual-reports-info", formData, { headers });
// };
export const createAnnualReportInfo = (data) => {
  return api.post("/annual-reports-info", data);
};

export const uploadFile = (formData) => {
  return api.post("/upload", formData); // Content-Type نه ورکوو
};

export const updateAnnualReportInfo = (id, annualReportData) => {
  const config = {
    headers: {
      "Content-Type":
        annualReportData instanceof FormData
          ? "multipart/form-data"
          : "application/json",
    },
  };
  return api.put(`/annual-reports-info/${id}`, annualReportData, config);
};

export const deleteAnnualReportInfo = (id) =>
  api.delete(`/annual-reports-info/${id}`);
export const downloadFile = (filename) => {
  return api.get(`/annual-reports-info/upload/${filename}`, {
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
