// src/components/QuickActions.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/quickactions.css";

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    { label: "📂 Upload Document", path: "/dashboard/documents" },
    { label: "📊 Calculate CGPA", path: "/dashboard/cgpa" },
    { label: "📈 Attendance %", path: "/dashboard/attendance" },
    { label: "🗓️ Daily Routine", path: "/dashboard/routine" },
  ];

  return (
    <div className="quick-actions">
      <h2>⚡ Quick Actions</h2>
      <div className="actions-container">
        {actions.map((action, idx) => (
          <button
            key={idx}
            className="action-button"
            onClick={() => navigate(action.path)}
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
