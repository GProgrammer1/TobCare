import React, { useState } from "react"; 
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { Stethoscope, UserCircle } from "lucide-react";
import "./login.css";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("https://zo0of1qvtk.execute-api.us-east-1.amazonaws.com/dev/signin_patient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        const responseBody = JSON.parse(data.result.body);
        localStorage.setItem("userId", responseBody.user.id);
        navigate("/profile"); // Redirect to home page on success
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
    }

    setIsLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="brand-logo">
            <Stethoscope className="logo-icon" />
          </div>

          <div className="login-header">
            <h2 className="login-title">Welcome Back</h2>
            <p className="login-subtitle">Login to your healthcare portal</p>
          </div>

          {error && <p className="error-message">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="input-wrapper">
                <UserCircle className="field-icon" />
                <input
                  type="text"
                  className="form-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
                </span>
              </div>
            </div>

            <button type="submit" className={`login-button ${isLoading ? 'loading' : ''}`}>
              {isLoading ? <div className="loading-spinner"></div> : "Sign In"}
            </button>
          </form>

          <div className="register-section">
            <p className="register-text">
              Don't have an account? <span className="register-link" onClick={() => navigate("/signup")}>Create one now</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
