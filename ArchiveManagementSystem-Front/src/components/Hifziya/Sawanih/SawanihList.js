// import React, { useEffect, useState, useCallback } from "react";
import {
  getAllSawanih,
  deleteSawanih,
} from "../../../services/RepositoryManagement/SawanihAPI";
import ViewSawanih from "./ViewSawanih";
import EditSawanihDialog from "./EditSawanihDialog";
import PageBreadcrumbs from "../../Breadcrumbs/PageBreadcrumbs";
import Filter from "../../Filter";
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
} from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
import { red } from "@mui/material/colors";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
const columns = [
  { id: "name", label: "نوم", minWidth: 120 },
  { id: "fatherName", label: "د پلار نوم", minWidth: 120 },
  { id: "qaidWarida", label: "قید واریده", minWidth: 120 },
  { id: "org", label: "اداره", minWidth: 120 },
  { id: "incommingDate", label: "تاریخ وارده", minWidth: 120 },
  { id: "outgoingDate", label: "تاریخ صادره", minWidth: 120 },
  { id: "pageQuantity", label: "تعداد صفحات", minWidth: 100 },
  { id: "description", label: "ملاحظات", minWidth: 150 },
  { id: "actions", label: "عملیات", minWidth: 120 },
];

export default function SawanihList() {
  const [sawanih, setSawanih] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSawanih, setSelectedSawanih] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [field, setField] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");

  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const loadSawanih = useCallback(async () => {
    try {
      const response = await getAllSawanih();
      console.log(response.data);
      setSawanih(response.data);
    } catch (error) {
      console.error(error);
      toast.error("د معلوماتو لوډولو کې ستونزه");
    }
  }, []);

  useEffect(() => {
    loadSawanih();
  }, [loadSawanih]);

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
    loadSawanih(); // Refresh the list
  };

  // Filter based on search
  const filteredReport = sawanih.filter((row) => {
    if (!searchTerm) return true;

    const searchValue = searchTerm.toLowerCase();

    switch (field) {
      case "name":
        return row.name?.toLowerCase().includes(searchValue);
      case "fatherName":
        return row.fatherName?.toLowerCase().includes(searchValue);
      case "qaidWarida":
        return row.qaidWarida?.toLowerCase().includes(searchValue);
      case "org":
        return row.org?.name?.toLowerCase().includes(searchValue);
      default:
        return true;
    }
  });

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
    handleClose();
  };

  const handleNewReport = () => {
    navigate("/sawanih/add-sawanih");
  };

  const handleDelete = async () => {
    try {
      await deleteSawanih(selectedSawanih.id);
      loadSawanih();
      toast.success("ریکارډ په بریالیتوب سره حذف شو");
    } catch (error) {
      console.error("Failed to delete sawanih", error);
      toast.error("د حذف کولو کې ستونزه");
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            width: "80%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 2,
          }}
        >
          <Button
            variant="contained"
            onClick={handleNewReport}
            sx={{
              backgroundColor: "black",
              color: "white",
              borderRadius: "10px",
              "&:hover": {
                backgroundColor: "#1d252e",
              },
            }}
            endIcon={<AddIcon />}
          >
            ریکارډ جدید
          </Button>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              textAlign: "right",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontFamily: "B Nazanin",
                fontWeight: "bold",
              }}
            >
              سوانح
            </Typography>
            <PageBreadcrumbs />
          </Box>
        </Box>

        <Paper
          sx={{ width: "80%", overflow: "hidden", justifyContent: "center" }}
        >
          <div
            style={{
              marginTop: "10px",
              padding: "10px",
            }}
          >
            <Filter
              value={searchTerm}
              onChange={handleSearch}
              field={field}
              onFieldChange={handleFieldChange}
              fields={[
                { value: "name", label: "نوم" },
                { value: "fatherName", label: "د پلار نوم" },
                { value: "qaidWarida", label: "قید واریده" },
                { value: "org", label: "اداره" },
              ]}
            />
          </div>
          <TableContainer sx={{ maxHeight: 440, textAlign: "center" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align="center"
                      style={{
                        minWidth: column.minWidth,
                        backgroundColor: "#f4f6f8",
                        color: "#637381",
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
                {filteredReport
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
                          {row.qaidWarida || "N/A"}
                        </TableCell>
                        <TableCell align="center">
                          {row.org?.name || "N/A"}
                        </TableCell>
                        <TableCell align="center">
                          {row.incommingDate || "N/A"}
                        </TableCell>
                        <TableCell align="center">
                          {row.outgoingDate || "N/A"}
                        </TableCell>
                        <TableCell align="center">
                          {row.pageQuantity || "N/A"}
                        </TableCell>
                        <TableCell align="center">
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
                              View
                            </MenuItem>
                            <MenuItem onClick={handleEdit}>
                              <EditIcon
                                fontSize="small"
                                style={{ marginRight: 8 }}
                              />
                              Edit
                            </MenuItem>
                            <MenuItem
                              onClick={handleDeleteClick}
                              style={{ color: red[500] }}
                            >
                              <DeleteIcon
                                fontSize="small"
                                style={{ marginRight: 8, color: red[500] }}
                              />
                              Delete
                            </MenuItem>
                          </Menu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
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
        <DialogTitle id="alert-dialog-title">{"د ریکارډ حذف؟"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            آیا تاسو مطمئن یاست چې غواړئ دا ریکارډ حذف کړئ؟ دا عمل بیرته نه شی.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>لغوه</Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            حذف
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
