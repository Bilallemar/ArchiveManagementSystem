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
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";

const DIRECTION_LABELS = {
  INCOMING: "وارده",
  OUTGOING: "صادره",
};

const FIELD_HEIGHT = 40;

export default function MakhzanReportPage() {
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");

  const [reportData, setReportData] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const buildParams = () => ({
    yearFrom: yearFrom || undefined,
    yearTo: yearTo || undefined,
  });

  const handleSearch = async () => {
    try {
      setLoadingPreview(true);
      setHasSearched(true);
      const response = await api.get("/reports/makhzan/preview", {
        params: buildParams(),
      });
      setReportData(response.data);
      setActiveTab(0);
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
    setActiveTab(0);
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const response = await api.get("/reports/makhzan", {
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
      link.setAttribute("download", "makhzan-report.xlsx");
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

  const receiptRows = reportData?.receiptRows ?? [];
  const waradaSaderaRows = reportData?.waradaSaderaRows ?? [];
  const annualReportRows = reportData?.annualReportRows ?? [];
  const submissionReportRows = reportData?.submissionReportRows ?? [];
  const grandTotal = reportData?.grandTotal ?? 0;

  const tabRowCounts = [
    receiptRows.length,
    waradaSaderaRows.length,
    annualReportRows.length,
    submissionReportRows.length,
  ];
  const activeRows = [
    receiptRows,
    waradaSaderaRows,
    annualReportRows,
    submissionReportRows,
  ][activeTab];

  return (
    <Box sx={{ p: 2, maxWidth: 1400, mx: "auto" }} dir="rtl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          د مخزن راپور
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
                name="yearFrom"
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
                name="yearTo"
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
                  <Chip size="small" label={`ټول اسناد: ${grandTotal}`} />
                  <Chip
                    size="small"
                    color="success"
                    variant="outlined"
                    label={`وارده: ${reportData.totalWarada}`}
                  />
                  <Chip
                    size="small"
                    color="info"
                    variant="outlined"
                    label={`صادره: ${reportData.totalSadera}`}
                  />
                  <Chip
                    size="small"
                    variant="outlined"
                    label={`رسیدونه: ${reportData.totalReceipts}`}
                  />
                  <Chip
                    size="small"
                    variant="outlined"
                    label={`کلني راپورونه: ${reportData.totalAnnualReports}`}
                  />
                  <Chip
                    size="small"
                    variant="outlined"
                    label={`تسلیمي راپورونه: ${reportData.totalSubmissionReports}`}
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
            د کال حد وټاکئ او د "لټون" تڼۍ کېکاږئ
          </Alert>
        ) : loadingPreview ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
            <CircularProgress size={28} />
          </Box>
        ) : grandTotal === 0 ? (
          <Alert severity="warning" sx={{ borderRadius: 0 }}>
            د دې فلټر پر بنسټ هېڅ سند ونه موندل شو
          </Alert>
        ) : (
          <>
            <Tabs
              value={activeTab}
              onChange={(e, val) => setActiveTab(val)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                bgcolor: "grey.50",
              }}
            >
              <Tab label={`رسیدونه (${tabRowCounts[0]})`} />
              <Tab label={`وارده/صادره (${tabRowCounts[1]})`} />
              <Tab label={`کلني راپورونه (${tabRowCounts[2]})`} />
              <Tab label={`تسلیمي راپورونه (${tabRowCounts[3]})`} />
            </Tabs>

            {activeRows.length === 0 ? (
              <Alert severity="info" sx={{ borderRadius: 0 }}>
                په دې برخه کي هېڅ سند شتون نلري
              </Alert>
            ) : activeTab === 0 ? (
              <TableContainer component={Paper} elevation={0}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: "grey.100" }}>
                      <TableCell align="right">#</TableCell>
                      <TableCell align="right">د سند شمېره</TableCell>
                      <TableCell align="right">دیپارتمنت</TableCell>
                      <TableCell align="right">اداره</TableCell>
                      <TableCell align="right">د لیک شمېره</TableCell>
                      <TableCell align="right">د لیک نیټه</TableCell>
                      <TableCell align="right">نوعیت</TableCell>
                      <TableCell align="right">ملاحظات</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {receiptRows.map((row, idx) => (
                      <TableRow key={idx} hover>
                        <TableCell align="right">{idx + 1}</TableCell>
                        <TableCell align="right">{row.docNo}</TableCell>
                        <TableCell align="right">{row.department}</TableCell>
                        <TableCell align="right">{row.orgName}</TableCell>
                        <TableCell align="right">{row.letterNo}</TableCell>
                        <TableCell align="right">{row.letterDate}</TableCell>
                        <TableCell align="right">{row.subjectType}</TableCell>
                        <TableCell align="right">
                          {row.description || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : activeTab === 1 ? (
              <TableContainer component={Paper} elevation={0}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: "grey.100" }}>
                      <TableCell align="right">#</TableCell>
                      <TableCell align="right">شمېره</TableCell>
                      <TableCell align="right">اداره</TableCell>
                      <TableCell align="right">د لیک شمېره</TableCell>
                      <TableCell align="right">نیټه</TableCell>
                      <TableCell align="right">سمت</TableCell>
                      <TableCell align="right">نوعیت</TableCell>
                      <TableCell align="right">خلاصه</TableCell>
                      <TableCell align="right">ملاحظات</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {waradaSaderaRows.map((row, idx) => (
                      <TableRow key={idx} hover>
                        <TableCell align="right">{idx + 1}</TableCell>
                        <TableCell align="right">{row.no}</TableCell>
                        <TableCell align="right">{row.orgName}</TableCell>
                        <TableCell align="right">{row.letterNumber}</TableCell>
                        <TableCell align="right">{row.date}</TableCell>
                        <TableCell align="right">
                          <Chip
                            size="small"
                            label={
                              DIRECTION_LABELS[row.direction] ?? row.direction
                            }
                            color={
                              row.direction?.toUpperCase().includes("INCOMING")
                                ? "success"
                                : "info"
                            }
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="right">{row.subjectType}</TableCell>
                        <TableCell align="right">{row.summary}</TableCell>
                        <TableCell align="right">
                          {row.description || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : activeTab === 2 ? (
              <TableContainer component={Paper} elevation={0}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: "grey.100" }}>
                      <TableCell align="right">#</TableCell>
                      <TableCell align="right">ولایت</TableCell>
                      <TableCell align="right">ولسوالۍ</TableCell>
                      <TableCell align="right">کال</TableCell>
                      <TableCell align="right">د سند نوعیت</TableCell>
                      <TableCell align="right">د وثیقې خلاصه</TableCell>
                      <TableCell align="right">ملاحظات</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {annualReportRows.map((row, idx) => (
                      <TableRow key={idx} hover>
                        <TableCell align="right">{idx + 1}</TableCell>
                        <TableCell align="right">{row.provinceName}</TableCell>
                        <TableCell align="right">{row.districtName}</TableCell>
                        <TableCell align="right">{row.year}</TableCell>
                        <TableCell align="right">{row.docTypeName}</TableCell>
                        <TableCell align="right">{row.summaryWaseqa}</TableCell>
                        <TableCell align="right">
                          {row.description || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <TableContainer component={Paper} elevation={0}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: "grey.100" }}>
                      <TableCell align="right">#</TableCell>
                      <TableCell align="right">ولایت</TableCell>
                      <TableCell align="right">ولسوالۍ</TableCell>
                      <TableCell align="right">کال</TableCell>
                      <TableCell align="right">د سند نوعیت</TableCell>
                      <TableCell align="right">د وثیقې خلاصه</TableCell>
                      <TableCell align="right">ملاحظات</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {submissionReportRows.map((row, idx) => (
                      <TableRow key={idx} hover>
                        <TableCell align="right">{idx + 1}</TableCell>
                        <TableCell align="right">{row.provinceName}</TableCell>
                        <TableCell align="right">{row.districtName}</TableCell>
                        <TableCell align="right">{row.year}</TableCell>
                        <TableCell align="right">{row.docTypeName}</TableCell>
                        <TableCell align="right">{row.summaryWaseqa}</TableCell>
                        <TableCell align="right">
                          {row.description || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}
      </Card>
    </Box>
  );
}
