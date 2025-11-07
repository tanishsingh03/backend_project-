// src/pages/RestaurantDashboard.jsx
import React from "react";
import { clearAuth } from "../auth";
import { useNavigate } from "react-router-dom";

export default function RestaurantDashboard() {
  const nav = useNavigate();

  function logout() {
    clearAuth();
    nav("/login");
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Restaurant Dashboard</h1>
      <p>Welcome! You’re logged in as a restaurant.</p>
      <button onClick={logout}>Log out</button>
    </div>
  );
}
