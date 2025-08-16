import React from "react";
import {
  TextField,
  InputAdornment,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const Filter = ({
  value,
  onChange,
  placeholder = "لټون...",
  width = "300px",
  height = "40px",
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // موبایل لپاره check

  return (
    <Box
      display="flex"
      justifyContent={isMobile ? "center" : "flex-end"} // موبایل وسط، ډیسټاپ ښي
      mb={2}
    >
      <TextField
        variant="outlined"
        size="small"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        dir="rtl" // متن او icon ښي خوا ته
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          sx: {
            height: height,
            textAlign: "right",
            marginTop: isMobile ? "0" : "0.5rem", // موبایل کې لږه فاصله
            marginRight: isMobile ? "0" : "1rem", // موبایل کې لږه فاصله
            borderRadius: "8px",
            backgroundColor: theme.palette.background.paper,
          },
        }}
        sx={{
          width: isMobile ? "90%" : width, // موبایل کې پراخوالی زیات کړئ
          "& .MuiOutlinedInput-root": {
            height: height,
          },
        }}
      />
    </Box>
  );
};

export default Filter;
