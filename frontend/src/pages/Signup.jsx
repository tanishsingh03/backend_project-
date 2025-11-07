// src/pages/Signup.jsx
import React, { useState } from "react";
import api from "../api/client";
import { setAuth } from "../auth";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [role, setRole] = useState("user");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const nav = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (!email || !password) return setError("Email and password required");

    try {
      setLoading(true);
      await api.post(`/signup/${role}`, { name, email, password, address, phone });

      // Auto-login after signup
      const loginRes = await api.post(`/login/${role}`, { email, password });
      const token = loginRes?.data?.token;
      if (token) setAuth(token, role);

      // redirect after signup
      if (role === "restaurant") nav("/restaurant/dashboard");
      else nav("/");
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Signup failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={card}>
      <h2>Create account</h2>
      <form onSubmit={handleSubmit}>
        <div style={field}>
          <label>Signup as</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">Customer</option>
            <option value="restaurant">Restaurant</option>
          </select>
        </div>

        <div style={field}>
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div style={field}>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div style={field}>
          <label>Address</label>
          <input value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>

        <div style={field}>
          <label>Phone</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>

        <div style={field}>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />
        </div>

        <button disabled={loading} style={btn}>{loading ? "Creating..." : "Sign up"}</button>

        {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}

        <p style={{ marginTop: 12 }}>
          Have account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}

const card = { maxWidth: 480, margin: "40px auto", padding: 18, border: "1px solid #eee", borderRadius: 8 };
const field = { marginBottom: 10, display: "grid", gap: 6 };
const btn = { padding: "8px 12px", cursor: "pointer" };
