import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  gitAllMakzanSubmissionReport,
  deleteMakzanSubmissionReport,
} from "../../../services/StorageManagement/MakzanSubmissionReportAPI";
import ViewMakzanSubmissionReport from "./ViewMakzanSubmissionReport";
import PageBreadcrumbs from "../../Breadcrumbs/PageBreadcrumbs";
import Filter from "../../Filter";
import EditMakzanSubmissionReportDialog from "./EditMakzanSubmissionReportDialog";
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
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { red } from "@mui/material/colors";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import AddIcon from "@mui/icons-material/Add";
import getMakzanSubmissionReportTexts from "../../../helpers/Storage/MakzanSubmissionReport/MakzanSubmissionReportText";
import { useTranslation } from "react-i18next";

export default function MakzanSubmissionReportList() {
  const [reports, setReports] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const [field, setField] = useState("province");
  const [searchTerm, setSearchTerm] = useState("");

  const { t } = useTranslation("makzanSubmissionReport");
  const texts = getMakzanSubmissionReportTexts(t);

  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  // Define columns using localized texts
  const columns = [
    { id: "province", label: texts.province || "ولایت", minWidth: 140 },
    { id: "district", label: texts.district || "ولسوالي", minWidth: 140 },
    { id: "year", label: texts.year, minWidth: 100 },
    { id: "docType", label: texts.docType, minWidth: 120 },
    { id: "summaryWaseqa", label: texts.summaryWaseqa, minWidth: 150 },
    { id: "description", label: texts.description, minWidth: 150 },
    { id: "actions", label: texts.actions, minWidth: 120, align: "center" },
  ];

  const loadReports = useCallback(async () => {
    try {
      const response = await gitAllMakzanSubmissionReport();
      setReports(response.data || []);
    } catch (error) {
      console.error(error);
      toast.error(texts.loadError || "د راپورونو لست لوستل ناکام شو");
    }
  }, [texts.loadError]);

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
    setOpenEditDialog(true);
    handleClose();
  };

  const handleCloseEdit = () => {
    setOpenEditDialog(false);
    setSelectedReport(null);
  };

  const handleEditSuccess = () => {
    loadReports();
  };

  const filteredReports = useMemo(() => {
    let data = [...reports];

    if (searchTerm?.trim()) {
      const searchValue = searchTerm.toLowerCase().trim();

      data = data.filter((row) => {
        switch (field) {
          case "province":
            return row.province?.name?.toLowerCase()?.includes(searchValue) ?? false;
          case "district":
            return row.district?.name?.toLowerCase()?.includes(searchValue) ?? false;
          case "year":
            return row.year?.toString().includes(searchValue) ?? false;
          case "docType":
            return row.docType?.name?.toLowerCase()?.includes(searchValue) ?? false;
          default:
            return true;
        }
      });
    }

    // Sort by newest first (highest ID)
    data.sort((a, b) => b.id - a.id);

    return data;
  }, [reports, searchTerm, field]);

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
    handleClose();
  };

  const handleNewReport = () => {
    navigate("/annual-reports-info/add");
  };

  const handleDelete = async () => {
    try {
      await deleteMakzanSubmissionReport(selectedReport.id);
      loadReports();
      toast.success(texts.deleteSuccess || "راپور په بریالیتوب سره له منځه ولاړ");
    } catch (error) {
      console.error("Failed to delete report", error);
      toast.error(texts.deleteError || "د راپور د له منځه وړلو پر مهال ستونزه رامنځته شوه");
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

  // Helper to extract province & district
  const getProvinceAndDistrict = (report) => {
    return {
      province: report.province?.name || "N/A",
      district: report.district?.name || "N/A",
    };
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
            startIcon={<AddIcon />}
            onClick={handleNewReport}
            color="primary"
          >
            {texts.newReport || "نوی راپور ثبت کړئ"}
          </Button>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <PageBreadcrumbs />
          </Box>
        </Box>

        {/* Filter */}
        <Paper sx={{ p: 2, mb: 4, borderRadius: 2 }}>
          <Filter
            value={searchTerm}
            onChange={handleSearch}
            field={field}
            onFieldChange={handleFieldChange}
            fields={[
              { value: "province", label: texts.province || "ولایت" },
              { value: "district", label: texts.district || "ولسوالي" },
              { value: "year", label: texts.year },
              { value: "docType", label: texts.docType },
            ]}
          />
        </Paper>

        {/* Table */}
        <Paper sx={{ overflow: "hidden", borderRadius: 2 }}>
          <TableContainer sx={{ maxHeight: 520 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align || "center"}
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
                {filteredReports
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    const { province, district } = getProvinceAndDistrict(row);
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.id}
                      >
                        <TableCell align="center">{province}</TableCell>
                        <TableCell align="center">{district}</TableCell>
                        <TableCell align="center">
                          {row.year || "N/A"}
                        </TableCell>
                        <TableCell align="center">
                          {row.docType?.name || "N/A"}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            maxWidth: 180,
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                          }}
                        >
                          {row.summaryWaseqa || "N/A"}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            maxWidth: 200,
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                          }}
                        >
                          {row.description || "N/A"}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton onClick={(e) => handleClick(e, row)}>
                            <MoreVertIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={filteredReports.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage={texts.rowsPerPage || "په پاڼه کې قطارونه"}
          />
        </Paper>
      </Box>

      {/* Dialogs */}
      <ViewMakzanSubmissionReport
        open={openViewDialog}
        onClose={handleCloseView}
        report={selectedReport}
      />

      <EditMakzanSubmissionReportDialog
        open={openEditDialog}
        onClose={handleCloseEdit}
        report={selectedReport}
        onSuccess={handleEditSuccess}
      />

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>
          {texts.deleteConfirmTitle || "د راپور له منځه وړل"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {texts.deleteConfirmMessage ||
              "ایا تاسو غواړئ دا راپور په بشپړه توګه له منځه یوسئ؟ دا عمل بیرته نه راګرځي."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>
            {texts.cancel || "نه"}
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            {texts.delete || "هو، له منځه یوسئ"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Menu for actions */}
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleView}>
          <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
          {texts.view || "لیدل"}
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          {texts.edit || "تعدیل"}
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: red[600] }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1, color: red[600] }} />
          {texts.delete || "له منځه وړل"}
        </MenuItem>
      </Menu>
    </>
  );
}