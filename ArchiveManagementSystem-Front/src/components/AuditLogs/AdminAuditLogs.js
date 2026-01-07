import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { Blocks } from "react-loader-spinner";
import toast from "react-hot-toast";
import { auditLogsTruncateTexts } from "../../utils/truncateText.js";
import { auditLogcolumns } from "../../utils/auditLogColumns.js";

import Errors from "../Errors.js";
import moment from "moment";

// // ---------------- Columns ----------------
// export const auditLogcolumns = [
//   {
//     field: "action",
//     headerName: "Action",
//     width: 160,
//     headerAlign: "center",
//     align: "center",
//     headerClassName: "text-black font-semibold border",
//     cellClassName: "text-slate-700 font-normal border",
//   },
//   {
//     field: "username",
//     headerName: "UserName",
//     width: 180,
//     headerAlign: "center",
//     align: "center",
//     headerClassName: "text-black font-semibold border",
//     cellClassName: "text-slate-700 font-normal border",
//   },
//   {
//     field: "timestamp",
//     headerName: "TimeStamp",
//     width: 220,
//     headerAlign: "center",
//     align: "center",
//     headerClassName: "text-black font-semibold border",
//     cellClassName: "text-slate-700 font-normal border",
//   },
//   {
//     field: "recordId",
//     headerName: "Record ID",
//     width: 160,
//     headerAlign: "center",
//     align: "center",
//     headerClassName: "text-black font-semibold border",
//     cellClassName: "text-slate-700 font-normal border",
//   },
//   {
//     field: "recordContent",
//     headerName: "Note Content",
//     width: 260,
//     headerAlign: "center",
//     align: "center",
//     headerClassName: "text-black font-semibold border",
//     cellClassName: "text-slate-700 font-normal border",
//     renderCell: (params) => {
//       const text = params?.value || "—";
//       return (
//         <p className="text-slate-700 text-center">
//           {auditLogsTruncateTexts(text)}
//         </p>
//       );
//     },
//   },
//   {
//     field: "view",
//     headerName: "Action",
//     width: 150,
//     headerAlign: "center",
//     align: "center",
//     sortable: false,
//     renderCell: (params) => (
//       <Link
//         to={`/admin/audit-logs/${params.row.recordId}`}
//         className="h-full flex justify-center items-center"
//       >
//         <button className="bg-btnColor text-white px-4 h-9 rounded-md">
//           View
//         </button>
//       </Link>
//     ),
//   },
// ];

// ---------------- Component ----------------
const AdminAuditLogs = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      const response = await api.get("/audit");
      setAuditLogs(response.data);
    } catch (err) {
      setError(err?.response?.data?.message);
      toast.error("Error fetching audit logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const rows = auditLogs.map((item) => ({
    id: item.id,
    action: item.action,
    username: item.username,
    tableName: item.tableName,
    recordId: item.recordId,
    recordContent: item.recordContent,
    timestamp: moment(item.timestamp).format("MMMM DD, YYYY, hh:mm A"),
  }));

  if (error) return <Errors message={error} />;

  return (
    <div className="p-4">
      <div className="py-4">
        <h1 className="text-center text-2xl font-bold text-slate-800 uppercase">
          Audit Logs
        </h1>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-72">
          <Blocks height="70" width="70" color="#4fa94d" visible={true} />
          <span>Please wait...</span>
        </div>
      ) : (
        <div className="overflow-x-auto w-full mx-auto">
          <DataGrid
            className="w-fit mx-auto px-0"
            rows={rows}
            columns={auditLogcolumns}
            initialState={{ pagination: { paginationModel: { pageSize: 6 } } }}
            pageSizeOptions={[6]}
            disableRowSelectionOnClick
            disableColumnResize
          />
        </div>
      )}
    </div>
  );
};

export default AdminAuditLogs;
