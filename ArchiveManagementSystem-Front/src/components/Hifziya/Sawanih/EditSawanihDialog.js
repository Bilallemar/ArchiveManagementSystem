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
import { updateSawanih } from "../../../services/RepositoryManagement/SawanihAPI";
import api from "../../../services/api";

export default function EditSawanihDialog({
  open,
  onClose,
  sawanih,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    qaidWarida: "",
    incommingDate: "",
    outgoingDate: "",
    org: "",
    description: "",
    pageQuantity: "",
    newFiles: [],
  });

  const [orgs, setOrgs] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingFiles, setExistingFiles] = useState([]);

  useEffect(() => {
    api.get("/org").then((res) => setOrgs(res.data));
  }, []);

  useEffect(() => {
    if (sawanih) {
      setFormData({
        name: sawanih.name || "",
        fatherName: sawanih.fatherName || "",
        qaidWarida: sawanih.qaidWarida || "",
        incommingDate: sawanih.incommingDate || "",
        outgoingDate: sawanih.outgoingDate || "",
        org: sawanih.org?.id || "",
        description: sawanih.description || "",
        pageQuantity: sawanih.pageQuantity || "",
        newFiles: [],
      });
      setExistingFiles(sawanih.files || []);
    }
  }, [sawanih]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((p) => ({
      ...p,
      newFiles: [...p.newFiles, ...Array.from(e.target.files)],
    }));
  };

  const handleRemoveNewFile = (index) => {
    setFormData((p) => ({
      ...p,
      newFiles: p.newFiles.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const fd = new FormData();
      const payload = {
        name: formData.name,
        fatherName: formData.fatherName,
        qaidWarida: formData.qaidWarida,
        incommingDate: formData.incommingDate,
        outgoingDate: formData.outgoingDate,
        org: { id: formData.org },
        description: formData.description,
        pageQuantity: formData.pageQuantity
          ? parseInt(formData.pageQuantity)
          : null,
      };

      fd.append("Sawanih", JSON.stringify(payload));
      formData.newFiles.forEach((f) => fd.append("fileURL", f));

      await updateSawanih(sawanih.id, fd);
      toast.success("ریکارډ په بریالیتوب سره تازه شو");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("تازه کول ناکام شو");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Box
            sx={{ fontFamily: "B Nazanin", fontWeight: "bold", fontSize: 20 }}
          >
            ویرایش سوانح
          </Box>
          {sawanih && (
            <Chip
              label={`ID: ${sawanih.id}`}
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
        <Grid container spacing={3}>
          <Grid item xs={12} sm={8}>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="نوم"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="د پلار نوم"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="قید واریده"
                  name="qaidWarida"
                  value={formData.qaidWarida}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small" required>
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
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  name="incommingDate"
                  label="تاریخ وارده"
                  InputLabelProps={{ shrink: true }}
                  value={formData.incommingDate}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  name="outgoingDate"
                  label="تاریخ صادره"
                  InputLabelProps={{ shrink: true }}
                  value={formData.outgoingDate}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="تعداد صفحات"
                  name="pageQuantity"
                  value={formData.pageQuantity}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  multiline
                  rows={3}
                  label="ملاحظات"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button onClick={onClose} variant="outlined" disabled={isSubmitting}>
          لغوه
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting}
          startIcon={
            isSubmitting ? <CircularProgress size={18} /> : <SaveIcon />
          }
          sx={{ bgcolor: "black", "&:hover": { bgcolor: "#1d252e" } }}
        >
          {isSubmitting ? "ذخیره کیږي..." : "ذخیره تغییرات"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
