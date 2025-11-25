import React, { useEffect, useState, useCallback } from "react";
import { FormControl, InputLabel, Select } from "@mui/material";

import {
  getAllHifziyaHazaris,
  getHifziyaHazariById,
} from "../../../services/RepositoryManagement/HifziyaHazariAPI";
import { deleteHifziyaHazari } from "../../../services/RepositoryManagement/HifziyaHazariAPI";
import ViewAnnualReport from "./ViewHazari";
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
  { id: "type", label: "نوعیت", minWidth: 100 },
  { id: "year", label: "سال", minWidth: 120 },
  { id: "org", label: " اداره", minWidth: 100 },
  { id: "description", label: " ملاحضات", minWidth: 150 },
  { id: "actions", label: "عملیات", minWidth: 120 },
];

export default function AnnualReportList() {
  const [report, setReport] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedHazari, setSelectedHazari] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [field, setField] = useState("bookNumber");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const loadHazari = useCallback(async () => {
    try {
      const response = await getAllHifziyaHazaris();
      console.log(response.data);
      setReport(response.data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    loadHazari();
  }, [loadHazari]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadHazari();
    }, 300);
    return () => clearTimeout(timer);
  }, [loadHazari]); //

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
    setSelectedHazari(null);
  };

  const handleClick = (event, report) => {
    setAnchorEl(event.currentTarget);
    setSelectedHazari(report);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    navigate(`/hifziya-hazari/${selectedHazari.id}`);
    handleClose();
  };
  const filteredReport = report.filter((row) => {
    if (filterType === "all") return true;
    return row.isIndraj === filterType;
  });
  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
    handleClose();
  };
  const handleNewReport = () => {
    navigate("/hifziya-hazari/add-hifziya-hazari");
  };

  const handleDelete = async () => {
    try {
      await deleteHifziyaHazari(selectedHazari.id);
      loadHazari();
      toast.success("Hazari deleted successfully");
    } catch (error) {
      console.error("Failed to delete hazari", error);
      toast.error("Failed to delete hazari");
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
              کتاب حاضری
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
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>د ریکارډ ډول</InputLabel>
              <Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                label="د ریکارډ ډول"
              >
                <MenuItem value="all">ټول</MenuItem>
                <MenuItem value={true}>اندراج</MenuItem>
                <MenuItem value={false}>حاضری</MenuItem>
              </Select>
            </FormControl>
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
                {filteredReport
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
                        <TableCell align="center">
                          {row.type?.name || "N/A"}
                        </TableCell>

                        <TableCell align="center">
                          {new Date(row.year).toLocaleDateString("en-GB")}
                        </TableCell>
                        <TableCell align="center">
                          {row.org?.name || "N/A"}
                        </TableCell>
                        <TableCell align="center">{row.description}</TableCell>
                        {/* <TableCell align="center">{row.isIndraj}</TableCell> */}

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

      <ViewAnnualReport
        open={openViewDialog}
        onClose={handleCloseView}
        report={selectedHazari}
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
