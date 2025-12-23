import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import { useMyContext } from "../../store/ContextApi";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Alert,
  Divider,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { setUserManagement } from "../../utils/managementUtils";
import { useTheme } from "@mui/material/styles";

const Login = () => {
  const [step, setStep] = useState(1);
  const [jwtToken, setJwtToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();

  const { setToken, token, setIsAdmin, setCurrentUser, mode } = useMyContext();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
      code: "",
    },
    mode: "onTouched",
  });

  const handleSuccessfulLogin = async (responseData) => {
    try {
      const { jwtToken, username, roles, management, isAdmin } = responseData;

      localStorage.setItem("JWT_TOKEN", jwtToken);

      const user = { username: username, roles: roles || [] };
      localStorage.setItem("USER", JSON.stringify(user));

      const adminStatus = isAdmin || false;
      localStorage.setItem("IS_ADMIN", adminStatus.toString());

      if (management) {
        setUserManagement(management);
      } else {
        try {
          const managementResponse = await api.get(
            "/user-management/my-management"
          );
          if (managementResponse.data) {
            setUserManagement(managementResponse.data);
          }
        } catch (error) {
          localStorage.removeItem("USER_MANAGEMENT");
          if (!adminStatus) {
            toast.error(
              "تاسو ته څانګه تعین شوې نه ده. د اډمین سره اړیکه ونیسئ"
            );
          }
        }
      }

      setToken(jwtToken);
      setCurrentUser(user);
      setIsAdmin(adminStatus);

      toast.success(
        management
          ? `ښه راغلاست! ${management.managementName} ته`
          : "ښه راغلاست!"
      );
      navigate("/");
    } catch (error) {
      console.error("Error in handleSuccessfulLogin:", error);
      toast.error("د لاګین په بهیر کې ستونزه رامنځته شوه");
    }
  };

  const onLoginHandler = async (data) => {
    try {
      setLoading(true);
      const response = await api.post("/auth/public/signin", data);

      if (response.status === 200 && response.data.jwtToken) {
        const decodedToken = jwtDecode(response.data.jwtToken);

        if (decodedToken.is2faEnabled) {
          setJwtToken(response.data.jwtToken);
          toast.success("Please verify 2FA code.");
          setStep(2);
        } else {
          handleSuccessfulLogin(response.data);
        }
        reset();
      }
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error("You are not assigned to any management. Contact admin.");
      } else {
        toast.error("Invalid credentials");
      }
    } finally {
      setLoading(false);
    }
  };

  const onVerify2FaHandler = async (data) => {
    setLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append("code", data.code);
      formData.append("jwtToken", jwtToken);

      await api.post("/auth/public/verify-2fa-login", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const decodedToken = jwtDecode(jwtToken);
      handleSuccessfulLogin(jwtToken, decodedToken);
    } catch (error) {
      toast.error("Invalid 2FA code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) navigate("/");
  }, [navigate, token]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        bgcolor: theme.palette.background.default,
      }}
    >
      {/* Left Side - Welcome Section */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "space-between",
          p: 6,
          bgcolor: mode === "dark" ? "#1a1a1a" : "#fff",
        }}
      >
        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              bgcolor: theme.palette.background.main,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img src="logo.png" alt="Logo" style={{ width: 40, height: 40 }} />
          </Box>
        </Box>

        {/* Welcome Text */}
        <Box sx={{ maxWidth: 480 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: theme.palette.text.primary,
            }}
          >
            Hi, Welcome back
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: theme.palette.text.secondary }}
          >
            More effectively with optimized workflows.
          </Typography>
        </Box>

        {/* Illustration */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src="login1.jpg"
            alt="Login Illustration"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </Box>
      </Box>

      {/* Right Side - Login Form */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 480,
            p: 5,
            bgcolor: "transparent",
          }}
        >
          {step === 1 ? (
            <Box component="form" onSubmit={handleSubmit(onLoginHandler)}>
              {/* Header */}
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  color: theme.palette.text.primary,
                }}
              >
                Sign in to your account
              </Typography>

              <Typography
                variant="body2"
                sx={{ mb: 3, color: theme.palette.text.secondary }}
              >
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  style={{
                    color: theme.palette.success.main,
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  Get started
                </Link>
              </Typography>

              {/* Demo Info Alert */}
              <Alert
                severity="info"
                sx={{
                  mb: 3,
                  bgcolor:
                    mode === "dark" ? "rgba(0, 184, 217, 0.1)" : "#E3F2FD",
                  color: theme.palette.text.primary,
                  "& .MuiAlert-icon": {
                    color: theme.palette.info.main,
                  },
                }}
              >
                Use <strong>admin</strong> with password{" "}
                <strong>adminPass</strong>
              </Alert>

              {/* Username Field */}
              <TextField
                {...register("username", { required: "Username is required" })}
                fullWidth
                label="Username"
                placeholder="Enter your username"
                error={Boolean(errors.username)}
                helperText={errors.username?.message}
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    bgcolor: mode === "dark" ? "#2e2e2e" : "#fff",
                  },
                }}
              />

              {/* Password Field */}
              <Box sx={{ position: "relative" }}>
                <TextField
                  {...register("password", {
                    required: "Password is required",
                  })}
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  error={Boolean(errors.password)}
                  helperText={errors.password?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      bgcolor: mode === "dark" ? "#2e2e2e" : "#fff",
                    },
                  }}
                />

                {/* Forgot Password */}
                <Box sx={{ textAlign: "right", mb: 3 }}>
                  <Link
                    to="/forgot-password"
                    style={{
                      color: theme.palette.text.secondary,
                      textDecoration: "none",
                      fontSize: "0.875rem",
                    }}
                  >
                    Forgot password?
                  </Link>
                </Box>
              </Box>

              {/* Sign In Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  py: 1.5,
                  bgcolor: mode === "dark" ? "#fff" : "#212B36",
                  color: mode === "dark" ? "#000" : "#fff",
                  fontWeight: 600,
                  fontSize: "0.9375rem",
                  textTransform: "none",
                  boxShadow: "none",
                  "&:hover": {
                    bgcolor: mode === "dark" ? "#f5f5f5" : "#1a2027",
                    boxShadow: "none",
                  },
                  "&:disabled": {
                    bgcolor: theme.palette.action.disabledBackground,
                  },
                }}
              >
                {loading ? "Loading..." : "Sign in"}
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit(onVerify2FaHandler)}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  color: theme.palette.text.primary,
                }}
              >
                Verify 2FA
              </Typography>

              <Typography
                variant="body2"
                sx={{ mb: 3, color: theme.palette.text.secondary }}
              >
                Enter the correct code to complete 2FA Authentication
              </Typography>

              <Divider sx={{ mb: 3 }} />

              <TextField
                {...register("code", { required: "Code is required" })}
                fullWidth
                label="Enter Code"
                placeholder="Enter your 2FA code"
                error={Boolean(errors.code)}
                helperText={errors.code?.message}
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    bgcolor: mode === "dark" ? "#2e2e2e" : "#fff",
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  py: 1.5,
                  bgcolor: "#d32f2f",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "0.9375rem",
                  textTransform: "none",
                  boxShadow: "none",
                  "&:hover": {
                    bgcolor: "#b71c1c",
                    boxShadow: "none",
                  },
                }}
              >
                {loading ? "Loading..." : "Verify 2FA"}
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default Login;
