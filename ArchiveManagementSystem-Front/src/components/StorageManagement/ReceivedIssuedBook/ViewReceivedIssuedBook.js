import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

export default function ViewReceivedIssuedBook({ open, onClose, book }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>د کتاب تفصیلات</DialogTitle>
      <DialogContent dividers>
        {book ? (
          <>
            <DialogContentText>
              Book Number: {book.bookNumber || "N/A"}
            </DialogContentText>
            <DialogContentText>
              Sender: {book.sender || "N/A"}
            </DialogContentText>
            <DialogContentText>
              Recipient: {book.recipient || "N/A"}
            </DialogContentText>
            <DialogContentText>
              Letter Number: {book.letterNumber || "N/A"}
            </DialogContentText>
            <DialogContentText>
              Issued Date:{" "}
              {book.issuedDate
                ? new Date(book.issuedDate).toLocaleDateString()
                : "N/A"}
            </DialogContentText>
            <DialogContentText>
              Received Date:{" "}
              {book.receivedDate
                ? new Date(book.receivedDate).toLocaleDateString()
                : "N/A"}
            </DialogContentText>
            <DialogContentText>
              Summary: {book.summary || "N/A"}
            </DialogContentText>
            <DialogContentText>
              Subject Type: {book.subjectType || "N/A"}
            </DialogContentText>
            <DialogContentText>
              Remarks: {book.remarks || "N/A"}
            </DialogContentText>
          </>
        ) : (
          <DialogContentText>هیڅ ریکارډ نه دی ټاکل شوی</DialogContentText>
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
