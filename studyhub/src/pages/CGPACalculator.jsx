import React, { useState, useEffect } from "react";
import "../styles/cgpa.css";
import { supabase } from "../supabaseClient";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const gradePoints = {
  indian: {
    "A+": 10,
    A: 9,
    "B+": 8,
    B: 7,
    "C+": 6,
    C: 5,
    D: 4,
    F: 0,
  },
  international: {
    A: 4,
    "A-": 3.7,
    B: 3,
    "B-": 2.7,
    C: 2,
    D: 1,
    F: 0,
  },
};

const CGPACalculator = () => {
  const [gradingSystem, setGradingSystem] = useState("indian");
  const [semesters, setSemesters] = useState([{ subjects: [{ name: "", grade: "SelectGrade", credit: 0 }] }]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (!error && user) setUser(user);
    };
    getUser();
  }, []);

  const addSubject = (semesterIndex) => {
    const updated = [...semesters];
    updated[semesterIndex].subjects.push({ name: "", grade: "SelectGrade", credit: 0 });
    setSemesters(updated);
  };

  const deleteSubject = (semesterIndex, subjectIndex) => {
    const updated = [...semesters];
    updated[semesterIndex].subjects.splice(subjectIndex, 1);
    setSemesters(updated);
  };

  const addSemester = () => {
    setSemesters([...semesters, { subjects: [{ name: "", grade: "SelectGrade", credit: 0 }] }]);
  };

  const handleChange = (semesterIndex, subjectIndex, field, value) => {
    const updated = [...semesters];
    updated[semesterIndex].subjects[subjectIndex][field] = value;
    setSemesters(updated);
  };

  const calculateStats = () => {
    let totalCredits = 0;
    let totalPoints = 0;
    let semesterGPAs = [];

    semesters.forEach((sem) => {
      let semCredits = 0;
      let semPoints = 0;

      sem.subjects.forEach((subj) => {
        const point = gradePoints[gradingSystem][subj.grade] || 0;
        const credit = parseFloat(subj.credit);
        semPoints += point * credit;
        semCredits += credit;
        totalPoints += point * credit;
        totalCredits += credit;
      });

      semesterGPAs.push(semCredits ? semPoints / semCredits : 0);
    });

    const CGPA = totalCredits ? totalPoints / totalCredits : 0;
    const percentage = gradingSystem === "indian" ? CGPA * 9.5 : (CGPA / 4) * 100;

    return { CGPA, percentage, GPA: semesterGPAs[semesterGPAs.length - 1] || 0, totalCredits };
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("CGPA Report", 14, 20);
    semesters.forEach((sem, i) => {
      autoTable(doc, {
        startY: doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 30,
        head: [[`Semester ${i + 1}`, "Grade", "Credit"]],
        body: sem.subjects.map((s) => [s.name, s.grade, s.credit]),
      });
    });
    doc.save("cgpa_report.pdf");
  };

  const exportToExcel = () => {
    const rows = semesters.flatMap((sem, index) =>
      sem.subjects.map((subj) => ({ Semester: index + 1, ...subj }))
    );
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "CGPA");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "cgpa_report.xlsx");
  };

  const { GPA, CGPA, percentage, totalCredits } = calculateStats();

  return (
    <div className="cgpa-container">
        <div className="cgpa-calculator">
        <h2>CGPA Calculator</h2>
        <p>Calculator Your Cumulative Grade Point Average </p>
      </div>
      <select
        value={gradingSystem}
        onChange={(e) => setGradingSystem(e.target.value)}
        className="system-selector"
      >
        <option value="indian">Indian (10-point)</option>
        <option value="international">International (4-point)</option>
      </select>

      <div className="stats-grid">
        <div className="stat-card">GPA <span>{GPA.toFixed(2)}</span></div>
        <div className="stat-card">CGPA <span>{CGPA.toFixed(2)}</span></div>
        <div className="stat-card">Percentage <span>{percentage.toFixed(1)}%</span></div>
        <div className="stat-card">Total Credits <span>{totalCredits}</span></div>
      </div>

      {semesters.map((semester, semIndex) => (
        <div key={semIndex} className="semester-card">
          <h3>Semester {semIndex + 1}</h3>
          {semester.subjects.map((subject, subIndex) => (
            <div key={subIndex} className="subject-row">
              <input
                type="text"
                placeholder="Subject Name"
                value={subject.name}
                onChange={(e) => handleChange(semIndex, subIndex, "name", e.target.value)}/>
              <select
                value={subject.grade}
                onChange={(e) => handleChange(semIndex, subIndex, "grade", e.target.value)}>
                  <option value="">Select Grade</option>
                {Object.keys(gradePoints[gradingSystem]).map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              <select
                value={subject.credit}
                onChange={(e) => handleChange(semIndex, subIndex, "credit", e.target.value)}
              >
                  <option value="">Select Credit</option>
                {[0,1, 2, 3, 4, 5].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <button onClick={() => deleteSubject(semIndex, subIndex)} className="delete-btn">
                🗑
              </button>
            </div>
          ))}
          <button onClick={() => addSubject(semIndex)} className="add-btn">
            + Add Subject
          </button>
        </div>
      ))}

      <button onClick={addSemester} className="add-btn">
        + Add Semester
      </button>

      <div className="export-buttons">
        <button onClick={exportToPDF}>Export PDF</button>
        <button onClick={exportToExcel}>Export Excel</button>
      </div>
    </div>
  );
};

export default CGPACalculator;
