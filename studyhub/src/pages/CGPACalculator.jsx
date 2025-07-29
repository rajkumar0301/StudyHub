import React, { useState } from 'react';
import "../styles/cgpa.css";

const gradePoints = {
  'A+': 10, 'A': 9, 'B+': 8, 'B': 7,
  'C+': 6, 'C': 5, 'D': 4, 'F': 0
};

function CGPACalculator() {
  const [semesters, setSemesters] = useState([
    [{ subject: '', credits: '', grade: '' }]
  ]);

  const addSemester = () => {
    setSemesters([...semesters, [{ subject: '', credits: '', grade: '' }]]);
  };

  const addSubject = (semIndex) => {
    const updated = [...semesters];
    updated[semIndex].push({ subject: '', credits: '', grade: '' });
    setSemesters(updated);
  };

  const handleInput = (semIndex, subjIndex, field, value) => {
    const updated = [...semesters];
    updated[semIndex][subjIndex][field] = value;
    setSemesters(updated);
  };

  const removeSubject = (semIndex, subjIndex) => {
    const updated = [...semesters];
    updated[semIndex].splice(subjIndex, 1);
    setSemesters(updated);
  };

  const calculateCGPA = () => {
    let totalPoints = 0, totalCredits = 0;
    semesters.forEach(sem =>
      sem.forEach(({ credits, grade }) => {
        const gp = gradePoints[grade] || 0;
        const cr = parseFloat(credits) || 0;
        totalPoints += gp * cr;
        totalCredits += cr;
      })
    );
    return totalCredits ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  };

  return (
    <div className="cgpa-container">
      <div className="cgpa-header">
        <h2>🎓 CGPA Calculator</h2>
        <p>Calculate your Cumulative Grade Point Average</p>
      </div>

      {semesters.map((semester, i) => (
        <div className="semester" key={i}>
          <h3>Semester {i + 1}</h3>
          {semester.map((subject, j) => (
            <div className="subject" key={j}>
              <input
                type="text"
                placeholder="e.g., Mathematics"
                value={subject.subject}
                onChange={(e) => handleInput(i, j, 'subject', e.target.value)}
              />
              <input
                type="number"
                placeholder="e.g., 3"
                value={subject.credits}
                onChange={(e) => handleInput(i, j, 'credits', e.target.value)}
              />
              <select
                value={subject.grade}
                onChange={(e) => handleInput(i, j, 'grade', e.target.value)}
              >
                <option value="">Select grade</option>
                {Object.keys(gradePoints).map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              <button className="remove-btn" onClick={() => removeSubject(i, j)}>🗑️</button>
            </div>
          ))}
          <button className="add-btn" onClick={() => addSubject(i)}>+ Add Subject</button>
        </div>
      ))}

      <div className="actions">
        <button onClick={addSemester}>+ Add Semester</button>
        <button className="calculate-btn">🎓 Calculate CGPA: {calculateCGPA()}</button>
      </div>

      <div className="grade-scale">
        <h3>Grade Scale</h3>
        {Object.entries(gradePoints).map(([grade, points]) => (
          <div key={grade} className="grade-row">
            <span>{grade}</span>
            <span>{points} points</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CGPACalculator;
