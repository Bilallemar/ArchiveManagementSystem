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
import { getReceipts } from "../../services/StorageManagement/ReceiptsApi";

export default function LandingPage() {
  const [chartData, setChartData] = useState({
    dates: [],
    recipientByDate: {},
    senderByDate: {},
    fileByDate: {},
  });

  const [key, animate] = React.useReducer((v) => v + 1, 0);

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isSm = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // ریسپانسیف اندازې
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

  const months = chartData.dates.map((dateStr) => {
    const date = new Date(dateStr);
    return monthNames[date.getMonth()] || dateStr;
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await getReceipts();
        const receipts = response.data || [];
        const dates = Array.from(
          new Set(receipts.map((r) => r.letterDate))
        ).sort();

        const recipientByDate = {};
        const senderByDate = {};
        const fileByDate = {};

        dates.forEach((date) => {
          const filtered = receipts.filter((r) => r.letterDate === date);
          recipientByDate[date] = filtered.length || 0;
          senderByDate[date] = filtered.length || 0;
          fileByDate[date] = filtered.length || 0;
        });

        setChartData({ dates, recipientByDate, senderByDate, fileByDate });
      } catch (error) {
        console.error("Failed to load receipts for chart:", error);
      }
    };

    loadData();
  }, []);

  const totalRecipient = Object.values(chartData.recipientByDate || {}).reduce(
    (a, b) => a + b,
    0
  );
  const totalSender = Object.values(chartData.senderByDate || {}).reduce(
    (a, b) => a + b,
    0
  );
  const totalFile = Object.values(chartData.fileByDate || {}).reduce(
    (a, b) => a + b,
    0
  );

  const statCards = [
    {
      title: "مرسل",
      value: totalSender,
      color: "#227767",
    },
    {
      title: "مرسل الیه",
      value: totalRecipient,
      color: "#f7ae24",
    },
    {
      title: "فایل",
      value: totalFile,
      color: "#40b6d7",
    },
  ];

  return (
    <Box sx={{ padding: 2, backgroundColor: "#ffffff" }}>
      {/* کارتونه */}
      <Grid container spacing={2} sx={{ mb: 2, justifyContent: "center" }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                boxShadow: 3,
                borderRadius: 3,
                padding: 2,
                backgroundColor: "#fff",
                textAlign: "center",
              }}
            >
              <Typography variant="subtitle2" color="textSecondary">
                {card.title}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {card.value}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pie Chart */}
      <Grid container spacing={2} sx={{ justifyContent: "center", mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              boxShadow: 3,
              borderRadius: 3,
              padding: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              توزیع سیستم اسناد
            </Typography>
            <PieChart
              series={[
                {
                  data: [
                    { id: 1, value: totalSender || 0, color: "#227767" },
                    { id: 2, value: totalRecipient || 0, color: "#f7ae24" },
                    { id: 3, value: totalFile || 0, color: "#40b6d7" },
                  ],
                  arcLabel: (item) => {
                    const total = totalSender + totalRecipient + totalFile;
                    return total
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
          </Card>
        </Grid>

        {/* Bar Chart by Month */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              boxShadow: 3,
              borderRadius: 3,
              padding: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              اسناد بر اساس ماه
            </Typography>

            <BarChart
              key={key}
              xAxis={[
                {
                  scaleType: "band",
                  data: monthNames,
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
                  label: "مرسل",
                  data: monthNames.map((m, idx) =>
                    chartData.dates
                      .filter((d) => monthNames[new Date(d).getMonth()] === m)
                      .reduce(
                        (acc, d) => acc + (chartData.senderByDate[d] || 0),
                        0
                      )
                  ),
                  color: "#227767",
                },
                {
                  label: "مرسل الیه",
                  data: monthNames.map((m, idx) =>
                    chartData.dates
                      .filter((d) => monthNames[new Date(d).getMonth()] === m)
                      .reduce(
                        (acc, d) => acc + (chartData.recipientByDate[d] || 0),
                        0
                      )
                  ),
                  color: "#f7ae24",
                },
                {
                  label: "فایل",
                  data: monthNames.map((m, idx) =>
                    chartData.dates
                      .filter((d) => monthNames[new Date(d).getMonth()] === m)
                      .reduce(
                        (acc, d) => acc + (chartData.fileByDate[d] || 0),
                        0
                      )
                  ),
                  color: "#40b6d7",
                },
              ]}
              width={chartWidth}
              height={chartHeight}
              slotProps={{
                bar: { rx: 8, ry: 8, style: { width: isXs ? 12 : 20 } },
              }}
            />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
