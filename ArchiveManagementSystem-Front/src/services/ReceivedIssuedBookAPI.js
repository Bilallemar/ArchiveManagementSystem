import api from "./api";

// د ټولو کتابونو ترلاسه کول
export const getReceivedIssuedBooks = (keyword = "", field = "book_number") => {
  return api.get("/received-issued-books/search", {
    params: { keyword, field },
  });
};

// د ID له مخې یو کتاب ترلاسه کول
export const getReceivedIssuedBookById = (id) =>
  api.get(`/received-issued-books/${id}`);

// د نوي کتاب ثبتول
const headers = {
  "Content-Type": "multipart/form-data",
};
export const createReceivedIssuedBook = (formData) => {
  return api.post("/received-issued-books", formData, { headers });
};

// د کتاب اپډېټ کول
export const updateReceivedIssuedBook = (id, formData) => {
  return api.put(`/received-issued-books/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// د کتاب حذف کول
export const deleteReceivedIssuedBook = (id) =>
  api.delete(`/received-issued-books/${id}`);

// د فایل اپلوډ (که اړتیا وي)
export const uploadBookFile = (formData) => {
  return api.post(`/received-issued-books/upload`, formData);
};

// د فایل ډاونلوډ
export const downloadBookFile = (filename) => {
  return api.get(`/received-issued-books/download/${filename}`, {
    responseType: "blob",
  });
};
