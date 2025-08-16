import {
  Autocomplete,
  TextField,
  Box,
  Grid,
  Button,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getReceiptById, updateReceipt } from "../../services/ReceiptsApi";
import React, { useState, useEffect } from "react";
import PageBreadcrumbs from "../Breadcrumbs/PageBreadcrumbs";

const departments = ["آرشیف", "حفظیه", "مخزن"];

export default function UpdateReceipt() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    serialNumber: "",
    archiveNumber: "",
    department: "",
    letterNumber: "",
    letterDate: "",
    sender: "",
    recipient: "",
    subjectType: "",
    remarks: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentFile, setCurrentFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const response = await getReceiptById(id);
        const receiptData = response.data;

        // Format the date for the input field
        const formattedDate = receiptData.letterDate
          ? new Date(receiptData.letterDate).toISOString().split("T")[0]
          : "";

        setFormData({
          serialNumber: receiptData.serialNumber || "",
          archiveNumber: receiptData.archiveNumber || "",
          department: receiptData.department || "",
          letterNumber: receiptData.letterNumber || "",
          letterDate: formattedDate,
          sender: receiptData.sender || "",
          recipient: receiptData.recipient || "",
          subjectType: receiptData.subjectType || "",
          remarks: receiptData.remarks || "",
        });

        if (receiptData.attachments && receiptData.attachments.length > 0) {
          setCurrentFile(receiptData.attachments[0]);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch receipt", error);
        toast.error("Failed to load receipt data");
        navigate("/receipts");
      }
    };

    fetchReceipt();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setCurrentFile(e.target.files[0]);
    }
  };

  const handleDepartmentChange = (event, value) => {
    setFormData((prev) => ({
      ...prev,
      department: value || "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const sendFormData = new FormData();

    // Only append the file if a new one was selected
    if (currentFile && currentFile instanceof File) {
      sendFormData.append("fileURL", currentFile);
    }

    try {
      sendFormData.append("receipts", JSON.stringify(formData));

      await updateReceipt(id, sendFormData);
      toast.success("Receipt updated successfully");
      navigate("/receipts");
    } catch (error) {
      console.error("Failed to update receipt", error);
      toast.error("Failed to update receipt");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <div
        style={{
          marginBottom: "50px",
          textAlign: "left",
          padding: "20px",
          marginTop: "20px",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            fontFamily: "B nazanin",
            textAlign: "right",
            marginRight: "20px",
          }}
        >
          ویرایش رسیدات
        </h1>
      </div>
      <Box
        dir="rtl"
        sx={{
          textAlign: "right",
          fontFamily: "B Nazanin", // Make sure to use the correct font name
          padding: "8px 16px", // Adjust padding as needed
          marginBottom: "16px", // Adjust margin as needed
        }}
      >
        <PageBreadcrumbs />
      </Box>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        sx={{ p: 4 }}
        onSubmit={handleSubmit}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3} sx={{ my: 2 }}>
            <TextField
              fullWidth
              name="serialNumber"
              type="number"
              label="نمبر مسلسل"
              variant="outlined"
              value={formData.serialNumber}
              onChange={handleInputChange}
              InputProps={{
                sx: { height: 80 },
              }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} sx={{ my: 2 }}>
            <TextField
              fullWidth
              name="archiveNumber"
              type="number"
              label="نمبر آرشیف"
              variant="outlined"
              value={formData.archiveNumber}
              onChange={handleInputChange}
              InputProps={{ sx: { height: 80 } }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} sx={{ my: 2 }}>
            <Autocomplete
              fullWidth
              options={departments}
              value={formData.department}
              onChange={handleDepartmentChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="شعبه"
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    sx: { height: 80 },
                  }}
                  required
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} sx={{ my: 2 }}>
            <TextField
              fullWidth
              name="letterNumber"
              type="number"
              label="نمبر مکتوب"
              variant="outlined"
              value={formData.letterNumber}
              onChange={handleInputChange}
              InputProps={{ sx: { height: 80 } }}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} sx={{ my: 2 }}>
            <TextField
              fullWidth
              name="letterDate"
              type="date"
              InputLabelProps={{ shrink: true }}
              label="تاریخ مکتوب"
              variant="outlined"
              value={formData.letterDate}
              onChange={handleInputChange}
              InputProps={{ sx: { height: 80 } }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} sx={{ my: 2 }}>
            <TextField
              fullWidth
              name="sender"
              label="مرسل"
              variant="outlined"
              value={formData.sender}
              onChange={handleInputChange}
              InputProps={{ sx: { height: 80 } }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} sx={{ my: 2 }}>
            <TextField
              fullWidth
              name="recipient"
              label="مرسل الیه"
              variant="outlined"
              value={formData.recipient}
              onChange={handleInputChange}
              InputProps={{ sx: { height: 80 } }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} sx={{ my: 2 }}>
            <TextField
              fullWidth
              name="subjectType"
              label="نوعیت موضوع"
              variant="outlined"
              value={formData.subjectType}
              onChange={handleInputChange}
              InputProps={{ sx: { height: 80 } }}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} sx={{ my: 2 }}>
            <TextField
              fullWidth
              name="file"
              type="file"
              InputLabelProps={{ shrink: true }}
              label="فایل"
              variant="outlined"
              onChange={handleFileChange}
              InputProps={{ sx: { height: 80 } }}
            />
            {currentFile && (
              <div style={{ marginTop: "10px" }}>
                Current file:{" "}
                {currentFile instanceof File
                  ? currentFile.name
                  : currentFile.fileName}
              </div>
            )}
          </Grid>
          <Grid item xs={12} sm={6} md={3} sx={{ my: 2 }}>
            <TextField
              fullWidth
              name="remarks"
              multiline
              rows={4}
              label="ملاحضات"
              variant="outlined"
              value={formData.remarks}
              onChange={handleInputChange}
              InputProps={{ sx: { height: 80 } }}
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ marginLeft: "20px", marginBottom: "20px" }}
          disabled={isSubmitting}
        >
          {isSubmitting ? <CircularProgress size={24} /> : "ذخیره کردن"}
        </Button>
      </Box>
    </>
  );
}
