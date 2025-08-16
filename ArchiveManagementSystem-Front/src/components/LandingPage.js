import * as React from "react";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { Card, Typography, Box, Grid } from "@mui/material";

export default function LandingPage() {
  const [key, animate] = React.useReducer((v) => v + 1, 0);

  const pieData = [
    { id: 0, value: 40, label: "Windows", color: "#6de39c" },
    { id: 1, value: 35, label: "macOS", color: "#227767" },
    { id: 2, value: 25, label: "Linux", color: "#144a4f" },
  ];

  const barData = [
    { label: "Asia", value: 1230, color: "#76b7b2" },
    { label: "Europe", value: 6790, color: "#59a14f" },
    { label: "Americas", value: 1010, color: "#edc948" },
  ];

  const statCards = [
    {
      title: "Active Users",
      value: "18,765",
      change: "+2.6%",
      color: "#4e79a7",
      chartData: [10, 15, 20, 18, 22, 25, 23],
    },
    {
      title: "Installed Apps",
      value: "4,876",
      change: "+0.2%",
      color: "#f28e2b",
      chartData: [5, 6, 7, 6.5, 7.2, 7.5, 7.8],
    },
    {
      title: "Downloads",
      value: "678",
      change: "-0.1%",
      color: "#e15759",
      chartData: [2.1, 2.0, 1.9, 2.0, 1.8, 1.7, 1.6],
    },
  ];

  return (
    <Box sx={{ padding: 2, backgroundColor: "#fff" }}>
      {/* Top Statistic Cards with Mini Bar Charts */}
      <Grid container spacing={2} sx={{ mb: 2, justifyContent: "center" }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card
              sx={{
                boxShadow: 2,
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
                    sx={{
                      color: card.change.startsWith("+")
                        ? "success.main"
                        : "error.main",
                      fontWeight: 500,
                    }}
                  >
                    {card.change} this week
                  </Typography>
                </Box>
                <Box sx={{ width: 120, height: 80 }}>
                  <BarChart
                    key={`${key}-${index}`}
                    xAxis={[
                      {
                        scaleType: "band",
                        data: ["M", "T", "W", "T", "F", "S", "S"],
                        hideTooltip: true,
                        tickLabelStyle: { fontSize: 0 },
                      },
                    ]}
                    yAxis={[
                      {
                        scaleType: "linear",
                        hideTooltip: true,
                        tickLabelStyle: { fontSize: 0 },
                      },
                    ]}
                    series={[{ data: card.chartData, color: card.color }]}
                    width={120}
                    height={80}
                    sx={{
                      "& .MuiChartsAxis-root": { display: "none" },
                      "& .MuiBarElement-root": { borderRadius: 2 },
                    }}
                  />
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pie Chart */}
      <Grid container spacing={2} sx={{ justifyContent: "center" }}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              boxShadow: 2,
              borderRadius: 3,
              height: 500,
              padding: 3,
              backgroundColor: "#fff",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              Operating System Distribution
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Total downloads: 188,245
            </Typography>
            <PieChart
              series={[
                {
                  data: pieData,
                  arcLabel: (item) => `${item.value}%`,
                  arcLabelMinAngle: 20,
                  innerRadius: 60,
                  outerRadius: 120,
                  paddingAngle: 2,
                  cornerRadius: 5,
                },
              ]}
              colors={pieData.map((item) => item.color)}
              width={350}
              height={350}
              sx={{
                [`& .${pieArcLabelClasses.root}`]: {
                  fill: "white",
                  fontWeight: "bold",
                  fontSize: "0.8rem",
                },
              }}
            />
          </Card>
        </Grid>

        {/* Regional Bar Chart */}
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              boxShadow: 2,
              borderRadius: 3,
              height: 500,
              padding: 3,
              backgroundColor: "#fff",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              Regional Installations
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Distribution across regions (2023)
            </Typography>
            <BarChart
              key={key}
              xAxis={[
                {
                  type: "band",
                  data: barData.map((d) => d.label),
                  scaleType: "band",
                  tickLabelStyle: { fontSize: 12 },
                },
              ]}
              yAxis={[{ tickLabelStyle: { fontSize: 12 } }]}
              series={barData.map((d) => ({
                data: [d.value],
                color: d.color,
                label: d.label,
              }))}
              colors={barData.map((d) => d.color)}
              width={700}
              height={400}
            />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
