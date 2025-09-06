import React from "react";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import breadcrumbNameMap from "./breadcrumbNameMap";

const PageBreadcrumbs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <div style={{ marginBottom: "16px" }}>
      <Breadcrumbs
        aria-label="breadcrumb"
        separator="•"
        sx={{
          "& .MuiBreadcrumbs-separator": {
            fontSize: "12px", // د بولټ اندازه
            color: "#919AEB", // د رنګ بدلول
          },
        }}
      >
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          let label = breadcrumbNameMap[to] || value;
          Object.keys(breadcrumbNameMap).forEach((key) => {
            if (key.includes(":id")) {
              const baseKey = key.replace(":id", "");
              const lastPart = value; // value د URL وروستۍ برخه ده
              if (to.startsWith(baseKey) && !isNaN(Number(lastPart))) {
                label = breadcrumbNameMap[key];
              }
            }
          });
          return isLast ? (
            <Typography color="text.primary" key={to}>
              {label}
            </Typography>
          ) : (
            <Link
              underline="hover"
              color="inherit"
              onClick={() => navigate(to)}
              key={to}
              sx={{ cursor: "pointer" }}
            >
              {label}
            </Link>
          );
        })}
      </Breadcrumbs>
    </div>
  );
};

export default PageBreadcrumbs;
