import React, { useState } from "react";
import DoctorSignup from "./components/DoctorSignup";
import DoctorLogin from "./components/DoctorLogin";
import "./App.css";

function App() {
  return (
    <div>
      <div className="tobcare-logo">TobCare.</div>
      <AuthContainer />
    </div>
  );
}

const AuthContainer = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div>
      {isLogin ? <DoctorLogin toggle={() => setIsLogin(false)} /> : <DoctorSignup toggle={() => setIsLogin(true)} />}
    </div>
  );
};

export default App;
