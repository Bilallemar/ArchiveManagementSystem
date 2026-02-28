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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { red } from "@mui/material/colors";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import getMakzanReceiptTexts from "../../../helpers/Storage/MakzanReceipt/MakzanReceiptText";
import {
  deleteReceipt,
  getAllReceipts,
} from "../../../services/StorageManagement/MakzanReceiptAPI";
import { formatHijriDateForDisplay } from "../../../utils/hijriDateUtils";
import PageBreadcrumbs from "../../Breadcrumbs/PageBreadcrumbs";
import Filter from "../../Filter";
import EditReceiptDialog from "./EditReceiptDialog";
import ViewMakzanReceipt from "./ViewMakzanReceipt";

export default function MakzanReceiptList() {
  const [receipts, setReceipts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [field, setField] = useState("department");
  const [searchTerm, setSearchTerm] = useState("");

  const { t } = useTranslation("makzanReceipt");
  const texts = getMakzanReceiptTexts(t);

  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  // Define columns using localized texts
  const columns = [
    { id: "department", label: texts.department, minWidth: 100 },
    { id: "docNo", label: texts.docNo, minWidth: 120 },
    { id: "org", label: texts.org, minWidth: 120 },
    { id: "letterNo", label: texts.letterNo, minWidth: 120 },
    { id: "letterDate", label: texts.letterDate, minWidth: 120 },
    { id: "subjectType", label: texts.subjectType, minWidth: 120 },
    { id: "description", label: texts.description, minWidth: 150 },
    { id: "actions", label: texts.actions, minWidth: 120 },
  ];

  const loadReceipts = useCallback(async () => {
    try {
      const response = await getAllReceipts();
      setReceipts(response.data);
    } catch (error) {
      console.error(error);
      toast.error(texts.loadError);
    }
  }, [texts.loadError]);

  useEffect(() => {
    loadReceipts();
  }, [loadReceipts]);

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
    setSelectedReceipt(null);
  };

  const handleClick = (event, receipt) => {
    setAnchorEl(event.currentTarget);
    setSelectedReceipt(receipt);
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
    setSelectedReceipt(null);
  };

  const handleEditSuccess = () => {
    loadReceipts();
  };

  const filteredReceipts = useMemo(() => {
    let data = [...receipts];

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
          case "department":
            return row.department?.toLowerCase().includes(term);
          case "docNo":
            return row.docNo?.toLowerCase().includes(term);
          case "letterNo":
            return row.letterNo?.toLowerCase().includes(term);
          case "org":
            return row.org?.name?.toLowerCase().includes(term);
          default:
            return true;
        }
      });
    }
    data.sort((a, b) => b.id - a.id);
    return data;
  }, [receipts, tabValue, searchTerm, field]);

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
    handleClose();
  };

  const handleNewReceipt = () => {
    navigate("/makzan-receipts/add");
  };

  const handleDelete = async () => {
    try {
      await deleteReceipt(selectedReceipt.id);
      loadReceipts();
      toast.success(texts.deleteSuccess);
    } catch (error) {
      console.error("Failed to delete receipt", error);
      toast.error(texts.deleteError);
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
          <Button
            variant="contained"
            onClick={handleNewReceipt}
            color="primary"
            startIcon={<AddIcon />}
          >
            {texts.newReceipt}
          </Button>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              textAlign: "right",
            }}
          >
            {/* <Typography
              variant="h5"
              sx={{
                fontFamily: "B Nazanin",
                fontWeight: "bold",
              }}
            >
              {texts.pageTitle}
            </Typography> */}
            <PageBreadcrumbs />
          </Box>
        </Box>

        <Paper sx={{ p: 2, mb: 4, borderRadius: 2 }}>
          <Filter
            value={searchTerm}
            onChange={handleSearch}
            field={field}
            onFieldChange={handleFieldChange}
            fields={[
              { value: "department", label: texts.department },
              { value: "docNo", label: texts.docNo },
              { value: "letterNo", label: texts.letterNo },
              { value: "org", label: texts.org },
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
                {filteredReceipts
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      <TableCell align="center">
                        {row.department || "N/A"}
                      </TableCell>
                      <TableCell align="center">{row.docNo || "N/A"}</TableCell>
                      <TableCell align="center">
                        {row.org?.name || "N/A"}
                      </TableCell>
                      <TableCell align="center">
                        {row.letterNo || "N/A"}
                      </TableCell>
                      <TableCell align="center">
                        {formatHijriDateForDisplay(row.letterDate) || "N/A"}
                      </TableCell>
                      <TableCell align="center">
                        {row.subjectType || "N/A"}
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
                        {row.description || "N/A"}
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
                            {texts.view}
                          </MenuItem>
                          <MenuItem onClick={handleEdit}>
                            <EditIcon
                              fontSize="small"
                              style={{ marginRight: 8 }}
                            />
                            {texts.edit}
                          </MenuItem>
                          <MenuItem
                            onClick={handleDeleteClick}
                            style={{ color: red[500] }}
                          >
                            <DeleteIcon
                              fontSize="small"
                              style={{ marginRight: 8, color: red[500] }}
                            />
                            {texts.delete}
                          </MenuItem>
                        </Menu>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={filteredReceipts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>

      <ViewMakzanReceipt
        open={openViewDialog}
        onClose={handleCloseView}
        receipt={selectedReceipt}
      />
      <EditReceiptDialog
        open={openEditDialog}
        onClose={handleCloseEdit}
        receipt={selectedReceipt}
        onSuccess={handleEditSuccess}
      />
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>{texts.deleteConfirmTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>{texts.deleteConfirmMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>
            {texts.cancel}
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            {texts.delete}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
