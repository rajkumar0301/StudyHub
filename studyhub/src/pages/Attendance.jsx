
// Attendance.jsx
import React, { useEffect, useState, useRef } from "react";
import "../styles/attendance.css";
import { supabase } from "../supabaseClient";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) {
        alert("User not found. Please login again.");
        return;
      }
      setUser(user);
    };
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchAttendance();
      loadSubjects();
    }
  }, [user]);

  const loadSubjects = async () => {
    const localSubjects = JSON.parse(localStorage.getItem("subject_list")) || [];
    setSubjects(localSubjects);
    if (user) {
      const { data } = await supabase
        .from("subjects")
        .select("*")
        .eq("user_id", user.id);

      if (data) {
        const supabaseSubjects = data.map((d) => d.name);
        const all = Array.from(new Set([...localSubjects, ...supabaseSubjects]));
        setSubjects(all);
        localStorage.setItem("subject_list", JSON.stringify(all));
      }
    }
  };

  const saveNewSubject = async () => {
    if (!selectedSubject) return;
    const updatedSubjects = Array.from(new Set([...subjects, selectedSubject]));
    setSubjects(updatedSubjects);
    localStorage.setItem("subject_list", JSON.stringify(updatedSubjects));
    if (user) {
      await supabase.from("subjects").insert([{ user_id: user.id, name: selectedSubject }]);
    }
    setSelectedSubject("");
  };

  const fetchAttendance = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("attendance")
      .select("*")
      .eq("user_id", user.id);
    if (data) setAttendanceData(data);
  };

  const handleMarkAttendance = async (subject, markStatus) => {
    if (!user) return;
    const today = selectedDate;
    const newEntry = {
      user_id: user.id,
      subject,
      status: markStatus,
      date: today,
    };
    await supabase
      .from("attendance")
      .upsert([newEntry], { onConflict: ["user_id", "subject", "date"] });
    fetchAttendance();
  };

  const exportToPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Attendance Report", 14, 20);

  autoTable(doc, {
    startY: 30,
    head: [["Date", "Subject", "Status"]],
    body: attendanceData.map((item) => [
      new Date(item.date).toLocaleDateString(),
      item.subject,
      item.status,
    ]),
  });

  doc.save("attendance_report.pdf");
};


  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(attendanceData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "attendance.xlsx");
  };

  const calculateStats = () => {
    const summary = {};
    let total = 0;
    let present = 0;

    attendanceData.forEach(({ subject, status }) => {
      if (!summary[subject]) summary[subject] = { total: 0, present: 0 };
      summary[subject].total++;
      if (status === "Present") summary[subject].present++;
      if (status === "Present") present++;
      total++;
    });

    return { summary, total, present };
  };

  const deleteSubject = async (indexToDelete) => {
  const subjectToDelete = subjects[indexToDelete];
  const confirmDelete = window.confirm(`Delete subject "${subjectToDelete}" and all related attendance records?`);
  if (!confirmDelete) return;

  const updatedSubjects = subjects.filter((_, index) => index !== indexToDelete);
  setSubjects(updatedSubjects);
  localStorage.setItem("subject_list", JSON.stringify(updatedSubjects));

  if (user) {
    // Delete from Supabase 'subjects' table
    await supabase
      .from("subjects")
      .delete()
      .eq("user_id", user.id)
      .eq("name", subjectToDelete);

    // Delete all related attendance records
    await supabase
      .from("attendance")
      .delete()
      .eq("user_id", user.id)
      .eq("subject", subjectToDelete);

    fetchAttendance();
  }
};
  const { summary, total, present } = calculateStats();
  const overallPercent = total ? ((present / total) * 100).toFixed(1) : "0.0";

  return (
    <div className="attendance-container">
         
        <div className="Attendance-card">
        <h2>Attendance Tracker</h2>
        <p>Monitor your class attendance and maintain academic records</p>
      </div>

      <div className="overall-card">
        <h3>Overall Attendance</h3>
        <p className="percentage">{overallPercent}%</p>
        <p>{present} of {total} classes</p>
      </div>

      <div className="add-subject">
        <input
          type="text"
          placeholder="subject"
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
        />
        <button onClick={saveNewSubject}>+ Add Subject</button>
      </div>


      <div className="mark-attendance">
           <h3>Mark Attendance</h3>
      <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}/>
      {subjects.map((subject, index) => (
      <div key={subject} className="subject-row">
      <span className="subject-name">{subject}</span>
      <div className="button-group">
        <button onClick={() => handleMarkAttendance(subject, "Present")}>Present</button>
        <button onClick={() => handleMarkAttendance(subject, "Absent")}>Absent</button>
        <button className="delete-btn" onClick={() => deleteSubject(index)}>🗑️</button>
      </div>
    </div>
  ))}
