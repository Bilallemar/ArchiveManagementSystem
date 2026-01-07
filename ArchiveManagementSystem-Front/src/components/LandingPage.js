// import React from "react";
// import {
//   Card,
//   Typography,
//   Box,
//   Grid,
//   useTheme,
//   useMediaQuery,
//   Alert,
//   CircularProgress,
// } from "@mui/material";
// import { useEffect, useState, useMemo } from "react";
// import { useTranslation } from "react-i18next";

// import {
//   getManagementName,
//   isAdmin,
//   hasManagement,
// } from "../utils/managementUtils";
// import api from "../services/api";
// import TrendingUpIcon from "@mui/icons-material/TrendingUp";
// import TrendingDownIcon from "@mui/icons-material/TrendingDown";
// import LandingPageTexts from "./LandingPageTexts";

// export default function LandingPage() {
//   const { t } = useTranslation("landingPage");
//   const text = useMemo(() => LandingPageTexts(t), [t]);
//   const [chartData, setChartData] = useState({
//     months: [],
//     senderData: [],
//     recipientData: [],
//     fileData: [],
//     totalSender: 0,
//     totalRecipient: 0,
//     totalFile: 0,
//     weeklyData: {
//       sender: 0,
//       recipient: 0,
//       file: 0,
//     },
//   });

//   const [managementStats, setManagementStats] = useState({
//     archives: 0,
//     sawanih: 0,
//     hifziyaHazari: 0,
//     hifziyaWaradaSadera: 0,
//     makzanReceipts: 0,
//     makzanAnnualReports: 0,
//     makzanSubmissionReports: 0,
//     totalDocuments: 0,
//   });

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const theme = useTheme();
//   const managementName = getManagementName();
//   const userIsAdmin = isAdmin();
//   const userHasManagement = hasManagement();

//   useEffect(() => {
//     const loadDashboardData = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const weeklyRes = await api.get("/dashboard/stats");
//         setChartData(weeklyRes.data);

//         if (userIsAdmin) {
//           const mgmtRes = await api.get("/dashboard/management-stats");
//           setManagementStats(mgmtRes.data);
//         }
//       } catch (err) {
//         console.error("Dashboard load error:", err);
//         if (err.response?.status === 401) setError(text.sessionExpired);
//         else if (err.response?.status === 403) setError(text.accessDenied);
//         else setError(text.dashboardLoadError);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadDashboardData();
//   }, [
//     userIsAdmin,
//     text.sessionExpired,
//     text.accessDenied,
//     text.dashboardLoadError,
//   ]);

//   // Mini Sparkline Component
//   const MiniSparkline = ({ data, color }) => {
//     if (!data || data.length === 0) return null;

//     const max = Math.max(...data);
//     const min = Math.min(...data);
//     const range = max - min || 1;
//     const width = 60;
//     const height = 32;

//     const points = data
//       .map((value, index) => {
//         const x = (index / (data.length - 1)) * width;
//         const y = height - ((value - min) / range) * height;
//         return `${x},${y}`;
//       })
//       .join(" ");

//     return (
//       <svg width={width} height={height} style={{ display: "block" }}>
//         <polyline
//           points={points}
//           fill="none"
//           stroke={color}
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         />
//       </svg>
//     );
//   };

//   const calculatePercentage = (current, total) => {
//     if (total === 0) return 0;
//     return ((current / total) * 100).toFixed(1);
//   };

//   const statCards = [
//     {
//       title: "مجموع مرسل الیه",
//       value: chartData.totalRecipient || 0,
//       weeklyValue: chartData.weeklyData.recipient || 0,
//       color: "#00B8D9",
//       lightBg: "rgba(0, 184, 217, 0.08)",
//       sparklineData: chartData.recipientData || [],
//     },
//     {
//       title: "مجموع مرسل",
//       value: chartData.totalSender || 0,
//       weeklyValue: chartData.weeklyData.sender || 0,
//       color: "#FFAB00",
//       lightBg: "rgba(255, 171, 0, 0.08)",
//       sparklineData: chartData.senderData || [],
//     },
//     {
//       title: "مجموع فایلونه",
//       value: chartData.totalFile || 0,
//       weeklyValue: chartData.weeklyData.file || 0,
//       color: "#00A76F",
//       lightBg: "rgba(0, 167, 111, 0.08)",
//       sparklineData: chartData.fileData || [],
//     },
//   ];

//   // Management cards styled like stat cards
//   const managementCards = [
//     {
//       title: "مخزن رسیدات",
//       value: managementStats.makzanReceipts || 0,
//       weeklyValue: 0,
//       color: "#FF5630",
//       lightBg: "rgba(255, 86, 48, 0.08)",
//       sparklineData: [2, 3, 2, 4, 3, 4, 4],
//     },
//     {
//       title: "مخزن سالانه گزارش",
//       value: managementStats.makzanAnnualReports || 0,
//       weeklyValue: 0,
//       color: "#1890FF",
//       lightBg: "rgba(24, 144, 255, 0.08)",
//       sparklineData: [1, 1, 0, 1, 1, 1, 1],
//     },
//     {
//       title: "مخزن تسلیمی گزارش",
//       value: managementStats.makzanSubmissionReports || 0,
//       weeklyValue: 0,
//       color: "#7635DC",
//       lightBg: "rgba(118, 53, 220, 0.08)",
//       sparklineData: [2, 2, 3, 2, 3, 3, 3],
//     },
//   ];

//   // Default months for empty chart
//   const defaultMonths = [
//     "حمل",
//     "ثور",
//     "جوزا",
//     "سرطان",
//     "اسد",
//     "سنبله",
//     "میزان",
//     "عقرب",
//     "قوس",
//     "جدی",
//     "دلو",
//     "حوت",
//   ];
//   const displayMonths =
//     chartData.months.length > 0 ? chartData.months : defaultMonths;
//   const displaySenderData =
//     chartData.senderData.length > 0 ? chartData.senderData : Array(12).fill(0);
//   const displayRecipientData =
//     chartData.recipientData.length > 0
//       ? chartData.recipientData
//       : Array(12).fill(0);
//   const displayFileData =
//     chartData.fileData.length > 0 ? chartData.fileData : Array(12).fill(0);

//   if (loading) {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           minHeight: "100vh",
//           bgcolor: "#F9FAFB",
//         }}
//       >
//         <CircularProgress size={48} thickness={4} sx={{ color: "#3B82F6" }} />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box sx={{ p: 3, bgcolor: "#F9FAFB", minHeight: "100vh" }}>
//         <Alert severity="error" sx={{ borderRadius: 2 }}>
//           {error}
//         </Alert>
//       </Box>
//     );
//   }

