
import {
  getAllSawanih,
  deleteSawanih,
} from "../../../services/RepositoryManagement/SawanihAPI";
import ViewSawanih from "./ViewSawanih";
import EditSawanihDialog from "./EditSawanihDialog";
import PageBreadcrumbs from "../../Breadcrumbs/PageBreadcrumbs";
import Filter from "../../Filter";
import getSawanihTexts from "../../../helpers/hifziya/sawanih/sawanihText";
import { useTranslation } from "react-i18next";
import { formatHijriDateForDisplay } from "../../../utils/hijriDateUtils";
import { convertToPersianNumbers } from "../../../utils/numberUtils";

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
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { red } from "@mui/material/colors";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function SawanihList() {
  const [sawanih, setSawanih] = useState([]);
  const [tabValue, setTabValue] = useState(0); // 0 = All, 1 = Sawanih, 2 = Istekhdam
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSawanih, setSelectedSawanih] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [field, setField] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useTranslation("sawanih");
  const text = getSawanihTexts(t);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const columns = [
    { id: "name", label: text.name, minWidth: 120 },
    { id: "fatherName", label: text.fatherName, minWidth: 120 },
    { id: "org", label: text.org, minWidth: 120 },
    { id: "incommingDate", label: text.incommingDate, minWidth: 120 },
    { id: "outgoingDate", label: text.outgoingDate, minWidth: 120 },

    ...(tabValue !== 1
      ? [{ id: "pageQuantity", label: text.pageQuantity, minWidth: 100 }]
      : []),

    { id: "description", label: text.description, minWidth: 150 },
    { id: "type", label: text.recordStatus || "نوع", minWidth: 100 },
    { id: "actions", label: text.actions, minWidth: 120 },
  ];

  const loadSawanih = useCallback(async () => {
    try {
      const response = await getAllSawanih();
      console.log(response.data);
      setSawanih(response.data);
    } catch (error) {
      console.error(error);
      toast.error(text.loadError);
    }
  }, [text.loadError]);

  useEffect(() => {
    loadSawanih();
  }, [loadSawanih]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFieldChange = (e) => {
    setField(e.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setPage(0);
  };

  const handleView = () => {
    setOpenViewDialog(true);
    handleClose();
  };

  const handleCloseView = () => {
    setOpenViewDialog(false);
    setSelectedSawanih(null);
  };

  const handleClick = (event, report) => {
    setAnchorEl(event.currentTarget);
    setSelectedSawanih(report);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setOpenEditDialog(true);
    handleClose();
  };

  const handleCloseEdit = () => {
    setOpenEditDialog(false);
    setSelectedSawanih(null);
  };

  const handleEditSuccess = () => {
    loadSawanih();
  };

  const filteredReport = useMemo(() => {
    let data = [...sawanih];

    // Tab filter
    if (tabValue === 1) {
      data = data.filter((r) => r.isSawanih === true); // Sawanih
    } else if (tabValue === 2) {
      data = data.filter((r) => r.isSawanih === false); // Istekhdam
    }

    // Search filter
    if (searchTerm?.trim()) {
      const searchValue = searchTerm.toLowerCase().trim();

      data = data.filter((row) => {
        switch (field) {
          case "name":
            return row.name?.toLowerCase()?.includes(searchValue) ?? false;
          case "fatherName":
            return (
              row.fatherName?.toLowerCase()?.includes(searchValue) ?? false
            );
          case "org":
            return row.org?.name?.toLowerCase()?.includes(searchValue) ?? false;
          default:
            return true;
        }
      });
    }

    // Newest first
    data.sort((a, b) => b.id - a.id);

    return data;
  }, [sawanih, tabValue, searchTerm, field]);

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
    handleClose();
  };

  const handleNewSawanih = () => {
    navigate("/sawanih/add-sawanih?type=sawanih");
  };

  const handleNewIstekhdam = () => {
    navigate("/sawanih/add-sawanih?type=istekhdam");
  };

  const handleDelete = async () => {
    try {
      await deleteSawanih(selectedSawanih.id);
      loadSawanih();
      toast.success(text.deleteSuccess);
    } catch (error) {
      console.error("Failed to delete sawanih", error);
      toast.error(text.deleteError);
    } finally {
      setOpenDeleteDialog(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      <Box sx={{ width: "100%", p: 3 }}>
        {/* Header */}
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
              onClick={handleNewSawanih}
            >
              {text.newSawanih || "نوې سوانح"}
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<AddIcon />}
              onClick={handleNewIstekhdam}
            >
              {text.newIsteqdam || "نوې استخدام"}
            </Button>
          </Box>

          <Box sx={{ textAlign: "right" }}>
            <PageBreadcrumbs />
          </Box>
        </Box>

        {/* Tabs: All / Sawanih / Istekhdam */}
        <Paper elevation={2} sx={{ mb: 4, borderRadius: 2 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label={text.all || "ټول"} />
            <Tab label={text.sawanih || "سوانح"} />
            <Tab label={text.isteqdam || "استخدام"} />
          </Tabs>
        </Paper>

        <Paper sx={{ p: 2, mb: 4, borderRadius: 2 }}>
          <Filter
            value={searchTerm}
            onChange={handleSearch}
            field={field}
            onFieldChange={handleFieldChange}
            fields={[
              { value: "name", label: text.name },
              { value: "fatherName", label: text.fatherName },
              { value: "org", label: text.org },
            ]}
          />
        </Paper>

        <Paper sx={{ overflow: "hidden", borderRadius: 2 }}>
          <TableContainer sx={{ maxHeight: 520 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align="center"
                      style={{
                        minWidth: column.minWidth,
                        backgroundColor: "#f5f7fa",
                        fontWeight: "bold",
                        fontSize: "0.875rem",
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredReport.length === 0 ? (
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
                  filteredReport
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row.id}
                        >
                          <TableCell align="center">
                            {row.name || "N/A"}
                          </TableCell>
                          <TableCell align="center">
                            {row.fatherName || "N/A"}
                          </TableCell>
                          <TableCell align="center">
                            {row.org?.name || "N/A"}
                          </TableCell>
                          <TableCell align="center">
                            {formatHijriDateForDisplay(row.incommingDate) ||
                              "N/A"}
                          </TableCell>
                          <TableCell align="center">
                            {formatHijriDateForDisplay(row.outgoingDate) ||
                              "N/A"}
                          </TableCell>
                          <TableCell align="center">
                            {!row.isSawanih
                              ? row.pageQuantity
                                ? convertToPersianNumbers(row.pageQuantity)
                                : "N/A"
                              : "—"}
                          </TableCell>

                          <TableCell
                            align="center"
                            sx={{
                              maxWidth: 20,
                              whiteSpace: "normal",
                              wordBreak: "break-word",
                              overflowWrap: "anywhere",
                            }}
                          >
                            {row.description || "N/A"}
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
                                backgroundColor: row.isSawanih
                                  ? "#2196F3"
                                  : "#4CAF50",
                                color: "white",
                              }}
                            >
                              {row.isSawanih ? "سوانح" : "استخدام"}
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <IconButton onClick={(e) => handleClick(e, row)}>
                              <MoreVertIcon />
                            </IconButton>
                            <Menu
                              anchorEl={anchorEl}
                              open={open}
                              onClose={handleClose}
                            >
                              <MenuItem onClick={handleView}>
                                <VisibilityIcon
                                  fontSize="small"
                                  style={{ marginRight: 8 }}
                                />
                                {text.view}
                              </MenuItem>
                              <MenuItem onClick={handleEdit}>
                                <EditIcon
                                  fontSize="small"
                                  style={{ marginRight: 8 }}
                                />
                                {text.edit}
                              </MenuItem>
                              <MenuItem
                                onClick={handleDeleteClick}
                                style={{ color: red[500] }}
                              >
                                <DeleteIcon
                                  fontSize="small"
                                  style={{ marginRight: 8, color: red[500] }}
                                />
                                {text.delete}
                              </MenuItem>
                            </Menu>
                          </TableCell>
                        </TableRow>
                      );
                    })
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={filteredReport.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>

      {/* View Dialog */}
      <ViewSawanih
        open={openViewDialog}
        onClose={handleCloseView}
        report={selectedSawanih}
      />

      {/* Edit Dialog */}
      <EditSawanihDialog
        open={openEditDialog}
        onClose={handleCloseEdit}
        sawanih={selectedSawanih}
        onSuccess={handleEditSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {text.deleteDialogTitle}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {text.deleteDialogText}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>
            {text.cancel}
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            {text.delete}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
