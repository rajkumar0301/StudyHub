// PercentageChecker.jsx
import React, { useState } from 'react';
import "../styles/percentage.css";

const PercentageChecker = () => {
  const [subjects, setSubjects] = useState([
    { subjectName: '', marksObtained: '', totalMarks: '' }
  ]);
  const [result, setResult] = useState(null);

  const handleChange = (index, field, value) => {
    const newSubjects = [...subjects];
    newSubjects[index][field] = value;
    setSubjects(newSubjects);
  };

  const addSubject = () => {
    setSubjects([...subjects, { subjectName: '', marksObtained: '', totalMarks: '' }]);
  };

  const calculatePercentage = (e) => {
    e.preventDefault();
    let totalObtained = 0, totalMax = 0;

    subjects.forEach((subj) => {
      totalObtained += parseFloat(subj.marksObtained || 0);
      totalMax += parseFloat(subj.totalMarks || 0);
    });

    if (totalMax === 0) {
      setResult('❌ Please enter valid marks.');
    } else {
      const percentage = ((totalObtained / totalMax) * 100).toFixed(2);
      setResult(`✅ Overall Percentage: ${percentage}%`);
    }
  };

  return (
    <div className="checker-wrapper">

      {/* === STAT BOX TOP === */}
      <div className="stat-box">
        <span className="stat-icon">📊</span>
        <div>
          <h2>Percentage Checker</h2>
          <p>Calculate your marks percentage and overall performance</p>
        </div>
      </div>

      {/* === FORM CARD === */}
      <div className="checker-card">
        <h3>🧮 Enter Subject Marks</h3>
        <form onSubmit={calculatePercentage}>
          {subjects.map((subject, index) => (
            <div key={index} className="subject-box">
              <h4>Subject {index + 1}</h4>
              <input
                type="text"
                placeholder="Subject Name"
                value={subject.subjectName}
                onChange={(e) => handleChange(index, 'subjectName', e.target.value)}
              />
              <input
                type="number"
                placeholder="Marks Obtained"
                value={subject.marksObtained}
                onChange={(e) => handleChange(index, 'marksObtained', e.target.value)}
              />
              <input
                type="number"
                placeholder="Total Marks"
                value={subject.totalMarks}
                onChange={(e) => handleChange(index, 'totalMarks', e.target.value)}
              />
            </div>
          ))}

          <div className="button-row">
            <button type="button" onClick={addSubject}>➕ Add Subject</button>
            <button type="submit">✅ Calculate</button>
          </div>
        </form>
      </div>

      {/* === RESULT CARD === */}
      <div className="result-card">
        <h3>📈 Percentage Result</h3>
        <p>{result ? result : 'Fill marks and press Calculate'}</p>
      </div>

      {/* === GRADE CARD === */}
      <div className="grading-box">
        <h3>🎓 Grading Scale</h3>
        <ul>
          <li><strong>A+</strong>: 90% and above</li>
          <li><strong>A</strong>: 80% - 89%</li>
          <li><strong>B+</strong>: 70% - 79%</li>
          <li><strong>B</strong>: 60% - 69%</li>
          <li><strong>C</strong>: 50% - 59%</li>
          <li><strong>F</strong>: Below 50%</li>
        </ul>
      </div>

    </div>
  );
};

export default PercentageChecker;
