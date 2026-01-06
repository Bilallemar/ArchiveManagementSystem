import React, { useState, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-hot-toast";
import api from "../../services/api";

export default function MasterDataManagement() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        د معلوماتو مدیریت
      </Typography>

      <Card>
        <Tabs
          value={activeTab}
          onChange={(e, v) => setActiveTab(v)}
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="ادارې (Organizations)" />
          <Tab label="څانګې (Departments)" />
          <Tab label="ډولونه (Types)" />
          <Tab label="فرعی ډولونه (Sub Types)" />
        </Tabs>

        <CardContent>
          {activeTab === 0 && <OrgManagement />}
          {activeTab === 1 && <DepartmentManagement />}
          {activeTab === 2 && <TypeManagement />}
          {activeTab === 3 && <SubTypeManagement />}
        </CardContent>
      </Card>
    </Box>
  );
}

// ================ ORGANIZATION MANAGEMENT ================
function OrgManagement() {
  const [orgs, setOrgs] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState(null);
  const [formData, setFormData] = useState({ name: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadOrgs();
  }, []);

  const loadOrgs = async () => {
    try {
      const response = await api.get("/org");
      setOrgs(response.data);
    } catch (error) {
      console.error("Error loading orgs:", error);
      toast.error("د ادارو لوډولو کې ستونزه");
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error("نوم ضروری دی");
      return;
    }

    setLoading(true);
    try {
      if (editingOrg) {
        await api.put(`/org/${editingOrg.id}`, formData);
        toast.success("اداره تازه شوه");
      } else {
        await api.post("/org", formData);
        toast.success("اداره اضافه شوه");
      }
      await loadOrgs();
      handleCloseDialog();
    } catch (error) {
      console.error("Error:", error);
      toast.error("عملیه ناکامه شوه");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("ایا تاسو ډاډه یاست؟")) {
      try {
        await api.delete(`/org/${id}`);
        toast.success("اداره حذف شوه");
        await loadOrgs();
      } catch (error) {
        console.error("Error:", error);
        toast.error("حذف ناکام شو");
      }
    }
  };

  const handleEdit = (org) => {
    setEditingOrg(org);
    setFormData({ name: org.name });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingOrg(null);
    setFormData({ name: "" });
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">ادارې</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
          sx={{ bgcolor: "black", "&:hover": { bgcolor: "#1d252e" } }}
        >
          نوې اداره
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>نوم</TableCell>
              <TableCell align="right">عملیات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orgs.map((org) => (
              <TableRow key={org.id}>
                <TableCell>{org.id}</TableCell>
                <TableCell>{org.name}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(org)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(org.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editingOrg ? "اداره تازه کول" : "نوې اداره"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="د ادارې نوم"
            value={formData.name}
            onChange={(e) => setFormData({ name: e.target.value })}
            margin="normal"
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>لغوه</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
            sx={{ bgcolor: "black", "&:hover": { bgcolor: "#1d252e" } }}
          >
            {loading ? <CircularProgress size={20} /> : "ذخیره"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// ================ DEPARTMENT MANAGEMENT ================
function DepartmentManagement() {
  const [departments, setDepartments] = useState([]);
  const [orgs, setOrgs] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [formData, setFormData] = useState({ name: "", orgId: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [deptRes, orgRes] = await Promise.all([
        api.get("/departments"),
        api.get("/org"),
      ]);
      setDepartments(deptRes.data);
      setOrgs(orgRes.data);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("د معلوماتو لوډولو کې ستونزه");
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.orgId) {
      toast.error("نوم او اداره دواړه ضروری دي");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        org: { id: formData.orgId },
      };

      if (editingDept) {
        await api.put(`/departments/${editingDept.id}`, payload);
        toast.success("څانګه تازه شوه");
      } else {
        await api.post("/departments", payload);
        toast.success("څانګه اضافه شوه");
      }
      await loadData();
      handleCloseDialog();
    } catch (error) {
      console.error("Error:", error);
      toast.error("عملیه ناکامه شوه");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("ایا تاسو ډاډه یاست؟")) {
      try {
        await api.delete(`/departments/${id}`);
        toast.success("څانګه حذف شوه");
        await loadData();
      } catch (error) {
        console.error("Error:", error);
        toast.error("حذف ناکام شو");
      }
    }
  };

  const handleEdit = (dept) => {
    setEditingDept(dept);
    setFormData({
      name: dept.name,
      orgId: dept.org?.id || "",
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingDept(null);
    setFormData({ name: "", orgId: "" });
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">څانګې</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
          sx={{ bgcolor: "black", "&:hover": { bgcolor: "#1d252e" } }}
        >
          نوې څانګه
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>نوم</TableCell>
              <TableCell>اداره</TableCell>
              <TableCell align="right">عملیات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {departments.map((dept) => (
              <TableRow key={dept.id}>
                <TableCell>{dept.id}</TableCell>
                <TableCell>{dept.name}</TableCell>
                <TableCell>{dept.org?.name || "-"}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(dept)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(dept.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingDept ? "څانګه تازه کول" : "نوې څانګه"}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="د څانګې نوم"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
            required
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel>اداره</InputLabel>
            <Select
              value={formData.orgId}
              onChange={(e) =>
                setFormData({ ...formData, orgId: e.target.value })
              }
              label="اداره"
            >
              {orgs.map((org) => (
                <MenuItem key={org.id} value={org.id}>
                  {org.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>لغوه</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
            sx={{ bgcolor: "black", "&:hover": { bgcolor: "#1d252e" } }}
          >
            {loading ? <CircularProgress size={20} /> : "ذخیره"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// ================ TYPE MANAGEMENT ================
function TypeManagement() {
  const [types, setTypes] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [formData, setFormData] = useState({ name: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTypes();
  }, []);

  const loadTypes = async () => {
    try {
      const response = await api.get("/type");
      setTypes(response.data);
    } catch (error) {
      console.error("Error loading types:", error);
      toast.error("د ډولونو لوډولو کې ستونزه");
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error("نوم ضروری دی");
      return;
    }

    setLoading(true);
    try {
      if (editingType) {
        await api.put(`/type/${editingType.id}`, formData);
        toast.success("ډول تازه شو");
      } else {
        await api.post("/type", formData);
        toast.success("ډول اضافه شو");
      }
      await loadTypes();
      handleCloseDialog();
    } catch (error) {
      console.error("Error:", error);
      toast.error("عملیه ناکامه شوه");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("ایا تاسو ډاډه یاست؟")) {
      try {
        await api.delete(`/type/${id}`);
        toast.success("ډول حذف شو");
        await loadTypes();
      } catch (error) {
        console.error("Error:", error);
        toast.error("حذف ناکام شو");
      }
    }
  };

  const handleEdit = (type) => {
    setEditingType(type);
    setFormData({ name: type.name });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingType(null);
    setFormData({ name: "" });
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">ډولونه</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
          sx={{ bgcolor: "black", "&:hover": { bgcolor: "#1d252e" } }}
        >
          نوی ډول
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>نوم</TableCell>
              <TableCell align="right">عملیات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {types.map((type) => (
              <TableRow key={type.id}>
                <TableCell>{type.id}</TableCell>
                <TableCell>{type.name}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(type)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(type.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editingType ? "ډول تازه کول" : "نوی ډول"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="د ډول نوم"
            value={formData.name}
            onChange={(e) => setFormData({ name: e.target.value })}
            margin="normal"
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>لغوه</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
            sx={{ bgcolor: "black", "&:hover": { bgcolor: "#1d252e" } }}
          >
            {loading ? <CircularProgress size={20} /> : "ذخیره"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// ================ SUBTYPE MANAGEMENT ================
function SubTypeManagement() {
  const [subTypes, setSubTypes] = useState([]);
  const [types, setTypes] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSubType, setEditingSubType] = useState(null);
  const [formData, setFormData] = useState({ name: "", typeId: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [subTypeRes, typeRes] = await Promise.all([
        api.get("/sub-type"),
        api.get("/type"),
      ]);
      setSubTypes(subTypeRes.data);
      setTypes(typeRes.data);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("د معلوماتو لوډولو کې ستونزه");
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.typeId) {
      toast.error("نوم او ډول دواړه ضروری دي");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        type: { id: formData.typeId },
      };

      if (editingSubType) {
        await api.put(`/sub-type/${editingSubType.id}`, payload);
        toast.success("فرعی ډول تازه شو");
      } else {
        await api.post("/sub-type", payload);
        toast.success("فرعی ډول اضافه شو");
      }
      await loadData();
      handleCloseDialog();
    } catch (error) {
      console.error("Error:", error);
      toast.error("عملیه ناکامه شوه");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("ایا تاسو ډاډه یاست؟")) {
      try {
        await api.delete(`/sub-type/${id}`);
        toast.success("فرعی ډول حذف شو");
        await loadData();
      } catch (error) {
        console.error("Error:", error);
        toast.error("حذف ناکام شو");
      }
    }
  };

  const handleEdit = (subType) => {
    setEditingSubType(subType);
    setFormData({
      name: subType.name,
      typeId: subType.type?.id || "",
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingSubType(null);
    setFormData({ name: "", typeId: "" });
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">فرعی ډولونه</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
          sx={{ bgcolor: "black", "&:hover": { bgcolor: "#1d252e" } }}
        >
          نوی فرعی ډول
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>نوم</TableCell>
              <TableCell>ډول</TableCell>
              <TableCell align="right">عملیات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subTypes.map((subType) => (
              <TableRow key={subType.id}>
                <TableCell>{subType.id}</TableCell>
                <TableCell>{subType.name}</TableCell>
                <TableCell>{subType.type?.name || "-"}</TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => handleEdit(subType)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(subType.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingSubType ? "فرعی ډول تازه کول" : "نوی فرعی ډول"}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="د فرعی ډول نوم"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
            required
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel>ډول</InputLabel>
            <Select
              value={formData.typeId}
              onChange={(e) =>
                setFormData({ ...formData, typeId: e.target.value })
              }
              label="ډول"
            >
              {types.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>لغوه</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
            sx={{ bgcolor: "black", "&:hover": { bgcolor: "#1d252e" } }}
          >
            {loading ? <CircularProgress size={20} /> : "ذخیره"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
