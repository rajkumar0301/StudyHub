// src/pages/Welcome.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "../styles/welcome.css";
import { FaFileAlt, FaGraduationCap, FaCalendarAlt } from "react-icons/fa";
import WelcomeBox from "../components/stats/WelcomeBox";
import StatCard from "../components/stats/StatCard";

const Welcome = () => {
  const [user, setUser] = useState(null);
  const [cgpaCount, setCgpaCount] = useState(0);
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [fileCount, setFileCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndStats = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        if (!user) return;

        // Fetch CGPA records count
        const cgpa = await supabase
          .from("cgpa_data")
          .select("*")
          .eq("user_id", user.id);
        setCgpaCount(cgpa.data?.length || 0);

        // Fetch attendance entries count
        const attendance = await supabase
          .from("attendance")
          .select("*")
          .eq("user_id", user.id);
        setAttendanceCount(attendance.data?.length || 0);

        // Fetch file uploads count
        const files = await supabase
          .from("documents")
          .select("name") // Make sure your column is 'name'
          .eq("user_id", user.id)
          .limit(5);
        setFileCount(files.data?.length || 0);
      } catch (error) {
        console.error("❌ Failed to load dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndStats();
  }, []);

  if (loading) {
    return (
      <div className="welcome-page loading">
        <p className="loading-text">🔄 Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="welcome-page">
      <WelcomeBox user={user} />

      <div className="stats-grid">
      <StatCard
  title="CGPA Records"
  count={cgpaCount}
  icon="🎓"
  color="#6a1b9a"
  goal={40}
/>

<StatCard
  title="Attendance "
  count={attendanceCount}
  icon="📅"
  color="#00796b"
  goal={50}
/>

<StatCard
  title="Uploaded Files"
  count={fileCount}
  icon="📁"
  color="#1565c0"
  goal={10}
/>

      </div>
    </div>
  );
};

export default Welcome;
