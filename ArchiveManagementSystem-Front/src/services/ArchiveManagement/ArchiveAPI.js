import api from "../api";

export const gitAllArchives = () => api.get("/archives");

export const getArchiveById = (id) => api.get(`/archives/${id}`);

export const createArchive = (archiveData) => {
  return api.post("/archives", archiveData, {
    headers: { "Content-Type": "application/json" },
  });
};

export const updateArchive = (id, archiveData) => {
  return api.put(`/archives/${id}`, archiveData, {
    headers: { "Content-Type": "application/json" },
  });
};

export const deleteArchive = (id) => api.delete(`/archives/${id}`);
