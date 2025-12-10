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
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  getReceiptById,
  updateReceipt,
} from "../../../services/StorageManagement/MakzanReceiptAPI";
import React, { useState, useEffect } from "react";
import PageBreadcrumbs from "../../Breadcrumbs/PageBreadcrumbs";
import SaveIcon from "@mui/icons-material/Save";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import api from "../../../services/api";

export default function UpdateMakzanReceipt() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    no: "",
    docNo: "",
    org: "",
    letterNo: "",
    letterDate: "",
    subjectType: "",
    description: "",
    fileURL: null,
    existingFileName: "",
  });

  const [orgs, setOrgs] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        const orgsRes = await api.get("/org");
        setOrgs(orgsRes.data);

        const recordRes = await getReceiptById(id);
        const record = recordRes.data;

        setFormData({
          no: record.no || "",
          docNo: record.docNo || "",
          org: record.org?.id || "",
          letterNo: record.letterNo || "",
          letterDate: record.letterDate || "",
          subjectType: record.subjectType || "",
          description: record.description || "",
          fileURL: null,
          existingFileName: record.files?.[0]?.filePath || "",
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load data", error);
        toast.error("د معلوماتو لوډولو کې ستونزه");
        setIsLoading(false);
        navigate("/makzan-receipts");
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

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      fileURL: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const requiredFields = ["no", "org"];
    const missingFields = requiredFields.filter((field) => !formData[field]);
    if (missingFields.length > 0) {
      toast.error("لطفاً تمام فیلدهای ضروری را پر کنید");
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataToSend = new FormData();

      const receiptData = {
        no: formData.no,
        docNo: formData.docNo,
        org: { id: formData.org },
        letterNo: formData.letterNo,
        letterDate: formData.letterDate,
        subjectType: formData.subjectType,
        description: formData.description,
      };

      formDataToSend.append("receipts", JSON.stringify(receiptData));

      if (formData.fileURL) {
        formDataToSend.append("fileURL", formData.fileURL);
      }

      await updateReceipt(id, formDataToSend);
      toast.success("رسید په بریالیتوب سره تازه شو");
      navigate("/makzan-receipts");
    } catch (error) {
      console.error("Failed to update receipt", error);
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
              name="no"
              InputLabelProps={{ shrink: true }}
              label="نمبر"
              variant="outlined"
              value={formData.no}
              onChange={handleInputChange}
              InputProps={{ sx: { height: 60 } }}
              required
              error={!formData.no}
              helperText={!formData.no ? "این فیلد ضروری است" : ""}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="docNo"
              InputLabelProps={{ shrink: true }}
              label="نمبر سند"
              variant="outlined"
              value={formData.docNo}
              onChange={handleInputChange}
              InputProps={{ sx: { height: 60 } }}
            />
          </Grid>

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

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="letterNo"
              InputLabelProps={{ shrink: true }}
              label="نمبر مکتوب"
              variant="outlined"
              value={formData.letterNo}
              onChange={handleInputChange}
              InputProps={{ sx: { height: 60 } }}
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
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="subjectType"
              InputLabelProps={{ shrink: true }}
              label="نوع موضوع"
              variant="outlined"
              value={formData.subjectType}
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

          <Grid item xs={12}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              startIcon={<AttachFileIcon />}
              sx={{ height: 60 }}
            >
              نوی فایل انتخاب کړئ
              <input
                type="file"
                hidden
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
            </Button>
            {formData.fileURL ? (
              <Typography
                variant="caption"
                sx={{ mt: 1, display: "block", color: "green" }}
              >
                ✓ نوی فایل: {formData.fileURL.name}
              </Typography>
            ) : formData.existingFileName ? (
              <Typography
                variant="caption"
                sx={{ mt: 1, display: "block", color: "blue" }}
              >
                📎 موجوده فایل: {formData.existingFileName}
              </Typography>
            ) : null}
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
