import React, { useState, useEffect } from "react";
import "../styles/documents.css";
import { supabase } from "../supabaseClient";

const categories = ["Assignments", "Study Notes", "Certificates", "Others"];

const Documents = () => {
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("Assignments");
  const [docCounts, setDocCounts] = useState({});
  const [documents, setDocuments] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Fetch user ID
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) setUserId(data.user.id);
    };
    fetchUser();
  }, []);

  // ✅ Fetch category counts
  const fetchCounts = async () => {
    const counts = {};
    for (let cat of categories) {
      const { count } = await supabase
        .from("documents")
        .select("*", { count: "exact", head: true })
        .eq("category", cat)
        .eq("user_id", userId);
      counts[cat] = count || 0;
    }
    setDocCounts(counts);
  };

  // ✅ Fetch document list
  const fetchDocuments = async () => {
    if (!userId) return;
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    setDocuments(data || []);
  };

  useEffect(() => {
    if (userId) {
      fetchCounts();
      fetchDocuments();
    }
  }, [userId]);

  // ✅ Handle upload
  const handleUpload = async () => {
  if (!userId || !file) return;

  setIsLoading(true);

  const fileName = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from("documents")
    .upload(fileName, file);

  if (data) {
    // ✅ Insert size in bytes and username (optional)
    await supabase.from("documents").insert([
      {
        name: file.name,
        category,
        user_id: userId,
        path: data.path,
        size: file.size, // ✅ Save file size
        uploaded_by: userId, // optional, save uploader info
      },
    ]);
    setFile(null);
    await fetchCounts();
    await fetchDocuments();
  }

  setIsLoading(false);
};


  // ✅ Delete a file with confirmation
  const handleDelete = async (doc) => {
    const confirmDelete = window.confirm(`Delete ${doc.name}?`);
    if (!confirmDelete) return;

    await supabase.storage.from("documents").remove([doc.path]);
    await supabase.from("documents").delete().eq("id", doc.id);

    await fetchCounts();
    await fetchDocuments();
  };

  return (
    <div className="documents-container">
      <div className="doc-manager-box">
        <h2>📂 Documents Manager</h2>
      </div>

      <div className="upload-box">
        <h3>📁 Drag & Drop files here or Browse</h3>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="file-input"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
        <button onClick={handleUpload} disabled={!file || isLoading}>
          {isLoading ? "Uploading..." : "Upload"}
        </button>
      </div>

      <div className="category-stats">
        {categories.map((cat) => (
          <div key={cat} className="stat-card">
            <h4>{cat}</h4>
            <p>{docCounts[cat] || 0} files</p>
          </div>
        ))}    
      </div>

    <div className="file-list">
      
         <h3>📑 Your Uploaded Documents</h3>
         {documents.length === 0 ? (
          <p>No documents uploaded yet.</p>
          ) : (
       <ul>
         {documents.map((doc) => (
           <li key={doc.id} className="doc-item">
          <div className="doc-left">
            <img src="/icons/microscope.svg" alt="icon" className="doc-icon" />
            <div>
              <div className="doc-name">📄 {doc.name}</div>
              <div className="doc-meta">
                <span>📁 {doc.category}</span> | 
                <span>📅 {new Date(doc.created_at).toLocaleDateString()}</span> | 
                <span>👤 {doc.user_name || "User"}</span> | 
                <span>📦 {doc.size ? (doc.size / 1024).toFixed(1) + " KB" : "N/A"}</span>


              </div>
            </div>
          </div>

          <div className="doc-actions">
            <a
              href={`https://tbkymthlztiwvpukfxps.supabase.co/storage/v1/object/public/documents/${doc.path}`}
              target="_blank"
              rel="noopener noreferrer"
              title="View"
            >
              👁
            </a>
            <a
              href={`https://tbkymthlztiwvpukfxps.supabase.co/storage/v1/object/public/documents/${doc.path}`}
              download
              title="Download">
              ⬇️
            </a>
            <button onClick={() => handleDelete(doc)} title="Delete">
              🗑
            </button>
          </div>
        </li>
      ))}
    </ul>
  )}
</div>
</div>
  );
};

export default Documents;
