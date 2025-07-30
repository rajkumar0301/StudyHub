import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../styles/Header.css";

const Header = ({ toggleSidebar }) => {
  const [profileUrl, setProfileUrl] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserProfile = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) return;

      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", user.id)
        .single();

      if (!profileError && data?.avatar_url) {
        setProfileUrl(data.avatar_url);
      }
    };

    getUserProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <header className="header">
      <div className="menu-button" onClick={toggleSidebar}>☰</div>
      <div className="app-name">StudyHub</div>

      <div className="profile-section" onClick={() => setShowDropdown(!showDropdown)}>
        <img src={profileUrl || "/avatar.png"} alt="Profile" />
        {showDropdown && (
          <div className="dropdown-menu">
            {/* <div onClick={() => navigate("/profile")}>👤 My Profile</div>
            <div onClick={handleLogout}>🚪 Logout</div> */}
          </div>
        )}
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
