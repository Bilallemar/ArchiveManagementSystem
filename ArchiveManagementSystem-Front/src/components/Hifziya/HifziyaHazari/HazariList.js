import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Tabs,
  Tab,
} from "@mui/material";
import { red } from "@mui/material/colors";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

import {
  getAllHifziyaHazaris,
  deleteHifziyaHazari,
} from "../../../services/RepositoryManagement/HifziyaHazariAPI";
import ViewHazari from "./ViewHazari";
import EditHazariDialog from "./EditHazariDialog";
import PageBreadcrumbs from "../../Breadcrumbs/PageBreadcrumbs";
import Filter from "../../Filter";
import getAddHazariTexts from "../../../helpers/hifziya/hazari/AddHazariText";

export default function HazariList() {
  const { t } = useTranslation("addHazari");
  const text = getAddHazariTexts(t);
  const navigate = useNavigate();

  const [hazari, setHazari] = useState([]);
  const [tabValue, setTabValue] = useState(0); // 0 = All, 1 = Indraj, 2 = Hazari
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedHazari, setSelectedHazari] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [field, setField] = useState("org");
  const [searchTerm, setSearchTerm] = useState("");

  const open = Boolean(anchorEl);
  const columns = [
    { id: "volume", label: text.volume || "جلد", minWidth: 100 },
    { id: "subType", label: text.subType || "کارمندان نوعیت", minWidth: 140 },
    { id: "type", label: text.type || "نوعیت", minWidth: 140 },
    { id: "year", label: text.year || "سال", minWidth: 120 },
    { id: "org", label: text.org || "اداره", minWidth: 180 },
    { id: "description", label: text.description || "ملاحظات", minWidth: 220 },
    { id: "direction", label: text.direction || "نوع", minWidth: 100 },
    { id: "actions", label: text.action || "عملیات", minWidth: 120 },
  ];

  const loadHazari = useCallback(async () => {
    try {
      const response = await getAllHifziyaHazaris();
      setHazari(response.data || []);
    } catch (error) {
      console.error("Error loading hazari:", error);
      toast.error(text.loadDataError || "د معلوماتو د بارولو کې ستونزه");
    }
  }, []);

  useEffect(() => {
    loadHazari();
  }, [loadHazari]);

  // Filter logic based on tab
  const filteredHazari = useMemo(() => {
    let data = [...hazari];

    // Tab filter
    if (tabValue === 1) {
      data = data.filter((r) => r.isIndraj === true); // Indraj
    } else if (tabValue === 2) {
      data = data.filter((r) => r.isIndraj === false); // Hazari
    }

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      return data.filter((row) => {
        switch (field) {
          case "org":
            return row.org?.name?.toLowerCase().includes(term);
          case "year":
            return row.year?.toString().includes(term);
          case "type":
            return row.type?.name?.toLowerCase().includes(term);
          default:
            return true;
        }
      });
    }
    data.sort((a, b) => b.id - a.id);
    return data;
  }, [hazari, tabValue, searchTerm, field]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setPage(0);
  };

  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleFieldChange = (e) => setField(e.target.value);

  const handleClick = (event, hazariItem) => {
    setAnchorEl(event.currentTarget);
    setSelectedHazari(hazariItem);
  };

  const handleClose = () => setAnchorEl(null);

  const handleView = () => {
    setOpenViewDialog(true);
    handleClose();
  };

  const handleEdit = () => {
    setOpenEditDialog(true);
    handleClose();
  };

  const handleCloseEdit = () => {
    setOpenEditDialog(false);
    setSelectedHazari(null);
  };

  const handleCloseView = () => {
    setOpenViewDialog(false);
    setSelectedHazari(null);
  };
  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
    handleClose();
  };

  const handleNewIndraj = () => {
    navigate("/hifziya-hazari/add-hazari?type=indraj");
  };

  const handleNewHazari = () => {
    navigate("/hifziya-hazari/add-hazari?type=hazari");
  };

  const handleDelete = async () => {
    try {
      await deleteHifziyaHazari(selectedHazari.id);
      toast.success(text.deleteSuccess || "حاضري په بریالیتوب سره حذف شوه");
      loadHazari();
    } catch (error) {
      toast.error(text.deleteError || "د حذف کولو کې ستونزه");
    } finally {
      setOpenDeleteDialog(false);
      setSelectedHazari(null);
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      {/* Header + Two Add Buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleNewIndraj}
          >
            {text.newIndraj || "نوې اندراج"}
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<AddIcon />}
            onClick={handleNewHazari}
          >
            {text.newHazari || "نوې حاضري"}
          </Button>
        </Box>

        <Box sx={{ textAlign: "right" }}>
          {/* <Typography variant="h5" fontWeight="bold">
            کتاب حاضری
          </Typography> */}
          <PageBreadcrumbs />
        </Box>
      </Box>

      {/* Tabs: All / Indraj / Hazari */}
      <Paper elevation={2} sx={{ mb: 4, borderRadius: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label={text.all || "ټول"} />
          <Tab label={text.indraj || "اندراج"} />
          <Tab label={text.hazari || "حاضري"} />
        </Tabs>
      </Paper>

      {/* Filter */}
      <Paper sx={{ p: 2, mb: 4, borderRadius: 2 }}>
        <Filter
          value={searchTerm}
          onChange={handleSearch}
          field={field}
          onFieldChange={handleFieldChange}
          fields={[
            { value: "org", label: text.org || "اداره" },
            { value: "year", label: text.year || "کال" },
            { value: "type", label: text.type || "نوعیت" },
          ]}
        />
      </Paper>

      {/* Table */}
      <Paper sx={{ overflow: "hidden", borderRadius: 2 }}>
        <TableContainer sx={{ maxHeight: 520 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell
                    key={col.id}
                    align="center"
                    sx={{
                      minWidth: col.minWidth,
                      bgcolor: "#f5f7fa",
                      fontWeight: "bold",
                    }}
                  >
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredHazari.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    align="center"
                    sx={{ py: 5 }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {text.noDataFound || "هیڅ معلومات ونه موندل شول."}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredHazari
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow hover key={row.id}>
                      <TableCell align="center">
                        {row.volume || "N/A"}
                      </TableCell>
                      <TableCell align="center">
                        {row.subType?.name || "N/A"}
                      </TableCell>
                      <TableCell align="center">
                        {row.type?.name || "N/A"}
                      </TableCell>
                      <TableCell align="center">{row.year || "N/A"}</TableCell>
                      <TableCell align="center">
                        {row.org?.name || "N/A"}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          maxWidth: 20, // دلته اندازه کنټرول کوې
                          whiteSpace: "normal",
                          wordBreak: "break-word",
                          overflowWrap: "anywhere",
                        }}
                      >
                        {row.description?.length > 60
                          ? `${row.description.substring(0, 60)}...`
                          : row.description || "N/A"}
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: "inline-block",
                            px: 2,
                            py: 0.5,
                            borderRadius: "999px",
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            backgroundColor: row.isIndraj
                              ? "#2196F3"
                              : "#4CAF50", // شنه = اندراج، نیلي = حاضري
                            color: "white",
                          }}
                        >
                          {row.isIndraj ? "اندراج" : "حاضري"}{" "}
                          {/* ← دلته بدلون */}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton onClick={(e) => handleClick(e, row)}>
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={filteredHazari.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Menu */}
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleView}>
          <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
          {text.view || "لیدل"}
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          {text.edit || "اصلاح"}
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: red[700] }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          {text.delete || "حذف"}
        </MenuItem>
      </Menu>

      {/* Dialogs */}
      <ViewHazari
        open={openViewDialog}
        onClose={handleCloseView}
        report={selectedHazari}
      />
      <EditHazariDialog
        open={openEditDialog}
        onClose={handleCloseEdit}
        hazari={selectedHazari}
        onSuccess={loadHazari}
      />
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>{text.title || "د حاضري حذف؟"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {text.text ||
              "آیا تاسو مطمئن یاست چې غواړئ دا حاضري حذف کړئ؟ دا عمل نه شي بیرته راګرځول کېدای."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>
            {text.cancel || "لغوه"}
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            {text.confirm || "حذف"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
