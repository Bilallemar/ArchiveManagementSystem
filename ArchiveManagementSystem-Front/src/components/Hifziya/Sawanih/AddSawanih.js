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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { createSawanih } from "../../../services/RepositoryManagement/SawanihAPI";
import SaveIcon from "@mui/icons-material/Save";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../../../services/api";

export default function AddSawanih() {
  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    qaidWarida: "",
    incommingDate: "",
    outgoingDate: "",
    org: "",
    description: "",
    pageQuantity: "",
    files: [],
  });

  const [orgs, setOrgs] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/org").then((res) => setOrgs(res.data));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

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
      formData.files.forEach((f) => fd.append("fileURL", f));

      await createSawanih(fd);
      toast.success("ریکارډ په بریالیتوب سره ثبت شو");
      navigate("/sawanih");
    } catch (e) {
      toast.error("ثبت ناکام شو");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/sawanih")}
          sx={{ color: "text.secondary" }}
        >
          بیرته
        </Button>
        <Typography
          variant="h4"
          sx={{ fontFamily: "B Nazanin", fontWeight: "bold" }}
        >
          د نوي سوانح اضافه کول
        </Typography>
      </Box>

      <Card sx={{ maxWidth: 1200, mx: "auto" }}>
        <CardContent sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="نوم"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="د پلار نوم"
                      name="fatherName"
                      value={formData.fatherName}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="قید واریده"
                      name="qaidWarida"
                      value={formData.qaidWarida}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth required>
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
                      type="date"
                      name="incommingDate"
                      label="تاریخ وارده"
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
                      label="تاریخ صادره"
                      InputLabelProps={{ shrink: true }}
                      value={formData.outgoingDate}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
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
                        onClick={() => navigate("/sawanih")}
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
