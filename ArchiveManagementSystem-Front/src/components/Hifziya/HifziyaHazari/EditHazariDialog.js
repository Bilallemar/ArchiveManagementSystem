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
// } from "@mui/material";
// import SaveIcon from "@mui/icons-material/Save";
// import AttachFileIcon from "@mui/icons-material/AttachFile";
// import { useNavigate, useParams } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import {
//   getHifziyaHazariById,
//   updateHifziyaHazari,
// } from "../../../services/RepositoryManagement/HifziyaHazariAPI";
// import React, { useState, useEffect } from "react";
// import PageBreadcrumbs from "../../Breadcrumbs/PageBreadcrumbs";
// import api from "../../../services/api";

// export default function UpdateHazari() {
//   const { id } = useParams();
//   const [formData, setFormData] = useState({
//     type: "",
//     subType: "",
//     year: "",
//     org: "",
//     description: "",
//     isIndraj: true,
//     fileURL: null,
//   });

//   const [types, setTypes] = useState([]);
//   const [subTypes, setSubTypes] = useState([]);
//   const [orgs, setOrgs] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [existingFiles, setExistingFiles] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Load types, orgs, and hazari data in parallel
//         const [typesRes, orgsRes, hazariRes] = await Promise.all([
//           api.get("/type"),
//           api.get("/org"),
//           getHifziyaHazariById(id),
//         ]);

//         setTypes(typesRes.data);
//         setOrgs(orgsRes.data);

//         const reportData = hazariRes.data;

//         // Format the date for the input field
//         const formattedDate = reportData.year
//           ? new Date(reportData.year).toISOString().split("T")[0]
//           : "";

//         setFormData({
//           type: reportData.type?.id || "",
//           subType: reportData.subType?.id || "",
//           year: formattedDate,
//           org: reportData.org?.id || "",
//           description: reportData.description || "",
//           isIndraj:
//             reportData.isIndraj !== undefined ? reportData.isIndraj : true,
//           fileURL: null,
//         });

//         // Load subtypes if type exists
//         if (reportData.type?.id) {
//           const subTypesRes = await api.get(
//             `/sub-type/by-type/${reportData.type.id}`
//           );
//           setSubTypes(subTypesRes.data);
//         }

//         // Store existing files info
//         if (reportData.files && reportData.files.length > 0) {
//           setExistingFiles(reportData.files);
//         }

//         setIsLoading(false);
//       } catch (error) {
//         console.error("Failed to fetch data", error);
//         toast.error("Failed to load data");
//         navigate("/hifziya-hazari");
//       }
//     };

//     fetchData();
//   }, [id, navigate]);

//   // Load SubTypes when Type changes
//   useEffect(() => {
//     const loadSubTypes = async () => {
//       if (!formData.type) {
//         setSubTypes([]);
//         setFormData((prev) => ({ ...prev, subType: "" }));
//         return;
//       }

//       try {
//         console.log("Loading subtypes for type:", formData.type);
//         const response = await api.get(`/sub-type/by-type/${formData.type}`);
//         console.log("SubTypes:", response.data);
//         setSubTypes(response.data);
//       } catch (error) {
//         console.error("Failed to load subtypes", error);
//         toast.error("Failed to load subtypes");
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

//   const handleFileChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       fileURL: e.target.files[0],
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

//       // Convert year to integer
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

//       // Append file if a new one was selected
//       if (formData.fileURL) {
//         formDataToSend.append("fileURL", formData.fileURL);
//       }

//       await updateHifziyaHazari(id, formDataToSend);
//       toast.success("حاضری راپور په بریالیتوب سره تازه شو");
//       navigate("/hifziya-hazari");
//     } catch (error) {
//       console.error("Failed to update report", error);
//       toast.error(
//         "تازه کول ناکام شو: " + (error.response?.data?.message || error.message)
//       );
//     }
//     setIsSubmitting(false);
//   };

//   if (isLoading) {
//     return (
//       <Box
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//         minHeight="100vh"
//       >
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth="md"
//       fullWidth
//       PaperProps={{
//         sx: {
//           borderRadius: 2,
//           maxHeight: "90vh",
//         },
//       }}
//     >
//       {/* ===== Dialog Title ===== */}
//       <DialogTitle
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           pb: 2,
//           borderBottom: "1px solid #e0e0e0",
//         }}
//       >
//         <Box sx={{ fontFamily: "B Nazanin", fontWeight: "bold", fontSize: 20 }}>
//           ویرایش کتاب حاضری
//         </Box>

//         <IconButton onClick={onClose} size="small">
//           <CloseIcon />
//         </IconButton>
//       </DialogTitle>

//       {/* ===== Dialog Content ===== */}
//       <DialogContent sx={{ pt: 3 }}>
//         {hazari && (
//           <Alert severity="info" sx={{ mb: 2 }}>
//             د ریکارډ شمېره: {hazari.id}
//           </Alert>
//         )}

