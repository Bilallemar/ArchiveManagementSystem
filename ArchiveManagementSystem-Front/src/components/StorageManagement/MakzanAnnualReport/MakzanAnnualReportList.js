import React, { useEffect, useState, useCallback } from "react";
import {
  gitAllAnnualReports,
  deleteAnnualReport,
} from "../../../services/StorageManagement/MakzanAnnualReportAPI";
import ViewMakzanAnnualReport from "./ViewMakzanAnnualReport";
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
} from "@mui/material";
import { red } from "@mui/material/colors";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import AddIcon from "@mui/icons-material/Add";

const columns = [
  { id: "address", label: "آدرس", minWidth: 150 },
  { id: "year", label: "سال", minWidth: 100 },
  { id: "docType", label: "نوع سند", minWidth: 120 },
  { id: "summaryWaseqa", label: "خلاصه وثیقه", minWidth: 150 },
  { id: "description", label: "ملاحظات", minWidth: 150 },
  { id: "actions", label: "عملیات", minWidth: 120 },
];

export default function MakzanAnnualReportList() {
  const [reports, setReports] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [field, setField] = useState("address");
  const [searchTerm, setSearchTerm] = useState("");

  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const loadReports = useCallback(async () => {
    try {
      const response = await gitAllAnnualReports();
      setReports(response.data);
    } catch (error) {
      console.error(error);
      toast.error("د معلوماتو لوډولو کې ستونزه");
    }
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

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
    setSelectedReport(null);
  };

  const handleClick = (event, report) => {
    setAnchorEl(event.currentTarget);
    setSelectedReport(report);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    navigate(`/makzan-annual-reports/${selectedReport.id}`);
    handleClose();
  };

  const filteredReports = reports.filter((row) => {
    if (!searchTerm) return true;
    const searchValue = searchTerm.toLowerCase();
    switch (field) {
      case "address":
        return row.address?.toLowerCase().includes(searchValue);
      case "year":
        return row.year?.toString().includes(searchValue);
      case "docType":
        return row.docType?.toLowerCase().includes(searchValue);
      default:
        return true;
    }
  });

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
    handleClose();
  };

  const handleNewReport = () => {
    navigate("/makzan-annual-reports/add");
  };

  const handleDelete = async () => {
    try {
      await deleteAnnualReport(selectedReport.id);
      loadReports();
      toast.success("راپور په بریالیتوب سره حذف شو");
    } catch (error) {
      console.error("Failed to delete report", error);
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
            راپور جدید
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
              د مخزن تسلیمی راپور
            </Typography>
            <PageBreadcrumbs />
          </Box>
        </Box>

        <Paper
          sx={{ width: "80%", overflow: "hidden", justifyContent: "center" }}
        >
          <div style={{ marginTop: "10px", padding: "10px" }}>
            <Filter
              value={searchTerm}
              onChange={handleSearch}
              field={field}
              onFieldChange={handleFieldChange}
              fields={[
                { value: "address", label: "آدرس" },
                { value: "year", label: "سال" },
                { value: "docType", label: "نوع سند" },
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
                {filteredReports
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      <TableCell align="center">
                        {row.address || "N/A"}
                      </TableCell>
                      <TableCell align="center">{row.year || "N/A"}</TableCell>
                      <TableCell align="center">
                        {row.docType || "N/A"}
                      </TableCell>
                      <TableCell align="center">
                        {row.summaryWaseqa || "N/A"}
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
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={filteredReports.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>

      <ViewMakzanAnnualReport
        open={openViewDialog}
        onClose={handleCloseView}
        report={selectedReport}
      />

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>د راپور حذف؟</DialogTitle>
        <DialogContent>
          <DialogContentText>
            آیا تاسو مطمئن یاست چې غواړئ دا راپور حذف کړئ؟
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
