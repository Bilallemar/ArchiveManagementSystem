import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";
import FolderOffIcon from "@mui/icons-material/FolderOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import getSawanihTexts from "../../../helpers/hifziya/sawanih/sawanihText";
import { formatHijriDateForDisplay } from "../../../utils/hijriDateUtils";
import { convertToPersianNumbers } from "../../../utils/numberUtils";
// Assuming you have a downloadFile function similar to other modules
import { downloadFile } from "../../../services/RepositoryManagement/SawanihAPI";

export default function ViewSawanih({ open, onClose, report }) {
  const { t } = useTranslation("sawanih");
  const texts = getSawanihTexts(t);

  if (!open || !report) return null;

  const isSawanih = report?.isSawanih === true;

  const handleViewFile = async (fileName) => {
    let loadingToast = null;

    try {
      loadingToast = toast.loading("⏳ فایل تیاریږي...", {
        style: { textAlign: "right", direction: "rtl" },
      });

      const response = await downloadFile(fileName);
      toast.dismiss(loadingToast);

      const contentType =
        response.headers["content-type"] || "application/octet-stream";
      const blob = new Blob([response.data], { type: contentType });
      const url = URL.createObjectURL(blob);

      const previewWindow = window.open(url, "_blank");

      if (
        !previewWindow ||
        previewWindow.closed ||
        typeof previewWindow.closed === "undefined"
      ) {
        toast.warning("پاپ اپ بلاک شوی – فایل ډاونلوډ کیږي", {
          duration: 4000,
        });
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        toast.success("فایل خلاص شو ✓", { duration: 2500 });
      }

      setTimeout(() => URL.revokeObjectURL(url), 90000);
    } catch (error) {
      if (loadingToast) toast.dismiss(loadingToast);
      console.error("File view failed:", error);

      if (error.response?.status === 404) {
        toast.error("فایل په سرور کې نشته یا حذف شوی دی", { duration: 5000 });
      } else {
        toast.error("د فایل لیدلو پر مهال ستونزه رامنځته شوه", {
          duration: 4000,
        });
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "نامعلوم";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      {/* Title */}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: isSawanih ? "warning.lighter" : "primary.lighter",
          pb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="h5" fontWeight="bold">
            {isSawanih ? "د سوانح تفصیلات" : "د استخدام تفصیلات"}
          </Typography>

          <Chip
            label={isSawanih ? "سوانح" : "استخدام"}
            size="small"
            color={isSawanih ? "warning" : "primary"}
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />

          <Chip
            label={`ID: ${report.id}`}
            size="small"
            color="default"
            variant="outlined"
          />
        </Box>

        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 4, px: 4 }}>
        <Grid container spacing={3}>
          {/* Row 1 */}
          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                {texts.name || "نوم"}
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                {report.name || "—"}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                {texts.fatherName || "د پلار نوم"}
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                {report.fatherName || "—"}
              </Typography>
            </Box>
          </Grid>

          {/* Row 2 */}
          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                {texts.org || "اداره / څانګه"}
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {report.org?.name || "—"}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                {texts.pageQuantity || "تعداد صفحات"}
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {isSawanih
                  ? "—"
                  : report.pageQuantity
                    ? convertToPersianNumbers(report.pageQuantity)
                    : "—"}
              </Typography>
            </Box>
          </Grid>

          {/* Dates */}
          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                {texts.incommingDate || "تاریخ وارده"}
              </Typography>
              <Typography variant="body1">
                {formatHijriDateForDisplay(report.incommingDate) || "—"}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                {texts.outgoingDate || "تاریخ صادره"}
              </Typography>
              <Typography variant="body1">
                {formatHijriDateForDisplay(report.outgoingDate) || "—"}
              </Typography>
            </Box>
          </Grid>

          {/* Description */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              color="primary.main"
              gutterBottom
            >
              {texts.description || "ملاحظات / توضیحات"}
            </Typography>
            <Card variant="outlined" sx={{ bgcolor: "grey.50" }}>
              <CardContent sx={{ whiteSpace: "pre-wrap", py: 2 }}>
                <Typography variant="body1">
                  {report.description || "هیڅ ملاحظات ثبت شوي نه دي"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Files Section */}
          <Grid item xs={12} sx={{ mt: 3 }}>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              color="primary.main"
              gutterBottom
            >
              ضمیمه شوي اسناد{" "}
              {report.files?.length ? `(${report.files.length})` : ""}
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {report.files?.length > 0 ? (
              <Stack spacing={1.5}>
                {report.files.map((file, index) => (
                  <Card
                    key={index}
                    variant="outlined"
                    sx={{
                      transition: "all 0.2s",
                      "&:hover": {
                        borderColor: "primary.main",
                        bgcolor: "action.hover",
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        py: 1.5,
                        px: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          flex: 1,
                        }}
                      >
                        <AttachFileIcon color="primary" />
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {file.fileName || `فایل ${index + 1}`}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {file.fileType || "نامعلوم"} •{" "}
                            {formatFileSize(file.fileSize)}
                          </Typography>
                        </Box>
                      </Box>

                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleViewFile(file.fileName)}
                        title="فایل خلاص کړئ / ډاونلوډ کړئ"
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            ) : (
              <Alert
                severity="info"
                icon={<FolderOffIcon />}
                sx={{ bgcolor: "info.lighter" }}
              >
                هیڅ ضمیمه شوی سند نشته
              </Alert>
            )}
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 4, py: 2.5 }}>
        <Button variant="contained" onClick={onClose} sx={{ minWidth: 120 }}>
          {texts.close || "بندول"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
