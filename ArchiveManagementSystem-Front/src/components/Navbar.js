import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useMyContext } from "../store/ContextApi";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { RxCross2 } from "react-icons/rx";
import Sidebar from "./Sidebar ";
import {
  getNavigationItems,
  clearUserManagement,
} from "../utils/managementUtils";

const Navbar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [headerToggle, setHeaderToggle] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { token, setToken, setCurrentUser, isAdmin, setIsAdmin } =
    useMyContext();

  // Get navigation items based on user's management
  const navigationItems = getNavigationItems();

  const toggleSidebar = (state) => setSidebarOpen(state);

  const handleLogout = () => {
    localStorage.removeItem("JWT_TOKEN");
    localStorage.removeItem("USER");
    localStorage.removeItem("CSRF_TOKEN");
    localStorage.removeItem("IS_ADMIN");
    clearUserManagement();
    setToken(null);
    setCurrentUser(null);
    setIsAdmin(false);
    navigate("/login");
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  // Hide navbar on specific routes
  const hiddenRoutes = [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/oauth2/redirect",
  ];
  if (hiddenRoutes.includes(pathname)) return null;

  const getButtonStyles = (routePath) => ({
    my: 2,
    color: pathname === routePath ? "green" : "#637381",
    fontWeight: pathname === routePath ? "bold" : "normal",
    backgroundColor:
      pathname === routePath ? "rgba(0, 128, 0, 0.1)" : "transparent",
    "&:hover": {
      backgroundColor: "rgba(211, 211, 211, 0.2)",
      color: pathname === routePath ? "green" : "#637381",
    },
    transition: "all 0.2s ease",
    fontFamily: "B nazanin",
  });

  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#ffffff",
          boxShadow: "none",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Logo */}
            <Link
              to="/"
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div className="w-10 h-10 rounded-full border-2 border-darkgray flex items-center justify-center transition-all mr-6">
                <img
                  src="logo.png"
                  alt="Logo"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <Typography
                variant="h6"
                noWrap
                sx={{
                  mr: 2,
                  display: { xs: "none", md: "flex" },
                  fontFamily: "B nazanin",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "black",
                }}
              >
                ستره محکمه
              </Typography>
            </Link>

            {/* Mobile Menu */}
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                onClick={
                  headerToggle
                    ? () => setHeaderToggle(false)
                    : handleOpenNavMenu
                }
                color="black"
              >
                {headerToggle ? <RxCross2 /> : <MenuIcon />}
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{ display: { xs: "block", md: "none" } }}
              >
                {token &&
                  navigationItems.map((item) => (
                    <MenuItem
                      key={item.path}
                      component={Link}
                      to={item.path}
                      onClick={handleCloseNavMenu}
                    >
                      <Typography
                        textAlign="center"
                        sx={{ fontFamily: "B nazanin" }}
                      >
                        {item.label}
                      </Typography>
                    </MenuItem>
                  ))}
              </Menu>
            </Box>

            {/* Desktop Links - Dynamic based on management */}
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
                gap: 2,
                justifyContent: "end",
                mr: 2,
              }}
            >
              {token &&
                navigationItems.map((item) => (
                  <Button
                    key={item.path}
                    component={Link}
                    to={item.path}
                    sx={getButtonStyles(item.path)}
                  >
                    {item.label}
                  </Button>
                ))}
            </Box>

            {/* User Avatar */}
            <Box sx={{ flexGrow: 0 }}>
              {token ? (
                <>
                  <IconButton onClick={() => toggleSidebar(true)} sx={{ p: 0 }}>
                    <Avatar alt="User" src="bilal.jpg" />
                  </IconButton>

                  <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
                </>
              ) : (
                <Button
                  component={Link}
                  to="/signup"
                  sx={{
                    my: 2,
                    color: "black",
                    display: { xs: "none", md: "flex" },
                  }}
                >
                  Sign Up
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};

export default Navbar;
