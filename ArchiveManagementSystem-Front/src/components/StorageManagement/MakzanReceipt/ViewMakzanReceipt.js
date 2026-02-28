import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
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
import getMakzanReceiptTexts from "../../../helpers/Storage/MakzanReceipt/MakzanReceiptText";
import api from "../../../services/api";
import { formatHijriDateForDisplay } from "../../../utils/hijriDateUtils";

export default function ViewMakzanReceipt({ open, onClose, receipt }) {
  const { t } = useTranslation("makzanReceipt");
  const texts = getMakzanReceiptTexts(t);

  if (!receipt) return null;
  const downloadReceiptFile = async (fileName) => {
    try {
      const response = await api.get(
        `/makzan-receipts/download/${encodeURIComponent(fileName)}`,
        {
          responseType: "blob",
        },
      );
      return response;
    } catch (error) {
      console.error("Download error:", error);
      throw error;
    }
  };
  const handleViewFile = async (fileName) => {
    let loadingToast = null;

    try {
      // Show loading toast
      loadingToast = toast.loading("⏳ فایل لوډ کیږي...", {
        style: { textAlign: "right", direction: "rtl" },
      });

      const response = await downloadReceiptFile(fileName);

      // ✅ IMPORTANT: Always dismiss loading toast
      toast.dismiss(loadingToast);

      // Create blob and preview
      const contentType =
        response.headers?.["content-type"] || "application/octet-stream";

      const blob = new Blob([response.data], { type: contentType });
      const url = URL.createObjectURL(blob);

      const previewWindow = window.open(url, "_blank");

      if (
        !previewWindow ||
        previewWindow.closed ||
        typeof previewWindow.closed === "undefined"
      ) {
        toast.warning("⚠️ پاپ اپ بلاک شوی – فایل ډاونلوډ کیږي", {
          duration: 3000,
          style: { textAlign: "right", direction: "rtl" },
        });
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        toast.success("✅ فایل خلاص شو", {
          duration: 2000,
          style: { textAlign: "right", direction: "rtl" },
        });
      }

      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (error) {
      // ✅ IMPORTANT: Dismiss loading toast in case of error
      if (loadingToast) {
        toast.dismiss(loadingToast);
      }

      console.error("File preview failed:", error);

      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;

        if (status === 404) {
          // File not found - show clear Pashto message
          const message =
            errorData?.message ||
            "❌ فایل په سرور کې نشته\n\nدا فایل شاید:\n• حذف شوی وي\n• هیڅکله اپلوډ نه و شوی\n• بل ځای ته لیږدول شوی وي\n\nمهرباني وکړئ د سیسټم منیجر سره اړیکه ونیسئ.";

          toast.error(message, {
            duration: 6000,
            icon: "❌",
            style: {
              background: "#fee",
              color: "#c00",
              fontSize: "14px",
              fontWeight: "bold",
              textAlign: "right",
              direction: "rtl",
              whiteSpace: "pre-line",
            },
          });

          console.error("فایل ونه موندل شو:", fileName);
          console.error("پیغام:", errorData?.message);
        } else if (status === 401 || status === 403) {
          toast.error("🔒 تاسې د دې فایل لیدلو اجازه نه لرئ", {
            duration: 4000,
            style: { textAlign: "right", direction: "rtl" },
          });
        } else if (status === 500) {
          const message =
            errorData?.message || "❌ سرور کې ستونزه ده – بیا هڅه وکړئ";
          toast.error(message, {
            duration: 5000,
            style: { textAlign: "right", direction: "rtl" },
          });
        } else {
          toast.error(`❌ د فایل د لیدلو کې ستونزه (${status})`, {
            duration: 4000,
            style: { textAlign: "right", direction: "rtl" },
          });
        }
      } else if (error.request) {
        toast.error("📡 د انټرنټ سره تړاو نشته", {
          duration: 4000,
          style: { textAlign: "right", direction: "rtl" },
        });
      } else {
        toast.error("❌ د فایل د لیدلو کې ستونزه", {
          duration: 4000,
          style: { textAlign: "right", direction: "rtl" },
        });
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
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
      {/* Header */}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 2,
          bgcolor: "primary.lighter",
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {texts.viewDetails || "د رسید تفصیلات"}
          </Typography>
          <Chip
            label={`ID: ${receipt.id}`}
            size="small"
            sx={{ mt: 1 }}
            color="primary"
            variant="outlined"
          />
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 3 }}>
        <Grid container spacing={3}>
          {/* No */}
          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                {texts.department || "شمېره"}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                {receipt.department || "N/A"}
              </Typography>
            </Box>
          </Grid>

          {/* Doc No */}
          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                {texts.docNo || "د سند شمېره"}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                {receipt.docNo || "N/A"}
              </Typography>
            </Box>
          </Grid>

          {/* Organization */}
          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                {texts.org || "اداره"}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                {receipt.org?.name || "N/A"}
              </Typography>
            </Box>
          </Grid>

          {/* Letter No */}
          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                {texts.letterNo || "شمېره مکتوب"}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                {receipt.letterNo || "N/A"}
              </Typography>
            </Box>
          </Grid>

          {/* Letter Date */}
          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                {texts.letterDate || "نیټه مکتوب"}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                {formatHijriDateForDisplay(receipt.letterDate)}
              </Typography>
            </Box>
          </Grid>

          {/* Subject Type */}
          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                {texts.subjectType || "موضوع ډول"}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                {receipt.subjectType || "N/A"}
              </Typography>
            </Box>
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                {texts.description || "توضیحات"}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                {receipt.description || "N/A"}
              </Typography>
            </Box>
          </Grid>

          {/* Files Section */}
          {receipt.files && receipt.files.length > 0 && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: "bold",
                    mb: 2,
                    color: "primary.main",
                    mt: 2,
                  }}
                >
                  {texts.files || "ضمیمه شوي فایلونه"} ({receipt.files.length})
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12}>
                <Stack spacing={1.5}>
                  {receipt.files.map((file, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: 2,
                        bgcolor: "background.neutral",
                        borderRadius: 1,
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <AttachFileIcon color="primary" />
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "medium" }}
                          >
                            {file.fileName || `File ${index + 1}`}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {file.fileType || "نامعلوم"} •{" "}
                            {file.fileSize
                              ? `${(file.fileSize / 1024).toFixed(2)} KB`
                              : "نامعلوم"}
                          </Typography>
                        </Box>
                      </Box>

                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleViewFile(file.fileName)}
                        title="فایل وګورئ"
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Box>
                  ))}
                </Stack>
              </Grid>
            </>
          )}

          {/* No Files */}
          {(!receipt.files || receipt.files.length === 0) && (
            <Grid item xs={12}>
              <Box
                sx={{
                  textAlign: "center",
                  py: 4,
                  bgcolor: "background.neutral",
                  borderRadius: 1,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {texts.noFiles || "هیڅ فایل ضمیمه شوی نشته"}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="contained" color="primary">
          {texts.close || "بندول"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
