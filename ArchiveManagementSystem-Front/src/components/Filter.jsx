import React from "react";
import {
  TextField,
  InputAdornment,
  Box,
  useMediaQuery,
  useTheme,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const Filter = ({
  value,
  onChange,
  placeholder = "جستجو...",
  width = "300px",
  height = "40px",
  field,
  onFieldChange,
  fields = [], // د فیلډونو لیست د props له لارې
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      display="flex"
      justifyContent={isMobile ? "center" : "flex-end"}
      alignItems="center"
      mb={2}
      gap={2}
    >
      {/* فلټر Dropdown */}
      <FormControl
        size="small"
        variant="outlined"
        dir="rtl"
        sx={{
          width: isMobile ? "70%" : "150px",
          "& .MuiOutlinedInput-root": {
            height: height,
            borderRadius: "8px",
          },
        }}
      >
        <InputLabel id="field-label">فلټر</InputLabel>
        <Select
          labelId="field-label"
          value={field}
          onChange={onFieldChange}
          label="فلټر"
        >
          {fields.map((f) => (
            <MenuItem key={f.value} value={f.value}>
              {f.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* سرچ بار */}
      <TextField
        variant="outlined"
        size="small"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        dir="rtl"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{
          width: isMobile ? "70%" : width,
          "& .MuiOutlinedInput-root": {
            height: height,
            borderRadius: "8px",
            marginRight: isMobile ? "0" : "10px",
          },
        }}
        onKeyPress={(e) => {
          if (e.key === "Enter") e.preventDefault(); // د page reload مخنیوی
        }}
      />
    </Box>
  );
};

export default Filter;
