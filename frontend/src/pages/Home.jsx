// src/pages/Home.jsx
import React from "react";
import { getRole, clearAuth } from "../auth";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const role = getRole();
  const nav = useNavigate();
  return (
    <div style={{ padding: 20 }}>
      <h1>Food Ordering</h1>
      <p>Signed in as: {role || "guest"}</p>
      <div style={{ gap: 8 }}>
        {!role && <button onClick={() => nav("/login")}>Login</button>}
        {!role && <button onClick={() => nav("/signup")}>Sign up</button>}
        {role && <button onClick={() => { clearAuth(); nav("/login"); }}>Logout</button>}
      </div>
    </div>
  );
}
