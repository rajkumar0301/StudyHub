import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import Profile from "./pages/Profile";
import Attendance from "./pages/Attendance";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";
import Welcome from "./pages/Welcome";
import PercentageChecker from "./pages/PercentageChecker";
import CGPACalculator from "./pages/CGPACalculator";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes (Sidebar is rendered inside Dashboard layout) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          {/* Default welcome route when user visits /dashboard */}
          <Route index element={<Welcome />} />
          <Route path="documents" element={<Documents />} />
          <Route path="profile" element={<Profile />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="settings" element={<Settings />} />
          <Route path="percentage" element={<PercentageChecker />} />
          <Route path="CGPA" element={<CGPACalculator />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;






// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";
// import Documents from "./pages/Documents";
// import Profile from "./pages/Profile";
// import Attendance from "./pages/Attendance";
// import ProtectedRoute from "./components/ProtectedRoute";
// import Sidebar from "./components/Sidebar";
// import Welcome from "./pages/Welcome";
// import Settings from "./pages/Settings";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Sidebar />
//         {/* Public Routes */}
//         <Route path="/" element={<Login />} />
//         <Route path="/register" element={<Register />} />

//         {/* Protected Dashboard Layout with Nested Routes */}
//         <Route
//           path="/dashboard"
//           element={
//             <ProtectedRoute>
//               <Dashboard />
//             </ProtectedRoute>
//           }
//         >
//           <Route path="documents" element={<Documents />} />
//           <Route path="profile" element={<Profile />} />
//           <Route path="attendance" element={<Attendance />} />
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;












// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";
// import ProtectedRoute from "./components/ProtectedRoute";

// import Documents from "./pages/Documents"; // Add this
// import Profile from "./pages/Profile"; // (optional)
// import Attendance from "./pages/Attendance"; // (optional)

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route
//           path="/dashboard"
//           element={
//             <ProtectedRoute>
//               <Dashboard />
//             </ProtectedRoute>
//           }
//         >
//           <Route path="documents" element={<Documents />} />
//           <Route path="profile" element={<Profile />} />
//           <Route path="attendance" element={<Attendance />} />
//           {/* Add more nested routes if needed */}
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;


// // src/App.jsx
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";
// import ProtectedRoute from "./components/ProtectedRoute";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route
//           path="/dashboard"
//           element={
//             <ProtectedRoute>
//               <Dashboard />
//             </ProtectedRoute>
//           }
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;
