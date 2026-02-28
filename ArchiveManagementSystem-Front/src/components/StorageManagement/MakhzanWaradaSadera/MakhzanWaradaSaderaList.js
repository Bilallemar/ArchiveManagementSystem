import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";
import { red } from "@mui/material/colors";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import getMakhzanWaradaSaderaTexts from "../../../helpers/Storage/MakhzanwSaradasSadera/getMakhzanWaradaSaderaTexts";
import {
  deleteMakhzanWaradaSadera,
  getAllMakhzanWaradaSadera,
} from "../../../services/StorageManagement/MakhzanWaradaSaderaAPI";
import PageBreadcrumbs from "../../Breadcrumbs/PageBreadcrumbs";
import Filter from "../../Filter";
import EditMakhzanWaradaSaderaDialog from "./EditMakhzanWaradaSaderaDialog";
import ViewMakhzanWaradaSadera from "./ViewMakhzanWaradaSadera";
import { formatHijriDateForDisplay } from "../../../utils/hijriDateUtils";

export default function MakhzanWaradaSaderaList() {
  const { t } = useTranslation("makhzanWaradaSadera");
  const text = getMakhzanWaradaSaderaTexts(t);
  const navigate = useNavigate();

  const [makhzanWaradaSadera, setMakhzanWaradaSadera] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [field, setField] = useState("no");
  const [searchTerm, setSearchTerm] = useState("");

  const open = Boolean(anchorEl);

  const columns = [
    { id: "no", label: text.headerNo || "شمېره", minWidth: 80 },
    { id: "org", label: text.headerOrg || "اداره", minWidth: 150 },
    {
      id: "letterNumber",
      label: text.headerLetterNumber || "شمېره مکتوب",
      minWidth: 120,
    },
    {
      id: "subjectType",
      label: text.headerSubjectType || "د لاسند ډول",
      minWidth: 120,
    },
    {
      id: "incommingDate",
      label: text.headerIncommingDate || "تاریخ وارده",
      minWidth: 130,
    },
    {
      id: "outgoingDate",
      label: text.headerOutgoingDate || "تاریخ صادره",
      minWidth: 130,
    },
    {
      id: "summary",
      label: text.headerSummary || "لنډیز",
      minWidth: 150,
    },
    {
      id: "description",
      label: text.headerDescription || "ملاحظات",
      minWidth: 150,
    },
    {
      id: "direction",
      label: text.headerDirection || "Direction",
      minWidth: 100,
    },
    { id: "actions", label: text.headerActions || "عملیات", minWidth: 100 },
  ];

  const loadMakhzanWaradaSadera = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getAllMakhzanWaradaSadera();
      setMakhzanWaradaSadera(response.data || []);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error(text.loadError || "Failed to load records");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMakhzanWaradaSadera();
  }, [loadMakhzanWaradaSadera]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFieldChange = (e) => {
    setField(e.target.value);
  };

  const handleView = () => {
    setOpenViewDialog(true);
    handleClose();
  };

  const handleCloseView = () => {
    setOpenViewDialog(false);
    setSelectedRecord(null);
  };

  const handleClick = (event, record) => {
    setAnchorEl(event.currentTarget);
    setSelectedRecord(record);
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
    setSelectedRecord(null);
  };

  const handleEditSuccess = () => {
    loadMakhzanWaradaSadera();
  };

  // Filter records based on search
  const filteredRecords = useMemo(() => {
    let data = [...makhzanWaradaSadera];

    // Tab filter
    if (tabValue === 1) {
      data = data.filter((r) => r.direction === "INCOMING");
    } else if (tabValue === 2) {
      data = data.filter((r) => r.direction === "OUTGOING");
    }

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      return data.filter((row) => {
        switch (field) {
          case "no":
            return row.no?.toString().toLowerCase().includes(term);
          case "org":
            return row.org?.name?.toLowerCase().includes(term);
          case "letterNumber":
            return row.letterNumber?.toLowerCase().includes(term);
          case "subjectType":
            return row.subjectType?.toLowerCase().includes(term);
          case "summary":
            return row.summary?.toLowerCase().includes(term);
          default:
            return true;
        }
      });
    }
    data.sort((a, b) => b.id - a.id);
    return data;
  }, [makhzanWaradaSadera, tabValue, searchTerm, field]);

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
    handleClose();
  };

  const handleNewRecord = (direction = null) => {
    const url = direction
      ? `/makhzan-warada-sadera/add?direction=${direction}`
      : "/makhzan-warada-sadera/add";
    navigate(url);
  };
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setPage(0);
  };

  const handleDelete = async () => {
    try {
      await deleteMakhzanWaradaSadera(selectedRecord.id);
      loadMakhzanWaradaSadera();
      toast.success(text.deleteSuccess || "Record deleted successfully");
    } catch (error) {
      console.error("Failed to delete record", error);
      toast.error(text.deleteError || "Failed to delete record");
    } finally {
      setOpenDeleteDialog(false);
      setSelectedRecord(null);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

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
              color="success"
              startIcon={<AddIcon />}
              onClick={() => handleNewRecord("INCOMING")}
              sx={{ borderRadius: "10px" }}
            >
              {text.newWareda || "نوی وارده"}
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleNewRecord("OUTGOING")}
              sx={{ borderRadius: "10px" }}
            >
              {text.newSadera || "نوی صادره"}
            </Button>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              textAlign: "right",
            }}
          >
            {/* <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              {text.title || "Makhzan Warada Sadera Records"}
            </Typography> */}
            <PageBreadcrumbs />
          </Box>
        </Box>
        <Paper elevation={2} sx={{ mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label={text.all || "ټولې"} />
            <Tab
              label={text.incoming || "وارده"}
              sx={{
                color: "success.main",
                "&.Mui-selected": { color: "success.main !important" },
              }}
            />
            <Tab
              label={text.outgoing || "صادره"}
              sx={{ color: "primary.main" }}
            />
          </Tabs>
        </Paper>
        {/* Table */}

        {/* Filter */}
        <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Filter
            value={searchTerm}
            onChange={handleSearch}
            field={field}
            onFieldChange={handleFieldChange}
            fields={[
              { value: "no", label: text.no || "شمېره" },
              { value: "org", label: text.org || "اداره" },
              {
                value: "letterNumber",
                label: text.letterNumber || "شمېره مکتوب",
              },
              {
                value: "subjectType",
                label: text.subjectType || "د لاسند ډول",
              },
              { value: "summary", label: text.summary || "لنډیز" },
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
                {filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      align="center"
                      sx={{ py: 5 }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {text.noRecordsFound || "No records found."}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecords
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.id}
                      >
                        <TableCell align="center">{row.no || "N/A"}</TableCell>
                        <TableCell align="center">
                          {row.org?.name || "N/A"}
                        </TableCell>
                        <TableCell align="center">
                          {row.letterNumber || "N/A"}
                        </TableCell>
                        {/* ✅ Display docType */}
                        <TableCell align="center">
                          {row.subjectType || "N/A"}
                        </TableCell>
                        <TableCell align="center">
                          {formatHijriDateForDisplay(row.incommingDate) || "N/A"}
                        </TableCell>
                        <TableCell align="center">
                          {formatHijriDateForDisplay(row.outgoingDate) || "N/A"}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            maxWidth: 150,
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                          }}
                        >
                          {row.summary || "N/A"}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            maxWidth: 150,
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                          }}
                        >
                          {row.description || "N/A"}
                        </TableCell>
                        {/* ✅ Direction badge using isIncoming */}
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
                                row.direction === "INCOMING"
                                  ? "#4CAF50"
                                  : "#2196F3",
                              color: "white",
                            }}
                          >
                            {row.direction === "INCOMING" ? "وارده" : "صادره"}
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
            count={filteredRecords.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Rows per page:"
          />
        </Paper>
      </Box>

      {/* Context Menu */}
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleView}>
          <VisibilityIcon fontSize="small" style={{ marginRight: 8 }} />
          {text.view || "View"}
        </MenuItem>

        <MenuItem onClick={handleEdit}>
          <EditIcon fontSize="small" style={{ marginRight: 8 }} />
          {text.edit || "Edit"}
        </MenuItem>

        <MenuItem onClick={handleDeleteClick} style={{ color: red[500] }}>
          <DeleteIcon
            fontSize="small"
            style={{ marginRight: 8, color: red[500] }}
          />
          {text.delete || "Delete"}
        </MenuItem>
      </Menu>

      {/* View Dialog */}
      <ViewMakhzanWaradaSadera
        open={openViewDialog}
        onClose={handleCloseView}
        record={selectedRecord}
      />

      {/* Edit Dialog */}
      <EditMakhzanWaradaSaderaDialog
        open={openEditDialog}
        onClose={handleCloseEdit}
        record={selectedRecord}
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
          {text.deleteRecord || "Delete Record"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {text.deleteText ||
              "Are you sure you want to delete this record? This action cannot be undone."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>
            {text.cancel || "Cancel"}
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            {text.delete || "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
