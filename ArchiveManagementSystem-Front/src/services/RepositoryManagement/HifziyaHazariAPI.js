// import api from "../api";

// // export const getAllHifziyaHazaris = (keyword = "", field = "bookNumber") => {
// //   return api.get("/annual-reports/search", {
// //     params: { keyword, field },
// //   });
// // };
// export const getAllHifziyaHazaris = (keyword = "") => {
//   return api.get("/hifziya-hazari", {
//     params: { keyword },
//   });
// };

// export const getHifziyaHazariById = (id) => api.get(`/hifziya-hazari/${id}`);

// // const headers = {
// //   "Content-Type": "multipart/form-data",
// // };
// // export const createAnnualReport = (formData) => {
// //   return api.post("/annual-reports", formData, { headers });
// // };
// export const createHifziyaHazari = (data) => {
//   return api.post("/hifziya-hazari", data);
// };

// export const uploadFile = (formData) => {
//   return api.post("/upload", formData); // Content-Type نه ورکوو
// };

// export const updateHifziyaHazari = (id, annualReportData) => {
//   const config = {
//     headers: {
//       "Content-Type":
//         annualReportData instanceof FormData
//           ? "multipart/form-data"
//           : "application/json",
//     },
//   };
//   return api.put(`/hifziya-hazari/${id}`, annualReportData, config);
// };

// export const deleteHifziyaHazari = (id) => api.delete(`/hifziya-hazari/${id}`);
// export const downloadFile = (filename) => {
//   return api.get(`/hifziya-hazari/upload/${filename}`, {
//     responseType: "blob",
//   });
// };

//  private String bookNumber;
//     private String pravince;
//     private String district;
//     private LocalDate year;
//     private String waseqaType;
//     private String summaryOfWaseqa;
//     private String remarks;

//     annual-reports
import api from "../api";

export const getAllHifziyaHazaris = () => api.get("/hifziya-hazari");

export const getHifziyaHazariById = (id) => api.get(`/hifziya-hazari/${id}`);

export const createHifziyaHazari = (data) => api.post("/hifziya-hazari", data);

export const updateHifziyaHazari = (id, hazariData) => {
  const config = {
    headers: {
      "Content-Type":
        hazariData instanceof FormData
          ? "multipart/form-data"
          : "application/json",
    },
  };
  return api.put(`/hifziya-hazari/${id}`, hazariData, config);
};

export const deleteHifziyaHazari = (id) => api.delete(`/hifziya-hazari/${id}`);

export const downloadFile = (filename) => {
  return api.get(`/hifziya-hazari/upload/${filename}`, {
    responseType: "blob",
  });
};

// downloadFile(filename).then((response) => {
//   const url = window.URL.createObjectURL(new Blob([response.data]));
//   const link = document.createElement("a");
//   link.href = url;
//   link.setAttribute("download", filename);
//   document.body.appendChild(link);
//   link.click();

// });

//   files isIndraj description org year type id
