// ProfilePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, QrCode, Heart, User, FileText, HelpCircle, Info, ChevronRight } from 'lucide-react';
import './profile.css';
import personalinfo from '../personalinfo/PersonalInfo';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState('profile');

    if (currentPage === 'personal-info') {
      return <personalinfo onBack={() => setCurrentPage('profile')} />;
    }
  return (
    <div className="profile-container">
      <div className="header-section">
        <div className="header-top">
          <h1>Profile</h1>
          <div className="header-icons">
            <Edit className="icon" />
            <QrCode className="icon" />
          </div>
        </div>
        
        <div className="profile-image">
          <img src="/api/placeholder/96/96" alt="Profile" />
        </div>
      </div>

      <div className="content-section">
        <h2 className="profile-name">Hadi Nhayli</h2>

        <div className="menu-container">
          <h3>Other</h3>
          
          <button className="menu-item">
            <div className="menu-item-left">
              <Heart className="menu-icon" />
              <span>My Favorite</span>
            </div>
            <ChevronRight className="chevron-icon" />
          </button>

          <button className="menu-item"
                          onClick={() => navigate('/personal-info')}> {/* Update this line */}

            <div className="menu-item-left">
              <User className="menu-icon" />
              <span>personal information</span>
            </div>
            <ChevronRight className="chevron-icon" />
          </button>

          <button className="menu-item">
            <div className="menu-item-left">
              <FileText className="menu-icon" />
              <span>Medical records</span>
            </div>
            <ChevronRight className="chevron-icon" />
          </button>

          <button className="menu-item">
            <div className="menu-item-left">
              <Info className="menu-icon" />
              <span>About Us</span>
            </div>
            <ChevronRight className="chevron-icon" />
          </button>

          <button className="menu-item">
            <div className="menu-item-left">
              <HelpCircle className="menu-icon" />
              <span>Help</span>
            </div>
            <ChevronRight className="chevron-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;