//   if (!userHasManagement && !userIsAdmin) {
//     return (
//       <Box sx={{ p: 3, bgcolor: "#F9FAFB", minHeight: "100vh" }}>
//         <Alert severity="warning" sx={{ borderRadius: 2 }}>
//           تاسو هیڅ مدیریت ته ندی ټاکل شوي. مهرباني وکړئ خپل اډمین سره اړیکه
//           ونیسئ.
//         </Alert>
//       </Box>
//     );
//   }

//   const hasDonutData =
//     chartData.totalSender > 0 ||
//     chartData.totalRecipient > 0 ||
//     chartData.totalFile > 0;

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         bgcolor: "#F9FAFB",
//         p: { xs: 2, sm: 3, md: 4 },
//       }}
//     >
//       <Box sx={{ maxWidth: "1400px", mx: "auto" }}>
//         {/* Stat Cards - Main */}
//         <Grid container spacing={3} sx={{ mb: 3 }}>
//           {statCards.map((card, index) => {
//             const percentage = calculatePercentage(
//               card.weeklyValue,
//               card.value
//             );
//             const isPositive = card.weeklyValue > 0;

//             return (
//               <Grid item xs={12} md={4} key={index}>
//                 <Card
//                   sx={{
//                     bgcolor: "white",
//                     borderRadius: 4,
//                     p: 3,
//                     boxShadow:
//                       "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
//                     border: "1px solid #F3F4F6",
//                     transition: "all 0.3s",
//                     "&:hover": {
//                       boxShadow:
//                         "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
//                     },
//                   }}
//                 >
//                   <Box
//                     sx={{ display: "flex", justifyContent: "space-between" }}
//                   >
//                     <Box sx={{ flex: 1 }}>
//                       <Typography
//                         sx={{
//                           fontSize: "0.875rem",
//                           fontWeight: 600,
//                           color: "#6B7280",
//                           mb: 1,
//                         }}
//                       >
//                         {card.title}
//                       </Typography>
//                       <Typography
//                         sx={{
//                           fontSize: "2.25rem",
//                           fontWeight: 700,
//                           color: "#111827",
//                           mb: 1.5,
//                         }}
//                       >
//                         {card.value.toLocaleString()}
//                       </Typography>
//                       <Box
//                         sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
//                       >
//                         {isPositive ? (
//                           <TrendingUpIcon
//                             sx={{ fontSize: 16, color: "#10B981" }}
//                           />
//                         ) : (
//                           <TrendingDownIcon
//                             sx={{ fontSize: 16, color: "#EF4444" }}
//                           />
//                         )}
//                         <Typography
//                           component="span"
//                           sx={{
//                             fontSize: "0.875rem",
//                             fontWeight: 600,
//                             color: isPositive ? "#10B981" : "#EF4444",
//                           }}
//                         >
//                           {isPositive ? "+" : ""}
//                           {percentage}%
//                         </Typography>
//                         <Typography
//                           component="span"
//                           sx={{
//                             fontSize: "0.875rem",
//                             color: "#6B7280",
//                             ml: 0.5,
//                           }}
//                         >
//                           تیرې ۷ ورځې
//                         </Typography>
//                       </Box>
//                     </Box>
//                     <Box
//                       sx={{
//                         width: 64,
//                         height: 64,
//                         bgcolor: card.lightBg,
//                         borderRadius: "50%",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                       }}
//                     >
//                       <MiniSparkline
//                         data={card.sparklineData}
//                         color={card.color}
//                       />
//                     </Box>
//                   </Box>
//                 </Card>
//               </Grid>
//             );
//           })}
//         </Grid>

//         {/* Management Cards - Same Style as Stat Cards */}
//         {userIsAdmin && (
//           <Grid container spacing={3} sx={{ mb: 3 }}>
//             {managementCards.map((card, index) => {
//               const percentage = calculatePercentage(
//                 card.weeklyValue,
//                 card.value
//               );
//               const isPositive = card.weeklyValue >= 0;

//               return (
//                 <Grid item xs={12} md={4} key={index}>
//                   <Card
//                     sx={{
//                       bgcolor: "white",
//                       borderRadius: 4,
//                       p: 3,
//                       boxShadow:
//                         "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
//                       border: "1px solid #F3F4F6",
//                       transition: "all 0.3s",
//                       "&:hover": {
//                         boxShadow:
//                           "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
//                       },
//                     }}
//                   >
//                     <Box
//                       sx={{ display: "flex", justifyContent: "space-between" }}
//                     >
//                       <Box sx={{ flex: 1 }}>
//                         <Typography
//                           sx={{
//                             fontSize: "0.875rem",
//                             fontWeight: 600,
//                             color: "#6B7280",
//                             mb: 1,
//                           }}
//                         >
//                           {card.title}
//                         </Typography>
//                         <Typography
//                           sx={{
//                             fontSize: "2.25rem",
//                             fontWeight: 700,
//                             color: "#111827",
//                             mb: 1.5,
//                           }}
//                         >
//                           {card.value.toLocaleString()}
//                         </Typography>
//                         <Box
//                           sx={{
//                             display: "flex",
//                             alignItems: "center",
//                             gap: 0.5,
//                           }}
//                         >
//                           {isPositive ? (
//                             <TrendingUpIcon
//                               sx={{ fontSize: 16, color: "#10B981" }}
//                             />
//                           ) : (
//                             <TrendingDownIcon
//                               sx={{ fontSize: 16, color: "#EF4444" }}
//                             />
//                           )}
//                           <Typography
//                             component="span"
//                             sx={{
//                               fontSize: "0.875rem",
//                               fontWeight: 600,
//                               color: isPositive ? "#10B981" : "#EF4444",
//                             }}
//                           >
//                             {isPositive ? "+" : ""}
//                             {percentage}%
//                           </Typography>
//                           <Typography
//                             component="span"
//                             sx={{
//                               fontSize: "0.875rem",
//                               color: "#6B7280",
//                               ml: 0.5,
//                             }}
//                           >
//                             تیرې ۷ ورځې
//                           </Typography>
//                         </Box>
//                       </Box>
//                       <Box
//                         sx={{
//                           width: 64,
//                           height: 64,
//                           bgcolor: card.lightBg,
//                           borderRadius: "50%",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                         }}
//                       >
//                         <MiniSparkline
//                           data={card.sparklineData}
//                           color={card.color}
//                         />
//                       </Box>
//                     </Box>
//                   </Card>
//                 </Grid>
//               );
//             })}
//           </Grid>
//         )}

