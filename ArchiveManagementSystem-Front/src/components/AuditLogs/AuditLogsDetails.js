import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import { DataGrid } from "@mui/x-data-grid";
import { Blocks } from "react-loader-spinner";
import Errors from "../Errors.js";
import moment from "moment";

// Import columns (reuse auditLogcolumns if ورته ورته وي)
import { auditLogcolumns } from "../../utils/auditLogColumns.js";

const AuditLogsDetails = () => {
  const { recordId } = useParams();
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSingleAuditLogs = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/audit/note/${recordId}`);
      setAuditLogs(data);
    } catch (err) {
      setError(err?.response?.data?.message || "Error fetching audit logs");
    } finally {
      setLoading(false);
    }
  }, [recordId]);

  useEffect(() => {
    if (recordId) fetchSingleAuditLogs();
  }, [recordId, fetchSingleAuditLogs]);

  const rows = auditLogs.map((item) => ({
    id: item.id,
    recordId: item.recordId,
    action: item.action,
    username: item.username,
    tableName: item.tableName,
    recordContent: item.recordContent,
    timestamp: moment(item.timestamp).format("MMMM DD, YYYY, hh:mm A"),
  }));

  if (error) return <Errors message={error} />;

  return (
    <div className="p-4">
      <div className="py-6">
        {auditLogs.length > 0 && (
          <h1 className="text-center sm:text-2xl text-lg font-bold text-slate-800">
            Audit Log for Record ID - {recordId}
          </h1>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-72">
          <Blocks height="70" width="70" ariaLabel="loading" visible={true} />
          <span>Please wait...</span>
        </div>
      ) : auditLogs.length === 0 ? (
        <Errors message="Invalid Record ID" />
      ) : (
        <div className="overflow-x-auto w-full">
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

export default AuditLogsDetails;
