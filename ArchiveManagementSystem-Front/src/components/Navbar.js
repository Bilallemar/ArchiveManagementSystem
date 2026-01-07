import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Container,
  Avatar,
  Button,
  FormControl,
  Select,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import MenuIcon from "@mui/icons-material/Menu";
import { RxCross2 } from "react-icons/rx";
import { useTranslation } from "react-i18next";

import Sidebar from "./Sidebar";
import api from "../services/api";
import { useMyContext } from "../store/ContextApi";
import {
  getNavigationItems,
  clearUserManagement,
} from "../utils/managementUtils";
import api from "../services/api";
import { getNavbarTexts } from "../utils/navbarTexts";

const Navbar = () => {
  const { t, i18n } = useTranslation("navbar");
  const texts = getNavbarTexts(t); // centralized texts helper

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [imageError, setImageError] = useState(false);

  const theme = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const {
    token,
    setToken,
    setCurrentUser,
    setIsAdmin,
    currentUser,
    mode,
    toggleTheme,
  } = useMyContext();

  const navigationItems = getNavigationItems();

  // Fetch user profile on component mountto
  // Set saved language
  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "ps";
    i18n.changeLanguage(savedLang);
  }, [i18n]);

  // Fetch user profile if token exists
  useEffect(() => {
    if (token) fetchUserProfile();
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const res = await api.get("/auth/profile");
      setUserProfile(res.data);
      setImageError(false);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
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
    color:
      pathname === routePath
        ? theme.palette.success.main
        : theme.palette.text.secondary,
    fontWeight: pathname === routePath ? "bold" : "normal",
    backgroundColor:
      pathname === routePath
        ? mode === "dark"
          ? "rgba(102, 187, 106, 0.15)"
          : "rgba(0, 128, 0, 0.1)"
        : "transparent",
    "&:hover": {
      backgroundColor:
        mode === "dark"
          ? "rgba(255, 255, 255, 0.08)"
          : "rgba(211, 211, 211, 0.2)",
      color:
        pathname === routePath
          ? theme.palette.success.main
          : theme.palette.text.secondary,
    },
    transition: "all 0.2s ease",
  });

  // Get profile image URL from backend with better error handling
  const getProfileImageUrl = () => {
    if (!userProfile?.profileImage || imageError) {
      return null;
    }

    try {
      const imagePath = userProfile.profileImage.startsWith("/")
        ? userProfile.profileImage.substring(1)
        : userProfile.profileImage;

      // Construct URL, ensure API URL doesn't end with slash
      const apiUrl = process.env.REACT_APP_API_URL?.replace(/\/$/, "");
      return `${apiUrl}/${imagePath}`;
    } catch (error) {
      console.error("Error constructing profile image URL:", error);
      return null;
    }
  };

  const handleImageError = (e) => {
    // Prevent infinite loop by checking if already errored
    if (!imageError) {
      setImageError(true);
    }
    // Prevent default broken image icon
    e.target.style.display = "none";
  };
  const userAvatar =
    getProfileImageUrl() ||
    currentUser?.profileImage ||
    currentUser?.avatar ||
    null;

  const userName = userProfile?.userName || currentUser?.username || texts.user;
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <AppBar position="static" sx={{ bgcolor: theme.palette.background.paper }}>
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Logo */}
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            <img src="logo.png" alt="logo" width={36} />
            <Typography sx={{ ml: 1, fontWeight: 700 }}>
              {texts.appName}
            </Typography>
          </Link>

          {/* Desktop Actions */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton onClick={toggleTheme}>
              {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>

            {token ? (
              <IconButton onClick={() => setSidebarOpen(true)}>
                <Avatar src={userAvatar}>{!userAvatar && userInitial}</Avatar>
              </IconButton>
            ) : (
              <Button component={Link} to="/signup">
                {texts.signup}
              </Button>
            )}
          </Box>

          {/* Mobile Menu */}
          <IconButton
            size="large"
            onClick={(e) => setAnchorElNav(e.currentTarget)}
            sx={{ display: { xs: "flex", md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorElNav}
            open={Boolean(anchorElNav)}
            onClose={() => setAnchorElNav(null)}
          >
            {navigationItems.map((item) => (
              <MenuItem key={item.path} component={Link} to={item.path}>
                {texts[item.labelKey]}
              </MenuItem>
            ))}
            {token && (
              <MenuItem onClick={handleLogout}>{texts.logout}</MenuItem>
            )}
          </Menu>

          {/* Language Switcher */}
          <FormControl size="small" sx={{ ml: 2 }}>
            <Select
              value={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
            >
              <MenuItem value="ps">پښتو</MenuItem>
              <MenuItem value="fa">دری</MenuItem>
              <MenuItem value="en">English</MenuItem>
            </Select>
          </FormControl>

          {/* User Avatar - Fixed with better error handling */}
          <Box sx={{ flexGrow: 0 }}>
            {token ? (
              <>
                <IconButton onClick={() => toggleSidebar(true)} sx={{ p: 0 }}>
                  <Avatar
                    alt={userName}
                    src={userAvatar || undefined}
                    imgProps={{
                      onError: handleImageError,
                    }}
                    sx={{
                      bgcolor: !userAvatar
                        ? theme.palette.primary.main
                        : undefined,
                      color: !userAvatar ? "white" : undefined,
                    }}
                  >
                    {!userAvatar && userInitial}
                  </Avatar>
                </IconButton>
                <Sidebar
                  open={sidebarOpen}
                  toggleSidebar={toggleSidebar}
                  userProfile={userProfile}
                  onLogout={handleLogout}
                />
              </>
            ) : (
              <Button
                component={Link}
                to="/signup"
                sx={{
                  my: 2,
                  color: theme.palette.text.primary,
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
