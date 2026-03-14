// import React, { useEffect, useState } from "react";
// import api from "../../services/api";
// import { Link } from "react-router-dom";
// import { DataGrid } from "@mui/x-data-grid";
// import { Blocks } from "react-loader-spinner";
// import toast from "react-hot-toast";
// import { auditLogsTruncateTexts } from "../../utils/truncateText.js";
// import { auditLogcolumns } from "../../utils/auditLogColumns.js";

// import Errors from "../Errors.js";
// import moment from "moment";

// // // ---------------- Columns ----------------
// // export const auditLogcolumns = [
// //   {
// //     field: "action",
// //     headerName: "Action",
// //     width: 160,
// //     headerAlign: "center",
// //     align: "center",
// //     headerClassName: "text-black font-semibold border",
// //     cellClassName: "text-slate-700 font-normal border",
// //   },
// //   {
// //     field: "username",
// //     headerName: "UserName",
// //     width: 180,
// //     headerAlign: "center",
// //     align: "center",
// //     headerClassName: "text-black font-semibold border",
// //     cellClassName: "text-slate-700 font-normal border",
// //   },
// //   {
// //     field: "timestamp",
// //     headerName: "TimeStamp",
// //     width: 220,
// //     headerAlign: "center",
// //     align: "center",
// //     headerClassName: "text-black font-semibold border",
// //     cellClassName: "text-slate-700 font-normal border",
// //   },
// //   {
// //     field: "recordId",
// //     headerName: "Record ID",
// //     width: 160,
// //     headerAlign: "center",
// //     align: "center",
// //     headerClassName: "text-black font-semibold border",
// //     cellClassName: "text-slate-700 font-normal border",
// //   },
// //   {
// //     field: "recordContent",
// //     headerName: "Note Content",
// //     width: 260,
// //     headerAlign: "center",
// //     align: "center",
// //     headerClassName: "text-black font-semibold border",
// //     cellClassName: "text-slate-700 font-normal border",
// //     renderCell: (params) => {
// //       const text = params?.value || "—";
// //       return (
// //         <p className="text-slate-700 text-center">
// //           {auditLogsTruncateTexts(text)}
// //         </p>
// //       );
// //     },
// //   },
// //   {
// //     field: "view",
// //     headerName: "Action",
// //     width: 150,
// //     headerAlign: "center",
// //     align: "center",
// //     sortable: false,
// //     renderCell: (params) => (
// //       <Link
// //         to={`/admin/audit-logs/${params.row.recordId}`}
// //         className="h-full flex justify-center items-center"
// //       >
// //         <button className="bg-btnColor text-white px-4 h-9 rounded-md">
// //           View
// //         </button>
// //       </Link>
// //     ),
// //   },
// // ];

// // ---------------- Component ----------------
// const AdminAuditLogs = () => {
//   const [auditLogs, setAuditLogs] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const fetchAuditLogs = async () => {
//     setLoading(true);
//     try {
//       const response = await api.get("/audit");
//       setAuditLogs(response.data);
//     } catch (err) {
//       setError(err?.response?.data?.message);
//       toast.error("Error fetching audit logs");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAuditLogs();
//   }, []);

//   const rows = auditLogs.map((item) => ({
//     id: item.id,
//     action: item.action,
//     username: item.username,
//     tableName: item.tableName,
//     recordId: item.recordId,
//     recordContent: item.recordContent,
//     timestamp: moment(item.timestamp).format("MMMM DD, YYYY, hh:mm A"),
//   }));

//   if (error) return <Errors message={error} />;

//   return (
//     <div className="p-4">
//       <div className="py-4">
//         <h1 className="text-center text-2xl font-bold text-slate-800 uppercase">
//           Audit Logs
//         </h1>
//       </div>

//       {loading ? (
//         <div className="flex flex-col justify-center items-center h-72">
//           <Blocks height="70" width="70" color="#4fa94d" visible={true} />
//           <span>Please wait...</span>
//         </div>
//       ) : (
//         <div className="overflow-x-auto w-full mx-auto">
//           <DataGrid
//             className="w-fit mx-auto px-0"
//             rows={rows}
//             columns={auditLogcolumns}
//             initialState={{ pagination: { paginationModel: { pageSize: 6 } } }}
//             pageSizeOptions={[6]}
//             disableRowSelectionOnClick
//             disableColumnResize
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminAuditLogs;
import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  Button,
  TablePagination,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";
import moment from "moment";

const AdminAuditLogs = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const navigate = useNavigate();

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      const response = await api.get("/audit");
      setAuditLogs(response.data);
    } catch (err) {
      setError(err?.response?.data?.message);
      toast.error("Error fetching audit logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return "—";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  const getActionColor = (action) => {
    switch (action) {
      case "CREATE":
        return "success";
      case "UPDATE":
        return "info";
      case "DELETE":
        return "error";
      default:
        return "default";
    }
  };

  if (error) {
    return (
      <Box sx={{ padding: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Audit Logs
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Track all system activities including create, update, and delete
        operations across all tables.
      </Alert>

      {/* Statistics Cards */}
      <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Card sx={{ padding: 2, minWidth: 150, boxShadow: 2 }}>
          <Typography variant="h6" color="success.main">
            CREATE
          </Typography>
          <Typography variant="h4">
            {auditLogs.filter((log) => log.action === "CREATE").length}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            New Records
          </Typography>
        </Card>
        <Card sx={{ padding: 2, minWidth: 150, boxShadow: 2 }}>
          <Typography variant="h6" color="info.main">
            UPDATE
          </Typography>
          <Typography variant="h4">
            {auditLogs.filter((log) => log.action === "UPDATE").length}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Modified Records
          </Typography>
        </Card>
        <Card sx={{ padding: 2, minWidth: 150, boxShadow: 2 }}>
          <Typography variant="h6" color="error.main">
            DELETE
          </Typography>
          <Typography variant="h4">
            {auditLogs.filter((log) => log.action === "DELETE").length}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Deleted Records
          </Typography>
        </Card>
        <Card
          sx={{
            padding: 2,
            minWidth: 150,
            boxShadow: 2,
            bgcolor: "primary.light",
          }}
        >
          <Typography variant="h6">Total Logs</Typography>
          <Typography variant="h4">{auditLogs.length}</Typography>
          <Typography variant="caption">All Activities</Typography>
        </Card>
      </Box>

      {/* Audit Logs Table */}
      <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "400px",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Username</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Table/Model</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Record ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Content</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Timestamp</TableCell>
                    <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {auditLogs
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((log) => (
                      <TableRow key={log.id} hover>
                        <TableCell>
                          <Chip
                            label={log.action}
                            size="small"
                            color={getActionColor(log.action)}
                          />
                        </TableCell>
                        <TableCell>{log.username || "—"}</TableCell>
                        <TableCell>
                          <Chip
                            label={log.tableName || "—"}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        </TableCell>
                        <TableCell>{log.recordId || "—"}</TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {truncateText(log.recordContent)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{ color: "text.secondary" }}
                          >
                            {moment(log.timestamp).format(
                              "MMM DD, YYYY hh:mm A"
                            )}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<Visibility />}
                            onClick={() =>
                              navigate(`/admin/audit-logs/${log.recordId}`)
                            }
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={auditLogs.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Card>
    </Box>
  );
};

export default AdminAuditLogs;
