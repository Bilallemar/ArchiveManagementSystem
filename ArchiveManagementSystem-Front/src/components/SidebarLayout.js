import React, { useState } from "react";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Collapse,
  Badge,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard,
  ExpandLess,
  ExpandMore,
  Notifications,
  Settings,
  DarkMode,
  LightMode,
  Logout,
  Person,
  Archive,
  Description,
  FolderSpecial,
  Folder,
  AdminPanelSettings,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useMyContext } from "../store/ContextApi";
import {
  getNavigationItems,
  clearUserManagement,
} from "../utils/managementUtils";

const drawerWidth = 280;

// Group navigation items by management
const groupNavItems = (items, isAdmin) => {
  const grouped = {
    dashboard: [],
    archive: [],
    hifziya: [],
    makzan: [],
  };

  items.forEach((item) => {
    if (item.path === "/") {
      grouped.dashboard.push(item);
    } else if (item.path.includes("archive")) {
      grouped.archive.push(item);
    } else if (item.path.includes("sawanih") || item.path.includes("hifziya")) {
      grouped.hifziya.push(item);
    } else if (
      item.path.includes("makzan") ||
      item.path.includes("annual-reports")
    ) {
      grouped.makzan.push(item);
    }
    // Exclude admin routes from main sidebar
  });

  const result = [
    {
      group: "dashboard",
      label: "ډشبورډ",
      items: grouped.dashboard,
      icon: <Dashboard />,
      color: "#00B8D9",
    },
  ];

  if (grouped.archive.length > 0) {
    result.push({
      group: "archive",
      label: "آرشیف مدیریت",
      items: grouped.archive,
      icon: <Archive />,
      color: "#8B5CF6",
    });
  }

  if (grouped.hifziya.length > 0) {
    result.push({
      group: "hifziya",
      label: "حفظیه مدیریت",
      items: grouped.hifziya,
      icon: <FolderSpecial />,
      color: "#FFAB00",
    });
  }

  if (grouped.makzan.length > 0) {
    result.push({
      group: "makzan",
      label: "مخزن مدیریت",
      items: grouped.makzan,
      icon: <Folder />,
      color: "#FF5630",
    });
  }

  return result;
};

