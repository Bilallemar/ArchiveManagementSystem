// import React, { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Box,
//   Grid,
//   TextField,
//   Button,
//   CircularProgress,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
// } from "@mui/material";
// import SaveIcon from "@mui/icons-material/Save";
// import { toast } from "react-hot-toast";
// import { updateArchive } from "../../../services/ArchiveManagement/ArchiveAPI";
// import api from "../../../services/api";

// export default function EditArchiveDialog({
//   open,
//   onClose,
//   archive,
//   onSuccess,
// }) {
//   const [formData, setFormData] = useState({
//     docNo: "",
//     incommingDate: "",
//     outgoingDate: "",
//     org: "",
//     submitedDate: "",
//     description: "",
//     docType: "",
//     year: "",
//     isIncoming: true,
//   });
//   const [orgs, setOrgs] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   // Load organizations on mount
//   useEffect(() => {
//     const loadOrgs = async () => {
//       try {
//         const response = await api.get("/org");
//         setOrgs(response.data);
//       } catch (error) {
//         console.error("Failed to load organizations:", error);
//         toast.error("د ادارو لوډولو کې ستونزه");
//       }
//     };
//     loadOrgs();
//   }, []);

//   // Populate form when archive changes
//   useEffect(() => {
//     if (archive && open) {
//       setFormData({
//         docNo: archive.docNo || "",
//         incommingDate: archive.incommingDate || "",
//         outgoingDate: archive.outgoingDate || "",
//         org: archive.org?.id || "",
//         submitedDate: archive.submitedDate || "",
//         description: archive.description || "",
//         docType: archive.docType || "",
//         year: archive.year || "",
//         isIncoming:
//           archive.isIncoming !== undefined ? archive.isIncoming : true,
//       });
//     }
//   }, [archive, open]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;

