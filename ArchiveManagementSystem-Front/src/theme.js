// // import { createTheme } from "@mui/material/styles";

// // export const createAppTheme = (mode) =>
// //   createTheme({
// //     palette: {
// //       mode,
// //       background: {
// //         default: mode === "dark" ? "#121212" : "#f9fafb",
// //         paper: mode === "dark" ? "#1e1e1e" : "#ffffff",
// //       },
// //       text: {
// //         primary: mode === "dark" ? "#ffffff" : "#212B36",
// //         secondary: mode === "dark" ? "#B0B7C3" : "#637381",
// //       },
// //     },
// //   });
// // theme.js - Complete Dark Mode Configuration
// // theme.js - Complete Dark Mode Configuration
// import { createTheme } from "@mui/material/styles";

// export const createAppTheme = (mode) =>
//   createTheme({
//     palette: {
//       mode,
//       primary: {
//         main: mode === "dark" ? "#90caf9" : "#00B8D9",
//         light: mode === "dark" ? "#a6d4fa" : "#5BE584",
//         dark: mode === "dark" ? "#648dae" : "#007B95",
//         contrastText: mode === "dark" ? "#000" : "#fff",
//       },
//       secondary: {
//         main: mode === "dark" ? "#ce93d8" : "#8B5CF6",
//         light: mode === "dark" ? "#dda4e1" : "#A78BFA",
//         dark: mode === "dark" ? "#ab47bc" : "#7C3AED",
//       },
//       error: {
//         main: mode === "dark" ? "#f44336" : "#FF5630",
//         light: mode === "dark" ? "#e57373" : "#FF8F6D",
//         dark: mode === "dark" ? "#d32f2f" : "#B71D18",
//       },
//       warning: {
//         main: mode === "dark" ? "#ffa726" : "#FFAB00",
//         light: mode === "dark" ? "#ffb74d" : "#FFD666",
//         dark: mode === "dark" ? "#f57c00" : "#B76E00",
//       },
//       info: {
//         main: mode === "dark" ? "#29b6f6" : "#00B8D9",
//         light: mode === "dark" ? "#4fc3f7" : "#61F3F3",
//         dark: mode === "dark" ? "#0288d1" : "#006C9C",
//       },
//       success: {
//         main: mode === "dark" ? "#66bb6a" : "#22C55E",
//         light: mode === "dark" ? "#81c784" : "#77ED8B",
//         dark: mode === "dark" ? "#388e3c" : "#118D57",
//       },
//       background: {
//         default: mode === "dark" ? "#121212" : "#f9fafb",
//         paper: mode === "dark" ? "#1e1e1e" : "#ffffff",
//       },
//       text: {
//         primary: mode === "dark" ? "#ffffff" : "#212B36",
//         secondary: mode === "dark" ? "#B0B7C3" : "#637381",
//         disabled: mode === "dark" ? "#6B7280" : "#9CA3AF",
//       },
//       divider:
//         mode === "dark"
//           ? "rgba(255, 255, 255, 0.12)"
//           : "rgba(145, 158, 171, 0.24)",
//       action: {
//         active: mode === "dark" ? "#fff" : "rgba(0, 0, 0, 0.54)",
//         hover:
//           mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
//         selected:
//           mode === "dark" ? "rgba(255, 255, 255, 0.16)" : "rgba(0, 0, 0, 0.08)",
//         disabled:
//           mode === "dark" ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.26)",
//         disabledBackground:
//           mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)",
//       },
//     },
//     typography: {
//       fontFamily: '"B nazanin", "Roboto", "Arial", sans-serif',
//       h1: {
//         fontWeight: 700,
//         fontSize: "2.5rem",
//         color: mode === "dark" ? "#ffffff" : "#212B36",
//       },
//       h2: {
//         fontWeight: 700,
//         fontSize: "2rem",
//         color: mode === "dark" ? "#ffffff" : "#212B36",
//       },
//       h3: {
//         fontWeight: 700,
//         fontSize: "1.75rem",
//         color: mode === "dark" ? "#ffffff" : "#212B36",
//       },
//       h4: {
//         fontWeight: 700,
//         fontSize: "1.5rem",
//         color: mode === "dark" ? "#ffffff" : "#212B36",
//       },
//       h5: {
//         fontWeight: 600,
//         fontSize: "1.25rem",
//         color: mode === "dark" ? "#ffffff" : "#212B36",
//       },
//       h6: {
//         fontWeight: 600,
//         fontSize: "1.125rem",
//         color: mode === "dark" ? "#ffffff" : "#212B36",
//       },
//       body1: {
//         fontSize: "1rem",
//         color: mode === "dark" ? "#B0B7C3" : "#637381",
//       },
//       body2: {
//         fontSize: "0.875rem",
//         color: mode === "dark" ? "#B0B7C3" : "#637381",
//       },
//     },
//     components: {
//       MuiCard: {
//         styleOverrides: {
//           root: {
//             backgroundColor: mode === "dark" ? "#1e1e1e" : "#ffffff",
//             boxShadow:
//               mode === "dark"
//                 ? "0px 4px 20px rgba(0, 0, 0, 0.5)"
//                 : "rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px",
//           },
//         },
//       },
//       MuiPaper: {
//         styleOverrides: {
//           root: {
//             backgroundColor: mode === "dark" ? "#1e1e1e" : "#ffffff",
//           },
//         },
//       },
//       MuiChip: {
//         styleOverrides: {
//           root: {
//             backgroundColor: mode === "dark" ? "#2e2e2e" : undefined,
//             color: mode === "dark" ? "#ffffff" : undefined,
//           },
//         },
//       },
//       MuiButton: {
//         styleOverrides: {
//           root: {
//             textTransform: "none",
//             fontWeight: 600,
//           },
//           contained: {
//             boxShadow: mode === "dark" ? "none" : undefined,
//             "&:hover": {
//               boxShadow: mode === "dark" ? "none" : undefined,
//             },
//           },
//         },
//       },
//       MuiAppBar: {
//         styleOverrides: {
//           root: {
//             backgroundColor: mode === "dark" ? "#1e1e1e" : "#ffffff",
//             color: mode === "dark" ? "#ffffff" : "#212B36",
//           },
//         },
//       },
//       MuiAlert: {
//         styleOverrides: {
//           root: {
//             backgroundColor: mode === "dark" ? "#2e2e2e" : undefined,
//           },
//         },
//       },
//     },
//   });
import { createTheme } from "@mui/material/styles";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";

