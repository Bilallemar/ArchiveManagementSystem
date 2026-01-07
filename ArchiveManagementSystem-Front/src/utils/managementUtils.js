// utils/managementUtils.js

// =========================
// MANAGEMENT CONSTANTS
// =========================

// Management IDs - IMPORTANT: Match with your database IDs
export const MANAGEMENTS = {
  ARCHIVE: 1,
  HIFZIYA: 2,
  MAKHZAN: 3,
};

// Management names mapping
export const MANAGEMENT_NAMES = {
  1: "آرشیف",
  2: "حفظیه",
  3: "مخزن",
};

// =========================
// LOCAL STORAGE HELPERS
// =========================

// Get user's management from localStorage
export const getUserManagement = () => {
  try {
    const data = localStorage.getItem("USER_MANAGEMENT");
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error getting user management:", error);
    return null;
  }
};

// Set user's management
export const setUserManagement = (managementData) => {
  try {
    localStorage.setItem("USER_MANAGEMENT", JSON.stringify(managementData));
  } catch (error) {
    console.error("Error setting user management:", error);
  }
};

// Clear user management
export const clearUserManagement = () => {
  try {
    localStorage.removeItem("USER_MANAGEMENT");
  } catch (error) {
    console.error("Error clearing user management:", error);
  }
};

// =========================
// MANAGEMENT GETTERS
// =========================

// Get management ID
export const getManagementId = () => {
  const management = getUserManagement();
  return management?.managementId || null;
};

// Get management name
export const getManagementName = () => {
  const management = getUserManagement();
  return (
    management?.managementName ||
    MANAGEMENT_NAMES[management?.managementId] ||
    "No Management"
  );
};

// Check if user has management
export const hasManagement = () => {
  return getUserManagement() !== null;
};

// Check if user belongs to specific management
export const isUserInManagement = (managementId) => {
  const userManagementId = getManagementId();
  return userManagementId === managementId;
};

// =========================
// ADMIN CHECK
// =========================

// Check if user is admin
export const isAdmin = () => {
  try {
    const user = JSON.parse(localStorage.getItem("USER") || "{}");
    return user.roles?.includes("ROLE_ADMIN") || false;
  } catch (error) {
    return false;
  }
};

// =========================
// NAVIGATION BASED ON MANAGEMENT
// =========================

export const getNavigationItems = () => {
  const managementId = getManagementId();
  const admin = isAdmin();

  // Admin sees everything
  if (admin) {
    return [
      {
        path: "/hifziya-hazari",
        label: "کتاب حاضري",
        management: MANAGEMENTS.HIFZIYA,
      },
      {
        path: "/hifziya-warada-sadera",
        label: "وارده صادره",
        management: MANAGEMENTS.HIFZIYA,
      },
      { path: "/sawanih", label: "سوانح", management: MANAGEMENTS.HIFZIYA },
      { path: "/archive", label: "آرشیف", management: MANAGEMENTS.ARCHIVE },
      {
        path: "/makzan-annual-reports",
        label: "راپور سال تمام",
        management: MANAGEMENTS.MAKHZAN,
      },
      {
        path: "/makzan-receipts",
        label: "رسیدات",
        management: MANAGEMENTS.MAKHZAN,
      },
      {
        path: "/annual-reports-info",
        label: "ارایه معلومات راپور",
        management: MANAGEMENTS.MAKHZAN,
      },
      // ✅ ADD THIS LINE - Master Data Management (Admin Only)
      { path: "/master-data", label: "اساسی معلومات" },
    ];
  }

  // Regular user sees only their management section
  const allItems = {
    [MANAGEMENTS.HIFZIYA]: [
      { path: "/hifziya-hazari", label: "کتاب حاضري" },
      { path: "/hifziya-warada-sadera", label: "وارده صادره" },
      { path: "/sawanih", label: "سوانح" },
    ],
    [MANAGEMENTS.ARCHIVE]: [{ path: "/archive", label: "آرشیف" }],
    [MANAGEMENTS.MAKHZAN]: [
      { path: "/makzan-annual-reports", label: "راپور سال تمام" },
      { path: "/makzan-receipts", label: "رسیدات" },
      { path: "/annual-reports-info", label: "ارایه معلومات راپور" },
    ],
  };

  return allItems[managementId] || [];
};

// =========================
// DASHBOARD BASED ON MANAGEMENT
// =========================

export const getDashboardConfig = () => {
  const managementId = getManagementId();
  const userIsAdmin = isAdmin();

  if (userIsAdmin) {
    return {
      showAllStats: true,
      title: "Admin Dashboard",
      widgets: ["all"],
      allowedManagements: [
        MANAGEMENTS.ARCHIVE,
        MANAGEMENTS.HIFZIYA,
        MANAGEMENTS.MAKHZAN,
      ],
    };
  }

  const configs = {
    [MANAGEMENTS.ARCHIVE]: {
      showAllStats: false,
      title: "Archive Dashboard",
      widgets: ["archives", "receipts"],
    },
    [MANAGEMENTS.HIFZIYA]: {
      showAllStats: false,
      title: "Hifziya Dashboard",
      widgets: ["sawanih", "hazari"],
    },
    [MANAGEMENTS.MAKHZAN]: {
      showAllStats: false,
      title: "Makhzan Dashboard",
      widgets: ["receipts", "reports"],
    },
  };

  return (
    configs[managementId] || {
      showAllStats: false,
      title: "Dashboard",
      widgets: [],
    }
  );
};

// =========================
// ROUTE ACCESS CONTROL
// =========================

export const canAccessRoute = (routePath, requiredManagementId = null) => {
  const admin = isAdmin();

  // Admins can access everything
  if (admin) return true;

  // If no particular management required, allow access
  if (!requiredManagementId) return true;

  // Else check if user belongs to required management
  const userManagementId = getManagementId();
  return userManagementId === requiredManagementId;
};
