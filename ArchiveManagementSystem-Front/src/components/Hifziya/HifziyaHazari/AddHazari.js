import React, { useState, useEffect } from "react";
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
  Card,
  CardContent,
  IconButton,
  Chip,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { createHifziyaHazari } from "../../../services/RepositoryManagement/HifziyaHazariAPI";
import SaveIcon from "@mui/icons-material/Save";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../../../services/api";

export default function AddHazari() {
  const [formData, setFormData] = useState({
    type: "",
    subType: "",
    year: "",
    org: "",
    description: "",
    isIndraj: true,
    files: [], // Changed from fileURL to files array
  });

  const [types, setTypes] = useState([]);
  const [subTypes, setSubTypes] = useState([]);
  const [orgs, setOrgs] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [typesRes, orgsRes] = await Promise.all([
          api.get("/type"),
          api.get("/org"),
        ]);
        setTypes(typesRes.data);
        setOrgs(orgsRes.data);
      } catch (error) {
        console.error("Failed to load types/orgs", error);
        toast.error("د معلوماتو لوډولو کې ستونزه");
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadSubTypes = async () => {
      if (!formData.type) {
        setSubTypes([]);
        setFormData((prev) => ({ ...prev, subType: "" }));
        return;
      }

      try {
        const response = await api.get(`/sub-type/by-type/${formData.type}`);
        setSubTypes(response.data);
      } catch (error) {
        console.error("Failed to load subtypes", error);
        toast.error("د فرعي ډولونو لوډولو کې ستونزه");
        setSubTypes([]);
      }
    };
    loadSubTypes();
  }, [formData.type]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ NEW: Handle multiple file selection
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      files: [...prev.files, ...selectedFiles],
    }));
  };

  // ✅ NEW: Remove individual file
  const handleRemoveFile = (index) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const requiredFields = ["type", "subType", "year", "org"];
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
        subType: { id: formData.subType },
        year: yearAsInteger,
        org: { id: formData.org },
        description: formData.description,
        isIndraj: formData.isIndraj,
      };

      formDataToSend.append("hifziyaHazari", JSON.stringify(hazariData));

      // ✅ Append multiple files
      if (formData.files.length > 0) {
        formData.files.forEach((file) => {
          formDataToSend.append("fileURL", file);
        });
      }

      await createHifziyaHazari(formDataToSend);
      toast.success("ریکارډ په بریالیتوب سره ثبت شو");
      navigate("/hifziya-hazari");
    } catch (error) {
      console.error("Failed to create report", error);
      toast.error(
        "ثبت ناکام شو: " + (error.response?.data?.message || error.message)
      );
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
          onClick={() => navigate("/hifziya-hazari")}
          sx={{ color: "text.secondary" }}
        >
          بیرته
        </Button>
        <Typography
          variant="h4"
          sx={{ fontFamily: "B Nazanin", fontWeight: "bold" }}
        >
          د نوي حاضری اضافه کول
        </Typography>
      </Box>

      {/* Form Card */}
      <Card sx={{ maxWidth: 1200, mx: "auto" }}>
        <CardContent sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* LEFT SIDE - File Upload Section */}
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  {/* File Upload Area */}
                  <Box
                    sx={{
                      width: 200,
                      height: 200,
                      borderRadius: "50%",
                      border: "1px dashed",
                      borderColor: "divider",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "background.neutral",
                      cursor: "pointer",
                      position: "relative",
                      "&:hover": {
                        bgcolor: "action.hover",
                      },
                    }}
                    component="label"
                  >
                    <AttachFileIcon
                      sx={{ fontSize: 40, color: "text.secondary" }}
                    />
                    <Box sx={{ mt: 1, color: "text.secondary", fontSize: 14 }}>
                      فایلونه پورته کړئ
                    </Box>
                    <Box
                      sx={{
                        mt: 0.5,
                        color: "primary.main",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      {formData.files.length} فایل غوره شوي
                    </Box>
                    <input
                      type="file"
                      hidden
                      multiple
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                  </Box>

                  {/* Selected Files List */}
                  {formData.files.length > 0 && (
                    <Box
                      sx={{ width: "100%", maxHeight: 250, overflowY: "auto" }}
                    >
                      <Stack spacing={1}>
                        {formData.files.map((file, index) => (
                          <Chip
                            key={index}
                            label={file.name}
                            onDelete={() => handleRemoveFile(index)}
                            deleteIcon={<DeleteIcon />}
                            size="small"
                            sx={{
                              justifyContent: "space-between",
                              "& .MuiChip-label": {
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                maxWidth: 150,
                              },
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  )}

                  <Typography variant="caption" color="text.secondary">
                    Allowed *.jpeg, *.jpg, *.png, *.pdf
                    <br />
                    max size of 5 MB each
                  </Typography>
                </Box>
              </Grid>

              {/* RIGHT SIDE - Form Fields */}
              <Grid item xs={12} md={8}>
                <Grid container spacing={3}>
                  {/* Record Type */}
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>د ریکارډ ډول</InputLabel>
                      <Select
                        name="isIndraj"
                        value={formData.isIndraj}
                        onChange={handleInputChange}
                        label="د ریکارډ ډول"
                      >
                        <MenuItem value={true}>اندراج</MenuItem>
                        <MenuItem value={false}>حاضری</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Type */}
                  <Grid item xs={12} md={6}>
                    <FormControl
                      fullWidth
                      size="small"
                      required
                      error={!formData.type}
                    >
                      <InputLabel>نوعیت</InputLabel>
                      <Select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        label="نوعیت"
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

                  {/* SubType */}
                  <Grid item xs={12} md={6}>
                    <FormControl
                      fullWidth
                      size="small"
                      required
                      error={!formData.subType}
                      disabled={!formData.type}
                    >
                      <InputLabel>زیر نوعیت</InputLabel>
                      <Select
                        name="subType"
                        value={formData.subType}
                        onChange={handleInputChange}
                        label="زیر نوعیت"
                      >
                        {!formData.type ? (
                          <MenuItem disabled>
                            ابتدا نوعیت را انتخاب کنید
                          </MenuItem>
                        ) : subTypes.length === 0 ? (
                          <MenuItem disabled>Loading...</MenuItem>
                        ) : (
                          subTypes.map((subType) => (
                            <MenuItem key={subType.id} value={subType.id}>
                              {subType.name}
                            </MenuItem>
                          ))
                        )}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Year */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      name="year"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      label="سال"
                      value={formData.year}
                      onChange={handleInputChange}
                      required
                      error={!formData.year}
                    />
                  </Grid>

                  {/* Org */}
                  <Grid item xs={12} md={6}>
                    <FormControl
                      fullWidth
                      size="small"
                      required
                      error={!formData.org}
                    >
                      <InputLabel>اداره</InputLabel>
                      <Select
                        name="org"
                        value={formData.org}
                        onChange={handleInputChange}
                        label="اداره"
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
                      size="small"
                      name="description"
                      label="ملاحظات"
                      multiline
                      rows={4}
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                  </Grid>

                  {/* Action Buttons */}
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        justifyContent: "flex-end",
                        mt: 2,
                      }}
                    >
                      <Button
                        variant="outlined"
                        onClick={() => navigate("/hifziya-hazari")}
                        disabled={isSubmitting}
                      >
                        لغوه
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        endIcon={
                          isSubmitting ? (
                            <CircularProgress size={20} />
                          ) : (
                            <SaveIcon />
                          )
                        }
                        disabled={isSubmitting}
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
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
