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
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  getHifziyaWaradaSaderaById,
  updateHifziyaWaradaSadera,
} from "../../../services/RepositoryManagement/HifziyaWaradaSaderaAPI";
import React, { useState, useEffect } from "react";
import PageBreadcrumbs from "../../Breadcrumbs/PageBreadcrumbs";
import SaveIcon from "@mui/icons-material/Save";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import api from "../../../services/api";

export default function EditHifziyaWaradaSaderaDialog({
  open,
  onClose,
  waradaSadara,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    no: "",
    org: "",
    letterNumber: "",
    incommingDate: "",
    outgoingDate: "",
    summary: "",
    description: "",
    isHifziya: true,
    newFiles: [],
  });

  const [orgs, setOrgs] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [existingFiles, setExistingFiles] = useState([]);

  // Load orgs and existing data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [orgsRes] = await Promise.all([api.get("/org")]);

        setOrgs(orgsRes.data);
      } catch (error) {
        console.error("Failed to load data", error);
        toast.error("د معلوماتو لوډولو کې ستونزه");
      }
    };
    loadData();
  }, []);
  useEffect(() => {
    if (open && waradaSadara) {
      const formattedIncoming = waradaSadara.incommingDate
        ? new Date(waradaSadara.incommingDate).toISOString().split("T")[0]
        : "";

      const formattedOutgoing = waradaSadara.outgoingDate
        ? new Date(waradaSadara.outgoingDate).toISOString().split("T")[0]
        : "";

      setFormData({
        no: waradaSadara.no || "",
        org: waradaSadara.org?.id || "",
        letterNumber: waradaSadara.letterNumber || "",
        incommingDate: formattedIncoming,
        outgoingDate: formattedOutgoing,
        summary: waradaSadara.summary || "",
        description: waradaSadara.description || "",
        isHifziya: waradaSadara.isHifziya ?? true,
        newFiles: [],
      });

      if (waradaSadara.files && waradaSadara.files.length > 0) {
        setExistingFiles(waradaSadara.files);
      } else {
        setExistingFiles([]);
      }
    }
  }, [open, waradaSadara]);

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

    const requiredFields = ["org"];
    const missingFields = requiredFields.filter((field) => !formData[field]);
    if (missingFields.length > 0) {
      toast.error("لطفاً تمام فیلدهای ضروری را پر کنید");
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataToSend = new FormData();

      const waradaAndSadaraData = {
        no: formData.no,
        org: { id: formData.org },
        letterNumber: formData.letterNumber,
        incommingDate: formData.incommingDate,
        outgoingDate: formData.outgoingDate,
        summary: formData.summary,
        description: formData.description,
        isHifziya: formData.isHifziya,
      };

      formDataToSend.append(
        "hifziyaWaradaSadera",
        JSON.stringify(waradaAndSadaraData)
      );

      // Only append file if a new one is selected
      if (formData.newFiles.length > 0) {
        formData.newFiles.forEach((file, index) => {
          console.log(`📎 Appending file ${index + 1}:`, file.name);
          formDataToSend.append("fileURL", file);
        });
      }

      const response = await updateHifziyaWaradaSadera(
        waradaSadara.id,
        formDataToSend
      );
      console.log("✅ Update response:", response);

      toast.success("وارده او صادره راپور په بریالیتوب سره تازه شو");
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
            ویرایش کتاب وارده و صادره
          </Box>
          {waradaSadara && (
            <Chip
              label={`ID: ${waradaSadara.id}`}
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

            <Grid item xs={12} sm={8}>
              <Grid container spacing={2.5}>
                {/* Record Type */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>د ریکارډ ډول</InputLabel>
                    <Select
                      name="isHifziya"
                      value={String(formData.isHifziya)}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          isHifziya: e.target.value === "true",
                        }))
                      }
                    >
                      <MenuItem value="true">حفظیه</MenuItem>
                      <MenuItem value="false">مخزن</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="no"
                    type="number"
                    InputLabelProps={{ shrink: true }}
                    label="تمبر"
                    variant="outlined"
                    value={formData.no}
                    onChange={handleInputChange}
                    InputProps={{ sx: { height: 60 } }}
                    required
                    error={!formData.no}
                    helperText={!formData.no ? "این فیلد ضروری است" : ""}
                  />
                </Grid>

                {/* Org Dropdown */}
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

                {/* Letter Number */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="letterNumber"
                    InputLabelProps={{ shrink: true }}
                    label="شماره مکتوب"
                    variant="outlined"
                    value={formData.letterNumber}
                    onChange={handleInputChange}
                    InputProps={{ sx: { height: 60 } }}
                    required
                    error={!formData.letterNumber}
                    helperText={
                      !formData.letterNumber ? "این فیلد ضروری است" : ""
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="incommingDate"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    label="تاریخ مرسل"
                    variant="outlined"
                    value={formData.incommingDate}
                    onChange={handleInputChange}
                    InputProps={{ sx: { height: 60 } }}
                    required
                    error={!formData.incommingDate}
                    helperText={
                      !formData.incommingDate ? "این فیلد ضروری است" : ""
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="outgoingDate"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    label="تاریخ مرسل الیه"
                    variant="outlined"
                    value={formData.outgoingDate}
                    onChange={handleInputChange}
                    InputProps={{ sx: { height: 60 } }}
                    required
                    error={!formData.outgoingDate}
                    helperText={
                      !formData.outgoingDate ? "این فیلد ضروری است" : ""
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="summary"
                    InputLabelProps={{ shrink: true }}
                    label="خلص مطلب"
                    variant="outlined"
                    value={formData.summary}
                    onChange={handleInputChange}
                    InputProps={{ sx: { height: 60 } }}
                    required
                    error={!formData.summary}
                    helperText={!formData.summary ? "این فیلد ضروری است" : ""}
                  />
                </Grid>

                {/* Description */}
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
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      {/* Submit Button */}
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
