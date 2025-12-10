import api from "../api";

export const getAllReceipts = () => api.get("/makzan-receipts");

export const getReceiptById = (id) => api.get(`/makzan-receipts/${id}`);

export const createReceipt = (formDataToSend) => {
  return api.post("/makzan-receipts", formDataToSend, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateReceipt = (id, formDataToSend) => {
  return api.put(`/makzan-receipts/${id}`, formDataToSend, {
    headers: {
      "Content-Type":
        formDataToSend instanceof FormData
          ? "multipart/form-data"
          : "application/json",
    },
  });
};

export const deleteReceipt = (id) => api.delete(`/makzan-receipts/${id}`);

export const downloadFile = (filename) => {
  return api.get(`/makzan-receipts/upload/${filename}`, {
    responseType: "blob",
  });
};
