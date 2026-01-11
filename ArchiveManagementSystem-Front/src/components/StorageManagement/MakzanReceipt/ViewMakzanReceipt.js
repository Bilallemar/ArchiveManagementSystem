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

export default function ViewMakzanReceipt({ open, onClose, receipt }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          fontFamily: "B Nazanin",
          fontWeight: "bold",
          textAlign: "right",
        }}
      >
        د رسید تفصیلات
      </DialogTitle>
      <DialogContent dividers>
        {receipt ? (
          <Box sx={{ textAlign: "right", direction: "rtl" }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                نمبر:
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {receipt.no || "N/A"}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                نمبر سند:
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {receipt.docNo || "N/A"}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                اداره:
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {receipt.org?.name || "N/A"}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                نمبر مکتوب:
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {receipt.letterNo || "N/A"}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                تاریخ مکتوب:
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {receipt.letterDate || "N/A"}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                نوع موضوع:
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {receipt.subjectType || "N/A"}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                ملاحظات:
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {receipt.description || "N/A"}
              </Typography>
            </Box>

            {receipt.files && receipt.files.length > 0 && (
              <>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    فایل:
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {receipt.files[0].filePath}
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        ) : (
          <Typography sx={{ textAlign: "right" }}>
            هیڅ رسید نه دی ټاکل شوی
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
