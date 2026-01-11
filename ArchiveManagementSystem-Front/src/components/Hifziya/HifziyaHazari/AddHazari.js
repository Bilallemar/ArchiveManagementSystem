// import React, { useState, useEffect } from "react";
// import {
//   TextField,
//   Box,
//   Grid,
//   Button,
//   CircularProgress,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Typography,
//   Card,
//   CardContent,
//   IconButton,
//   Chip,
//   Stack,
//   Alert,
//   Badge,
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-hot-toast";

// import { createHifziyaHazari } from "../../../services/RepositoryManagement/HifziyaHazariAPI";
// import SaveIcon from "@mui/icons-material/Save";
// import AttachFileIcon from "@mui/icons-material/AttachFile";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import DeleteIcon from "@mui/icons-material/Delete";
// import FolderIcon from "@mui/icons-material/Folder";
// import ScannerIcon from "@mui/icons-material/Scanner";
// import api from "../../../services/api";

// export default function AddHazari() {
//   const [formData, setFormData] = useState({
//     type: "",
//     subType: "",
//     year: "",
//     org: "",
//     description: "",
//     isIndraj: true,
//     files: [], // Changed from fileURL to files array
//   });

//   const [types, setTypes] = useState([]);
//   const [subTypes, setSubTypes] = useState([]);
//   const [orgs, setOrgs] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [scannerFolderPath, setScannerFolderPath] = useState("");
//   const [detectedFiles, setDetectedFiles] = useState([]);
//   const [isScanning, setIsScanning] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const [typesRes, orgsRes] = await Promise.all([
//           api.get("/type"),
//           api.get("/org"),
//         ]);
//         setTypes(typesRes.data);
//         setOrgs(orgsRes.data);
//       } catch (error) {
//         console.error("Failed to load types/orgs", error);
//         toast.error("د معلوماتو لوډولو کې ستونزه");
//       }
//     };
//     loadData();
//   }, []);

//   useEffect(() => {
//     const loadSubTypes = async () => {
//       if (!formData.type) {
//         setSubTypes([]);
//         setFormData((prev) => ({ ...prev, subType: "" }));
//         return;
//       }

//       try {
//         const response = await api.get(`/sub-type/by-type/${formData.type}`);
//         setSubTypes(response.data);
//       } catch (error) {
//         console.error("Failed to load subtypes", error);
//         toast.error("د فرعي ډولونو لوډولو کې ستونزه");
//         setSubTypes([]);
//       }
//     };
//     loadSubTypes();
//   }, [formData.type]);
//   useEffect(() => {
//     const loadScannerPath = async () => {
//       try {
//         const response = await api.get("/scanner-folder/path");
//         setScannerFolderPath(response.data.path);
//       } catch (error) {
//         console.error("Failed to load scanner folder path", error);
//       }
//     };
//     loadScannerPath();
//   }, []);
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };
//   const handleScan = async () => {
//     try {
//       setIsScanning(true);
//       const response = await api.get("/scanner-folder/files");
//       setDetectedFiles(response.data);

//       if (response.data.length === 0) {
//         toast.info("په سکینر پوښۍ کې فایلونه نشته");
//       } else {
//         toast.success(`${response.data.length} فایل(ونه) وموندل شول`);
//       }
//     } catch (error) {
//       console.error("Failed to scan folder", error);
//       toast.error("سکین کولو کې ستونزه");
//     } finally {
//       setIsScanning(false);
//     }
//   };

//   // Load files from scanner folder to form
//   const handleLoadFromScanner = async () => {
//     if (detectedFiles.length === 0) {
//       toast.error("په سکینر پوښۍ کې فایلونه نشته");
//       return;
//     }

//     try {
//       // Download files from scanner folder and add to form
//       const filePromises = detectedFiles.map(async (fileInfo) => {
//         const response = await api.get(
//           `/scanner-folder/files/${fileInfo.name}/download`,
//           { responseType: "blob" }
//         );

//         // Create a File object from the blob
//         const file = new File([response.data], fileInfo.name, {
//           type: response.headers["content-type"],
//         });

//         return file;
//       });

//       const files = await Promise.all(filePromises);

//       setFormData((prev) => ({
//         ...prev,
//         files: files,
//       }));

//       toast.success(`${files.length} فایلونه د سکینر نه لوډ شول`);
//     } catch (error) {
//       console.error("Failed to load files from scanner", error);
//       toast.error("د فایلونو لوډولو کې ستونزه");
//     }
//   };