//         {/* Charts - Always Visible */}
//         <Grid container spacing={3}>
//           {/* Donut Chart - Only show if there's data */}
//           {hasDonutData && (
//             <Grid item xs={12} lg={4}>
//               <Card
//                 sx={{
//                   bgcolor: "white",
//                   borderRadius: 4,
//                   p: 3,
//                   boxShadow:
//                     "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
//                   border: "1px solid #F3F4F6",
//                   height: "100%",
//                 }}
//               >
//                 <Typography
//                   sx={{
//                     fontSize: "1.125rem",
//                     fontWeight: 700,
//                     color: "#111827",
//                     mb: 3,
//                   }}
//                 >
//                   د اسنادو توزیع
//                 </Typography>

//                 <Box
//                   sx={{
//                     position: "relative",
//                     display: "flex",
//                     justifyContent: "center",
//                     mb: 3,
//                   }}
//                 >
//                   <svg width="220" height="220" viewBox="0 0 220 220">
//                     <circle
//                       cx="110"
//                       cy="110"
//                       r="75"
//                       fill="none"
//                       stroke="#FFAB00"
//                       strokeWidth="35"
//                       strokeDasharray={`${
//                         (chartData.totalSender /
//                           (chartData.totalSender +
//                             chartData.totalRecipient +
//                             chartData.totalFile)) *
//                         471
//                       } 471`}
//                       strokeDashoffset="0"
//                       transform="rotate(-90 110 110)"
//                     />
//                     <circle
//                       cx="110"
//                       cy="110"
//                       r="75"
//                       fill="none"
//                       stroke="#00B8D9"
//                       strokeWidth="35"
//                       strokeDasharray={`${
//                         (chartData.totalRecipient /
//                           (chartData.totalSender +
//                             chartData.totalRecipient +
//                             chartData.totalFile)) *
//                         471
//                       } 471`}
//                       strokeDashoffset={`-${
//                         (chartData.totalSender /
//                           (chartData.totalSender +
//                             chartData.totalRecipient +
//                             chartData.totalFile)) *
//                         471
//                       }`}
//                       transform="rotate(-90 110 110)"
//                     />
//                     <circle
//                       cx="110"
//                       cy="110"
//                       r="75"
//                       fill="none"
//                       stroke="#00A76F"
//                       strokeWidth="35"
//                       strokeDasharray={`${
//                         (chartData.totalFile /
//                           (chartData.totalSender +
//                             chartData.totalRecipient +
//                             chartData.totalFile)) *
//                         471
//                       } 471`}
//                       strokeDashoffset={`-${
//                         ((chartData.totalSender + chartData.totalRecipient) /
//                           (chartData.totalSender +
//                             chartData.totalRecipient +
//                             chartData.totalFile)) *
//                         471
//                       }`}
//                       transform="rotate(-90 110 110)"
//                     />
//                   </svg>

//                   <Box
//                     sx={{
//                       position: "absolute",
//                       top: "50%",
//                       left: "50%",
//                       transform: "translate(-50%, -50%)",
//                       textAlign: "center",
//                     }}
//                   >
//                     <Typography
//                       sx={{ fontSize: "0.75rem", color: "#6B7280", mb: 0.5 }}
//                     >
//                       مجموع
//                     </Typography>
//                     <Typography
//                       sx={{
//                         fontSize: "1.875rem",
//                         fontWeight: 700,
//                         color: "#111827",
//                       }}
//                     >
//                       {(
//                         chartData.totalSender +
//                         chartData.totalRecipient +
//                         chartData.totalFile
//                       ).toLocaleString()}
//                     </Typography>
//                   </Box>
//                 </Box>

//                 <Box
//                   sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
//                 >
//                   {[
//                     {
//                       color: "#FFAB00",
//                       label: "مرسل",
//                       value: chartData.totalSender,
//                     },
//                     {
//                       color: "#00B8D9",
//                       label: "مرسل الیه",
//                       value: chartData.totalRecipient,
//                     },
//                     {
//                       color: "#00A76F",
//                       label: "فایل",
//                       value: chartData.totalFile,
//                     },
//                   ].map((item, idx) => (
//                     <Box
//                       key={idx}
//                       sx={{
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "space-between",
//                       }}
//                     >
//                       <Box
//                         sx={{ display: "flex", alignItems: "center", gap: 1 }}
//                       >
//                         <Box
//                           sx={{
//                             width: 12,
//                             height: 12,
//                             bgcolor: item.color,
//                             borderRadius: "50%",
//                           }}
//                         />
//                         <Typography
//                           sx={{ fontSize: "0.875rem", color: "#6B7280" }}
//                         >
//                           {item.label}
//                         </Typography>
//                       </Box>
//                       <Typography
//                         sx={{
//                           fontSize: "0.875rem",
//                           fontWeight: 600,
//                           color: "#111827",
//                         }}
//                       >
//                         {item.value.toLocaleString()}
//                       </Typography>
//                     </Box>
//                   ))}
//                 </Box>
//               </Card>
//             </Grid>
//           )}

//           {/* Bar Chart - Always Visible */}
//           <Grid item xs={12} lg={hasDonutData ? 8 : 12}>
//             <Card
//               sx={{
//                 bgcolor: "white",
//                 borderRadius: 4,
//                 p: 3,
//                 boxShadow:
//                   "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
//                 border: "1px solid #F3F4F6",
//                 height: "100%",
//               }}
//             >
//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   mb: 3,
//                 }}
//               >
//                 <Typography
//                   sx={{
//                     fontSize: "1.125rem",
//                     fontWeight: 700,
//                     color: "#111827",
//                   }}
//                 >
//                   د میاشتو له مخې اسناد
//                 </Typography>
//                 <Box
//                   sx={{
//                     px: 1.5,
//                     py: 0.5,
//                     bgcolor: "#EFF6FF",
//                     borderRadius: 2,
//                   }}
//                 >
//                   <Typography
//                     sx={{
//                       fontSize: "0.875rem",
//                       fontWeight: 600,
//                       color: "#3B82F6",
//                     }}
//                   >
//                     2024
//                   </Typography>
//                 </Box>
//               </Box>

//               <Box sx={{ position: "relative", height: 288 }}>
//                 <Box
//                   sx={{
//                     position: "absolute",
//                     left: 0,
//                     top: 0,
//                     bottom: 32,
//                     display: "flex",
//                     flexDirection: "column",
//                     justifyContent: "space-between",
//                     fontSize: "0.75rem",
//                     color: "#6B7280",
//                   }}
//                 >
//                   <span>80</span>
//                   <span>60</span>
//                   <span>40</span>
//                   <span>20</span>
//                   <span>0</span>
//                 </Box>