</div>


      {/* <div className="mark-attendance">
        <h3>Mark Attendance</h3>
        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
        {subjects.map((subject) => (
          <div key={subject} className="subject-row">
            <span>{subject}</span>
            <button onClick={() => handleMarkAttendance(subject, "Present")}>Present</button>
            <button onClick={() => handleMarkAttendance(subject, "Absent")}>Absent</button>
            <button className="delete-btn" onClick={() => deleteSubject(index)}>🗑️</button>
          </div>
        ))}
      </div> */}

      <div className="subject-wise">
        <h3>Subject-wise Attendance</h3>
        {Object.keys(summary).map((subj) => {
          const data = summary[subj];
          const percent = ((data.present / data.total) * 100).toFixed(1);
          return (
            <div key={subj} className="subject-stat">
              <span>{subj}</span>
              <div className="bar">
                <div className="fill" style={{ width: `${percent}%` }}></div>
              </div>
              <span className="stat">{percent}%</span>
            </div>
          );
        })}
      </div>

      <div className="export-btns">
        <button onClick={exportToPDF}>Export PDF</button>
        <button onClick={exportToExcel}>Export Excel</button>
      </div>
    </div>
  );
};

export default Attendance;






// import React, { useEffect, useState, useRef } from "react";
// import "../styles/attendance.css";
// import { supabase } from "../supabaseClient";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";