//   // Manual file selection (alternative method)
//   const handleFileChange = (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     setFormData((prev) => ({
//       ...prev,
//       files: [...prev.files, ...selectedFiles],
//     }));
//   };

//   // ✅ NEW: Remove individual file
//   const handleRemoveFile = (index) => {
//     setFormData((prev) => ({
//       ...prev,
//       files: prev.files.filter((_, i) => i !== index),
//     }));
//   };
//   const handleRemoveAllFiles = () => {
//     setFormData((prev) => ({
//       ...prev,
//       files: [],
//     }));
//   };
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     const requiredFields = ["type", "subType", "year", "org"];
//     const missingFields = requiredFields.filter((field) => !formData[field]);
//     if (missingFields.length > 0) {
//       toast.error("لطفاً تمام فیلدهای ضروری را پر کنید");
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       const formDataToSend = new FormData();
//       const yearAsInteger = new Date(formData.year).getFullYear();

//       const hazariData = {
//         type: { id: formData.type },
//         subType: { id: formData.subType },
//         year: yearAsInteger,
//         org: { id: formData.org },
//         description: formData.description,
//         isIndraj: formData.isIndraj,
//       };

//       formDataToSend.append("hifziyaHazari", JSON.stringify(hazariData));

//       // ✅ Append multiple files
//       if (formData.files.length > 0) {
//         formData.files.forEach((file) => {
//           formDataToSend.append("fileURL", file);
//         });
//       }

//       await createHifziyaHazari(formDataToSend);
//       toast.success("ریکارډ په بریالیتوب سره ثبت شو");
//       navigate("/hifziya-hazari");
//     } catch (error) {
//       console.error("Failed to create report", error);
//       toast.error(
//         "ثبت ناکام شو: " + (error.response?.data?.message || error.message)
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <Box sx={{ p: 3 }}>
//       {/* Header */}
//       <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
//         <Button
//           startIcon={<ArrowBackIcon />}
//           onClick={() => navigate("/hifziya-hazari")}
//           sx={{ color: "text.secondary" }}
//         >
//           بیرته
//         </Button>
//         <Typography
//           variant="h4"
//           sx={{ fontFamily: "B Nazanin", fontWeight: "bold" }}
//         >
//           د نوي حاضری اضافه کول
//         </Typography>
//       </Box>
//       <Alert
//         severity="info"
//         sx={{ mb: 3, maxWidth: 1200, mx: "auto" }}
//         icon={<ScannerIcon />}
//       >
//         <Typography variant="body2" fontWeight="bold">
//           د سکینر پوښۍ: {scannerFolderPath}
//         </Typography>
//       </Alert>
//       {/* Form Card */}
//       <Card sx={{ maxWidth: 1200, mx: "auto" }}>
//         <CardContent sx={{ p: 4 }}>
//           <Box component="form" onSubmit={handleSubmit}>
//             <Grid container spacing={3}>
//               {/* LEFT SIDE - File Upload Section */}
//               <Grid item xs={12} md={4}>
//                 <Box
//                   sx={{
//                     display: "flex",
//                     flexDirection: "column",
//                     gap: 2,
//                   }}
//                 >
//                   {/* Scanner Status Card */}
//                   <Card
//                     variant="outlined"
//                     sx={{
//                       bgcolor:
//                         detectedFiles.length > 0
//                           ? "success.lighter"
//                           : "background.neutral",
//                       borderColor:
//                         detectedFiles.length > 0 ? "success.main" : "divider",
//                       borderWidth: 2,
//                     }}
//                   >
//                     <CardContent sx={{ textAlign: "center", py: 3 }}>
//                       <Badge
//                         badgeContent={detectedFiles.length}
//                         color="success"
//                         sx={{ mb: 2 }}
//                       >
//                         <FolderIcon
//                           sx={{ fontSize: 50, color: "primary.main" }}
//                         />
//                       </Badge>

//                       <Typography variant="h6" gutterBottom>
//                         د سکینر پوښۍ
//                       </Typography>

//                       <Typography
//                         variant="body2"
//                         color="text.secondary"
//                         sx={{ mb: 2 }}
//                       >
//                         {detectedFiles.length > 0
//                           ? `${detectedFiles.length} فایل(ونه) موجود دي`
//                           : "سکین تڼۍ کلیک کړئ"}
//                       </Typography>

