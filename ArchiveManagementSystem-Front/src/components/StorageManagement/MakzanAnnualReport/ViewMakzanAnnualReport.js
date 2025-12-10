import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
} from "@mui/material";

export default function ViewMakzanAnnualReport({ open, onClose, report }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          fontFamily: "B Nazanin",
          fontWeight: "bold",
          textAlign: "right",
        }}
      >
        د راپور تفصیلات
      </DialogTitle>
      <DialogContent dividers>
        {report ? (
          <Box sx={{ textAlign: "right", direction: "rtl" }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                آدرس:
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {report.address || "N/A"}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                سال:
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {report.year || "N/A"}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                نوع سند:
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {report.docType || "N/A"}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                خلاصه وثیقه:
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {report.summaryWaseqa || "N/A"}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                ملاحظات:
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {report.description || "N/A"}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Typography sx={{ textAlign: "right" }}>
            هیڅ راپور نه دی ټاکل شوی
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          بندول
        </Button>
      </DialogActions>
    </Dialog>
  );
}
