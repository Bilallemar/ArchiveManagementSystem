import * as React from "react";
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
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  getDashboardConfig,
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
    receipts: 0,
  });

  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isSm = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const pieWidth = isXs ? 260 : isSm ? 300 : 350;
  const pieHeight = isXs ? 250 : isSm ? 300 : 350;
  const innerRadius = isXs ? 50 : isSm ? 65 : 80;
  const outerRadius = isXs ? 80 : isSm ? 100 : 120;
  const chartWidth = isXs ? 300 : isSm ? 500 : 700;
  const chartHeight = isXs ? 250 : isSm ? 350 : 400;

  const monthNames = [
    "حمل",
    "ثور",
    "جوزا",
    "سرطان",
    "اسد",
    "سنبله",
    "میزان",
    "عقرب",
    "قوس",
    "جدی",
    "دلو",
    "حوت",
  ];

  const dashboardConfig = getDashboardConfig();
  const managementName = getManagementName();
  const userIsAdmin = isAdmin();
  const userHasManagement = hasManagement();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Load receipts data for charts
        try {
          const receiptsResponse = await api.get("/makzan-receipts");
          const receipts = receiptsResponse.data || [];

          if (receipts.length > 0) {
            // Group by month
            const monthCounts = {};
            const dayCounts = {};

            receipts.forEach((r) => {
              const date = new Date(r.letterDate);
              const monthName = monthNames[date.getMonth()];

              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, "0");
              const day = String(date.getDate()).padStart(2, "0");
              const dayKey = `${year}-${month}-${day}`;

              if (!monthCounts[monthName])
                monthCounts[monthName] = { sender: 0, recipient: 0, file: 0 };
              monthCounts[monthName].sender += 1;
              monthCounts[monthName].recipient += 1;
              monthCounts[monthName].file += 1;

              if (!dayCounts[dayKey])
                dayCounts[dayKey] = { sender: 0, recipient: 0, file: 0 };
              dayCounts[dayKey].sender += 1;
              dayCounts[dayKey].recipient += 1;
              dayCounts[dayKey].file += 1;
            });

            const sortedMonths = monthNames.filter((m) => monthCounts[m]);
            const senderData = sortedMonths.map((m) => monthCounts[m].sender);
            const recipientData = sortedMonths.map(
              (m) => monthCounts[m].recipient
            );
            const fileData = sortedMonths.map((m) => monthCounts[m].file);

            // Calculate weekly data
            const today = new Date();
            const weekAgo = new Date();
            weekAgo.setDate(today.getDate() - 7);

            let weeklySender = 0,
              weeklyRecipient = 0,
              weeklyFile = 0;
            Object.keys(dayCounts).forEach((dayKey) => {
              const d = new Date(dayKey);
              if (d >= weekAgo && d < today) {
                weeklySender += dayCounts[dayKey].sender;
                weeklyRecipient += dayCounts[dayKey].recipient;
                weeklyFile += dayCounts[dayKey].file;
              }
            });

            setChartData({
              months: sortedMonths,
              senderData,
              recipientData,
              fileData,
              totalSender: senderData.reduce((a, b) => a + b, 0),
              totalRecipient: recipientData.reduce((a, b) => a + b, 0),
              totalFile: fileData.reduce((a, b) => a + b, 0),
              weeklyData: {
                sender: weeklySender,
                recipient: weeklyRecipient,
                file: weeklyFile,
              },
            });
          }
        } catch (error) {
          console.error("Failed to load receipts:", error);
        }

        // Load management-specific stats for admin
        if (userIsAdmin) {
          try {
            const [archivesRes, sawanihRes, receiptsRes] =
              await Promise.allSettled([
                api.get("/archives"),
                api.get("/sawanih"),
                api.get("/makzan-receipts"),
              ]);

            setManagementStats({
              archives:
                archivesRes.status === "fulfilled"
                  ? archivesRes.value.data?.length || 0
                  : 0,
              sawanih:
                sawanihRes.status === "fulfilled"
                  ? sawanihRes.value.data?.length || 0
                  : 0,
              receipts:
                receiptsRes.status === "fulfilled"
                  ? receiptsRes.value.data?.length || 0
                  : 0,
            });
          } catch (error) {
            console.error("Failed to load management stats:", error);
          }
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userIsAdmin]);

  const statCards = [
    {
      title: "مرسل الیه",
      value: chartData.weeklyData.recipient || 0,
      color: "#4e79a7",
      icon: "📥",
    },
    {
      title: "مرسل",
      value: chartData.weeklyData.sender || 0,
      color: "#f28e2b",
      icon: "📤",
    },
    {
      title: "فایل",
      value: chartData.weeklyData.file || 0,
      color: "#e15759",
      icon: "📁",
    },
  ];

  // Show warning if no management
  if (!userHasManagement && !userIsAdmin) {
    return (
      <Box sx={{ padding: 3 }}>
        <Alert severity="warning">
          <Typography variant="h6">No Management Assigned</Typography>
          <Typography>
            You have not been assigned to any management department. Please
            contact your administrator.
          </Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2, backgroundColor: "#ffffff" }}>
      {/* Management Header */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 600, fontFamily: "B nazanin" }}
        >
          ډشبورډ
        </Typography>
        <Chip
          label={userIsAdmin ? "اډمین" : managementName}
          color={userIsAdmin ? "error" : "primary"}
          sx={{ fontWeight: 600, fontFamily: "B nazanin" }}
        />
      </Box>

      {/* Weekly Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 2, justifyContent: "center" }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                boxShadow: 3,
                borderRadius: 3,
                padding: 2,
                backgroundColor: "#fff",
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
                    variant="subtitle2"
                    color="textSecondary"
                    sx={{ fontFamily: "B nazanin" }}
                  >
                    {card.title}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {card.value}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 500,
                      fontFamily: "B nazanin",
                    }}
                  >
                    تیرې اوونۍ
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      color: "success.main",
                      fontWeight: 500,
                      mt: 0.5,
                    }}
                  >
                    {(() => {
                      let total = 0;
                      if (card.title === "مرسل الیه")
                        total = chartData.totalRecipient;
                      if (card.title === "مرسل") total = chartData.totalSender;
                      if (card.title === "فایل") total = chartData.totalFile;
                      const percentage =
                        total > 0 ? ((card.value / total) * 100).toFixed(1) : 0;
                      return `${percentage}%`;
                    })()}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    backgroundColor: card.color + "20",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                  }}
                >
                  {card.icon}
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Management Stats for Admin */}
      {userIsAdmin && (
        <Grid container spacing={2} sx={{ mb: 2, justifyContent: "center" }}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ boxShadow: 3, borderRadius: 3, padding: 2 }}>
              <Typography variant="h6" sx={{ fontFamily: "B nazanin", mb: 1 }}>
                آرشیف
              </Typography>
              <Typography
                variant="h4"
                sx={{ fontWeight: 600, color: "#4e79a7" }}
              >
                {managementStats.archives}
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ boxShadow: 3, borderRadius: 3, padding: 2 }}>
              <Typography variant="h6" sx={{ fontFamily: "B nazanin", mb: 1 }}>
                سوانح
              </Typography>
              <Typography
                variant="h4"
                sx={{ fontWeight: 600, color: "#f28e2b" }}
              >
                {managementStats.sawanih}
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ boxShadow: 3, borderRadius: 3, padding: 2 }}>
              <Typography variant="h6" sx={{ fontFamily: "B nazanin", mb: 1 }}>
                رسیدات
              </Typography>
              <Typography
                variant="h4"
                sx={{ fontWeight: 600, color: "#e15759" }}
              >
                {managementStats.receipts}
              </Typography>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Charts */}
      <Grid container spacing={2} sx={{ justifyContent: "center" }}>
        {/* Pie Chart */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              boxShadow: 3,
              borderRadius: 3,
              height: { xs: 400, sm: 450, md: 500, lg: 550 },
              padding: 3,
              backgroundColor: "#fff",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 1,
                fontWeight: 600,
                textAlign: "center",
                fontFamily: "B nazanin",
              }}
            >
              توزیع سیستم اسناد
            </Typography>
            <PieChart
              series={[
                {
                  data: [
                    {
                      id: 1,
                      value: chartData.totalSender || 1,
                      color: "#f7ae24",
                    },
                    {
                      id: 2,
                      value: chartData.totalRecipient || 1,
                      color: "#ccf9d6",
                    },
                    {
                      id: 3,
                      value: chartData.totalFile || 1,
                      color: "#6de39c",
                    },
                  ],
                  arcLabel: (item) => {
                    const total =
                      (chartData.totalSender || 0) +
                      (chartData.totalRecipient || 0) +
                      (chartData.totalFile || 0);
                    return total > 0
                      ? `${Math.round((item.value / total) * 100)}%`
                      : "0%";
                  },
                  innerRadius,
                  outerRadius,
                  cornerRadius: 3,
                },
              ]}
              width={pieWidth}
              height={pieHeight}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 4,
                mt: 2,
                flexWrap: "wrap",
              }}
            >
              {[
                { color: "#f7ae24", label: "مرسل" },
                { color: "#ccf9d6", label: "مرسل الیه" },
                { color: "#6de39c", label: "فایل" },
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
                  <Typography variant="body2" sx={{ fontFamily: "B nazanin" }}>
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>

        {/* Bar Chart */}
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              boxShadow: 3,
              borderRadius: 3,
              height: chartHeight + 150,
              padding: 3,
              backgroundColor: "#fff",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 1,
                fontWeight: 600,
                textAlign: "center",
                fontFamily: "B nazanin",
              }}
            >
              اسناد بر اساس ماه
            </Typography>
            <Box
              sx={{ width: "100%", flexGrow: 1, px: { xs: 1, sm: 2, md: 4 } }}
            >
              <BarChart
                xAxis={[
                  {
                    scaleType: "band",
                    data:
                      chartData.months.length > 0
                        ? chartData.months
                        : ["No Data"],
                    tickLabelStyle: {
                      fontSize: isXs ? 10 : isSm ? 11 : 12,
                      fontWeight: 500,
                    },
                    grid: { stroke: "#e0e0e0" },
                  },
                ]}
                yAxis={[
                  {
                    tickLabelStyle: {
                      fontSize: isXs ? 10 : isSm ? 11 : 12,
                      fontWeight: 500,
                    },
                    grid: { stroke: "#e0e0e0" },
                  },
                ]}
                series={[
                  {
                    label: "فایل",
                    data:
                      chartData.fileData.length > 0 ? chartData.fileData : [0],
                    color: "#40b6d7",
                  },
                  {
                    label: "مرسل الیه",
                    data:
                      chartData.recipientData.length > 0
                        ? chartData.recipientData
                        : [0],
                    color: "#f28e2b",
                  },
                  {
                    label: "مرسل",
                    data:
                      chartData.senderData.length > 0
                        ? chartData.senderData
                        : [0],
                    color: "#227767",
                  },
                ]}
                width={chartWidth}
                height={chartHeight}
                slotProps={{
                  bar: { rx: 8, ry: 8, style: { width: isXs ? 12 : 20 } },
                }}
              />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
