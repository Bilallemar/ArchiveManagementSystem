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
  Alert,
  IconButton,
  Badge,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { createReceipt } from "../../../services/StorageManagement/MakzanReceiptAPI";
import SaveIcon from "@mui/icons-material/Save";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderIcon from "@mui/icons-material/Folder";
import ScannerIcon from "@mui/icons-material/Scanner";
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
    files: [],
  });

  const [orgs, setOrgs] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scannerFolderPath, setScannerFolderPath] = useState("");
  const [detectedFiles, setDetectedFiles] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const navigate = useNavigate();

  // Load organizations
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

  // Load scanner folder path on mount
  useEffect(() => {
    const loadScannerPath = async () => {
      try {
        const response = await api.get("/scanner-folder/path");
        setScannerFolderPath(response.data.path);
      } catch (error) {
        console.error("Failed to load scanner folder path", error);
      }
    };
    loadScannerPath();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Scan button - fetch fresh files from scanner folder
  const handleScan = async () => {
    try {
      setIsScanning(true);
      const response = await api.get("/scanner-folder/files");
      setDetectedFiles(response.data);

      if (response.data.length === 0) {
        toast.info("په سکینر پوښۍ کې فایلونه نشته");
      } else {
        toast.success(`${response.data.length} فایل(ونه) وموندل شول`);
      }
    } catch (error) {
      console.error("Failed to scan folder", error);
      toast.error("سکین کولو کې ستونزه");
    } finally {
      setIsScanning(false);
    }
  };

  // Load files from scanner folder to form
  const handleLoadFromScanner = async () => {
    if (detectedFiles.length === 0) {
      toast.error("په سکینر پوښۍ کې فایلونه نشته");
      return;
    }

    try {
      // Download files from scanner folder and add to form
      const filePromises = detectedFiles.map(async (fileInfo) => {
        const response = await api.get(
          `/scanner-folder/files/${fileInfo.name}/download`,
          { responseType: "blob" }
        );

        // Create a File object from the blob
        const file = new File([response.data], fileInfo.name, {
          type: response.headers["content-type"],
        });

        return file;
      });

      const files = await Promise.all(filePromises);

      setFormData((prev) => ({
        ...prev,
        files: files,
      }));

      toast.success(`${files.length} فایلونه د سکینر نه لوډ شول`);
    } catch (error) {
      console.error("Failed to load files from scanner", error);
      toast.error("د فایلونو لوډولو کې ستونزه");
    }
  };

  // Manual file selection (alternative method)
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

  const handleRemoveAllFiles = () => {
    setFormData((prev) => ({
      ...prev,
      files: [],
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

      {/* Scanner Folder Info Alert */}
      <Alert
        severity="info"
        sx={{ mb: 3, maxWidth: 1200, mx: "auto" }}
        icon={<ScannerIcon />}
      >
        <Typography variant="body2" fontWeight="bold">
          د سکینر پوښۍ: {scannerFolderPath}
        </Typography>
      </Alert>

      {/* Form Card */}
      <Card sx={{ maxWidth: 1200, mx: "auto" }}>
        <CardContent sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* LEFT SIDE - Scanner Files Section */}
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  {/* Scanner Status Card */}
                  <Card
                    variant="outlined"
                    sx={{
                      bgcolor:
                        detectedFiles.length > 0
                          ? "success.lighter"
                          : "background.neutral",
                      borderColor:
                        detectedFiles.length > 0 ? "success.main" : "divider",
                      borderWidth: 2,
                    }}
                  >
                    <CardContent sx={{ textAlign: "center", py: 3 }}>
                      <Badge
                        badgeContent={detectedFiles.length}
                        color="success"
                        sx={{ mb: 2 }}
                      >
                        <FolderIcon
                          sx={{ fontSize: 50, color: "primary.main" }}
                        />
                      </Badge>

                      <Typography variant="h6" gutterBottom>
                        د سکینر پوښۍ
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        {detectedFiles.length > 0
                          ? `${detectedFiles.length} فایل(ونه) موجود دي`
                          : "سکین تڼۍ کلیک کړئ"}
                      </Typography>

                      {/* Scan Button */}
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<ScannerIcon />}
                        onClick={handleScan}
                        disabled={isScanning}
                        sx={{
                          mb: 1,
                          borderColor: "primary.main",
                          color: "primary.main",
                          "&:hover": {
                            borderColor: "primary.dark",
                            bgcolor: "primary.lighter",
                          },
                        }}
                      >
                        {isScanning ? (
                          <>
                            <CircularProgress size={16} sx={{ mr: 1 }} />
                            سکین کیږي...
                          </>
                        ) : (
                          "سکین"
                        )}
                      </Button>

                      {/* Load Files Button */}
                      <Button
                        variant="contained"
                        fullWidth
                        startIcon={<AttachFileIcon />}
                        onClick={handleLoadFromScanner}
                        disabled={detectedFiles.length === 0}
                        sx={{
                          bgcolor: "success.main",
                          "&:hover": { bgcolor: "success.dark" },
                        }}
                      >
                        فایلونه لوډ کړئ
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Detected Files List */}
                  {detectedFiles.length > 0 && (
                    <Box>
                      <Typography
                        variant="subtitle2"
                        fontWeight="bold"
                        sx={{ mb: 1 }}
                      >
                        د سکینر فایلونه:
                      </Typography>
                      <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
                        <Stack spacing={0.5}>
                          {detectedFiles.map((file, index) => (
                            <Chip
                              key={index}
                              label={file.name}
                              size="small"
                              icon={<AttachFileIcon />}
                              sx={{
                                justifyContent: "flex-start",
                                "& .MuiChip-label": {
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                },
                              }}
                            />
                          ))}
                        </Stack>
                      </Box>
                    </Box>
                  )}

                  {/* Manual File Upload (Alternative) */}
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      size="small"
                      startIcon={<AttachFileIcon />}
                    >
                      یا دستي فایل اضافه کړئ
                      <input
                        type="file"
                        hidden
                        multiple
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                    </Button>
                  </Box>

                  {/* Selected Files for Upload */}
                  {formData.files.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 1,
                        }}
                      >
                        <Typography variant="subtitle2" fontWeight="bold">
                          د اپلوډ لپاره چمتو ({formData.files.length})
                        </Typography>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={handleRemoveAllFiles}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>

                      <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
                        <Stack spacing={0.5}>
                          {formData.files.map((file, index) => (
                            <Chip
                              key={index}
                              label={file.name}
                              onDelete={() => handleRemoveFile(index)}
                              deleteIcon={<DeleteIcon />}
                              size="small"
                              color="primary"
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
                    </Box>
                  )}
                </Box>
              </Grid>

              {/* RIGHT SIDE - Form Fields */}
              <Grid item xs={12} md={8}>
                <Grid container spacing={3}>
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
