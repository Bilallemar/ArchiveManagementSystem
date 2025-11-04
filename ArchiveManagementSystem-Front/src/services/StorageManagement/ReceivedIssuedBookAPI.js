// import api from "../api";

// // د ټولو کتابونو ترلاسه کول
// export const getReceivedIssuedBooks = (keyword = "", field = "book_number") => {
//   return api.get("/received-issued-books/search", {
//     params: { keyword, field },
//   });
// };

// // د ID له مخې یو کتاب ترلاسه کول
// export const getReceivedIssuedBookById = (id) =>
//   api.get(`/received-issued-books/${id}`);

// // د نوي کتاب ثبتول
// const headers = {
//   "Content-Type": "multipart/form-data",
// };
// export const createReceivedIssuedBook = (formData) => {
//   return api.post("/received-issued-books", formData, { headers });
// };

// export const updateReceivedIssuedBook = async (id, formData) => {
//   try {
//     const response = await api.put(`/received-issued-books/${id}`, formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

// // د کتاب حذف کول
// export const deleteReceivedIssuedBook = (id) =>
//   api.delete(`/received-issued-books/${id}`);

// // د فایل اپلوډ (که اړتیا وي)
// export const uploadBookFile = (formData) => {
//   return api.post(`/received-issued-books/upload`, formData);
// };

// // د فایل ډاونلوډ
// export const downloadBookFile = (filename) => {
//   return api.get(`/received-issued-books/download/${filename}`, {
//     responseType: "blob",
//   });
// };
import api from "../api";

export const getReceivedIssuedBooks = (keyword = "", field = "bookNumber") => {
  return api.get("/received-issued-books/search", {
    params: { keyword, field },
  });
};
export const getReceivedIssuedBookById = (id) =>
  api.get(`/received-issued-books/${id}`);

const headers = {
  "Content-Type": "multipart/form-data",
};
export const createReceivedIssuedBook = (formData) => {
  return api.post("/received-issued-books", formData, { headers });
};

export const uploadFile = (formData) => {
  return api.post("/upload", formData); // Content-Type نه ورکوو
};

export const updateReceivedIssuedBook = (id, receivedIssuedBookData) => {
  const config = {
    headers: {
      "Content-Type":
        receivedIssuedBookData instanceof FormData
          ? "multipart/form-data"
          : "application/json",
    },
  };
  return api.put(
    `/received-issued-books/${id}`,
    receivedIssuedBookData,
    config
  );
};

// export const updateReceipt = (id, receiptData) =>
//   api.put(`/receipts/${id}`, receiptData);
export const deleteReceivedIssuedBook = (id) =>
  api.delete(`/received-issued-books/${id}`);
export const downloadFile = (filename) => {
  return api.get(`/received-issued-books/upload/${filename}`, {
    responseType: "blob",
  });
};
