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

const Navbar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [headerToggle, setHeaderToggle] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { token, setToken, setCurrentUser, isAdmin, setIsAdmin } =
    useMyContext();

  const handleLogout = () => {
    localStorage.removeItem("JWT_TOKEN");
    localStorage.removeItem("USER");
    localStorage.removeItem("CSRF_TOKEN");
    localStorage.removeItem("IS_ADMIN");
    setToken(null);
    setCurrentUser(null);
    setIsAdmin(false);
    navigate("/login");
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // Hide navbar on login/signup
  const hiddenRoutes = ["/login", "/signup"];
  if (hiddenRoutes.includes(pathname)) return null;

  // Common button styles
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
  });

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#ffffff",
        boxShadow: "none",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Desktop Logo */}
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
                headerToggle ? () => setHeaderToggle(false) : handleOpenNavMenu
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
              {token && (
                <MenuItem
                  component={Link}
                  to="/receipts"
                  onClick={handleCloseNavMenu}
                  sx={{
                    backgroundColor:
                      pathname === "/receipts"
                        ? "rgba(0, 128, 0, 0.1)"
                        : "transparent",
                    color: pathname === "/receipts" ? "green" : "inherit",
                    fontWeight: pathname === "/receipts" ? "bold" : "normal",
                  }}
                >
                  <Typography
                    textAlign="center"
                    sx={{ color: "inherit", fontFamily: "B nazanin" }}
                  >
                    رسیدات
                  </Typography>
                </MenuItem>
              )}
            </Menu>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              gap: 2,
              justifyContent: "end",
              mr: 2,
            }}
          >
            {token && (
              <Button
                component={Link}
                to="/report"
                sx={getButtonStyles("/report")}
              >
                ګزارش راپورسال تمام
              </Button>
            )}
            {token && (
              <Button
                component={Link}
                to="/annual-report"
                sx={getButtonStyles("/annual-report")}
              >
                رپور سال تمام
              </Button>
            )}

            {token && (
              <Button
                component={Link}
                to="/received-issued-books"
                sx={getButtonStyles("/received-issued-books")}
              >
                کتاب وارده وصادره
              </Button>
            )}
            {token && (
              <Button
                component={Link}
                to="/receipts"
                sx={getButtonStyles("/receipts")}
              >
                رسیدات
              </Button>
            )}
          </Box>

          {/* User Menu - Combined Profile/Admin/Logout */}
          <Box sx={{ flexGrow: 0 }}>
            {token ? (
              <>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="User" src="bilal.jpg" />
                </IconButton>
                <Menu
                  sx={{ mt: "45px" }}
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem
                    component={Link}
                    to="/profile"
                    onClick={handleCloseUserMenu}
                    sx={{
                      backgroundColor:
                        pathname === "/profile"
                          ? "rgba(0, 128, 0, 0.1)"
                          : "transparent",
                      color: pathname === "/profile" ? "green" : "inherit",
                      fontWeight: pathname === "/profile" ? "bold" : "normal",
                    }}
                  >
                    <Typography textAlign="center">Profile</Typography>
                  </MenuItem>
                  {isAdmin && (
                    <MenuItem
                      component={Link}
                      to="/admin/users"
                      onClick={handleCloseUserMenu}
                      sx={{
                        backgroundColor:
                          pathname === "/admin/users"
                            ? "rgba(0, 128, 0, 0.1)"
                            : "transparent",
                        color:
                          pathname === "/admin/users" ? "green" : "inherit",
                        fontWeight:
                          pathname === "/admin/users" ? "bold" : "normal",
                      }}
                    >
                      <Typography textAlign="center">Admin</Typography>
                    </MenuItem>
                  )}
                  <MenuItem
                    onClick={() => {
                      handleCloseUserMenu();
                      handleLogout();
                    }}
                  >
                    <Typography textAlign="center" color="error">
                      Logout
                    </Typography>
                  </MenuItem>
                </Menu>
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
  );
};

export default Navbar;
