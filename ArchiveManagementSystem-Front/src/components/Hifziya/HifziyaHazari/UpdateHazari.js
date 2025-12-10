import {
  TextField,
  Box,
  Grid,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  getHifziyaHazariById,
  updateHifziyaHazari,
} from "../../../services/RepositoryManagement/HifziyaHazariAPI";
import React, { useState, useEffect } from "react";
import PageBreadcrumbs from "../../Breadcrumbs/PageBreadcrumbs";
import api from "../../../services/api";

export default function UpdateHazari() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    type: "",
    year: "",
    org: "",
    description: "",
    isIndraj: true,
    fileURL: null,
  });

  const [types, setTypes] = useState([]);
  const [orgs, setOrgs] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [existingFiles, setExistingFiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load types, orgs, and hazari data in parallel
        const [typesRes, orgsRes, hazariRes] = await Promise.all([
          api.get("/type"),
          api.get("/org"),
          getHifziyaHazariById(id),
        ]);

        setTypes(typesRes.data);
        setOrgs(orgsRes.data);

        const reportData = hazariRes.data;

        // Format the date for the input field
        const formattedDate = reportData.year
          ? new Date(reportData.year).toISOString().split("T")[0]
          : "";

        setFormData({
          type: reportData.type?.id || "",
          year: formattedDate,
          org: reportData.org?.id || "",
          description: reportData.description || "",
          isIndraj:
            reportData.isIndraj !== undefined ? reportData.isIndraj : true,
          fileURL: null,
        });

        // Store existing files info
        if (reportData.files && reportData.files.length > 0) {
          setExistingFiles(reportData.files);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch data", error);
        toast.error("Failed to load data");
        navigate("/hifziya-hazari");
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      fileURL: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const requiredFields = ["type", "year", "org"];
    const missingFields = requiredFields.filter((field) => !formData[field]);
    if (missingFields.length > 0) {
      toast.error("لطفاً تمام فیلدهای ضروری را پر کنید");
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Convert year to integer
      const yearAsInteger = new Date(formData.year).getFullYear();

      const hazariData = {
        type: { id: formData.type },
        year: yearAsInteger,
        org: { id: formData.org },
        description: formData.description,
        isIndraj: formData.isIndraj,
      };

      formDataToSend.append("hifziyaHazari", JSON.stringify(hazariData));

      // Append file if a new one was selected
      if (formData.fileURL) {
        formDataToSend.append("fileURL", formData.fileURL);
      }

      await updateHifziyaHazari(id, formDataToSend);
      toast.success("حاضری راپور په بریالیتوب سره تازه شو");
      navigate("/hifziya-hazari");
    } catch (error) {
      console.error("Failed to update report", error);
      toast.error(
        "تازه کول ناکام شو: " + (error.response?.data?.message || error.message)
      );
    }
    setIsSubmitting(false);
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
        autoComplete="off"
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
          ویرایش کتاب حاضری
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

        {/* Form Fields */}
        <Grid container spacing={2} sx={{ flex: 1 }}>
          {/* Record Type */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>د ریکارډ ډول</InputLabel>
              <Select
                name="isIndraj"
                value={formData.isIndraj}
                onChange={handleInputChange}
                label="د ریکارډ ډول"
                sx={{ height: 60 }}
              >
                <MenuItem value={true}>اندراج</MenuItem>
                <MenuItem value={false}>حاضری</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Type Dropdown */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={!formData.type}>
              <InputLabel>نوعیت</InputLabel>
              <Select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                label="نوعیت"
                sx={{ height: 60 }}
              >
                {types.length === 0 ? (
                  <MenuItem disabled>Loading...</MenuItem>
                ) : (
                  types.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Grid>

          {/* Year */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="year"
              type="date"
              InputLabelProps={{ shrink: true }}
              label="سال"
              variant="outlined"
              value={formData.year}
              onChange={handleInputChange}
              InputProps={{ sx: { height: 60 } }}
              required
              error={!formData.year}
              helperText={!formData.year ? "این فیلد ضروری است" : ""}
            />
          </Grid>

          {/* Org Dropdown */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={!formData.org}>
              <InputLabel>اداره</InputLabel>
              <Select
                name="org"
                value={formData.org}
                onChange={handleInputChange}
                label="اداره"
                sx={{ height: 60 }}
              >
                {orgs.length === 0 ? (
                  <MenuItem disabled>Loading...</MenuItem>
                ) : (
                  orgs.map((org) => (
                    <MenuItem key={org.id} value={org.id}>
                      {org.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="description"
              label="ملاحظات"
              variant="outlined"
              multiline
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
            />
          </Grid>

          {/* Current File Display (Read-only) */}
          {existingFiles.length > 0 && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="موجوده فایل"
                variant="outlined"
                value={existingFiles.map((f) => f.filePath).join(", ")}
                InputProps={{
                  readOnly: true,
                  sx: { height: 60 },
                }}
                helperText="دا ستاسو موجوده فایل دی"
              />
            </Grid>
          )}

          {/* File Upload */}
          <Grid item xs={12}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              startIcon={<AttachFileIcon />}
              sx={{ height: 60 }}
            >
              {existingFiles.length > 0
                ? "نوی فایل انتخاب کړئ (زاړه فایل به بدل شي)"
                : "فایل انتخاب کړئ"}
              <input
                type="file"
                hidden
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
            </Button>

            {/* Show newly selected file */}
            {formData.fileURL && (
              <Typography
                variant="caption"
                sx={{
                  mt: 1,
                  display: "block",
                  color: "green",
                  fontWeight: "bold",
                }}
              >
                ✓ نوی فایل منتخب شو: {formData.fileURL.name}
              </Typography>
            )}
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12} sx={{ textAlign: "right", mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "black",
                color: "white",
                borderRadius: "10px",
                "&:hover": { backgroundColor: "#1d252e" },
                width: { xs: "100%", sm: "auto" },
                px: 4,
              }}
              endIcon={<SaveIcon />}
              disabled={isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={24} /> : "ویرایش کردن"}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
