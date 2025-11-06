import { TextField, Box, Grid, Button, CircularProgress } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  getAnnualReporInfotById,
  updateAnnualReportInfo,
} from "../../../services/StorageManagement/AnnualReportInfoApi";
import React, { useState, useEffect } from "react";
import PageBreadcrumbs from "../../Breadcrumbs/PageBreadcrumbs";
import { provinces, provincesWithDistricts } from "../../../Data/Afghanistan";

// const departments = ["آرشیف", "حفظیه", "مخزن"];

export default function UpdateAnnualReportInfo() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    bookNumber: "",
    province: "",
    district: "",
    year: "",
    waseqaType: "",
    summaryOfWaseqa: "",
    remarks: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnnualReportInfo = async () => {
      try {
        const response = await getAnnualReporInfotById(id);
        const reportInfoData = response.data;

        // Format the date for the input field
        const formattedDate = reportInfoData.year
          ? new Date(reportInfoData.year).toISOString().split("T")[0]
          : "";

        setFormData({
          bookNumber: reportInfoData.bookNumber || "",
          province: reportInfoData.province || "",
          district: reportInfoData.district || "",
          year: formattedDate,
          waseqaType: reportInfoData.waseqaType || "",
          summaryOfWaseqa: reportInfoData.summaryOfWaseqa || "",
          remarks: reportInfoData.remarks || "",
        });
        setAvailableDistricts(
          provincesWithDistricts[reportInfoData.province] || []
        );

        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch receipt", error);
        toast.error("Failed to load receipt data");
        navigate("/annual-reports-info");
      }
    };

    fetchAnnualReportInfo();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (formData.province) {
      setAvailableDistricts(provincesWithDistricts[formData.province] || []);
    }
  }, [formData.province]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Only append the file if a new one was selected
    try {
      await updateAnnualReportInfo(id, formData);
      toast.success("کلنی راپور په بریالیتوب سره ثبت شو");
      navigate("/annual-reports-info");
    } catch (error) {
      console.error("Failed to create report", error);
      toast.error("ثبت ناکام شو");
    }
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
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
          autoComplete="on"
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
          {/* Title */}
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
            ویرایش رسیدات
          </Box>

          {/* Breadcrumbs */}
          <Box
            sx={{
              position: "absolute",
              top: { xs: -20, sm: -25, md: -30 },
              right: 20,
            }}
          >
            <PageBreadcrumbs />
          </Box>
          {/* Left Side - Upload Photo */}

          {/* Right Side - Form Fields */}
          <Grid container spacing={2} sx={{ flex: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="bookNumber"
                type="number"
                label="نمبر کتاب"
                variant="outlined"
                value={formData.bookNumber}
                onChange={handleInputChange}
                InputProps={{
                  sx: { height: 60 },
                }}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                name="province"
                label="ولایت"
                value={formData.province}
                onChange={(e) => {
                  const selectedProvince = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    province: selectedProvince,
                    district: "", // ولسوالی reset شي کله چې ولایت بدل شي
                  }));
                  setAvailableDistricts(
                    provincesWithDistricts[selectedProvince] || []
                  );
                }}
                SelectProps={{ native: true }}
                InputProps={{ sx: { height: 60 } }}
                InputLabelProps={{ shrink: true }}
                required
              >
                <option value="">-- ولایت انتخاب کړئ --</option>
                {provinces.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                name="district"
                label="ولسوالی"
                value={formData.district}
                onChange={handleInputChange}
                SelectProps={{ native: true }}
                InputProps={{ sx: { height: 60 } }}
                InputLabelProps={{ shrink: true }}
                required
                disabled={!formData.province}
              >
                <option value="">-- ولسوالی انتخاب کړئ --</option>
                {availableDistricts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="year"
                type="date"
                InputLabelProps={{ shrink: true }}
                label="  کال"
                variant="outlined"
                value={formData.year}
                onChange={handleInputChange}
                InputProps={{ sx: { height: 60 } }}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="waseqaType"
                label="نوع وسقه"
                variant="outlined"
                value={formData.waseqaType}
                onChange={handleInputChange}
                InputProps={{ sx: { height: 60 } }}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="summaryOfWaseqa"
                label=" خلاصه وسقه"
                variant="outlined"
                value={formData.summaryOfWaseqa}
                onChange={handleInputChange}
                InputProps={{ sx: { height: 60 } }}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="remarks"
                rows={4}
                label="ملاحضات"
                variant="outlined"
                value={formData.remarks}
                onChange={handleInputChange}
                InputProps={{ sx: { height: 60 } }}
              />
            </Grid>

            {/* Save Button */}
            <Grid item xs={12} sx={{ textAlign: "right", mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: "black",
                  color: "white",
                  borderRadius: "10px",
                  "&:hover": {
                    backgroundColor: "#1d252e",
                  },
                }}
                endIcon={<SaveIcon />}
                style={{ marginLeft: "20px", marginBottom: "20px" }}
                disabled={isSubmitting}
              >
                {isSubmitting ? <CircularProgress size={24} /> : "ویرایش کردن"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}
