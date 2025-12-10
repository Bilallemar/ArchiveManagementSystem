import { TextField, Box, Grid, Button, CircularProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  getMakzanSubmissionReportById,
  updateMakzanSubmissionReport,
} from "../../../services/StorageManagement/MakzanSubmissionReportAPI";
import React, { useState, useEffect } from "react";
import PageBreadcrumbs from "../../Breadcrumbs/PageBreadcrumbs";
import SaveIcon from "@mui/icons-material/Save";

export default function UpdateMakzanSubmissionReport() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    address: "",
    year: "",
    docType: "",
    summaryWaseqa: "",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const recordRes = await getMakzanSubmissionReportById(id);
        const record = recordRes.data;

        setFormData({
          address: record.address || "",
          year: record.year || "",
          docType: record.docType || "",
          summaryWaseqa: record.summaryWaseqa || "",
          description: record.description || "",
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load data", error);
        toast.error("د معلوماتو لوډولو کې ستونزه");
        setIsLoading(false);
        navigate("/annual-reports-info");
      }
    };
    loadData();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const requiredFields = ["address", "year"];
    const missingFields = requiredFields.filter((field) => !formData[field]);
    if (missingFields.length > 0) {
      toast.error("لطفاً تمام فیلدهای ضروری را پر کنید");
      setIsSubmitting(false);
      return;
    }

    try {
      const reportData = {
        address: formData.address,
        year: parseInt(formData.year),
        docType: formData.docType,
        summaryWaseqa: formData.summaryWaseqa,
        description: formData.description,
      };

      await updateMakzanSubmissionReport(id, reportData);
      toast.success("راپور په بریالیتوب سره تازه شو");
      navigate("/annual-reports-info");
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
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
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
          تازه کول
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
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="address"
              InputLabelProps={{ shrink: true }}
              label="آدرس"
              variant="outlined"
              value={formData.address}
              onChange={handleInputChange}
              InputProps={{ sx: { height: 60 } }}
              required
              error={!formData.address}
              helperText={!formData.address ? "این فیلد ضروری است" : ""}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="year"
              type="number"
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

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="docType"
              InputLabelProps={{ shrink: true }}
              label="نوع سند"
              variant="outlined"
              value={formData.docType}
              onChange={handleInputChange}
              InputProps={{ sx: { height: 60 } }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="summaryWaseqa"
              InputLabelProps={{ shrink: true }}
              label="خلاصه وثیقه"
              variant="outlined"
              value={formData.summaryWaseqa}
              onChange={handleInputChange}
              InputProps={{ sx: { height: 60 } }}
            />
          </Grid>

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
              {isSubmitting ? <CircularProgress size={24} /> : "تازه کول"}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
