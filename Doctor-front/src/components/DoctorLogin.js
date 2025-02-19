import React, { useState } from "react";
import "./DoctorLogin.css";

const DoctorLogin = ({ toggle }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Doctor Login Data:", formData);
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Doctor Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
      <p className="toggle-p" onClick={toggle}>
        Don't have an account yet? <span className="toggle-link">Sign up here</span>
      </p>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="input"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="input"
          required
        />
        <button type="submit" className="login-button">Login</button>
      </form>
      <p className="forgot-password">Forgot password?</p>
    </div>
  );
};

export default DoctorLogin;
