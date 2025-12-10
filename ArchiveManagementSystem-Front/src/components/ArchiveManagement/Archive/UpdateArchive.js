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
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  getArchiveById,
  updateArchive,
} from "../../../services/ArchiveManagement/ArchiveAPI";
import React, { useState, useEffect } from "react";
import PageBreadcrumbs from "../../Breadcrumbs/PageBreadcrumbs";
import SaveIcon from "@mui/icons-material/Save";
import api from "../../../services/api";

export default function UpdateArchive() {
  const { id } = useParams();
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
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        const orgsRes = await api.get("/org");
        setOrgs(orgsRes.data);

        const recordRes = await getArchiveById(id);
        const record = recordRes.data;

        setFormData({
          docNo: record.docNo || "",
          incommingDate: record.incommingDate || "",
          outgoingDate: record.outgoingDate || "",
          org: record.org?.id || "",
          submitedDate: record.submitedDate || "",
          description: record.description || "",
          docType: record.docType || "",
          year: record.year || "",
          isIncoming:
            record.isIncoming !== undefined ? record.isIncoming : true,
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load data", error);
        toast.error("د معلوماتو لوډولو کې ستونزه");
        setIsLoading(false);
        navigate("/archive");
      }
    };
    loadData();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const requiredFields = ["docNo", "org"];
    const missingFields = requiredFields.filter((field) => !formData[field]);
    if (missingFields.length > 0) {
      toast.error("لطفاً تمام فیلدهای ضروری را پر کنید");
      setIsSubmitting(false);
      return;
    }

    try {
      const archiveData = {
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

      await updateArchive(id, archiveData);
      toast.success("آرشیف په بریالیتوب سره تازه شو");
      navigate("/archive");
    } catch (error) {
      console.error("Failed to update archive", error);
      toast.error(
        "تازه کول ناکام شو: " + (error.response?.data?.message || error.message)
      );
    }
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        padding: { xs: 1, sm: 2 },
      }}
    >
      <Box
        component="form"
        noValidate
        autoComplete="off"
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          p: { xs: 2, sm: 3, md: 4 },
          bgcolor: "#fff",
          borderRadius: 3,
          boxShadow: 3,
          width: { xs: "100%", sm: "90%", md: "80%", lg: "70%" },
          position: "relative",
          marginTop: { xs: "70px", sm: "80px", md: "90px", lg: "100px" },
        }}
        onSubmit={handleSubmit}
      >
        <Box
          sx={{
            position: "absolute",
            top: { xs: -40, sm: -50, md: -80 },
            right: 20,
            fontFamily: "B nazanin",
            fontWeight: "bold",
            fontSize: { xs: 20, sm: 22, md: 24 },
          }}
        >
          تازه کول
        </Box>

        <Box
          sx={{
            position: "absolute",
            top: { xs: -20, sm: -25, md: -30 },
            right: 20,
          }}
        >
          <PageBreadcrumbs />
        </Box>

        <Grid container spacing={2} sx={{ flex: 1 }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>ډول</InputLabel>
              <Select
                name="isIncoming"
                value={formData.isIncoming}
                onChange={handleInputChange}
                label="ډول"
                sx={{ height: 60 }}
              >
                <MenuItem value={true}>وارده</MenuItem>
                <MenuItem value={false}>صادره</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="docNo"
              InputLabelProps={{ shrink: true }}
              label="نمبر سند"
              variant="outlined"
              value={formData.docNo}
              onChange={handleInputChange}
              InputProps={{ sx: { height: 60 } }}
              required
              error={!formData.docNo}
              helperText={!formData.docNo ? "این فیلد ضروری است" : ""}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="incommingDate"
              type="date"
              InputLabelProps={{ shrink: true }}
              label="تاریخ وارده"
              variant="outlined"
              value={formData.incommingDate}
              onChange={handleInputChange}
              InputProps={{ sx: { height: 60 } }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="outgoingDate"
              type="date"
              InputLabelProps={{ shrink: true }}
              label="تاریخ صادره"
              variant="outlined"
              value={formData.outgoingDate}
              onChange={handleInputChange}
              InputProps={{ sx: { height: 60 } }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={!formData.org}>
              <InputLabel>اداره</InputLabel>
              <Select
                name="org"
                value={formData.org}
                onChange={handleInputChange}
                label="اداره"
                sx={{ height: 60 }}
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

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="submitedDate"
              type="date"
              InputLabelProps={{ shrink: true }}
              label="تاریخ تسلیمی"
              variant="outlined"
              value={formData.submitedDate}
              onChange={handleInputChange}
              InputProps={{ sx: { height: 60 } }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="docType"
              InputLabelProps={{ shrink: true }}
              label="نوع سند"
              variant="outlined"
              value={formData.docType}
              onChange={handleInputChange}
              InputProps={{ sx: { height: 60 } }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="year"
              type="number"
              InputLabelProps={{ shrink: true }}
              label="سال"
              variant="outlined"
              value={formData.year}
              onChange={handleInputChange}
              InputProps={{ sx: { height: 60 } }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              name="description"
              label="ملاحظات"
              variant="outlined"
              multiline
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12} sx={{ textAlign: "right", mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "black",
                color: "white",
                borderRadius: "10px",
                "&:hover": { backgroundColor: "#1d252e" },
                width: { xs: "100%", sm: "auto" },
                px: 4,
              }}
              endIcon={<SaveIcon />}
              disabled={isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={24} /> : "تازه کول"}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
