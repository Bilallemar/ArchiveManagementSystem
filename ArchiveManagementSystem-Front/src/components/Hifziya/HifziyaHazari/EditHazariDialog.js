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
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-hot-toast";
import { updateHifziyaHazari } from "../../../services/RepositoryManagement/HifziyaHazariAPI";
import api from "../../../services/api";
import { useTranslation } from "react-i18next";
import getAddHazariTexts from "../../../helpers/hifziya/hazari/AddHazariText";

export default function EditHazariDialog({ open, onClose, hazari, onSuccess }) {
  const { t } = useTranslation("addHazari");
  const text = getAddHazariTexts(t);

  const [formData, setFormData] = useState({
    volume: "",
    type: "",
    subType: "",
    year: "",
    org: "",
    description: "",
    newFiles: [], // only new files to upload
  });

  const [types, setTypes] = useState([]);
  const [subTypes, setSubTypes] = useState([]);
  const [orgs, setOrgs] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingFiles, setExistingFiles] = useState([]);

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
        toast.error(text.loadError || "د معلوماتو لوستلو کې ستونزه");
      }
    };
    loadData();
  }, [text.loadError]);

  // Populate form & existing files when hazari changes
  useEffect(() => {
    if (hazari && open) {
      const formattedYear = hazari.year
        ? new Date(hazari.year).toISOString().split("T")[0]
        : "";

      setFormData({
        volume: hazari.volume || "",
        type: hazari.type?.id || "",
        subType: hazari.subType?.id || "",
        year: formattedYear,
        org: hazari.org?.id || "",
        description: hazari.description || "",
        newFiles: [],
      });

      setExistingFiles(hazari.files || []);
    }
  }, [hazari, open]);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      newFiles: [...prev.newFiles, ...selectedFiles],
    }));
  };

  const handleRemoveNewFile = (index) => {
    setFormData((prev) => ({
      ...prev,
      newFiles: prev.newFiles.filter((_, i) => i !== index),
    }));
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
        isIndraj: hazari.isIndraj, // ← taken from record, not changeable
      };

      fd.append("hifziyaHazari", JSON.stringify(payload));

      // Append new files only
      formData.newFiles.forEach((file) => fd.append("fileURL", file));

      await updateHifziyaHazari(hazari.id, fd);
      toast.success(text.edit.updateSuccess || "معلومات په بریالیتوب تازه شول");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Update failed:", error);
      toast.error(text.edit.updateError || "د تازه کولو کې ستونزه");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show current type as read-only info (Indraj or Hazari)
  const recordTypeLabel = hazari?.isIndraj
    ? text.indraj || "اندراج"
    : text.hazari || "حاضري";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
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
          <Typography variant="h6" fontWeight="bold">
            {text.title || "د حاضري اصلاح"}
          </Typography>
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

      {/* Read-only Type Info */}
      <Alert severity="info" sx={{ mx: 3, mt: 2 }} icon={false}>
        <Typography variant="body1">
          <strong>{text.recordType || "ډول"}:</strong> {recordTypeLabel}
        </Typography>
      </Alert>

      <DialogContent dividers sx={{ py: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* LEFT: File Upload Section */}
            <Grid item xs={12} md={4}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* File Upload Area */}
                <Box
                  sx={{
                    width: 144,
                    height: 144,
                    borderRadius: "50%",
                    border: "2px dashed",
                    borderColor: "divider",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "background.neutral",
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: "action.hover",
                      borderColor: "primary.main",
                    },
                  }}
                  component="label"
                >
                  <AttachFileIcon
                    sx={{ fontSize: 40, color: "primary.main" }}
                  />
                  <Typography
                    sx={{ mt: 1, color: "text.secondary", fontSize: 12 }}
                  >
                    نوي فایل اپلوډ
                  </Typography>
                  <Typography
                    sx={{
                      mt: 0.5,
                      color: "primary.main",
                      fontSize: 11,
                      fontWeight: "bold",
                    }}
                  >
                    {formData.newFiles.length} نوی
                  </Typography>
                  <input
                    type="file"
                    hidden
                    multiple
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
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
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ color: "info.dark", fontWeight: "bold" }}
                    >
                      موجوده فایلونه: {existingFiles.length}
                    </Typography>
                  </Box>
                )}

                {/* New Files List */}
                {formData.newFiles.length > 0 && (
                  <Box sx={{ maxHeight: 150, overflowY: "auto" }}>
                    <Typography
                      variant="caption"
                      fontWeight="bold"
                      sx={{ mb: 1, display: "block" }}
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
                  Allowed: PNG, JPG, PDF, DOCX
                  <br />
                  Max 10MB per file
                </Typography>
              </Box>
            </Grid>

            {/* RIGHT: Form Fields */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={2.5}>
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
                {/* Type */}
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
              </Grid>
            </Grid>
          </Grid>
        </form>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ px: 3, py: 2, gap: 2 }}>
        <Button onClick={onClose} variant="outlined" disabled={isSubmitting}>
          {text.cancel || "لغوه"}
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting}
          endIcon={isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
          sx={{
            bgcolor: "black",
            "&:hover": { bgcolor: "#1d252e" },
          }}
        >
          {isSubmitting
            ? text.saving || "په ساتلو کې..."
            : text.save || "تغییرات خوندي کړئ"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
