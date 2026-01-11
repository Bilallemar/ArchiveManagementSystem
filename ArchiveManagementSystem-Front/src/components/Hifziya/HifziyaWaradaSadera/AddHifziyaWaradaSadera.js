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
  Stack,
  Chip,
  IconButton,
  Alert,
  Badge,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { createHifziyaWaradaSadera } from "../../../services/RepositoryManagement/HifziyaWaradaSaderaAPI";
import SaveIcon from "@mui/icons-material/Save";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import ScannerIcon from "@mui/icons-material/Scanner";
import FolderIcon from "@mui/icons-material/Folder";
import api from "../../../services/api";

export default function AddHifziyaWaradaSadera() {
  const [formData, setFormData] = useState({
    no: "",
    org: "",
    letterNumber: "",
    incommingDate: "",
    outgoingDate: "",
    summary: "",
    description: "",
    isHifziya: true,
    files: [],
  });

  const [orgs, setOrgs] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scannerFolderPath, setScannerFolderPath] = useState("");
  const [detectedFiles, setDetectedFiles] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/org").then((res) => setOrgs(res.data));
  }, []);

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
    setFormData((p) => ({ ...p, [name]: value }));
  };

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
    setFormData((p) => ({
      ...p,
      files: [...p.files, ...Array.from(e.target.files)],
    }));
  };

  const handleRemoveFile = (index) => {
    setFormData((p) => ({
      ...p,
      files: p.files.filter((_, i) => i !== index),
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

    try {
      const fd = new FormData();
      const payload = {
        no: formData.no,
        org: { id: formData.org },
        letterNumber: formData.letterNumber,
        incommingDate: formData.incommingDate,
        outgoingDate: formData.outgoingDate,
        summary: formData.summary,
        description: formData.description,
        isHifziya: formData.isHifziya,
      };

      fd.append("hifziyaWaradaSadera", JSON.stringify(payload));
      formData.files.forEach((f) => fd.append("fileURL", f));

      await createHifziyaWaradaSadera(fd);
      toast.success("ریکارډ په بریالیتوب سره ثبت شو");
      navigate("/hifziya-warada-sadera");
    } catch (e) {
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
          onClick={() => navigate("/hifziya-warada-sadera")}
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
              {/* LEFT SIDE - File Upload Section */}
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

              {/* Fields */}
              <Grid item xs={12} md={8}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="نمبر"
                      name="no"
                      value={formData.no}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>اداره</InputLabel>
                      <Select
                        name="org"
                        value={formData.org}
                        onChange={handleInputChange}
                      >
                        {orgs.map((o) => (
                          <MenuItem key={o.id} value={o.id}>
                            {o.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="شماره مکتوب"
                      name="letterNumber"
                      value={formData.letterNumber}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="date"
                      name="incommingDate"
                      label="تاریخ مرسل"
                      InputLabelProps={{ shrink: true }}
                      value={formData.incommingDate}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="date"
                      name="outgoingDate"
                      label="تاریخ مرسل الیه"
                      InputLabelProps={{ shrink: true }}
                      value={formData.outgoingDate}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="خلص مطلب"
                      name="summary"
                      value={formData.summary}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="ملاحظات"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                  </Grid>

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
                        onClick={() => navigate("/hifziya-warada-sadera")}
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
