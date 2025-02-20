// CommonPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import doctorImage from "./doctorimage.png";
import patientImage from "./patientimage.png";
import './commonpage.css';

const CommonPage = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="welcome-section">
        <h1 className="main-title">Welcome to TobCare</h1>
        <p className="subtitle">Choose how you'd like to join our platform</p>
      </div>

      <div className="cards-container">
        {/* Patient Card */}
        <div className="card patient-card">
          <div className="card-content">
            <div className="image-container">
              <img src={patientImage} alt="Patient" className="user-image" />
              <div className="image-overlay"></div>
            </div>
            
            <h2 className="card-title">Join as a Patient</h2>
            <p className="card-description">
              Access healthcare services, book appointments, and manage your medical journey with ease.
            </p>
            
            <div className="features-list">
              <div className="feature-item">
                <span className="feature-icon">📅</span>
                <span>Easy appointment booking</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🔒</span>
                <span>Secure medical records</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">👨‍⚕️</span>
                <span>Find the right specialist</span>
              </div>
            </div>

            <button 
              className="action-button"
              onClick={() => navigate("/signup")}
            >
              Join as Patient
              <span className="button-arrow">→</span>
            </button>
          </div>
        </div>

        {/* Doctor Card */}
        <div className="card doctor-card">
          <div className="card-content">
            <div className="image-container">
              <img src={doctorImage} alt="Doctor" className="user-image" />
              <div className="image-overlay"></div>
            </div>
            
            <h2 className="card-title">Join as a Doctor</h2>
            <p className="card-description">
              Expand your practice and provide exceptional care through our platform.
            </p>
            
            <div className="features-list">
              <div className="feature-item">
                <span className="feature-icon">💼</span>
                <span>Manage your practice</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <span>Digital patient records</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🏥</span>
                <span>Grow your reach</span>
              </div>
            </div>

            <button 
              className="action-button"
              onClick={() => navigate("/signup-doctor")}
            >
              Join as Doctor
              <span className="button-arrow">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonPage;