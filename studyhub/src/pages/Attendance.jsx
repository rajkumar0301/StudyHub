import React, { useEffect, useState, useRef } from "react";
import "../styles/attendance.css";
import { supabase } from "../supabaseClient";
import { useUser } from "@supabase/auth-helpers-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [status, setStatus] = useState("Present");
  const [note, setNote] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [filterSubject, setFilterSubject] = useState("All");
  const tableRef = useRef();
  const user = useUser();

  useEffect(() => {
    fetchAttendance();
    loadSubjects();
  }, [user]);

  const loadSubjects = async () => {
    const localSubjects = JSON.parse(localStorage.getItem("subject_list")) || [];
    setSubjects(localSubjects);

    if (user) {
      const { data, error } = await supabase
        .from("subjects")
        .select("name")
        .eq("user_id", user.id);
      if (data) {
        const supabaseSubjects = data.map((d) => d.name);
        const all = Array.from(new Set([...localSubjects, ...supabaseSubjects]));
        setSubjects(all);
        localStorage.setItem("subject_list", JSON.stringify(all));
      }
    }
  };

  const saveNewSubject = async (newSubject) => {
    if (!newSubject) return;
    const updatedSubjects = Array.from(new Set([...subjects, newSubject]));
    setSubjects(updatedSubjects);
    localStorage.setItem("subject_list", JSON.stringify(updatedSubjects));
    if (user) {
      await supabase.from("subjects").insert([{ user_id: user.id, name: newSubject }]);
    }
  };

  const fetchAttendance = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("attendance")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false });
    if (data) setAttendanceData(data);
  };

  const handleMarkAttendance = async () => {
  if (!selectedSubject) return alert("Please select or enter a subject.");
  if (!user || !user.id) return alert("User not found. Please login again.");

  const newEntry = {
    user_id: user.id,
    subject: selectedSubject,
    status,
    note,
    date: new Date().toISOString(),
  };

  const { error } = await supabase.from("attendance").insert([newEntry]);

  if (error) {
    console.error("Insert error:", error);
    alert("Error saving attendance");
    return;
  }

  await fetchAttendance();
  saveNewSubject(selectedSubject);
  setNote("");
  setFilterSubject("All");
};


  const exportToPDF = () => {
  const doc = new jsPDF();
  doc.text("Attendance Report", 10, 10);
  doc.autoTable({
    head: [["Date", "Subject", "Status", "Note"]],
    body: attendanceData.map(item => [
      new Date(item.date).toLocaleDateString(),
      item.subject,
      item.status,
      item.note || "-"
    ]),
  });
  doc.save("attendance.pdf");
};


  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(attendanceData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "attendance.xlsx");
  };

  return (
    <div className="attendance-container">
      <h2 className="text-center text-xl font-bold mb-4">Attendance Tracker</h2>

      <select
        value={selectedSubject}
        onChange={(e) => setSelectedSubject(e.target.value)}
        className="input"
      >
        <option value="">-- Select Subject --</option>
        {subjects.map((subj, idx) => (
          <option key={idx} value={subj}>
            {subj}
          </option>
        ))}
        <option value="__add_new__">+ Add New Subject</option>
      </select>

      {selectedSubject === "__add_new__" && (
        <input
          type="text"
          placeholder="Enter new subject"
          onBlur={(e) => {
            const newSubj = e.target.value.trim();
            if (newSubj) {
              setSelectedSubject(newSubj);
              saveNewSubject(newSubj);
            }
          }}
          className="input mt-2"
        />
      )}

      <select value={status} onChange={(e) => setStatus(e.target.value)} className="input mt-2">
        <option value="Present">Present</option>
        <option value="Absent">Absent</option>
      </select>

      <input
        type="text"
        placeholder="Optional Note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="input mt-2"
      />

      <button onClick={handleMarkAttendance} className="btn mt-3">
        🎯 Mark Attendance
      </button>

      <div className="filter-container mt-5">
        <label>📁 Filter by Subject: </label>
        <select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)}>
          <option>All</option>
          {subjects.map((subj, i) => (
            <option key={i}>{subj}</option>
          ))}
        </select>
      </div>

      <table ref={tableRef} className="table mt-4" id="attendance-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Subject</th>
            <th>Status</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          {attendanceData.length === 0 ? (
            <tr>
              <td colSpan="4">No attendance records found.</td>
            </tr>
          ) : (
            attendanceData
              .filter((item) => filterSubject === "All" || item.subject === filterSubject)
              .map((item, i) => (
                <tr key={i}>
                  <td>{new Date(item.date).toLocaleDateString()}</td>
                  <td>{item.subject}</td>
                  <td>{item.status}</td>
                  <td>{item.note}</td>
                </tr>
              ))
          )}
        </tbody>
      </table>

      <div className="export-btns mt-4 flex gap-4 justify-center">
        <button onClick={exportToPDF} className="btn btn-sm">
          🖨️ Print / Export to PDF
        </button>
        <button onClick={exportToExcel} className="btn btn-sm">
          📤 Export to Excel
        </button>
      </div>
    </div>
  );
};

