import React from 'react';
import { ArrowLeft, Users, UserCog, Calendar, Search, FileText, Activity, Heart } from 'lucide-react';
import './aboutus.css';

const AboutUs = ({ onBack }) => {
  return (
    <div className="about-us-container">
      <div className="header-section">
        <div className="header-top">
          <button className="back-button" onClick={onBack}>
            <ArrowLeft className="icon" />
          </button>
          <h1>About Us</h1>
        </div>
      </div>

      <div className="content-sectionn">
        <div className="about-header">
          <img src="/api/placeholder/80/80" alt="TobCare Logo" className="logo" />
          <h2>TobCare</h2>
          <p className="tagline">Connecting patients with the right doctors across Lebanon</p>
        </div>

        <div className="about-section">
          <h3>Our Mission</h3>
          <p>
            TobCare is a platform that connects doctors with patients across Lebanon. We're here to
            help patients who are new to a city, lack personal recommendations, or are unfamiliar with
            local healthcare options find the right medical professional for their needs.
          </p>
        </div>

        <div className="about-section">
          <h3>What We Offer</h3>
          <p>
            TobCare is a doctor discovery and appointment booking platform that allows users to find doctors
            across all medical specialties in Lebanon based on filters such as specialty, location, and price.
            We provide comprehensive details including doctors' names, availability, and past visit records,
            including prescriptions and medication.
          </p>
          <p>
            Unlike other platforms, TobCare displays the list of doctors all over Lebanon and the consultation
            fees upfront, helping users make informed decisions based on their budget.
          </p>
        </div>

        <div className="features-section">
          <h3>Key Features</h3>
          
          <div className="feature-group">
            <h4 className="feature-group-title">
              <Users className="feature-icon" />
              <span>For Patients</span>
            </h4>
            <ul className="feature-list">
              <li>
                <Search className="feature-item-icon" />
                <span>Search for doctors based on name, specialty, and location</span>
              </li>
              <li>
                <FileText className="feature-item-icon" />
                <span>View your history with any doctor</span>
              </li>
              <li>
                <Calendar className="feature-item-icon" />
                <span>See and register for available appointments</span>
              </li>
              <li>
                <Activity className="feature-item-icon" />
                <span>View prices for first-time and follow-up visits</span>
              </li>
              <li>
                <Heart className="feature-item-icon" />
                <span>Maintain a profile with a list of visited doctors</span>
              </li>
              <li>
                <UserCog className="feature-item-icon" />
                <span>Securely register and protect personal information</span>
              </li>
            </ul>
          </div>
          
          <div className="feature-group">
            <h4 className="feature-group-title">
              <UserCog className="feature-icon" />
              <span>For Doctors</span>
            </h4>
            <ul className="feature-list">
              <li>
                <Calendar className="feature-item-icon" />
                <span>Manage available appointments</span>
              </li>
              <li>
                <FileText className="feature-item-icon" />
                <span>Display specialization and background information</span>
              </li>
              <li>
                <Activity className="feature-item-icon" />
                <span>Post session descriptions, prescriptions, and follow-ups</span>
              </li>
              <li>
                <Users className="feature-item-icon" />
                <span>Access patient history and records</span>
              </li>
              <li>
                <Search className="feature-item-icon" />
                <span>Select category listings and specialties</span>
              </li>
              <li>
                <Heart className="feature-item-icon" />
                <span>Display contact information and communication options</span>
              </li>
              <li>
                <Activity className="feature-item-icon" />
                <span>Set pricing for first-time and follow-up appointments</span>
              </li>
              <li>
                <Calendar className="feature-item-icon" />
                <span>Send automatic appointment reminders to patients</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="about-section">
          <h3>Contact Us</h3>
          <p>
            Have questions or feedback? We'd love to hear from you! Contact our support team at
            support@tobcare.com or call us at +961 XX XXX XXX.
          </p>
        </div>

        <div className="version-info">
          <p>TobCare v1.0.0</p>
          <p>&copy; 2025 TobCare. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;