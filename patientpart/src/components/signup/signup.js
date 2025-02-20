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
    gender: "", // Added gender field
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    const requestData = {
      username: formData.username, // Assuming email as username
      name: formData.fullName,
      phoneNumber: formData.phone,
      email: formData.email,
      password: formData.password,
      gender: formData.gender, 
      bloodtype: formData.bloodType,
      dateOfBirth: formData.dob,
    };

    try {
      const response = await fetch('https://zo0of1qvtk.execute-api.us-east-1.amazonaws.com/dev/signup_patient', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/profile"); // Redirect to login page on success
      } else {
        setError(data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
            {error && <p className="error-message">{error}</p>}

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
                      className="form-input"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Email"
                    />
                    {formData.email.includes("@") && <FaCheckCircle className="validation-icon" />}
                  </div>
                </div>

                <div className="form-group">
                  <div className="input-wrapper">
                    <Mail className="field-icon" />
                    <input
                      type="username"
                      name="username"
                      className="form-input"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      placeholder="Username"
                    />
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

                <div className="form-group">
                  <label>Gender:</label>
                  <div className="gender-options">
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={formData.gender === "male"}
                        onChange={handleChange}
                      /> Male
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={formData.gender === "female"}
                        onChange={handleChange}
                      /> Female
                    </label>
                  </div>
                </div>

                <button type="button" className="login-button" onClick={() => setStep(2)}>
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
                    <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
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
                  <button type="button" className="secondary-button" onClick={() => setStep(1)}>
                    Back
                  </button>
                  <button type="submit" className={`login-button ${isLoading ? "loading" : ""}`}>
                    {isLoading ? <div className="loading-spinner"></div> : "Create Account"}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
