import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Box,
  IconButton,
  Chip,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { updateMakzanSubmissionReport } from "../../../services/StorageManagement/MakzanSubmissionReportAPI";
import React, { useState, useEffect } from "react";
import PageBreadcrumbs from "../../Breadcrumbs/PageBreadcrumbs";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

export default function EditMakzanSubmissionReportDialog({
  open,
  onClose,
  report,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    address: "",
    year: "",
    docType: "",
    summaryWaseqa: "",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (report) {
      setFormData({
        address: report.address || "",
        year: report.year || "",
        docType: report.docType || "",
        summaryWaseqa: report.summaryWaseqa || "",
        description: report.description || "",
      });
    }
  }, [report]);

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
      const payload = {
        address: formData.address,
        year: parseInt(formData.year),
        docType: formData.docType,
        summaryWaseqa: formData.summaryWaseqa,
        description: formData.description,
      };

      await updateMakzanSubmissionReport(report.id, payload);
      toast.success("راپور په بریالیتوب سره تازه شو");
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(
        "تازه کول ناکام شو: " + (error.response?.data?.message || error.message)
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          تازه کول
          {report && (
            <Chip
              label={`ID: ${report.id}`}
              size="small"
              sx={{ ml: 1 }}
              color="primary"
              variant="outlined"
            />
          )}
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
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

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  name="year"
                  label="سال"
                  value={formData.year}
                  onChange={handleInputChange}
                  required
                  error={!formData.year}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  name="docType"
                  label="نوع سند"
                  value={formData.docType}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
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
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button onClick={onClose} variant="outlined" disabled={isSubmitting}>
          لغوه
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting}
          startIcon={
            isSubmitting ? <CircularProgress size={18} /> : <SaveIcon />
          }
          sx={{ bgcolor: "black", "&:hover": { bgcolor: "#1d252e" } }}
        >
          {isSubmitting ? "ذخیره کیږي..." : "ذخیره تغییرات"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
