import React, { useState } from "react";
import "./DoctorSignup.css";
import doctorImage from "../resources/Doctors-rafiki.png";

const DoctorSignup = ({ toggle }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    specialty: "",
    subspecialty: "",
    licenseNumber: "",
    experience: "",
    hospitals: "",
    bio: "",
    consultationFeeFirst: "",
    consultationFeeFollowUp: "",
    consultationType: [],
    address: "",
    city: "",
    additionalContact: "",
    medicalLicense: null,
    idPassport: null,
    profilePicture: null,
  });

  const specialties = ["Cardiology", "Dermatology", "Neurology", "Pediatrics"];
  const cities = ["Beirut", "Tripoli", "Sidon", "Jounieh"];
  const consultationTypes = ["In-person", "Telemedicine"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        consultationType: checked
          ? [...prev.consultationType, value]
          : prev.consultationType.filter((type) => type !== value),
      }));
    } else if (type === "file") {
      setFormData({ ...formData, [name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Welcom to TobCare!</h2>
      <p className="toggle-p" onClick={toggle}>
        Already have an account? <span className="toggle-link">Log in here</span>
      </p>
      <form onSubmit={handleSubmit} className="form-body">
      <img src={doctorImage} alt="Doctor Illustration"></img>
      <p className="Samira">Register now to join TobCare!</p>
        <div className="form-group">
          <input name="firstName" placeholder="First Name*" onChange={handleChange} className="input" required />
          <input name="lastName" placeholder="Last Name*" onChange={handleChange} className="input" required />
        </div>
        <input type="email" name="email" placeholder="Email*" onChange={handleChange} className="input" required />
        <input type="tel" name="phone" placeholder="Phone Number*" onChange={handleChange} className="input" required />
        <input type="password" name="password" placeholder="Password*" onChange={handleChange} className="input" required />
        <input type="password" name="confirmPassword" placeholder="Confirm Password*" onChange={handleChange} className="input" required />
        
        <select name="specialty" onChange={handleChange} className="input" required>
          <option value="">Select Specialty*</option>
          {specialties.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <input name="subspecialty" placeholder="Subspecialty (Optional)" onChange={handleChange} className="input" />
        <input name="licenseNumber" placeholder="Medical License Number*" onChange={handleChange} className="input" required />
        <input type="number" name="experience" placeholder="Years of Experience*" onChange={handleChange} className="input" required />
        <input name="hospitals" placeholder="Affiliated Hospitals/Clinics" onChange={handleChange} className="input" />
        <textarea name="bio" placeholder="Professional Bio" onChange={handleChange} className="input"></textarea>
        
        <input type="number" name="consultationFeeFirst" placeholder="Consultation Fee (First-time)*" onChange={handleChange} className="input" required />
        <input type="number" name="consultationFeeFollowUp" placeholder="Consultation Fee (Follow-up)*" onChange={handleChange} className="input" required />
        
        <div className="checkbox-group">
          <label>Consultation Type:</label>
          {consultationTypes.map((type) => (
            <label key={type}>
              <input type="checkbox" name="consultationType" value={type} onChange={handleChange} /> {type}
            </label>
          ))}
        </div>
        
        <input name="address" placeholder="Clinic/Hospital Address*" onChange={handleChange} className="input" required />
        <select name="city*" onChange={handleChange} className="input" required>
          <option value="">Select City*</option>
          {cities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
        <input name="additionalContact" placeholder="Additional Contact Info (Optional)" onChange={handleChange} className="input" />
        
        <label className="file-upload">Medical License Copy: <input type="file" name="medicalLicense" onChange={handleChange} className="input" required /></label>
        <label className="file-upload">ID/Passport: <input type="file" name="idPassport" onChange={handleChange} className="input" required /></label>
        <label className="file-upload">Profile Picture: <input type="file" name="profilePicture" onChange={handleChange} className="input" required /></label>
        
        <button type="submit" className="submit-button">Sign Up</button>
      </form>
    </div>
  );
};

export default DoctorSignup;
