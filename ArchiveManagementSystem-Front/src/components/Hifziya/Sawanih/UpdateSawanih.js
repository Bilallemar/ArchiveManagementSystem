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
  getSawanihById,
  updateSawanih,
} from "../../../services/RepositoryManagement/SawanihAPI";
import React, { useState, useEffect } from "react";
import PageBreadcrumbs from "../../Breadcrumbs/PageBreadcrumbs";
import SaveIcon from "@mui/icons-material/Save";
import api from "../../../services/api";

export default function UpdateSawanih() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    qaidWarida: "",
    incommingDate: "",
    outgoingDate: "",
    org: "",
    description: "",
    pageQuantity: "",
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

        const recordRes = await getSawanihById(id);
        const record = recordRes.data;

        setFormData({
          name: record.name || "",
          fatherName: record.fatherName || "",
          qaidWarida: record.qaidWarida || "",
          incommingDate: record.incommingDate || "",
          outgoingDate: record.outgoingDate || "",
          org: record.org?.id || "",
          description: record.description || "",
          pageQuantity: record.pageQuantity || "",
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load data", error);
        toast.error("د معلوماتو لوډولو کې ستونزه");
        setIsLoading(false);
        navigate("/sawanih");
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

    const requiredFields = ["name", "org"];
    const missingFields = requiredFields.filter((field) => !formData[field]);
    if (missingFields.length > 0) {
      toast.error("لطفاً تمام فیلدهای ضروری را پر کنید");
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataToSend = new FormData();

      const sawanihData = {
        name: formData.name,
        fatherName: formData.fatherName,
        qaidWarida: formData.qaidWarida,
        incommingDate: formData.incommingDate,
        outgoingDate: formData.outgoingDate,
        org: { id: formData.org },
        description: formData.description,
        pageQuantity: formData.pageQuantity
          ? parseInt(formData.pageQuantity)
          : null,
      };
      formDataToSend.append("Sawanih", JSON.stringify(sawanihData));

      await updateSawanih(id, formDataToSend);
      toast.success("ریکارډ په بریالیتوب سره تازه شو");
      navigate("/sawanih");
    } catch (error) {
      console.error("Failed to update record", error);
      console.error("Error response:", error.response?.data);
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
            <TextField
              fullWidth
              name="name"
              InputLabelProps={{ shrink: true }}
              label="نوم"
              variant="outlined"
              value={formData.name}
              onChange={handleInputChange}
              InputProps={{ sx: { height: 60 } }}
              required
              error={!formData.name}
              helperText={!formData.name ? "این فیلد ضروری است" : ""}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="fatherName"
              InputLabelProps={{ shrink: true }}
              label="د پلار نوم"
              variant="outlined"
              value={formData.fatherName}
              onChange={handleInputChange}
              InputProps={{ sx: { height: 60 } }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="qaidWarida"
              InputLabelProps={{ shrink: true }}
              label="قید واریده"
              variant="outlined"
              value={formData.qaidWarida}
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
            <TextField
              fullWidth
              name="pageQuantity"
              type="number"
              InputLabelProps={{ shrink: true }}
              label="تعداد صفحات"
              variant="outlined"
              value={formData.pageQuantity}
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