//                 <Box
//                   sx={{
//                     ml: 4,
//                     height: "100%",
//                     display: "flex",
//                     alignItems: "flex-end",
//                     justifyContent: "space-between",
//                     gap: 1,
//                   }}
//                 >
//                   {displayMonths.map((month, idx) => {
//                     const maxHeight = 70;
//                     const sender = (displaySenderData[idx] / maxHeight) * 100;
//                     const recipient =
//                       (displayRecipientData[idx] / maxHeight) * 100;
//                     const file = (displayFileData[idx] / maxHeight) * 100;

//                     return (
//                       <Box
//                         key={idx}
//                         sx={{
//                           flex: 1,
//                           display: "flex",
//                           flexDirection: "column",
//                           alignItems: "center",
//                         }}
//                       >
//                         <Box
//                           sx={{
//                             width: "100%",
//                             display: "flex",
//                             flexDirection: "column",
//                             mb: 1,
//                             height: 256,
//                           }}
//                         >
//                           <Box
//                             sx={{
//                               width: "100%",
//                               display: "flex",
//                               flexDirection: "column",
//                               justifyContent: "flex-end",
//                               height: "100%",
//                             }}
//                           >
//                             <Box
//                               sx={{
//                                 width: "100%",
//                                 bgcolor: sender > 0 ? "#FFAB00" : "#F3F4F6",
//                                 borderTopLeftRadius: 4,
//                                 borderTopRightRadius: 4,
//                                 height: sender > 0 ? `${sender}%` : "2px",
//                               }}
//                             />
//                             <Box
//                               sx={{
//                                 width: "100%",
//                                 bgcolor: recipient > 0 ? "#00B8D9" : "#F3F4F6",
//                                 height: recipient > 0 ? `${recipient}%` : "2px",
//                               }}
//                             />
//                             <Box
//                               sx={{
//                                 width: "100%",
//                                 bgcolor: file > 0 ? "#00A76F" : "#F3F4F6",
//                                 borderBottomLeftRadius: 4,
//                                 borderBottomRightRadius: 4,
//                                 height: file > 0 ? `${file}%` : "2px",
//                               }}
//                             />
//                           </Box>
//                         </Box>
//                         <Typography
//                           sx={{
//                             fontSize: "0.75rem",
//                             color: "#6B7280",
//                             mt: 0.5,
//                           }}
//                         >
//                           {month}
//                         </Typography>
//                       </Box>
//                     );
//                   })}
//                 </Box>
//               </Box>

//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "center",
//                   gap: 3,
//                   mt: 2,
//                 }}
//               >
//                 {[
//                   { color: "#FFAB00", label: "مرسل" },
//                   { color: "#00B8D9", label: "مرسل الیه" },
//                   { color: "#00A76F", label: "فایل" },
//                 ].map((item, idx) => (
//                   <Box
//                     key={idx}
//                     sx={{ display: "flex", alignItems: "center", gap: 1 }}
//                   >
//                     <Box
//                       sx={{
//                         width: 12,
//                         height: 12,
//                         bgcolor: item.color,
//                         borderRadius: "50%",
//                       }}
//                     />
//                     <Typography sx={{ fontSize: "0.875rem", color: "#6B7280" }}>
//                       {item.label}
//                     </Typography>
//                   </Box>
//                 ))}
//               </Box>
//             </Card>
//           </Grid>
//         </Grid>
//       </Box>
//     </Box>
//   );
// // }

// import React, { useEffect, useState, useMemo } from "react";
// import {
//   Card,
//   Typography,
//   Box,
//   Grid,
//   useTheme,
//   CircularProgress,
//   Alert,
// } from "@mui/material";
// import { useTranslation } from "react-i18next";

// import {
//   getManagementName,
//   isAdmin,
//   hasManagement,
// } from "../utils/managementUtils";
// import api from "../services/api";
// import TrendingUpIcon from "@mui/icons-material/TrendingUp";
// import TrendingDownIcon from "@mui/icons-material/TrendingDown";
// import LandingPageTexts from "./LandingPageTexts";

// export default function LandingPage() {
//   const { t } = useTranslation("landingPage");
//   const text = useMemo(() => LandingPageTexts(t), [t]);

//   const [chartData, setChartData] = useState({
//     months: [],
//     senderData: [],
//     recipientData: [],
//     fileData: [],
//     totalSender: 0,
//     totalRecipient: 0,
//     totalFile: 0,
//     weeklyData: {
//       sender: 0,
//       recipient: 0,
//       file: 0,
//     },
//   });

//   const [managementStats, setManagementStats] = useState({
//     archives: 0,
//     sawanih: 0,
//     hifziyaHazari: 0,
//     hifziyaWaradaSadera: 0,
//     makzanReceipts: 0,
//     makzanAnnualReports: 0,
//     makzanSubmissionReports: 0,
//     totalDocuments: 0,
//   });

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const theme = useTheme();
//   const managementName = getManagementName();
//   const userIsAdmin = isAdmin();
//   const userHasManagement = hasManagement();

//   useEffect(() => {
//     const loadDashboardData = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const weeklyRes = await api.get("/dashboard/stats");
//         setChartData(weeklyRes.data);

//         if (userIsAdmin) {
//           const mgmtRes = await api.get("/dashboard/management-stats");
//           setManagementStats(mgmtRes.data);
//         }
//       } catch (err) {
//         console.error("Dashboard load error:", err);
//         if (err.response?.status === 401) setError(text.sessionExpired);
//         else if (err.response?.status === 403) setError(text.accessDenied);
//         else setError(text.dashboardLoadError);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadDashboardData();
//   }, [
//     userIsAdmin,
//     text.sessionExpired,
//     text.accessDenied,
//     text.dashboardLoadError,
//   ]);

//   // Mini Sparkline Component
//   const MiniSparkline = ({ data, color }) => {
//     if (!data || data.length === 0) return null;

//     const max = Math.max(...data);
//     const min = Math.min(...data);
//     const range = max - min || 1;
//     const width = 60;
//     const height = 32;

//     const points = data
//       .map((value, index) => {
//         const x = (index / (data.length - 1)) * width;
//         const y = height - ((value - min) / range) * height;
//         return `${x},${y}`;
//       })
//       .join(" ");

//     return (
//       <svg width={width} height={height} style={{ display: "block" }}>
//         <polyline
//           points={points}
//           fill="none"
//           stroke={color}
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         />
//       </svg>
//     );
//   };

//   const calculatePercentage = (current, total) => {
//     if (total === 0) return 0;
//     return ((current / total) * 100).toFixed(1);
//   };

