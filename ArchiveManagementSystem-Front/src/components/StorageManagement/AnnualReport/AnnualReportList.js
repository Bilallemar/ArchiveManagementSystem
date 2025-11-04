import React, { useEffect, useState, useCallback } from "react";
import { getAnnualReports } from "../../../services/StorageManagement/AnnualReportApi";
import { deleteAnnualReport } from "../../../services/StorageManagement/AnnualReportApi";
import ViewAnnualReport from "./ViewAnnualReport";
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
  { id: "bookNumber", label: "کتاب نمبر", minWidth: 100 },
  { id: "province", label: " ولایت", minWidth: 100 },
  { id: "district", label: "ولسوالئ ", minWidth: 100 },
  { id: "year", label: "سال", minWidth: 120 },
  { id: "waseqaType", label: "نوعیت ,وثقه", minWidth: 100 },
  { id: "summaryOfWaseqa", label: "خلاصه وثقه", minWidth: 150 },
  { id: "remarks", label: "ملاحضات", minWidth: 120 },
  { id: "actions", label: "عملیات", minWidth: 120 },
];

export default function AnnualReportList() {
  const [report, setReport] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [field, setField] = useState("bookNumber");
  const [searchTerm, setSearchTerm] = useState("");

  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const loadReport = useCallback(async () => {
    try {
      const response = await getAnnualReports(searchTerm, field);
      console.log(response.data);
      setReport(response.data);
    } catch (error) {
      console.error(error);
    }
  }, [searchTerm, field]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadReport();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, field, loadReport]); //

  //  د سرچ ارزښت بدلول
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  //  د فلټر فیلډ بدلول
  const handleFieldChange = (e) => {
    setField(e.target.value);
  };

  const handleView = () => {
    setOpenViewDialog(true);
    handleClose(); // د مینو بندول
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
    navigate(`/annual-reports/${selectedReport.id}`);
    handleClose();
  };

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
    handleClose();
  };
  const handleNewReport = () => {
    navigate("/annual-reports/add-annual-report");
  };

  const handleDelete = async () => {
    try {
      await deleteAnnualReport(selectedReport.id);
      loadReport();
      toast.success("Report deleted successfully");
    } catch (error) {
      console.error("Failed to delete Report", error);
      toast.error("Failed to delete Report");
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
          alignItems: "center", // د 80% په مرکز کې
          width: "100%",
        }}
      >
        {/* 🔹 Header */}
        <Box
          sx={{
            width: "80%", // د لیست په اندازه
            display: "flex",
            justifyContent: "space-between", // بټن چپ، سرلیک+Breadcrumbs ښي
            alignItems: "center",
            marginBottom: 2,
          }}
        >
          {/* کیڼ طرف: بټن */}
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

          {/* ښي طرف: سرلیک + Breadcrumbs */}
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
              کتاب رسیدات
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
            }}
          >
            <Filter
              value={searchTerm}
              onChange={handleSearch}
              field={field}
              onFieldChange={handleFieldChange}
              fields={[
                { value: "bookNumber", label: "کتاب نمبر" },
                { value: "province", label: " ولایت" },
                { value: "district", label: "ولسوالئ" },
              ]}
            />

            {/* ستاسو د رسېداتو جدول */}
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
                        backgroundColor: "#f4f6f8", // Blue color - you can change this
                        color: "#637381", // White text for better contrast
                        fontWeight: "bold", // Make header text bold
                        fontSize: "0.875rem",
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {report
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    console.log(
                      "Attachments for row id:",
                      row.id,
                      row.attachments
                    );
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.id}
                      >
                        <TableCell align="center">{row.bookNumber}</TableCell>

                        <TableCell align="center">{row.province}</TableCell>
                        <TableCell align="center">{row.district}</TableCell>
                        <TableCell align="center">
                          {new Date(row.year).toLocaleDateString("en-GB")}
                        </TableCell>
                        <TableCell align="center">{row.waseqaType}</TableCell>
                        <TableCell align="center">
                          {row.summaryOfWaseqa}
                        </TableCell>

                        <TableCell align="center">{row.remarks}</TableCell>
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
            count={report.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>

      <ViewAnnualReport
        open={openViewDialog}
        onClose={handleCloseView}
        report={selectedReport}
      />
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Receipt?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this receipt? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