export default function SidebarLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const {
    currentUser,
    isAdmin,
    setToken,
    setCurrentUser,
    setIsAdmin,
    mode,
    toggleTheme,
  } = useMyContext();

  const navigationItems = getNavigationItems();
  const groupedNav = groupNavItems(navigationItems, isAdmin);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (group) => {
    setOpenMenus((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    clearUserManagement();
    setToken(null);
    setCurrentUser(null);
    setIsAdmin(false);
    navigate("/login");
  };

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Logo */}
      <Box
        sx={{
          p: 2.5,
          display: "flex",
          alignItems: "center",
          gap: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          onClick={() => navigate("/")}
          sx={{
            width: 40,
            height: 40,
            borderRadius: "12px",
            bgcolor: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.5rem",
            cursor: "pointer",
            "&:hover": {
              opacity: 0.85,
            },
          }}
        >
          ⚖️
        </Box>

        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            ستره محکمه
          </Typography>
          <Typography variant="caption" color="text.secondary">
            د افغانستان اسلامي امارت
          </Typography>
        </Box>
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, overflowY: "auto", py: 2 }}>
        <List sx={{ px: 1 }}>
          {groupedNav.map((group) => (
            <React.Fragment key={group.group}>
              {/* Dashboard - Single Item */}
              {group.items.length === 1 && group.group === "dashboard" ? (
                <ListItem disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    onClick={() => navigate(group.items[0].path)}
                    selected={pathname === group.items[0].path}
                    sx={{
                      borderRadius: 2,
                      mx: 1,
                      "&.Mui-selected": {
                        bgcolor: `${group.color}15`,
                        color: group.color,
                        "& .MuiListItemIcon-root": {
                          color: group.color,
                        },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {group.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={group.label}
                      primaryTypographyProps={{
                        fontSize: "0.9rem",
                        fontWeight:
                          pathname === group.items[0].path ? 600 : 500,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ) : (
                <>
                  {/* Management Groups - Collapsible */}
                  <ListItem disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      onClick={() => handleMenuClick(group.group)}
                      sx={{
                        borderRadius: 2,
                        mx: 1,
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40, color: group.color }}>
                        {group.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={group.label}
                        primaryTypographyProps={{
                          fontSize: "0.9rem",
                          fontWeight: 500,
                        }}
                      />
                      {openMenus[group.group] ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                  </ListItem>

                  <Collapse
                    in={openMenus[group.group]}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      {group.items.map((item) => (
                        <ListItem key={item.path} disablePadding>
                          <ListItemButton
                            onClick={() => {
                              navigate(item.path);
                              if (isMobile) setMobileOpen(false);
                            }}
                            selected={pathname === item.path}
                            sx={{
                              pl: 7,
                              py: 1,
                              borderRadius: 2,
                              mx: 1,
                              "&.Mui-selected": {
                                bgcolor: "action.selected",
                              },
                            }}
                          >
                            <ListItemText
                              primary={item.label}
                              primaryTypographyProps={{
                                fontSize: "0.85rem",
                                fontWeight: pathname === item.path ? 600 : 400,
                              }}
                            />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                </>
              )}
            </React.Fragment>
          ))}
        </List>
      </Box>

      {/* User Section */}
      <Box sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            p: 1.5,
            borderRadius: 2,
            bgcolor: "action.hover",
            cursor: "pointer",
            "&:hover": { bgcolor: "action.selected" },
          }}
          onClick={handleProfileMenuOpen}
        >
          <Avatar sx={{ width: 36, height: 36 }} src="bilal.jpg" />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, fontSize: "0.875rem" }}
            >
              {currentUser?.name || "کاروونکی"}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {currentUser?.email}
            </Typography>
          </Box>
          <Settings fontSize="small" color="action" />
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: "background.paper",
          color: "text.primary",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {pathname === "/"
              ? "ډشبورډ"
              : navigationItems.find((i) => i.path === pathname)?.label || ""}
          </Typography>

          <IconButton onClick={toggleTheme} sx={{ mr: 1 }}>
            {mode === "dark" ? <LightMode /> : <DarkMode />}
          </IconButton>

          <IconButton sx={{ mr: 1 }}>
            <Badge badgeContent={4} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          <IconButton onClick={handleProfileMenuOpen}>
            <Avatar sx={{ width: 32, height: 32 }} src="bilal.jpg" />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
      >
        <MenuItem
          onClick={() => {
            navigate("/profile");
            handleProfileMenuClose();
          }}
        >
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          پروفایل
        </MenuItem>
        <MenuItem onClick={handleProfileMenuClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          تنظیمات
        </MenuItem>

        {/* Admin Menu Items - Only for Admin */}
        {isAdmin && (
          <>
            <Divider />
            <MenuItem
              onClick={() => {
                navigate("/admin/users");
                handleProfileMenuClose();
              }}
            >
              <ListItemIcon>
                <AdminPanelSettings fontSize="small" />
              </ListItemIcon>
              کاروونکي
            </MenuItem>
            <MenuItem
              onClick={() => {
                navigate("/admin/audit-logs");
                handleProfileMenuClose();
              }}
            >
              <ListItemIcon>
                <AdminPanelSettings fontSize="small" />
              </ListItemIcon>
              تفتیشي ثبتونه
            </MenuItem>
            <MenuItem
              onClick={() => {
                navigate("/admin/user-management");
                handleProfileMenuClose();
              }}
            >
              <ListItemIcon>
                <AdminPanelSettings fontSize="small" />
              </ListItemIcon>
              کاروونکو مدیریت
            </MenuItem>
          </>
        )}

        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          وتل
        </MenuItem>
      </Menu>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              bgcolor: "background.paper",
            },
          }}
        >
          {drawer}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              bgcolor: "background.paper",
              borderRight: "1px solid",
              borderColor: "divider",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
