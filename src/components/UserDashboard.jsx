// UserDashboard.jsx
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "../style/UserDashboard.css";

const BACKEND_URL = "https://saqib9022ii.pythonanywhere.com"; // your backend

export default function UserDashboard({ userEmail, userName: initialName, onLogout }) {
  const [userPhoto, setUserPhoto] = useState("");
  const [userName, setUserName] = useState(initialName);
  const fileInputRef = useRef();

  // Load avatar from localStorage
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user")) || {};
    setUserPhoto(savedUser.avatar_url || "");
  }, []);

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);
    formData.append("email", userEmail);

    try {
      const res = await axios.post(`${BACKEND_URL}/auth/upload-avatar`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials:true,
      });

      setUserPhoto(res.data.avatar_url);

      // Save avatar to localStorage
      const savedUser = JSON.parse(localStorage.getItem("user")) || {};
      localStorage.setItem(
        "user",
        JSON.stringify({ ...savedUser, avatar_url: res.data.avatar_url })
      );
    } catch (err) {
      alert("Failed to upload avatar!");
    }
  };

  // Compute initials fallback
  const initials = userName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="avatar" onClick={handleFileClick}>
          {userPhoto ? <img src={userPhoto} alt="profile" /> : <span>{initials}</span>}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <h2>{userName}</h2>
      </div>

      <p className="dashboard-subtitle">Welcome to your dashboard</p>

      <button className="logout-btn" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
}
