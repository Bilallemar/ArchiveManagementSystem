import {
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
import {
  getReceivedIssuedBookById,
  updateReceivedIssuedBook,
} from "../../../services/StorageManagement/ReceivedIssuedBookAPI";
import React, { useState, useEffect } from "react";
import PageBreadcrumbs from "../../Breadcrumbs/PageBreadcrumbs";

export default function UpdateReceivedIssuedBook() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    bookNumber: "",
    sender: "",
    recipient: "",
    letterNumber: "",
    issuedDate: "",
    receivedDate: "",
    summary: "",
    subjectType: "",
    remarks: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentFile, setCurrentFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReceivedIssuedBook = async () => {
      try {
        const response = await getReceivedIssuedBookById(id);
        const receivedIssuedBookData = response.data;

        // Format the date for the input field
        const formattedDate = receivedIssuedBookData.issuedDate
          ? new Date(receivedIssuedBookData.issuedDate)
              .toISOString()
              .split("T")[0]
          : "";

        const formattedReceivedDate = receivedIssuedBookData.receivedDate
          ? new Date(receivedIssuedBookData.receivedDate)
              .toISOString()
              .split("T")[0]
          : "";

        setFormData({
          bookNumber: receivedIssuedBookData.bookNumber || "",
          sender: receivedIssuedBookData.sender || "",
          recipient: receivedIssuedBookData.recipient || "",
          letterNumber: receivedIssuedBookData.letterNumber || "",
          issuedDate: formattedDate,
          receivedDate: formattedReceivedDate,
          summary: receivedIssuedBookData.summary || "",
          subjectType: receivedIssuedBookData.subjectType || "",
          remarks: receivedIssuedBookData.remarks || "",
        });

        if (
          receivedIssuedBookData.attachments &&
          receivedIssuedBookData.attachments.length > 0
        ) {
          setCurrentFile(receivedIssuedBookData.attachments[0]);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch receipt", error);
        toast.error("Failed to load receipt data");
        navigate("/receipts");
      }
    };

    fetchReceivedIssuedBook();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const sendFormData = new FormData();

    // Only append the file if a new one was selected
    if (currentFile && currentFile instanceof File) {
      sendFormData.append("fileURL", currentFile);
    }

    try {
      sendFormData.append("receivedIssuedBook", JSON.stringify(formData));

      await updateReceivedIssuedBook(id, sendFormData);
      toast.success("Received Issued Book updated successfully");
      navigate("/received-issued-books");
    } catch (error) {
      console.error("Failed to update receoved issued book", error);
      toast.error("Failed to update received issued book");
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
                name="bookNumber"
                type="number"
                label="نمبر کتاب"
                variant="outlined"
                value={formData.bookNumber}
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
                name="sender"
                label=" مرسل"
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
                name="issuedDate"
                type="date"
                InputLabelProps={{ shrink: true }}
                label="تاریخ مکتوب"
                variant="outlined"
                value={formData.issuedDate}
                onChange={handleInputChange}
                InputProps={{ sx: { height: 60 } }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="receivedDate"
                type="date"
                InputLabelProps={{ shrink: true }}
                label="تاریخ دریافت"
                variant="outlined"
                value={formData.receivedDate}
                onChange={handleInputChange}
                InputProps={{ sx: { height: 60 } }}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="summary"
                label="خلاصه"
                variant="outlined"
                value={formData.summary}
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
