// import React, { useEffect, useState, useCallback } from "react";
// import { FormControl, InputLabel, Select } from "@mui/material";
// import {
//   getAllArchives,
//   deleteArchive,
// } from "../../../services/ArchiveManagement/ArchiveAPI";
// import ViewArchive from "./ViewArchive";
// import PageBreadcrumbs from "../../Breadcrumbs/PageBreadcrumbs";
// import Filter from "../../Filter";
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
//   { id: "docNo", label: "نمبر سند", minWidth: 120 },
//   { id: "incommingDate", label: "تاریخ وارده", minWidth: 120 },
//   { id: "outgoingDate", label: "تاریخ صادره", minWidth: 120 },
//   { id: "org", label: "اداره", minWidth: 120 },
//   { id: "submitedDate", label: "تاریخ تسلیمی", minWidth: 120 },
//   { id: "docType", label: "نوع سند", minWidth: 120 },
//   { id: "year", label: "سال", minWidth: 100 },
//   { id: "description", label: "ملاحظات", minWidth: 150 },
//   { id: "actions", label: "عملیات", minWidth: 120 },
// ];

// export default function ArchiveList() {
//   const [archives, setArchives] = useState([]);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedArchive, setSelectedArchive] = useState(null);
//   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
//   const [openViewDialog, setOpenViewDialog] = useState(false);
//   const [field, setField] = useState("docNo");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterType, setFilterType] = useState("all");

//   const open = Boolean(anchorEl);
//   const navigate = useNavigate();

//   const loadArchives = useCallback(async () => {
//     try {
//       const response = await getAllArchives();
//       setArchives(response.data);
//     } catch (error) {
//       console.error(error);
//       toast.error("د معلوماتو لوډولو کې ستونزه");
//     }
//   }, []);

