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
  TablePagination,
} from "@mui/material";
import { Button } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import { useParams } from "react-router-dom";
import api from "../../services/api";
import moment from "moment";

const AuditLogsDetails = () => {
  const { recordId } = useParams();
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/audit/note/${recordId}`);
      setAuditLogs(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Error fetching logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (recordId) fetchLogs();
  }, [recordId]);

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
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
        <Button
          startIcon={<ArrowBack />}
          variant="outlined"
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </Box>

      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Audit Logs for Record ID — {recordId}
      </Typography>

      <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
        {loading ? (
          <Box
            sx={{
              height: 400,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : auditLogs.length === 0 ? (
          <Box sx={{ p: 3 }}>
            <Alert severity="info">No logs found for this record.</Alert>
          </Box>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Username</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Table</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Record ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Content</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Timestamp</TableCell>
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
                        <TableCell>{log.tableName || "—"}</TableCell>
                        <TableCell>{log.recordId || "—"}</TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {log.recordContent || "—"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {moment(log.timestamp).format(
                              "MMM DD, YYYY hh:mm A"
                            )}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={auditLogs.length}
              page={page}
              onPageChange={(e, p) => setPage(p)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </>
        )}
      </Card>
    </Box>
  );
};

export default AuditLogsDetails;