//         <Box component="form" onSubmit={handleSubmit} noValidate>
//           <Grid container spacing={2}>
//             {/* Record Type */}
//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth>
//                 <InputLabel>د ریکارډ ډول</InputLabel>
//                 <Select
//                   name="isIndraj"
//                   value={formData.isIndraj}
//                   onChange={handleInputChange}
//                   label="د ریکارډ ډول"
//                   sx={{ height: 60 }}
//                 >
//                   <MenuItem value={true}>اندراج</MenuItem>
//                   <MenuItem value={false}>حاضری</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>

//             {/* Type */}
//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth required error={!formData.type}>
//                 <InputLabel>نوعیت</InputLabel>
//                 <Select
//                   name="type"
//                   value={formData.type}
//                   onChange={handleInputChange}
//                   label="نوعیت"
//                   sx={{ height: 60 }}
//                 >
//                   {types.map((type) => (
//                     <MenuItem key={type.id} value={type.id}>
//                       {type.name}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Grid>

//             {/* SubType */}
//             <Grid item xs={12} sm={6}>
//               <FormControl
//                 fullWidth
//                 required
//                 error={!formData.subType}
//                 disabled={!formData.type}
//               >
//                 <InputLabel>زیر نوعیت</InputLabel>
//                 <Select
//                   name="subType"
//                   value={formData.subType}
//                   onChange={handleInputChange}
//                   label="زیر نوعیت"
//                   sx={{ height: 60 }}
//                 >
//                   {subTypes.map((subType) => (
//                     <MenuItem key={subType.id} value={subType.id}>
//                       {subType.name}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Grid>

//             {/* Year */}
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 type="date"
//                 name="year"
//                 label="سال"
//                 InputLabelProps={{ shrink: true }}
//                 value={formData.year}
//                 onChange={handleInputChange}
//                 required
//               />
//             </Grid>

//             {/* Org */}
//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth required error={!formData.org}>
//                 <InputLabel>اداره</InputLabel>
//                 <Select
//                   name="org"
//                   value={formData.org}
//                   onChange={handleInputChange}
//                   label="اداره"
//                 >
//                   {orgs.map((org) => (
//                     <MenuItem key={org.id} value={org.id}>
//                       {org.name}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Grid>

//             {/* Description */}
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 name="description"
//                 label="ملاحظات"
//                 multiline
//                 rows={3}
//                 value={formData.description}
//                 onChange={handleInputChange}
//               />
//             </Grid>
//           </Grid>
//         </Box>
//       </DialogContent>

//       {/* ===== Dialog Actions ===== */}
//       <DialogActions
//         sx={{
//           px: 3,
//           py: 2,
//           borderTop: "1px solid #e0e0e0",
//           gap: 1,
//         }}
//       >
//         <Button onClick={onClose} variant="outlined" disabled={isSubmitting}>
//           لغوه
//         </Button>

//         <Button
//           onClick={handleSubmit}
//           variant="contained"
//           startIcon={
//             isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />
//           }
//           disabled={isSubmitting}
//           sx={{
//             backgroundColor: "black",
//             color: "white",
//             "&:hover": { backgroundColor: "#1d252e" },
//           }}
//         >
//           {isSubmitting ? "در حال ذخیره..." : "ذخیره تغییرات"}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Box,
  IconButton,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import { toast } from "react-hot-toast";
import { updateHifziyaHazari } from "../../../services/RepositoryManagement/HifziyaHazariAPI";
import api from "../../../services/api";

