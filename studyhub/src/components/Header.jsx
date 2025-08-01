// src/components/Header.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../styles/Header.css";


const Header = ({ toggleSidebar }) => {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAvatar = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", user.id)
        .single();
      if (data?.avatar_url) setAvatarUrl(data.avatar_url);
    };
    fetchAvatar();
  }, []);

  return (
    <header className="main-header">
      <button className="menu-toggle" onClick={toggleSidebar}>☰</button>
      <h1 className="brand-title">StudyHub</h1>
      <div className="profile-icon" onClick={() => navigate("/Profile.jsx")}>
        <img src={avatarUrl || "/avatar.png"} alt="avatar" />
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
