import React, { useEffect, useState, useCallback } from "react";
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
  Typography,
} from "@mui/material";
import { red } from "@mui/material/colors";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Tooltip } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import AddIcon from "@mui/icons-material/Add";

const columns = [
  { id: "serialNumber", label: "سریال نمبر", minWidth: 100 },
  { id: "archiveNumber", label: "آرشیف نمبر", minWidth: 100 },
  { id: "department", label: "شعبه ", minWidth: 100 },
  { id: "letterNumber", label: "نمبر مکتوب", minWidth: 100 },
  { id: "letterDate", label: "تاریخ مکتوب", minWidth: 120 },
  { id: "sender", label: "مرسل", minWidth: 100 },
  { id: "recipient", label: "مرسل الیه", minWidth: 100 },

  { id: "subjectType", label: "نوعیت موضوع", minWidth: 120 },
  { id: "fileName", label: "فایل", minWidth: 150 },
  { id: "remarks", label: "ملاحضات", minWidth: 120 },
  { id: "actions", label: "عملیات", minWidth: 120 },
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
  const [field, setField] = useState("serialNumber");

  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const loadReceipts = useCallback(async () => {
    try {
      const response = await getReceipts(keyword, field);
      setReceipts(response.data);
    } catch (error) {
      console.error(error);
    }
  }, [keyword, field]);
  useEffect(() => {
    loadReceipts();
  }, [loadReceipts]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadReceipts();
    }, 300);
    return () => clearTimeout(timer);
  }, [keyword, field, loadReceipts]); //

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
            onClick={handleNewReceipt}
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
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              field={field}
              onFieldChange={(e) => setField(e.target.value)}
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
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.id}
                      >
                        <TableCell align="center">{row.serialNumber}</TableCell>
                        <TableCell align="center">
                          {row.archiveNumber}
                        </TableCell>
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
                            <Tooltip title={row.attachments[0].fileName} arrow>
                              <button
                                onClick={() =>
                                  handleDownloadClick(
                                    row.attachments[0].fileName
                                  )
                                }
                                style={{
                                  background: "none",
                                  border: "none",
                                  padding: 0,
                                  margin: 0,
                                  textDecoration: "underline",
                                  cursor: "pointer",
                                  fontSize: "inherit",
                                  fontFamily: "inherit",
                                  maxWidth: "150px", // د جدول ستون عرض کنټرول
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                                aria-label={`ډاونلوډ فایل ${row.attachments[0].fileName}`}
                              >
                                <AttachFileIcon
                                  fontSize="small"
                                  style={{ marginRight: 4 }}
                                />
                                {row.attachments[0].fileName}
                              </button>
                            </Tooltip>
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
      </Box>

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
