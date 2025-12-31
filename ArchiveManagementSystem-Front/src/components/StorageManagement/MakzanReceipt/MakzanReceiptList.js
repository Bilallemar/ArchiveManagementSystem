import React, { useEffect, useState, useCallback } from "react";
import {
  getAllReceipts,
  deleteReceipt,
} from "../../../services/StorageManagement/MakzanReceiptAPI";
import ViewMakzanReceipt from "./ViewMakzanReceipt";
import PageBreadcrumbs from "../../Breadcrumbs/PageBreadcrumbs";
import Filter from "../../Filter";
import EditReceiptDialog from "./EditReceiptDialog";
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
  { id: "no", label: "نمبر", minWidth: 100 },
  { id: "docNo", label: "نمبر سند", minWidth: 120 },
  { id: "org", label: "اداره", minWidth: 120 },
  { id: "letterNo", label: "نمبر مکتوب", minWidth: 120 },
  { id: "letterDate", label: "تاریخ مکتوب", minWidth: 120 },
  { id: "subjectType", label: "نوع موضوع", minWidth: 120 },
  { id: "description", label: "ملاحظات", minWidth: 150 },
  { id: "actions", label: "عملیات", minWidth: 120 },
];

export default function MakzanReceiptList() {
  const [receipts, setReceipts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const [field, setField] = useState("no");
  const [searchTerm, setSearchTerm] = useState("");

  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const loadReceipts = useCallback(async () => {
    try {
      const response = await getAllReceipts();
      setReceipts(response.data);
    } catch (error) {
      console.error(error);
      toast.error("د معلوماتو لوډولو کې ستونزه");
    }
  }, []);

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
  const filteredReceipts = receipts.filter((row) => {
    if (!searchTerm) return true;
    const searchValue = searchTerm.toLowerCase();
    switch (field) {
      case "no":
        return row.no?.toLowerCase().includes(searchValue);
      case "docNo":
        return row.docNo?.toLowerCase().includes(searchValue);
      case "letterNo":
        return row.letterNo?.toLowerCase().includes(searchValue);
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

  const handleNewReceipt = () => {
    navigate("/makzan-receipts/add");
  };

  const handleDelete = async () => {
    try {
      await deleteReceipt(selectedReceipt.id);
      loadReceipts();
      toast.success("رسید په بریالیتوب سره حذف شو");
    } catch (error) {
      console.error("Failed to delete receipt", error);
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
            رسید جدید
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
              د مخزن رسیدونه
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
                { value: "no", label: "نمبر" },
                { value: "docNo", label: "نمبر سند" },
                { value: "letterNo", label: "نمبر مکتوب" },
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
                {filteredReceipts
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      <TableCell align="center">{row.no || "N/A"}</TableCell>
                      <TableCell align="center">{row.docNo || "N/A"}</TableCell>
                      <TableCell align="center">
                        {row.org?.name || "N/A"}
                      </TableCell>
                      <TableCell align="center">
                        {row.letterNo || "N/A"}
                      </TableCell>
                      <TableCell align="center">
                        {row.letterDate || "N/A"}
                      </TableCell>
                      <TableCell align="center">
                        {row.subjectType || "N/A"}
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
        <DialogTitle>د رسید حذف؟</DialogTitle>
        <DialogContent>
          <DialogContentText>
            آیا تاسو مطمئن یاست چې غواړئ دا رسید حذف کړئ؟
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
// import React, { useEffect, useState, useCallback } from "react";
// import {
//   searchReceipts, // 🔹 Use searchReceipts instead of getAllReceipts
//   deleteReceipt,
// } from "../../../services/StorageManagement/MakzanReceiptAPI";
// import ViewMakzanReceipt from "./ViewMakzanReceipt";
// import PageBreadcrumbs from "../../Breadcrumbs/PageBreadcrumbs";
// import Filter from "../../Filter";
// import EditReceiptDialog from "./EditReceiptDialog"; // 🔹 Import EditHazariDialog
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   TablePagination,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
//   DialogActions,
//   Button,
//   Box,
//   Typography,
// } from "@mui/material";
// import { red } from "@mui/material/colors";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { IconButton, Menu, MenuItem } from "@mui/material";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import AddIcon from "@mui/icons-material/Add";

// const columns = [
//   { id: "no", label: "نمبر", minWidth: 100 },
//   { id: "docNo", label: "نمبر سند", minWidth: 120 },
//   { id: "org", label: "اداره", minWidth: 120 },
//   { id: "letterNo", label: "نمبر مکتوب", minWidth: 120 },
//   { id: "letterDate", label: "تاریخ مکتوب", minWidth: 120 },
//   { id: "subjectType", label: "نوع موضوع", minWidth: 120 },
//   { id: "description", label: "ملاحظات", minWidth: 150 },
//   { id: "actions", label: "عملیات", minWidth: 120 },
// ];

// export default function MakzanReceiptList() {
//   const [receipts, setReceipts] = useState([]);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedReceipt, setSelectedReceipt] = useState(null);
//   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
//   const [openEditDialog, setOpenEditDialog] = useState(false);
//   const [openViewDialog, setOpenViewDialog] = useState(false);
//   const [field, setField] = useState(""); // 🔹 Empty = search all fields
//   const [searchTerm, setSearchTerm] = useState("");

//   const open = Boolean(anchorEl);
//   const navigate = useNavigate();

//   // 🔹 Load receipts with search
//   const loadReceipts = useCallback(async () => {
//     try {
//       const response = await searchReceipts(field, searchTerm);
//       setReceipts(response.data);
//     } catch (error) {
//       console.error(error);
//       toast.error("د معلوماتو لوډولو کې ستونزه");
//     }
//   }, [field, searchTerm]); // 🔹 Re-run when field or searchTerm changes

//   useEffect(() => {
//     loadReceipts();
//   }, [loadReceipts]);

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//     setPage(0); // 🔹 Reset to first page on search
//   };

//   const handleFieldChange = (e) => {
//     setField(e.target.value);
//     setPage(0); // 🔹 Reset to first page on field change
//   };

//   const handleView = () => {
//     setOpenViewDialog(true);
//     handleClose();
//   };

//   const handleCloseView = () => {
//     setOpenViewDialog(false);
//     setSelectedReceipt(null);
//   };

//   const handleClick = (event, receipt) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedReceipt(receipt);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const handleEdit = () => {
//     setOpenEditDialog(true);
//     handleClose();
//   };

//   const handleCloseEdit = () => {
//     setOpenEditDialog(false);
//     setSelectedReceipt(null);
//   };

//   const handleEditSuccess = () => {
//     loadReceipts();
//   };
//   // 🔹 REMOVED: Frontend filtering (now done by backend)
//   // const filteredReceipts = receipts.filter(...)

//   const handleDeleteClick = () => {
//     setOpenDeleteDialog(true);
//     handleClose();
//   };

//   const handleNewReceipt = () => {
//     navigate("/makzan-receipts/add");
//   };

//   const handleDelete = async () => {
//     try {
//       await deleteReceipt(selectedReceipt.id);
//       loadReceipts(); // 🔹 Reload after delete
//       toast.success("رسید په بریالیتوب سره حذف شو");
//     } catch (error) {
//       console.error("Failed to delete receipt", error);
//       toast.error("د حذف کولو کې ستونزه");
//     } finally {
//       setOpenDeleteDialog(false);
//     }
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };

//   return (
//     <>
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           width: "100%",
//         }}
//       >
//         <Box
//           sx={{
//             width: "80%",
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             marginBottom: 2,
//           }}
//         >
//           <Button
//             variant="contained"
//             onClick={handleNewReceipt}
//             sx={{
//               backgroundColor: "black",
//               color: "white",
//               borderRadius: "10px",
//               "&:hover": {
//                 backgroundColor: "#1d252e",
//               },
//             }}
//             endIcon={<AddIcon />}
//           >
//             رسید جدید
//           </Button>

//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "flex-end",
//               textAlign: "right",
//             }}
//           >
//             <Typography
//               variant="h5"
//               sx={{
//                 fontFamily: "B Nazanin",
//                 fontWeight: "bold",
//               }}
//             >
//               د مخزن رسیدونه
//             </Typography>
//             <PageBreadcrumbs />
//           </Box>
//         </Box>

//         <Paper
//           sx={{ width: "80%", overflow: "hidden", justifyContent: "center" }}
//         >
//           <div style={{ marginTop: "10px", padding: "10px" }}>
//             <Filter
//               value={searchTerm}
//               onChange={handleSearch}
//               field={field}
//               onFieldChange={handleFieldChange}
//               fields={[
//                 { value: "", label: "ټول فیلډونه" }, // 🔹 Added "All Fields"
//                 { value: "no", label: "نمبر" },
//                 { value: "docNo", label: "نمبر سند" },
//                 { value: "letterNo", label: "نمبر مکتوب" },
//                 { value: "subjectType", label: "نوع موضوع" },
//                 { value: "description", label: "ملاحظات" },
//               ]}
//             />
//           </div>
//           <TableContainer sx={{ maxHeight: 440, textAlign: "center" }}>
//             <Table stickyHeader>
//               <TableHead>
//                 <TableRow>
//                   {columns.map((column) => (
//                     <TableCell
//                       key={column.id}
//                       align="center"
//                       style={{
//                         minWidth: column.minWidth,
//                         backgroundColor: "#f4f6f8",
//                         color: "#637381",
//                         fontWeight: "bold",
//                         fontSize: "0.875rem",
//                       }}
//                     >
//                       {column.label}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {receipts // 🔹 Use receipts directly (already filtered by backend)
//                   .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                   .map((row) => (
//                     <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
//                       <TableCell align="center">{row.no || "N/A"}</TableCell>
//                       <TableCell align="center">{row.docNo || "N/A"}</TableCell>
//                       <TableCell align="center">
//                         {row.org?.name || "N/A"}
//                       </TableCell>
//                       <TableCell align="center">
//                         {row.letterNo || "N/A"}
//                       </TableCell>
//                       <TableCell align="center">
//                         {row.letterDate || "N/A"}
//                       </TableCell>
//                       <TableCell align="center">
//                         {row.subjectType || "N/A"}
//                       </TableCell>
//                       <TableCell align="center">
//                         {row.description || "N/A"}
//                       </TableCell>
//                       <TableCell align="center">
//                         <IconButton onClick={(e) => handleClick(e, row)}>
//                           <MoreVertIcon />
//                         </IconButton>
//                         <Menu
//                           anchorEl={anchorEl}
//                           open={open}
//                           onClose={handleClose}
//                         >
//                           <MenuItem onClick={handleView}>
//                             <VisibilityIcon
//                               fontSize="small"
//                               style={{ marginRight: 8 }}
//                             />
//                             View
//                           </MenuItem>
//                           <MenuItem onClick={handleEdit}>
//                             <EditIcon
//                               fontSize="small"
//                               style={{ marginRight: 8 }}
//                             />
//                             Edit
//                           </MenuItem>
//                           <MenuItem
//                             onClick={handleDeleteClick}
//                             style={{ color: red[500] }}
//                           >
//                             <DeleteIcon
//                               fontSize="small"
//                               style={{ marginRight: 8, color: red[500] }}
//                             />
//                             Delete
//                           </MenuItem>
//                         </Menu>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//           <TablePagination
//             rowsPerPageOptions={[10, 25, 50]}
//             component="div"
//             count={receipts.length} // 🔹 Use receipts.length
//             rowsPerPage={rowsPerPage}
//             page={page}
//             onPageChange={handleChangePage}
//             onRowsPerPageChange={handleChangeRowsPerPage}
//           />
//         </Paper>
//       </Box>

//       <ViewMakzanReceipt
//         open={openViewDialog}
//         onClose={handleCloseView}
//         receipt={selectedReceipt}
//       />
//       <EditReceiptDialog
//         open={openEditDialog}
//         onClose={handleCloseEdit}
//         receipt={selectedReceipt}
//         onSuccess={handleEditSuccess}
//       />
//       <Dialog
//         open={openDeleteDialog}
//         onClose={() => setOpenDeleteDialog(false)}
//       >
//         <DialogTitle>د رسید حذف؟</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             آیا تاسو مطمئن یاست چې غواړئ دا رسید حذف کړئ؟
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDeleteDialog(false)}>لغوه</Button>
//           <Button onClick={handleDelete} color="error" autoFocus>
//             حذف
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// }
