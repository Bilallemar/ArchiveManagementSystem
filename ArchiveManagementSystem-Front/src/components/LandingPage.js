import React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import {
  Card,
  Typography,
  Box,
  Grid,
  useTheme,
  useMediaQuery,
  Chip,
  Alert,
  CircularProgress,
  Paper,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  getManagementName,
  isAdmin,
  hasManagement,
} from "../utils/managementUtils";
import api from "../services/api";

export default function LandingPage() {
  const [chartData, setChartData] = useState({
    months: [],
    senderData: [],
    recipientData: [],
    fileData: [],
    totalSender: 0,
    totalRecipient: 0,
    totalFile: 0,
    weeklyData: {
      sender: 0,
      recipient: 0,
      file: 0,
    },
  });

  const [managementStats, setManagementStats] = useState({
    archives: 0,
    sawanih: 0,
    hifziyaHazari: 0,
    hifziyaWaradaSadera: 0,
    makzanReceipts: 0,
    makzanAnnualReports: 0,
    makzanSubmissionReports: 0,
    totalDocuments: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isSm = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const pieWidth = isXs ? 280 : isSm ? 320 : 380;
  const pieHeight = isXs ? 280 : isSm ? 320 : 380;
  const innerRadius = isXs ? 60 : isSm ? 75 : 90;
  const outerRadius = isXs ? 90 : isSm ? 110 : 130;
  const chartWidth = isXs ? 300 : isSm ? 500 : 700;
  const chartHeight = isXs ? 250 : isSm ? 350 : 400;

  const managementName = getManagementName();
  const userIsAdmin = isAdmin();
  const userHasManagement = hasManagement();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const weeklyRes = await api.get("/dashboard/stats");
        console.log("Weekly Dashboard Data:", weeklyRes.data);
        setChartData(weeklyRes.data);

        if (userIsAdmin) {
          const mgmtRes = await api.get("/dashboard/management-stats");
          console.log("Management Dashboard Data:", mgmtRes.data);
          setManagementStats(mgmtRes.data);
        }
      } catch (err) {
        console.error("Dashboard load error:", err);
        if (err.response && err.response.status === 401) {
          setError("ستاسو سیشن پای ته رسیدلی، لطفاً بیا login وکړئ.");
        } else if (err.response && err.response.status === 403) {
          setError("Access denied. د اډمین سره اړیکه ونیسئ.");
        } else {
          setError("Dashboard ډاټا ترلاسه کول ناکام شول. بیا هڅه وکړئ.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [userIsAdmin]);

  // Weekly stats cards for regular users
  const statCards = [
    {
      title: "مرسل الیه",
      value: chartData.weeklyData.recipient || 0,
      total: chartData.totalRecipient,
      icon: "📥",
      color: "#00B8D9",
      bgColor: "rgba(0, 184, 217, 0.08)",
    },
    {
      title: "مرسل",
      value: chartData.weeklyData.sender || 0,
      total: chartData.totalSender,
      icon: "📤",
      color: "#FFAB00",
      bgColor: "rgba(255, 171, 0, 0.08)",
    },
    {
      title: "فایل",
      value: chartData.weeklyData.file || 0,
      total: chartData.totalFile,
      icon: "📁",
      color: "#22C55E",
      bgColor: "rgba(34, 197, 94, 0.08)",
    },
  ];

  // Management cards for admin view
  const managementCards = [
    {
      title: "آرشیف",
      value: managementStats.archives,
      icon: "📚",
      color: "#00B8D9",
      bgColor: "rgba(0, 184, 217, 0.08)",
    },
    {
      title: "سوانح",
      value: managementStats.sawanih,
      icon: "📋",
      color: "#8B5CF6",
      bgColor: "rgba(139, 92, 246, 0.08)",
    },
    {
      title: "حفظیه حاضری",
      value: managementStats.hifziyaHazari,
      icon: "📝",
      color: "#FFAB00",
      bgColor: "rgba(255, 171, 0, 0.08)",
    },
    {
      title: "حفظیه وارده صادره",
      value: managementStats.hifziyaWaradaSadera,
      icon: "📄",
      color: "#22C55E",
      bgColor: "rgba(34, 197, 94, 0.08)",
    },
    {
      title: "مخزن رسیدات",
      value: managementStats.makzanReceipts,
      icon: "🗃️",
      color: "#FF5630",
      bgColor: "rgba(255, 86, 48, 0.08)",
    },
    {
      title: "مخزن سالانه گزارش",
      value: managementStats.makzanAnnualReports,
      icon: "📊",
      color: "#00B8D9",
      bgColor: "rgba(0, 184, 217, 0.08)",
    },
    {
      title: "مخزن تسلیمی گزارش",
      value: managementStats.makzanSubmissionReports,
      icon: "📑",
      color: "#8B5CF6",
      bgColor: "rgba(139, 92, 246, 0.08)",
    },
    {
      title: "مجموع اسناد",
      value: managementStats.totalDocuments,
      icon: "📦",
      color: "#7C3AED",
      bgColor: "rgba(124, 58, 237, 0.08)",
    },
  ];

  // Loading state
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
          backgroundColor: "#f9fafb",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={60} sx={{ color: "#00B8D9", mb: 2 }} />
          <Typography variant="h6" sx={{ color: "#637381" }}>
            په لوډولو کې دی...
          </Typography>
        </Box>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ padding: 3, backgroundColor: "#f9fafb", minHeight: "100vh" }}>
        <Alert
          severity="error"
          sx={{
            borderRadius: 2,
            border: "1px solid rgba(255, 86, 48, 0.2)",
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            تېروتنه
          </Typography>
          <Typography>{error}</Typography>
        </Alert>
      </Box>
    );
  }

  // No management warning
  if (!userHasManagement && !userIsAdmin) {
    return (
      <Box sx={{ padding: 3, backgroundColor: "#f9fafb", minHeight: "100vh" }}>
        <Alert
          severity="warning"
          sx={{
            borderRadius: 2,
            border: "1px solid rgba(255, 171, 0, 0.2)",
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            هیڅ مدیریت ندی ټاکل شوی
          </Typography>
          <Typography>
            تاسو هیڅ مدیریت ته ندی ټاکل شوي. مهرباني وکړئ خپل اډمین سره اړیکه
            ونیسئ.
          </Typography>
        </Alert>
      </Box>
    );
  }

  // Check if there's any data
  const hasData =
    chartData.months.length > 0 &&
    (chartData.totalSender > 0 ||
      chartData.totalRecipient > 0 ||
      chartData.totalFile > 0);

  return (
    <Box
      sx={{
        padding: { xs: 2, sm: 3 },
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "#212B36",
            fontSize: { xs: "1.5rem", sm: "2rem" },
          }}
        >
          ډشبورډ
        </Typography>
        <Chip
          label={userIsAdmin ? "اډمین" : managementName}
          sx={{
            backgroundColor: userIsAdmin ? "#FF5630" : "#00B8D9",
            color: "#fff",
            fontWeight: 600,
            fontSize: "0.875rem",
            height: 32,
            borderRadius: "8px",
            "& .MuiChip-label": {
              px: 1.5,
            },
          }}
        />
      </Box>

      {/* Admin View - Management Stats */}
      {userIsAdmin && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {managementCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: 2,
                  boxShadow:
                    "rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    boxShadow:
                      "rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.2) 0px 16px 32px -4px",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: card.bgColor,
                      fontSize: "2rem",
                      mr: 2,
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        color: "#212B36",
                        mb: 0.5,
                        fontSize: "1.75rem",
                      }}
                    >
                      {card.value}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#637381",
                        fontSize: "0.875rem",
                      }}
                    >
                      {card.title}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Regular User View - Weekly Stats */}
      {!userIsAdmin && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {statCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: 2,
                  boxShadow:
                    "rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    boxShadow:
                      "rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.2) 0px 16px 32px -4px",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: card.bgColor,
                      fontSize: "2rem",
                      mr: 2,
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        color: "#212B36",
                        mb: 0.5,
                        fontSize: "1.75rem",
                      }}
                    >
                      {card.value}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#637381",
                        fontSize: "0.875rem",
                        mb: 1,
                      }}
                    >
                      {card.title}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Chip
                        label={`${card.total} مجموع`}
                        size="small"
                        sx={{
                          backgroundColor: card.bgColor,
                          color: card.color,
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          height: 24,
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#637381",
                          fontSize: "0.75rem",
                        }}
                      >
                        {(() => {
                          const total = card.total || 0;
                          const percentage =
                            total > 0
                              ? ((card.value / total) * 100).toFixed(0)
                              : 0;
                          return `${percentage}% تیرې اوونۍ`;
                        })()}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* No Data Message */}
      {!hasData && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Paper
            sx={{
              p: 6,
              borderRadius: 2,
              border: "2px dashed rgba(145, 158, 171, 0.24)",
              backgroundColor: "transparent",
            }}
          >
            <Typography
              variant="h5"
              sx={{ color: "#212B36", mb: 2, fontWeight: 600 }}
            >
              هیڅ معلومات شتون نلري
            </Typography>
            <Typography variant="body1" sx={{ color: "#637381" }}>
              تراوسه هیڅ معلومات د ښودلو لپاره شتون نلري. د رسیدونو په اضافه
              کولو سره پیل وکړئ.
            </Typography>
          </Paper>
        </Box>
      )}

      {/* Charts */}
      {hasData && (
        <Grid container spacing={3}>
          {/* Pie Chart */}
          <Grid item xs={12} md={5}>
            <Card
              sx={{
                p: 3,
                borderRadius: 2,
                boxShadow:
                  "rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px",
                height: "100%",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 3,
                  fontWeight: 700,
                  color: "#212B36",
                  fontSize: "1.125rem",
                }}
              >
                د اسنادو توزیع
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <PieChart
                  series={[
                    {
                      data: [
                        {
                          id: 1,
                          value: chartData.totalSender || 0,
                          label: "مرسل",
                          color: "#FFAB00",
                        },
                        {
                          id: 2,
                          value: chartData.totalRecipient || 0,
                          label: "مرسل الیه",
                          color: "#00B8D9",
                        },
                        {
                          id: 3,
                          value: chartData.totalFile || 0,
                          label: "فایل",
                          color: "#22C55E",
                        },
                      ],
                      arcLabel: (item) => {
                        const total =
                          chartData.totalSender +
                          chartData.totalRecipient +
                          chartData.totalFile;
                        return total > 0
                          ? `${Math.round((item.value / total) * 100)}%`
                          : "0%";
                      },
                      innerRadius,
                      outerRadius,
                      cornerRadius: 4,
                    },
                  ]}
                  width={pieWidth}
                  height={pieHeight}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 3,
                    mt: 3,
                    flexWrap: "wrap",
                  }}
                >
                  {[
                    { color: "#FFAB00", label: "مرسل" },
                    { color: "#00B8D9", label: "مرسل الیه" },
                    { color: "#22C55E", label: "فایل" },
                  ].map((item, idx) => (
                    <Box
                      key={idx}
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          bgcolor: item.color,
                          borderRadius: "4px",
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#637381",
                          fontWeight: 500,
                          fontSize: "0.875rem",
                        }}
                      >
                        {item.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Card>
          </Grid>

          {/* Bar Chart */}
          <Grid item xs={12} md={7}>
            <Card
              sx={{
                p: 3,
                borderRadius: 2,
                boxShadow:
                  "rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px",
                height: "100%",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 3,
                  fontWeight: 700,
                  color: "#212B36",
                  fontSize: "1.125rem",
                }}
              >
                د میاشتو له مخې اسناد
              </Typography>
              <Box sx={{ width: "100%", height: chartHeight + 50 }}>
                <BarChart
                  xAxis={[
                    {
                      scaleType: "band",
                      data: chartData.months,
                      tickLabelStyle: {
                        fontSize: isXs ? 11 : isSm ? 12 : 13,
                        fontWeight: 500,
                        fill: "#637381",
                      },
                    },
                  ]}
                  series={[
                    {
                      label: "مرسل",
                      data: chartData.senderData,
                      color: "#FFAB00",
                    },
                    {
                      label: "مرسل الیه",
                      data: chartData.recipientData,
                      color: "#00B8D9",
                    },
                    {
                      label: "فایل",
                      data: chartData.fileData,
                      color: "#22C55E",
                    },
                  ]}
                  width={chartWidth}
                  height={chartHeight}
                  slotProps={{
                    bar: { rx: 4, ry: 4 },
                  }}
                />
              </Box>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
