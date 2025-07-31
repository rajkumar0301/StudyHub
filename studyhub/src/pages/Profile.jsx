import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { v4 as uuidv4 } from "uuid";
import "../styles/Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({ name: "", bio: "", avatar_url: "" });
  const [avatarFile, setAvatarFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        navigate("/");
        return;
      }

      setUser(user);

      // Try to get the profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("name, bio, avatar_url")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Profile fetch error:", profileError.message);
        return;
      }

      if (!profileData) {
        // Insert default profile if it doesn't exist
        const { error: insertError } = await supabase.from("profiles").insert([
          {
            id: user.id, // must match auth.uid()
            name: "",
            bio: "",
            avatar_url: "",
          },
        ]);

        if (insertError) {
          console.error("Insert error:", insertError.message);
        } else {
          setProfile({ name: "", bio: "", avatar_url: "" });
        }
      } else {
        setProfile(profileData);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleUpdate = async () => {
    let avatarPath = profile.avatar_url;

    // Upload new avatar if selected
    if (avatarFile) {
      const extension = avatarFile.name.split(".").pop();
      const filename = `${uuidv4()}.${extension}`;
      const filePath = `public/${filename}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, avatarFile, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError.message);
        alert("Failed to upload avatar.");
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      avatarPath = publicUrlData?.publicUrl || avatarPath;
    }

    // Update profile
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        name: profile.name,
        bio: profile.bio,
        avatar_url: avatarPath,
      })
      .eq("id", user.id)
      .select()
      .single(); // prevents 406

    if (updateError) {
      console.error("Update error:", updateError.message);
      alert("Failed to update profile.");
    } else {
      alert("Profile updated!");
      setProfile((prev) => ({ ...prev, avatar_url: avatarPath }));
    }
  };

  return (
    <div className="profile-container">
      <h2>👤 My Profile</h2>

      {user && (
        <>
          <p><strong>Email:</strong> {user.email}</p>

          {profile.avatar_url && (
            <img
              src={profile.avatar_url}
              alt="Avatar"
              className="avatar-preview"
              style={{ width: "100px", borderRadius: "50%" }}
            />
          )}

          <div className="form-group">
            <label>Upload Avatar:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files[0])}
            />
          </div>

          <div className="form-group">
            <label>Display Name:</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) =>
                setProfile({ ...profile, name: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Bio:</label>
            <textarea
              value={profile.bio}
              onChange={(e) =>
                setProfile({ ...profile, bio: e.target.value })
              }
            />
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
// import { v4 as uuidv4 } from "uuid";
// import "../styles/Profile.css";

// const fetchAvatar = async (userId) => {
//   const { data, error } = await supabase
//     .from('profiles')
//     .select('avatar_url')
//     .eq('id', userId)
//     .single();

//   if (error) {
//     console.error("Error fetching avatar:", error.message);
//     return null;
//   }

//   return data?.avatar_url;
// };


// const Profile = () => {
//   const [user, setUser] = useState(null);
//   const [profile, setProfile] = useState({ name: "", bio: "", avatar_url: "" });
//   const [avatarFile, setAvatarFile] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//   const fetchProfile = async () => {
//     const {
//       data: { user },
//       error,
//     } = await supabase.auth.getUser();

//     if (error || !user) {
//       navigate("/");
//       return;
//     }

//     setUser(user);

//     // Try to get profile
//     const { data: profileData, error: profileError } = await supabase
//       .from("profiles")
//       .select("name, bio, avatar_url")
//       .eq("id", user.id)
//       .maybeSingle();

//     if (profileError) {
//       console.error("Profile fetch error:", profileError.message);
//       return;
//     }

//     if (!profileData) {
//       // Insert if not exists
//       const { error: insertError } = await supabase.from("profiles").insert([
//         {
//           id: user.id,
//           name: "",
//           bio: "",
//           avatar_url: "",
//         },
//       ]);

//       if (insertError) {
//         console.error("Insert error:", insertError.message);
//       } else {
//         setProfile({ name: "", bio: "", avatar_url: "" });
//       }
//     } else {
//       setProfile(profileData);
//     }
//   };

//   fetchProfile();
// }, [navigate]);


//   // useEffect(() => {
//   //   const fetchProfile = async () => {
//   //     const { data: { user }, error } = await supabase.auth.getUser();

//   //     if (error || !user) {
//   //       navigate("/");
//   //       return;
//   //     }

//   //     setUser(user);

//   //     const { data: profileData, error: profileError } = await supabase
//   //       .from("profiles")
//   //       .select("name, bio, avatar_url")
//   //       .eq("id", user.id)
//   //       .single();

//   //     if (profileError) {
//   //       console.error("profile fetch error:", profileError.message);
//   //     } else {
//   //       setProfile(profileData);
//   //     }
//   //   };

//   //   fetchProfile();
//   // }, [navigate]);

//   const handleUpdate = async () => {
//     let avatarPath = profile.avatar_url;

//     // 1. Upload new avatar if selected
//     if (avatarFile) {
//       const extension = avatarFile.name.split(".").pop();
//       const filename = `${uuidv4()}.${extension}`;
//       const filePath = `public/${filename}`;

//       const { error: uploadError } = await supabase.storage
//         .from("avatars")
//         .upload(filePath, avatarFile, {
//           cacheControl: "3600",
//           upsert: true,
//         });

//       if (uploadError) {
//         console.error("Upload error:", uploadError.message);
//         alert("Failed to upload avatar.");
//         return;
//       }

//       const { data: publicUrlData } = supabase.storage
//         .from("avatars")
//         .getPublicUrl(filePath);

//       avatarPath = publicUrlData?.publicUrl || avatarPath;
//     }

//     // 2. Update profile in DB
//     const { error: updateError } = await supabase
//       .from("profiles")
//       .update({
//         name: profile.name,
//         bio: profile.bio,
//         avatar_url: avatarPath,
//       })
//       .eq("id", user.id)
//       .select() // Important: prevents 406 error
//       .single();

//     if (updateError) {
//       console.error("Update error:", updateError.message);
//       alert("Failed to update profile.");
//     } else {
//       alert("Profile updated!");
//       setProfile((prev) => ({ ...prev, avatar_url: avatarPath }));
//     }
//   };

//   return (
//     <div className="profile-container">
//       <h2>👤 My Profile</h2>

//       {user && (
//         <>
//           <p><strong>Email:</strong> {user.email}</p>

//           {profile.avatar_url && (
//             <img
//               src={profile.avatar_url}
//               alt="Avatar"
//               className="avatar-preview"
//               style={{ width: "100px", borderRadius: "50%" }}
//             />
//           )}

//           <div className="form-group">
//             <label>Upload Avatar:</label>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => setAvatarFile(e.target.files[0])}
//             />
//           </div>

//           <div className="form-group">
//             <label>Display Name:</label>
//             <input
//               type="text"
//               value={profile.name}
//               onChange={(e) =>
//                 setProfile({ ...profile, name: e.target.value })
//               }
//             />
//           </div>

//           <div className="form-group">
//             <label>Bio:</label>
//             <textarea
//               value={profile.bio}
//               onChange={(e) =>
//                 setProfile({ ...profile, bio: e.target.value })
//               }
//             />
//           </div>

//           <button onClick={handleUpdate}>Update Profile</button>
//         </>
//       )}
//     </div>
//   );
// };

// export default Profile;





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
