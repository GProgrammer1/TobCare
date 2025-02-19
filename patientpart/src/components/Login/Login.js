import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { Heart, Plus, Stethoscope, UserCircle } from "lucide-react";
import "./login.css"


const Login = () => {
      const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setIsValid(e.target.value.includes("@") && e.target.value.includes("."));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
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

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="input-wrapper">
                <UserCircle className="field-icon" />
                <input
                  type="email"
                  className={`form-input ${isValid ? 'valid' : ''}`}
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="your@email.com"
                />
                {isValid && <FaCheckCircle className="validation-icon" />}
              </div>
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <div className="lock-icon"></div>
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

            <div className="remember-forgot">
              <label className="remember-me">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Remember me
              </label>
              <a href="#" className="forgot-link">Forgot password?</a>
            </div>

            <button type="submit" className={`login-button ${isLoading ? 'loading' : ''}`}>
              {isLoading ? (
                <div className="loading-spinner"></div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="register-section">
            <p className="register-text">
              Don't have an account?{" "}
              <span
  className="register-link"
  onClick={() => navigate("/signup")}
  style={{ 
    cursor: "pointer", 
   
  }}
>
  Create one now
</span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;