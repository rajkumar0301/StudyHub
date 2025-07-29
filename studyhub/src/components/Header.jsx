// src/components/Header.jsx
import React, { useEffect, useState } from "react";
import "../styles/Header.css";
import { supabase } from "../supabaseClient"; // ✅ adjust path if needed

const Header = ({ toggleSidebar }) => {
  const [profileUrl, setProfileUrl] = useState(null);

  useEffect(() => {
    const getUserProfile = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) return;

      // Fetch user profile data from 'profiles' table (adjust table/column name)
      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("avatar_url") // change to your column name
        .eq("id", user.id)
        .single();

      if (!profileError && data?.avatar_url) {
        setProfileUrl(data.avatar_url);
      }
    };

    getUserProfile();
  }, []);

  return (
    <header className="header">
      <div className="menu-button" onClick={toggleSidebar}>☰</div>
      <div className="app-name">StudyHub</div>
      <div className="profile-section">
        <img
          src={profileUrl || "/avatar.png"}
          alt="Profile"
        />
      </div>
    </header>
  );
};

export default Header;




// // src/components/Header.jsx
// import React from "react";
// import "../styles/Header.css";

// const Header = ({ toggleSidebar }) => {
//   return (
//     <header className="header">
//       <div className="menu-button" onClick={toggleSidebar}>☰</div>
//       <div className="app-name">StudyHub</div>
//       <div className="profile-section">
//         <img src="./avatar.png" alt="Profile" />
//       </div>
//     </header>
//   );
// };

// export default Header;
