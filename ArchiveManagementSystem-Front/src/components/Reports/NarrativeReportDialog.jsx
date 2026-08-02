// components/reports/NarrativeReportDialog.jsx
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

export default function NarrativeReportDialog({
  open,
  onClose,
  narrative,
  loading,
}) {
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
            {narrative?.title || "Archive Management Department Report"}
          </Typography>
          {narrative?.periodLabel && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {narrative.periodLabel}
            </Typography>
          )}
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 3 }}>
        {loading ? (
          <Typography variant="body2" color="text.secondary">
            Generating report...
          </Typography>
        ) : !narrative ? (
          <Typography variant="body2" color="text.secondary">
            No report data available.
          </Typography>
        ) : (
          <Stack spacing={3}>
            <Box>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                color="primary.main"
                gutterBottom
              >
                Introduction
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                {narrative.introduction}
              </Typography>
            </Box>

            {narrative.sections?.map((section, idx) => (
              <Box key={idx}>
                <Divider sx={{ mb: 2 }} />
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  color="primary.main"
                  gutterBottom
                >
                  {section.heading}
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                  {section.body}
                </Typography>
              </Box>
            ))}

            <Box>
              <Divider sx={{ mb: 2 }} />
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                color="primary.main"
                gutterBottom
              >
                Conclusion
              </Typography>
              <Typography
                variant="body1"
                sx={{ lineHeight: 1.8, fontStyle: "italic" }}
              >
                {narrative.conclusion}
              </Typography>
            </Box>
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
