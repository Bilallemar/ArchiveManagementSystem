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
  Chip,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { createReceipt } from "../../../services/StorageManagement/MakzanReceiptAPI";
import SaveIcon from "@mui/icons-material/Save";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../../../services/api";

export default function AddMakzanReceipt() {
  const [formData, setFormData] = useState({
    no: "",
    docNo: "",
    org: "",
    letterNo: "",
    letterDate: "",
    subjectType: "",
    description: "",
    files: [], // Changed from fileURL to files array
  });

  const [orgs, setOrgs] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const orgsRes = await api.get("/org");
        setOrgs(orgsRes.data);
      } catch (error) {
        console.error("Failed to load orgs", error);
        toast.error("د ادارې معلوماتو لوډولو کې ستونزه");
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
    const selectedFiles = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      files: [...prev.files, ...selectedFiles],
    }));
  };

  const handleRemoveFile = (index) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const requiredFields = ["no", "org"];
    const missingFields = requiredFields.filter((field) => !formData[field]);
    if (missingFields.length > 0) {
      toast.error("مهرباني وکړئ ټول اړین فیلډونه ډک کړئ");
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

      if (formData.files.length > 0) {
        formData.files.forEach((file) => {
          formDataToSend.append("fileURL", file);
        });
      }

      await createReceipt(formDataToSend);
      toast.success("رسید په بریالیتوب سره ثبت شو");
      navigate("/makzan-receipts");
    } catch (error) {
      console.error("Failed to create receipt", error);
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
          onClick={() => navigate("/makzan-receipts")}
          sx={{ color: "text.secondary" }}
        >
          بیرته
        </Button>
        <Typography
          variant="h4"
          sx={{ fontFamily: "B Nazanin", fontWeight: "bold" }}
        >
          د نوي مخزن رسید اضافه کول
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
                    اجازه شوي فایلونه: *.jpeg, *.jpg, *.png, *.pdf
                    <br />د هر فایل اعظمي اندازه: 5 MB
                  </Typography>
                </Box>
              </Grid>

              {/* RIGHT SIDE - Form Fields */}
              <Grid item xs={12} md={8}>
                <Grid container spacing={3}>
                  {/* Receipt Number */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      name="no"
                      label="د رسید نمبر"
                      value={formData.no}
                      onChange={handleInputChange}
                      required
                      error={!formData.no}
                      helperText={!formData.no ? "دا فیلد اړین دی" : ""}
                    />
                  </Grid>

                  {/* Document Number */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      name="docNo"
                      label="د سند نمبر"
                      value={formData.docNo}
                      onChange={handleInputChange}
                    />
                  </Grid>

                  {/* Organization */}
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
                          <MenuItem disabled>لوډیږي...</MenuItem>
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

                  {/* Letter Number */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      name="letterNo"
                      label="د مکتوب نمبر"
                      value={formData.letterNo}
                      onChange={handleInputChange}
                    />
                  </Grid>

                  {/* Letter Date */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      name="letterDate"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      label="د مکتوب نیټه"
                      value={formData.letterDate}
                      onChange={handleInputChange}
                    />
                  </Grid>

                  {/* Subject Type */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      name="subjectType"
                      label="د موضوع ډول"
                      value={formData.subjectType}
                      onChange={handleInputChange}
                    />
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
                        onClick={() => navigate("/makzan-receipts")}
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
