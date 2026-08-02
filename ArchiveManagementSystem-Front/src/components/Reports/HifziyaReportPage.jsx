import DownloadIcon from "@mui/icons-material/Download";
import SearchIcon from "@mui/icons-material/Search";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";

const FIELD_HEIGHT = 40;

export default function HifziyaReportPage() {
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");

  const [reportData, setReportData] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const buildParams = () => ({
    yearFrom: yearFrom || undefined,
    yearTo: yearTo || undefined,
  });

  const handleSearch = async () => {
    try {
      setLoadingPreview(true);
      setHasSearched(true);
      const response = await api.get("/reports/hifziya/preview", {
        params: buildParams(),
      });
      setReportData(response.data);
    } catch (err) {
      console.error("Report preview error:", err);
      toast.error("د معلوماتو په راخیستلو کې ستونزه رامنځته شوه");
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleReset = () => {
    setYearFrom("");
    setYearTo("");
    setReportData(null);
    setHasSearched(false);
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const response = await api.get("/reports/hifziya", {
        params: buildParams(),
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "hifziya-report.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("راپور ډاونلوډ شو");
    } catch (err) {
      console.error("Report download error:", err);
      toast.error("د راپور جوړولو کې ستونزه رامنځته شوه");
    } finally {
      setDownloading(false);
    }
  };

  const grandTotal = reportData?.grandTotal ?? 0;

  return (
    <Box sx={{ p: 2, maxWidth: 1000, mx: "auto" }} dir="rtl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          د حفظیه راپور
        </Typography>
      </Box>

      <Card
        sx={{
          borderRadius: 2,
          mb: 3,
          boxShadow:
            "0px 4px 15px rgba(0,0,0,0.07), 0px 8px 10px rgba(0,0,0,0.04)",
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                type="number"
                label="د کال نه"
                value={yearFrom}
                onChange={(e) => setYearFrom(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                type="number"
                label="تر کال پورې"
                value={yearTo}
                onChange={(e) => setYearTo(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="contained"
                fullWidth
                startIcon={
                  loadingPreview ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    <SearchIcon />
                  )
                }
                onClick={handleSearch}
                disabled={loadingPreview}
                sx={{
                  height: FIELD_HEIGHT,
                  bgcolor: "#2196F3",
                  "&:hover": { bgcolor: "#1e88e5" },
                }}
              >
                {loadingPreview ? "روان دی..." : "لټون"}
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  gap: 2,
                  mt: 1,
                }}
              >
                {hasSearched && (
                  <Button
                    variant="outlined"
                    onClick={handleReset}
                    disabled={loadingPreview}
                    sx={{ height: FIELD_HEIGHT }}
                  >
                    پاکول
                  </Button>
                )}

                <Button
                  variant="outlined"
                  startIcon={
                    downloading ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : (
                      <DownloadIcon />
                    )
                  }
                  onClick={handleDownload}
                  disabled={downloading || !hasSearched || grandTotal === 0}
                  sx={{ height: FIELD_HEIGHT }}
                >
                  {downloading ? "روان دی..." : "راپور ډاونلوډ کړئ"}
                </Button>
              </Box>
            </Grid>

            {reportData && (
              <Grid item xs={12}>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
                  <Chip size="small" label={`ټول: ${grandTotal}`} />
                  <Chip
                    size="small"
                    variant="outlined"
                    label={`سوانح: ${reportData.totalSawanih}`}
                  />
                  <Chip
                    size="small"
                    variant="outlined"
                    label={`حضري: ${reportData.totalHazari}`}
                  />
                  <Chip
                    size="small"
                    variant="outlined"
                    label={`انداج: ${reportData.totalIndraj}`}
                  />
                  <Chip
                    size="small"
                    color="success"
                    variant="outlined"
                    label={`واردات: ${reportData.totalWaradaSaderaIncoming}`}
                  />
                  <Chip
                    size="small"
                    color="info"
                    variant="outlined"
                    label={`صادرات: ${reportData.totalWaradaSaderaOutgoing}`}
                  />
                </Box>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      {hasSearched &&
        !loadingPreview &&
        (grandTotal === 0 ? (
          <Alert severity="warning">
            د دې فلټر پر بنسټ هېڅ سند ونه موندل شو
          </Alert>
        ) : (
          <Alert severity="success">
            راپور چمتو دی — د ډاونلوډ تڼۍ کېکاږئ ترڅو د لنډیز راپور فایل ترلاسه
            کړئ
          </Alert>
        ))}
    </Box>
  );
}