export default Attendance;





// import React, { useEffect, useState } from "react";
// import "../styles/attendance.css";

// const LOCAL_KEY = "attendance_records";

// const Attendance = () => {
//   const [subject, setSubject] = useState("React");
//   const [date, setDate] = useState("");
//   const [note, setNote] = useState("");
//   const [records, setRecords] = useState([]);
//   const [subjects, setSubjects] = useState(["React"]);

//   // Load from localStorage on first load
//   useEffect(() => {
//     const saved = JSON.parse(localStorage.getItem(LOCAL_KEY));
//     console.log("Loaded from localStorage:", saved);
//     if (saved) setRecords(saved);
//   }, []);

//   // Save to localStorage whenever records change
//   useEffect(() => {
//     localStorage.setItem(LOCAL_KEY, JSON.stringify(records));
//   }, [records]);

//   const handleAttendance = (status) => {
//     if (!date) return alert("Please select date");
//     const newEntry = { subject, date, status, note };
//     setRecords((prev) => [...prev, newEntry]);
//     setNote("");
//   };

//   const addSubject = () => {
//     const newSubject = prompt("Enter new subject name:");
//     if (newSubject && !subjects.includes(newSubject)) {
//       setSubjects([...subjects, newSubject]);
//     }
//   };

//   const getStats = (subjectFilter) => {
//     const data = subjectFilter
//       ? records.filter((r) => r.subject === subjectFilter)
//       : records;
//     const total = data.length;
//     const present = data.filter((r) => r.status === "Present").length;
//     const absent = data.filter((r) => r.status === "Absent").length;
//     const percent = total ? ((present / total) * 100).toFixed(2) : 0;
//     return { total, present, absent, percent };
//   };

//   const printPage = () => window.print();

//   return (
//     <div className="attendance-container">
//       <div className="stats-box">
//         <h2>📅 Attendance Tracker</h2>
//       </div>

//       <div className="card">
//         <div className="form">
//           <select value={subject} onChange={(e) => setSubject(e.target.value)}>
//             {subjects.map((sub, idx) => (
//               <option key={idx} value={sub}>
//                 {sub}
//               </option>
//             ))}
//           </select>
//           <button onClick={addSubject}>➕ Add Subject</button>
//           <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
//           <input
//             type="text"
//             placeholder="Note (optional)"
//             value={note}
//             onChange={(e) => setNote(e.target.value)}
//           />
//           <button className="present-btn" onClick={() => handleAttendance("Present")}>
//             ✅ Mark Present
//           </button>
//           <button className="absent-btn" onClick={() => handleAttendance("Absent")}>
//             ❌ Mark Absent
//           </button>
//           <button onClick={printPage}>🖨️ Print / Export</button>
//         </div>

//         <div className="attendance-table">
//           <table>
//             <thead>
//               <tr>
//                 <th>Date</th>
//                 <th>Subject</th>
//                 <th>Status</th>
//                 <th>Note</th>
//               </tr>
//             </thead>
//             <tbody>
//               {records
//                 .filter((r) => r.subject === subject)
//                 .map((rec, idx) => (
//                   <tr key={idx}>
//                     <td>{rec.date}</td>
//                     <td>{rec.subject}</td>
//                     <td className={rec.status === "Present" ? "present" : "absent"}>
//                       {rec.status === "Present" ? "✅ Present" : "❌ Absent"}
//                     </td>
//                     <td>{rec.note}</td>
//                   </tr>
//                 ))}
//             </tbody>
//           </table>
//         </div>

