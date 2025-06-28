import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const role = localStorage.getItem("role");
  if (!role || !allowedRoles.includes(role)) {
    // Not logged in or not authorized
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
