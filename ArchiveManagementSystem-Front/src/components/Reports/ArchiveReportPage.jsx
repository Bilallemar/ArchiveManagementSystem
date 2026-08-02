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
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  TextField,
} from "@mui/material";

import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { convertHijriToGregorian } from "../../utils/hijriDateUtils";
import { getQuarterDateRange, QUARTER_OPTIONS } from "../../utils/quarterUtils";
import HijriDatePicker from "../HijriDatePicker";

const DIRECTION_LABELS = {
  INCOMING: "واردات",
  OUTGOING: "صادرات",
};

const FIELD_HEIGHT = 40;

export default function ArchiveReportPage() {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [direction, setDirection] = useState("");
  const [filterMode, setFilterMode] = useState("range");
  const [quarterYear, setQuarterYear] = useState(new Date().getFullYear());
  const [quarter, setQuarter] = useState(1);
  const [reportData, setReportData] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleHijriDateChange = (setter) => (hijriDate) => {
    setter(hijriDate);
  };

  const buildParams = () => {
    if (filterMode === "quarter") {
      const { dateFrom: qFrom, dateTo: qTo } = getQuarterDateRange(
        quarterYear,
        quarter,
      );
      return {
        dateFrom: qFrom,
        dateTo: qTo,
        direction: direction || undefined,
      };
    }
    return {
      dateFrom: dateFrom ? convertHijriToGregorian(dateFrom) : undefined,
      dateTo: dateTo ? convertHijriToGregorian(dateTo) : undefined,
      direction: direction || undefined,
    };
  };
  const handleSearch = async () => {
    try {
      setLoadingPreview(true);
      setHasSearched(true);
      const response = await api.get("/reports/archive/preview", {
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
    setDateFrom("");
    setDateTo("");
    setDirection("");
    setReportData(null);
    setHasSearched(false);
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const response = await api.get("/reports/archive", {
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
      link.setAttribute("download", "archive-report.xlsx");
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

  const rows = reportData?.rows ?? [];

  return (
    <Box sx={{ p: 2, maxWidth: 1400, mx: "auto" }} dir="rtl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          د آرشیف راپور
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
            <Grid item xs={12}>
              <ToggleButtonGroup
                size="small"
                value={filterMode}
                exclusive
                onChange={(e, val) => val && setFilterMode(val)}
                sx={{ mb: 2 }}
              >
                <ToggleButton value="range">د نیټې حد</ToggleButton>
                <ToggleButton value="quarter">ربع (Quarterly)</ToggleButton>
              </ToggleButtonGroup>
            </Grid>

            {filterMode === "quarter" ? (
              <>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    label="کال"
                    value={quarterYear}
                    onChange={(e) => setQuarterYear(Number(e.target.value))}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>ربع</InputLabel>
                    <Select
                      value={quarter}
                      label="ربع"
                      onChange={(e) => setQuarter(Number(e.target.value))}
                    >
                      {QUARTER_OPTIONS.map((q) => (
                        <MenuItem key={q.value} value={q.value}>
                          {q.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={12} sm={6} md={3}>
                  <HijriDatePicker
                    fullWidth
                    size="small"
                    name="dateFrom"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    label="د پیل نیټه"
                    value={dateFrom}
                    onChange={handleHijriDateChange(setDateFrom)}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <HijriDatePicker
                    fullWidth
                    size="small"
                    name="dateTo"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    label="د پای نیټه"
                    value={dateTo}
                    onChange={handleHijriDateChange(setDateTo)}
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>سمت</InputLabel>
                <Select
                  value={direction}
                  onChange={(e) => setDirection(e.target.value)}
                  label="سمت"
                >
                  <MenuItem value="">ټول</MenuItem>
                  <MenuItem value="INCOMING">واردات</MenuItem>
                  <MenuItem value="OUTGOING">صادرات</MenuItem>
                </Select>
              </FormControl>
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
                  disabled={downloading || !hasSearched || rows.length === 0}
                  sx={{ height: FIELD_HEIGHT }}
                >
                  {downloading ? "روان دی..." : "راپور ډاونلوډ کړئ"}
                </Button>
              </Box>
            </Grid>

            {reportData && (
              <Grid item xs={12}>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
                  <Chip size="small" label={`ټول اسناد: ${reportData.total}`} />
                  <Chip
                    size="small"
                    color="success"
                    variant="outlined"
                    label={`واردات: ${reportData.totalIncoming}`}
                  />
                  <Chip
                    size="small"
                    color="info"
                    variant="outlined"
                    label={`صادرات: ${reportData.totalOutgoing}`}
                  />
                </Box>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 2, overflow: "hidden" }}>
        {!hasSearched ? (
          <Alert severity="info" sx={{ borderRadius: 0 }}>
            د نیټې یا سمت فلټر وټاکئ او د "لټون" تڼۍ کېکاږئ
          </Alert>
        ) : loadingPreview ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
            <CircularProgress size={28} />
          </Box>
        ) : rows.length === 0 ? (
          <Alert severity="warning" sx={{ borderRadius: 0 }}>
            د دې فلټر پر بنسټ هېڅ سند ونه موندل شو
          </Alert>
        ) : (
          <TableContainer component={Paper} elevation={0}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "grey.100" }}>
                  <TableCell align="right">#</TableCell>
                  <TableCell align="right">د لیک شمېره</TableCell>
                  <TableCell align="right">مرسل</TableCell>
                  <TableCell align="right">مرسل الیه</TableCell>
                  <TableCell align="right">نوعیت</TableCell>
                  <TableCell align="right">سمت</TableCell>
                  <TableCell align="right">د ارسال نیټه</TableCell>
                  <TableCell align="right">ملاحظات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell align="right">{idx + 1}</TableCell>
                    <TableCell align="right">{row.docNo}</TableCell>
                    <TableCell align="right">{row.senderOrgName}</TableCell>
                    <TableCell align="right">{row.receiverOrgName}</TableCell>
                    <TableCell align="right">{row.docTypeName}</TableCell>
                    <TableCell align="right">
                      <Chip
                        size="small"
                        label={DIRECTION_LABELS[row.direction] ?? row.direction}
                        color={
                          row.direction?.toUpperCase().includes("INCOMING")
                            ? "success"
                            : "info"
                        }
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">{row.sendDate ?? "-"}</TableCell>
                    <TableCell align="right">
                      {row.description || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>
    </Box>
  );
}
