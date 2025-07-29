import React from "react";
import WelcomeBox from "../components/stats/WelcomeBox";
import CGPATracker from "../components/stats/CGPATracker";
import AttendanceBox from "../components/stats/AttendanceBox";
import AssignmentsBox from "../components/stats/AssignmentsBox";

import "../styles/welcome.css";

const Welcome = () => {
  return (
    <div className="welcome-page">
      <WelcomeBox />
      <div className="stats-grid">
        <CGPATracker />
        <AttendanceBox />
        <AssignmentsBox />
      </div>
    </div>
  );
};

export default Welcome;
