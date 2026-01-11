import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// ================== Pashto ==================
import psLogin from "./locales/ps/login.json";
import psForgotPassword from "./locales/ps/forgotPassword.json";
import psUserManagement from "./locales/ps/userManagement.json";
import psUsers from "./locales/ps/users.json";
import psNavbar from "./locales/ps/navbar.json";
import psUserProfile from "./locales/ps/UserProfile.json";
import psUserDetails from "./locales/ps/UserDetails.json";
import psSidebarLayout from "./locales/ps/SidebarLayout.json";
import psLandingPage from "./locales/ps/landingPage.json";
import psArchive from "./locales/ps/archive.json";
import psArchiveList from "./locales/ps/archivelist.json";
import psEditArchiveDialog from "./locales/ps/EditArchiveDialog.json"; // ✅ new
import psViewArchive from "./locales/ps/ViewArchive.json";

// ================== Dari ==================
import faLogin from "./locales/fa/login.json";
import faForgotPassword from "./locales/fa/forgotPassword.json";
import faUserManagement from "./locales/fa/userManagement.json";
import faUsers from "./locales/fa/users.json";
import faUserDetails from "./locales/fa/UserDetails.json";
import faUserProfile from "./locales/fa/UserProfile.json";
import faNavbar from "./locales/fa/navbar.json";
import faSidebarLayout from "./locales/fa/SidebarLayout.json";
import faLandingPage from "./locales/fa/landingPage.json";
import faArchive from "./locales/fa/archive.json";
import faArchiveList from "./locales/fa/archivelist.json";
import faEditArchiveDialog from "./locales/fa/EditArchiveDialog.json"; // ✅ new
import faViewArchive from "./locales/fa/ViewArchive.json";

// ================== English ==================
import enLogin from "./locales/en/login.json";
import enForgotPassword from "./locales/en/forgotPassword.json";
import enUserManagement from "./locales/en/userManagement.json";
import enUsers from "./locales/en/users.json";
import enUserDetails from "./locales/en/UserDetails.json";
import enUserProfile from "./locales/en/UserProfile.json";
import enNavbar from "./locales/en/navbar.json";
import enSidebarLayout from "./locales/en/SidebarLayout.json";
import enLandingPage from "./locales/en/landingPage.json";
import enArchive from "./locales/en/archive.json";
import enArchiveList from "./locales/en/archivelist.json";
import enEditArchiveDialog from "./locales/en/EditArchiveDialog.json"; // ✅ new
import enViewArchive from "./locales/en/ViewArchive.json";

i18n.use(initReactI18next).init({
  resources: {
    ps: {
      login: psLogin,
      forgotPassword: psForgotPassword,
      userManagement: psUserManagement,
      users: psUsers,
      userDetails: psUserDetails,
      userProfile: psUserProfile,
      navbar: psNavbar,
      SidebarLayout: psSidebarLayout,
      landingPage: psLandingPage, // ✅ added
      archive: psArchive,
      archivelist: psArchiveList, // ✅ added
      editArchiveDialog: psEditArchiveDialog, // ✅ added
      ViewArchive: psViewArchive, // ✅ added
    },

    fa: {
      login: faLogin,
      forgotPassword: faForgotPassword,
      userManagement: faUserManagement,
      users: faUsers,
      userDetails: faUserDetails,
      userProfile: faUserProfile,
      navbar: faNavbar,
      SidebarLayout: faSidebarLayout,
      landingPage: faLandingPage,
      archive: faArchive,
      archivelist: faArchiveList,
      editArchiveDialog: faEditArchiveDialog, // ✅ added
      ViewArchive: faViewArchive, // ✅ added
    },

    en: {
      login: enLogin,
      forgotPassword: enForgotPassword,
      userManagement: enUserManagement,
      users: enUsers,
      userDetails: enUserDetails,
      userProfile: enUserProfile,
      navbar: enNavbar,
      SidebarLayout: enSidebarLayout,
      landingPage: enLandingPage,
      archive: enArchive,
      archivelist: enArchiveList,
      editArchiveDialog: enEditArchiveDialog, // ✅ added
      ViewArchive: enViewArchive, // ✅ added
    },
  },

  lng: "ps",
  fallbackLng: "ps",
  supportedLngs: ["ps", "fa", "en"],

  interpolation: {
    escapeValue: false,
  },

  ns: [
    "login",
    "forgotPassword",
    "userManagement",
    "users",
    "userDetails",
    "userProfile",
    "navbar",
    "SidebarLayout",
    "landingPage",
    "archive",
    "archivelist",
    "editArchiveDialog", // ✅ added
    "ViewArchive", // ✅ added
  ],

  defaultNS: "login",
});

export default i18n;
