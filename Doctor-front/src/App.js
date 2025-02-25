import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DoctorSignup from "./components/Signup/DoctorSignup";
import DoctorLogin from "./components/Login/DoctorLogin";
import DoctorProfile from "./components/Profile/DoctorProfile"
import "./App.css";

function App() {
  return (
    <Router> {/* Wrap everything in Router */}
      <div className="app-container">
        <Routes>
          <Route path="/drlogin" element={<DoctorLogin />} />
          <Route path="/drsignup" element={<DoctorSignup />} />
          <Route path="/drprofile" element={<DoctorProfile />} />
          {/* <Route path="/drpersonal-info" element={<PersonalInfo />} /> */}

        </Routes>
      </div>
    </Router>
  );
}

export default App;
