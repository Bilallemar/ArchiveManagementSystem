import { all } from "axios";

const getArchiveListTexts = (t) => ({
  // ===== Page =====
  title: t("title"),
  newArchive: t("newArchive"),
  newOutgoing: t("newOutgoing"),
  newIncoming: t("newIncoming"),

  // ====Tabs ====
  outgoing: t("outgoing"),
  incoming: t("incoming"),
  all: t("all"),

  // ===== Actions =====
  view: t("view"),
  edit: t("edit"),
  delete: t("delete"),
  cancel: t("cancel"),

  // ===== Delete Dialog =====
  deleteDialogTitle: t("deleteDialogTitle"),
  deleteDialogText: t("deleteDialogText"),
  deleteSuccess: t("deleteSuccess"),
  deleteError: t("deleteError"),

  // ===== Table Headers =====
  type: t("type"),
  docNo: t("docNo"),
  departmentDate: t("departmentDate"),
  sendDate: t("sendDate"),
  org: t("org"),
  org2: t("org2"),
  submitedDate: t("submitedDate"),
  docType: t("docType"),
  year: t("year"),
  description: t("description"),
  actions: t("actions"),

  // ===== Filters & Search =====
  search: t("search"),
  fieldDocNo: t("fieldDocNo"),
  fieldOrg: t("fieldOrg"),
  fieldYear: t("fieldYear"),
  fieldDocType: t("fieldDocType"),

  // ===== Pagination =====
  rowsPerPage: t("rowsPerPage"),

  // ===== States =====
  loading: t("loading"),
  noData: t("noData"),
});

export default getArchiveListTexts;