export const createAppTheme = (mode = "light") => {
  const isRTL = document.dir === "rtl";

  return createTheme({
    direction: isRTL ? "rtl" : "ltr",
    palette: {
      mode,
      primary: {
        main: mode === "dark" ? "#90caf9" : "#1976d2",
      },
      secondary: {
        main: mode === "dark" ? "#f48fb1" : "#dc004e",
      },
      background: {
        default: mode === "dark" ? "#121212" : "#fafafa",
        paper: mode === "dark" ? "#1e1e1e" : "#ffffff",
      },
      text: {
        primary: mode === "dark" ? "#ffffff" : "#000000",
        secondary: mode === "dark" ? "#b0b0b0" : "#666666",
      },
    },
    typography: {
      fontFamily: isRTL
        ? '"B Nazanin", "Tahoma", "Arial", sans-serif'
        : '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: "2.5rem",
        fontWeight: 700,
      },
      h2: {
        fontSize: "2rem",
        fontWeight: 600,
      },
      h3: {
        fontSize: "1.75rem",
        fontWeight: 600,
      },
      h4: {
        fontSize: "1.5rem",
        fontWeight: 600,
      },
      h5: {
        fontSize: "1.25rem",
        fontWeight: 600,
      },
      h6: {
        fontSize: "1rem",
        fontWeight: 600,
      },
      body1: {
        fontSize: "1rem",
      },
      body2: {
        fontSize: "0.875rem",
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            direction: isRTL ? "rtl" : "ltr",
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            direction: isRTL ? "rtl" : "ltr",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            direction: isRTL ? "rtl" : "ltr",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: 8,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: "outlined",
        },
      },
      MuiSelect: {
        defaultProps: {
          variant: "outlined",
        },
      },
    },
  });
};
