// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { v4 as uuidv4 } from "uuid"; // for unique filename
import "../styles/Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
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
        setAvatarUrl(user.user_metadata?.avatar_url || "");
      }
    };

    fetchUser();
  }, [navigate]);

  const handleUpdate = async () => {
  let avatarPath = avatarUrl;

  if (avatarFile) {
    const filename = `${uuidv4()}.${avatarFile.name.split(".").pop()}`;
    const filePath = `public/${filename}`;

    const { data, error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, avatarFile);

    if (uploadError) {
      console.error("Upload Error:", uploadError);
      alert("Avatar upload failed!");
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    avatarPath = publicUrlData.publicUrl;
  }

  const { error } = await supabase.auth.updateUser({
    data: { name, bio, avatar_url: avatarPath },
  });

  if (error) {
    alert("Update failed");
  } else {
    alert("Profile updated successfully!");
    setAvatarUrl(avatarPath);
  }
};

  return (
    <div className="profile-container">
      <h2>👤 My Profile</h2>
      {user && (
        <>
          <p><strong>Email:</strong> {user.email}</p>

          {avatarUrl && (
            <img
              src={avatarUrl}
              alt="Avatar"
              className="avatar-preview"
              style={{ width: "100px", borderRadius: "50%" }}
            />
          )}

          <div className="form-group">
            <label>Upload Avatar:</label>
            <input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files[0])} />
          </div>

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







// // src/pages/Profile.jsx
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "../supabaseClient";
// import "../styles/Profile.css";

// const Profile = () => {
//   const [user, setUser] = useState(null);
//   const [name, setName] = useState("");
//   const [bio, setBio] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUser = async () => {
//       const {
//         data: { user },
//         error,
//       } = await supabase.auth.getUser();

//       if (error || !user) {
//         navigate("/");
//       } else {
//         setUser(user);
//         setName(user.user_metadata?.name || "");
//         setBio(user.user_metadata?.bio || "");
//       }
//     };

//     fetchUser();
//   }, [navigate]);

//   const handleUpdate = async () => {
//     const { error } = await supabase.auth.updateUser({
//       data: { name, bio },
//     });

//     if (error) {
//       alert("Update failed");
//     } else {
//       alert("Profile updated successfully!");
//     }
//   };

//   return (
//     <div className="profile-container">
//       <h2>👤 My Profile</h2>
//       {user && (
//         <>
//           <p><strong>Email:</strong> {user.email}</p>
//           <div className="form-group">
//             <label>Display Name:</label>
//             <input value={name} onChange={(e) => setName(e.target.value)} />
//           </div>
//           <div className="form-group">
//             <label>Bio:</label>
//             <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
//           </div>
//           <button onClick={handleUpdate}>Update Profile</button>
//         </>
//       )}
//     </div>
//   );
// };

// export default Profile;