// const Attendance = () => {
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [status, setStatus] = useState("Present");
//   const [note, setNote] = useState("");
//   const [selectedSubject, setSelectedSubject] = useState("");
//   const [subjects, setSubjects] = useState([]);
//   const [filterSubject, setFilterSubject] = useState("All");
//   const tableRef = useRef();
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const getCurrentUser = async () => {
//       const {
//         data: { user },
//         error,
//       } = await supabase.auth.getUser();

//       if (error || !user) {
//         alert("User not found. Please login again.");
//         return;
//       }

//       setUser(user);
//     };

//     getCurrentUser();
//   }, []);

//   useEffect(() => {
//     if (user) {
//       fetchAttendance();
//       loadSubjects();
//     }
//   }, [user]);

//   const loadSubjects = async () => {
//     const localSubjects = JSON.parse(localStorage.getItem("subject_list")) || [];
//     setSubjects(localSubjects);

//     if (user) {
//       const { data, error } = await supabase
//         .from("subjects")
//         .select("*")
//         .eq("user_id", user.id);

//       if (data) {
//         const supabaseSubjects = data.map((d) => d.name);
//         const all = Array.from(new Set([...localSubjects, ...supabaseSubjects]));
//         setSubjects(all);
//         localStorage.setItem("subject_list", JSON.stringify(all));
//       }
//     }
//   };

//   const saveNewSubject = async (newSubject) => {
//     if (!newSubject) return;
//     const updatedSubjects = Array.from(new Set([...subjects, newSubject]));
//     setSubjects(updatedSubjects);
//     localStorage.setItem("subject_list", JSON.stringify(updatedSubjects));
//     if (user) {
//       await supabase.from("subjects").insert([{ user_id: user.id, name: newSubject }]);
//     }
//   };

//   const fetchAttendance = async () => {
//     if (!user) return;
//     const { data, error } = await supabase
//       .from("attendance")
//       .select("*")
//       .eq("user_id", user.id)
//       .order("date", { ascending: false });
//     if (data) setAttendanceData(data);
//   };

//   const handleMarkAttendance = async () => {
//     if (!selectedSubject) {
//       alert("Please select or enter a subject.");
//       return;
//     }

//     if (!user || !user.id) {
//       alert("User not found. Please login again.");
//       return;
//     }

//     const today = new Date().toISOString().split("T")[0];
//     const newEntry = {
//       user_id: user.id,
//       subject: selectedSubject,
//       status,
//       note,
//       date: today,
//     };

//     const { data, error } = await supabase
//       .from("attendance")
//       .upsert([newEntry], {
//         onConflict: ["user_id", "subject", "date"],
//         ignoreDuplicates: false,
//       });

//     if (error) {
//       console.error("Upsert failed:", error);
//     } else {
//       console.log("Upsert successful:", data);
//     }

//     await fetchAttendance();
//     saveNewSubject(selectedSubject);
//     setNote("");
//     setFilterSubject("All");
//   };

//   const exportToPDF = () => {
//     const doc = new jsPDF();
//     doc.text("Attendance Report", 10, 10);
//     doc.autoTable({
//       head: [["Date", "Subject", "Status", "Note"]],
//       body: attendanceData.map((item) => [
//         new Date(item.date).toLocaleDateString(),
//         item.subject,
//         item.status,
//         item.note || "-",
//       ]),
//     });
//     doc.save("attendance.pdf");
//   };

//   const exportToExcel = () => {
//     const ws = XLSX.utils.json_to_sheet(attendanceData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Attendance");
//     const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
//     saveAs(new Blob([wbout], { type: "application/octet-stream" }), "attendance.xlsx");
//   };

//   const calculateStats = () => {
//     const summary = {};
//     let total = 0;
//     let totalPresent = 0;

//     attendanceData.forEach(({ subject, status }) => {
//       if (!summary[subject]) summary[subject] = { present: 0, total: 0 };
//       summary[subject].total++;
//       if (status === "Present") summary[subject].present++;
//       if (status === "Present") totalPresent++;
//       total++;
//     });

//     return { summary, total, totalPresent };
//   };

//   const { summary, total, totalPresent } = calculateStats();

//   return (
//     <div className="attendance-container">
//       <h2 className="text-center text-xl font-bold mb-4">Attendance Tracker</h2>

//       <select
//         value={selectedSubject}
//         onChange={(e) => setSelectedSubject(e.target.value)}
//         className="input"
//       >
//         <option value="">-- Select Subject --</option>
//         {subjects.map((subj, idx) => (
//           <option key={idx} value={subj}>
//             {subj}
//           </option>
//         ))}
//         <option value="__add_new__">+ Add New Subject</option>
//       </select>

//       {selectedSubject === "__add_new__" && (
//         <input
//           type="text"
//           placeholder="Enter new subject"
//           onBlur={(e) => {
//             const newSubj = e.target.value.trim();
//             if (newSubj) {
//               setSelectedSubject(newSubj);
//               saveNewSubject(newSubj);
//             }
//           }}
//           className="input mt-2"
//         />
//       )}

//       <select value={status} onChange={(e) => setStatus(e.target.value)} className="input mt-2">
//         <option value="Present">Present</option>
//         <option value="Absent">Absent</option>
//       </select>

//       <input
//         type="text"
//         placeholder="Optional Note"
//         value={note}
//         onChange={(e) => setNote(e.target.value)}
//         className="input mt-2"
//       />

//       <button onClick={handleMarkAttendance} className="btn mt-3">
//         🎯 Mark Attendance
//       </button>

//       <div className="filter-container mt-5">
//         <label>📁 Filter by Subject: </label>
//         <select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)}>
//           <option>All</option>
//           {subjects.map((subj, i) => (
//             <option key={i}>{subj}</option>
//           ))}
//         </select>
//       </div>

//       <table ref={tableRef} className="table mt-4" id="attendance-table">
//         <thead>
//           <tr>
//             <th>Date</th>
//             <th>Subject</th>
//             <th>Status</th>
//             <th>Note</th>
//           </tr>
//         </thead>
//         <tbody>
//           {attendanceData.length === 0 ? (
//             <tr>
//               <td colSpan="4">No attendance records found.</td>
//             </tr>
//           ) : (
//             attendanceData
//               .filter((item) => filterSubject === "All" || item.subject === filterSubject)
//               .map((item, i) => (
//                 <tr key={i}>
//                   <td>{new Date(item.date).toLocaleDateString()}</td>
//                   <td>{item.subject}</td>
//                   <td>{item.status}</td>
//                   <td>{item.note}</td>
//                 </tr>
//               ))
//           )}
//         </tbody>
//       </table>

//       <div className="export-btns mt-4 flex gap-4 justify-center">
//         <button onClick={exportToPDF} className="btn btn-sm">
//           🖨️ Print / Export to PDF
//         </button>
//         <button onClick={exportToExcel} className="btn btn-sm">
//           📤 Export to Excel
//         </button>
//       </div>

//       <div className="stats mt-6">
//         <h3 className="text-center font-semibold">📊 Attendance Summary</h3>
//         {Object.keys(summary).map((subj, i) => {
//           const s = summary[subj];
//           const percent = ((s.present / s.total) * 100).toFixed(1);
//           return (
//             <div key={i} className="text-center">
//               {subj}: {s.present}/{s.total} ({percent}%)
//             </div>
//           );
//         })}
//         {total > 0 && (
//           <div className="text-center font-bold mt-2">
//             ✅ Overall: {totalPresent}/{total} ({((totalPresent / total) * 100).toFixed(1)}%)
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Attendance;



