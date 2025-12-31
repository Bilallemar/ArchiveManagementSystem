// import React, { useState, useEffect } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { useMyContext } from "../store/ContextApi";
// import {
//   AppBar,
//   Box,
//   Toolbar,
//   IconButton,
//   Typography,
//   Menu,
//   Container,
//   Avatar,
//   Button,
//   MenuItem,
// } from "@mui/material";
// import { useTheme } from "@mui/material/styles";
// import DarkModeIcon from "@mui/icons-material/DarkMode";
// import LightModeIcon from "@mui/icons-material/LightMode";
// import MenuIcon from "@mui/icons-material/Menu";
// import { RxCross2 } from "react-icons/rx";
// import Sidebar from "./Sidebar ";
// import {
//   getNavigationItems,
//   clearUserManagement,
// } from "../utils/managementUtils";
// import api from "../services/api";

// const Navbar = () => {
//   const [anchorElNav, setAnchorElNav] = useState(null);
//   const [headerToggle, setHeaderToggle] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [userProfile, setUserProfile] = useState(null);
//   const [imageError, setImageError] = useState(false);
//   const theme = useTheme();

//   const { pathname } = useLocation();
//   const navigate = useNavigate();
//   const {
//     token,
//     setToken,
//     currentUser,
//     setCurrentUser,
//     isAdmin,
//     setIsAdmin,
//     mode,
//     toggleTheme,
//   } = useMyContext();

//   const navigationItems = getNavigationItems();

//   // Fetch user profile on component mount
//   useEffect(() => {
//     if (token) {
//       fetchUserProfile();
//     }
//   }, [token]);

//   const fetchUserProfile = async () => {
//     try {
//       const response = await api.get("/auth/profile");
//       setUserProfile(response.data);
//       setImageError(false);
//     } catch (error) {
//       console.error("Error fetching user profile:", error);
//     }
//   };

//   const toggleSidebar = (state) => setSidebarOpen(state);

//   const handleLogout = () => {
//     localStorage.removeItem("JWT_TOKEN");
//     localStorage.removeItem("USER");
//     localStorage.removeItem("CSRF_TOKEN");
//     localStorage.removeItem("IS_ADMIN");
//     clearUserManagement();
//     setToken(null);
//     setCurrentUser(null);
//     setIsAdmin(false);
//     setUserProfile(null);
//     navigate("/login");
//   };

//   const handleOpenNavMenu = (event) => {
//     setAnchorElNav(event.currentTarget);
//   };

//   const handleCloseNavMenu = () => {
//     setAnchorElNav(null);
//   };

//   const hiddenRoutes = [
//     "/login",
//     "/signup",
//     "/forgot-password",
//     "/reset-password",
//     "/oauth2/redirect",
//   ];
//   if (hiddenRoutes.includes(pathname)) return null;

//   const getButtonStyles = (routePath) => ({
//     my: 2,
//     color:
//       pathname === routePath
//         ? theme.palette.success.main
//         : theme.palette.text.secondary,
//     fontWeight: pathname === routePath ? "bold" : "normal",
//     backgroundColor:
//       pathname === routePath
//         ? mode === "dark"
//           ? "rgba(102, 187, 106, 0.15)"
//           : "rgba(0, 128, 0, 0.1)"
//         : "transparent",
//     "&:hover": {
//       backgroundColor:
//         mode === "dark"
//           ? "rgba(255, 255, 255, 0.08)"
//           : "rgba(211, 211, 211, 0.2)",
//       color:
//         pathname === routePath
//           ? theme.palette.success.main
//           : theme.palette.text.secondary,
//     },
//     transition: "all 0.2s ease",
//   });

//   // Get profile image URL from backend with better error handling
//   const getProfileImageUrl = () => {
//     if (!userProfile?.profileImage || imageError) {
//       return null;
//     }

//     try {
//       const imagePath = userProfile.profileImage.startsWith("/")
//         ? userProfile.profileImage.substring(1)
//         : userProfile.profileImage;

//       // Construct URL, ensure API URL doesn't end with slash
//       const apiUrl = process.env.REACT_APP_API_URL?.replace(/\/$/, "");
//       return `${apiUrl}/${imagePath}`;
//     } catch (error) {
//       console.error("Error constructing profile image URL:", error);
//       return null;
//     }
//   };

//   const handleImageError = (e) => {
//     // Prevent infinite loop by checking if already errored
//     if (!imageError) {
//       setImageError(true);
//     }
//     // Prevent default broken image icon
//     e.target.style.display = "none";
//   };

//   // Get user avatar - priority: profileImage from backend > existing fallbacks
//   const getUserAvatar = () => {
//     const backendImage = getProfileImageUrl();
//     if (backendImage) {
//       return backendImage;
//     }

//     // Fallback to existing logic
//     if (currentUser?.profileImage) {
//       return currentUser.profileImage;
//     }
//     if (currentUser?.imageUrl) {
//       return currentUser.imageUrl;
//     }
//     if (currentUser?.avatar) {
//       return currentUser.avatar;
//     }
//     return null;
//   };

