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
  Stack,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import getAddHazariTexts from "../../../helpers/hifziya/hazari/AddHazariText";
import { downloadFile } from "../../../services/RepositoryManagement/HifziyaHazariAPI";

export default function ViewHazari({ open, onClose, report }) {
  const { t } = useTranslation("addHazari");
  const texts = getAddHazariTexts(t);

  if (!report) return null;

  const handleViewFile = async (fileName) => {
    let loadingToast = null;

    try {
      // Show loading toast
      loadingToast = toast.loading("⏳ فایل لوډ کیږي...", {
        style: { textAlign: "right", direction: "rtl" },
      });

      const response = await downloadFile(fileName);

      // ✅ IMPORTANT: Always dismiss loading toast
      toast.dismiss(loadingToast);

      // Create blob and preview
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
            {texts.view?.title || "د حاضري تفصیلات"}
          </Typography>
          <Chip
            label={`ID: ${report.id}`}
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
          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                {texts.volume || "جلد"}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                {report.volume || "N/A"}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                {texts.type || "نوعیت"}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                {report.type?.name || "N/A"}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                {texts.subType || "فرعي نوعیت"}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                {report.subType?.name || "N/A"}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                {texts.year || "کال"}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                {formatDate(report.year)}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                {texts.org || "اداره"}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                {report.org?.name || "N/A"}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                {texts.description || "ملاحظات / توضیحات"}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                {report.description || "N/A"}
              </Typography>
            </Box>
          </Grid>

          {report.files && report.files.length > 0 && (
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
                  {texts.files || "ضمیمه شوي فایلونه"} ({report.files.length})
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12}>
                <Stack spacing={1.5}>
                  {report.files.map((file, index) => (
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
                        transition: "all 0.2s",
                        "&:hover": {
                          bgcolor: "action.hover",
                          borderColor: "primary.main",
                        },
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
                        title={texts.viewFile || "فایل وګورئ"}
                        sx={{
                          "&:hover": {
                            bgcolor: "primary.light",
                            color: "white",
                          },
                        }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Box>
                  ))}
                </Stack>
              </Grid>
            </>
          )}

          {(!report.files || report.files.length === 0) && (
            <Grid item xs={12}>
              <Alert severity="info" icon={<ErrorOutlineIcon />}>
                <Typography variant="body2">
                  {texts.noFiles || "هیڅ فایل ضمیمه شوی نشته"}
                </Typography>
              </Alert>
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
