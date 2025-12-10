import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { jwtDecode } from "jwt-decode";
import InputField from "../InputField/InputField";

import Divider from "@mui/material/Divider";
import Buttons from "../../utils/Buttons";
import toast from "react-hot-toast";
import { useMyContext } from "../../store/ContextApi";
import { useEffect } from "react";
import TextField from "@mui/material/TextField";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { AccountCircle } from "@mui/icons-material";
import { setUserManagement } from "../../utils/managementUtils";

// ✅ Make sure you destructure setIsAdmin and setCurrentUser here

const Login = () => {
  // Step 1: Login method and Step 2: Verify 2FA
  const [step, setStep] = useState(1);
  const [jwtToken, setJwtToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingResponseData, setPendingResponseData] = useState(null);

  // Access the token and setToken function using the useMyContext hook from the ContextProvider
  const { setToken, token, setIsAdmin, setCurrentUser } = useMyContext();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };
  //react hook form initialization
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

      // Store JWT token
      localStorage.setItem("JWT_TOKEN", jwtToken);

      // Store user info
      const user = {
        username: username,
        roles: roles || [],
      };
      localStorage.setItem("USER", JSON.stringify(user));

      // Store admin status
      const adminStatus = isAdmin || false;
      localStorage.setItem("IS_ADMIN", adminStatus.toString());

      // Store management info if provided by backend
      if (management) {
        setUserManagement(management);
        console.log("✅ Management stored:", management);
      } else {
        // If backend doesn't send management, try to fetch it
        try {
          const managementResponse = await api.get(
            "/user-management/my-management"
          );
          if (managementResponse.data) {
            setUserManagement(managementResponse.data);
            console.log(
              "✅ Management fetched and stored:",
              managementResponse.data
            );
          }
        } catch (error) {
          console.log("⚠️ No management assigned to user");
          localStorage.removeItem("USER_MANAGEMENT");

          // If user is not admin and has no management, show warning
          if (!adminStatus) {
            toast.error(
              "تاسو ته څانګه تعین شوې نه ده. د اډمین سره اړیکه ونیسئ"
            );
          }
        }
      }

      // Update context
      setToken(jwtToken);
      setCurrentUser(user);
      setIsAdmin(adminStatus);

      // Show success message
      if (management) {
        toast.success(`ښه راغلاست! ${management.managementName} ته`);
      } else {
        toast.success("ښه راغلاست!");
      }

      // Navigate to home
      navigate("/");
    } catch (error) {
      console.error("Error in handleSuccessfulLogin:", error);
      toast.error("د لاګین په بهیر کې ستونزه رامنځته شوه");
    }
  };
  //function for handle login with credentials
  const onLoginHandler = async (data) => {
    try {
      setLoading(true);
      const response = await api.post("/auth/public/signin", data);

      console.log("Login response:", response.data);

      if (response.status === 200 && response.data.jwtToken) {
        const decodedToken = jwtDecode(response.data.jwtToken);

        if (decodedToken.is2faEnabled) {
          setJwtToken(response.data.jwtToken);
          // setManagementData(response.data.management); // Store for 2FA step
          toast.success("Please verify 2FA code.");
          setStep(2);
        } else {
          handleSuccessfulLogin(response.data); // Pass full response
        }

        reset();
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);

      // Handle 403 - no management assigned
      if (error.response?.status === 403) {
        toast.error("You are not assigned to any management. Contact admin.");
      } else {
        toast.error("Invalid credentials");
      }
    } finally {
      setLoading(false);
    }
  };
  //function for verify 2fa authentication
  const onVerify2FaHandler = async (data) => {
    const code = data.code;
    setLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append("code", code);
      formData.append("jwtToken", jwtToken);

      await api.post("/auth/public/verify-2fa-login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const decodedToken = jwtDecode(jwtToken);
      handleSuccessfulLogin(jwtToken, decodedToken);
    } catch (error) {
      console.error("2FA verification error", error);
      toast.error("Invalid 2FA code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  //if there is token  exist navigate  the user to the home page if he tried to access the login page
  useEffect(() => {
    if (token) navigate("/");
  }, [navigate, token]);

  //step1 will render the login form and step-2 will render the 2fa verification form
  return (
    <div className="min-h-[calc(100vh-74px)] w-full flex items-center justify-between px-4 ">
      <div className="w-1/2 bg-dark-gray flex justify-center items-center p-8">
        <img
          src="login1.jpg"
          alt="Login Illustration"
          className="max-w-screen-sm h-auto object-contain "
        />
      </div>
      <div className="w-1/2 flex justify-start mr-16">
        {step === 1 ? (
          <React.Fragment>
            <form
              onSubmit={handleSubmit(onLoginHandler)}
              className="max-w-xs w-full"
            >
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 rounded-full border-4 border-darkGreen flex items-center justify-center transition-all">
                  <img
                    src="logo.png"
                    alt="Logo"
                    className="w-12 h-12 object-contain"
                  />
                </div>
              </div>
              <div>
                <h1 className="font-montserrat text-center font-bold text-2xl text-l text-lightGreen">
                  WELCOME
                </h1>

                <div className="flex items-center justify-between gap-1 py-5 "></div>
              </div>

              <div className="flex flex-col gap-4">
                <TextField
                  {...register("username", {
                    required: "*UserName is required",
                  })}
                  error={Boolean(errors.username)}
                  helperText={errors.username?.message}
                  id="username"
                  label="UserName"
                  variant="outlined"
                  fullWidth
                  required
                  placeholder="Type your username"
                  InputProps={{
                    // 🔵 ایکن ښي طرف ته
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        sx={{
                          background: "transparent", // ایکن بیک‌ګرونډ ختم
                          marginRight: "4px", // ښه فضا
                        }}
                      >
                        <AccountCircle sx={{ color: "#1976d2" }} />{" "}
                        {/* آبي رنګ */}
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      backgroundColor: "#e3f2fd", // 🔵 همرنګ بیک‌ګرونډ
                      "& fieldset": { borderColor: "#90caf9" },
                      "&:hover fieldset": { borderColor: "#1976d2" },
                      "&.Mui-focused fieldset": {
                        borderColor: "#1976d2",
                        borderWidth: "2px",
                      },
                    },
                  }}
                />

                <TextField
                  {...register("password", {
                    required: "*Password is required",
                  })}
                  error={Boolean(errors.password)}
                  helperText={errors.password?.message}
                  id="password"
                  label="Password"
                  fullWidth
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="Type your password"
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        sx={{
                          background: "transparent",
                          marginRight: "4px",
                        }}
                      >
                        <IconButton
                          onClick={handleTogglePassword}
                          edge="end"
                          sx={{
                            color: "#1976d2",
                            background: "transparent !important", // 🔵 ایکن بیک‌ګرونډ ختم
                          }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      backgroundColor: "#e3f2fd",
                      "& fieldset": { borderColor: "#90caf9" },
                      "&:hover fieldset": { borderColor: "#1976d2" },
                      "&.Mui-focused fieldset": {
                        borderColor: "#1976d2",
                        borderWidth: "2px",
                      },
                    },
                  }}
                />
              </div>
              <Buttons
                disabled={loading}
                onClickhandler={() => {}}
                className="bg-blackColor font-semibold text-white w-full py-2 hover:text-slate-400 transition-colors duration-100 rounded-sm my-3"
                type="text"
              >
                {loading ? <span>Loading...</span> : "LogIn"}
              </Buttons>
              <p className=" text-sm text-slate-700 ">
                <Link
                  className=" underline hover:text-black"
                  to="/forgot-password"
                >
                  Forgot Password?
                </Link>
              </p>

              <p className="text-center text-sm text-slate-700 mt-6">
                Don't have an account?{" "}
                <Link
                  className="font-semibold underline hover:text-black"
                  to="/signup"
                >
                  SignUp
                </Link>
              </p>
            </form>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <form
              onSubmit={handleSubmit(onVerify2FaHandler)}
              className="sm:w-[450px] w-[360px]  shadow-custom py-8 sm:px-8 px-4"
            >
              <div>
                <h1 className="font-montserrat text-center font-bold text-2xl">
                  Verify 2FA
                </h1>
                <p className="text-slate-600 text-center">
                  Enter the correct code to complete 2FA Authentication
                </p>

                <Divider className="font-semibold pb-4"></Divider>
              </div>

              <div className="flex flex-col gap-2 mt-4">
                <InputField
                  label="Enter Code"
                  required
                  id="code"
                  type="text"
                  message="*Code is required"
                  placeholder="Enter your 2FA code"
                  register={register}
                  errors={errors}
                />
              </div>
              <Buttons
                disabled={loading}
                onClickhandler={() => {}}
                className="bg-customRed font-semibold text-white w-full py-2 hover:text-slate-400 transition-colors duration-100 rounded-sm my-3"
                type="text"
              >
                {loading ? <span>Loading...</span> : "Verify 2FA"}
              </Buttons>
            </form>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default Login;
