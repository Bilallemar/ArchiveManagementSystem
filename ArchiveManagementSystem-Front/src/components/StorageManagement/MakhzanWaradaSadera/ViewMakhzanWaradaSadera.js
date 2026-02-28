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
import getMakhzanWaradaSaderaTexts from "../../../helpers/Storage/MakhzanwSaradasSadera/getMakhzanWaradaSaderaTexts";
import api from "../../../services/api";
import { formatHijriDateForDisplay } from "../../../utils/hijriDateUtils";



// Your API service (must return Blob response)
import { downloadFile } from "../../../services/StorageManagement/MakhzanWaradaSaderaAPI";

export default function ViewMakhzanWaradaSadera({ open, onClose, record }) {
  const { t } = useTranslation("makhzanWaradaSadera");
  const texts = getMakhzanWaradaSaderaTexts(t);

  if (!open || !record) return null;

  const direction = record.direction || "INCOMING";

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("fa-AF", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "نامعلوم";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const downloadHifziyaFile = async (fileName) => {
    try {
      const response = await api.get(
        `/hifziya-warada-sadera/download/${encodeURIComponent(fileName)}`,
        { responseType: "blob" },
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  const handleViewFile = async (fileName) => {
    let loadingToast = toast.loading("⏳ فایل تیاریږي...", {
      style: { textsAlign: "right", direction: "rtl" },
    });

    try {
      const response = await downloadHifziyaFile(fileName);
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
            textsAlign: "right",
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
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor:
            direction === "INCOMING" ? "success.lighter" : "primary.lighter",
          pb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="h5" fontWeight="bold">
            {texts.viewTitle || "د لاسوند تفصیلات"}
          </Typography>
          <Chip
            label={direction === "INCOMING" ? "وارده" : "صادره"}
            size="medium"
            sx={{
              fontWeight: 600,
              bgcolor:
                direction === "INCOMING" ? "success.main" : "primary.main",
              color: "white",
              px: 1.5,
            }}
          />
          <Chip
            label={`ID: ${record.id}`}
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
              <Typography variant="caption" color="texts.secondary" gutterBottom>
                {texts.viewNumber || "شمېره"}
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                {record.no || "—"}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="caption" color="texts.secondary" gutterBottom>
                {texts.viewOrganization || "اداره"}
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                {record.org?.name || "—"}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="caption" color="texts.secondary" gutterBottom>
                {texts.viewLetterNumber || "شمېره مکتوب"}
              </Typography>
              <Typography variant="body1">
                {record.letterNumber || "—"}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="caption" color="texts.secondary" gutterBottom>
                {texts.viewIncommingDate || "تاریخ وارده"}
              </Typography>
              <Typography variant="body1">
                { formatHijriDateForDisplay(record.incommingDate) || "—"}
              </Typography>
            </Box>
          </Grid>

          {direction === "OUTGOING" && (
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography
                  variant="caption"
                  color="texts.secondary"
                  gutterBottom
                >
                  {texts.viewOutgoingDate || "تاریخ صادره"}
                </Typography>
                <Typography variant="body1">
                  {formatHijriDateForDisplay(record.outgoingDate) || "—"}
                </Typography>
              </Box>
            </Grid>
          )}
          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="caption" color="texts.secondary" gutterBottom>
                {texts.viewSummary || "لنډیز"}
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                {record.summary || "—"}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="caption" color="texts.secondary" gutterBottom>
                {texts.viewSubjectType || "د موضوع نوع"}
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                {record.subjectType || "—"}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box>
              <Typography variant="caption" color="texts.secondary" gutterBottom>
                {texts.viewDescription || "ملاحظات"}
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                {record.description || "—"}
              </Typography>
            </Box>
          </Grid>

          {/* Files Section */}
          <Grid item xs={12} sx={{ mt: 3 }}>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              color="primary.main"
              gutterBottom
            >
              {texts.viewFiles || "ضمیمه شوي اسناد"}{" "}
              {record.files?.length ? `(${record.files.length})` : ""}
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {record.files?.length > 0 ? (
              <Stack spacing={1.5}>
                {record.files.map((file, index) => (
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
                          <Typography variant="caption" color="texts.secondary">
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

      <DialogActions sx={{ px: 4, py: 2.5 }}>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            minWidth: 120,
            bgcolor: direction === "INCOMING" ? "success.main" : "primary.main",
            "&:hover": {
              bgcolor:
                direction === "INCOMING" ? "success.dark" : "primary.dark",
            },
          }}
        >
          {texts.viewClose || "بندول"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
