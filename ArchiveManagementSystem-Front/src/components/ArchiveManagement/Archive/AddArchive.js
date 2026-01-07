import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

import { createArchive } from "../../../services/ArchiveManagement/ArchiveAPI";
import api from "../../../services/api";
import PageBreadcrumbs from "../../Breadcrumbs/PageBreadcrumbs";

import getarchiveTexts from "./archiveTexts";

export default function AddArchive() {
  const { t } = useTranslation("archive");
  console.log("translate files", t);

  // 🔹 Just call getarchiveTexts inside render, returns updated strings
  const texts = getarchiveTexts(t);
  console.log("texts should be shown here", texts);

  const [formData, setFormData] = useState({
    docNo: "",
    incommingDate: "",
    outgoingDate: "",
    org: "",
    submitedDate: "",
    description: "",
    docTypeId: "",
    year: "",
    isIncoming: true,
  });

  const [orgs, setOrgs] = useState([]);
  const [docTypes, setDocTypes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const loadOrgs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/org");
      setOrgs(res.data || []);
    } catch (error) {
      console.error(error);
      toast.error(texts.loadError); // plain string
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    loadOrgs();
  }, []);

  const loadData = async () => {
    try {
      const [orgsRes, docTypesRes] = await Promise.all([
        api.get("/org"),
        api.get("/doc-type/active"), // ✅ Load only active doc types
      ]);
      setOrgs(orgsRes.data);
      setDocTypes(docTypesRes.data);
    } catch (error) {
      console.error("Failed to load data", error);
      toast.error("د معلوماتو لوډولو کې ستونزه");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Clear outgoing date when switching to incoming
    if (name === "isIncoming" && value === true) {
      setFormData((prev) => ({ ...prev, [name]: value, outgoingDate: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.docNo || !formData.org) {
      toast.error(texts.required);
      setIsSubmitting(false);
      return;
    }

    try {
      const archiveData = {
        docNo: formData.docNo,
        incommingDate: formData.incommingDate,
        outgoingDate: formData.outgoingDate,
        org: { id: formData.org },
        submitedDate: formData.submitedDate,
        description: formData.description,
        docType: formData.docTypeId ? { id: formData.docTypeId } : null,
        year: formData.year ? parseInt(formData.year) : null,
        isIncoming: formData.isIncoming,
      };

      await createArchive(archiveData);
      toast.success(texts.success);
      navigate("/archive");
    } catch (error) {
      console.error("Failed to create archive", error);
      toast.error(
        "ثبت ناکام شو: " + (error.response?.data?.message || error.message)
      );
      console.error(error);
      toast.error(texts.error);
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
          onClick={() => navigate("/archive")}
          sx={{ color: "text.secondary" }}
        >
          بیرته
        </Button>
        <Typography
          variant="h4"
          sx={{ fontFamily: "B Nazanin", fontWeight: "bold" }}
        >
          د آرشیف اضافه کول
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <PageBreadcrumbs />
      </Box>

      {/* Form Card */}
      <Card sx={{ maxWidth: 900, mx: "auto" }}>
        <CardContent sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>ډول</InputLabel>
                  <Select
                    name="isIncoming"
                    value={formData.isIncoming}
                    onChange={handleInputChange}
                    label="ډول"
                  >
                    <MenuItem value={true}>وارده</MenuItem>
                    <MenuItem value={false}>صادره</MenuItem>
                  </Select>
                </FormControl>
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
                  required
                  error={!formData.docNo}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="incommingDate"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  label="تاریخ وارده"
                  variant="outlined"
                  value={formData.incommingDate}
                  onChange={handleInputChange}
                />
              </Grid>

              {/* Only show outgoing date for صادره (outgoing) documents */}
              {!formData.isIncoming && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="outgoingDate"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    label="تاریخ صادره"
                    variant="outlined"
                    value={formData.outgoingDate}
                    onChange={handleInputChange}
                  />
                </Grid>
              )}

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required error={!formData.org}>
                  <InputLabel>اداره</InputLabel>
                  <Select
                    name="org"
                    value={formData.org}
                    onChange={handleInputChange}
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
                  name="submitedDate"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  label="تاریخ تسلیمی"
                  variant="outlined"
                  value={formData.submitedDate}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>نوع سند</InputLabel>
                  <Select
                    name="docTypeId"
                    value={formData.docTypeId}
                    onChange={handleInputChange}
                    label="نوع سند"
                  >
                    <MenuItem value="">
                      <em>انتخاب نکړئ</em>
                    </MenuItem>
                    {docTypes.map((docType) => (
                      <MenuItem key={docType.id} value={docType.id}>
                        {docType.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="description"
                  label="ملاحظات"
                  variant="outlined"
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
                    onClick={() => navigate("/archive")}
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
