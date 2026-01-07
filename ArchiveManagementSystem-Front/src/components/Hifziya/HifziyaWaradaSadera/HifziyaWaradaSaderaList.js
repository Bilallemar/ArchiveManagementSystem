import React, { useEffect, useState, useCallback } from "react";

import { getAllHifziyaWaradaSadera } from "../../../services/RepositoryManagement/HifziyaWaradaSaderaAPI";
import { deleteHifziyaWaradaSadera } from "../../../services/RepositoryManagement/HifziyaWaradaSaderaAPI";
import ViewHifziyaWaradaSadera from "./ViewHifziyaWaradaSadera";
import PageBreadcrumbs from "../../Breadcrumbs/PageBreadcrumbs";
import Filter from "../../Filter";
import EditHifziyaWaradaSaderaDialog from "./EditHifziyaWaradaSaderaDialog";
import {
  FormControl,
  InputLabel,
  Select,
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
import { red } from "@mui/material/colors";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const columns = [
  { id: "no", label: "نمبر", minWidth: 100 },
  { id: "org", label: " اداره", minWidth: 100 },
  { id: "letterNumber", label: "نمبر مکتوب", minWidth: 120 },
  { id: "incommingDate", label: " تاریخ مرسل", minWidth: 150 },
  { id: "outgoingDate", label: " تاریخ مرسل الیه", minWidth: 150 },
  { id: "summary", label: " خلص مطلب", minWidth: 150 },
  { id: "description", label: " ملاحضات", minWidth: 150 },
  { id: "actions", label: "عملیات", minWidth: 120 },
];

export default function HifziyaWaradaSaderaList() {
  const [hifziyaWaradaSadera, setHifziyaWaradaSadera] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedHifziyaWaradaSadera, setSelectedHifziyaWaradaSadera] =
    useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const [field, setField] = useState("bookNumber");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const lodadHifziyaWaradaSadera = useCallback(async () => {
    try {
      const response = await getAllHifziyaWaradaSadera();
      console.log(response.data);
      setHifziyaWaradaSadera(response.data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    lodadHifziyaWaradaSadera();
  }, [lodadHifziyaWaradaSadera]);

  useEffect(() => {
    const timer = setTimeout(() => {
      lodadHifziyaWaradaSadera();
    }, 300);
    return () => clearTimeout(timer);
  }, [lodadHifziyaWaradaSadera]); //

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
    setSelectedHifziyaWaradaSadera(null);
  };

  const handleClick = (event, report) => {
    setAnchorEl(event.currentTarget);
    setSelectedHifziyaWaradaSadera(report);
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
    setSelectedHifziyaWaradaSadera(null);
  };

  const handleEditSuccess = () => {
    lodadHifziyaWaradaSadera();
  };
  const filteredReport = hifziyaWaradaSadera.filter((row) => {
    if (filterType === "all") return true;
    return row.isHifziya === filterType;
  });
  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
    handleClose();
  };
  const handleNewReport = () => {
    navigate("/hifziya-warada-sadera/add-hifziya-warada-sadera");
  };

  const handleDelete = async () => {
    try {
      await deleteHifziyaWaradaSadera(selectedHifziyaWaradaSadera.id);
      lodadHifziyaWaradaSadera();
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
          sx={{ width: "100%", overflow: "hidden", justifyContent: "center" }}
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
                <MenuItem value={true}>حفظیه </MenuItem>
                <MenuItem value={false}>مخزن</MenuItem>
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
                        <TableCell align="center">{row.no || "N/A"}</TableCell>

                        {/* اداره */}
                        <TableCell align="center">
                          {row.org?.name || "N/A"}
                        </TableCell>

                        {/* نمبر مکتوب */}
                        <TableCell align="center">
                          {row.letterNumber || "N/A"}
                        </TableCell>

                        {/* تاریخ وارده */}
                        <TableCell align="center">
                          {row.incommingDate || "N/A"}
                        </TableCell>

                        {/* تاریخ صادره */}
                        <TableCell align="center">
                          {row.outgoingDate || "N/A"}
                        </TableCell>

                        {/* خلاصه */}
                        <TableCell align="center">
                          {row.summary || "N/A"}
                        </TableCell>

                        {/* ملاحظات */}
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

      <ViewHifziyaWaradaSadera
        open={openViewDialog}
        onClose={handleCloseView}
        report={selectedHifziyaWaradaSadera}
      />
      {/* Edit Dialog */}
      <EditHifziyaWaradaSaderaDialog
        open={openEditDialog}
        onClose={handleCloseEdit}
        waradaSadara={selectedHifziyaWaradaSadera}
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
