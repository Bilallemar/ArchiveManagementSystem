import api from "../api";

export const gitAllArchives = () => api.get("/archives");

// export const getHifziyaHazariById = (id) => api.get(`/hifziya-hazari/${id}`);

// export const createHifziyaHazari = (data) => api.post("/hifziya-hazari", data);

// export const updateHifziyaHazari = (id, hazariData) => {
//   const config = {
//     headers: {
//       "Content-Type":
//         hazariData instanceof FormData
//           ? "multipart/form-data"
//           : "application/json",
//     },
//   };
//   return api.put(`/hifziya-hazari/${id}`, hazariData, config);
// };

export const deleteArchive = (id) => api.delete(`/archives/${id}`);

// export const downloadFile = (filename) => {
//   return api.get(`/hifziya-hazari/upload/${filename}`, {
//     responseType: "blob",
//   });
// };
