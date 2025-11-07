// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthed, getRole } from "../auth";

export default function ProtectedRoute({ children, requiredRole }) {
  // requiredRole can be "user" or "restaurant" or undefined
  if (!isAuthed()) {
    return <Navigate to="/login" replace />;
  }
  if (requiredRole) {
    const role = getRole();
    if (role !== requiredRole) {
      // unauthorized for this role — redirect to home or to login
      return <Navigate to="/" replace />;
    }
  }
  return children;
}
