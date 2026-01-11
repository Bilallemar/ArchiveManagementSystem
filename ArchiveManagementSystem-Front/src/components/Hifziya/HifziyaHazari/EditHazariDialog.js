import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Box,
  IconButton,
  Chip,
  Typography,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-hot-toast";
import { updateHifziyaHazari } from "../../../services/RepositoryManagement/HifziyaHazariAPI";
import api from "../../../services/api";

export default function EditHazariDialog({ open, onClose, hazari, onSuccess }) {
  const [formData, setFormData] = useState({
    type: "",
    subType: "",
    year: "",
    org: "",
    description: "",
    isIndraj: true,
    newFiles: [], // New files to upload
  });

  const [types, setTypes] = useState([]);
  const [subTypes, setSubTypes] = useState([]);
  const [orgs, setOrgs] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingFiles, setExistingFiles] = useState([]);

  // Load organizations and types
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
        console.error("Failed to load data", error);
        toast.error("د معلوماتو لوډولو کې ستونزه");
      }
    };
    loadData();
  }, []);

  // Populate form when hazari changes
  useEffect(() => {
    if (hazari) {
      const formattedDate = hazari.year
        ? new Date(hazari.year).toISOString().split("T")[0]
        : "";

      setFormData({
        type: hazari.type?.id || "",
        subType: hazari.subType?.id || "",
        year: formattedDate,
        org: hazari.org?.id || "",
        description: hazari.description || "",
        isIndraj: hazari.isIndraj !== undefined ? hazari.isIndraj : true,
        newFiles: [],
      });

      if (hazari.files && hazari.files.length > 0) {
        setExistingFiles(hazari.files);
      } else {
        setExistingFiles([]);
      }
    }
  }, [hazari]);

  // Load SubTypes when Type changes
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
      newFiles: [...prev.newFiles, ...selectedFiles],
    }));
  };

  // ✅ NEW: Remove newly selected file
  const handleRemoveNewFile = (index) => {
    setFormData((prev) => ({
      ...prev,
      newFiles: prev.newFiles.filter((_, i) => i !== index),
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
      console.log("📤 Submitting update for ID:", hazari.id);
      console.log("📎 New files:", formData.newFiles.length);

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

      console.log("📝 Data to send:", hazariData);
      formDataToSend.append("hifziyaHazari", JSON.stringify(hazariData));

      // ✅ Append multiple new files
      if (formData.newFiles.length > 0) {
        formData.newFiles.forEach((file, index) => {
          console.log(`📎 Appending file ${index + 1}:`, file.name);
          formDataToSend.append("fileURL", file);
        });
      }

      const response = await updateHifziyaHazari(hazari.id, formDataToSend);
      console.log("✅ Update response:", response);

      toast.success("حاضری راپور په بریالیتوب سره تازه شو");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("❌ Update failed:", error);
      console.error("Error response:", error.response?.data);

      const errorMsg =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Unknown error";

      toast.error("تازه کول ناکام شو: " + errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 2,
        }}
      >
        <Box>
          <Box
            sx={{ fontFamily: "B Nazanin", fontWeight: "bold", fontSize: 20 }}
          >
            ویرایش کتاب حاضری
          </Box>
          {hazari && (
            <Chip
              label={`ID: ${hazari.id}`}
              size="small"
              sx={{ mt: 1 }}
              color="primary"
              variant="outlined"
            />
          )}
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent dividers sx={{ py: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* LEFT SIDE - File Upload Section */}
            <Grid item xs={12} sm={4}>
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
                    width: 144,
                    height: 144,
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
                    sx={{ fontSize: 32, color: "text.secondary" }}
                  />
                  <Box sx={{ mt: 1, color: "text.secondary", fontSize: 12 }}>
                    نوي فایلونه اضافه کړئ
                  </Box>
                  <Box
                    sx={{
                      mt: 0.5,
                      color: "primary.main",
                      fontSize: 11,
                      fontWeight: "bold",
                    }}
                  >
                    {formData.newFiles.length} نوی
                  </Box>
                  <input
                    type="file"
                    hidden
                    multiple
                    onChange={handleFileChange}
                  />
                </Box>

                {/* Existing Files Info */}
                {existingFiles.length > 0 && (
                  <Box
                    sx={{
                      textAlign: "center",
                      p: 1.5,
                      bgcolor: "info.lighter",
                      borderRadius: 1,
                      width: "100%",
                    }}
                  >
                    <Typography variant="caption" sx={{ color: "info.dark" }}>
                      موجوده فایلونه: {existingFiles.length}
                    </Typography>
                  </Box>
                )}

                {/* New Files List */}
                {formData.newFiles.length > 0 && (
                  <Box
                    sx={{ width: "100%", maxHeight: 150, overflowY: "auto" }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: "bold", mb: 1, display: "block" }}
                    >
                      نوي فایلونه:
                    </Typography>
                    <Stack spacing={0.5}>
                      {formData.newFiles.map((file, index) => (
                        <Chip
                          key={index}
                          label={file.name}
                          onDelete={() => handleRemoveNewFile(index)}
                          deleteIcon={<DeleteIcon />}
                          size="small"
                          color="success"
                          sx={{
                            justifyContent: "space-between",
                            "& .MuiChip-label": {
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: 120,
                            },
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>
                )}

                <Typography
                  variant="caption"
                  color="text.secondary"
                  textAlign="center"
                >
                  Allowed *.jpeg, *.jpg, *.png, *.pdf
                  <br />
                  max size of 5 MB
                  <br />
                  <span style={{ color: "red", fontSize: 10 }}>
                    ⚠ نوي فایلونه زاړه فایلونه بدلوي
                  </span>
                </Typography>
              </Box>
            </Grid>

            {/* RIGHT SIDE - Form Fields */}
            <Grid item xs={12} sm={8}>
              <Grid container spacing={2.5}>
                {/* Record Type */}
                <Grid item xs={12} sm={6}>
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
                <Grid item xs={12} sm={6}>
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
                      {types.map((type) => (
                        <MenuItem key={type.id} value={type.id}>
                          {type.name}
                        </MenuItem>
                      ))}
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
                    <InputLabel>زیر نوعیت</InputLabel>
                    <Select
                      name="subType"
                      value={formData.subType}
                      onChange={handleInputChange}
                      label="زیر نوعیت"
                    >
                      {subTypes.length === 0 ? (
                        <MenuItem disabled>
                          {formData.type
                            ? "Loading..."
                            : "لطفاً اول نوعیت انتخاب کنید"}
                        </MenuItem>
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
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    type="date"
                    name="year"
                    label="سال"
                    InputLabelProps={{ shrink: true }}
                    value={formData.year}
                    onChange={handleInputChange}
                    required
                    error={!formData.year}
                  />
                </Grid>

                {/* Org */}
                <Grid item xs={12} sm={6}>
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
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={isSubmitting}
          sx={{ textTransform: "none" }}
        >
          لغوه
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting}
          startIcon={
            isSubmitting ? <CircularProgress size={18} /> : <SaveIcon />
          }
          sx={{
            bgcolor: "black",
            "&:hover": { bgcolor: "#1d252e" },
            textTransform: "none",
          }}
        >
          {isSubmitting ? "ذخیره کیږي..." : "ذخیره تغییرات"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
