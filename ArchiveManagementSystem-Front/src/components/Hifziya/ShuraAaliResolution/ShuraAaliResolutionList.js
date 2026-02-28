import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Tabs,
  Tab,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { red } from "@mui/material/colors";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import PageBreadcrumbs from "../../Breadcrumbs/PageBreadcrumbs";
import Filter from "../../Filter";

import {
  getAllShuraAaliResolutions,
  deleteShuraAaliResolution,
} from "../../../services/RepositoryManagement/shuraAaliResolutionApi";

import ViewShuraAaliResolution from "./ViewShuraAaliResolution";
import EditShuraAaliResolutionDialog from "./EditShuraAaliResolutionDialog";
import getShuraAaliResolutionTexts from "../../../helpers/hifziya/ShuraAaliResolutionTexts";

export default function ShuraAaliResolutionList() {
  const { t } = useTranslation("shuraAali");
  const navigate = useNavigate();
  const texts = getShuraAaliResolutionTexts(t);

  const [resolutions, setResolutions] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedResolution, setSelectedResolution] = useState(null);

  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("subject");

  const openMenu = Boolean(anchorEl);

  const columns = useMemo(
    () => [
      { id: "sendDate", label: texts.sendDate, minWidth: 120 },
      { id: "subject", label: texts.subject, minWidth: 120 },
      { id: "senderReference", label: texts.senderRef, minWidth: 140 },
      { id: "title", label: texts.title, minWidth: 120 },
      { id: "resolutionType", label: texts.type, minWidth: 160 },
      { id: "letterNumber", label: texts.letterNo, minWidth: 140 },
      { id: "resolutionNo", label: texts.resolutionNumber, minWidth: 140 },
      { id: "approvalYear", label: texts.year, minWidth: 110 },
      { id: "remarks", label: texts.remarks, minWidth: 150 },
      { id: "resolutionBadge", label: texts.badgeType, minWidth: 100 },
      { id: "actions", label: texts.actions, minWidth: 120 },
    ],
    [texts],
  );

  const loadResolutions = useCallback(async () => {
    try {
      const res = await getAllShuraAaliResolutions();
      setResolutions(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error(texts.loadError);
    }
  }, [texts.loadError]);

  useEffect(() => {
    loadResolutions();
  }, [loadResolutions]);

  const filteredData = useMemo(() => {
    let data = [...resolutions];

    // ✅ Use direction like Archive uses direction
    if (tabValue === 1) {
      data = data.filter((r) => r.direction === "MOSAWABA");
    } else if (tabValue === 2) {
      data = data.filter((r) => r.direction === "YADASHT");
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      data = data.filter((row) => {
        if (searchField === "subject")
          return row.subject?.toLowerCase().includes(term);
        if (searchField === "title")
          return row.title?.toLowerCase().includes(term);
        if (searchField === "letterNumber")
          return row.letterNumber?.toLowerCase().includes(term);
        return true;
      });
    }

    data.sort((a, b) => b.id - a.id);
    return data;
  }, [resolutions, searchTerm, searchField, tabValue]);

  const handleChangePage = (e, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedResolution(row);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleView = () => {
    setOpenView(true);
    handleMenuClose();
  };

  const handleEdit = () => {
    setOpenEdit(true);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setOpenDelete(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteShuraAaliResolution(selectedResolution.id);
      toast.success(texts.deleteSuccess);
      loadResolutions();
    } catch (err) {
      toast.error(texts.deleteFailed);
    } finally {
      setOpenDelete(false);
    }
  };

  const handleNew = () => navigate("/shura-aali-resolutions/add");

  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            color="success"
            startIcon={<AddIcon />}
            onClick={() =>
              navigate("/shura-aali-resolutions/add?type=MOSAWABA")
            }
          >
            {texts.newMusawaba}
          </Button>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate("/shura-aali-resolutions/add?type=YADASHT")}
          >
            {texts.newYadasht}
          </Button>
        </Box>

        <Box>
          {/* <Typography variant="h5" fontWeight="bold">
            {texts.shuraAaliResolutions}
          </Typography> */}
          <PageBreadcrumbs />
        </Box>
      </Box>
      <Paper elevation={2} sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => {
            setTabValue(newValue);
            setPage(0);
          }}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label={texts.all} />
          <Tab label={texts.mosawaba} />
          <Tab label={texts.yadasht} />
        </Tabs>
      </Paper>

      {/* Filter */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Filter
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          field={searchField}
          onFieldChange={(e) => setSearchField(e.target.value)}
          fields={[
            { value: "subject", label: texts.subject },
            { value: "title", label: texts.title },
            { value: "letterNumber", label: texts.letterNo },
          ]}
        />
      </Paper>

      {/* Table */}
      <Paper sx={{ overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 580 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell
                    key={col.id}
                    align="center"
                    sx={{
                      minWidth: col.minWidth,
                      fontWeight: "bold",
                      bgcolor: "#f5f7fa",
                    }}
                  >
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow hover key={row.id}>
                    <TableCell align="center">{row.sendDate || "—"}</TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        maxWidth: 150,
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                      }}
                    >
                      {row.subject || "N/A"}
                    </TableCell>
                    <TableCell align="center">
                      {row.senderReference || "—"}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        maxWidth: 150,
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                      }}
                    >
                      {row.title || "N/A"}
                    </TableCell>
                    <TableCell align="center">
                      {row.resolutionType || "—"}
                    </TableCell>
                    <TableCell align="center">
                      {row.letterNumber || "—"}
                    </TableCell>
                    <TableCell align="center">
                      {row.resolutionNo || "—"}
                    </TableCell>
                    <TableCell align="center">
                      {row.approvalYear || "—"}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        maxWidth: 150,
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                      }}
                    >
                      {row.remarks || "N/A"}
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
                          backgroundColor:
                            row.direction === "MOSAWABA"
                              ? "#4CAF50"
                              : "#2196F3", // ✅ direction
                          color: "white",
                        }}
                      >
                        {row.direction === "MOSAWABA" ? "مصوبه" : "یاداشت"}{" "}
                        {/* ✅ direction */}
                      </Box>
                    </TableCell>

                    <TableCell align="center">
                      <IconButton onClick={(e) => handleMenuOpen(e, row)}>
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Action Menu */}
      <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}>
        <MenuItem onClick={handleView}>
          <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
          {texts.view}
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          {texts.edit}
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: red[700] }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          {texts.delete}
        </MenuItem>
      </Menu>

      {/* Dialogs */}
      <ViewShuraAaliResolution
        open={openView}
        onClose={() => setOpenView(false)}
        resolution={selectedResolution}
      />

      <EditShuraAaliResolutionDialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        resolution={selectedResolution}
        onSuccess={loadResolutions}
      />

      {/* Delete Confirmation */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>{texts.confirmDelete}</DialogTitle>
        <DialogContent>
          <DialogContentText>{texts.deleteWarning}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>{texts.cancel}</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            {texts.delete}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
