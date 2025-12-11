import React, { useState } from "react";
import axios from "axios";

const BASE_URL = "https://saqib9022ii.pythonanywhere.com"; // your backend URL

export default function DriveUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setMessage("");

    try {
      const res = await axios.post(`${BASE_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true, // if using cookies/session
      });

      setMessage(`✅ File uploaded successfully. File ID: ${res.data.file_id}`);
      setFile(null);
    } catch (err) {
      console.error(err);
      setMessage(`❌ Upload failed: ${err.response?.data?.error || err.message}`);
    }

    setUploading(false);
  };

  return (
    <div className="drive-upload">
      <h2>Upload File to Google Drive</h2>

      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}
