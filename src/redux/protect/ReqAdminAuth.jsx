import React from "react";
import { adminAuth } from "./useAuth";
import { Navigate } from "react-router-dom";

function ReqAdminAuth({ children }) {
  const { adminToken } = adminAuth();
  if (!adminToken) {
    return <Navigate to={"/admin/login"} />;
  }
  return children;
}

export default ReqAdminAuth;