//                       {/* Scan Button */}
//                       <Button
//                         variant="outlined"
//                         fullWidth
//                         startIcon={<ScannerIcon />}
//                         onClick={handleScan}
//                         disabled={isScanning}
//                         sx={{
//                           mb: 1,
//                           borderColor: "primary.main",
//                           color: "primary.main",
//                           "&:hover": {
//                             borderColor: "primary.dark",
//                             bgcolor: "primary.lighter",
//                           },
//                         }}
//                       >
//                         {isScanning ? (
//                           <>
//                             <CircularProgress size={16} sx={{ mr: 1 }} />
//                             سکین کیږي...
//                           </>
//                         ) : (
//                           "سکین"
//                         )}
//                       </Button>

//                       {/* Load Files Button */}
//                       <Button
//                         variant="contained"
//                         fullWidth
//                         startIcon={<AttachFileIcon />}
//                         onClick={handleLoadFromScanner}
//                         disabled={detectedFiles.length === 0}
//                         sx={{
//                           bgcolor: "success.main",
//                           "&:hover": { bgcolor: "success.dark" },
//                         }}
//                       >
//                         فایلونه لوډ کړئ
//                       </Button>
//                     </CardContent>
//                   </Card>

//                   {/* Detected Files List */}
//                   {detectedFiles.length > 0 && (
//                     <Box>
//                       <Typography
//                         variant="subtitle2"
//                         fontWeight="bold"
//                         sx={{ mb: 1 }}
//                       >
//                         د سکینر فایلونه:
//                       </Typography>
//                       <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
//                         <Stack spacing={0.5}>
//                           {detectedFiles.map((file, index) => (
//                             <Chip
//                               key={index}
//                               label={file.name}
//                               size="small"
//                               icon={<AttachFileIcon />}
//                               sx={{
//                                 justifyContent: "flex-start",
//                                 "& .MuiChip-label": {
//                                   overflow: "hidden",
//                                   textOverflow: "ellipsis",
//                                   whiteSpace: "nowrap",
//                                 },
//                               }}
//                             />
//                           ))}
//                         </Stack>
//                       </Box>
//                     </Box>
//                   )}

//                   {/* Manual File Upload (Alternative) */}
//                   <Box sx={{ mt: 2 }}>
//                     <Button
//                       variant="outlined"
//                       component="label"
//                       fullWidth
//                       size="small"
//                       startIcon={<AttachFileIcon />}
//                     >
//                       یا دستي فایل اضافه کړئ
//                       <input
//                         type="file"
//                         hidden
//                         multiple
//                         onChange={handleFileChange}
//                         accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
//                       />
//                     </Button>
//                   </Box>

//                   {/* Selected Files for Upload */}
//                   {formData.files.length > 0 && (
//                     <Box sx={{ mt: 2 }}>
//                       <Box
//                         sx={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           alignItems: "center",
//                           mb: 1,
//                         }}
//                       >
//                         <Typography variant="subtitle2" fontWeight="bold">
//                           د اپلوډ لپاره چمتو ({formData.files.length})
//                         </Typography>
//                         <IconButton
//                           size="small"
//                           color="error"
//                           onClick={handleRemoveAllFiles}
//                         >
//                           <DeleteIcon fontSize="small" />
//                         </IconButton>
//                       </Box>

//                       <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
//                         <Stack spacing={0.5}>
//                           {formData.files.map((file, index) => (
//                             <Chip
//                               key={index}
//                               label={file.name}
//                               onDelete={() => handleRemoveFile(index)}
//                               deleteIcon={<DeleteIcon />}
//                               size="small"
//                               color="primary"
//                               sx={{
//                                 justifyContent: "space-between",
//                                 "& .MuiChip-label": {
//                                   overflow: "hidden",
//                                   textOverflow: "ellipsis",
//                                   whiteSpace: "nowrap",
//                                   maxWidth: 150,
//                                 },
//                               }}
//                             />
//                           ))}
//                         </Stack>
//                       </Box>
//                     </Box>
//                   )}
//                 </Box>
//               </Grid>

//               {/* RIGHT SIDE - Form Fields */}
//               <Grid item xs={12} md={8}>
//                 <Grid container spacing={3}>
//                   {/* Record Type */}
//                   <Grid item xs={12} md={6}>
//                     <FormControl fullWidth size="small">
//                       <InputLabel>د ریکارډ ډول</InputLabel>
//                       <Select
//                         name="isIndraj"
//                         value={formData.isIndraj}
//                         onChange={handleInputChange}
//                         label="د ریکارډ ډول"
//                       >
//                         <MenuItem value={true}>اندراج</MenuItem>
//                         <MenuItem value={false}>حاضری</MenuItem>
//                       </Select>
//                     </FormControl>
//                   </Grid>

