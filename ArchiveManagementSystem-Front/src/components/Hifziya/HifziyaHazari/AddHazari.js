import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderIcon from "@mui/icons-material/Folder";
import SaveIcon from "@mui/icons-material/Save";
import ScannerIcon from "@mui/icons-material/Scanner";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import getAddHazariTexts from "../../../helpers/hifziya/hazari/AddHazariText";
import api from "../../../services/api";
import { createHifziyaHazari } from "../../../services/RepositoryManagement/HifziyaHazariAPI";

export default function AddHazari() {
  const { t } = useTranslation("addHazari");
  const text = getAddHazariTexts(t);
  const navigate = useNavigate();
  const location = useLocation();

  // Read type from URL (?type=indraj or ?type=hazari)
  const searchParams = new URLSearchParams(location.search);
  const typeFromUrl = searchParams.get("type");

  // Determine isIndraj based on URL (default to true = Indraj)
  const isIndrajFromUrl = typeFromUrl === "hazari" ? false : true;

  const [formData, setFormData] = useState({
    volume: "",
    type: "",
    subType: "",
    year: "",
    org: "",
    description: "",
    files: [],
  });

  const [types, setTypes] = useState([]);
  const [subTypes, setSubTypes] = useState([]);
  const [orgs, setOrgs] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scannerFolderPath, setScannerFolderPath] = useState("");
  const [detectedFiles, setDetectedFiles] = useState([]);
  const [isScanning, setIsScanning] = useState(false);

  // Load types & organizations
  useEffect(() => {
    const loadData = async () => {
      try {
        const [typesRes, orgsRes] = await Promise.all([
          api.get("/type"),
          api.get("/org"),
        ]);
        setTypes(typesRes.data || []);
        setOrgs(orgsRes.data || []);
      } catch (error) {
        console.error("Failed to load data", error);
        toast.error(text.loadDataError || "د معلوماتو لوستلو کې ستونزه");
      }
    };
    loadData();
  }, [text.loadDataError]);

  // Load sub-types when type changes
  useEffect(() => {
    const loadSubTypes = async () => {
      if (!formData.type) {
        setSubTypes([]);
        setFormData((prev) => ({ ...prev, subType: "" }));
        return;
      }
      try {
        const res = await api.get(`/sub-type/by-type/${formData.type}`);
        setSubTypes(res.data || []);
      } catch (error) {
        console.error("Failed to load sub-types", error);
        toast.error(text.loadSubTypesError || "د فرعي ډولونو لوستلو کې ستونزه");
        setSubTypes([]);
      }
    };
    loadSubTypes();
  }, [formData.type, text.loadSubTypesError]);

  // Load scanner folder path
  useEffect(() => {
    api
      .get("/scanner-folder/path")
      .then((res) => setScannerFolderPath(res.data.path || ""))
      .catch(() => {});
  }, []);

  // Show current type (Indraj or Hazari) as read-only info
  const recordTypeLabel = isIndrajFromUrl
    ? text.indraj || "اندراج"
    : text.hazari || "حاضري";

  const pageTitle = isIndrajFromUrl
    ? text.newIndraj || "نوی اندراج"
    : text.newHazari || "نوې حاضري";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleScan = async () => {
    setIsScanning(true);
    try {
      const res = await api.get("/scanner-folder/files");
      setDetectedFiles(res.data || []);
      toast[res.data.length ? "success" : "info"](
        `${res.data.length} ${text.filesFound}`,
      );
    } catch {
      toast.error(text.scanError);
    } finally {
      setIsScanning(false);
    }
  };

  const handleLoadFromScanner = async () => {
    if (!detectedFiles.length) return toast.error(text.noFiles);

    try {
      const files = await Promise.all(
        detectedFiles.map(async (f) => {
          const res = await api.get(
            `/scanner-folder/files/${f.name}/download`,
            { responseType: "blob" },
          );
          return new File([res.data], f.name, {
            type: res.headers["content-type"] || "application/octet-stream",
          });
        }),
      );

      setFormData((prev) => ({ ...prev, files }));
      setDetectedFiles([]);
      toast.success(`${files.length} ${text.loadSuccess}`);
    } catch {
      toast.error(text.loadError);
    }
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, files: [...prev.files, ...newFiles] }));
  };

  const handleRemoveFile = (index) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveAllFiles = () => {
    setFormData((prev) => ({ ...prev, files: [] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const required = ["type", "subType", "year", "org"];
    const missing = required.filter((f) => !formData[f]);
    if (missing.length) {
      toast.error(text.error.requiredFields || "ټول اړین فیلډونه ډک کړئ");
      setIsSubmitting(false);
      return;
    }

    try {
      const fd = new FormData();

      const yearAsInteger = new Date(formData.year).getFullYear();

      const payload = {
        volume: formData.volume?.trim() || null,
        type: { id: Number(formData.type) },
        subType: { id: Number(formData.subType) },
        year: yearAsInteger,
        org: { id: Number(formData.org) },
        description: formData.description?.trim() || null,
        isIndraj: isIndrajFromUrl, // ← taken from URL, not from form
      };

      fd.append("hifziyaHazari", JSON.stringify(payload));

      formData.files.forEach((file) => fd.append("fileURL", file));

      await createHifziyaHazari(fd);
      toast.success(text.create || "ثبت په بریالیتوب ثبت شو");
      navigate("/hifziya-hazari");
    } catch (err) {
      toast.error(text.createSuccess || "د ثبت په ثبت کولو کې ستونزه");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: "auto" }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/hifziya-hazari")}
          sx={{ color: "text.secondary" }}
        >
          {text.back || "بیرته"}
        </Button>
        <Typography variant="h4" fontWeight="bold">
          {pageTitle}
        </Typography>
      </Box>
      {/* <Box sx={{ mb: 3 }}>
        <PageBreadcrumbs />
      </Box> */}
      {/* Show current type as info (like direction in Archive) */}
      <Alert severity="info" sx={{ mb: 4 }} icon={false}>
        <Typography variant="body1">
          <strong>{text.recordType || "ډول"}:</strong> {recordTypeLabel}
        </Typography>
      </Alert>

      {/* Main Form */}
      <Card elevation={3} sx={{ borderRadius: 2 }}>
        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              {/* LEFT: Scanner + Files */}
              <Grid item xs={12} md={4}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {/* Scanner Card */}
                  <Card
                    variant="outlined"
                    sx={{
                      borderWidth: 2,
                      borderColor: detectedFiles.length
                        ? "success.main"
                        : "divider",
                      bgcolor: detectedFiles.length
                        ? "success.lighter"
                        : "background.paper",
                    }}
                  >
                    <CardContent sx={{ textAlign: "center", py: 4 }}>
                      <Badge
                        badgeContent={detectedFiles.length}
                        color="success"
                        sx={{ mb: 2 }}
                      >
                        <FolderIcon
                          sx={{ fontSize: 60, color: "primary.main" }}
                        />
                      </Badge>

                      <Typography variant="h6" gutterBottom>
                        {text.folderTitle}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 3 }}
                      >
                        {detectedFiles.length
                          ? `${detectedFiles.length} ${text.filesFound}`
                          : text.clickToScan}
                      </Typography>

                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<ScannerIcon />}
                        onClick={handleScan}
                        disabled={isScanning}
                        sx={{ mb: 2 }}
                      >
                        {isScanning ? (
                          <>
                            <CircularProgress size={20} sx={{ mr: 1 }} />
                            {text.scanning}
                          </>
                        ) : (
                          text.scanButton
                        )}
                      </Button>

                      <Button
                        variant="contained"
                        fullWidth
                        startIcon={<AttachFileIcon />}
                        onClick={handleLoadFromScanner}
                        disabled={!detectedFiles.length}
                        sx={{
                          bgcolor: "#4CAF50",
                          "&:hover": { bgcolor: "#45a049" },
                        }}
                      >
                        {text.loadFiles}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Detected Files */}
                  {detectedFiles.length > 0 && (
                    <Box>
                      <Typography
                        variant="subtitle2"
                        fontWeight="bold"
                        sx={{ mb: 1 }}
                      >
                        {text.detectedFiles}
                      </Typography>
                      <Box sx={{ maxHeight: 180, overflowY: "auto" }}>
                        <Stack spacing={0.5}>
                          {detectedFiles.map((f, i) => (
                            <Chip
                              key={i}
                              label={f.name}
                              size="small"
                              icon={<AttachFileIcon />}
                            />
                          ))}
                        </Stack>
                      </Box>
                    </Box>
                  )}

                  {/* Manual Upload */}
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    startIcon={<AttachFileIcon />}
                  >
                    {text.manualUpload}
                    <input
                      type="file"
                      hidden
                      multiple
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                  </Button>

                  {/* Selected Files */}
                  {formData.files.length > 0 && (
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 1,
                        }}
                      >
                        <Typography variant="subtitle2" fontWeight="bold">
                          {text.readyToUpload} ({formData.files.length})
                        </Typography>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={handleRemoveAllFiles}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <Box sx={{ maxHeight: 180, overflowY: "auto" }}>
                        <Stack spacing={0.5}>
                          {formData.files.map((file, index) => (
                            <Chip
                              key={index}
                              label={file.name}
                              onDelete={() => handleRemoveFile(index)}
                              size="small"
                              sx={{
                                backgroundColor: "#2196F3",
                                color: "#ffffff",
                                justifyContent: "space-between",

                                "& .MuiChip-deleteIcon": {
                                  color: "#ffffff",
                                  "&:hover": {
                                    color: "#ffffff",
                                  },
                                },

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

              {/* RIGHT: Form Fields */}
              <Grid item xs={12} md={8}>
                <Grid container spacing={3}>
                  {/* Type */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      name="volume"
                      label={text.volume || "جلد"}
                      value={formData.volume}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl
                      fullWidth
                      size="small"
                      required
                      error={!formData.type}
                    >
                      <InputLabel>{text.type || "ډول"}</InputLabel>
                      <Select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        label={text.type || "ډول"}
                      >
                        {types.length === 0 ? (
                          <MenuItem disabled>
                            {text.loading || "په بار کې دی..."}
                          </MenuItem>
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
                  <Grid item xs={12} sm={6}>
                    <FormControl
                      fullWidth
                      size="small"
                      required
                      error={!formData.subType}
                      disabled={!formData.type}
                    >
                      <InputLabel>{text.subType || "فرعي ډول"}</InputLabel>
                      <Select
                        name="subType"
                        value={formData.subType}
                        onChange={handleInputChange}
                        label={text.subType || "فرعي ډول"}
                      >
                        {!formData.type ? (
                          <MenuItem disabled>
                            {text.selectTypeFirst || "لومړی ډول وټاکئ"}
                          </MenuItem>
                        ) : subTypes.length === 0 ? (
                          <MenuItem disabled>
                            {text.loading || "په بار کې دی..."}
                          </MenuItem>
                        ) : (
                          subTypes.map((st) => (
                            <MenuItem key={st.id} value={st.id}>
                              {st.name}
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
                      size="small"
                      name="year"
                      type="date"
                      label={text.year || "کال"}
                      InputLabelProps={{ shrink: true }}
                      value={formData.year}
                      onChange={handleInputChange}
                      required
                      error={!formData.year}
                      helperText={!formData.year ? text.required || "اړین" : ""}
                    />
                  </Grid>

                  {/* Organization */}
                  <Grid item xs={12} sm={6}>
                    <FormControl
                      fullWidth
                      size="small"
                      required
                      error={!formData.org}
                    >
                      <InputLabel>{text.org || "اداره"}</InputLabel>
                      <Select
                        name="org"
                        value={formData.org}
                        onChange={handleInputChange}
                        label={text.org || "اداره"}
                      >
                        {orgs.length === 0 ? (
                          <MenuItem disabled>
                            {text.loading || "په بار کې دی..."}
                          </MenuItem>
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
                      label={text.description || "توضیحات / ملاحظات"}
                      multiline
                      rows={4}
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                  </Grid>

                  {/* Submit */}
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 2,
                        mt: 3,
                      }}
                    >
                      <Button
                        variant="outlined"
                        onClick={() => navigate("/hifziya-hazari")}
                        disabled={isSubmitting}
                      >
                        {text.cancel || "لغوه"}
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
                          bgcolor: "#2196F3",
                          "&:hover": { bgcolor: "#2196F3" },
                        }}
                      >
                        {isSubmitting
                          ? text.saving || "په ساتلو کې..."
                          : text.save || "ثبت"}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
