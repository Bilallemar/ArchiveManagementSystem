import { TextField, Box, Grid, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { createAnnualReport } from "../../../services/StorageManagement/AnnualReportApi";
import React, { useState } from "react";
import PageBreadcrumbs from "../../Breadcrumbs/PageBreadcrumbs";
import SaveIcon from "@mui/icons-material/Save";
import { provinces, provincesWithDistricts } from "../../../Data/Afghanistan";

export default function AddAnnualReport() {
  const [formData, setFormData] = useState({
    bookNumber: "",
    province: "",
    district: "",
    year: "",
    waseqaType: "",
    summaryOfWaseqa: "",
    remarks: "",
  });

  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

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

    // Validate required fields
    const requiredFields = [
      "bookNumber",
      "province",
      "district",
      "year",
      "waseqaType",
      "summaryOfWaseqa",
    ];
    const missingFields = requiredFields.filter((field) => !formData[field]);
    if (missingFields.length > 0) {
      toast.error("لطفاً تمام فیلدهای ضروری را پر کنید");
      setIsSubmitting(false);
      return;
    }

    try {
      await createAnnualReport(formData);
      toast.success("کلنی راپور په بریالیتوب سره ثبت شو");
      navigate("/annual-reports");
    } catch (error) {
      console.error("Failed to create report", error);
      toast.error("ثبت ناکام شو");
    }
    setIsSubmitting(false);
  };

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
          افزودن رسیدات
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

        <Grid container spacing={2} sx={{ flex: 1 }}>
          {/* Book Number */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="bookNumber"
              type="number"
              label="نمبر کتاب"
              variant="outlined"
              value={formData.bookNumber}
              onChange={handleInputChange}
              InputProps={{ sx: { height: 60 } }}
              required
              error={!formData.bookNumber}
              helperText={!formData.bookNumber ? "این فیلد ضروری است" : ""}
            />
          </Grid>

          {/* Province Dropdown */}
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
                  district: "",
                }));
                setAvailableDistricts(
                  provincesWithDistricts[selectedProvince] || []
                );
              }}
              SelectProps={{ native: true }}
              InputProps={{ sx: { height: 60 } }}
              InputLabelProps={{ shrink: true }} // ← دا اضافه کړئ
              required
              error={!formData.province}
              helperText={!formData.province ? "این فیلد ضروری است" : ""}
            >
              <option value="">-- ولایت را انتخاب کنید --</option>
              {provinces.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </TextField>
          </Grid>

          {/* District Dropdown */}
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
              InputLabelProps={{ shrink: true }} // ← دا اضافه کړئ
              required
              error={!formData.district}
              helperText={!formData.district ? "این فیلد ضروری است" : ""}
              disabled={!formData.province}
            >
              <option value="">-- ولسوالی را انتخاب کنید --</option>
              {availableDistricts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </TextField>
          </Grid>

          {/* Year */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="year"
              type="date"
              InputLabelProps={{ shrink: true }}
              label="سال"
              variant="outlined"
              value={formData.year}
              onChange={handleInputChange}
              InputProps={{ sx: { height: 60 } }}
              required
              error={!formData.year}
              helperText={!formData.year ? "این فیلد ضروری است" : ""}
            />
          </Grid>

          {/* Waseqa Type */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="waseqaType"
              label="نوعیت وثیقه"
              variant="outlined"
              value={formData.waseqaType}
              onChange={handleInputChange}
              InputProps={{ sx: { height: 60 } }}
              required
              error={!formData.waseqaType}
              helperText={!formData.waseqaType ? "این فیلد ضروری است" : ""}
            />
          </Grid>

          {/* Summary of Waseqa */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="summaryOfWaseqa"
              label="خلاصه وثیقه"
              variant="outlined"
              value={formData.summaryOfWaseqa}
              onChange={handleInputChange}
              InputProps={{ sx: { height: 60 } }}
              required
              error={!formData.summaryOfWaseqa}
              helperText={!formData.summaryOfWaseqa ? "این فیلد ضروری است" : ""}
            />
          </Grid>

          {/* Remarks */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="remarks"
              label="ملاحظات"
              variant="outlined"
              value={formData.remarks}
              onChange={handleInputChange}
              InputProps={{ sx: { height: 60 } }}
            />
          </Grid>

          {/* Submit Button */}
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
              }}
              endIcon={<SaveIcon />}
              disabled={isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={24} /> : "ذخیره کردن"}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