export default function EditHazariDialog({ open, onClose, hazari, onSuccess }) {
  const [formData, setFormData] = useState({
    type: "",
    subType: "",
    year: "",
    org: "",
    description: "",
    isIndraj: true,
    fileURL: null,
  });

  const [types, setTypes] = useState([]);
  const [subTypes, setSubTypes] = useState([]);
  const [orgs, setOrgs] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingFiles, setExistingFiles] = useState([]);

  // Load organizations and types
  useEffect(() => {
    const loadData = async () => {
      try {
        const [typesRes, orgsRes] = await Promise.all([
          api.get("/type"),
          api.get("/org"),
        ]);
        setTypes(typesRes.data);
        setOrgs(orgsRes.data);
      } catch (error) {
        console.error("Failed to load data", error);
        toast.error("د معلوماتو لوډولو کې ستونزه");
      }
    };
    loadData();
  }, []);

  // Populate form when hazari changes
  useEffect(() => {
    if (hazari) {
      const formattedDate = hazari.year
        ? new Date(hazari.year).toISOString().split("T")[0]
        : "";

      setFormData({
        type: hazari.type?.id || "",
        subType: hazari.subType?.id || "",
        year: formattedDate,
        org: hazari.org?.id || "",
        description: hazari.description || "",
        isIndraj: hazari.isIndraj !== undefined ? hazari.isIndraj : true,
        fileURL: null,
      });

      // Store existing files
      if (hazari.files && hazari.files.length > 0) {
        setExistingFiles(hazari.files);
      }
    }
  }, [hazari]);

  // Load SubTypes when Type changes
  useEffect(() => {
    const loadSubTypes = async () => {
      if (!formData.type) {
        setSubTypes([]);
        setFormData((prev) => ({ ...prev, subType: "" }));
        return;
      }

      try {
        const response = await api.get(`/sub-type/by-type/${formData.type}`);
        setSubTypes(response.data);
      } catch (error) {
        console.error("Failed to load subtypes", error);
        toast.error("د فرعي ډولونو لوډولو کې ستونزه");
        setSubTypes([]);
      }
    };

    loadSubTypes();
  }, [formData.type]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      fileURL: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const requiredFields = ["type", "subType", "year", "org"];
    const missingFields = requiredFields.filter((field) => !formData[field]);
    if (missingFields.length > 0) {
      toast.error("لطفاً تمام فیلدهای ضروری را پر کنید");
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataToSend = new FormData();

      const yearAsInteger = new Date(formData.year).getFullYear();

      const hazariData = {
        type: { id: formData.type },
        subType: { id: formData.subType },
        year: yearAsInteger,
        org: { id: formData.org },
        description: formData.description,
        isIndraj: formData.isIndraj,
      };

      formDataToSend.append("hifziyaHazari", JSON.stringify(hazariData));

      if (formData.fileURL) {
        formDataToSend.append("fileURL", formData.fileURL);
      }

      await updateHifziyaHazari(hazari.id, formDataToSend);
      toast.success("حاضری راپور په بریالیتوب سره تازه شو");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to update report", error);
      toast.error(
        "تازه کول ناکام شو: " + (error.response?.data?.message || error.message)
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 2,
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Box sx={{ fontFamily: "B Nazanin", fontWeight: "bold", fontSize: 20 }}>
          ویرایش کتاب حاضری
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {hazari && (
          <Alert severity="info" sx={{ mb: 2 }}>
            د ریکارډ شمېره: {hazari.id}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            {/* Record Type */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>د ریکارډ ډول</InputLabel>
                <Select
                  name="isIndraj"
                  value={formData.isIndraj}
                  onChange={handleInputChange}
                  label="د ریکارډ ډول"
                >
                  <MenuItem value={true}>اندراج</MenuItem>
                  <MenuItem value={false}>حاضری</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Type */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!formData.type}>
                <InputLabel>نوعیت</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  label="نوعیت"
                >
                  {types.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* SubType */}
            <Grid item xs={12} sm={6}>
              <FormControl
                fullWidth
                required
                error={!formData.subType}
                disabled={!formData.type}
              >
                <InputLabel>زیر نوعیت</InputLabel>
                <Select
                  name="subType"
                  value={formData.subType}
                  onChange={handleInputChange}
                  label="زیر نوعیت"
                >
                  {subTypes.length === 0 ? (
                    <MenuItem disabled>
                      {formData.type
                        ? "Loading..."
                        : "لطفاً اول نوعیت انتخاب کنید"}
                    </MenuItem>
                  ) : (
                    subTypes.map((subType) => (
                      <MenuItem key={subType.id} value={subType.id}>
                        {subType.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Grid>

            {/* Year */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                name="year"
                label="سال"
                InputLabelProps={{ shrink: true }}
                value={formData.year}
                onChange={handleInputChange}
                required
                error={!formData.year}
              />
            </Grid>

            {/* Org */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!formData.org}>
                <InputLabel>اداره</InputLabel>
                <Select
                  name="org"
                  value={formData.org}
                  onChange={handleInputChange}
                  label="اداره"
                >
                  {orgs.length === 0 ? (
                    <MenuItem disabled>Loading...</MenuItem>
                  ) : (
                    orgs.map((org) => (
                      <MenuItem key={org.id} value={org.id}>
                        {org.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Grid>

            {/* File Upload */}
            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ height: 56 }}
              >
                {formData.fileURL ? formData.fileURL.name : "انتخاب فایل"}
                <input type="file" hidden onChange={handleFileChange} />
              </Button>
              {existingFiles.length > 0 && (
                <Box
                  sx={{ mt: 1, fontSize: "0.875rem", color: "text.secondary" }}
                >
                  فایل موجود: {existingFiles.length} فایل
                </Box>
              )}
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="description"
                label="ملاحظات"
                multiline
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: "1px solid #e0e0e0",
          gap: 1,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={isSubmitting}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
          }}
        >
          لغوه
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting}
          startIcon={
            isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />
          }
          sx={{
            backgroundColor: "black",
            color: "white",
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: "#1d252e",
            },
            textTransform: "none",
          }}
        >
          {isSubmitting ? "در حال ذخیره..." : "ذخیره تغییرات"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
