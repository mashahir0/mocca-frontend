import React from "react";
import { adminAuth } from "./useAuth";
import { Navigate } from "react-router-dom";

function ReqAdminLoginAuth({ children }) {
  const { adminToken } = adminAuth();
  if (adminToken) {
    return <Navigate to={"/admin/dashboard"} />;
  }
  return children;
}

export default ReqAdminLoginAuth;
