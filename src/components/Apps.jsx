import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Apps.css";

function Apps() {
  const [file, setFile] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);

  const BASE_URL = "https://saqib9022ii.pythonanywhere.com";

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/files`);
      setFileList(res.data);
    } catch (err) {
      console.error("Error fetching files:", err);
      alert("⚠️ Failed to fetch file list. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please choose a file first!");
    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ File uploaded successfully!");
      setFile(null);
      fetchFiles();
    } catch (err) {
      alert("❌ Upload failed. Check console.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (filename) => {
    const password = prompt("Enter password to download:");
    if (!password) return;

    try {
      const res = await axios.post(`${BASE_URL}/verify_password`, { password });
      if (res.data.success) {
        window.location.href = `${BASE_URL}/uploads/${filename}`;
      } else {
        alert("❌ Incorrect password!");
      }
    } catch (err) {
      alert("⚠️ Error verifying password. Check console.");
      console.error(err);
    }
  };

  // ✅ Use images for file icons
  const getFileIcon = (filename) => {
    const ext = filename.split(".").pop().toLowerCase();
    switch (ext) {
      case "apk": return "/apk.png";
      case "pdf": return "/pdf.png";
      case "zip": return "/zip.png";
      case "svg": return "/svg.png";
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
      case "webp": return "/img.png";
      default: return "/img.png"; // fallback
    }
  };

  return (
    <div className="file-manager">
      <img src="/mint.png" alt="mint" className="app-logo" /> 
      <h2 className="mint">STORAGE</h2>
      <p>Upload, view, and download your files securely.</p>

      <div className="upload-box">
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={handleUpload} disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>

      <div className="file-list">
        <h2>📁 Uploaded Files</h2>
        {loading ? (
          <div className="loader-overlay">
          <div className="loader"></div>
          </div>
        ) : fileList.length === 0 ? (
          <p>No files uploaded yet.</p>
        ) : (
          <div className="app-grid">
  {fileList.map((f, index) => {
    // Remove extension from file name
    let nameWithoutExt = f.replace(/\.[^/.]+$/, "");

    // Limit to max 6 characters
    if (nameWithoutExt.length > 6) {
      nameWithoutExt = nameWithoutExt.slice(0, 6) + "...";
    }

    return (
      <div className="app-card" key={index}>
    <div className="app-icon">
    <img src={getFileIcon(f)} alt={nameWithoutExt} />
  </div>
  <div className="app-name">{nameWithoutExt}</div>
     <button onClick={() => handleDownload(f)}>⬇️ Download</button>
</div>
    );
  })}
</div>


        )}
      </div>
    </div>
  );
}

export default Apps;
