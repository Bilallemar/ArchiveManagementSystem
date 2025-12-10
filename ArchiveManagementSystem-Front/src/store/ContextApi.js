import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const ContextApi = createContext();

export const ContextProvider = ({ children }) => {
  const getToken = localStorage.getItem("JWT_TOKEN") || null;
  const isADmin = localStorage.getItem("IS_ADMIN")
    ? JSON.parse(localStorage.getItem("IS_ADMIN"))
    : false;

  const [token, setToken] = useState(getToken);
  const [currentUser, setCurrentUser] = useState(null);
  const [openSidebar, setOpenSidebar] = useState(true);
  const [isAdmin, setIsAdmin] = useState(isADmin);

  const fetchUser = async () => {
    try {
      const { data } = await api.get(`/auth/user`);
      const roles = data.roles;

      if (roles.includes("ROLE_ADMIN")) {
        localStorage.setItem("IS_ADMIN", JSON.stringify(true));
        setIsAdmin(true);
      } else {
        localStorage.removeItem("IS_ADMIN");
        setIsAdmin(false);
      }
      setCurrentUser(data);
    } catch (error) {
      console.error("Error fetching current user", error);
      toast.error("Session expired, please login again");
      localStorage.clear();
      setCurrentUser(null);
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]);

  return (
    <ContextApi.Provider
      value={{
        token,
        setToken,
        currentUser,
        setCurrentUser,
        openSidebar,
        setOpenSidebar,
        isAdmin,
        setIsAdmin,
      }}
    >
      {children}
    </ContextApi.Provider>
  );
};

export const useMyContext = () => {
  const context = useContext(ContextApi);
  return context;
};
