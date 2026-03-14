import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { setDocumentDirection, getStoredLanguage } from "./utils/languageUtils";

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
import psArchive from "./locales/ps/Archive/archive.json";
// import psArchiveList from "./locales/ps/Archive/archivelist.json";
// import psEditArchiveDialog from "./locales/ps/Archive/EditArchiveDialog.json"; // ✅ new
// import psViewArchive from "./locales/ps/Archive/ViewArchive.json";
import psManagementUtils from "./locales/ps/managementUtils.json";
import psAddHazari from "./locales/ps/Hifziya/HifziyaHazari/AddHazari.json";
import psHifziyaWaradaSadera from "./locales/ps/Hifziya/WaradaSadera/waradaSaderaList.json";
import psSawanih from "./locales/ps/Hifziya/Sawanih/sawanih.json";
import psMakzanReceipt from "./locales/ps/Storage/MakzanReceipt/MakzanReceipt.json";
import psMakzanSubmissionReport from "./locales/ps/Storage/MakzanSubmissionReport/MakzanSubmissionReport.json";
import psMakhzanAnnualReport from "./locales/ps/Storage/MakzanAnnualReport/MakzanAnnualReport.json";
import psMakhzanWaradaSadera from "./locales/ps/Storage/MakzanWaradaSadera/MakhzanWaradaSadera.json";
import psBreadcrumbs from "./locales/ps/breadcrumbs.json";
import psShuraAaliResolutions from "./locales/ps/Hifziya/ShuraAaliResolution.json";

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
import faArchive from "./locales/fa/Archive/archive.json";
// import faArchiveList from "./locales/fa/archivelist.json";
// import faEditArchiveDialog from "./locales/fa/EditArchiveDialog.json"; // ✅ new
// import faViewArchive from "./locales/fa/ViewArchive.json";
import faManagementUtils from "./locales/fa/managementUtils.json";
import faAddHazari from "./locales/fa/Hifziya/HifziyaHazari/addHazari.json";
import faHifziyaWaradaSadera from "./locales/fa/Hifziya/WaradaSadera/waradaSaderaList.json";
import faSawanih from "./locales/fa/Hifziya/Sawanih/sawanih.json";
import faMakzanReceipt from "./locales/fa/Storage/MakzanReceipt/MakzanReceipt.json";
import faMakzanSubmissionReport from "./locales/fa/Storage/MakzanSubmissionReport/MakzanSubmissionReport.json";
import faMakhzanAnnualReport from "./locales/fa/Storage/MakzanAnnualReport/MakzanAnnualReport.json";
import faMakhzanWaradaSadera from "./locales/fa/Storage/MakzanWaradaSadera/MakhzanWaradaSadera.json";
import faBreadcrumbs from "./locales/fa/breadcrumbs.json";
import faShuraAaliResolutions from "./locales/fa/Hifziya/ShuraAaliResolution.json";
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
import enArchive from "./locales/en/Archive/archive.json";
// import enArchiveList from "./locales/en/archivelist.json";
// import enEditArchiveDialog from "./locales/en/EditArchiveDialog.json"; // ✅ new
// import enViewArchive from "./locales/en/ViewArchive.json";
import enManagementUtils from "./locales/en/managementUtils.json";
import enAddHazari from "./locales/en/Hifziya/HifziyaHazari/addHazari.json";
import enHifziyaWaradaSadera from "./locales/en/Hifziya/WaradaSadera/waradaSaderaList.json";
import enSawanih from "./locales/en/Hifziya/Sawanih/sawanih.json";
import enMakzanReceipt from "./locales/en/Storage/MakzanReceipt/MakzanReceipt.json";
import enMakzanSubmissionReport from "./locales/en/Storage/MakzanSubmissionReport/MakzanSubmissionReport.json";
import enMakhzanAnnualReport from "./locales/en/Storage/MakzanAnnualReport/MakzanAnnualReport.json";
import enMakhzanWaradaSadera from "./locales/en/Storage/MakzanWaradaSadera/MakhzanWaradaSadera.json";
import enBreadcrumbs from "./locales/en/breadcrumbs.json";
import enShuraAaliResolutions from "./locales/en/Hifziya/ShuraAaliResolution.json";

const initialLanguage = getStoredLanguage();

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
      // archivelist: psArchiveList, // ✅ added
      // editArchiveDialog: psEditArchiveDialog, // ✅ added
      // ViewArchive: psViewArchive, // ✅ added
      managementUtils: psManagementUtils,
      addHazari: psAddHazari,
      hifziyaWaradaSadera: psHifziyaWaradaSadera,
      sawanih: psSawanih,
      makzanReceipt: psMakzanReceipt,
      makzanSubmissionReport: psMakzanSubmissionReport,
      makzanAnnualReport: psMakhzanAnnualReport,
      makhzanWaradaSadera: psMakhzanWaradaSadera,
      breadcrumbs: psBreadcrumbs,
      shuraAali: psShuraAaliResolutions,
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
      // archivelist: faArchiveList,
      // editArchiveDialog: faEditArchiveDialog, // ✅ added
      // ViewArchive: faViewArchive, // ✅ added
      managementUtils: faManagementUtils,
      addHazari: faAddHazari,
      hifziyaWaradaSadera: faHifziyaWaradaSadera,
      sawanih: faSawanih,
      makzanReceipt: faMakzanReceipt,
      makzanSubmissionReport: faMakzanSubmissionReport,
      makzanAnnualReport: faMakhzanAnnualReport,
      makhzanWaradaSadera: faMakhzanWaradaSadera,
      breadcrumbs: faBreadcrumbs,
      shuraAali: faShuraAaliResolutions,
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
      // archivelist: enArchiveList,
      // editArchiveDialog: enEditArchiveDialog, // ✅ added
      // ViewArchive: enViewArchive, // ✅ added
      managementUtils: enManagementUtils,
      addHazari: enAddHazari,
      hifziyaWaradaSadera: enHifziyaWaradaSadera,
      sawanih: enSawanih,
      makzanReceipt: enMakzanReceipt,
      makzanSubmissionReport: enMakzanSubmissionReport,
      makzanAnnualReport: enMakhzanAnnualReport,
      makhzanWaradaSadera: enMakhzanWaradaSadera,
      breadcrumbs: enBreadcrumbs,
      shuraAali: enShuraAaliResolutions,
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
    "managementUtils",
    "addHazari",
    "hifziyaWaradaSadera",
    "sawanih",
    "makzanReceipt",
    "makzanSubmissionReport",
    "makzanAnnualReport",
    "makhzanWaradaSadera",
    "breadcrumbs",
    "shuraAali",
  ],

  defaultNS: "login",
});
i18n.on("languageChanged", (lng) => {
  setDocumentDirection(lng);
});

setDocumentDirection(initialLanguage);

export default i18n;