//   const userAvatar = getUserAvatar();
//   const userName =
//     userProfile?.userName ||
//     currentUser?.name ||
//     currentUser?.username ||
//     "User";
//   const userInitial = userName.charAt(0).toUpperCase();

//   return (
//     <>
//       <AppBar
//         position="static"
//         sx={{
//           backgroundColor: theme.palette.background.paper,
//           boxShadow:
//             mode === "dark"
//               ? "0px 2px 4px rgba(0, 0, 0, 0.5)"
//               : "0px 2px 4px rgba(0, 0, 0, 0.1)",
//         }}
//       >
//         <Container maxWidth="xl">
//           <Toolbar disableGutters>
//             {/* Logo - Fixed with error handling */}
//             <Link
//               to="/"
//               style={{
//                 textDecoration: "none",
//                 color: "inherit",
//                 display: "flex",
//                 alignItems: "center",
//               }}
//             >
//               <div
//                 className="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all mr-6"
//                 style={{
//                   borderColor: mode === "dark" ? "#ffffff" : "#4a5568",
//                 }}
//               >
//                 <img
//                   src={`${process.env.PUBLIC_URL}/logo.png`}
//                   alt="Logo"
//                   className="w-8 h-8 object-contain"
//                   onError={(e) => {
//                     // Fallback if logo doesn't exist
//                     e.target.style.display = "none";
//                   }}
//                 />
//               </div>
//               <Typography
//                 variant="h6"
//                 noWrap
//                 sx={{
//                   mr: 2,
//                   display: { xs: "none", md: "flex" },
//                   fontFamily: "B nazanin",
//                   fontWeight: 700,
//                   letterSpacing: ".3rem",
//                   color: theme.palette.text.primary,
//                 }}
//               >
//                 ستره محکمه
//               </Typography>
//             </Link>

//             {/* Theme Toggle */}
//             <IconButton
//               onClick={toggleTheme}
//               sx={{
//                 color: theme.palette.text.primary,
//                 "&:hover": {
//                   backgroundColor:
//                     mode === "dark"
//                       ? "rgba(255, 255, 255, 0.08)"
//                       : "rgba(0, 0, 0, 0.04)",
//                 },
//               }}
//             >
//               {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
//             </IconButton>

//             {/* Mobile Menu */}
//             <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
//               <IconButton
//                 size="large"
//                 onClick={
//                   headerToggle
//                     ? () => setHeaderToggle(false)
//                     : handleOpenNavMenu
//                 }
//                 sx={{ color: theme.palette.text.primary }}
//               >
//                 {headerToggle ? <RxCross2 /> : <MenuIcon />}
//               </IconButton>
//               <Menu
//                 id="menu-appbar"
//                 anchorEl={anchorElNav}
//                 anchorOrigin={{
//                   vertical: "bottom",
//                   horizontal: "left",
//                 }}
//                 keepMounted
//                 transformOrigin={{
//                   vertical: "top",
//                   horizontal: "left",
//                 }}
//                 open={Boolean(anchorElNav)}
//                 onClose={handleCloseNavMenu}
//                 sx={{
//                   display: { xs: "block", md: "none" },
//                   "& .MuiPaper-root": {
//                     backgroundColor: theme.palette.background.paper,
//                   },
//                 }}
//               >
//                 {token &&
//                   navigationItems.map((item) => (
//                     <MenuItem
//                       key={item.path}
//                       component={Link}
//                       to={item.path}
//                       onClick={handleCloseNavMenu}
//                       sx={{
//                         color: theme.palette.text.primary,
//                         "&:hover": {
//                           backgroundColor: theme.palette.action.hover,
//                         },
//                       }}
//                     >
//                       <Typography textAlign="center">{item.label}</Typography>
//                     </MenuItem>
//                   ))}
//               </Menu>
//             </Box>

//             {/* Desktop Links */}
//             <Box
//               sx={{
//                 flexGrow: 1,
//                 display: { xs: "none", md: "flex" },
//                 gap: 2,
//                 justifyContent: "end",
//                 mr: 2,
//               }}
//             >
//               {token &&
//                 navigationItems.map((item) => (
//                   <Button
//                     key={item.path}
//                     component={Link}
//                     to={item.path}
//                     sx={getButtonStyles(item.path)}
//                   >
//                     {item.label}
//                   </Button>
//                 ))}
//             </Box>

//             {/* User Avatar - Fixed with better error handling */}
//             <Box sx={{ flexGrow: 0 }}>
//               {token ? (
//                 <>
//                   <IconButton onClick={() => toggleSidebar(true)} sx={{ p: 0 }}>
//                     <Avatar
//                       alt={userName}
//                       src={userAvatar || undefined}
//                       imgProps={{
//                         onError: handleImageError,
//                       }}
//                       sx={{
//                         bgcolor: !userAvatar
//                           ? theme.palette.primary.main
//                           : undefined,
//                         color: !userAvatar ? "white" : undefined,
//                       }}
//                     >
//                       {!userAvatar && userInitial}
//                     </Avatar>
//                   </IconButton>
//                   <Sidebar
//                     open={sidebarOpen}
//                     toggleSidebar={toggleSidebar}
//                     userProfile={userProfile}
//                     onLogout={handleLogout}
//                   />
//                 </>
//               ) : (
//                 <Button
//                   component={Link}
//                   to="/signup"
//                   sx={{
//                     my: 2,
//                     color: theme.palette.text.primary,
//                     display: { xs: "none", md: "flex" },
//                   }}
//                 >
//                   Sign Up
//                 </Button>
//               )}
//             </Box>
//           </Toolbar>
//         </Container>
//       </AppBar>
//     </>
//   );
// };

