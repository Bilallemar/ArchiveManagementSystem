import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import { MANAGEMENTS } from "./utils/managementUtils";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { useMemo, useState } from "react";
import { createAppTheme } from "./theme";
// import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./components/LandingPage";
import AccessDenied from "./components/Auth/AccessDenied";
import Admin from "./components/AuditLogs/Admin";
import UserProfile from "./components/Auth/UserProfile";
import ForgotPassword from "./components/Auth/ForgotPassword";
import OAuth2RedirectHandler from "./components/Auth/OAuth2RedirectHandler";
import { Toaster } from "react-hot-toast";
import NotFound from "./components/NotFound";
import ContactPage from "./components/contactPage/ContactPage";
import AboutPage from "./components/aboutPage/AboutPage";
import ResetPassword from "./components/Auth/ResetPassword";
import UserManagementPanel from "./components/Admin/UserManagementPanel";
import HazariList from "./components/Hifziya/HifziyaHazari/HazariList";
import AddHazari from "./components/Hifziya/HifziyaHazari/AddHazari";
import EditHazariDialog from "./components/Hifziya/HifziyaHazari/EditHazariDialog";
import HifziyaWaradaSaderaList from "./components/Hifziya/HifziyaWaradaSadera/HifziyaWaradaSaderaList";
import AddHifziyaWaradaSadera from "./components/Hifziya/HifziyaWaradaSadera/AddHifziyaWaradaSadera";
import EditHifziyaWaradaSaderaDialog from "./components/Hifziya/HifziyaWaradaSadera/EditHifziyaWaradaSaderaDialog";
import SawanihList from "./components/Hifziya/Sawanih/SawanihList";
import AddSawanih from "./components/Hifziya/Sawanih/AddSawanih";
import EditSawanihDialog from "./components/Hifziya/Sawanih/EditSawanihDialog";
import ArchiveList from "./components/ArchiveManagement/Archive/ArchiveList";
import AddArchive from "./components/ArchiveManagement/Archive/AddArchive";
import EditArchiveDialog from "./components/ArchiveManagement/Archive/EditArchiveDialog";
import MakzanSubmissionReportList from "./components/StorageManagement/MakzanSubmissionReport/MakzanSubmissionReportList";
import AddMakzanSubmissionReport from "./components/StorageManagement/MakzanSubmissionReport/AddMakzanSubmissionReport";
import EditMakzanSubmissionReportDialog from "./components/StorageManagement/MakzanSubmissionReport/EditMakzanSubmissionReportDialog";
import MakzanReceiptList from "./components/StorageManagement/MakzanReceipt/MakzanReceiptList";
import AddMakzanReceipt from "./components/StorageManagement/MakzanReceipt/AddMakzanReceipt";
import EditReceiptDialog from "./components/StorageManagement/MakzanReceipt/EditReceiptDialog";
import MakzanAnnualReportList from "./components/StorageManagement/MakzanAnnualReport/MakzanAnnualReportList";
import AddMakzanAnnualReport from "./components/StorageManagement/MakzanAnnualReport/AddMakzanAnnualReport";
import EditMakzanAnnualReportDialog from "./components/StorageManagement/MakzanAnnualReport/EditMakzanAnnualReportDialog";
import { useMyContext } from "./store/ContextApi";
import SidebarLayout from "./components/SidebarLayout";
const App = () => {
  const location = useLocation();
  const hideNavbarRoutes = [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/oauth2/redirect",
  ];
  const { mode } = useMyContext();

  const theme = useMemo(() => createAppTheme(mode), [mode]);
  console.log("Current mode:", mode);
  console.log("Stored theme:", localStorage.getItem("theme"));

  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);
  const { token } = useMyContext();
  const { pathname } = useLocation();

  // Hide layout on auth pages
  const authPages = [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
  ];
  const isAuthPage = authPages.includes(pathname);
  if (isAuthPage || !token) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Toaster position="bottom-center" reverseOrder={false} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </ThemeProvider>
    );
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Toaster position="bottom-center" reverseOrder={false} />
        <SidebarLayout>
          <Routes>
            {/* <Route path="/" element={<LandingPage />} /> */}
            <Route
              path="/"
              element={
                <ProtectedRoute requiresManagement={true}>
                  <LandingPage />
                </ProtectedRoute>
              }
            />

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route
              path="/sawanih/:id"
              element={
                <ProtectedRoute requiredManagementId={MANAGEMENTS.HIFZIYA}>
                  <EditSawanihDialog />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sawanih/add-sawanih"
              element={
                <ProtectedRoute requiredManagementId={MANAGEMENTS.HIFZIYA}>
                  <AddSawanih />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sawanih"
              element={
                <ProtectedRoute requiredManagementId={MANAGEMENTS.HIFZIYA}>
                  <SawanihList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hifziya-warada-sadera/:id"
              element={
                <ProtectedRoute requiredManagementId={MANAGEMENTS.HIFZIYA}>
                  <EditHifziyaWaradaSaderaDialog />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hifziya-warada-sadera/add-hifziya-warada-sadera"
              element={
                <ProtectedRoute requiredManagementId={MANAGEMENTS.HIFZIYA}>
                  <AddHifziyaWaradaSadera />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hifziya-warada-sadera"
              element={
                <ProtectedRoute requiredManagementId={MANAGEMENTS.HIFZIYA}>
                  <HifziyaWaradaSaderaList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hifziya-hazari/:id"
              element={
                <ProtectedRoute requiredManagementId={MANAGEMENTS.HIFZIYA}>
                  <EditHazariDialog />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hifziya-hazari/add-hazari"
              element={
                <ProtectedRoute requiredManagementId={MANAGEMENTS.HIFZIYA}>
                  <AddHazari />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hifziya-hazari"
              element={
                <ProtectedRoute requiredManagementId={MANAGEMENTS.HIFZIYA}>
                  <HazariList />
                </ProtectedRoute>
              }
            />
            <Route path="/access-denied" element={<AccessDenied />} />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute adminPage={true}>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/user-management"
              element={
                <ProtectedRoute adminPage={true}>
                  <UserManagementPanel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/annual-reports-info"
              element={
                <ProtectedRoute requiredManagementId={MANAGEMENTS.MAKHZAN}>
                  <MakzanSubmissionReportList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/annual-reports-info/add"
              element={
                <ProtectedRoute requiredManagementId={MANAGEMENTS.MAKHZAN}>
                  <AddMakzanSubmissionReport />
                </ProtectedRoute>
              }
            />
            <Route
              path="/annual-reports-info/:id"
              element={
                <ProtectedRoute requiredManagementId={MANAGEMENTS.MAKHZAN}>
                  <EditMakzanSubmissionReportDialog />
                </ProtectedRoute>
              }
            />
            <Route
              path="/makzan-receipts"
              element={
                <ProtectedRoute requiredManagementId={MANAGEMENTS.MAKHZAN}>
                  <MakzanReceiptList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/makzan-receipts/add"
              element={
                <ProtectedRoute requiredManagementId={MANAGEMENTS.MAKHZAN}>
                  <AddMakzanReceipt />
                </ProtectedRoute>
              }
            />
            <Route
              path="/makzan-receipts/:id"
              element={
                <ProtectedRoute requiredManagementId={MANAGEMENTS.MAKHZAN}>
                  <EditReceiptDialog />
                </ProtectedRoute>
              }
            />
            <Route
              path="/makzan-annual-reports"
              element={
                <ProtectedRoute requiredManagementId={MANAGEMENTS.MAKHZAN}>
                  <MakzanAnnualReportList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/makzan-annual-reports/add"
              element={
                <ProtectedRoute requiredManagementId={MANAGEMENTS.MAKHZAN}>
                  <AddMakzanAnnualReport />
                </ProtectedRoute>
              }
            />
            <Route
              path="/makzan-annual-reports/:id"
              element={
                <ProtectedRoute requiredManagementId={MANAGEMENTS.MAKHZAN}>
                  <EditMakzanAnnualReportDialog />
                </ProtectedRoute>
              }
            />
            <Route
              path="/archive"
              element={
                <ProtectedRoute requiredManagementId={MANAGEMENTS.ARCHIVE}>
                  <ArchiveList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/archive/add"
              element={
                <ProtectedRoute requiredManagementId={MANAGEMENTS.ARCHIVE}>
                  <AddArchive />
                </ProtectedRoute>
              }
            />
            <Route
              path="/archive/:id"
              element={
                <ProtectedRoute requiredManagementId={MANAGEMENTS.ARCHIVE}>
                  <EditArchiveDialog />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/oauth2/redirect"
              element={<OAuth2RedirectHandler />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SidebarLayout>
      </ThemeProvider>
    </>
  );
};

const AppWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

export default AppWrapper;
