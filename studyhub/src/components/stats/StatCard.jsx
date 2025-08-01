// src/components/stats/StatCard.jsx
import React, { useState } from "react";
import "../../styles/statcard.css";

const StatCard = ({ title, count, icon, goal = 100, color = "#4b0082" }) => {
  const [expanded, setExpanded] = useState(false);
  const percentage = Math.min((count / goal) * 100, 100).toFixed(1);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <div
      className={`stat-card ${expanded ? "expanded" : ""}`}
      style={{ borderTop: `4px solid ${color}` }}
      onClick={handleToggle}
    >
      <div className="stat-icon" style={{ color }}>{icon}</div>
      <h3>{title}</h3>
      <p className="stat-count">{count}</p>
      {/* <p className="stat-percent">{percentage}% of {goal}</p> */}
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        ></div>
      </div>

      {expanded && (
        <div className="stat-extra">
          {/* <p>📌 More info about {title} coming soon...</p> */}
        </div>
      )}
    </div>
  );
};

export default StatCard;





// // src/components/stats/StatCard.jsx
// import React from "react";
// import "../../styles/statcard.css";

// const StatCard = ({ title, count, icon }) => {
//   const progress = Math.min((count / 100) * 100, 100); // Example scaling

//   return (
//     <div className="stat-card">
//       <div className="stat-icon">{icon}</div>
//       <h3>{title}</h3>
//       <p className="stat-count">{count}</p>
//       <div className="progress-bar">
//         <div
//           className="progress-fill"
//           style={{ width: `${progress}%` }}
//         ></div>
//       </div>
//     </div>
//   );
// };

// export default StatCard;
