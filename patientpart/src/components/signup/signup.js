import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserCircle, Mail, Lock, Phone, Stethoscope, Calendar } from "lucide-react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { FaCheckCircle, FaTint } from "react-icons/fa";
import "./signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    bloodType: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  const isEmailValid = (email) => {
    return email.includes("@") && email.includes(".");
  };

  return (
    <div className="login-page">
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="login-container">
        <div className="login-card">
          <div className="brand-logo">
            <Stethoscope className="logo-icon" />
          </div>

          <div className="login-header">
            <h2 className="login-title">Create Account</h2>
            <p className="login-subtitle">Join our healthcare platform</p>
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 ? (
              <>
                <div className="form-group">
                  <div className="input-wrapper">
                    <UserCircle className="field-icon" />
                    <input
                      type="text"
                      name="fullName"
                      className="form-input"
                      placeholder="Full Name"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="input-wrapper">
                    <Mail className="field-icon" />
                    <input
                      type="email"
                      name="email"
                      className={`form-input ${isEmailValid(formData.email) ? 'valid' : ''}`}
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Email"
                    />
                    {isEmailValid(formData.email) && (
                      <FaCheckCircle className="validation-icon" />
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <div className="input-wrapper">
                    <Phone className="field-icon" />
                    <input
                      type="tel"
                      name="phone"
                      className="form-input"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Date of Birth Field */}
                <div className="form-group">
                  <div className="input-wrapper">
                    <Calendar className="field-icon" />
                    <input
                      type="date"
                      name="dob"
                      className="form-input"
                      value={formData.dob}
                      onChange={handleChange}
                      required
                      placeholder="Date of Birth"
                    />
                  </div>
                </div>

                {/* Blood Type Field */}
                <div className="form-group">
                  <div className="input-wrapper">
                    <FaTint className="field-icon" />
                    <select
                      name="bloodType"
                      className="form-input"
                      value={formData.bloodType}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Blood Type</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  className="login-button"
                  onClick={() => setStep(2)}
                >
                  Continue
                </button>
              </>
            ) : (
              <>
                <div className="form-group">
                  <div className="input-wrapper">
                    <Lock className="field-icon" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="form-input"
                      placeholder="Create Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <span
                      className="toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
                    </span>
                  </div>
                </div>

                <div className="form-group">
                  <div className="input-wrapper">
                    <Lock className="field-icon" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      className="form-input"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="button-group">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className={`login-button ${isLoading ? 'loading' : ''}`}
                  >
                    {isLoading ? (
                      <div className="loading-spinner"></div>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </div>
              </>
            )}
          </form>

          <div className="register-section">
            <p className="register-text">
              Already have an account?{" "}
              <span
                className="register-link"
                onClick={() => navigate("/login")}
                style={{ cursor: "pointer" }}
              >
                Sign in
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