//                   {/* Type */}
//                   <Grid item xs={12} md={6}>
//                     <FormControl
//                       fullWidth
//                       size="small"
//                       required
//                       error={!formData.type}
//                     >
//                       <InputLabel>نوعیت</InputLabel>
//                       <Select
//                         name="type"
//                         value={formData.type}
//                         onChange={handleInputChange}
//                         label="نوعیت"
//                       >
//                         {types.length === 0 ? (
//                           <MenuItem disabled>Loading...</MenuItem>
//                         ) : (
//                           types.map((type) => (
//                             <MenuItem key={type.id} value={type.id}>
//                               {type.name}
//                             </MenuItem>
//                           ))
//                         )}
//                       </Select>
//                     </FormControl>
//                   </Grid>

//                   {/* SubType */}
//                   <Grid item xs={12} md={6}>
//                     <FormControl
//                       fullWidth
//                       size="small"
//                       required
//                       error={!formData.subType}
//                       disabled={!formData.type}
//                     >
//                       <InputLabel>زیر نوعیت</InputLabel>
//                       <Select
//                         name="subType"
//                         value={formData.subType}
//                         onChange={handleInputChange}
//                         label="زیر نوعیت"
//                       >
//                         {!formData.type ? (
//                           <MenuItem disabled>
//                             ابتدا نوعیت را انتخاب کنید
//                           </MenuItem>
//                         ) : subTypes.length === 0 ? (
//                           <MenuItem disabled>Loading...</MenuItem>
//                         ) : (
//                           subTypes.map((subType) => (
//                             <MenuItem key={subType.id} value={subType.id}>
//                               {subType.name}
//                             </MenuItem>
//                           ))
//                         )}
//                       </Select>
//                     </FormControl>
//                   </Grid>

//                   {/* Year */}
//                   <Grid item xs={12} md={6}>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       name="year"
//                       type="date"
//                       InputLabelProps={{ shrink: true }}
//                       label="سال"
//                       value={formData.year}
//                       onChange={handleInputChange}
//                       required
//                       error={!formData.year}
//                     />
//                   </Grid>

//                   {/* Org */}
//                   <Grid item xs={12} md={6}>
//                     <FormControl
//                       fullWidth
//                       size="small"
//                       required
//                       error={!formData.org}
//                     >
//                       <InputLabel>اداره</InputLabel>
//                       <Select
//                         name="org"
//                         value={formData.org}
//                         onChange={handleInputChange}
//                         label="اداره"
//                       >
//                         {orgs.length === 0 ? (
//                           <MenuItem disabled>Loading...</MenuItem>
//                         ) : (
//                           orgs.map((org) => (
//                             <MenuItem key={org.id} value={org.id}>
//                               {org.name}
//                             </MenuItem>
//                           ))
//                         )}
//                       </Select>
//                     </FormControl>
//                   </Grid>

//                   {/* Description */}
//                   <Grid item xs={12}>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       name="description"
//                       label="ملاحظات"
//                       multiline
//                       rows={4}
//                       value={formData.description}
//                       onChange={handleInputChange}
//                     />
//                   </Grid>

//                   {/* Action Buttons */}
//                   <Grid item xs={12}>
//                     <Box
//                       sx={{
//                         display: "flex",
//                         gap: 2,
//                         justifyContent: "flex-end",
//                         mt: 2,
//                       }}
//                     >
//                       <Button
//                         variant="outlined"
//                         onClick={() => navigate("/hifziya-hazari")}
//                         disabled={isSubmitting}
//                       >
//                         لغوه
//                       </Button>
//                       <Button
//                         type="submit"
//                         variant="contained"
//                         endIcon={
//                           isSubmitting ? (
//                             <CircularProgress size={20} />
//                           ) : (
//                             <SaveIcon />
//                           )
//                         }
//                         disabled={isSubmitting}
//                         sx={{
//                           bgcolor: "black",
//                           "&:hover": { bgcolor: "#1d252e" },
//                         }}
//                       >
//                         {isSubmitting ? "ذخیره کیږي..." : "ذخیره کړئ"}
//                       </Button>
//                     </Box>
//                   </Grid>
//                 </Grid>
//               </Grid>
//             </Grid>
//           </Box>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// }

