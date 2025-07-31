// src/pages/Welcome.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "../styles/welcome.css";

import WelcomeBox from "../components/stats/WelcomeBox";
import CGPATracker from "../components/stats/CGPATracker";
import AttendanceBox from "../components/stats/AttendanceBox";
import AssignmentsBox from "../components/stats/AssignmentsBox";

import "../styles/welcome.css";

const Welcome = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    };
    fetchUser();
  }, []);

  return (
    <div className="welcome-page">
      <WelcomeBox user={user} />
      <div className="stats-grid">
        <CGPATracker />
        <AttendanceBox />
        <AssignmentsBox />
      </div>
    </div>
  );
};

export default Welcome;
