// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* restaurant-only area */}
      <Route
        path="/restaurant/dashboard"
        element={
          <ProtectedRoute requiredRole="restaurant">
            <RestaurantDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