//         <div className="attendance-stats">
//           <div>
//             <h4>{subject} Attendance</h4>
//             <p>Total Days: {getStats(subject).total}</p>
//             <p>Present: {getStats(subject).present}</p>
//             <p>Absent: {getStats(subject).absent}</p>
//             <p>Attendance %: {getStats(subject).percent}</p>
//           </div>
//           <div>
//             <h4>Overall Attendance</h4>
//             <p>Total Days: {getStats().total}</p>
//             <p>Present: {getStats().present}</p>
//             <p>Absent: {getStats().absent}</p>
//             <p>Attendance %: {getStats().percent}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Attendance;











// import React, { useEffect, useState } from 'react';
// import '../styles/attendance.css';
// import { supabase } from '../supabaseClient';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';

// const Attendance = () => {
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [newSubject, setNewSubject] = useState('');
//   const [selectedSubject, setSelectedSubject] = useState('');
//   const [note, setNote] = useState('');
//   const [status, setStatus] = useState('Present');

//   // Fetch subjects
//   useEffect(() => {
//     const fetchSubjects = async () => {
//       const { data, error } = await supabase.from('subjects').select('*');
//       if (!error) setSubjects(data);
//     };
//     fetchSubjects();
//   }, []);

//   // Fetch attendance records
//   useEffect(() => {
//     const fetchAttendance = async () => {
//       const { data, error } = await supabase.from('attendance').select('*');
//       if (!error) setAttendanceData(data);
//     };
//     fetchAttendance();
//   }, []);

//   const handleAddSubject = async () => {
//     if (!newSubject) return;
//     const { data, error } = await supabase.from('subjects').insert([{ name: newSubject }]);
//     if (!error) {
//       setSubjects([...subjects, { name: newSubject }]);
//       setNewSubject('');
//     }
//   };

//   const handleMarkAttendance = async () => {
//     const newEntry = {
//       date: new Date().toISOString().split('T')[0],
//       subject: selectedSubject,
//       note,
//       status
//     };
//     const { error } = await supabase.from('attendance').insert([newEntry]);
//     if (!error) {
//       setAttendanceData([...attendanceData, newEntry]);
//       setNote('');
//     }
//   };

//   const handleExportPDF = () => {
//     const doc = new jsPDF();
//     doc.text('Attendance Report', 20, 10);
//     doc.autoTable({
//       head: [['Date', 'Subject', 'Status', 'Note']],
//       body: attendanceData.map(row => [row.date, row.subject, row.status, row.note])
//     });
//     doc.save('attendance.pdf');
//   };

//   return (
//     <div className="attendance-container">
//       <div className="stats-box">
//         <h2>📅 Attendance Tracker</h2>
//       </div>

//       <div className="subject-add">
//         <input
//           type="text"
//           value={newSubject}
//           placeholder="Enter new subject"
//           onChange={(e) => setNewSubject(e.target.value)}
//         />
//         <button onClick={handleAddSubject}>➕ Add Subject</button>
//       </div>

//       <div className="form">
//         <select onChange={(e) => setSelectedSubject(e.target.value)} value={selectedSubject}>
//           <option value="">Select Subject</option>
//           {subjects.map((sub, idx) => (
//             <option key={idx} value={sub.name}>{sub.name}</option>
//           ))}
//         </select>

//         <select onChange={(e) => setStatus(e.target.value)} value={status}>
//           <option value="Present">Present</option>
//           <option value="Absent">Absent</option>
//         </select>

//         <input
//           type="text"
//           placeholder="Note"
//           value={note}
//           onChange={(e) => setNote(e.target.value)}
//         />

//         <button onClick={handleMarkAttendance}>✅ Mark</button>
//         <button onClick={handleExportPDF}>🖨️ Export to PDF</button>
//       </div>

