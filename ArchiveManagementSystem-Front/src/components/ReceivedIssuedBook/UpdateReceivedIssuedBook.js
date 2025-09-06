import {
  Autocomplete,
  TextField,
  Box,
  Grid,
  Button,
  CircularProgress,
  Typography,
  Tooltip,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import FolderIcon from "@mui/icons-material/Folder";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getReceiptById, updateReceipt } from "../../services/ReceiptsApi";
import React, { useState, useEffect } from "react";
import PageBreadcrumbs from "../Breadcrumbs/PageBreadcrumbs";

const departments = ["آرشیف", "حفظیه", "مخزن"];

export default function UpdateReceivedIssuedBook() {
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          padding: { xs: 1, sm: 2 },
        }}
      >
        <Box
          component="form"
          noValidate
          autoComplete="on"
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
            p: { xs: 2, sm: 3, md: 4 },
            bgcolor: "#fff",
            borderRadius: 3,
            boxShadow: 3,
            width: { xs: "100%", sm: "90%", md: "80%", lg: "70%" },
            position: "relative",
            marginTop: { xs: "70px", sm: "80px", md: "90px", lg: "100px" },
          }}
          onSubmit={handleSubmit}
        >
          {/* Title */}
          <Box
            sx={{
              position: "absolute",
              top: { xs: -40, sm: -50, md: -80 },
              right: 20,
              fontFamily: "B nazanin",
              fontWeight: "bold",
              fontSize: { xs: 20, sm: 22, md: 24 },
            }}
          >
            ویرایش رسیدات
          </Box>

          {/* Breadcrumbs */}
          <Box
            sx={{
              position: "absolute",
              top: { xs: -20, sm: -25, md: -30 },
              right: 20,
            }}
          >
            <PageBreadcrumbs />
          </Box>
          {/* Left Side - Upload Photo */}
          <Box
            sx={{
              width: { xs: "100%", md: "25%" },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              p: 2,
              border: "1px dashed #ccc",
              borderRadius: 2,
            }}
          >
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                border: "2px solid #ddd",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                bgcolor: "#f9f9f9",
                cursor: "pointer",
                position: "relative",
              }}
              component="label"
              htmlFor="upload-photo"
            >
              {/* Hidden file input */}
              <input
                name="file"
                type="file"
                hidden
                id="upload-photo"
                onChange={handleFileChange}
              />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                <FolderIcon sx={{ fontSize: 50, color: "#888" }} />
                <Typography variant="caption" sx={{ mt: 1, color: "#666" }}>
                  Upload File
                </Typography>
              </Box>
            </Box>

            {/* 🔹 فایل نوم د ellipsis سره */}
            {currentFile && (
              <Tooltip
                title={
                  currentFile instanceof File
                    ? currentFile.name
                    : currentFile.fileName
                }
              >
                <Typography
                  variant="body2"
                  sx={{
                    mt: 1,
                    maxWidth: "200px", // تر دې زیات ځای نه نیسي
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  فایل موجود:{" "}
                  {currentFile instanceof File
                    ? currentFile.name
                    : currentFile.fileName}
                </Typography>
              </Tooltip>
            )}

            <Typography variant="body2" color="textSecondary" align="center">
              Allowed *.jpeg, *.jpg, *.png, *.pdf
              <br />
              max size of 3 Mb
            </Typography>
          </Box>

          {/* Right Side - Form Fields */}
          <Grid container spacing={2} sx={{ flex: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="serialNumber"
                type="number"
                label="نمبر مسلسل"
                variant="outlined"
                value={formData.serialNumber}
                onChange={handleInputChange}
                InputProps={{
                  sx: { height: 60 },
                }}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="archiveNumber"
                type="number"
                label="نمبر آرشیف"
                variant="outlined"
                value={formData.archiveNumber}
                onChange={handleInputChange}
                InputProps={{ sx: { height: 60 } }}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
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
                      sx: { height: 60 },
                    }}
                    required
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="letterNumber"
                type="number"
                label="نمبر مکتوب"
                variant="outlined"
                value={formData.letterNumber}
                onChange={handleInputChange}
                InputProps={{ sx: { height: 60 } }}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="letterDate"
                type="date"
                InputLabelProps={{ shrink: true }}
                label="تاریخ مکتوب"
                variant="outlined"
                value={formData.letterDate}
                onChange={handleInputChange}
                InputProps={{ sx: { height: 60 } }}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="sender"
                label="مرسل"
                variant="outlined"
                value={formData.sender}
                onChange={handleInputChange}
                InputProps={{ sx: { height: 60 } }}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="recipient"
                label="مرسل الیه"
                variant="outlined"
                value={formData.recipient}
                onChange={handleInputChange}
                InputProps={{ sx: { height: 60 } }}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="subjectType"
                label="نوعیت موضوع"
                variant="outlined"
                value={formData.subjectType}
                onChange={handleInputChange}
                InputProps={{ sx: { height: 60 } }}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="remarks"
                rows={4}
                label="ملاحضات"
                variant="outlined"
                value={formData.remarks}
                onChange={handleInputChange}
                InputProps={{ sx: { height: 60 } }}
              />
            </Grid>

            {/* Save Button */}
            <Grid item xs={12} sx={{ textAlign: "right", mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: "black",
                  color: "white",
                  borderRadius: "10px",
                  "&:hover": {
                    backgroundColor: "#1d252e",
                  },
                }}
                endIcon={<SaveIcon />}
                style={{ marginLeft: "20px", marginBottom: "20px" }}
                disabled={isSubmitting}
              >
                {isSubmitting ? <CircularProgress size={24} /> : "ویرایش کردن"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}
