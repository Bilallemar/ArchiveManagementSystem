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

  // useEffect(() => {
  //   const loadData = async () => {
  //     try {
  //       setLoading(true);
  //       setError(null);

  //       // Load dashboard stats
  //       try {
  //         const statsResponse = await api.get("/dashboard/stats");
  //         console.log("Dashboard stats response:", statsResponse.data);
  //         setChartData(statsResponse.data);
  //       } catch (err) {
  //         console.error("Failed to load stats:", err);
  //         console.error("Error details:", err.response);

  //         if (err.response && err.response.status === 401) {
  //           setError("Session expired. Please log in again.");
  //         } else if (err.response && err.response.status === 403) {
  //           setError("Access denied. Please contact your administrator.");
  //         } else {
  //           setError("Failed to load dashboard data. Please try again.");
  //         }
  //       }

  //       // Load management-specific stats for admin
  //       if (userIsAdmin) {
  //         try {
  //           const mgmtStatsResponse = await api.get(
  //             "/dashboard/management-stats"
  //           );
  //           console.log("Management stats response:", mgmtStatsResponse.data);
  //           setManagementStats(mgmtStatsResponse.data);
  //         } catch (err) {
  //           console.error("Failed to load management stats:", err);
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Failed to load dashboard data:", error);
  //       setError("An error occurred while loading the dashboard");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   loadData();
  // }, [userIsAdmin]);
  // useEffect(() => {
  //   const loadDashboardData = async () => {
  //     try {
  //       setLoading(true);
  //       setError(null);

  //       // د weekly/dashboard stats ترلاسه کول
  //       const weeklyRes = await api.get("/dashboard/stats");
  //       console.log("Weekly Dashboard Data:", weeklyRes.data); // دا به ډاټا چاپ کړي

  //       setChartData(weeklyRes.data);

  //       // که user اډمین وي، management stats هم ترلاسه کړئ
  //       if (userIsAdmin) {
  //         const mgmtRes = await api.get("/dashboard/management-stats");
  //         setManagementStats(mgmtRes.data);
  //       }
  //     } catch (err) {
  //       console.error("Dashboard load error:", err);
  //       if (err.response && err.response.status === 401) {
  //         setError("ستاسو سیشن پای ته رسیدلی، لطفاً بیا login وکړئ.");
  //       } else if (err.response && err.response.status === 403) {
  //         setError("Access denied. د اډمین سره اړیکه ونیسئ.");
  //       } else {
  //         setError("Dashboard ډاټا ترلاسه کول ناکام شول. بیا هڅه وکړئ.");
  //       }
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   loadDashboardData();
  // }, [userIsAdmin]);

  // Weekly stats cards for regular users
  const statCards = [
    {
      title: "مرسل الیه",
      value: chartData.weeklyData.recipient || 0,
      color: "#5B8DEE",
      icon: "📥",
      total: chartData.totalRecipient,
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      title: "مرسل",
      value: chartData.weeklyData.sender || 0,
      color: "#F59E42",
      icon: "📤",
      total: chartData.totalSender,
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      title: "فایل",
      value: chartData.weeklyData.file || 0,
      color: "#4ECDC4",
      icon: "📁",
      total: chartData.totalFile,
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
  ];

  // Management cards for admin view
  const managementCards = [
    {
      title: "آرشیف",
      value: managementStats.archives,
      color: "#667eea",
      icon: "📚",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      title: "سوانح",
      value: managementStats.sawanih,
      color: "#f093fb",
      icon: "📋",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      title: "حفظیه حاضری",
      value: managementStats.hifziyaHazari,
      color: "#4facfe",
      icon: "📝",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
    {
      title: "حفظیه وارده صادره",
      value: managementStats.hifziyaWaradaSadera,
      color: "#43e97b",
      icon: "📄",
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    },
    {
      title: "مخزن رسیدات",
      value: managementStats.makzanReceipts,
      color: "#fa709a",
      icon: "🗃️",
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    },
    {
      title: "مخزن سالانه گزارش",
      value: managementStats.makzanAnnualReports,
      color: "#30cfd0",
      icon: "📊",
      gradient: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
    },
    {
      title: "مخزن تسلیمی گزارش",
      value: managementStats.makzanSubmissionReports,
      color: "#a8edea",
      icon: "📑",
      gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    },
    {
      title: "مجموع اسناد",
      value: managementStats.totalDocuments,
      color: "#ff9a9e",
      icon: "📦",
      gradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
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
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={60} sx={{ color: "#fff", mb: 2 }} />
          <Typography
            variant="h6"
            sx={{ color: "#fff", fontFamily: "B nazanin" }}
          >
            په لوډولو کې دی...
          </Typography>
        </Box>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ padding: 3 }}>
        <Alert severity="error" sx={{ borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontFamily: "B nazanin" }}>
            تېروتنه
          </Typography>
          <Typography sx={{ fontFamily: "B nazanin" }}>{error}</Typography>
        </Alert>
      </Box>
    );
  }

  // No management warning (non-admin users only)
  if (!userHasManagement && !userIsAdmin) {
    return (
      <Box sx={{ padding: 3, mb: 4 }}>
        <Alert severity="warning" sx={{ borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontFamily: "B nazanin" }}>
            هیڅ مدیریت ندی ټاکل شوی
          </Typography>
          <Typography sx={{ fontFamily: "B nazanin" }}>
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
    <Box sx={{ padding: 3, backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
      {/* Header */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: 3,
          borderRadius: 4,
          boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            fontFamily: "B nazanin",
            color: "#fff",
            textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
          }}
        >
          ډشبورډ
        </Typography>
        <Chip
          label={userIsAdmin ? "اډمین" : managementName}
          sx={{
            background: userIsAdmin
              ? "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
              : "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            color: "#fff",
            fontWeight: 700,
            fontFamily: "B nazanin",
            fontSize: "1.1rem",
            padding: "8px 16px",
            height: "auto",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
          }}
        />
      </Box>

      {/* Admin View - Management Stats Only */}
      {userIsAdmin && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {managementCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  background: card.gradient,
                  borderRadius: 4,
                  padding: 3,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 48px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: "B nazanin",
                        color: "#fff",
                        mb: 1,
                        fontWeight: 600,
                      }}
                    >
                      {card.title}
                    </Typography>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 800,
                        color: "#fff",
                        textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
                      }}
                    >
                      {card.value}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      fontSize: "48px",
                      filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.2))",
                    }}
                  >
                    {card.icon}
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
                  background: card.gradient,
                  borderRadius: 4,
                  padding: 3,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 48px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: "B nazanin",
                        color: "#fff",
                        mb: 1,
                        fontWeight: 600,
                      }}
                    >
                      {card.title}
                    </Typography>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 800,
                        color: "#fff",
                        mb: 1,
                        textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
                      }}
                    >
                      {card.value}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "rgba(255,255,255,0.9)",
                        fontFamily: "B nazanin",
                        mb: 1,
                      }}
                    >
                      تیرې اوونۍ
                    </Typography>
                    <Box
                      sx={{
                        display: "inline-block",
                        backgroundColor: "rgba(255,255,255,0.3)",
                        padding: "4px 12px",
                        borderRadius: 2,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#fff",
                          fontWeight: 700,
                        }}
                      >
                        {(() => {
                          const total = card.total || 0;
                          const percentage =
                            total > 0
                              ? ((card.value / total) * 100).toFixed(1)
                              : 0;
                          return `${percentage}%`;
                        })()}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      fontSize: "56px",
                      filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.2))",
                    }}
                  >
                    {card.icon}
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
          <Alert
            severity="info"
            sx={{
              borderRadius: 4,
              padding: 4,
              backgroundColor: "#e3f2fd",
              border: "2px dashed #2196f3",
            }}
          >
            <Typography variant="h5" sx={{ fontFamily: "B nazanin", mb: 2 }}>
              هیڅ معلومات شتون نلري
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: "B nazanin" }}>
              تراوسه هیڅ معلومات د ښودلو لپاره شتون نلري. د رسیدونو په اضافه
              کولو سره پیل وکړئ.
            </Typography>
          </Alert>
        </Box>
      )}

      {/* Charts - Only show if there's data */}
      {hasData && (
        <Grid container spacing={3}>
          {/* Pie Chart */}
          <Grid item xs={12} md={5}>
            <Card
              sx={{
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                borderRadius: 4,
                padding: 4,
                backgroundColor: "#fff",
                height: "100%",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  mb: 3,
                  fontWeight: 700,
                  textAlign: "center",
                  fontFamily: "B nazanin",
                  color: "#667eea",
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
                          color: "#f093fb",
                        },
                        {
                          id: 2,
                          value: chartData.totalRecipient || 0,
                          label: "مرسل الیه",
                          color: "#4facfe",
                        },
                        {
                          id: 3,
                          value: chartData.totalFile || 0,
                          label: "فایل",
                          color: "#43e97b",
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
                      cornerRadius: 5,
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
                    { color: "#f093fb", label: "مرسل" },
                    { color: "#4facfe", label: "مرسل الیه" },
                    { color: "#43e97b", label: "فایل" },
                  ].map((item, idx) => (
                    <Box
                      key={idx}
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          bgcolor: item.color,
                          borderRadius: "6px",
                          boxShadow: `0 2px 8px ${item.color}80`,
                        }}
                      />
                      <Typography
                        variant="body1"
                        sx={{ fontFamily: "B nazanin", fontWeight: 600 }}
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
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                borderRadius: 4,
                padding: 4,
                backgroundColor: "#fff",
                height: "100%",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  mb: 3,
                  fontWeight: 700,
                  textAlign: "center",
                  fontFamily: "B nazanin",
                  color: "#667eea",
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
                        fontWeight: 600,
                        fill: "#666",
                      },
                    },
                  ]}
                  series={[
                    {
                      label: "مرسل",
                      data: chartData.senderData,
                      color: "#f093fb",
                    },
                    {
                      label: "مرسل الیه",
                      data: chartData.recipientData,
                      color: "#4facfe",
                    },
                    {
                      label: "فایل",
                      data: chartData.fileData,
                      color: "#43e97b",
                    },
                  ]}
                  width={chartWidth}
                  height={chartHeight}
                  slotProps={{
                    bar: { rx: 6, ry: 6 },
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
