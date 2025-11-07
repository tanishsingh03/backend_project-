// src/pages/Login.jsx
import React, { useState } from "react";
import api from "../api/client";
import { setAuth } from "../auth";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [role, setRole] = useState("user"); // "user" or "restaurant"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const nav = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post(`/login/${role}`, { email, password });
      const token = res?.data?.token;
      if (!token) {
        setError("Server did not return token. Check backend.");
        return;
      }
      // Save token + role
      setAuth(token, role);

      // Role-based redirect
      if (role === "restaurant") {
        nav("/restaurant/dashboard");
      } else {
        nav("/");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Login failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={card}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={field}>
          <label>Login as</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">Customer</option>
            <option value="restaurant">Restaurant</option>
          </select>
        </div>

        <div style={field}>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div style={field}>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        <button disabled={loading} style={btn}>{loading ? "Logging in..." : "Log in"}</button>

        {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}

        <p style={{ marginTop: 12 }}>
          New? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  );
}

const card = { maxWidth: 460, margin: "40px auto", padding: 18, border: "1px solid #eee", borderRadius: 8 };
const field = { marginBottom: 10, display: "grid", gap: 6 };
const btn = { padding: "8px 12px", cursor: "pointer" };
