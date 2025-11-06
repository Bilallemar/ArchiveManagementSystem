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
} from "@mui/material";
import { useEffect, useState } from "react";
import { getReceipts } from "../services/StorageManagement/ReceiptsApi";

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
  const [key, animate] = React.useReducer((v) => v + 1, 0);

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

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await getReceipts();
        const receipts = response.data;

        // Group by month
        const monthCounts = {};
        const dayCounts = {}; // د ټولو ورځو ډاټا

        receipts.forEach((r) => {
          const date = new Date(r.letterDate);
          const monthName = monthNames[date.getMonth()];

          // د ورځې key د local وخت پر اساس
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0"); // 1-12
          const day = String(date.getDate()).padStart(2, "0");
          const dayKey = `${year}-${month}-${day}`;

          // Monthly counts
          if (!monthCounts[monthName])
            monthCounts[monthName] = { sender: 0, recipient: 0, file: 0 };
          monthCounts[monthName].sender += 1;
          monthCounts[monthName].recipient += 1;
          monthCounts[monthName].file += 1;

          // Daily counts
          if (!dayCounts[dayKey])
            dayCounts[dayKey] = { sender: 0, recipient: 0, file: 0 };
          dayCounts[dayKey].sender += 1;
          dayCounts[dayKey].recipient += 1;
          dayCounts[dayKey].file += 1;
        });

        const sortedMonths = monthNames.filter((m) => monthCounts[m]);
        const senderData = sortedMonths.map((m) => monthCounts[m].sender);
        const recipientData = sortedMonths.map((m) => monthCounts[m].recipient);
        const fileData = sortedMonths.map((m) => monthCounts[m].file);

        // د تیرې اوونۍ تاریخونه
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

        const weeklyData = {
          sender: weeklySender,
          recipient: weeklyRecipient,
          file: weeklyFile,
        };

        console.log("Weekly data:", weeklyData);

        setChartData({
          months: sortedMonths,
          senderData,
          recipientData,
          fileData,
          totalSender: senderData.reduce((a, b) => a + b, 0),
          totalRecipient: recipientData.reduce((a, b) => a + b, 0),
          totalFile: fileData.reduce((a, b) => a + b, 0),
          weeklyData,
        });
      } catch (error) {
        console.error("Failed to load receipts for chart:", error);
      }
    };

    loadData();
  }, []);

  const statCards = [
    {
      title: "مرسل الیه",
      value: chartData.weeklyData.recipient || 0,
      color: "#4e79a7",
    },
    {
      title: "مرسل",
      value: chartData.weeklyData.sender || 0,
      color: "#f28e2b",
    },
    { title: "فایل", value: chartData.weeklyData.file || 0, color: "#e15759" },
  ];

  return (
    <Box sx={{ padding: 2, backgroundColor: "#ffffff" }}>
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
                  mb: 1,
                }}
              >
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    {card.title}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {card.value}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", fontWeight: 500 }}
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
                      // د کارت ډول ته مطابق فیصدي محاسبه
                      let total = 0;
                      if (card.title === "مرسل الیه")
                        total = chartData.totalRecipient;
                      if (card.title === "مرسل") total = chartData.totalSender;
                      if (card.title === "فایل") total = chartData.totalFile;

                      // د پرون ورځ د هماغه نوع ریکارډ د مجموعې فیصدي
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
                  {card.title === "مرسل الیه" && "📥"}
                  {card.title === "مرسل" && "📤"}
                  {card.title === "فایل" && "📁"}
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Rest of your component remains the same */}
      <Grid container spacing={2} sx={{ justifyContent: "center" }}>
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
              sx={{ mb: 1, fontWeight: 600, textAlign: "center" }}
            >
              توزیع سیستم اسناد
            </Typography>
            <Box sx={{ position: "relative", display: "inline-block" }}>
              <PieChart
                series={[
                  {
                    data: [
                      {
                        id: 1,
                        value: chartData.totalSender || 0,
                        color: "#f7ae24",
                      },
                      {
                        id: 2,
                        value: chartData.totalRecipient || 0,
                        color: "#ccf9d6",
                      },
                      {
                        id: 3,
                        value: chartData.totalFile || 0,
                        color: "#6de39c",
                      },
                    ],
                    arcLabel: (item) =>
                      `${Math.round(
                        (item.value /
                          ((chartData.totalSender || 0) +
                            (chartData.totalRecipient || 0) +
                            (chartData.totalFile || 0))) *
                          100
                      )}%`,
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
                    <Typography variant="body2">{item.label}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Monthly Bar Chart */}
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
              width: "100%",
            }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 1, fontWeight: 600, textAlign: "center" }}
            >
              اسناد بر اساس ماه
            </Typography>
            <Box
              sx={{ width: "100%", flexGrow: 1, px: { xs: 1, sm: 2, md: 4 } }}
            >
              <BarChart
                key={key}
                xAxis={[
                  {
                    scaleType: "band",
                    data: chartData.months || [],
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
                    data: chartData.fileData || [],
                    color: "#40b6d7",
                  },
                  {
                    label: "مرسل الیه",
                    data: chartData.recipientData || [],
                    color: "#f7ae24",
                  },
                  {
                    label: "مرسل",
                    data: chartData.senderData || [],
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
