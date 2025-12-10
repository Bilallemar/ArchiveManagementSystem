import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

export default function ViewHifziyaWaradaSadera({ open, onClose, report }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>د رسید تفصیلات</DialogTitle>
      <DialogContent dividers>
        {report ? (
          <>
            <DialogContentText>Number: {report.no}</DialogContentText>
            <DialogContentText>
              Organization: {report.org?.name}
            </DialogContentText>
            <DialogContentText>
              LetterNumber: {report.letterNumber}
            </DialogContentText>
            <DialogContentText>
              IncommingDate: {report.incommingDate}
            </DialogContentText>
            <DialogContentText>
              OutgoingDate: {report.outgoingDate}
            </DialogContentText>
            <DialogContentText>summary: {report.summary}</DialogContentText>
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
