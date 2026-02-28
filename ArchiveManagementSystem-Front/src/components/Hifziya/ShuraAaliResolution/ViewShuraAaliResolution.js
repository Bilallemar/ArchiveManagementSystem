import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Divider,
  Box,
  Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import getShuraAaliResolutionTexts from "../../../helpers/hifziya/ShuraAaliResolutionTexts";

export default function ViewShuraAaliResolution({ open, onClose, resolution }) {
  const { t } = useTranslation("shuraAali");
  const texts = getShuraAaliResolutionTexts(t);

  if (!resolution) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{texts.viewResolution}</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: "grid", gap: 2.5, py: 1 }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {texts.id}:
            </Typography>
            <Typography variant="body1">{resolution.id}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {texts.sendDate}:
            </Typography>
            <Typography variant="body1">
              {resolution.sendDate || "—"}
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {texts.subject}:
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {resolution.subject || "—"}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {texts.senderRef}:
            </Typography>
            <Typography>{resolution.senderReference || "—"}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {texts.title}:
            </Typography>
            <Typography>{resolution.title || "—"}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {texts.type}:
            </Typography>
            <Typography>{resolution.resolutionType || "—"}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {texts.letterNo}:
            </Typography>
            <Typography>{resolution.letterNumber || "—"}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {texts.year}:
            </Typography>
            <Typography>{resolution.approvalYear || "—"}</Typography>
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {texts.remarks}:
            </Typography>
            <Typography sx={{ whiteSpace: "pre-wrap" }}>
              {resolution.remarks || "—"}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={onClose} variant="contained">
          {texts.close}
        </Button>
      </Box>
    </Dialog>
  );
}
