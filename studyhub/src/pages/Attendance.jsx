import React, { useState } from "react";
import "../styles/attendance.css";

const Attendance = () => {
  const [subjects, setSubjects] = useState([
    { name: "Math", attended: 18, total: 20 },
    { name: "Physics", attended: 16, total: 18 },
  ]);
  const [newSubject, setNewSubject] = useState("");

  const handleAttendance = (index, type) => {
    const updated = [...subjects];
    updated[index].total += 1;
    if (type === "present") updated[index].attended += 1;
    setSubjects(updated);
  };

  const deleteSubject = (index) => {
    const updated = [...subjects];
    updated.splice(index, 1);
    setSubjects(updated);
  };

  const addSubject = () => {
    if (newSubject.trim()) {
      setSubjects([...subjects, { name: newSubject, attended: 0, total: 0 }]);
      setNewSubject("");
    }
  };

  const totalAttended = subjects.reduce((sum, s) => sum + s.attended, 0);
  const totalClasses = subjects.reduce((sum, s) => sum + s.total, 0);
  const overallPercent = totalClasses ? ((totalAttended / totalClasses) * 100).toFixed(1) : 0;

  return (
    <div className="attendance-wrapper">
      <h1>📊 Attendance Tracker</h1>
      <div className="overall-box">
        <h2>Overall Attendance</h2>
        <p className="percent">{overallPercent}%</p>
        <div className="progress-bar">
          <div className="progress" style={{ width: `${overallPercent}%` }}></div>
        </div>
        <p>{totalAttended} / {totalClasses} classes attended</p>
      </div>

      <div className="add-subject">
        <input
          type="text"
          placeholder="New subject"
          value={newSubject}
          onChange={(e) => setNewSubject(e.target.value)}
        />
        <button onClick={addSubject}>➕ Add</button>
      </div>

      <div className="subject-list">
        {subjects.map((subj, idx) => {
          const percent = subj.total ? ((subj.attended / subj.total) * 100).toFixed(1) : 0;
          return (
            <div className="subject-card" key={idx}>
              <div className="subject-header">
                <h3>{subj.name}</h3>
                <button className="delete-btn" onClick={() => deleteSubject(idx)}>🗑️</button>
              </div>
              <p>{subj.attended} / {subj.total} classes</p>
              <div className="progress-bar">
                <div className="progress" style={{ width: `${percent}%` }}></div>
              </div>
              <p className="percent">{percent}%</p>
              <div className="btn-group">
                <button onClick={() => handleAttendance(idx, "present")}>✅ Present</button>
                <button onClick={() => handleAttendance(idx, "absent")}>❌ Absent</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Attendance;


