// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../styles/Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        navigate("/");
      } else {
        setUser(user);
        setName(user.user_metadata?.name || "");
        setBio(user.user_metadata?.bio || "");
      }
    };

    fetchUser();
  }, [navigate]);

  const handleUpdate = async () => {
    const { error } = await supabase.auth.updateUser({
      data: { name, bio },
    });

    if (error) {
      alert("Update failed");
    } else {
      alert("Profile updated successfully!");
    }
  };

  return (
    <div className="profile-container">
      <h2>👤 My Profile</h2>
      {user && (
        <>
          <p><strong>Email:</strong> {user.email}</p>
          <div className="form-group">
            <label>Display Name:</label>
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Bio:</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>
          <button onClick={handleUpdate}>Update Profile</button>
        </>
      )}
    </div>
  );
};

export default Profile;