import React, { useState, useEffect } from "react";
import {
  TextField,
  Box,
  Grid,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Card,
  CardContent,
  IconButton,
  Chip,
  Stack,
  Alert,
  Badge,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

import { createHifziyaHazari } from "../../../services/RepositoryManagement/HifziyaHazariAPI";
import SaveIcon from "@mui/icons-material/Save";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderIcon from "@mui/icons-material/Folder";
import ScannerIcon from "@mui/icons-material/Scanner";
import api from "../../../services/api";
import { addHazariTexts } from "./AddHazariTexts";

export default function AddHazari() {
  const navigate = useNavigate();
  const { t } = useTranslation("AddHazari");
  const texts = addHazariTexts(t);

  const [formData, setFormData] = useState({
    type: "",
    subType: "",
    year: "",
    org: "",
    description: "",
    isIndraj: true,
    files: [],
  });

  const [types, setTypes] = useState([]);
  const [subTypes, setSubTypes] = useState([]);
  const [orgs, setOrgs] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scannerFolderPath, setScannerFolderPath] = useState("");
  const [detectedFiles, setDetectedFiles] = useState([]);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [typesRes, orgsRes] = await Promise.all([
          api.get("/type"),
          api.get("/org"),
        ]);
        setTypes(typesRes.data);
        setOrgs(orgsRes.data);
      } catch {
        toast.error(texts.loadTypesOrgsError);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadSubTypes = async () => {
      if (!formData.type) {
        setSubTypes([]);
        setFormData((p) => ({ ...p, subType: "" }));
        return;
      }
      try {
        const res = await api.get(`/sub-type/by-type/${formData.type}`);
        setSubTypes(res.data);
      } catch {
        toast.error(texts.loadSubTypesError);
        setSubTypes([]);
      }
    };
    loadSubTypes();
  }, [formData.type]);

  useEffect(() => {
    const loadScannerPath = async () => {
      try {
        const res = await api.get("/scanner-folder/path");
        setScannerFolderPath(res.data.path);
      } catch {}
    };
    loadScannerPath();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleScan = async () => {
    try {
      setIsScanning(true);
      const res = await api.get("/scanner-folder/files");
      setDetectedFiles(res.data);
      res.data.length === 0
        ? toast.info(texts.noFilesFound)
        : toast.success(texts.filesFound(res.data.length));
    } catch {
      toast.error(texts.scanError);
    } finally {
      setIsScanning(false);
    }
  };

  const handleLoadFromScanner = async () => {
    if (detectedFiles.length === 0) {
      toast.error(texts.noFilesFound);
      return;
    }
    try {
      const files = await Promise.all(
        detectedFiles.map(async (f) => {
          const res = await api.get(
            `/scanner-folder/files/${f.name}/download`,
            { responseType: "blob" }
          );
          return new File([res.data], f.name, {
            type: res.headers["content-type"],
          });
        })
      );
      setFormData((p) => ({ ...p, files }));
      toast.success(texts.filesFound(files.length));
    } catch {
      toast.error(texts.loadFilesError);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFormData((p) => ({ ...p, files: [...p.files, ...selectedFiles] }));
  };

  const handleRemoveFile = (index) => {
    setFormData((p) => ({
      ...p,
      files: p.files.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveAllFiles = () => {
    setFormData((p) => ({ ...p, files: [] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const required = ["type", "subType", "year", "org"];
    if (required.some((f) => !formData[f])) {
      toast.error(texts.requiredFieldsError);
      setIsSubmitting(false);
      return;
    }

    try {
      const fd = new FormData();
      fd.append(
        "hifziyaHazari",
        JSON.stringify({
          type: { id: formData.type },
          subType: { id: formData.subType },
          year: new Date(formData.year).getFullYear(),
          org: { id: formData.org },
          description: formData.description,
          isIndraj: formData.isIndraj,
        })
      );
      formData.files.forEach((f) => fd.append("fileURL", f));

      await createHifziyaHazari(fd);
      toast.success(texts.save);
      navigate("/hifziya-hazari");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/hifziya-hazari")}
        >
          {texts.back}
        </Button>
        <Typography variant="h4" fontWeight="bold">
          {texts.addNewHazari}
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }} icon={<ScannerIcon />}>
        <Typography fontWeight="bold">
          {texts.scannerFolder}: {scannerFolderPath}
        </Typography>
      </Alert>

      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* LEFT */}
              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: "center" }}>
                    <Badge badgeContent={detectedFiles.length} color="success">
                      <FolderIcon sx={{ fontSize: 50 }} />
                    </Badge>

                    <Typography variant="h6">{texts.scannerFolder}</Typography>
                    <Typography variant="body2">
                      {detectedFiles.length
                        ? texts.filesFound(detectedFiles.length)
                        : texts.noFiles}
                    </Typography>

                    <Button
                      fullWidth
                      onClick={handleScan}
                      disabled={isScanning}
                    >
                      {isScanning ? texts.scanning : texts.scan}
                    </Button>

                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleLoadFromScanner}
                      disabled={!detectedFiles.length}
                    >
                      {texts.loadFiles}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>

              {/* RIGHT */}
              <Grid item xs={12} md={8}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>{texts.recordType}</InputLabel>
                      <Select
                        name="isIndraj"
                        value={formData.isIndraj}
                        label={texts.recordType}
                        onChange={handleInputChange}
                      >
                        <MenuItem value>{texts.indraj}</MenuItem>
                        <MenuItem value={false}>{texts.hazari}</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label={texts.year}
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label={texts.description}
                      name="description"
                      multiline
                      rows={3}
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                  </Grid>

                  <Grid item xs={12} sx={{ textAlign: "right" }}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate("/hifziya-hazari")}
                    >
                      {texts.cancel}
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{ ml: 2 }}
                      disabled={isSubmitting}
                      endIcon={
                        isSubmitting ? (
                          <CircularProgress size={18} />
                        ) : (
                          <SaveIcon />
                        )
                      }
                    >
                      {isSubmitting ? texts.saving : texts.save}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

// import React, { useState, useEffect } from "react";
// import {
//   TextField,
//   Box,
//   Grid,
//   Button,
//   CircularProgress,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Typography,
//   Card,
//   CardContent,
//   IconButton,
//   Chip,
//   Stack,
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import { createHifziyaHazari } from "../../../services/RepositoryManagement/HifziyaHazariAPI";
// import SaveIcon from "@mui/icons-material/Save";
// import AttachFileIcon from "@mui/icons-material/AttachFile";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import DeleteIcon from "@mui/icons-material/Delete";
// import api from "../../../services/api";

// export default function AddHazari() {
//   const [formData, setFormData] = useState({
//     type: "",
//     subType: "",
//     year: "",
//     org: "",
//     description: "",
//     isIndraj: true,
//     files: [], // Changed from fileURL to files array
//   });

//   const [types, setTypes] = useState([]);
//   const [subTypes, setSubTypes] = useState([]);
//   const [orgs, setOrgs] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const [typesRes, orgsRes] = await Promise.all([
//           api.get("/type"),
//           api.get("/org"),
//         ]);
//         setTypes(typesRes.data);
//         setOrgs(orgsRes.data);
//       } catch (error) {
//         console.error("Failed to load types/orgs", error);
//         toast.error("د معلوماتو لوډولو کې ستونزه");
//       }
//     };
//     loadData();
//   }, []);

//   useEffect(() => {
//     const loadSubTypes = async () => {
//       if (!formData.type) {
//         setSubTypes([]);
//         setFormData((prev) => ({ ...prev, subType: "" }));
//         return;
//       }

//       try {
//         const response = await api.get(`/sub-type/by-type/${formData.type}`);
//         setSubTypes(response.data);
//       } catch (error) {
//         console.error("Failed to load subtypes", error);
//         toast.error("د فرعي ډولونو لوډولو کې ستونزه");
//         setSubTypes([]);
//       }
//     };
//     loadSubTypes();
//   }, [formData.type]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // ✅ NEW: Handle multiple file selection
//   const handleFileChange = (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     setFormData((prev) => ({
//       ...prev,
//       files: [...prev.files, ...selectedFiles],
//     }));
//   };

//   // ✅ NEW: Remove individual file
//   const handleRemoveFile = (index) => {
//     setFormData((prev) => ({
//       ...prev,
//       files: prev.files.filter((_, i) => i !== index),
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     const requiredFields = ["type", "subType", "year", "org"];
//     const missingFields = requiredFields.filter((field) => !formData[field]);
//     if (missingFields.length > 0) {
//       toast.error("لطفاً تمام فیلدهای ضروری را پر کنید");
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       const formDataToSend = new FormData();
//       const yearAsInteger = new Date(formData.year).getFullYear();

//       const hazariData = {
//         type: { id: formData.type },
//         subType: { id: formData.subType },
//         year: yearAsInteger,
//         org: { id: formData.org },
//         description: formData.description,
//         isIndraj: formData.isIndraj,
//       };

//       formDataToSend.append("hifziyaHazari", JSON.stringify(hazariData));

//       // ✅ Append multiple files
//       if (formData.files.length > 0) {
//         formData.files.forEach((file) => {
//           formDataToSend.append("fileURL", file);
//         });
//       }

//       await createHifziyaHazari(formDataToSend);
//       toast.success("ریکارډ په بریالیتوب سره ثبت شو");
//       navigate("/hifziya-hazari");
//     } catch (error) {
//       console.error("Failed to create report", error);
//       toast.error(
//         "ثبت ناکام شو: " + (error.response?.data?.message || error.message)
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <Box sx={{ p: 3 }}>
//       {/* Header */}
//       <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
//         <Button
//           startIcon={<ArrowBackIcon />}
//           onClick={() => navigate("/hifziya-hazari")}
//           sx={{ color: "text.secondary" }}
//         >
//           بیرته
//         </Button>
//         <Typography
//           variant="h4"
//           sx={{ fontFamily: "B Nazanin", fontWeight: "bold" }}
//         >
//           د نوي حاضری اضافه کول
//         </Typography>
//       </Box>

//       {/* Form Card */}
//       <Card sx={{ maxWidth: 1200, mx: "auto" }}>
//         <CardContent sx={{ p: 4 }}>
//           <Box component="form" onSubmit={handleSubmit}>
//             <Grid container spacing={3}>
//               {/* LEFT SIDE - File Upload Section */}
//               <Grid item xs={12} md={4}>
//                 <Box
//                   sx={{
//                     display: "flex",
//                     flexDirection: "column",
//                     alignItems: "center",
//                     gap: 2,
//                   }}
//                 >
//                   {/* File Upload Area */}
//                   <Box
//                     sx={{
//                       width: 200,
//                       height: 200,
//                       borderRadius: "50%",
//                       border: "1px dashed",
//                       borderColor: "divider",
//                       display: "flex",
//                       flexDirection: "column",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       bgcolor: "background.neutral",
//                       cursor: "pointer",
//                       position: "relative",
//                       "&:hover": {
//                         bgcolor: "action.hover",
//                       },
//                     }}
//                     component="label"
//                   >
//                     <AttachFileIcon
//                       sx={{ fontSize: 40, color: "text.secondary" }}
//                     />
//                     <Box sx={{ mt: 1, color: "text.secondary", fontSize: 14 }}>
//                       فایلونه پورته کړئ
//                     </Box>
//                     <Box
//                       sx={{
//                         mt: 0.5,
//                         color: "primary.main",
//                         fontSize: 12,
//                         fontWeight: "bold",
//                       }}
//                     >
//                       {formData.files.length} فایل غوره شوي
//                     </Box>
//                     <input
//                       type="file"
//                       hidden
//                       multiple
//                       onChange={handleFileChange}
//                       accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
//                     />
//                   </Box>

//                   {/* Selected Files List */}
//                   {formData.files.length > 0 && (
//                     <Box
//                       sx={{ width: "100%", maxHeight: 250, overflowY: "auto" }}
//                     >
//                       <Stack spacing={1}>
//                         {formData.files.map((file, index) => (
//                           <Chip
//                             key={index}
//                             label={file.name}
//                             onDelete={() => handleRemoveFile(index)}
//                             deleteIcon={<DeleteIcon />}
//                             size="small"
//                             sx={{
//                               justifyContent: "space-between",
//                               "& .MuiChip-label": {
//                                 overflow: "hidden",
//                                 textOverflow: "ellipsis",
//                                 whiteSpace: "nowrap",
//                                 maxWidth: 150,
//                               },
//                             }}
//                           />
//                         ))}
//                       </Stack>
//                     </Box>
//                   )}

//                   <Typography variant="caption" color="text.secondary">
//                     Allowed *.jpeg, *.jpg, *.png, *.pdf
//                     <br />
//                     max size of 5 MB each
//                   </Typography>
//                 </Box>
//               </Grid>

//               {/* RIGHT SIDE - Form Fields */}
//               <Grid item xs={12} md={8}>
//                 <Grid container spacing={3}>
//                   {/* Record Type */}
//                   <Grid item xs={12} md={6}>
//                     <FormControl fullWidth size="small">
//                       <InputLabel>د ریکارډ ډول</InputLabel>
//                       <Select
//                         name="isIndraj"
//                         value={formData.isIndraj}
//                         onChange={handleInputChange}
//                         label="د ریکارډ ډول"
//                       >
//                         <MenuItem value={true}>اندراج</MenuItem>
//                         <MenuItem value={false}>حاضری</MenuItem>
//                       </Select>
//                     </FormControl>
//                   </Grid>

//                   {/* Type */}
//                   <Grid item xs={12} md={6}>
//                     <FormControl
//                       fullWidth
//                       size="small"
//                       required
//                       error={!formData.type}
//                     >
//                       <InputLabel>نوعیت</InputLabel>
//                       <Select
//                         name="type"
//                         value={formData.type}
//                         onChange={handleInputChange}
//                         label="نوعیت"
//                       >
//                         {types.length === 0 ? (
//                           <MenuItem disabled>Loading...</MenuItem>
//                         ) : (
//                           types.map((type) => (
//                             <MenuItem key={type.id} value={type.id}>
//                               {type.name}
//                             </MenuItem>
//                           ))
//                         )}
//                       </Select>
//                     </FormControl>
//                   </Grid>

//                   {/* SubType */}
//                   <Grid item xs={12} md={6}>
//                     <FormControl
//                       fullWidth
//                       size="small"
//                       required
//                       error={!formData.subType}
//                       disabled={!formData.type}
//                     >
//                       <InputLabel>زیر نوعیت</InputLabel>
//                       <Select
//                         name="subType"
//                         value={formData.subType}
//                         onChange={handleInputChange}
//                         label="زیر نوعیت"
//                       >
//                         {!formData.type ? (
//                           <MenuItem disabled>
//                             ابتدا نوعیت را انتخاب کنید
//                           </MenuItem>
//                         ) : subTypes.length === 0 ? (
//                           <MenuItem disabled>Loading...</MenuItem>
//                         ) : (
//                           subTypes.map((subType) => (
//                             <MenuItem key={subType.id} value={subType.id}>
//                               {subType.name}
//                             </MenuItem>
//                           ))
//                         )}
//                       </Select>
//                     </FormControl>
//                   </Grid>

//                   {/* Year */}
//                   <Grid item xs={12} md={6}>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       name="year"
//                       type="date"
//                       InputLabelProps={{ shrink: true }}
//                       label="سال"
//                       value={formData.year}
//                       onChange={handleInputChange}
//                       required
//                       error={!formData.year}
//                     />
//                   </Grid>

//                   {/* Org */}
//                   <Grid item xs={12} md={6}>
//                     <FormControl
//                       fullWidth
//                       size="small"
//                       required
//                       error={!formData.org}
//                     >
//                       <InputLabel>اداره</InputLabel>
//                       <Select
//                         name="org"
//                         value={formData.org}
//                         onChange={handleInputChange}
//                         label="اداره"
//                       >
//                         {orgs.length === 0 ? (
//                           <MenuItem disabled>Loading...</MenuItem>
//                         ) : (
//                           orgs.map((org) => (
//                             <MenuItem key={org.id} value={org.id}>
//                               {org.name}
//                             </MenuItem>
//                           ))
//                         )}
//                       </Select>
//                     </FormControl>
//                   </Grid>

//                   {/* Description */}
//                   <Grid item xs={12}>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       name="description"
//                       label="ملاحظات"
//                       multiline
//                       rows={4}
//                       value={formData.description}
//                       onChange={handleInputChange}
//                     />
//                   </Grid>

//                   {/* Action Buttons */}
//                   <Grid item xs={12}>
//                     <Box
//                       sx={{
//                         display: "flex",
//                         gap: 2,
//                         justifyContent: "flex-end",
//                         mt: 2,
//                       }}
//                     >
//                       <Button
//                         variant="outlined"
//                         onClick={() => navigate("/hifziya-hazari")}
//                         disabled={isSubmitting}
//                       >
//                         لغوه
//                       </Button>
//                       <Button
//                         type="submit"
//                         variant="contained"
//                         endIcon={
//                           isSubmitting ? (
//                             <CircularProgress size={20} />
//                           ) : (
//                             <SaveIcon />
//                           )
//                         }
//                         disabled={isSubmitting}
//                         sx={{
//                           bgcolor: "black",
//                           "&:hover": { bgcolor: "#1d252e" },
//                         }}
//                       >
//                         {isSubmitting ? "ذخیره کیږي..." : "ذخیره کړئ"}
//                       </Button>
//                     </Box>
//                   </Grid>
//                 </Grid>
//               </Grid>
//             </Grid>
//           </Box>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// }
