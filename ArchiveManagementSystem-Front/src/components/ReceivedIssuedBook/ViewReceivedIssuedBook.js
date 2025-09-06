import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

export default function ViewReceivedIssuedBook({ open, onClose, receipt }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>د رسید تفصیلات</DialogTitle>
      <DialogContent dividers>
        {receipt ? (
          <>
            <DialogContentText>
              Serial Number: {receipt.serialNumber}
            </DialogContentText>
            <DialogContentText>
              Archive Number: {receipt.archiveNumber}
            </DialogContentText>
            <DialogContentText>
              Department: {receipt.department}
            </DialogContentText>
            <DialogContentText>
              Letter Number: {receipt.letterNumber}
            </DialogContentText>
            <DialogContentText>
              Letter Date: {new Date(receipt.letterDate).toLocaleDateString()}
            </DialogContentText>
            <DialogContentText>Sender: {receipt.sender}</DialogContentText>
            <DialogContentText>
              Recipient: {receipt.recipient}
            </DialogContentText>
            <DialogContentText>
              Subject Type: {receipt.subjectType}
            </DialogContentText>
            <DialogContentText>Remarks: {receipt.remarks}</DialogContentText>

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
