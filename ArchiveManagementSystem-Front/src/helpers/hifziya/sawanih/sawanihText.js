import { all } from "axios";

const getSawanihTexts = (t) => ({
  // ===== Page Titles =====
  title: t("title"),
  newRecord: t("newRecord"),
  editRecord: t("editRecord"),
  newSawanih: t("newSawanih"),
  newIsteqdam: t("newIsteqdam"),
  all: t("all"),
  sawanih: t("sawanih"),
  isteqdam: t("isteqdam"),
  
  // ===== Fields / Columns =====
  name: t("name"),
  fatherName: t("fatherName"),
  qaidWarida: t("qaidWarida"),
  incommingDate: t("incommingDate"), // که په سیستم کې دواړه کارېږي
  outgoingDate: t("outgoingDate"),
  organization: t("organization"),
  org: t("org"),
  pageQuantity: t("pageQuantity"),
  description: t("description"),
  recordStatus: t("recordStatus"),
  // ===== Actions =====
  actions: t("actions"),
  view: t("view"),
  edit: t("edit"),
  delete: t("delete"),
  cancel: t("cancel"),
  close: t("close"),
  save: t("save"),
  saving: t("saving"),
  back: t("back"),

  // ===== Delete Dialog =====
  deleteDialogTitle: t("deleteDialogTitle"),
  deleteDialogText: t("deleteDialogText"),
  deleteSuccess: t("deleteSuccess"),
  deleteError: t("deleteError"),

  // ===== Filters & Search =====
  search: t("search"),
  fieldOrg: t("fieldOrg"),

  // ===== Pagination =====
  rowsPerPage: t("rowsPerPage"),

  // ===== States / Messages =====
  loading: t("loading"),
  loadError: t("loadError"),
  noData: t("noData"),
  notAvailable: t("notAvailable"),
  noArchiveSelected: t("noArchiveSelected"),
});

export default getSawanihTexts;
