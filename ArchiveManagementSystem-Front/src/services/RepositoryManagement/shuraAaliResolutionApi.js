import api from "../api";

// ==============================
// Shura Aali Resolutions APIs
// ==============================

export const getAllShuraAaliResolutions = () =>
  api.get("/shura-aali-resolutions");

export const getShuraAaliResolutionById = (id) =>
  api.get(`/shura-aali-resolutions/${id}`);

export const createShuraAaliResolution = (data) =>
  api.post("/shura-aali-resolutions", data);

export const updateShuraAaliResolution = (id, data) =>
  api.put(`/shura-aali-resolutions/${id}`, data);

export const deleteShuraAaliResolution = (id) =>
  api.delete(`/shura-aali-resolutions/${id}`);
