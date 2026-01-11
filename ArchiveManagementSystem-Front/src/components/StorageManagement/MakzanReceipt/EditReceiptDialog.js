import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Grid,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Typography,
  IconButton,
} from "@mui/material";
import { toast } from "react-hot-toast";
import { updateReceipt } from "../../../services/StorageManagement/MakzanReceiptAPI";
import SaveIcon from "@mui/icons-material/Save";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import api from "../../../services/api";

export default function EditReceiptDialog({
  open,
  onClose,
  receipt,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    no: "",
    docNo: "",
    org: "",
    letterNo: "",
    letterDate: "",
    subjectType: "",
    description: "",
    newFiles: [],
  });

  const [orgs, setOrgs] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingFiles, setExistingFiles] = useState([]);

  // Load organizations on mount
  useEffect(() => {
    const loadOrgs = async () => {
      try {
        const response = await api.get("/org");
        setOrgs(response.data);
      } catch (error) {
        console.error("Failed to load organizations:", error);
        toast.error("د ادارو لوډولو کې ستونزه");
      }
    };
    loadOrgs();
  }, []);

  // Populate form when receipt changes
  useEffect(() => {
    if (receipt && open) {
      setFormData({
        no: receipt.no || "",
        docNo: receipt.docNo || "",
        org: receipt.org?.id || "",
        letterNo: receipt.letterNo || "",
        letterDate: receipt.letterDate || "",
        subjectType: receipt.subjectType || "",
        description: receipt.description || "",
        newFiles: [],
      });

      if (receipt.files && receipt.files.length > 0) {
        setExistingFiles(receipt.files);
      } else {
        setExistingFiles([]);
      }
    }
  }, [receipt, open]);

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

    // Validation
    if (!formData.no || !formData.org) {
      toast.error("لطفاً د رسید نمبر او اداره ضروری دي");
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

      if (formData.newFiles.length > 0) {
        formData.newFiles.forEach((file) => {
          formDataToSend.append("fileURL", file);
        });
      }

      await updateReceipt(receipt.id, formDataToSend);
      toast.success("رسید په بریالیتوب سره تازه شو");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to update receipt", error);
      toast.error("تازه کول ناکام شو");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          د مخزن رسید تازه کول
          {receipt?.id && (
            <Chip
              label={`ID: ${receipt.id}`}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ ml: 2 }}
            />
          )}
        </Box>
        <IconButton onClick={handleClose} disabled={isSubmitting}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
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
                    width: 180,
                    height: 180,
                    borderRadius: "50%",
                    border: "2px dashed",
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
                      borderColor: "primary.main",
                    },
                  }}
                  component="label"
                >
                  <AttachFileIcon
                    sx={{ fontSize: 40, color: "text.secondary" }}
                  />
                  <Typography
                    sx={{ mt: 1, color: "text.secondary", fontSize: 13 }}
                  >
                    نوي فایلونه اضافه کړئ
                  </Typography>
                  <Typography
                    sx={{
                      mt: 0.5,
                      color: "primary.main",
                      fontSize: 12,
                      fontWeight: "bold",
                    }}
                  >
                    {formData.newFiles.length} نوي فایلونه
                  </Typography>
                  <input
                    type="file"
                    hidden
                    multiple
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    disabled={isSubmitting}
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
                    <Typography
                      variant="caption"
                      sx={{ color: "info.dark", fontWeight: "bold" }}
                    >
                      موجوده فایلونه: {existingFiles.length}
                    </Typography>
                    <Box sx={{ mt: 1, maxHeight: 100, overflowY: "auto" }}>
                      {existingFiles.map((file, index) => (
                        <Typography
                          key={index}
                          variant="caption"
                          sx={{
                            display: "block",
                            color: "text.secondary",
                            mt: 0.5,
                          }}
                        >
                          📎{" "}
                          {file.filePath?.split("/").pop() ||
                            `فایل ${index + 1}`}
                        </Typography>
                      ))}
                    </Box>
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
                    <Stack spacing={1}>
                      {formData.newFiles.map((file, index) => (
                        <Chip
                          key={index}
                          label={file.name}
                          onDelete={() => handleRemoveNewFile(index)}
                          deleteIcon={<DeleteIcon />}
                          size="small"
                          color="success"
                          disabled={isSubmitting}
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
                  sx={{ fontSize: 10 }}
                >
                  اجازه شوي: PDF, DOC, DOCX, JPG, PNG
                  <br />
                  اعظمي اندازه: 5 MB
                  <br />
                  <span style={{ color: "red" }}>
                    ⚠ نوي فایلونه زاړه فایلونه بدلوي
                  </span>
                </Typography>
              </Box>
            </Grid>

            {/* RIGHT SIDE - Form Fields */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={2.5}>
                {/* Receipt Number */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    name="no"
                    label="د رسید نمبر"
                    value={formData.no}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    error={!formData.no}
                  />
                </Grid>

                {/* Document Number */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    name="docNo"
                    label="د سند نمبر"
                    value={formData.docNo}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
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
                    <InputLabel>اداره</InputLabel>
                    <Select
                      name="org"
                      value={formData.org}
                      onChange={handleInputChange}
                      label="اداره"
                      disabled={isSubmitting}
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
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    name="letterNo"
                    label="د مکتوب نمبر"
                    value={formData.letterNo}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </Grid>

                {/* Letter Date */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    name="letterDate"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    label="د مکتوب نیټه"
                    value={formData.letterDate}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </Grid>

                {/* Subject Type */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    name="subjectType"
                    label="د موضوع ډول"
                    value={formData.subjectType}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
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
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} disabled={isSubmitting}>
          لغوه
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
          {isSubmitting ? "ذخیره کیږي..." : "تازه کول"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
