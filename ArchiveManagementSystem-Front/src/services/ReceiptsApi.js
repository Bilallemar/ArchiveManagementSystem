import api from "./api";

export const getReceipts = (keyword = "") => {
  return api.get("/receipts/search", {
    params: { keyword },
  });
};
export const getReceiptById = (id) => api.get(`/receipts/${id}`);

const headers = {
  "Content-Type": "multipart/form-data",
};
export const createReceipt = (formData) => {
  return api.post("/receipts", formData, { headers });
};

export const uploadFile = (formData) => {
  return api.post("/upload", formData); // Content-Type نه ورکوو
};

export const updateReceipt = (id, receiptData) => {
  const config = {
    headers: {
      "Content-Type":
        receiptData instanceof FormData
          ? "multipart/form-data"
          : "application/json",
    },
  };
  return api.put(`/receipts/${id}`, receiptData, config);
};

// export const updateReceipt = (id, receiptData) =>
//   api.put(`/receipts/${id}`, receiptData);
export const deleteReceipt = (id) => api.delete(`/receipts/${id}`);
export const downloadFile = (filename) => {
  return api.get(`/receipts/upload/${filename}`, {
    responseType: "blob",
  });
};