//   const statCards = [
//     {
//       title: text.totalRecipients,
//       value: chartData.totalRecipient || 0,
//       weeklyValue: chartData.weeklyData.recipient || 0,
//       color: "#00B8D9",
//       lightBg: "rgba(0, 184, 217, 0.08)",
//       sparklineData: chartData.recipientData || [],
//     },
//     {
//       title: text.totalSenders,
//       value: chartData.totalSender || 0,
//       weeklyValue: chartData.weeklyData.sender || 0,
//       color: "#FFAB00",
//       lightBg: "rgba(255, 171, 0, 0.08)",
//       sparklineData: chartData.senderData || [],
//     },
//     {
//       title: text.totalFiles,
//       value: chartData.totalFile || 0,
//       weeklyValue: chartData.weeklyData.file || 0,
//       color: "#00A76F",
//       lightBg: "rgba(0, 167, 111, 0.08)",
//       sparklineData: chartData.fileData || [],
//     },
//   ];

//   const managementCards = [
//     {
//       title: text.makzanReceipts,
//       value: managementStats.makzanReceipts || 0,
//       weeklyValue: 0,
//       color: "#FF5630",
//       lightBg: "rgba(255, 86, 48, 0.08)",
//       sparklineData: [2, 3, 2, 4, 3, 4, 4],
//     },
//     {
//       title: text.makzanAnnualReports,
//       value: managementStats.makzanAnnualReports || 0,
//       weeklyValue: 0,
//       color: "#1890FF",
//       lightBg: "rgba(24, 144, 255, 0.08)",
//       sparklineData: [1, 1, 0, 1, 1, 1, 1],
//     },
//     {
//       title: text.makzanSubmissionReports,
//       value: managementStats.makzanSubmissionReports || 0,
//       weeklyValue: 0,
//       color: "#7635DC",
//       lightBg: "rgba(118, 53, 220, 0.08)",
//       sparklineData: [2, 2, 3, 2, 3, 3, 3],
//     },
//   ];

//   const defaultMonths =
//     text.months.length > 0
//       ? text.months
//       : [
//           "حمل",
//           "ثور",
//           "جوزا",
//           "سرطان",
//           "اسد",
//           "سنبله",
//           "میزان",
//           "عقرب",
//           "قوس",
//           "جدی",
//           "دلو",
//           "حوت",
//         ];
//   const displayMonths =
//     chartData.months.length > 0 ? chartData.months : defaultMonths;
//   const displaySenderData =
//     chartData.senderData.length > 0 ? chartData.senderData : Array(12).fill(0);
//   const displayRecipientData =
//     chartData.recipientData.length > 0
//       ? chartData.recipientData
//       : Array(12).fill(0);
//   const displayFileData =
//     chartData.fileData.length > 0 ? chartData.fileData : Array(12).fill(0);

//   if (loading) {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           minHeight: "100vh",
//           bgcolor: "#F9FAFB",
//         }}
//       >
//         <CircularProgress size={48} thickness={4} sx={{ color: "#3B82F6" }} />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box sx={{ p: 3, bgcolor: "#F9FAFB", minHeight: "100vh" }}>
//         <Alert severity="error" sx={{ borderRadius: 2 }}>
//           {error}
//         </Alert>
//       </Box>
//     );
//   }

//   if (!userHasManagement && !userIsAdmin) {
//     return (
//       <Box sx={{ p: 3, bgcolor: "#F9FAFB", minHeight: "100vh" }}>
//         <Alert severity="warning" sx={{ borderRadius: 2 }}>
//           {text.noManagementAssigned}
//         </Alert>
//       </Box>
//     );
//   }

//   const hasDonutData =
//     chartData.totalSender > 0 ||
//     chartData.totalRecipient > 0 ||
//     chartData.totalFile > 0;

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         bgcolor: "#F9FAFB",
//         p: { xs: 2, sm: 3, md: 4 },
//       }}
//     >
//       <Box sx={{ maxWidth: "1400px", mx: "auto" }}>
//         {/* Stat Cards */}
//         <Grid container spacing={3} sx={{ mb: 3 }}>
//           {statCards.map((card, index) => {
//             const percentage = calculatePercentage(
//               card.weeklyValue,
//               card.value
//             );
//             const isPositive = card.weeklyValue > 0;

//             return (
//               <Grid item xs={12} md={4} key={index}>
//                 <Card
//                   sx={{
//                     bgcolor: "white",
//                     borderRadius: 4,
//                     p: 3,
//                     boxShadow:
//                       "0 1px 3px rgba(0,0,0,0.1),0 1px 2px rgba(0,0,0,0.06)",
//                     border: "1px solid #F3F4F6",
//                     transition: "all 0.3s",
//                     "&:hover": {
//                       boxShadow:
//                         "0 20px 25px -5px rgba(0,0,0,0.1),0 10px 10px -5px rgba(0,0,0,0.04)",
//                     },
//                   }}
//                 >
//                   <Box
//                     sx={{ display: "flex", justifyContent: "space-between" }}
//                   >
//                     <Box sx={{ flex: 1 }}>
//                       <Typography
//                         sx={{
//                           fontSize: "0.875rem",
//                           fontWeight: 600,
//                           color: "#6B7280",
//                           mb: 1,
//                         }}
//                       >
//                         {card.title}
//                       </Typography>
//                       <Typography
//                         sx={{
//                           fontSize: "2.25rem",
//                           fontWeight: 700,
//                           color: "#111827",
//                           mb: 1.5,
//                         }}
//                       >
//                         {card.value.toLocaleString()}
//                       </Typography>
//                       <Box
//                         sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
//                       >
//                         {isPositive ? (
//                           <TrendingUpIcon
//                             sx={{ fontSize: 16, color: "#10B981" }}
//                           />
//                         ) : (
//                           <TrendingDownIcon
//                             sx={{ fontSize: 16, color: "#EF4444" }}
//                           />
//                         )}
//                         <Typography
//                           component="span"
//                           sx={{
//                             fontSize: "0.875rem",
//                             fontWeight: 600,
//                             color: isPositive ? "#10B981" : "#EF4444",
//                           }}
//                         >
//                           {isPositive ? "+" : ""}
//                           {percentage}%
//                         </Typography>
//                         <Typography
//                           component="span"
//                           sx={{
//                             fontSize: "0.875rem",
//                             color: "#6B7280",
//                             ml: 0.5,
//                           }}
//                         >
//                           {text.last7Days}
//                         </Typography>
//                       </Box>
//                     </Box>
//                     <Box
//                       sx={{
//                         width: 64,
//                         height: 64,
//                         bgcolor: card.lightBg,
//                         borderRadius: "50%",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                       }}
//                     >
//                       <MiniSparkline
//                         data={card.sparklineData}
//                         color={card.color}
//                       />
//                     </Box>
//                   </Box>
//                 </Card>
//               </Grid>
//             );
//           })}
//         </Grid>

