import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DoctorSignup from "./components/Signup/DoctorSignup";
import DoctorLogin from "./components/Login/DoctorLogin";
import DoctorProfile from "./components/Profile/DoctorProfile"
import "./App.css";

// function App() {
//   return (
//     <div>
//       <div className="tobcare-logo">TobCare.</div>
//       <AuthContainer />
//     </div>
//   );
// }

// const AuthContainer = () => {
//   const [isLogin, setIsLogin] = useState(true);

//   return (
//     <div>
//       {isLogin ? <DoctorLogin toggle={() => setIsLogin(false)} /> : <DoctorSignup toggle={() => setIsLogin(true)} />}
//     </div>
//   );
// };

// export default App;

// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import './App.css';
// import Login from './components/Login/Login';
// import SignUp from './components/signup/signup'
// import Profile from './components/Profile/profile'
// import PersonalInfo from './components/personalinfo/PersonalInfo';

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