//   useEffect(() => {
//     loadArchives();
//   }, [loadArchives]);

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const handleFieldChange = (e) => {
//     setField(e.target.value);
//   };

//   const handleView = () => {
//     setOpenViewDialog(true);
//     handleClose();
//   };

//   const handleCloseView = () => {
//     setOpenViewDialog(false);
//     setSelectedArchive(null);
//   };

//   const handleClick = (event, archive) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedArchive(archive);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const handleEdit = () => {
//     navigate(`/archive/${selectedArchive.id}`);
//     handleClose();
//   };

//   const filteredArchives = archives.filter((row) => {
//     // Filter by isIncoming
//     if (filterType !== "all" && row.isIncoming !== filterType) {
//       return false;
//     }

//     // Filter by search
//     if (!searchTerm) return true;
//     const searchValue = searchTerm.toLowerCase();
//     switch (field) {
//       case "docNo":
//         return row.docNo?.toLowerCase().includes(searchValue);
//       case "org":
//         return row.org?.name?.toLowerCase().includes(searchValue);
//       case "year":
//         return row.year?.toString().includes(searchValue);
//       case "docType":
//         return row.docType?.toLowerCase().includes(searchValue);
//       default:
//         return true;
//     }
//   });

//   const handleDeleteClick = () => {
//     setOpenDeleteDialog(true);
//     handleClose();
//   };

//   const handleNewArchive = () => {
//     navigate("/archive/add");
//   };

//   const handleDelete = async () => {
//     try {
//       await deleteArchive(selectedArchive.id);
//       loadArchives();
//       toast.success("آرشیف په بریالیتوب سره حذف شو");
//     } catch (error) {
//       console.error("Failed to delete archive", error);
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
//             onClick={handleNewArchive}
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
//             آرشیف جدید
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
//                 fontWeight: "bold",
//               }}
//             >
//               آرشیف
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
//                 { value: "docNo", label: "نمبر سند" },
//                 { value: "org", label: "اداره" },
//                 { value: "year", label: "سال" },
//                 { value: "docType", label: "نوع سند" },
//               ]}
//             />
//             <FormControl sx={{ minWidth: 200, ml: 2 }}>
//               <InputLabel>ډول</InputLabel>
//               <Select
//                 value={filterType}
//                 onChange={(e) => setFilterType(e.target.value)}
//                 label="ډول"
//               >
//                 <MenuItem value="all">ټول</MenuItem>
//                 <MenuItem value={true}>وارده</MenuItem>
//                 <MenuItem value={false}>صادره</MenuItem>
//               </Select>
//             </FormControl>
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
//                 {filteredArchives
//                   .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                   .map((row) => (
//                     <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
//                       <TableCell align="center">{row.docNo || "N/A"}</TableCell>
//                       <TableCell align="center">
//                         {row.incommingDate || "N/A"}
//                       </TableCell>
//                       <TableCell align="center">
//                         {row.outgoingDate || "N/A"}
//                       </TableCell>
//                       <TableCell align="center">
//                         {row.org?.name || "N/A"}
//                       </TableCell>
//                       <TableCell align="center">
//                         {row.submitedDate || "N/A"}
//                       </TableCell>
//                       <TableCell align="center">
//                         {row.docType || "N/A"}
//                       </TableCell>
//                       <TableCell align="center">{row.year || "N/A"}</TableCell>
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
//             count={filteredArchives.length}
//             rowsPerPage={rowsPerPage}
//             page={page}
//             onPageChange={handleChangePage}
//             onRowsPerPageChange={handleChangeRowsPerPage}
//           />
//         </Paper>
//       </Box>

//       <ViewArchive
//         open={openViewDialog}
//         onClose={handleCloseView}
//         archive={selectedArchive}
//       />

//       <Dialog
//         open={openDeleteDialog}
//         onClose={() => setOpenDeleteDialog(false)}
//       >
//         <DialogTitle>د آرشیف حذف؟</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             آیا تاسو مطمئن یاست چې غواړئ دا آرشیف حذف کړئ؟
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
// import React, { useEffect, useState, useCallback } from "react";
// import { FormControl, InputLabel, Select } from "@mui/material";
// import {
//   gitAllArchives,
//   deleteArchive,
// } from "../../../services/ArchiveManagement/ArchiveAPI";
// import ViewArchive from "./ViewArchive";
// import PageBreadcrumbs from "../../Breadcrumbs/PageBreadcrumbs";
// import Filter from "../../Filter";
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
//   { id: "docNo", label: "نمبر سند", minWidth: 120 },
//   { id: "incommingDate", label: "تاریخ وارده", minWidth: 120 },
//   { id: "outgoingDate", label: "تاریخ صادره", minWidth: 120 },
//   { id: "org", label: "اداره", minWidth: 120 },
//   { id: "submitedDate", label: "تاریخ تسلیمی", minWidth: 120 },
//   { id: "docType", label: "نوع سند", minWidth: 120 },
//   { id: "year", label: "سال", minWidth: 100 },
//   { id: "description", label: "ملاحظات", minWidth: 150 },
//   { id: "actions", label: "عملیات", minWidth: 120 },
// ];

// export default function ArchiveList() {
//   const [archives, setArchives] = useState([]);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedArchive, setSelectedArchive] = useState(null);
//   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
//   const [openViewDialog, setOpenViewDialog] = useState(false);
//   const [field, setField] = useState("docNo");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterType, setFilterType] = useState("all");

//   const open = Boolean(anchorEl);
//   const navigate = useNavigate();

//   const loadArchives = useCallback(async () => {
//     try {
//       const response = await gitAllArchives();
//       setArchives(response.data);
//     } catch (error) {
//       console.error(error);
//       toast.error("د معلوماتو لوډولو کې ستونزه");
//     }
//   }, []);

//   useEffect(() => {
//     loadArchives();
//   }, [loadArchives]);

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const handleFieldChange = (e) => {
//     setField(e.target.value);
//   };

//   const handleView = () => {
//     setOpenViewDialog(true);
//     handleClose();
//   };

//   const handleCloseView = () => {
//     setOpenViewDialog(false);
//     setSelectedArchive(null);
//   };

//   const handleClick = (event, archive) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedArchive(archive);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const handleEdit = () => {
//     navigate(`/archive/${selectedArchive.id}`);
//     handleClose();
//   };

//   const filteredArchives = archives.filter((row) => {
//     // Filter by isIncoming
//     if (filterType !== "all" && row.isIncoming !== filterType) {
//       return false;
//     }

//     // Filter by search
//     if (!searchTerm) return true;
//     const searchValue = searchTerm.toLowerCase();
//     switch (field) {
//       case "docNo":
//         return row.docNo?.toLowerCase().includes(searchValue);
//       case "org":
//         return row.org?.name?.toLowerCase().includes(searchValue);
//       case "year":
//         return row.year?.toString().includes(searchValue);
//       case "docType":
//         return row.docType?.toLowerCase().includes(searchValue);
//       default:
//         return true;
//     }
//   });

//   const handleDeleteClick = () => {
//     setOpenDeleteDialog(true);
//     handleClose();
//   };

//   const handleNewArchive = () => {
//     navigate("/archive/add");
//   };

//   const handleDelete = async () => {
//     try {
//       await deleteArchive(selectedArchive.id);
//       loadArchives();
//       toast.success("آرشیف په بریالیتوب سره حذف شو");
//     } catch (error) {
//       console.error("Failed to delete archive", error);
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
//             onClick={handleNewArchive}
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
//             آرشیف جدید
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
//                 fontWeight: "bold",
//               }}
//             >
//               آرشیف
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
//                 { value: "docNo", label: "نمبر سند" },
//                 { value: "org", label: "اداره" },
//                 { value: "year", label: "سال" },
//                 { value: "docType", label: "نوع سند" },
//               ]}
//             />
//             <FormControl sx={{ minWidth: 200, ml: 2 }}>
//               <InputLabel>ډول</InputLabel>
//               <Select
//                 value={filterType}
//                 onChange={(e) => setFilterType(e.target.value)}
//                 label="ډول"
//               >
//                 <MenuItem value="all">ټول</MenuItem>
//                 <MenuItem value={true}>وارده</MenuItem>
//                 <MenuItem value={false}>صادره</MenuItem>
//               </Select>
//             </FormControl>
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
//                 {filteredArchives
//                   .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                   .map((row) => (
//                     <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
//                       <TableCell align="center">{row.docNo || "N/A"}</TableCell>
//                       <TableCell align="center">
//                         {row.incommingDate || "N/A"}
//                       </TableCell>
//                       <TableCell align="center">
//                         {row.outgoingDate || "N/A"}
//                       </TableCell>
//                       <TableCell align="center">
//                         {row.org?.name || "N/A"}
//                       </TableCell>
//                       <TableCell align="center">
//                         {row.submitedDate || "N/A"}
//                       </TableCell>
//                       <TableCell align="center">
//                         {row.docType || "N/A"}
//                       </TableCell>
//                       <TableCell align="center">{row.year || "N/A"}</TableCell>
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
//             count={filteredArchives.length}
//             rowsPerPage={rowsPerPage}
//             page={page}
//             onPageChange={handleChangePage}
//             onRowsPerPageChange={handleChangeRowsPerPage}
//           />
//         </Paper>
//       </Box>

//       <ViewArchive
//         open={openViewDialog}
//         onClose={handleCloseView}
//         archive={selectedArchive}
//       />

//       <Dialog
//         open={openDeleteDialog}
//         onClose={() => setOpenDeleteDialog(false)}
//       >
//         <DialogTitle>د آرشیف حذف؟</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             آیا تاسو مطمئن یاست چې غواړئ دا آرشیف حذف کړئ؟
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
import React, { useEffect, useState, useCallback } from "react";
import {
  getAllArchives,
  deleteArchive,
} from "../../../services/ArchiveManagement/ArchiveAPI";
import ViewArchive from "./ViewArchive";
import PageBreadcrumbs from "../../Breadcrumbs/PageBreadcrumbs";
import Filter from "../../Filter";
import EditArchiveDialog from "./EditArchiveDialog";
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
  { id: "docNo", label: "نمبر سند", minWidth: 120 },
  { id: "incommingDate", label: "تاریخ وارده", minWidth: 120 },
  { id: "outgoingDate", label: "تاریخ صادره", minWidth: 120 },
  { id: "org", label: "اداره", minWidth: 120 },
  { id: "submitedDate", label: "تاریخ تسلیمی", minWidth: 120 },
  { id: "docType", label: "نوع سند", minWidth: 120 },
  { id: "year", label: "سال", minWidth: 100 },
  { id: "description", label: "ملاحظات", minWidth: 150 },
  { id: "actions", label: "عملیات", minWidth: 120 },
];

export default function ArchiveList() {
  const [archives, setArchives] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedArchive, setSelectedArchive] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [field, setField] = useState("docNo");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const loadArchives = useCallback(async () => {
    try {
      const response = await getAllArchives();
      setArchives(response.data);
      console.log("Archives loaded:", response.data);
    } catch (error) {
      console.error(error);
      toast.error("د معلوماتو لوډولو کې ستونزه");
    }
  }, []);

  useEffect(() => {
    loadArchives();
  }, [loadArchives]);

  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleFieldChange = (e) => setField(e.target.value);

  const handleView = () => {
    setOpenViewDialog(true);
    handleClose();
  };
  const handleCloseView = () => {
    setOpenViewDialog(false);
    setSelectedArchive(null);
  };

  const handleClick = (event, archive) => {
    setAnchorEl(event.currentTarget);
    setSelectedArchive(archive);
  };
  const handleClose = () => setAnchorEl(null);

  const handleEdit = () => {
    setOpenEditDialog(true);
    handleClose();
  };
  const handleCloseEdit = () => {
    setOpenEditDialog(false);
    setSelectedArchive(null);
  };
  const handleEditSuccess = () => loadArchives();

  const filteredArchives = archives.filter((row) => {
    if (filterType !== "all" && row.isIncoming !== filterType) return false;
    if (!searchTerm) return true;
    const searchValue = searchTerm.toLowerCase();
    switch (field) {
      case "docNo":
        return row.docNo?.toLowerCase().includes(searchValue);
      case "org":
        return row.org?.name?.toLowerCase().includes(searchValue);
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

  const handleNewArchive = () => navigate("/archive/add");

  const handleDelete = async () => {
    try {
      await deleteArchive(selectedArchive.id);
      loadArchives();
      toast.success("آرشیف په بریالیتوب سره حذف شو");
    } catch (error) {
      console.error(error);
      toast.error("د حذف کولو کې ستونزه");
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
            onClick={handleNewArchive}
            sx={{
              backgroundColor: "black",
              color: "white",
              borderRadius: "10px",
              "&:hover": { backgroundColor: "#1d252e" },
            }}
            endIcon={<AddIcon />}
          >
            آرشیف جدید
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
              آرشیف
            </Typography>
            <PageBreadcrumbs />
          </Box>
        </Box>

        <Paper
          sx={{ width: "80%", overflow: "hidden", justifyContent: "center" }}
        >
          <div style={{ marginTop: 10, padding: 10 }}>
            <Filter
              value={searchTerm}
              onChange={handleSearch}
              field={field}
              onFieldChange={handleFieldChange}
              fields={[
                { value: "docNo", label: "نمبر سند" },
                { value: "org", label: "اداره" },
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
                {filteredArchives
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      <TableCell align="center">{row.docNo || "N/A"}</TableCell>
                      <TableCell align="center">
                        {row.incommingDate || "N/A"}
                      </TableCell>
                      <TableCell align="center">
                        {row.outgoingDate || "N/A"}
                      </TableCell>
                      <TableCell align="center">
                        {row.org?.name || "N/A"}
                      </TableCell>
                      <TableCell align="center">
                        {row.submitedDate || "N/A"}
                      </TableCell>
                      <TableCell align="center">
                        {row.docType || "N/A"}
                      </TableCell>
                      <TableCell align="center">{row.year || "N/A"}</TableCell>
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
            count={filteredArchives.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>

      <ViewArchive
        open={openViewDialog}
        onClose={handleCloseView}
        archive={selectedArchive}
      />
      <EditArchiveDialog
        open={openEditDialog}
        onClose={handleCloseEdit}
        archive={selectedArchive}
        onSuccess={handleEditSuccess}
      />

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>د آرشیف حذف؟</DialogTitle>
        <DialogContent>
          <DialogContentText>
            آیا تاسو مطمئن یاست چې غواړئ دا آرشیف حذف کړئ؟
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
