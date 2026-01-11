import React, { useEffect, useState, useMemo } from "react";
import api from "../../services/api.js";
import { DataGrid } from "@mui/x-data-grid";
import toast from "react-hot-toast";
import { Blocks } from "react-loader-spinner";
import Errors from "../Errors.js";
import moment from "moment";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { getUserListColumns } from "./userListColumns";

// ----------------------------
// User List Component
// ----------------------------
const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // translations
  const { t } = useTranslation("users");

  // columns (memoized so they update only when language changes)
  const columns = useMemo(() => getUserListColumns(t), [t]);

  useEffect(() => {
    setLoading(true);

    const fetchUsers = async () => {
      try {
        const response = await api.get("/admin/getusers");
        const usersData = Array.isArray(response.data) ? response.data : [];
        setUsers(usersData);
      } catch (err) {
        setError(err?.response?.data?.message);
        toast.error(t("messages.fetchError"));
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [t]);

  // prepare rows for DataGrid
  const rows = users.map((item) => {
    const formattedDate = moment(item.createdDate).format(
      "MMMM DD, YYYY, hh:mm A"
    );

    return {
      id: item.userId,
      username: item.userName,
      email: item.email,
      created: formattedDate,
      status: item.enabled ? t("status.active") : t("status.inactive"),
    };
  });

  if (error) {
    return <Errors message={error} />;
  }

  return (
    <div className="p-4">
      <div className="py-4">
        <h1 className="text-center text-2xl font-bold text-slate-800 uppercase">
          {t("title")}
        </h1>
      </div>

      <div className="overflow-x-auto w-full mx-auto">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-72">
            <Blocks
              height="70"
              width="70"
              color="#4fa94d"
              ariaLabel="blocks-loading"
              visible
            />
            <span className="mt-2">{t("messages.loading")}</span>
          </div>
        ) : (
          <DataGrid
            className="w-fit mx-auto"
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 6,
                },
              },
            }}
            disableRowSelectionOnClick
            pageSizeOptions={[6]}
            disableColumnResize
          />
        )}
      </div>
    </div>
  );
};

export default UserList;
