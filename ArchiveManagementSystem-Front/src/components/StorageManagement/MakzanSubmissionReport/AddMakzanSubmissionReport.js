import {
  TextField,
  Box,
  Grid,
  Button,
  CircularProgress,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { createMakzanSubmissionReport } from "../../../services/StorageManagement/MakzanSubmissionReportAPI";
import React, { useState } from "react";
import PageBreadcrumbs from "../../Breadcrumbs/PageBreadcrumbs";
import SaveIcon from "@mui/icons-material/Save";

export default function AddMakzanSubmissionReport() {
  const [formData, setFormData] = useState({
    address: "",
    year: "",
    docType: "",
    summaryWaseqa: "",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.address || !formData.year) {
      toast.error("لطفاً فیلدهای ضروری را پر کنید");
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
      console.log("hhh", reportData);
      await createMakzanSubmissionReport(reportData);
      toast.success("راپور په بریالیتوب سره ثبت شو");
      console.log("hhh", reportData);
      navigate("/annual-reports-info");
    } catch (error) {
      toast.error("ثبت ناکام شو");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/makzan-annual-reports")}
          sx={{ color: "text.secondary" }}
        >
          بیرته
        </Button>
        <Typography
          variant="h4"
          sx={{ fontFamily: "B Nazanin", fontWeight: "bold" }}
        >
          د مخزن تسلیمی راپور اضافه کول
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <PageBreadcrumbs />
      </Box>

      {/* Form Card */}
      <Card sx={{ maxWidth: 800, mx: "auto" }}>
        <CardContent sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  size="small"
                  name="address"
                  label="آدرس"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  error={!formData.address}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  size="small"
                  name="year"
                  type="number"
                  label="سال"
                  value={formData.year}
                  onChange={handleInputChange}
                  required
                  error={!formData.year}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  size="small"
                  name="docType"
                  label="نوع سند"
                  value={formData.docType}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  size="small"
                  name="summaryWaseqa"
                  label="خلاصه وثیقه"
                  value={formData.summaryWaseqa}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  name="description"
                  label="ملاحظات"
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                    mt: 2,
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/makzan-annual-reports")}
                    disabled={isSubmitting}
                  >
                    لغوه
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    endIcon={
                      isSubmitting ? (
                        <CircularProgress size={20} />
                      ) : (
                        <SaveIcon />
                      )
                    }
                    sx={{
                      bgcolor: "black",
                      "&:hover": { bgcolor: "#1d252e" },
                    }}
                  >
                    {isSubmitting ? "ذخیره کیږي..." : "ذخیره کړئ"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
