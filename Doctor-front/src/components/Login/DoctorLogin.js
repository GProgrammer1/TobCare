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

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setIsValid(e.target.value.includes("@") && e.target.value.includes("."));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        setIsLoading(false);

        if (response.ok) {
            console.log("Login successful");
            localStorage.setItem("doctorToken", data.token); // Store token for authentication
            navigate("/drprofile"); // Redirect after successful login
        } else {
            alert(data.message || "Invalid email or password");
        }
      } catch (error) {
            setIsLoading(false);
            alert("Error: " + error.message);
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

// const DoctorLogin = ({ toggle }) => {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Doctor Login Data:", formData);
//   };

//   return (
//     <div className="login-container">
//       <h2 className="login-title">Doctor Login</h2>
//       <form onSubmit={handleSubmit} className="login-form">
//       <p className="toggle-p" onClick={toggle}>
//         Don't have an account yet? <span className="toggle-link">Sign up here</span>
//       </p>
//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           onChange={handleChange}
//           className="input"
//           required
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           onChange={handleChange}
//           className="input"
//           required
//         />
//         <button type="submit" className="login-button">Login</button>
//       </form>
//       <p className="forgot-password">Forgot password?</p>
//     </div>
//   );
// };

// export default DoctorLogin;

