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
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { createHifziyaHazari } from "../../../services/RepositoryManagement/HifziyaHazariAPI";
import React, { useState, useEffect } from "react";
import PageBreadcrumbs from "../../Breadcrumbs/PageBreadcrumbs";
import SaveIcon from "@mui/icons-material/Save";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import api from "../../../services/api";

export default function AddHazari() {
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
  const navigate = useNavigate();

  // ✅ Load Types and Orgs on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("Loading types and orgs...");

        const [typesRes, orgsRes] = await Promise.all([
          api.get("/type"), // ✅ Changed from /types to /type
          api.get("/org"), // ✅ Changed from /orgs to /org
        ]);

        console.log("Types:", typesRes.data);
        console.log("Orgs:", orgsRes.data);

        setTypes(typesRes.data);
        setOrgs(orgsRes.data);
      } catch (error) {
        console.error("Failed to load types/orgs", error);
        toast.error("Failed to load form data");
      }
    };
    loadData();
  }, []);

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

      const yearAsInteger = new Date(formData.year).getFullYear();
      const hazariData = {
        type: { id: formData.type },
        year: yearAsInteger, // 2025
        org: { id: formData.org },
        description: formData.description,
        isIndraj: formData.isIndraj,
      };

      formDataToSend.append("hifziyaHazari", JSON.stringify(hazariData));

      if (formData.fileURL) {
        formDataToSend.append("fileURL", formData.fileURL);
      }

      await createHifziyaHazari(formDataToSend);
      toast.success("ریکارډ په بریالیتوب سره ثبت شو");
      navigate("/hifziya-hazari");
    } catch (error) {
      console.error("Failed to create report", error);
      toast.error(
        "ثبت ناکام شو: " + (error.response?.data?.message || error.message)
      );
    }
    setIsSubmitting(false);
  };

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
          افزودن حاضری
        </Box>

        <Box
          sx={{
            position: "absolute",
            top: { xs: -20, sm: -25, md: -30 },
            right: 20,
          }}
        >
          <PageBreadcrumbs />
        </Box>

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

          {/* File Upload */}
          <Grid item xs={12}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              startIcon={<AttachFileIcon />}
              sx={{ height: 60 }}
            >
              فایل انتخاب کړئ
              <input
                type="file"
                hidden
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
            </Button>
            {formData.fileURL && (
              <Typography
                variant="caption"
                sx={{ mt: 1, display: "block", color: "green" }}
              >
                ✓ {formData.fileURL.name}
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
              {isSubmitting ? <CircularProgress size={24} /> : "ذخیره کردن"}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
