import React from "react";
import "../styles/setting.css";

const Settings = () => {
  return (
    <div className="settings-page">
      <h2>⚙️ Settings</h2>
      <div className="settings-section">
        <h3>Theme</h3>
        <label>
          <input type="checkbox" onChange={() => {
            document.body.classList.toggle("dark-mode");
          }} />
          Dark Mode
        </label>
      </div>

      <div className="settings-section">
        <h3>Account</h3>
        <button onClick={() => alert("Profile Edit Coming Soon!")}>
          Edit Profile
        </button>
        <button onClick={() => alert("Password Change Coming Soon!")}>
          Change Password
        </button>
      </div>
    </div>
  );
};

export default Settings;

