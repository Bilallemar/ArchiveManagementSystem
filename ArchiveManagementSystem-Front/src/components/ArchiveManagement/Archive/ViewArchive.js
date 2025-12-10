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

export default function ViewArchive({ open, onClose, archive }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          fontFamily: "B Nazanin",
          fontWeight: "bold",
          textAlign: "right",
        }}
      >
        د آرشیف تفصیلات
      </DialogTitle>
      <DialogContent dividers>
        {archive ? (
          <Box sx={{ textAlign: "right", direction: "rtl" }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                ډول:
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {archive.isIncomming ? "وارده" : "صادره"}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                نمبر سند:
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {archive.docNo || "N/A"}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                تاریخ وارده:
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {archive.incommingDate || "N/A"}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                تاریخ صادره:
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {archive.outgoingDate || "N/A"}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                اداره:
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {archive.org?.name || "N/A"}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                تاریخ تسلیمی:
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {archive.submitedDate || "N/A"}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                نوع سند:
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {archive.docType || "N/A"}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                سال:
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {archive.year || "N/A"}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                ملاحظات:
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {archive.description || "N/A"}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Typography sx={{ textAlign: "right" }}>
            هیڅ آرشیف نه دی ټاکل شوی
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
