import api from "../api";

export const getAllHifziyaWaradaSadera = () =>
  api.get("/hifziya-warada-sadera");

export const getHifziyaWaradaSaderaById = (id) =>
  api.get(`/hifziya-warada-sadera/${id}`);

export const createHifziyaWaradaSadera = (formDataToSend) => {
  return api.post("/hifziya-warada-sadera", formDataToSend, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateHifziyaWaradaSadera = (id, hazariData) => {
  return api.put(`/hifziya-warada-sadera/${id}`, hazariData, {
    headers: {
      "Content-Type":
        hazariData instanceof FormData
          ? "multipart/form-data"
          : "application/json",
    },
  });
};

export const deleteHifziyaWaradaSadera = (id) =>
  api.delete(`/hifziya-warada-sadera/${id}`);

export const downloadFile = (filename) => {
  return api.get(`/hifziya-warada-sadera/upload/${filename}`, {
    responseType: "blob",
  });
};
