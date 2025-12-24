import React, { useState, useEffect } from "react";
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
  Select,
  MenuItem,
  Button,
  Chip,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  getAllManagements,
  assignUserToManagement,
  getManagementStatistics,
} from "../../services/ManagementApi";
import api from "../../services/api";
import toast from "react-hot-toast";

const UserManagementPanel = () => {
  const [users, setUsers] = useState([]);
  const [managements, setManagements] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedManagements, setSelectedManagements] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Fetch all users
      const usersRes = await api.get("/admin/users");

      // Fetch managements
      const managementsRes = await getAllManagements();

      // Fetch statistics
      const statsRes = await getManagementStatistics();

      setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
      setManagements(Array.isArray(managementsRes) ? managementsRes : []);
      setStatistics(statsRes);

      // Initialize selected managements
      const initialSelections = {};
      usersRes.data.forEach((user) => {
        initialSelections[user.userId] = user.management?.managementId || "";
      });
      setSelectedManagements(initialSelections);
    } catch (error) {
      console.error("Failed to load data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleManagementChange = (userId, managementId) => {
    setSelectedManagements((prev) => ({
      ...prev,
      [userId]: managementId,
    }));
  };

  const handleAssignManagement = async (userId) => {
    const managementId = selectedManagements[userId];
    if (!managementId) {
      toast.error("Please select a management");
      return;
    }

    try {
      await assignUserToManagement(userId, managementId);
      toast.success("Management assigned successfully!");
      loadData(); // Reload to get updated data
    } catch (error) {
      console.error("Failed to assign management:", error);
      toast.error("Failed to assign management");
    }
  };

  if (loading) {
    return (
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
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        User Management Assignment
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Assign each user to a management department. Users can only access data
        from their assigned management. Admins have access to all managements.
      </Alert>

      {/* Statistics Cards */}
      {statistics && (
        <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
          {statistics.managementStatistics?.map((stat) => (
            <Card
              key={stat.managementId}
              sx={{ padding: 2, minWidth: 200, boxShadow: 2 }}
            >
              <Typography variant="h6" color="primary">
                {stat.managementName}
              </Typography>
              <Typography variant="h4">{stat.userCount}</Typography>
              <Typography variant="caption" color="text.secondary">
                Users assigned
              </Typography>
            </Card>
          ))}
          <Card
            sx={{
              padding: 2,
              minWidth: 200,
              boxShadow: 2,
              bgcolor: "warning.light",
            }}
          >
            <Typography variant="h6">Unassigned</Typography>
            <Typography variant="h4">
              {statistics.unassignedUserCount}
            </Typography>
            <Typography variant="caption">Users without management</Typography>
          </Card>
        </Box>
      )}

      {/* Users Table */}
      <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: 600 }}>Username</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  Current Management
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  Assign New Management
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => {
                // Check if user is admin (handle both formats)
                const roleString = user.role?.roleName || "";
                const isAdmin =
                  roleString === "ROLE_ADMIN" ||
                  roleString === "ADMIN" ||
                  user.role?.isAdmin === true;

                const currentManagement = user.management;

                // Clean role name for display
                const displayRole = roleString.replace("ROLE_", "");

                return (
                  <TableRow key={user.userId} hover>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography>{user.userName}</Typography>
                        {isAdmin && (
                          <Chip label="Admin" size="small" color="error" />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography>{user.email}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={displayRole}
                        size="small"
                        color={isAdmin ? "error" : "default"}
                      />
                    </TableCell>
                    <TableCell>
                      {isAdmin ? (
                        <Chip
                          label="All Managements"
                          color="success"
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      ) : currentManagement ? (
                        <Chip
                          label={currentManagement.managementName}
                          color="primary"
                          size="small"
                        />
                      ) : (
                        <Typography sx={{ color: "text.secondary" }}>
                          Not Assigned
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {isAdmin ? (
                        <Typography
                          sx={{ color: "text.secondary", fontStyle: "italic" }}
                        >
                          Admin has access to all
                        </Typography>
                      ) : (
                        <FormControl size="small" sx={{ minWidth: 200 }}>
                          <InputLabel>Select Management</InputLabel>
                          <Select
                            value={selectedManagements[user.userId] || ""}
                            onChange={(e) =>
                              handleManagementChange(
                                user.userId,
                                e.target.value
                              )
                            }
                            label="Select Management"
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            {managements.map((mgmt) => (
                              <MenuItem
                                key={mgmt.managementId}
                                value={mgmt.managementId}
                              >
                                {mgmt.managementName}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    </TableCell>
                    <TableCell>
                      {isAdmin ? (
                        <Typography
                          sx={{ color: "text.secondary", fontSize: "0.875rem" }}
                        >
                          No action needed
                        </Typography>
                      ) : (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleAssignManagement(user.userId)}
                          disabled={
                            !selectedManagements[user.userId] ||
                            selectedManagements[user.userId] ===
                              currentManagement?.managementId
                          }
                          sx={{
                            backgroundColor: "#4e79a7",
                            "&:hover": { backgroundColor: "#3d5f85" },
                          }}
                        >
                          Assign
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default UserManagementPanel;
