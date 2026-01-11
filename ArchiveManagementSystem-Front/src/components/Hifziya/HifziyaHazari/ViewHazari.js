import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

export default function ViewHazari({ open, onClose, report }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>د رسید تفصیلات</DialogTitle>
      <DialogContent dividers>
        {report ? (
          <>
            <DialogContentText>Type : {report.type?.name}</DialogContentText>

            <DialogContentText>
              Year: {new Date(report.year).toLocaleDateString()}
            </DialogContentText>
            <DialogContentText>
              Organization: {report.org?.name}
            </DialogContentText>
            <DialogContentText>
              Description: {report.description}
            </DialogContentText>

            {/* عکس ښودل */}
            {/* {receipt.attachments && receipt.attachments.length > 0 && (
              <img
                src={`http://localhost:8081/api/receipts/download/${receipt.attachments[0].fileName}`}
                alt={receipt.attachments[0].fileName}
                style={{
                  maxWidth: "100%",
                  marginTop: "20px",
                  borderRadius: "8px",
                }}
              />
            )} */}
          </>
        ) : (
          <DialogContentText>هیڅ رسید نه دی ټاکل شوی</DialogContentText>
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
