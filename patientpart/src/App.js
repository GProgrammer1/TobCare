import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './components/Login/Login';
import SignUp from './components/signup/signup'
import Profile from './components/Profile/profile'
import PersonalInfo from './components/personalinfo/PersonalInfo';
import MedicalRecords from "./components/medicalrecords/medicalrecord";
import AboutUs from "./components/aboutus/aboutus";
function App() {
  return (
    <Router> {/* Wrap everything in Router */}
      <div className="app-container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/personal-info" element={<PersonalInfo />} />
          <Route path="/medical-records" element={<MedicalRecords/>}/>
          <Route path="./about-us" element={<AboutUs/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
