import api from "../api";

export const getAllHifziyaHazaris = () => api.get("/hifziya-hazari");

export const getHifziyaHazariById = (id) => api.get(`/hifziya-hazari/${id}`);

export const createHifziyaHazari = (formDataToSend) => {
  return api.post("/hifziya-hazari", formDataToSend, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateHifziyaHazari = (id, hazariData) => {
  return api.put(`/hifziya-hazari/${id}`, hazariData, {
    headers: {
      "Content-Type":
        hazariData instanceof FormData
          ? "multipart/form-data"
          : "application/json",
    },
  });
};

export const deleteHifziyaHazari = (id) => api.delete(`/hifziya-hazari/${id}`);

export const downloadFile = (filename) => {
  return api.get(`/hifziya-hazari/upload/${filename}`, {
    responseType: "blob",
  });
};
