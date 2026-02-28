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
import api from "../../../services/api";
import getMakzanSubmissionReportTexts from "../../../helpers/Storage/MakzanSubmissionReport/MakzanSubmissionReportText";


export default function ViewMakzanSubmissionReport({ open, onClose, report }) {
  const { t } = useTranslation("makzanSubmissionReport");
  const texts = getMakzanSubmissionReportTexts(t);

  if (!open || !report) return null;

  const formatFileSize = (bytes) => {
    if (!bytes) return "نامعلوم";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleViewFile = async (fileName) => {
    const loadingToast = toast.loading("⏳ فایل تیاریږي...", {
      style: { textAlign: "right", direction: "rtl" },
    });

    try {
      const response = await api.get(
        `/makzan-annual-reports/download/${encodeURIComponent(fileName)}`,
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

      if (error.response) {
        const { status, data } = error.response;
        let message = "د فایل لیدلو کې ستونزه رامنځته شوه";

        if (status === 404) {
          message =
            data?.message ||
            "فایل په سرور کې نشته\nممکن حذف شوی وي یا هیڅکله اپلوډ شوی نه وي.";
        } else if (status === 401 || status === 403) {
          message = "تاسو د دې فایل لیدلو اجازه نه لرئ";
        } else if (status === 500) {
          message = "سروري ستونزه – مهرباني وکړئ بیا هڅه وکړئ";
        }

        toast.error(message, {
          duration: 6000,
          style: {
            textAlign: "right",
            direction: "rtl",
            whiteSpace: "pre-line",
          },
        });
      } else {
        toast.error("انټرنټ یا سرور سره ستونزه ده", { duration: 4000 });
      }
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
      {/* Title */}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "primary.lighter",
          pb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="h5" fontWeight="bold">
            {texts.viewTitle || "د راپور تفصیلات"}
          </Typography>
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

      {/* Content */}
      <DialogContent dividers sx={{ py: 4, px: 4 }}>
        <Grid container spacing={3}>
          {/* Province */}
          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                {texts.province || "ولایت"}
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                {report.province?.name || "—"}
              </Typography>
            </Box>
          </Grid>

          {/* District */}
          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                {texts.district || "ولسوالي"}
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                {report.district?.name || "—"}
              </Typography>
            </Box>
          </Grid>

          {/* Year */}
          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                {texts.year || "کال"}
              </Typography>
              <Typography variant="body1">{report.year || "—"}</Typography>
            </Box>
          </Grid>

          {/* Document Type */}
          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                {texts.docType || "نوعیت پارسل"}
              </Typography>
              <Typography variant="body1">
                {report.docType?.name || "—"}
              </Typography>
            </Box>
          </Grid>

          {/* Summary Waseqa */}
          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                {texts.summaryWaseqa || "خلص مطلب وثیقه"}
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                {report.summaryWaseqa || "—"}
              </Typography>
            </Box>
          </Grid>

          {/* Description */}
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
          <Grid item xs={12} sx={{ mt: 1 }}>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              color="primary.main"
              gutterBottom
            >
              {texts.attachedFiles || "ضمیمه شوي فایلونه"}{" "}
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
                        "&:last-child": { pb: 1.5 },
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
                هیڅ ضمیمه شوی سند نشته
              </Alert>
            )}
          </Grid>
        </Grid>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ px: 4, py: 2.5 }}>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            minWidth: 120,
            bgcolor: "primary.main",
            "&:hover": { bgcolor: "primary.dark" },
          }}
        >
          {texts.close || "بندول"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