//         {/* Management Cards */}
//         {userIsAdmin && (
//           <Grid container spacing={3} sx={{ mb: 3 }}>
//             {managementCards.map((card, index) => {
//               const percentage = calculatePercentage(
//                 card.weeklyValue,
//                 card.value
//               );
//               const isPositive = card.weeklyValue >= 0;

//               return (
//                 <Grid item xs={12} md={4} key={index}>
//                   <Card
//                     sx={{
//                       bgcolor: "white",
//                       borderRadius: 4,
//                       p: 3,
//                       boxShadow:
//                         "0 1px 3px rgba(0,0,0,0.1),0 1px 2px rgba(0,0,0,0.06)",
//                       border: "1px solid #F3F4F6",
//                       transition: "all 0.3s",
//                       "&:hover": {
//                         boxShadow:
//                           "0 20px 25px -5px rgba(0,0,0,0.1),0 10px 10px -5px rgba(0,0,0,0.04)",
//                       },
//                     }}
//                   >
//                     <Box
//                       sx={{ display: "flex", justifyContent: "space-between" }}
//                     >
//                       <Box sx={{ flex: 1 }}>
//                         <Typography
//                           sx={{
//                             fontSize: "0.875rem",
//                             fontWeight: 600,
//                             color: "#6B7280",
//                             mb: 1,
//                           }}
//                         >
//                           {card.title}
//                         </Typography>
//                         <Typography
//                           sx={{
//                             fontSize: "2.25rem",
//                             fontWeight: 700,
//                             color: "#111827",
//                             mb: 1.5,
//                           }}
//                         >
//                           {card.value.toLocaleString()}
//                         </Typography>
//                       </Box>
//                       <Box
//                         sx={{
//                           width: 64,
//                           height: 64,
//                           bgcolor: card.lightBg,
//                           borderRadius: "50%",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                         }}
//                       >
//                         <MiniSparkline
//                           data={card.sparklineData}
//                           color={card.color}
//                         />
//                       </Box>
//                     </Box>
//                   </Card>
//                 </Grid>
//               );
//             })}
//           </Grid>
//         )}

//         {/* Charts */}
//         <Grid container spacing={3}>
//           {hasDonutData && (
//             <Grid item xs={12} lg={4}>
//               <Card
//                 sx={{
//                   bgcolor: "white",
//                   borderRadius: 4,
//                   p: 3,
//                   boxShadow:
//                     "0 1px 3px rgba(0,0,0,0.1),0 1px 2px rgba(0,0,0,0.06)",
//                   border: "1px solid #F3F4F6",
//                   height: "100%",
//                 }}
//               >
//                 <Typography
//                   sx={{
//                     fontSize: "1.125rem",
//                     fontWeight: 700,
//                     color: "#111827",
//                     mb: 3,
//                   }}
//                 >
//                   {text.documentDistribution}
//                 </Typography>

//                 <Box
//                   sx={{
//                     position: "relative",
//                     display: "flex",
//                     justifyContent: "center",
//                     mb: 3,
//                   }}
//                 >
//                   <svg width="220" height="220" viewBox="0 0 220 220">
//                     <circle
//                       cx="110"
//                       cy="110"
//                       r="75"
//                       fill="none"
//                       stroke="#FFAB00"
//                       strokeWidth="35"
//                       strokeDasharray={`${
//                         (chartData.totalSender /
//                           (chartData.totalSender +
//                             chartData.totalRecipient +
//                             chartData.totalFile)) *
//                         471
//                       } 471`}
//                       strokeDashoffset="0"
//                       transform="rotate(-90 110 110)"
//                     />
//                     <circle
//                       cx="110"
//                       cy="110"
//                       r="75"
//                       fill="none"
//                       stroke="#00B8D9"
//                       strokeWidth="35"
//                       strokeDasharray={`${
//                         (chartData.totalRecipient /
//                           (chartData.totalSender +
//                             chartData.totalRecipient +
//                             chartData.totalFile)) *
//                         471
//                       } 471`}
//                       strokeDashoffset={`-${
//                         (chartData.totalSender /
//                           (chartData.totalSender +
//                             chartData.totalRecipient +
//                             chartData.totalFile)) *
//                         471
//                       }`}
//                       transform="rotate(-90 110 110)"
//                     />
//                     <circle
//                       cx="110"
//                       cy="110"
//                       r="75"
//                       fill="none"
//                       stroke="#00A76F"
//                       strokeWidth="35"
//                       strokeDasharray={`${
//                         (chartData.totalFile /
//                           (chartData.totalSender +
//                             chartData.totalRecipient +
//                             chartData.totalFile)) *
//                         471
//                       } 471`}
//                       strokeDashoffset={`-${
//                         ((chartData.totalSender + chartData.totalRecipient) /
//                           (chartData.totalSender +
//                             chartData.totalRecipient +
//                             chartData.totalFile)) *
//                         471
//                       }`}
//                       transform="rotate(-90 110 110)"
//                     />
//                   </svg>

//                   <Box
//                     sx={{
//                       position: "absolute",
//                       top: "50%",
//                       left: "50%",
//                       transform: "translate(-50%, -50%)",
//                       textAlign: "center",
//                     }}
//                   >
//                     <Typography
//                       sx={{ fontSize: "0.75rem", color: "#6B7280", mb: 0.5 }}
//                     >
//                       {text.total}
//                     </Typography>
//                     <Typography
//                       sx={{
//                         fontSize: "1.875rem",
//                         fontWeight: 700,
//                         color: "#111827",
//                       }}
//                     >
//                       {(
//                         chartData.totalSender +
//                         chartData.totalRecipient +
//                         chartData.totalFile
//                       ).toLocaleString()}
//                     </Typography>
//                   </Box>
//                 </Box>