//     // Clear outgoing date when switching to incoming
//     if (name === "isIncoming" && value === true) {
//       setFormData((prev) => ({ ...prev, [name]: value, outgoingDate: "" }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     // Validation
//     if (!formData.docNo || !formData.org) {
//       toast.error("لطفاً نمبر سند او اداره ضروری دي");
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       const payload = {
//         docNo: formData.docNo,
//         incommingDate: formData.incommingDate,
//         outgoingDate: formData.outgoingDate,
//         org: { id: formData.org },
//         submitedDate: formData.submitedDate,
//         description: formData.description,
//         docType: formData.docType,
//         year: formData.year ? parseInt(formData.year) : null,
//         isIncoming: formData.isIncoming,
//       };

//       await updateArchive(archive.id, payload);
//       toast.success("آرشیف په بریالیتوب سره تازه شو");
//       onSuccess();
//       onClose();
//     } catch (error) {
//       console.error("Update failed:", error);
//       toast.error("تازه کول ناکام شو");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleClose = () => {
//     if (!isSubmitting) {
//       onClose();
//     }
//   };

//   return (
//     <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
//       <DialogTitle>تازه کول</DialogTitle>
//       <DialogContent>
//         <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
//           <Grid container spacing={2.5}>
//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth>
//                 <InputLabel>ډول</InputLabel>
//                 <Select
//                   name="isIncoming"
//                   value={formData.isIncoming}
//                   onChange={handleInputChange}
//                   label="ډول"
//                   disabled={isSubmitting}
//                 >
//                   <MenuItem value={true}>وارده</MenuItem>
//                   <MenuItem value={false}>صادره</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 name="docNo"
//                 label="نمبر سند"
//                 value={formData.docNo}
//                 onChange={handleInputChange}
//                 required
//                 disabled={isSubmitting}
//                 error={!formData.docNo}
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 name="incommingDate"
//                 type="date"
//                 label="تاریخ وارده"
//                 value={formData.incommingDate}
//                 onChange={handleInputChange}
//                 disabled={isSubmitting}
//                 InputLabelProps={{ shrink: true }}
//               />
//             </Grid>

//             {/* Only show outgoing date for صادره (outgoing) documents */}
//             {!formData.isIncoming && (
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   name="outgoingDate"
//                   type="date"
//                   label="تاریخ صادره"
//                   value={formData.outgoingDate}
//                   onChange={handleInputChange}
//                   disabled={isSubmitting}
//                   InputLabelProps={{ shrink: true }}
//                 />
//               </Grid>
//             )}

//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth required error={!formData.org}>
//                 <InputLabel>اداره</InputLabel>
//                 <Select
//                   name="org"
//                   value={formData.org}
//                   onChange={handleInputChange}
//                   label="اداره"
//                   disabled={isSubmitting}
//                 >
//                   {orgs.length === 0 ? (
//                     <MenuItem disabled>Loading...</MenuItem>
//                   ) : (
//                     orgs.map((org) => (
//                       <MenuItem key={org.id} value={org.id}>
//                         {org.name}
//                       </MenuItem>
//                     ))
//                   )}
//                 </Select>
//               </FormControl>
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 name="submitedDate"
//                 type="date"
//                 label="تاریخ تسلیمی"
//                 value={formData.submitedDate}
//                 onChange={handleInputChange}
//                 disabled={isSubmitting}
//                 InputLabelProps={{ shrink: true }}
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 name="docType"
//                 label="نوع سند"
//                 value={formData.docType}
//                 onChange={handleInputChange}
//                 disabled={isSubmitting}
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 name="year"
//                 type="number"
//                 label="سال"
//                 value={formData.year}
//                 onChange={handleInputChange}
//                 disabled={isSubmitting}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 name="description"
//                 label="ملاحظات"
//                 multiline
//                 rows={3}
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 disabled={isSubmitting}
//               />
//             </Grid>
//           </Grid>
//         </Box>
//       </DialogContent>
//       <DialogActions sx={{ px: 3, pb: 2 }}>
//         <Button onClick={handleClose} disabled={isSubmitting}>
//           لغوه
//         </Button>
//         <Button
//           onClick={handleSubmit}
//           variant="contained"
//           disabled={isSubmitting}
//           endIcon={isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
//           sx={{ bgcolor: "black", "&:hover": { bgcolor: "#1d252e" } }}
//         >
//           {isSubmitting ? "ذخیره کیږي..." : "ذخیره تغییرات"}
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
  Box,
  Grid,
  TextField,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

import { updateArchive } from "../../../services/ArchiveManagement/ArchiveAPI";
import api from "../../../services/api";
import EditArchiveDialogTexts from "./EditArchiveDialogTexts";

export default function EditArchiveDialog({
  open,
  onClose,
  archive,
  onSuccess,
}) {
  const { t } = useTranslation("editArchiveDialog");
  const text = EditArchiveDialogTexts(t);

  const [formData, setFormData] = useState({
    docNo: "",
    incommingDate: "",
    outgoingDate: "",
    org: "",
    submitedDate: "",
    description: "",
    docType: "",
    year: "",
    isIncoming: true,
  });

  const [orgs, setOrgs] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load organizations
  useEffect(() => {
    const loadOrgs = async () => {
      try {
        const response = await api.get("/org");
        setOrgs(response.data);
      } catch (error) {
        console.error(error);
        toast.error(text.loadOrgError);
      }
    };
    loadOrgs();
  }, [text.loadOrgError]);

  // Populate form
  useEffect(() => {
    if (archive && open) {
      setFormData({
        docNo: archive.docNo || "",
        incommingDate: archive.incommingDate || "",
        outgoingDate: archive.outgoingDate || "",
        org: archive.org?.id || "",
        submitedDate: archive.submitedDate || "",
        description: archive.description || "",
        docType: archive.docType || "",
        year: archive.year || "",
        isIncoming:
          archive.isIncoming !== undefined ? archive.isIncoming : true,
      });
    }
  }, [archive, open]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "isIncoming" && value === true) {
      setFormData((prev) => ({ ...prev, isIncoming: true, outgoingDate: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.docNo || !formData.org) {
      toast.error(text.validationError);
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        docNo: formData.docNo,
        incommingDate: formData.incommingDate,
        outgoingDate: formData.outgoingDate,
        org: { id: formData.org },
        submitedDate: formData.submitedDate,
        description: formData.description,
        docType: formData.docType,
        year: formData.year ? parseInt(formData.year) : null,
        isIncoming: formData.isIncoming,
      };

      await updateArchive(archive.id, payload);
      toast.success(text.updateSuccess);
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(text.updateFailed);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{text.title}</DialogTitle>

      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{text.type}</InputLabel>
                <Select
                  name="isIncoming"
                  value={formData.isIncoming}
                  onChange={handleInputChange}
                  label={text.type}
                >
                  <MenuItem value={true}>{text.incoming}</MenuItem>
                  <MenuItem value={false}>{text.outgoing}</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="docNo"
                label={text.docNo}
                value={formData.docNo}
                onChange={handleInputChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                name="incommingDate"
                label={text.incomingDate}
                InputLabelProps={{ shrink: true }}
                value={formData.incommingDate}
                onChange={handleInputChange}
              />
            </Grid>

            {!formData.isIncoming && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  name="outgoingDate"
                  label={text.outgoingDate}
                  InputLabelProps={{ shrink: true }}
                  value={formData.outgoingDate}
                  onChange={handleInputChange}
                />
              </Grid>
            )}

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>{text.organization}</InputLabel>
                <Select
                  name="org"
                  value={formData.org}
                  onChange={handleInputChange}
                  label={text.organization}
                >
                  {orgs.map((org) => (
                    <MenuItem key={org.id} value={org.id}>
                      {org.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                name="submitedDate"
                label={text.submittedDate}
                InputLabelProps={{ shrink: true }}
                value={formData.submitedDate}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="docType"
                label={text.docType}
                value={formData.docType}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="year"
                type="number"
                label={text.year}
                value={formData.year}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                name="description"
                label={text.description}
                value={formData.description}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>{text.cancel}</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          endIcon={isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
        >
          {isSubmitting ? text.saving : text.saveChanges}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
