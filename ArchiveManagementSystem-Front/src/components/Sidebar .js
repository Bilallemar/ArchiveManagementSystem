import React, { useState } from "react";
import {
  Drawer,
  Box,
  Avatar,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  Logout as LogoutIcon,
  AccountCircle,
  AdminPanelSettings,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useMyContext } from "../store/ContextApi";

const Sidebar = ({ open, toggleSidebar }) => {
  const navigate = useNavigate();
  const { currentUser, isAdmin, setToken, setCurrentUser, setIsAdmin } =
    useMyContext();

  const [adminOpen, setAdminOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setCurrentUser(null);
    setIsAdmin(false);
    toggleSidebar && toggleSidebar(false);
    navigate("/login");
  };

  const handleAdminToggle = () => {
    setAdminOpen(!adminOpen);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => toggleSidebar(false)} // ✅ دا د بندېدو لپاره مهم ده
      sx={{
        "& .MuiDrawer-paper": {
          width: 260,
          boxSizing: "border-box",
          direction: "rtl",
          bgcolor: "#fff",
          color: "#000",
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* پورته برخه */}
        <Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Avatar src="bilal.jpg" sx={{ width: 64, height: 64, mb: 1 }} />
            <Typography variant="h6">
              {currentUser?.name || "کاروونکی"}
            </Typography>
            <Typography variant="body2">{currentUser?.email}</Typography>
          </Box>

          <Divider />

          <List sx={{ mt: 2 }}>
            {/* پروفایل */}
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate("/profile");
                  toggleSidebar(false);
                }}
                sx={{ justifyContent: "flex-end", gap: 1 }}
              >
                <AccountCircle sx={{ color: "#9aa0ac" }} />
                <ListItemText
                  primary="پروفایل"
                  primaryTypographyProps={{
                    textAlign: "right",
                    fontWeight: "bold",
                    color: "#9aa0ac",
                  }}
                />
              </ListItemButton>
            </ListItem>

            {/* ادمن برخه */}
            {isAdmin && (
              <>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={handleAdminToggle}
                    sx={{ justifyContent: "flex-end", gap: 1 }}
                  >
                    <AdminPanelSettings sx={{ color: "#9aa0ac" }} />
                    <ListItemText
                      primary="ادمن برخې"
                      primaryTypographyProps={{
                        textAlign: "right",
                        fontWeight: "bold",
                        color: "#9aa0ac",
                      }}
                    />
                    {adminOpen ? (
                      <ExpandLess sx={{ color: "#9aa0ac" }} />
                    ) : (
                      <ExpandMore sx={{ color: "#9aa0ac" }} />
                    )}
                  </ListItemButton>
                </ListItem>

                {/* ✅ فرعي مینوګان */}
                <Collapse in={adminOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding sx={{ pr: 3 }}>
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={() => {
                          navigate("/admin/users");
                          toggleSidebar(false);
                        }}
                        sx={{
                          justifyContent: "flex-end",
                          "&:hover": { bgcolor: "#f5f5f5" },
                        }}
                      >
                        <ListItemText
                          primary="د کاروونکو لېست"
                          primaryTypographyProps={{
                            textAlign: "right",
                            color: "#9aa0ac",
                          }}
                        />
                      </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={() => {
                          navigate("/admin/audit-logs");
                          toggleSidebar(false);
                        }}
                        sx={{
                          justifyContent: "flex-end",
                          "&:hover": { bgcolor: "#f5f5f5" },
                        }}
                      >
                        <ListItemText
                          primary=" تفتیشي ثبتونه"
                          primaryTypographyProps={{
                            textAlign: "right",
                            color: "#9aa0ac",
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  </List>
                </Collapse>
              </>
            )}
          </List>
        </Box>

        {/* ښکته برخه */}
        <Box>
          <Divider sx={{ mb: 2 }} />
          <Button
            variant="contained"
            fullWidth
            onClick={handleLogout}
            sx={{
              bgcolor: "#ecccc4",
              color: "#ed5a57",
              fontWeight: "bold",
              borderRadius: 2,
              justifyContent: "center",
              gap: 1.5, // ✅ د آیکن او ټکس ترمنځ فاصله
              "&:hover": { bgcolor: "#e0bdb4" },
            }}
            startIcon={<LogoutIcon sx={{ color: "#ed5a57" }} />}
          >
            وتل
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
