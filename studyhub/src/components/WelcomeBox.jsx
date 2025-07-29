import React from "react";
import "../styles/WelcomeBox.css";

const WelcomeBox = ({ user }) => {
  return (
    <div className="welcome-box">
      <h2>Welcome, {user?.email || "Student"}! 🎉</h2>
      <p>We're glad to have you here at StudyHub.</p>
    </div>
  );
};

export default WelcomeBox;
