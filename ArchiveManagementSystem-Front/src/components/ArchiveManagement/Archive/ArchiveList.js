import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
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
import getArchiveTexts from "../../../helpers/archive/getArchiveTexts";
import {
  deleteArchive,
  getAllArchives,
} from "../../../services/ArchiveManagement/ArchiveAPI";
import { formatHijriDateForDisplay } from "../../../utils/hijriDateUtils";
import PageBreadcrumbs from "../../Breadcrumbs/PageBreadcrumbs";
import Filter from "../../Filter";
import EditArchiveDialog from "./EditArchiveDialog";
import ViewArchive from "./ViewArchive";

export default function ArchiveList() {
  const { t } = useTranslation("archive");
  const texts = useMemo(() => getArchiveTexts(t), [t]);
  const navigate = useNavigate();

  const [archives, setArchives] = useState([]);
  const [tabValue, setTabValue] = useState(0); // 0=All, 1=Incoming, 2=Outgoing
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedArchive, setSelectedArchive] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [field, setField] = useState("docNo");
  const [searchTerm, setSearchTerm] = useState("");

  const open = Boolean(anchorEl);

  // Columns with separate sender and receiver
  const columns = useMemo(
    () => [
      { id: "docNo", label: texts.docNo, minWidth: 130 },
      { id: "sendDate", label: texts.sendDate, minWidth: 120 },
      { id: "departmentDate", label: texts.departmentDate, minWidth: 120 },
      {
        id: "senderOrg",
        label: texts.org || "Sender (مرسل)",
        minWidth: 180,
      },
      {
        id: "receiverOrg",
        label: texts.organization || "Receiver (مرسل الیه)",
        minWidth: 180,
      },
      { id: "docType", label: texts.docType, minWidth: 140 },
      { id: "description", label: texts.description, minWidth: 200 },
      { id: "direction", label: texts.type, minWidth: 100 },
      { id: "actions", label: texts.actions, minWidth: 120 },
    ],
    [texts],
  );

  const loadArchives = useCallback(async () => {
    try {
      const response = await getAllArchives();
      setArchives(response.data || []);
    } catch (error) {
      console.error("Failed to load archives:", error);
      toast.error(t("loadError") || "Failed to load documents");
    }
  }, [t]);

  useEffect(() => {
    loadArchives();
  }, [loadArchives]);

  // Filter logic
  const displayedArchives = useMemo(() => {
    let data = [...archives];

    // 1. Tab filter
    if (tabValue === 1) {
      data = data.filter((r) => r.direction === "INCOMING");
    } else if (tabValue === 2) {
      data = data.filter((r) => r.direction === "OUTGOING");
    }

    // 2. Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      data = data.filter((row) => {
        switch (field) {
          case "docNo":
            return row.docNo?.toLowerCase().includes(term);
          case "sender":
            return row.senderOrg?.name?.toLowerCase().includes(term);
          case "receiver":
            return row.receiverOrg?.name?.toLowerCase().includes(term);
          case "docType":
            return row.docType?.name?.toLowerCase().includes(term);
          default:
            return true;
        }
      });
    }

    // 3. Sort — newest first
    data.sort((a, b) => b.id - a.id);

    return data;
  }, [archives, tabValue, searchTerm, field]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setPage(0);
  };

  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleFieldChange = (e) => setField(e.target.value);

  const handleClick = (event, archive) => {
    setAnchorEl(event.currentTarget);
    setSelectedArchive(archive);
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

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
    handleClose();
  };

  const handleDelete = async () => {
    try {
      await deleteArchive(selectedArchive.id);
      toast.success(texts.deleteSuccess || "Document deleted");
      loadArchives();
    } catch (err) {
      toast.error(texts.deleteError || "Failed to delete");
    } finally {
      setOpenDeleteDialog(false);
    }
  };

  const handleNewArchive = (direction = null) => {
    const url = direction
      ? `/archive/add?direction=${direction}`
      : "/archive/add";
    navigate(url);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      {/* Header + Tabs + Add Buttons */}
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
            onClick={() => handleNewArchive("INCOMING")}
          >
            {texts.newIncoming || "New Incoming"}
          </Button>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleNewArchive("OUTGOING")}
          >
            {texts.newOutgoing || "New Outgoing"}
          </Button>
        </Box>

        <Box>
          <Typography variant="h5" fontWeight="bold">
            {/* {texts.title || "Archive Register"} */}
          </Typography>
          <PageBreadcrumbs />
        </Box>
      </Box>

      {/* Tabs */}
      <Paper elevation={2} sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label={texts.all || "All"} />
          <Tab label={texts.incoming || "Incoming (وارده)"} />
          <Tab label={texts.outgoing || "Outgoing (صادره)"} />
        </Tabs>
      </Paper>

      {/* Filter */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Filter
          value={searchTerm}
          onChange={handleSearch}
          field={field}
          onFieldChange={handleFieldChange}
          fields={[
            { value: "docNo", label: texts.docNo },
            { value: "sender", label: texts.sender || "Sender" },
            { value: "receiver", label: texts.receiver || "Receiver" },
            { value: "docType", label: texts.docType },
          ]}
        />
      </Paper>

      {/* Table */}
      <Paper sx={{ overflow: "hidden" }}>
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
                      backgroundColor: "#f5f7fa",
                      fontWeight: "bold",
                    }}
                  >
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedArchives
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow hover key={row.id}>
                    <TableCell align="center">{row.docNo || "-"}</TableCell>
                    <TableCell align="center">
                      {formatHijriDateForDisplay(row.sendDate) || "-"}
                    </TableCell>
                    <TableCell align="center">
                      {formatHijriDateForDisplay(row.departmentDate) || "-"}
                    </TableCell>
                    <TableCell align="center">
                      {row.senderOrg?.name || "—"}
                    </TableCell>
                    <TableCell align="center">
                      {row.receiverOrg?.name || "—"}
                    </TableCell>
                    <TableCell align="center">
                      {row.docType?.name || "-"}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        maxWidth: 200,
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {row.description || "-"}
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
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={displayedArchives.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={texts.rowsPerPage || "Rows per page:"}
        />
      </Paper>

      {/* Menu */}
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
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
      <ViewArchive
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        archive={selectedArchive}
      />
      <EditArchiveDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        archive={selectedArchive}
        onSuccess={loadArchives}
      />
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>{texts.deleteConfirm || "Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {texts.deleteMessage ||
              "Are you sure you want to delete this document? This action cannot be undone."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>
            {texts.cancel}
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            {texts.delete}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
