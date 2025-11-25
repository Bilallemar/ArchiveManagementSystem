import {
  Autocomplete,
  TextField,
  Box,
  Grid,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { createReceipt } from "../../../services/StorageManagement/ReceiptsApi";
import React, { useState } from "react";
import PageBreadcrumbs from "../../Breadcrumbs/PageBreadcrumbs";
import FolderIcon from "@mui/icons-material/Folder";
import SaveIcon from "@mui/icons-material/Save";

const departments = ["آرشیف", "حفظیه", "مخزن"];

export default function AddReceipt() {
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
  const [fileError, setFileError] = useState("");
  const [file, setFile] = useState(null);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const handleFileChange = (e) => {
  //   if (e.target.files.length > 0) {
  //     setFileError("");
  //   }
  // };
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setFileError("");
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
    setFileError("");

    // Validate required fields
    const requiredFields = [
      "serialNumber",
      "archiveNumber",
      "department",
      "letterNumber",
      "letterDate",
      "sender",
      "recipient",
      "subjectType",
    ];

    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      toast.error("لطفاً تمام فیلدهای ضروری را پر کنید");
      setIsSubmitting(false);
      return;
    }

    // Check if file is attached

    // if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
    //   setFileError("فایل الزامی است");
    //   toast.error("لطفاً یک فایل پیوست کنید");
    //   setIsSubmitting(false);
    //   return;
    // }
    if (!file) {
      setFileError("فایل الزامی است");
      toast.error("لطفاً یک فایل پیوست کنید");
      setIsSubmitting(false);
      return;
    }
    // const sendFormData = new FormData();
    // sendFormData.append("fileURL", fileInput.files[0]);
    const sendFormData = new FormData();
    sendFormData.append("fileURL", file);
    sendFormData.append("receipts", JSON.stringify(formData));

    try {
      sendFormData.append("receipts", JSON.stringify(formData));
      await createReceipt(sendFormData);
      toast.success("رسید با موفقیت ایجاد شد");
      navigate("/receipts");
    } catch (error) {
      console.error("Failed to create receipt", error);

      // Check if it's an authentication error
      if (error.response && error.response.status === 401) {
        toast.error("احراز هویت ناموفق بود. لطفاً دوباره وارد شوید");
        // You might want to redirect to login here if needed
        // navigate("/login");
      } else {
        toast.error("ایجاد رسید ناموفق بود");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
            افزودن رسیدات
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

          {/* Left Side - Upload Photo + Email Verified */}
          <Box
            sx={{
              width: { xs: "100%", md: "25%" },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              p: 2,
              border: fileError ? "1px dashed #f44336" : "1px dashed #ccc",
              borderRadius: 2,
            }}
          >
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                border: fileError ? "2px solid #f44336" : "2px solid #ddd",
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
              <input
                name="file"
                type="file"
                hidden
                id="upload-photo"
                onChange={handleFileChange}
                required
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
                  Upload Photo
                </Typography>
              </Box>
            </Box>

            {file && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                فایل انتخاب شده: {file.name}
              </Typography>
            )}

            {fileError && (
              <Typography variant="caption" color="error">
                {fileError}
              </Typography>
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
                error={!formData.serialNumber}
                helperText={!formData.serialNumber ? "این فیلد ضروری است" : ""}
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
                error={!formData.archiveNumber}
                helperText={!formData.archiveNumber ? "این فیلد ضروری است" : ""}
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
                    error={!formData.department}
                    helperText={
                      !formData.department ? "این فیلد ضروری است" : ""
                    }
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
                error={!formData.letterNumber}
                helperText={!formData.letterNumber ? "این فیلد ضروری است" : ""}
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
                error={!formData.letterDate}
                helperText={!formData.letterDate ? "این فیلد ضروری است" : ""}
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
                error={!formData.sender}
                helperText={!formData.sender ? "این فیلد ضروری است" : ""}
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
                error={!formData.recipient}
                helperText={!formData.recipient ? "این فیلد ضروری است" : ""}
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
                error={!formData.subjectType}
                helperText={!formData.subjectType ? "این فیلد ضروری است" : ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="remarks"
                label="ملاحضات"
                variant="outlined"
                value={formData.remarks}
                onChange={handleInputChange}
                InputProps={{ sx: { height: 60 } }}
              />
            </Grid>

            {/* Create Button */}
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
                  width: { xs: "100%", sm: "auto" },
                }}
                endIcon={<SaveIcon />}
                disabled={isSubmitting}
              >
                {isSubmitting ? <CircularProgress size={24} /> : "ذخیره کردن"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}
