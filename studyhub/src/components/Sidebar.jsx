import React, { useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = ({ handleLogout, showSidebar, toggleSidebar }) => {
  const sidebarRef = useRef(null);

  // Close sidebar on outside click (mobile only)
  useEffect(() => {
    const handleClickOutside = (e) => {
      const isMobile = window.innerWidth < 768;
      if (
        showSidebar &&
        isMobile &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target) &&
        !e.target.classList.contains("hamburger-button")
      ) {
        toggleSidebar();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSidebar, toggleSidebar]);

  return (
    <>
      {/* Mobile Hamburger Button */}
      {window.innerWidth < 768 && !showSidebar && (
        <button className="hamburger-button" onClick={toggleSidebar}>
          ☰
        </button>
      )}

      <div
        ref={sidebarRef}
        className={`sidebar ${showSidebar ? "open" : "closed"}`}
      >
        {/* Mobile Header */}
        {window.innerWidth < 768 && (
          <div className="mobile-header">
            <button className="hamburger-button" onClick={toggleSidebar}>
              ☰
            </button>
            {/* <h2 className="app-title">StudyHub</h2> */}
            {/* <img
              src="/profile.png"
              alt="Profile"
              className="profile-icon"
            /> */}
          </div>
        )}

        {/* Sidebar Menu */}
        <div className="sidebar-menu">
          <p className="username"></p>
          <ul>
            <li>
              <NavLink
                to="/dashboard"
                onClick={toggleSidebar}
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                🏠 Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/attendance"
                onClick={toggleSidebar}
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                📈 Attendance Tracker
              </NavLink>
            </li>
            <li>
              {/* <NavLink
                to="/dashboard/percentage"
                onClick={toggleSidebar}
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                📉 Percentage Calculator
              </NavLink> */}
            </li>
            <li>
              <NavLink
                to="/dashboard/CGPA"
                onClick={toggleSidebar}
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                🎓 CGPA Calculator
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/documents"
                onClick={toggleSidebar}
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                📂 Documents
              </NavLink>
            </li>
            <li>
              
              <NavLink
                to="/dashboard/settings"
                onClick={toggleSidebar}
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                ⚙️ Settings
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="sidebar-footer">
          <button className="logout-button" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;






// // src/components/Sidebar.jsx
// import React, { useEffect, useRef } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import {
//   LayoutDashboard,
//   FileText,
//   BookOpen,
//   Settings,
//   LogOut,
// } from "lucide-react";
// import "../styles/Sidebar.css";

// const Sidebar = ({ isOpen, toggleSidebar, handleLogout }) => {
//   const sidebarRef = useRef(null);
//   const navigate = useNavigate();

//   const closeSidebar = () => {
//     if (window.innerWidth < 768) toggleSidebar(false);
//   };

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       const isMobile = window.innerWidth < 768;
//       if (
//         isOpen &&
//         isMobile &&
//         sidebarRef.current &&
//         !sidebarRef.current.contains(e.target) &&
//         !e.target.classList.contains("menu-button")
//       ) {
//         toggleSidebar(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [isOpen, toggleSidebar]);

//   return (
//     <div ref={sidebarRef} className={`sidebar ${isOpen ? "open" : ""}`}>
//       <div className="sidebar-header">
//         <img src="/logo.png" alt="StudyHub" className="logo" />
//         <h2 className="username">Welcome, Student</h2>
//       </div>

//       <nav className="sidebar-links">
//         <NavLink to="/dashboard" onClick={closeSidebar}>
//           <LayoutDashboard className="icon" />
//           Dashboard
//         </NavLink>
//         <NavLink to="/documents" onClick={closeSidebar}>
//           <FileText className="icon" />
//           Documents
//         </NavLink>
//         <NavLink to="/attendance" onClick={closeSidebar}>
//           <BookOpen className="icon" />
//           Attendance
//         </NavLink>
//         <NavLink to="/settings" onClick={closeSidebar}>
//           <Settings className="icon" />
//           Settings
//         </NavLink>
//       </nav>

//       <div className="sidebar-footer">
//         <button onClick={() => { handleLogout(); closeSidebar(); }}>
//           <LogOut className="icon" />
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;












// import React, { useState, useEffect, useRef } from "react";
// import { NavLink } from "react-router-dom";
// import "../styles/Sidebar.css";

// const Sidebar = ({ handleLogout }) => {
//   const [isOpen, setIsOpen] = useState(window.innerWidth >= 768);
//   const sidebarRef = useRef(null);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsOpen(window.innerWidth >= 768);
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const toggleSidebar = () => setIsOpen((prev) => !prev);
//   const closeSidebar = () => {
//     if (window.innerWidth < 768) setIsOpen(false);
//   };

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       const isMobile = window.innerWidth < 768;
//       if (
//         isOpen &&
//         isMobile &&
//         sidebarRef.current &&
//         !sidebarRef.current.contains(e.target) &&
//         !e.target.classList.contains("hamburger-button")
//       ) {
//         closeSidebar();
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [isOpen]);

//   return (
//     <>
//       {window.innerWidth < 768 && !isOpen && (
//         <button className="hamburger-button" onClick={toggleSidebar}>
//           ☰
//         </button>
//       )}

//       <div ref={sidebarRef} className={`sidebar ${isOpen ? "open" : "closed"}`}>
//         {/* Header */}
//         {/* <div className="sidebar-header">
//           <h2>📚 StudyHub</h2>
//           {window.innerWidth < 768 && (
//             <button className="close-button" onClick={closeSidebar}>
//               ✖
//             </button>
//           )}
//         </div> */}
//         {/* Topbar for mobile view only */}
// {window.innerWidth < 768 && (
//   <div className="mobile-header">
//     <button className="hamburger-button" onClick={toggleSidebar}>
//       ☰
//     </button>
//     <h2 className="app-title">StudyHub</h2>
//     <img
//       src="/profile.png" // Replace with your actual profile image path
//       alt="Profile"
//       className="profile-icon"
//     />
//   </div>
// )}


//         {/* Scrollable Middle */}
//         <div className="sidebar-menu">
//           <p className="username">👤 Raj Kumar Hembram</p>
//           <ul>
//             <li>
//               <NavLink to="/dashboard" onClick={closeSidebar} className={({ isActive }) => (isActive ? "active-link" : "")}>
//                 🏠  Home
//               </NavLink>
//             </li>
//             <li>
//               <NavLink to="/dashboard/attendance" onClick={closeSidebar} className={({ isActive }) => (isActive ? "active-link" : "")}>
//                 📈 Attendance Tracker
//               </NavLink>
//             </li>
//             <li>
//               <NavLink to="/dashboard/percentage" onClick={closeSidebar} className={({ isActive }) => (isActive ? "active-link" : "")}>
//                 📉 Percentage Calculator
//               </NavLink>
//             </li>
//             <li>
//               <NavLink to="/dashboard/CGPA" onClick={closeSidebar} className={({ isActive }) => (isActive ? "active-link" : "")}>
//                 🎓 CGPA Calculator
//               </NavLink>
//             </li>
//             <li>
//               <NavLink to="/dashboard/documents" onClick={closeSidebar} className={({ isActive }) => (isActive ? "active-link" : "")}>
//                 📂 Documents
//               </NavLink>
//             </li>
//             <li>
//               <NavLink to="/dashboard/settings" onClick={closeSidebar} className={({ isActive }) => (isActive ? "active-link" : "")}>
//                 ⚙️ Settings
//               </NavLink>
//             </li>
//           </ul>
//         </div>

//         {/* Fixed Footer */}
//         <div className="sidebar-footer">
//           <button className="logout-button" onClick={handleLogout}>
//             🚪 Logout
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Sidebar;


// import React, { useState, useEffect, useRef } from "react";
// import { NavLink } from "react-router-dom";
// import "../styles/Sidebar.css";

// const Sidebar = ({ handleLogout }) => {
//   const [isOpen, setIsOpen] = useState(window.innerWidth >= 768); // Always open on desktop
//   const sidebarRef = useRef(null);

//   // Toggle sidebar on resize
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth >= 768) {
//         setIsOpen(true);
//       } else {
//         setIsOpen(false);
//       }
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const toggleSidebar = () => setIsOpen((prev) => !prev);
//   const closeSidebar = () => {
//     if (window.innerWidth < 768) setIsOpen(false);
//   };

//   // Close sidebar on outside click (only on mobile)
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       const isMobile = window.innerWidth < 768;
//       if (
//         isOpen &&
//         isMobile &&
//         sidebarRef.current &&
//         !sidebarRef.current.contains(e.target) &&
//         !e.target.classList.contains("hamburger-button")
//       ) {
//         closeSidebar();
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [isOpen]);

//   return (
//     <>
//       {/* Hamburger button only for mobile */}
//       {window.innerWidth < 768 && !isOpen && (
//         <button className="hamburger-button" onClick={toggleSidebar}>
//           ☰
//         </button>
//       )}

//       {/* Sidebar */}
//       <div ref={sidebarRef} className={`sidebar ${isOpen ? "open" : "closed"}`}>
//         <div className="sidebar-header">
//           <h2>📚 StudyHub</h2>
//           {window.innerWidth < 768 && (
//             <button className="close-button" onClick={closeSidebar}>
//               ✖
//             </button>
//           )}
//         </div>

//         <div className="sidebar-content">
//           <p className="username">👤 John Doe</p>
//           <ul>
//             <li>
//               <NavLink
//                 to="/dashboard"
//                 className={({ isActive }) => (isActive ? "active-link" : "")}
//                 onClick={closeSidebar}
//               >
//                 📊 CGPA Calculator
//               </NavLink>
//             </li>
//             <li>
//               <NavLink
//                 to="/dashboard/attendance"
//                 className={({ isActive }) => (isActive ? "active-link" : "")}
//                 onClick={closeSidebar}
//               >
//                 📈 Attendance Tracker
//               </NavLink>
//             </li>
//             <li>
//               <NavLink
//                 to="/dashboard/percentage"
//                 className={({ isActive }) => (isActive ? "active-link" : "")}
//                 onClick={closeSidebar}
//               >
//                 📉 Percentage Checker
//               </NavLink>
//             </li>
//             <li>
//               <NavLink
//                 to="/dashboard/documents"
//                 className={({ isActive }) => (isActive ? "active-link" : "")}
//                 onClick={closeSidebar}
//               >
//                 📂 Documents
//               </NavLink>
//             </li>
//             <li>
//               <NavLink
//                 to="/dashboard/settings"
//                 className={({ isActive }) => (isActive ? "active-link" : "")}
//                 onClick={closeSidebar}
//               >
//                 ⚙️ Settings
//               </NavLink>
//             </li>
//           </ul>
//         </div>

//         <div className="sidebar-footer">
//           <button className="logout-button" onClick={handleLogout}>
//             🚪 Logout
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Sidebar;







// import React, { useState, useEffect, useRef } from "react";
// import { NavLink } from "react-router-dom";


// import "../styles/Sidebar.css";

// const Sidebar = () => {
//   const [isOpen, setIsOpen] = useState(window.innerWidth >= 768); // always open on desktop
//   const sidebarRef = useRef(null);

//   // Update open state on resize
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth >= 768) {
//         setIsOpen(true);
//       } else {
//         setIsOpen(false);
//       }
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const toggleSidebar = () => setIsOpen((prev) => !prev);
//   const closeSidebar = () => {
//     if (window.innerWidth < 768) setIsOpen(false);
//   };

//   // Close on outside click (only on mobile)
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       const isMobile = window.innerWidth < 768;
//       if (
//         isOpen &&
//         isMobile &&
//         sidebarRef.current &&
//         !sidebarRef.current.contains(e.target) &&
//         !e.target.classList.contains("hamburger-button")
//       ) {
//         closeSidebar();
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () =>
//       document.removeEventListener("mousedown", handleClickOutside);
//   }, [isOpen]);

//   return (
//     <>
//       {/* Show ☰ hamburger only on mobile + sidebar is closed */}
//       {window.innerWidth < 768 && !isOpen && (
//         <button className="hamburger-button" onClick={toggleSidebar}>
//           ☰
//         </button>
//       )}

//       {/* Sidebar */}
//       <div
//         ref={sidebarRef}
//         className={`sidebar ${isOpen ? "open" : "closed"}`}
//       >
//         <div className="sidebar-header">
//           <h2>📚 StudyHub</h2>

//           {/* Show ✖ close only on mobile */}
//           {window.innerWidth < 768 && (
//             <button className="close-button" onClick={closeSidebar}>
//               ✖
//             </button>
//           )}
//         </div>

//         <div className="sidebar-content">
//           <p className="username">👤 John Doe</p>
//         <ul>
//   <li>
//     <NavLink
//       to="/dashboard"
//       className={({ isActive }) => isActive ? "active-link" : ""}
//       onClick={closeSidebar}
//     >
//       📊 CGPA Calculator
//     </NavLink>
//   </li>
//   <li>
//     <NavLink
//       to="/dashboard/attendance"
//       className={({ isActive }) => isActive ? "active-link" : ""}
//       onClick={closeSidebar}
//     >
//       📈 Attendance Tracker
//     </NavLink>
//   </li>
//   <li>
//     <NavLink
//       to="/dashboard"
//       className={({ isActive }) => isActive ? "active-link" : ""}
//       onClick={closeSidebar}
//     >
//       📉 Percentage Checker
//     </NavLink>
//   </li>
//   <li>
//     <NavLink
//       to="/dashboard/documents"
//       className={({ isActive }) => isActive ? "active-link" : ""}
//       onClick={closeSidebar}
//     >
//       📂 Documents
//     </NavLink>
//   </li>
//   <li>
//     <NavLink
//       to="/dashboard/settings"
//       className={({ isActive }) => isActive ? "active-link" : ""}
//       onClick={closeSidebar}
//     >
//       ⚙️ Settings
//     </NavLink>
//   </li>
// </ul>



//         </div>

//         <div className="sidebar-footer">
//             <button className="logout-button" onClick={handleLogout}>
//                        🚪 Logout
//             </button>
//         </div>
//       </div>
//     </>
//   );
// };


// export default Sidebar;











// import React, { useState, useEffect, useRef } from "react";
// import "../styles/Sidebar.css";

// const Sidebar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const sidebarRef = useRef(null);

//   const toggleSidebar = () => setIsOpen(!isOpen);
//   const closeSidebar = () => setIsOpen(false);

//   // Close on outside click
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (
//         isOpen &&
//         sidebarRef.current &&
//         !sidebarRef.current.contains(e.target) &&
//         !e.target.classList.contains("hamburger-button")
//       ) {
//         closeSidebar();
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [isOpen]);

//   return (
//     <>
//       {/* Hamburger (top-left corner) */}
//      {/* Show hamburger button only when sidebar is closed */}
// {!isOpen && (
//   <button className="hamburger-button" onClick={toggleSidebar}>
//     ☰
//   </button>
// )}


//       {/* Sidebar */}
//       <div
//         ref={sidebarRef}
//         className={`sidebar ${isOpen ? "open" : "closed"}`}
//       >
//         <div className="sidebar-header">
//           <h2>📚 StudyHub</h2>
//           <div className="close-desktop-hidden">
//           <button className="close-button" onClick={closeSidebar}>✖</button>
//           </div>
//         </div>

//         <div className="sidebar-content">
//           <p className="username">👤 John Doe</p>
//           <ul>
//             <li>📊 CGPA Calculator</li>
//             <li>📈 Attendance Tracker</li>
//             <li>📉 Percentage Checker</li>
//             <li>📂 Documents</li>
//             <li>⚙️ Settings</li>
//           </ul>
//         </div>

//         <div className="sidebar-footer">
//           <button className="logout-button">🚪 Logout</button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Sidebar;


