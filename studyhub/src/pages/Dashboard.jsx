import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Sidebar from "../components/Sidebar";
// import WelcomeBox from "../components/WelcomeBox";
import { Outlet } from "react-router-dom"; // ✅ Import this
import "../styles/Dashboard.css";
import Header from "../components/Header";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setShowSidebar(!showSidebar);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) navigate("/");
      else setUser(user);
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="dashboard-container">
                <Header toggleSidebar={toggleSidebar} />
      <Sidebar
        user={user}
        showSidebar={showSidebar}
        toggleSidebar={toggleSidebar}
        handleLogout={handleLogout}
      />

      <div className="main" style={{ marginTop: "60px" }}>
       
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;








// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "../supabaseClient";
// import Sidebar from "../components/Sidebar";
// import WelcomeBox from "../components/WelcomeBox";
// import "../styles/Dashboard.css";

// const Dashboard = () => {
//   const [user, setUser] = useState(null);
//   const [showSidebar, setShowSidebar] = useState(false);
//   const navigate = useNavigate();

//   const toggleSidebar = () => setShowSidebar(!showSidebar);

//   useEffect(() => {
//     const fetchUser = async () => {
//       const { data: { user }, error } = await supabase.auth.getUser();
//       if (error || !user) navigate("/");
//       else setUser(user);
//     };
//     fetchUser();
//   }, [navigate]);

//   const handleLogout = async () => {
//     await supabase.auth.signOut();
//     navigate("/");
//   };

//   return (
//     <div className="dashboard-container">
//       {/* <button className="hamburger" onClick={toggleSidebar}>☰</button> */}
//       <Sidebar
//         user={user}
//         showSidebar={showSidebar}
//         toggleSidebar={toggleSidebar}
//         handleLogout={handleLogout}
//       />

//       <div className="main">
//         <div className="stats-box">
//           <WelcomeBox user={user} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
