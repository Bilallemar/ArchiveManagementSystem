import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";

import Navbar from "./components/Navbar";
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
import ReceiptsList from "./components/StorageManagement/Receipts/ReceiptsList";
import AddReceipt from "./components/StorageManagement/Receipts/AddReceipt";
import UpdateReceipt from "./components/StorageManagement/Receipts/UpdateReceipt";
import ReceivedIssuedBookList from "./components/StorageManagement/ReceivedIssuedBook/ReceivedIssuedBookList";
import AddReceivedIssuedBook from "./components/StorageManagement/ReceivedIssuedBook/AddReceivedIssuedBook";
import UpdateReceivedIssuedBook from "./components/StorageManagement/ReceivedIssuedBook/UpdateReceivedIssuedBook";
import AnnualReportList from "./components/StorageManagement/AnnualReport/AnnualReportList";
import AddAnnualReport from "./components/StorageManagement/AnnualReport/AddAnnualReport";
import UpdateAnnualReport from "./components/StorageManagement/AnnualReport/UpdateAnnualReport";
import AnnualReportInfoList from "./components/StorageManagement/AnnualReportInfo/AnnualReportInfoList";
import AddAnnualReportInfo from "./components/StorageManagement/AnnualReportInfo/AddAnnualReportInfo";
import UpdateAnnualReportInfo from "./components/StorageManagement/AnnualReportInfo/UpdateAnnualReportInfo";
// import Footer from "./components/Footer/Footer";

const App = () => {
  const location = useLocation();
  const hideNavbarRoutes = [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/oauth2/redirect",
  ];

  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Toaster position="bottom-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/annual-reports-info"
          element={
            <ProtectedRoute>
              <AnnualReportInfoList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/annual-reports-info/add-annual-report-info"
          element={
            <ProtectedRoute>
              <AddAnnualReportInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/annual-reports-info/:id"
          element={
            <ProtectedRoute>
              <UpdateAnnualReportInfo />
            </ProtectedRoute>
          }
        />

        <Route
          path="/annual-reports"
          element={
            <ProtectedRoute>
              <AnnualReportList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/annual-reports/add-annual-report"
          element={
            <ProtectedRoute>
              <AddAnnualReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/annual-reports/:id"
          element={
            <ProtectedRoute>
              <UpdateAnnualReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/received-issued-books"
          element={
            <ProtectedRoute>
              <ReceivedIssuedBookList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/received-issued-books/add-received-issued-book"
          element={
            <ProtectedRoute>
              <AddReceivedIssuedBook />
            </ProtectedRoute>
          }
        />
        <Route
          path="/received-issued-books/:id"
          element={
            <ProtectedRoute>
              <UpdateReceivedIssuedBook />
            </ProtectedRoute>
          }
        />
        <Route
          path="/receipts/:id"
          element={
            <ProtectedRoute>
              <UpdateReceipt />
            </ProtectedRoute>
          }
        />
        <Route
          path="/receipts/add-receipt"
          element={
            <ProtectedRoute>
              <AddReceipt />
            </ProtectedRoute>
          }
        />
        <Route
          path="/receipts"
          element={
            <ProtectedRoute>
              <ReceiptsList />
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
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
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
