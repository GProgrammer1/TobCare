// PersonalInfo.jsx
import React, { useState } from 'react';
import { ArrowLeft, Edit2 } from 'lucide-react';
import './personalinfo.css';

const PersonalInfo = ({ onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Hadi Nhayli',
    email: 'hadi@example.com',
    phone: '+1234567890',
    sex: 'Male',
    bloodType: 'O+'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    // Here you would typically save the data to your backend
    console.log('Saved:', formData);
  };

  return (
    <div className="personal-info-container">
      <div className="info-header">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft />
          <span>Back</span>
        </button>
        <h1>Personal Information</h1>
        <button 
          className="edit-button"
          onClick={() => setIsEditing(!isEditing)}
        >
          <Edit2 />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="info-form">
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div className="form-group">
          <label>Sex</label>
          <select
            name="sex"
            value={formData.sex}
            onChange={handleChange}
            disabled={!isEditing}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Blood Type</label>
          <select
            name="bloodType"
            value={formData.bloodType}
            onChange={handleChange}
            disabled={!isEditing}
          >
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>

        {isEditing && (
          <button type="submit" className="save-button">
            Save Changes
          </button>
        )}
      </form>
    </div>
  );
};

export default PersonalInfo;