// src/pages/Register.jsx
import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import "../index.css";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp(form);
    if (error) setError(error.message);
    else navigate("/dashboard");
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
             <input type="name" placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} required />
             <input type="email" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input type="mobilenumber" placeholder="Mobile Number" onChange={(e) => setForm({ ...form, MobileNumber: e.target.value })} required />
          <input type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <input type="confirmpassword" placeholder="ConfirmPassword" onChange={(e) => setForm({ ...form, confirmpassword: e.target.value })} required />
          <button type="submit">Register</button>
          {error && <p className="error">{error}</p>}
        </form>
        <p>Already have an account? <Link to="/">Login</Link></p>
      </div>
      <div className="auth-right">
        <h1>Join the StudyHub</h1>
        <img src="/illustration.png" alt="Illustration" />
      </div>
    </div>
  );
};

export default Register;
