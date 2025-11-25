import React, { useEffect, useState, useCallback } from "react";
import {
  getReceivedIssuedBooks,
  deleteReceivedIssuedBook,
} from "../../../services/StorageManagement/ReceivedIssuedBookAPI";
import ViewReceivedIssuedBook from "./ViewReceivedIssuedBook";
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
  Tooltip,
} from "@mui/material";
import { red } from "@mui/material/colors";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import AddIcon from "@mui/icons-material/Add";

const columns = [
  { id: "bookNumber", label: "شماره کتاب", minWidth: 100 },
  { id: "sender", label: "مرسل", minWidth: 100 },
  { id: "recipient", label: "مرسل الیه", minWidth: 100 },
  { id: "letterNumber", label: "نمبر مکتوب", minWidth: 100 },
  { id: "issuedDate", label: "تاریخ صدور", minWidth: 120 },
  { id: "receivedDate", label: "تاریخ دریافت", minWidth: 120 },
  { id: "summary", label: "خلاصه", minWidth: 150 },
  { id: "subjectType", label: "نوعیت موضوع", minWidth: 120 },
  { id: "remarks", label: "ملاحظات", minWidth: 120 },
  { id: "fileName", label: "فایل", minWidth: 150 },
  { id: "actions", label: "عملیات", minWidth: 120 },
];

export default function ReceivedIssuedBookList() {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDownloadDialog, setOpenDownloadDialog] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [field, setField] = useState("bookNumber");
  const [searchTerm, setSearchTerm] = useState("");

  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const loadBooks = useCallback(async () => {
    try {
      const response = await getReceivedIssuedBooks(searchTerm, field);
      setBooks(response.data);
    } catch (error) {
      console.error(error);
    }
  }, [searchTerm, field]);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadBooks();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, field, loadBooks]);

  const handleDownloadClick = (fileName) => {
    setSelectedFileName(fileName);
    setOpenDownloadDialog(true);
  };
  //  د سرچ ارزښت بدلول
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  //  د فلټر فیلډ بدلول
  const handleFieldChange = (e) => {
    setField(e.target.value);
  };
  const handleDownloadConfirm = () => {
    window.open(
      `http://localhost:8081/api/received-issued-books/download/${selectedFileName}`,
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
    handleClose();
  };

  const handleCloseView = () => {
    setOpenViewDialog(false);
    setSelectedBook(null);
  };

  const handleClick = (event, book) => {
    setAnchorEl(event.currentTarget);
    setSelectedBook(book);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    navigate(`/received-issued-books/${selectedBook.id}`);
    handleClose();
  };

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
    handleClose();
  };

  const handleNewBook = () => {
    navigate("/received-issued-books/add-received-issued-book");
  };

  const handleDelete = async () => {
    try {
      await deleteReceivedIssuedBook(selectedBook.id);
      loadBooks();
      toast.success("Book deleted successfully");
    } catch (error) {
      console.error("Failed to delete book", error);
      toast.error("Failed to delete book");
    } finally {
      setOpenDeleteDialog(false);
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
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
            onClick={handleNewBook}
            sx={{
              backgroundColor: "black",
              color: "white",
              borderRadius: "10px",
              "&:hover": { backgroundColor: "#1d252e" },
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
              sx={{ fontFamily: "B Nazanin", fontWeight: "bold" }}
            >
              کتاب های وارده و صادره
            </Typography>
            <PageBreadcrumbs />
          </Box>
        </Box>

        <Paper
          sx={{ width: "80%", overflow: "hidden", justifyContent: "center" }}
        >
          <div style={{ marginTop: "10px" }}>
            <Filter
              value={searchTerm}
              onChange={handleSearch}
              field={field}
              onFieldChange={handleFieldChange}
              fields={[
                { value: "bookNumber", label: "شماره کتاب  " },
                { value: "sender", label: "مرسل " },
                { value: "recipient", label: "  مرسل الیه" },
                { value: "subjectType", label: "نوعیت موضوع" },
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
                {books
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
                        <TableCell align="center">{row.sender}</TableCell>
                        <TableCell align="center">{row.recipient}</TableCell>
                        <TableCell align="center">{row.letterNumber}</TableCell>
                        <TableCell align="center">
                          {new Date(row.issuedDate).toLocaleDateString("en-GB")}
                        </TableCell>
                        <TableCell align="center">
                          {new Date(row.receivedDate).toLocaleDateString(
                            "en-GB"
                          )}
                        </TableCell>
                        <TableCell align="center">{row.summary}</TableCell>
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
            count={books.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>

      <ViewReceivedIssuedBook
        open={openViewDialog}
        onClose={handleCloseView}
        book={selectedBook}
      />

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Book?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            آیا ډاډه یی چې دا کتاب حذف کړئ؟ دا عمل بیرته نه کېږي.
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