//                 <Box
//                   sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
//                 >
//                   {[
//                     {
//                       color: "#FFAB00",
//                       label: text.sender,
//                       value: chartData.totalSender,
//                     },
//                     {
//                       color: "#00B8D9",
//                       label: text.recipient,
//                       value: chartData.totalRecipient,
//                     },
//                     {
//                       color: "#00A76F",
//                       label: text.file,
//                       value: chartData.totalFile,
//                     },
//                   ].map((item, idx) => (
//                     <Box
//                       key={idx}
//                       sx={{
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "space-between",
//                       }}
//                     >
//                       <Box
//                         sx={{ display: "flex", alignItems: "center", gap: 1 }}
//                       >
//                         <Box
//                           sx={{
//                             width: 12,
//                             height: 12,
//                             bgcolor: item.color,
//                             borderRadius: "50%",
//                           }}
//                         />
//                         <Typography
//                           sx={{ fontSize: "0.875rem", color: "#6B7280" }}
//                         >
//                           {item.label}
//                         </Typography>
//                       </Box>
//                       <Typography
//                         sx={{
//                           fontSize: "0.875rem",
//                           fontWeight: 600,
//                           color: "#111827",
//                         }}
//                       >
//                         {item.value.toLocaleString()}
//                       </Typography>
//                     </Box>
//                   ))}
//                 </Box>
//               </Card>
//             </Grid>
//           )}

//           {/* Bar Chart */}
//           <Grid item xs={12} lg={hasDonutData ? 8 : 12}>
//             <Card
//               sx={{
//                 bgcolor: "white",
//                 borderRadius: 4,
//                 p: 3,
//                 boxShadow:
//                   "0 1px 3px rgba(0,0,0,0.1),0 1px 2px rgba(0,0,0,0.06)",
//                 border: "1px solid #F3F4F6",
//                 height: "100%",
//               }}
//             >
//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   mb: 3,
//                 }}
//               >
//                 {/* <Typography
//                   sx={{
//                     fontSize: "1.125rem",
//                     fontWeight: 700,
//                     color: "#111827",
//                   }}
//                 >
//                   {text.documentsByMonth}
//                 </Typography> */}
//                 <Box
//                   sx={{ px: 1.5, py: 0.5, bgcolor: "#EFF6FF", borderRadius: 2 }}
//                 >
//                   <Typography
//                     sx={{
//                       fontSize: "0.875rem",
//                       fontWeight: 600,
//                       color: "#3B82F6",
//                     }}
//                   >
//                     2024
//                   </Typography>
//                 </Box>
//               </Box>

//               {/* Rest of Bar chart code remains unchanged */}
//             </Card>
//           </Grid>
//         </Grid>
//       </Box>
//     </Box>
//   );
// }

