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
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
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
  });

  const [orgs, setOrgs] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load organizations
  useEffect(() => {
    const loadData = async () => {
      try {
        const orgsRes = await api.get("/org");
        setOrgs(orgsRes.data);
      } catch (error) {
        console.error("Failed to load orgs", error);
        toast.error("د معلوماتو لوډولو کې ستونزه");
      }
    };
    loadData();
  }, []);

  // Populate form when sawanih changes
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
      });
    }
  }, [sawanih]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const requiredFields = ["name", "org"];
    const missingFields = requiredFields.filter((field) => !formData[field]);
    if (missingFields.length > 0) {
      toast.error("لطفاً تمام فیلدهای ضروری را پر کنید");
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataToSend = new FormData();

      const sawanihData = {
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

      formDataToSend.append("Sawanih", JSON.stringify(sawanihData));

      await updateSawanih(sawanih.id, formDataToSend);
      toast.success("ریکارډ په بریالیتوب سره تازه شو");
      onSuccess(); // Refresh the list
      onClose(); // Close dialog
    } catch (error) {
      console.error("Failed to update record", error);
      toast.error(
        "تازه کول ناکام شو: " + (error.response?.data?.message || error.message)
      );
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
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 2,
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Box sx={{ fontFamily: "B Nazanin", fontWeight: "bold", fontSize: 20 }}>
          ویرایش سوانح
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {sawanih && (
          <Alert severity="info" sx={{ mb: 2 }}>
            د ریکارډ شمیره: {sawanih.id}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="name"
                label="نوم"
                variant="outlined"
                value={formData.name}
                onChange={handleInputChange}
                required
                error={!formData.name}
                helperText={!formData.name ? "این فیلد ضروری است" : ""}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="fatherName"
                label="د پلار نوم"
                variant="outlined"
                value={formData.fatherName}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="qaidWarida"
                label="قید واریده"
                variant="outlined"
                value={formData.qaidWarida}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!formData.org}>
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

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="incommingDate"
                type="date"
                InputLabelProps={{ shrink: true }}
                label="تاریخ وارده"
                variant="outlined"
                value={formData.incommingDate}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="outgoingDate"
                type="date"
                InputLabelProps={{ shrink: true }}
                label="تاریخ صادره"
                variant="outlined"
                value={formData.outgoingDate}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="pageQuantity"
                type="number"
                label="تعداد صفحات"
                variant="outlined"
                value={formData.pageQuantity}
                onChange={handleInputChange}
              />
            </Grid>

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
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: "1px solid #e0e0e0",
          gap: 1,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={isSubmitting}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
          }}
        >
          لغوه
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting}
          startIcon={
            isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />
          }
          sx={{
            backgroundColor: "black",
            color: "white",
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: "#1d252e",
            },
            textTransform: "none",
          }}
        >
          {isSubmitting ? "در حال ذخیره..." : "ذخیره تغییرات"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
