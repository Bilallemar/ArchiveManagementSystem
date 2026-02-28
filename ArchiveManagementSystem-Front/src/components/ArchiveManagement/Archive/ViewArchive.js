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
  Divider,
  Chip,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import getArchiveTexts from "../../../helpers/archive/getArchiveTexts";
import { formatHijriDateForDisplay } from "../../../utils/hijriDateUtils";

export default function ViewArchive({ open, onClose, archive }) {
  const { t } = useTranslation("archive");
  const texts = getArchiveTexts(t);

  if (!archive) return null;

  const InfoRow = ({ label, value }) => (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid item xs={4}>
        <Typography variant="body2" color="text.secondary" fontWeight="bold">
          {label}:
        </Typography>
      </Grid>
      <Grid item xs={8}>
        <Typography variant="body1">{value || "—"}</Typography>
      </Grid>
    </Grid>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="h5" component="span">
            {texts.viewTitle || "معلومات آرشیف"}
          </Typography>
          <Chip
            label={
              archive.direction === "INCOMING"
                ? "وارده (Incoming)"
                : "صادره (Outgoing)"
            }
            color={archive.direction === "INCOMING" ? "success" : "primary"}
            size="small"
          />
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ py: 2 }}>
          {/* Document Number */}
          <InfoRow
            label={texts.docNo || "نمبر مکتوب / پارسل"}
            value={archive.docNo}
          />

          {/* Sender */}
          <InfoRow
            label={texts.sender || "مرسل (Sender)"}
            value={archive.senderOrg?.name}
          />

          {/* Receiver */}
          <InfoRow
            label={texts.receiver || "مرسل الیه (Receiver)"}
            value={archive.receiverOrg?.name}
          />

          <Divider sx={{ my: 2 }} />

          {/* Document Type */}
          <InfoRow
            label={texts.docType || "نوعیت پارسل"}
            value={archive.docType?.name}
          />

          {/* Send Date */}
          <InfoRow
            label={texts.sendDate || "تاریخ ارسال"}
            value={formatHijriDateForDisplay(archive.sendDate)}
          />

          {/* Department Date */}
          <InfoRow
            label={texts.departmentDate || "تاریخ شعبه"}
            value={formatHijriDateForDisplay(archive.departmentDate)}
          />

          <Divider sx={{ my: 2 }} />

          {/* Description */}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight="bold"
                sx={{ mb: 1 }}
              >
                {texts.description || "ملاحظات / Remarks"}:
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  backgroundColor: "#f5f5f5",
                  p: 2,
                  borderRadius: 1,
                  minHeight: "80px",
                  whiteSpace: "pre-wrap",
                }}
              >
                {archive.description || "—"}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">
          {texts.close || "تړل"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