// export default Navbar;
import React, { useState, useEffect } from "react";
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
import { useTheme } from "@mui/material/styles";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import MenuIcon from "@mui/icons-material/Menu";
import { RxCross2 } from "react-icons/rx";
import Sidebar from "./Sidebar ";
import {
  getNavigationItems,
  clearUserManagement,
} from "../utils/managementUtils";
import api from "../services/api";

const Navbar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [headerToggle, setHeaderToggle] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [imageError, setImageError] = useState(false);
  const theme = useTheme();

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const {
    token,
    setToken,
    currentUser,
    setCurrentUser,
    isAdmin,
    setIsAdmin,
    mode,
    toggleTheme,
  } = useMyContext();

  const navigationItems = getNavigationItems();

  // Fetch user profile on component mount
  useEffect(() => {
    if (token) {
      fetchUserProfile();
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get("/auth/profile");
      setUserProfile(response.data);
      setImageError(false);
      console.log("👤 User Profile Fetched:", response.data);
      console.log("🖼️ Profile Image Path:", response.data.profileImage);
    } catch (error) {
      console.error("❌ Error fetching user profile:", error);
    }
  };

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
    setUserProfile(null);
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

  const handleImageError = (e) => {
    console.error("❌ Image failed to load:", e.target?.src);
    if (!imageError) {
      setImageError(true);
    }
  };

  // Construct profile image URL
  const getProfileImageUrl = () => {
    if (!userProfile?.profileImage || imageError) {
      console.log("⚠️ No profile image available or error occurred");
      return null;
    }

    // Get API URL from environment or use default
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8081";

    // profileImage is like: "/uploads/profile-images/user_2.jpg"
    // We need to remove the leading slash
    const imagePath = userProfile.profileImage.startsWith("/")
      ? userProfile.profileImage.substring(1)
      : userProfile.profileImage;

    const fullUrl = `${apiUrl}/${imagePath}`;

    console.log("🌐 API URL:", apiUrl);
    console.log("📁 Image Path:", imagePath);
    console.log("🖼️ Full Image URL:", fullUrl);

    return fullUrl;
  };

  // Get user avatar with fallbacks
  const userAvatar = getProfileImageUrl();

  const userName =
    userProfile?.userName ||
    currentUser?.name ||
    currentUser?.username ||
    "User";
  const userInitial = userName.charAt(0).toUpperCase();

  console.log("🎯 Final Avatar URL:", userAvatar);
  console.log("👤 User Name:", userName);
  console.log("🔤 User Initial:", userInitial);

  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: theme.palette.background.paper,
          boxShadow:
            mode === "dark"
              ? "0px 2px 4px rgba(0, 0, 0, 0.5)"
              : "0px 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Link
              to="/"
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                className="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all mr-6"
                style={{
                  borderColor: mode === "dark" ? "#ffffff" : "#4a5568",
                }}
              >
                <img
                  src={`${process.env.PUBLIC_URL}/logo.png`}
                  alt="Logo"
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
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
                  color: theme.palette.text.primary,
                }}
              >
                ستره محکمه
              </Typography>
            </Link>

            <IconButton
              onClick={toggleTheme}
              sx={{
                color: theme.palette.text.primary,
                "&:hover": {
                  backgroundColor:
                    mode === "dark"
                      ? "rgba(255, 255, 255, 0.08)"
                      : "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                onClick={
                  headerToggle
                    ? () => setHeaderToggle(false)
                    : handleOpenNavMenu
                }
                sx={{ color: theme.palette.text.primary }}
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
                sx={{
                  display: { xs: "block", md: "none" },
                  "& .MuiPaper-root": {
                    backgroundColor: theme.palette.background.paper,
                  },
                }}
              >
                {token &&
                  navigationItems.map((item) => (
                    <MenuItem
                      key={item.path}
                      component={Link}
                      to={item.path}
                      onClick={handleCloseNavMenu}
                      sx={{
                        color: theme.palette.text.primary,
                        "&:hover": {
                          backgroundColor: theme.palette.action.hover,
                        },
                      }}
                    >
                      <Typography textAlign="center">{item.label}</Typography>
                    </MenuItem>
                  ))}
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

            <Box sx={{ flexGrow: 0 }}>
              {token ? (
                <>
                  <IconButton onClick={() => toggleSidebar(true)} sx={{ p: 0 }}>
                    <Avatar
                      alt={userName}
                      src={userAvatar}
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
    </>
  );
};

export default Navbar;
