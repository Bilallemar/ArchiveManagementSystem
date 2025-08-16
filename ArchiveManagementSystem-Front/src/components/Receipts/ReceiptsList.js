import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { getReceipts } from "../../services/ReceiptsApi";
import { deleteReceipt } from "../../services/ReceiptsApi";
import ViewReceipt from "./ViewReceipt";
import PageBreadcrumbs from "../Breadcrumbs/PageBreadcrumbs";
import Filter from "../Filter";
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
} from "@mui/material";
import { red } from "@mui/material/colors";
import VisibilityIcon from "@mui/icons-material/Visibility";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const columns = [
  { id: "serialNumber", label: "SerialNumber", minWidth: 100 },
  { id: "archiveNumber", label: "ArchiveNumber", minWidth: 100 },
  { id: "department", label: "Department", minWidth: 100 },
  { id: "letterNumber", label: "LetterNumber", minWidth: 100 },
  { id: "letterDate", label: "LetterDate", minWidth: 120 },
  { id: "sender", label: "Sender", minWidth: 100 },
  { id: "recipient", label: "Recipient", minWidth: 100 },

  { id: "subjectType", label: "SubjectType", minWidth: 120 },
  { id: "fileName", label: "FileName", minWidth: 150 },
  { id: "remarks", label: "Remarks", minWidth: 120 },
  { id: "actions", label: "Actions", minWidth: 120 },
];

export default function ReceiptsList() {
  const [receipts, setReceipts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDownloadDialog, setOpenDownloadDialog] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [keyword, setKeyword] = useState("");

  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  useEffect(() => {
    loadReceipts();
  }, []);

  useEffect(() => {
    const delyDebounce = setTimeout(() => {
      loadReceipts(keyword);
    }, 300);
    return () => clearTimeout(delyDebounce);
  }, [keyword]);
  const loadReceipts = async (searchKeyword = "") => {
    try {
      const response = await getReceipts(searchKeyword); // keyword واستوي
      console.log("API response:", response.data);
      setReceipts(response.data);
    } catch (error) {
      console.error("Failed to load receipts", error);
      toast.error("Failed to load receipts");
    }
  };

  const handleDownloadClick = (fileName) => {
    setSelectedFileName(fileName);
    setOpenDownloadDialog(true);
  };

  const handleDownloadConfirm = () => {
    window.open(
      `http://localhost:8081/api/receipts/download/${selectedFileName}`,
      "_blank",
      "noopener,noreferrer"
    );
    setOpenDownloadDialog(false);
  };

  const handleDownloadCancel = () => {
    setOpenDownloadDialog(false);
  };

  const handleView = () => {
    setOpenViewDialog(true);
    handleClose(); // د مینو بندول
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
    navigate(`/receipts/${selectedReceipt.id}`);
    handleClose();
  };

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
    handleClose();
  };
  const handleNewReceipt = () => {
    navigate("/receipts/add-receipt");
  };

  const handleDelete = async () => {
    try {
      await deleteReceipt(selectedReceipt.id);
      loadReceipts();
      toast.success("Receipt deleted successfully");
    } catch (error) {
      console.error("Failed to delete receipt", error);
      toast.error("Failed to delete receipt");
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
  // const handleSearchChange = (event) => {
  //   setSearchTerm(event.target.value);
  //   // دلته د filter function یا API call وکړئ
  // };
  return (
    <>
      <div
        style={{
          marginBottom: "50px",
          textAlign: "left",
          padding: "20px",
          marginTop: "20px",
          marginRight: "20px",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            fontFamily: "B nazanin",
            textAlign: "right",
          }}
        >
          کتاب رسیدات
        </h1>

        <Button
          variant="contained"
          color="primary"
          onClick={handleNewReceipt}
          style={{
            float: "right",
          }}
        >
          New Receipt
        </Button>
      </div>
      <Box
        dir="rtl"
        sx={{
          textAlign: "right",
          fontFamily: "B Nazanin", // Make sure to use the correct font name
          padding: "8px 16px", // Adjust padding as needed
          marginBottom: "16px", // Adjust margin as needed
        }}
      >
        <PageBreadcrumbs />
      </Box>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <div>
          <Filter
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            width="400px"
            height="45px"
            placeholder="جستجو ..."
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
              {receipts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  console.log(
                    "Attachments for row id:",
                    row.id,
                    row.attachments
                  );
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      <TableCell align="center">{row.serialNumber}</TableCell>
                      <TableCell align="center">{row.archiveNumber}</TableCell>
                      <TableCell align="center">{row.department}</TableCell>
                      <TableCell align="center">{row.letterNumber}</TableCell>
                      <TableCell align="center">
                        {new Date(row.letterDate).toLocaleDateString("en-GB")}
                      </TableCell>
                      <TableCell align="center">{row.sender}</TableCell>
                      <TableCell align="center">{row.recipient}</TableCell>
                      <TableCell align="center">{row.subjectType}</TableCell>
                      <TableCell align="center">
                        {row.attachments && row.attachments.length > 0 ? (
                          <button
                            onClick={() =>
                              handleDownloadClick(row.attachments[0].fileName)
                            }
                            style={{
                              background: "none",
                              border: "none",
                              padding: 0,
                              margin: 0,
                              color: "blue",
                              textDecoration: "underline",
                              cursor: "pointer",
                              fontSize: "inherit",
                              fontFamily: "inherit",
                            }}
                            aria-label={`ډاونلوډ فایل ${row.attachments[0].fileName}`}
                          >
                            {row.attachments[0].fileName}
                          </button>
                        ) : (
                          <span>نشته</span>
                        )}
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
          count={receipts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <ViewReceipt
        open={openViewDialog}
        onClose={handleCloseView}
        receipt={selectedReceipt}
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
      <Dialog
        open={openDownloadDialog}
        onClose={handleDownloadCancel}
        aria-labelledby="download-dialog-title"
        aria-describedby="download-dialog-description"
      >
        <DialogTitle id="download-dialog-title">تایید د ډاونلوډ</DialogTitle>
        <DialogContent>
          آیا تاسو غواړئ فایل ډاونلوډ کړئ؟
          {selectedFileName}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDownloadCancel}>نه</Button>
          <Button
            onClick={handleDownloadConfirm}
            autoFocus
            style={{ backgroundColor: "#4CAF50", color: "white" }}
          >
            هو
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
