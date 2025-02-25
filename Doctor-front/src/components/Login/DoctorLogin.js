import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { Heart, Plus, Stethoscope, UserCircle } from "lucide-react";
import "./DoctorLogin.css";

const DoctorLogin = () => {
      const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setIsValid(e.target.value.includes("@") && e.target.value.includes("."));
  };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setErrorMessage(""); // clear any previous errors
      setIsLoading(true);
    
      try {
        const response = await fetch("https://ednisgva11.execute-api.us-east-1.amazonaws.com/dev/login_doctor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: email,
            password: password
          })
        });
    
        const data = await response.json();
        console.log("DatA: ", data);
        
        setIsLoading(false);
    
        if (response.ok) {
          console.log("Login successful");
          localStorage.setItem("doctorToken", JSON.parse(data).email);
          localStorage.setItem("doctorEmail", JSON.parse(data).email);
          console.log("email: ");
          
          navigate("/drprofile");
        } else {
          console.log("Data msg :", data.message);
          
          setErrorMessage(data.message || "Invalid email or password");
        }
      } catch (error) {
        console.log("Error: ", error.message);
        
        setIsLoading(false);
        setErrorMessage("Error: " + error.message);
      }
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
            <p className="login-subtitle">Let’s Care for Patients Together</p>
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

            <div className="form-group" id="exceptionel">
              <div className="input-wrapper">
                <div className="lock-icon"></div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  id="pass"
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
                </span>
              </div>
            </div>

            {errorMessage && (
              <div className="error-message" style={{ color: "red", marginBottom: "10px" }}>
                {errorMessage}
              </div>
            )}


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
                onClick={() => navigate("/drsignup")}
                style={{ 
                  cursor: "pointer", 
                
                }}
              >
              Sign Up as a Medical Professional
              </span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DoctorLogin;