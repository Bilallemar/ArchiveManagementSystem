import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
} from "@mui/material";

export default function ViewSawanih({ open, onClose, report }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          fontFamily: "B Nazanin",
          fontWeight: "bold",
          textAlign: "right",
        }}
      >
        د سوانح تفصیلات
      </DialogTitle>
      <DialogContent dividers>
        {report ? (
          <Box sx={{ textAlign: "right", direction: "rtl" }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                نوم:
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {report.name || "N/A"}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                د پلار نوم:
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {report.fatherName || "N/A"}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                قید واریده:
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {report.qaidWarida || "N/A"}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                اداره:
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {report.org?.name || "N/A"}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                تاریخ وارده:
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {report.incommingDate || "N/A"}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                تاریخ صادره:
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {report.outgoingDate || "N/A"}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                تعداد صفحات:
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {report.pageQuantity || "N/A"}
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
          <DialogContentText sx={{ textAlign: "right" }}>
            هیڅ ریکارډ نه دی ټاکل شوی
          </DialogContentText>
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
