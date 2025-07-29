// src/pages/Login.jsx
import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import "../index.css";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword(form);
    if (error) setError(error.message);
    else navigate("/dashboard");
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <button type="submit">Login</button>
          {error && <p className="error">{error}</p>}
        </form>
        <p>Don't have an account? <Link to="/register">Register</Link></p>
      </div>
      <div className="auth-right">
        <h1>Welcome to StudyHub</h1>
        <img src="/illustration.png" alt="Illustration" />
      </div>
    </div>
  );
};

export default Login;