//       <div className="attendance-table">
//         <h3>📊 Attendance Records</h3>
//         <table>
//           <thead>
//             <tr>
//               <th>Date</th>
//               <th>Subject</th>
//               <th>Status</th>
//               <th>Note</th>
//             </tr>
//           </thead>
//           <tbody>
//             {attendanceData.map((row, idx) => (
//               <tr key={idx}>
//                 <td>{row.date}</td>
//                 <td>{row.subject}</td>
//                 <td>{row.status}</td>
//                 <td>{row.note}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Attendance;






// import React, { useState } from "react";
// import "../styles/attendance.css";

// const Attendance = () => {
//   const [subject, setSubject] = useState("React");
//   const [date, setDate] = useState("");
//   const [note, setNote] = useState("");
//   const [records, setRecords] = useState([]);

//   const markAttendance = (status) => {
//     if (!date) return alert("Please select a date.");
//     const newRecord = { date, status, note, subject };
//     setRecords([...records, newRecord]);
//     setNote("");
//   };

//   const getStats = (filterSubject) => {
//     const filtered = records.filter((rec) => !filterSubject || rec.subject === subject);
//     const total = filtered.length;
//     const present = filtered.filter((r) => r.status === "Present").length;
//     const absent = filtered.filter((r) => r.status === "Absent").length;
//     const percentage = total ? ((present / total) * 100).toFixed(2) : 0;
//     return { total, present, absent, percentage };
//   };

//   const subjectStats = getStats(true);
//   const overallStats = getStats(false);

//   return (
//     <div className="attendance-container">
//       <h2>Attendance Tracker</h2>

//       <div className="input-row">
//         <div>
//           <label>Subject</label>
//           <select value={subject} onChange={(e) => setSubject(e.target.value)}>
//             <option>React</option>
//             <option>NodeJS</option>
//             <option>DBMS</option>
//           </select>
//         </div>

//         <div>
//           <label>Date</label>
//           <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
//         </div>

//         <div className="btns">
//           <button className="present" onClick={() => markAttendance("Present")}>
//             ✅ Mark Present
//           </button>
//           <button className="absent" onClick={() => markAttendance("Absent")}>
//             ❌ Mark Absent
//           </button>
//         </div>
//       </div>

//       <div className="note-input">
//         <input
//           type="text"
//           placeholder="Note (optional)"
//           value={note}
//           onChange={(e) => setNote(e.target.value)}
//         />
//       </div>

//       <table>
//         <thead>
//           <tr>
//             <th>Date</th>
//             <th>Status</th>
//             <th>Note</th>
//           </tr>
//         </thead>
//         <tbody>
//           {records.map((r, idx) => (
//             <tr key={idx}>
//               <td>{r.date}</td>
//               <td className={r.status === "Present" ? "text-green" : "text-red"}>
//                 {r.status === "Present" ? "✅ Present" : "❌ Absent"}
//               </td>
//               <td>{r.note}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <div className="stats">
//         <div>
//           <h4>{subject} Attendance</h4>
//           <p>Total Days: {subjectStats.total}</p>
//           <p>Present: {subjectStats.present}</p>
//           <p>Absent: {subjectStats.absent}</p>
//           <p>Attendance %: {subjectStats.percentage}</p>
//         </div>

//         <div>
//           <h4>Overall Attendance</h4>
//           <p>Total Days: {overallStats.total}</p>
//           <p>Present: {overallStats.present}</p>
//           <p>Absent: {overallStats.absent}</p>
//           <p>Attendance %: {overallStats.percentage}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Attendance;




// import React, { useState } from "react";
// import "../styles/attendance.css";

// const Attendance = () => {
//   const [subjects, setSubjects] = useState([
//     { name: "", total: "", attended: "" },
//   ]);

//   const addSubject = () => {
//     setSubjects([...subjects, { name: "", total: "", attended: "" }]);
//   };

//   const handleChange = (index, field, value) => {
//     const newSubjects = [...subjects];
//     newSubjects[index][field] = value;
//     setSubjects(newSubjects);
//   };

//   const calculatePercentage = (attended, total) => {
//     if (!attended || !total || isNaN(attended) || isNaN(total) || total === 0)
//       return 0;
//     return ((attended / total) * 100).toFixed(2);
//   };

