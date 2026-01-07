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
import { createHifziyaWaradaSadera } from "../../../services/RepositoryManagement/HifziyaWaradaSaderaAPI";
import SaveIcon from "@mui/icons-material/Save";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
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

      <Card sx={{ maxWidth: 1200, mx: "auto" }}>
        <CardContent sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* File upload */}
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
                      width: 200,
                      height: 200,
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
                      sx={{ fontSize: 40, color: "text.secondary" }}
                    />
                    <Box sx={{ mt: 1, color: "text.secondary", fontSize: 14 }}>
                      فایلونه پورته کړئ
                    </Box>
                    <Box
                      sx={{
                        mt: 0.5,
                        color: "primary.main",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      {formData.files.length} فایل غوره شوي
                    </Box>
                    <input
                      type="file"
                      hidden
                      multiple
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                  </Box>

                  {/* Selected Files List */}
                  {formData.files.length > 0 && (
                    <Box
                      sx={{ width: "100%", maxHeight: 250, overflowY: "auto" }}
                    >
                      <Stack spacing={1}>
                        {formData.files.map((file, index) => (
                          <Chip
                            key={index}
                            label={file.name}
                            onDelete={() => handleRemoveFile(index)}
                            deleteIcon={<DeleteIcon />}
                            size="small"
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
                  )}

                  <Typography variant="caption" color="text.secondary">
                    Allowed *.jpeg, *.jpg, *.png, *.pdf
                    <br />
                    max size of 5 MB each
                  </Typography>
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