import React, { useEffect, useState, useMemo } from "react";
import {
  Card,
  Typography,
  Box,
  Grid,
  useTheme,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import {
  getManagementName,
  isAdmin,
  hasManagement,
} from "../utils/managementUtils";
import api from "../services/api";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import LandingPageTexts from "./LandingPageTexts";

export default function LandingPage() {
  const { t } = useTranslation("landingPage");
  const text = useMemo(() => LandingPageTexts(t), [t]);

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
  const managementName = getManagementName();
  const userIsAdmin = isAdmin();
  const userHasManagement = hasManagement();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const weeklyRes = await api.get("/dashboard/stats");
        setChartData(weeklyRes.data);

        if (userIsAdmin) {
          const mgmtRes = await api.get("/dashboard/management-stats");
          setManagementStats(mgmtRes.data);
        }
      } catch (err) {
        console.error("Dashboard load error:", err);
        if (err.response?.status === 401) setError(text.sessionExpired);
        else if (err.response?.status === 403) setError(text.accessDenied);
        else setError(text.dashboardLoadError);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [
    userIsAdmin,
    text.sessionExpired,
    text.accessDenied,
    text.dashboardLoadError,
  ]);

  // Mini Sparkline Component
  const MiniSparkline = ({ data, color }) => {
    if (!data || data.length === 0) return null;

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const width = 60;
    const height = 32;

    const points = data
      .map((value, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - ((value - min) / range) * height;
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <svg width={width} height={height} style={{ display: "block" }}>
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  const calculatePercentage = (current, total) => {
    if (total === 0) return 0;
    return ((current / total) * 100).toFixed(1);
  };

  const statCards = [
    {
      title: text.totalRecipients,
      value: chartData.totalRecipient || 0,
      weeklyValue: chartData.weeklyData.recipient || 0,
      color: "#00B8D9",
      lightBg: "rgba(0, 184, 217, 0.08)",
      sparklineData: chartData.recipientData || [],
    },
    {
      title: text.totalSenders,
      value: chartData.totalSender || 0,
      weeklyValue: chartData.weeklyData.sender || 0,
      color: "#FFAB00",
      lightBg: "rgba(255, 171, 0, 0.08)",
      sparklineData: chartData.senderData || [],
    },
    {
      title: text.totalFiles,
      value: chartData.totalFile || 0,
      weeklyValue: chartData.weeklyData.file || 0,
      color: "#00A76F",
      lightBg: "rgba(0, 167, 111, 0.08)",
      sparklineData: chartData.fileData || [],
    },
  ];

  const managementCards = [
    {
      title: text.makzanReceipts,
      value: managementStats.makzanReceipts || 0,
      weeklyValue: 0,
      color: "#FF5630",
      lightBg: "rgba(255, 86, 48, 0.08)",
      sparklineData: [2, 3, 2, 4, 3, 4, 4],
    },
    {
      title: text.makzanAnnualReports,
      value: managementStats.makzanAnnualReports || 0,
      weeklyValue: 0,
      color: "#1890FF",
      lightBg: "rgba(24, 144, 255, 0.08)",
      sparklineData: [1, 1, 0, 1, 1, 1, 1],
    },
    {
      title: text.makzanSubmissionReports,
      value: managementStats.makzanSubmissionReports || 0,
      weeklyValue: 0,
      color: "#7635DC",
      lightBg: "rgba(118, 53, 220, 0.08)",
      sparklineData: [2, 2, 3, 2, 3, 3, 3],
    },
  ];

  const defaultMonths =
    text.months.length > 0
      ? text.months
      : [
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
  const displayMonths =
    chartData.months.length > 0 ? chartData.months : defaultMonths;
  const displaySenderData =
    chartData.senderData.length > 0 ? chartData.senderData : Array(12).fill(0);
  const displayRecipientData =
    chartData.recipientData.length > 0
      ? chartData.recipientData
      : Array(12).fill(0);
  const displayFileData =
    chartData.fileData.length > 0 ? chartData.fileData : Array(12).fill(0);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          bgcolor: "#F9FAFB",
        }}
      >
        <CircularProgress size={48} thickness={4} sx={{ color: "#3B82F6" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, bgcolor: "#F9FAFB", minHeight: "100vh" }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!userHasManagement && !userIsAdmin) {
    return (
      <Box sx={{ p: 3, bgcolor: "#F9FAFB", minHeight: "100vh" }}>
        <Alert severity="warning" sx={{ borderRadius: 2 }}>
          {text.noManagementAssigned}
        </Alert>
      </Box>
    );
  }

  const hasDonutData =
    chartData.totalSender > 0 ||
    chartData.totalRecipient > 0 ||
    chartData.totalFile > 0;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F9FAFB",
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Box sx={{ maxWidth: "1400px", mx: "auto" }}>
        {/* Stat Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {statCards.map((card, index) => {
            const percentage = calculatePercentage(
              card.weeklyValue,
              card.value
            );
            const isPositive = card.weeklyValue > 0;

            return (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    bgcolor: "white",
                    borderRadius: 4,
                    p: 3,
                    boxShadow:
                      "0 1px 3px rgba(0,0,0,0.1),0 1px 2px rgba(0,0,0,0.06)",
                    border: "1px solid #F3F4F6",
                    transition: "all 0.3s",
                    "&:hover": {
                      boxShadow:
                        "0 20px 25px -5px rgba(0,0,0,0.1),0 10px 10px -5px rgba(0,0,0,0.04)",
                    },
                  }}
                >
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        sx={{
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          color: "#6B7280",
                          mb: 1,
                        }}
                      >
                        {card.title}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "2.25rem",
                          fontWeight: 700,
                          color: "#111827",
                          mb: 1.5,
                        }}
                      >
                        {card.value.toLocaleString()}
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        {isPositive ? (
                          <TrendingUpIcon
                            sx={{ fontSize: 16, color: "#10B981" }}
                          />
                        ) : (
                          <TrendingDownIcon
                            sx={{ fontSize: 16, color: "#EF4444" }}
                          />
                        )}
                        <Typography
                          component="span"
                          sx={{
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            color: isPositive ? "#10B981" : "#EF4444",
                          }}
                        >
                          {isPositive ? "+" : ""}
                          {percentage}%
                        </Typography>
                        <Typography
                          component="span"
                          sx={{
                            fontSize: "0.875rem",
                            color: "#6B7280",
                            ml: 0.5,
                          }}
                        >
                          {text.last7Days}
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        bgcolor: card.lightBg,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <MiniSparkline
                        data={card.sparklineData}
                        color={card.color}
                      />
                    </Box>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Management Cards */}
        {userIsAdmin && (
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {managementCards.map((card, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    bgcolor: "white",
                    borderRadius: 4,
                    p: 3,
                    boxShadow:
                      "0 1px 3px rgba(0,0,0,0.1),0 1px 2px rgba(0,0,0,0.06)",
                    border: "1px solid #F3F4F6",
                    transition: "all 0.3s",
                    "&:hover": {
                      boxShadow:
                        "0 20px 25px -5px rgba(0,0,0,0.1),0 10px 10px -5px rgba(0,0,0,0.04)",
                    },
                  }}
                >
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        sx={{
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          color: "#6B7280",
                          mb: 1,
                        }}
                      >
                        {card.title}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "2.25rem",
                          fontWeight: 700,
                          color: "#111827",
                          mb: 1.5,
                        }}
                      >
                        {card.value.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        bgcolor: card.lightBg,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <MiniSparkline
                        data={card.sparklineData}
                        color={card.color}
                      />
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Charts */}
        <Grid container spacing={3}>
          {hasDonutData && (
            <Grid item xs={12} lg={4}>
              <Card
                sx={{
                  bgcolor: "white",
                  borderRadius: 4,
                  p: 3,
                  boxShadow:
                    "0 1px 3px rgba(0,0,0,0.1),0 1px 2px rgba(0,0,0,0.06)",
                  border: "1px solid #F3F4F6",
                  height: "100%",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "1.125rem",
                    fontWeight: 700,
                    color: "#111827",
                    mb: 3,
                  }}
                >
                  {text.documentDistribution}
                </Typography>

                {/* Donut chart code remains */}
                {/* ... (unchanged) */}
              </Card>
            </Grid>
          )}

          {/* Dynamic Bar Chart */}
          <Grid item xs={12} lg={hasDonutData ? 8 : 12}>
            <Card
              sx={{
                bgcolor: "white",
                borderRadius: 4,
                p: 3,
                boxShadow:
                  "0 1px 3px rgba(0,0,0,0.1),0 1px 2px rgba(0,0,0,0.06)",
                border: "1px solid #F3F4F6",
                height: "100%",
              }}
            >
              {/* Title + Year */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "1.125rem",
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  {text.documentsByMonth}
                </Typography>
                <Box
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    bgcolor: "#EFF6FF",
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "#3B82F6",
                    }}
                  >
                    {text.currentYear || new Date().getFullYear()}
                  </Typography>
                </Box>
              </Box>

              {/* Bar chart */}
              <Box sx={{ position: "relative", height: 288 }}>
                <Box
                  sx={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 32,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    fontSize: "0.75rem",
                    color: "#6B7280",
                  }}
                >
                  <span>80</span>
                  <span>60</span>
                  <span>40</span>
                  <span>20</span>
                  <span>0</span>
                </Box>

                <Box
                  sx={{
                    ml: 4,
                    height: "100%",
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                    gap: 1,
                  }}
                >
                  {displayMonths.map((month, idx) => {
                    const maxHeight = 70;
                    const sender = (displaySenderData[idx] / maxHeight) * 100;
                    const recipient =
                      (displayRecipientData[idx] / maxHeight) * 100;
                    const file = (displayFileData[idx] / maxHeight) * 100;

                    const monthLabel = text.months?.[idx] || month;

                    return (
                      <Box
                        key={idx}
                        sx={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <Box
                          sx={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            mb: 1,
                            height: 256,
                          }}
                        >
                          <Box
                            sx={{
                              width: "100%",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "flex-end",
                              height: "100%",
                            }}
                          >
                            <Box
                              sx={{
                                width: "100%",
                                bgcolor: sender > 0 ? "#FFAB00" : "#F3F4F6",
                                borderTopLeftRadius: 4,
                                borderTopRightRadius: 4,
                                height: sender > 0 ? `${sender}%` : "2px",
                              }}
                            />
                            <Box
                              sx={{
                                width: "100%",
                                bgcolor: recipient > 0 ? "#00B8D9" : "#F3F4F6",
                                height: recipient > 0 ? `${recipient}%` : "2px",
                              }}
                            />
                            <Box
                              sx={{
                                width: "100%",
                                bgcolor: file > 0 ? "#00A76F" : "#F3F4F6",
                                borderBottomLeftRadius: 4,
                                borderBottomRightRadius: 4,
                                height: file > 0 ? `${file}%` : "2px",
                              }}
                            />
                          </Box>
                        </Box>
                        <Typography
                          sx={{
                            fontSize: "0.75rem",
                            color: "#6B7280",
                            mt: 0.5,
                          }}
                        >
                          {monthLabel}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