//   const overallAttendance = () => {
//     const totalClasses = subjects.reduce(
//       (acc, sub) => acc + Number(sub.total || 0),
//       0
//     );
//     const attendedClasses = subjects.reduce(
//       (acc, sub) => acc + Number(sub.attended || 0),
//       0
//     );
//     if (totalClasses === 0) return 0;
//     return ((attendedClasses / totalClasses) * 100).toFixed(2);
//   };

//   return (
//     <div className="tracker-container">
//       <h2 className="tracker-title">📅 Subject-wise Attendance Tracker</h2>

//       {subjects.map((subject, index) => (
//         <div key={index} className="subject-box">
//           <input
//             type="text"
//             placeholder="Subject"
//             className="input"
//             value={subject.name}
//             onChange={(e) => handleChange(index, "name", e.target.value)}
//           />
//           <input
//             type="number"
//             placeholder="Total Classes"
//             className="input"
//             value={subject.total}
//             onChange={(e) => handleChange(index, "total", e.target.value)}
//           />
//           <input
//             type="number"
//             placeholder="Attended"
//             className="input"
//             value={subject.attended}
//             onChange={(e) => handleChange(index, "attended", e.target.value)}
//           />
//           <div className="percentage">
//             {calculatePercentage(subject.attended, subject.total)}%
//           </div>
//         </div>
//       ))}

//       <button onClick={addSubject} className="add-btn">
//         ➕ Add Subject
//       </button>

//       <div className="overall-box">
//         📊 Overall Attendance:{" "}
//         <span className="overall-percent">{overallAttendance()}%</span>
//       </div>
//     </div>
//   );
// };

// export default Attendance;




// import React, { useState } from "react";
// import "../styles/attendance.css";

// const Attendance = () => {
//   const [subjects, setSubjects] = useState([
//     { name: "", attended: 18, total: 20 },
//     { name: "", attended: 16, total: 18 },
//   ]);
//   const [newSubject, setNewSubject] = useState("");

//   const handleAttendance = (index, type) => {
//     const updated = [...subjects];
//     updated[index].total += 1;
//     if (type === "present") updated[index].attended += 1;
//     setSubjects(updated);
//   };

//   const deleteSubject = (index) => {
//     const updated = [...subjects];
//     updated.splice(index, 1);
//     setSubjects(updated);
//   };

//   const addSubject = () => {
//     if (newSubject.trim()) {
//       setSubjects([...subjects, { name: newSubject, attended: 0, total: 0 }]);
//       setNewSubject("");
//     }
//   };

//   const totalAttended = subjects.reduce((sum, s) => sum + s.attended, 0);
//   const totalClasses = subjects.reduce((sum, s) => sum + s.total, 0);
//   const overallPercent = totalClasses ? ((totalAttended / totalClasses) * 100).toFixed(1) : 0;

//   return (
//     <div className="attendance-wrapper">
//       <h1>📊 Attendance Tracker</h1>
//       <div className="overall-box">
//         <h2>Overall Attendance</h2>
//         <p className="percent">{overallPercent}%</p>
//         <div className="progress-bar">
//           <div className="progress" style={{ width: `${overallPercent}%` }}></div>
//         </div>
//         <p>{totalAttended} / {totalClasses} classes attended</p>
//       </div>

//       <div className="add-subject">
//         <input
//           type="text"
//           placeholder="New subject"
//           value={newSubject}
//           onChange={(e) => setNewSubject(e.target.value)}
//         />
//         <button onClick={addSubject}>➕ Add</button>
//       </div>

//       <div className="subject-list">
//         {subjects.map((subj, idx) => {
//           const percent = subj.total ? ((subj.attended / subj.total) * 100).toFixed(1) : 0;
//           return (
//             <div className="subject-card" key={idx}>
//               <div className="subject-header">
//                 <h3>{subj.name}</h3>
//                 <button className="delete-btn" onClick={() => deleteSubject(idx)}>🗑️</button>
//               </div>
//               <p>{subj.attended} / {subj.total} classes</p>
//               <div className="progress-bar">
//                 <div className="progress" style={{ width: `${percent}%` }}></div>
//               </div>
//               <p className="percent">{percent}%</p>
//               <div className="btn-group">
//                 <button onClick={() => handleAttendance(idx, "present")}>✅ Present</button>
//                 <button onClick={() => handleAttendance(idx, "absent")}>❌ Absent</button>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default Attendance;


