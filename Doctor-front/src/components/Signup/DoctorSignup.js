
// export default DoctorSignup;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserCircle, Mail, Lock, Phone, Stethoscope, Briefcase, MapPin, FileText, Hospital, ClipboardCheck, ArrowDownUp, RefreshCcw, LogIn} from "lucide-react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";
import "../Login/DoctorLogin.css";

const DoctorSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    phone_number: "",
    password: "",
    confirmPassword: "",
    specialty: "",
    license_number: "",
    exp_years: "",
    bio: "",
    consultation_fee: "",
    follow_up_fee: "",
    address: "", 
    city: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [cities, setCities] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name !== "hospitals" && name !== "additionalContact") { 
        setFormData({ ...formData, [name]: value });
    }
  };

  useEffect(() => {
    getCities();
  }, []);

  const getCities = async () => {
    try {
      const response = await fetch("https://ednisgva11.execute-api.us-east-1.amazonaws.com/dev/get_cities", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("ure getting: " + data);
      if (response.ok) {
        // console.log("Data parsed: ", JSON.parse(data));
        // console.log("Data cities: ", JSON.parse(data).cities);
        setCities(JSON.parse(data).cities || []);
      }
      else {
        console.log("There is an error");
        
      }
    } catch (ex) {
      console.log("Error: ", ex.message);
    }
  };


  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the first selected file
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        [e.target.name]: file, // Store file object correctly
      }));
    }
  };
  

  const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setErrorMessage(""); 

      // Check if passwords match before submitting
      if (formData.password !== formData.confirmPassword) {
        setErrorMessage("Passwords do not match");
        setIsLoading(false);
        return;
      }

      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key !== "confirmPassword") {
          formDataToSend.append(key, formData[key]);
        }      });
      const jsonData = JSON.stringify(formData)
      console.log("Data sent: " + jsonData)

      try {
          const response = await fetch("https://ednisgva11.execute-api.us-east-1.amazonaws.com/dev/signup_doctor", {
              method: "POST",
              body: JSON.stringify(formData), // Send as FormData
              headers: {
                "Content-Type": "application/json" 
              },
          });

          const data = await response.json();
          setIsLoading(false);

          if (response.ok) {
              alert("Registration successful");
              navigate("/drlogin"); // Redirect after registration
          } else {
            console.log("Data: ", data);
            console.log("Response body: ", response.body);
            if (data.message == "Doctor already exists") {
              setErrorMessage("The Email you used already exists.");
              return;
            }
            
            // Optionally, set any other error message to be shown inline:
            setErrorMessage(data.message || "Something went wrong");
          
          }
      } catch (error) {
          setIsLoading(false);
          alert("Error: " + error.message);
      }
  };


  const isEmailValid = (email) => email.includes("@") && email.includes(".");

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="brand-logo">
            <Stethoscope className="logo-icon" />
          </div>

          <div className="login-header">
            <h2 className="login-title">Physician Registration</h2>
            <p className="login-subtitle">Let’s Get You Started!</p>
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <>
                <div className="form-group">
                  <div className="input-wrapper">
                    <UserCircle className="field-icon" />
                    <input
                      type="text"
                      name="username"
                      className="form-input"
                      placeholder="User Name"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="input-wrapper">
                    <UserCircle className="field-icon" />
                    <input
                      type="text"
                      name="name"
                      className="form-input"
                      placeholder="Full Name"
                      value={formData.name}
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
                      className={`form-input ${isEmailValid(formData.email) ? "valid" : ""}`}
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    {isEmailValid(formData.email) && <FaCheckCircle className="validation-icon" />}
                  </div>
                </div>

                <div className="form-group">
                  <div className="input-wrapper">
                    <Phone className="field-icon" />
                    <input
                      type="tel"
                      name="phone_number"
                      className="form-input"
                      placeholder="Phone Number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <button type="button" className="login-button" onClick={() => setStep(2)}>
                  Continue
                </button>
              </>
            )}

            {step === 2 && (
              <>
            <div className="form-group">
              <div className="input-wrapper">
                <Stethoscope className="field-icon" />
                <select
                  name="specialty"
                  className="form-input"
                  value={formData.specialty}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select Specialty</option>
                  <option value="Cardiologist">Cardiologist</option>
                  <option value="Dermatologist">Dermatologist</option>
                  <option value="Endocrinologist">Endocrinologist</option>
                  <option value="Gastroenterologist">Gastroenterologist</option>
                  <option value="Neurologist">Neurologist</option>
                  <option value="Ophthalmologist">Ophthalmologist</option>
                  <option value="Orthopedic Surgeon">Orthopedic Surgeon</option>
                  <option value="Pediatrician">Pediatrician</option>
                  <option value="Psychiatrist">Psychiatrist</option>
                  <option value="Urologist">Urologist</option>
                  {/* Add more specialties as needed */}
                </select>
            </div>
          </div>

                <div className="form-group">
                  <div className="input-wrapper">
                    <Hospital className="field-icon" />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Hospitals and Clinics"
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="input-wrapper">
                    <Briefcase className="field-icon" />
                    <input
                      type="text"
                      name="exp_years"
                      className="form-input"
                      placeholder="Years of Experience"
                      value={formData.exp_years}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="input-wrapper">
                    <FileText className="field-icon" />
                    <input
                      type="text"
                      name="license_number"
                      className="form-input"
                      placeholder="Medical License Number"
                      value={formData.license_number}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Medical License</label>
                  <input type="file" name="medicalLicense" onChange={handleFileChange} required />
                </div>

                
                <div className="button-group">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </button>
                  <button type="button" className="login-button" onClick={() => setStep(3)}>
                  Continue
                </button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
              <div className="form-group">
                  <div className="input-wrapper">
                    <MapPin className="field-icon" />
                    <select
                      name="city"
                      className="form-input"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>Select City</option>
                      {cities.map((city, index) => (
                        <option key={index} value={city.name}>
                          {city.name} {/* Correctly extract the name */}
                        </option>
                      ))}
                    </select>

                  </div>
                </div>


                <div className="form-group">
                  <div className="input-wrapper">
                    <MapPin className="field-icon" />
                    <input
                      type="text"
                      name="address"
                      className="form-input"
                      placeholder="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="input-wrapper">
                    <ClipboardCheck className="field-icon" />
                    <input
                      type="text"
                      name="consultation_fee"
                      className="form-input"
                      placeholder="Primary Consultation Fee"
                      value={formData.consultation_fee}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="input-wrapper">
                    <RefreshCcw className="field-icon" />
                    <input
                      type="text"
                      name="follow_up_fee"
                      className="form-input"
                      placeholder="Subsequent Consultation Fee"
                      value={formData.follow_up_fee}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="input-wrapper">
                    <Phone className="field-icon" />
                    <input
                      type="tel"
                      name="additionalContact"
                      className="form-input"
                      placeholder="Additional Contact"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="input-wrapper">
                    <FileText className="field-icon" />
                      <textarea
                        name="bio"
                        className="form-input"
                        placeholder="Tell patients about yourself"
                        value={formData.bio}
                        onChange={handleChange}
                        required
                      ></textarea>
                  </div>
                </div>

                <div className="form-group">
                  <label>ID/Passport: </label>
                  <input type="file" name="idpassport" onChange={handleFileChange} required />
                </div>

                <div className="form-group">
                  <label>Profile Picture: </label>
                  <input type="file" name="profilepicture" onChange={handleFileChange} required />
                </div>

                
                <div className="button-group">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => setStep(2)}
                  >
                    Back
                  </button>
                  <button type="button" className="login-button" onClick={() => setStep(4)}>
                  Continue
                </button>
                </div>
              </>
            )}

            {step === 4 && (
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

                {errorMessage && (
                  <div className="error-message" style={{ color: "red", marginBottom: "10px" }}>
                    {errorMessage}
                  </div>
                )}

                <div className="form-group">
                  <div className="password-requirements">
                    <p>Password must contain:</p>
                    <ul>
                      <li className={formData.password.length >= 8 ? 'valid' : ''}>
                        At least 8 characters
                      </li>
                      <li className={/[A-Z]/.test(formData.password) ? 'valid' : ''}>
                        One uppercase letter
                      </li>
                      <li className={/[0-9]/.test(formData.password) ? 'valid' : ''}>
                        One number
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="button-group">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => setStep(3)}
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
                      'Register'
                    )}
                  </button>
                </div>
              </>
            )}
          </form>

          <div className="register-section">
            <p className="register-text">
              Already have an account?{" "}
              <span className="register-link" onClick={() => navigate("/drlogin")} style={{ cursor: "pointer" }}>
                Log in
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorSignup;

