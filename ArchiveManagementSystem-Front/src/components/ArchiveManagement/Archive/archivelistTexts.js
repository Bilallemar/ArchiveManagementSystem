const getArchiveListTexts = (t) => ({
  // ===== Page =====
  title: t("title"),
  newArchive: t("newArchive"),

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
  docNo: t("docNo"),
  incommingDate: t("incommingDate"),
  outgoingDate: t("outgoingDate"),
  org: t("org"),
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
