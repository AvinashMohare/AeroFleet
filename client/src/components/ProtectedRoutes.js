import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Check for token and role
  if (!token || !role || !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  // Check if token is expired
  try {
    const { exp } = jwtDecode(token);
    if (Date.now() >= exp * 1000) {
      // Token expired
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("username");
      return <Navigate to="/login" replace />;
    }
  } catch (e) {
    // Invalid token
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
