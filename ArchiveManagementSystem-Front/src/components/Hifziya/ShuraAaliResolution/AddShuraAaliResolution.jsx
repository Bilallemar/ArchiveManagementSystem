import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

import getShuraAaliResolutionTexts from "../../../helpers/hifziya/ShuraAaliResolutionTexts";
import { createShuraAaliResolution } from "../../../services/RepositoryManagement/shuraAaliResolutionApi";
import HijriDatePicker from "../../HijriDatePicker";
export default function AddShuraAaliResolution() {
  const { t } = useTranslation("shuraAali");
  const navigate = useNavigate();
  const texts = getShuraAaliResolutionTexts(t);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialType = searchParams.get("type") || "MOSAWABA";

  const validType = ["MOSAWABA", "YADASHT"].includes(initialType)
    ? initialType
    : "MOSAWABA";

  const [form, setForm] = useState({
    sendDate: "",
    subject: "",
    senderReference: "",
    title: "",
    resolutionType: "",
    direction: validType,
    letterNumber: "",
    resolutionNo: "",
    approvalYear: "",
    remarks: "",
  });

  const [saving, setSaving] = useState(false);
  const pageTitle =
    validType === "MOSAWABA"
      ? texts.newMusawaba || "نوې مصوبه"
      : texts.newYadasht || "نوې  یاداشت";
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleHijriDateChange = (field) => (hijriDate) => {
    setForm((prev) => ({
      ...prev,
      [field]: hijriDate,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    if (!form.subject?.trim()) {
      toast.error(texts.subjectRequired);
      setSaving(false);
      return;
    }

    try {
      await createShuraAaliResolution(form);
      toast.success(texts.created);
      navigate("/shura-aali-resolutions");
    } catch (err) {
      toast.error(texts.createFailed);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: "auto" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
          {texts.back}
        </Button>
        <Typography variant="h4" fontWeight="bold">
          {pageTitle}
        </Typography>
      </Box>

      {/* <PageBreadcrumbs /> */}

      <Card
        sx={{
          borderRadius: 2,
          boxShadow:
            "0px 4px 15px rgba(0,0,0,0.07), 0px 8px 10px rgba(0,0,0,0.04)",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <HijriDatePicker
                  fullWidth
                  label={texts.sendDate}
                  name="sendDate"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={form.sendDate}
                  onChange={handleHijriDateChange("sendDate")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label={texts.subject}
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  error={!form.subject?.trim()}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={texts.senderReference}
                  name="senderReference"
                  value={form.senderReference}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={texts.title}
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={validType === "MOSAWABA" ? "نوع مصوبه" : "نوع یاداشت"}
                  name="resolutionType"
                  value={form.resolutionType}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={texts.letterNumber}
                  name="letterNumber"
                  value={form.letterNumber}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={
                    validType === "MOSAWABA"
                      ? texts.resolutionNo
                      : texts.yadashtNo
                  }
                  name="resolutionNo"
                  value={form.resolutionNo}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={texts.approvalYear}
                  name="approvalYear"
                  type="number"
                  value={form.approvalYear}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  minRows={4}
                  label={texts.remarks}
                  name="remarks"
                  value={form.remarks}
                  onChange={handleChange}
                  placeholder={texts.remarksPlaceholder}
                  sx={{
                    "& .MuiInputBase-root": {
                      height: 100,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                    mt: 2,
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => navigate(-1)}
                    disabled={saving}
                  >
                    {texts.cancel}
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={saving}
                    endIcon={
                      saving ? <CircularProgress size={20} /> : <SaveIcon />
                    }
                  >
                    {saving ? texts.saving : texts.save}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
