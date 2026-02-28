import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Box,
  IconButton,
  Chip,
  Divider,
  Card,
  CardContent,
  Stack,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import FolderOffIcon from "@mui/icons-material/FolderOff";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import getSawanihTexts from "../../../helpers/hifziya/sawanih/sawanihText";
import { formatHijriDateForDisplay } from "../../../utils/hijriDateUtils";
import { convertToPersianNumbers } from "../../../utils/numberUtils";
import api from "../../../services/api";

export default function ViewSawanih({ open, onClose, report }) {
  const { t } = useTranslation("sawanih");
  const texts = getSawanihTexts(t);

  if (!open || !report) return null;

  const isSawanih = report?.isSawanih === true;

  const formatFileSize = (bytes) => {
    if (!bytes) return "نامعلوم";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleViewFile = async (fileName) => {
    let loadingToast = toast.loading("⏳ فایل تیاریږي...", {
      style: { textAlign: "right", direction: "rtl" },
    });

    try {
      const response = await api.get(
        `/sawanih/download/${encodeURIComponent(fileName)}`,
        { responseType: "blob" },
      );

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
      toast.dismiss(loadingToast);

      let message = "د فایل لیدلو کې ستونزه رامنځته شوه";

      if (error.response) {
        const { status, data } = error.response;
        if (status === 404) {
          message = data?.message || "فایل په سرور کې نشته";
        } else if (status === 401 || status === 403) {
          message = "تاسو د دې فایل لیدلو اجازه نه لرئ";
        } else if (status === 500) {
          message = "سروري ستونزه – مهرباني وکړئ بیا هڅه وکړئ";
        }
      }

      toast.error(message, {
        duration: 6000,
        style: { textAlign: "right", direction: "rtl", whiteSpace: "pre-line" },
      });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
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
            {texts.viewTitle || "د سوانح تفصیلات"}
          </Typography>
          <Chip
            label={isSawanih ? "سوانح" : "استخدام"}
            size="medium"
            sx={{
              fontWeight: 600,
              bgcolor: isSawanih ? "warning.main" : "primary.main",
              color: "white",
              px: 1.5,
            }}
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
          {/* Main Info */}
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

          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                قید وارده
              </Typography>
              <Typography variant="body1">
                {report.qaidWarida || "—"}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                {texts.org || "اداره"}
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                {report.org?.name || "—"}
              </Typography>
            </Box>
          </Grid>

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

          {!isSawanih && (
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  gutterBottom
                >
                  {texts.pageQuantity || "تعداد صفحات"}
                </Typography>
                <Typography variant="body1">
                  {report.pageQuantity
                    ? convertToPersianNumbers(report.pageQuantity)
                    : "—"}
                </Typography>
              </Box>
            </Grid>
          )}

          <Grid item xs={12}>
            <Box>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                {texts.description || "ملاحظات"}
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                {report.description || "—"}
              </Typography>
            </Box>
          </Grid>

          {/* Files Section */}
          <Grid item xs={12} sx={{ mt: 4 }}>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              color="primary.main"
              gutterBottom
            >
              {texts.viewFiles || "ضمیمه شوي فایلونه"}{" "}
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
                      "&:hover": {
                        borderColor: "primary.main",
                        bgcolor: "action.hover",
                      },
                      transition: "all 0.2s",
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
                sx={{
                  bgcolor: "info.lighter",
                  border: "1px solid",
                  borderColor: "info.main",
                }}
              >
                هیڅ ضمیمه شوی فایل نشته
              </Alert>
            )}
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 4, py: 2.5 }}>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            minWidth: 120,
            bgcolor: isSawanih ? "primary.main" : "success.main",
            "&:hover": {
              bgcolor: isSawanih ? "success.dark" : "primary.dark",
            },
          }}
        >
          {texts.close || "بندول"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
