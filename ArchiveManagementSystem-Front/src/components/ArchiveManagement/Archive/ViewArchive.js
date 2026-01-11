// import React from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Box,
//   Typography,
//   Divider,
// } from "@mui/material";

// export default function ViewArchive({ open, onClose, archive }) {
//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
//       <DialogTitle
//         sx={{
//           fontWeight: "bold",
//           textAlign: "right",
//         }}
//       >
//         د آرشیف تفصیلات
//       </DialogTitle>
//       <DialogContent dividers>
//         {archive ? (
//           <Box sx={{ textAlign: "right", direction: "rtl" }}>
//             <Box sx={{ mb: 2 }}>
//               <Typography variant="subtitle2" color="text.secondary">
//                 ډول:
//               </Typography>
//               <Typography variant="body1" sx={{ mb: 1 }}>
//                 {archive.isIncomming ? "وارده" : "صادره"}
//               </Typography>
//             </Box>

//             <Divider sx={{ my: 1 }} />

//             <Box sx={{ mb: 2 }}>
//               <Typography variant="subtitle2" color="text.secondary">
//                 نمبر سند:
//               </Typography>
//               <Typography variant="body1" sx={{ mb: 1 }}>
//                 {archive.docNo || "N/A"}
//               </Typography>
//             </Box>

//             <Divider sx={{ my: 1 }} />

//             <Box sx={{ mb: 2 }}>
//               <Typography variant="subtitle2" color="text.secondary">
//                 تاریخ وارده:
//               </Typography>
//               <Typography variant="body1" sx={{ mb: 1 }}>
//                 {archive.incommingDate || "N/A"}
//               </Typography>
//             </Box>

//             <Divider sx={{ my: 1 }} />

//             <Box sx={{ mb: 2 }}>
//               <Typography variant="subtitle2" color="text.secondary">
//                 تاریخ صادره:
//               </Typography>
//               <Typography variant="body1" sx={{ mb: 1 }}>
//                 {archive.outgoingDate || "N/A"}
//               </Typography>
//             </Box>

//             <Divider sx={{ my: 1 }} />

//             <Box sx={{ mb: 2 }}>
//               <Typography variant="subtitle2" color="text.secondary">
//                 اداره:
//               </Typography>
//               <Typography variant="body1" sx={{ mb: 1 }}>
//                 {archive.org?.name || "N/A"}
//               </Typography>
//             </Box>

//             <Divider sx={{ my: 1 }} />

//             <Box sx={{ mb: 2 }}>
//               <Typography variant="subtitle2" color="text.secondary">
//                 تاریخ تسلیمی:
//               </Typography>
//               <Typography variant="body1" sx={{ mb: 1 }}>
//                 {archive.submitedDate || "N/A"}
//               </Typography>
//             </Box>

//             <Divider sx={{ my: 1 }} />

//             <Box sx={{ mb: 2 }}>
//               <Typography variant="subtitle2" color="text.secondary">
//                 نوع سند:
//               </Typography>
//               <Typography variant="body1" sx={{ mb: 1 }}>
//                 {archive.docType || "N/A"}
//               </Typography>
//             </Box>

//             <Divider sx={{ my: 1 }} />

//             <Box sx={{ mb: 2 }}>
//               <Typography variant="subtitle2" color="text.secondary">
//                 سال:
//               </Typography>
//               <Typography variant="body1" sx={{ mb: 1 }}>
//                 {archive.year || "N/A"}
//               </Typography>
//             </Box>

//             <Divider sx={{ my: 1 }} />

//             <Box sx={{ mb: 2 }}>
//               <Typography variant="subtitle2" color="text.secondary">
//                 ملاحظات:
//               </Typography>
//               <Typography variant="body1" sx={{ mb: 1 }}>
//                 {archive.description || "N/A"}
//               </Typography>
//             </Box>
//           </Box>
//         ) : (
//           <Typography sx={{ textAlign: "right" }}>
//             هیڅ آرشیف نه دی ټاکل شوی
//           </Typography>
//         )}
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} color="primary">
//           بندول
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

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
import { useTranslation } from "react-i18next";
import ViewArchiveTexts from "./ViewArchiveTexts";

export default function ViewArchive({ open, onClose, archive }) {
  const { t } = useTranslation("ViewArchive");
  const text = ViewArchiveTexts(t);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          fontWeight: "bold",
          textAlign: "right",
        }}
      >
        {text.title}
      </DialogTitle>

      <DialogContent dividers>
        {archive ? (
          <Box sx={{ textAlign: "right", direction: "rtl" }}>
            {/* ===== Type ===== */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {text.type}:
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {archive.isIncomming ? text.incoming : text.outgoing}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            {/* ===== Document Number ===== */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {text.docNo}:
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {archive.docNo || text.notAvailable}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            {/* ===== Incoming Date ===== */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {text.incomingDate}:
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {archive.incommingDate || text.notAvailable}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            {/* ===== Outgoing Date ===== */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {text.outgoingDate}:
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {archive.outgoingDate || text.notAvailable}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            {/* ===== Organization ===== */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {text.organization}:
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {archive.org?.name || text.notAvailable}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            {/* ===== Submitted Date ===== */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {text.submittedDate}:
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {archive.submitedDate || text.notAvailable}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            {/* ===== Document Type ===== */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {text.docType}:
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {archive.docType || text.notAvailable}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            {/* ===== Year ===== */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {text.year}:
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {archive.year || text.notAvailable}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            {/* ===== Description ===== */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {text.description}:
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {archive.description || text.notAvailable}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Typography sx={{ textAlign: "right" }}>
            {text.noArchiveSelected}
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          {text.close}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
