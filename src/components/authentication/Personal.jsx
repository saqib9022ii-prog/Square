import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../style/Personal.css";
import UserDashboard from "../UserDashboard";

const BASE_URL = "https://saqib9022ii.pythonanywhere.com/auth";

export default function Personal() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // ---------------- Load persisted login state ----------------
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryEmail = params.get("email");
    const queryName = params.get("name");

    if (queryEmail && queryName) {
      // Login via Google redirect
      setIsLoggedIn(true);
      setUserName(queryName);
      setUserEmail(queryEmail);
      localStorage.setItem(
        "user",
        JSON.stringify({ email: queryEmail, name: queryName })
      );
      window.history.replaceState({}, document.title, "/personal");
      return;
    }

    // Check localStorage for persisted user
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser?.email) {
      setIsLoggedIn(true);
      setUserName(savedUser.name || savedUser.email.split("@")[0]);
      setUserEmail(savedUser.email);
    }
  }, []);

  // ---------------- SIGNUP ----------------
  const handleSignup = async () => {
    if (!name || !email || !password) return alert("Please fill all fields!");
    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/signup`,
        { name, email, password },
        { withCredentials: true }
      );
      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Signup failed!");
    }
    setLoading(false);
  };

  // ---------------- LOGIN ----------------
  const handleLogin = async () => {
    if (!email || !password) return alert("Please fill all fields!");
    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/login`,
        { email, password },
        { withCredentials: true }
      );
      alert(res.data.message);

      const nameFromRes = res.data.name || email.split("@")[0];
      setIsLoggedIn(true);
      setUserName(nameFromRes);
      setUserEmail(email);
      localStorage.setItem(
        "user",
        JSON.stringify({ email, name: nameFromRes })
      );
      setEmail("");
      setPassword("");

      // Force page reload once to initialize chat immediately
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Login failed!");
    }
    setLoading(false);
  };

  // ---------------- GOOGLE LOGIN ----------------
  const handleGoogleLogin = () => {
    setLoading(true);
    window.location.href = `${BASE_URL}/login/google`;
  };

  // ---------------- LOGOUT ----------------
  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.error(err);
    }
    setIsLoggedIn(false);
    setUserName("");
    setUserEmail("");
    localStorage.removeItem("user");
  };

  // ---------------- RENDER ----------------
  if (isLoggedIn) {
    return (
      <UserDashboard
        userName={userName}
        userEmail={userEmail}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="personal-page">
      <div className="personal-container">
        <h2>Sign Up / Login</h2>

        {loading ? (
          <div className="loader-overlay">
            <div className="loader"></div>
          </div>
        ) : (
          <>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="button-group">
              <button onClick={handleSignup}>Sign Up</button>
              <button onClick={handleLogin}>Login</button>
              <button className="google-btn" onClick={handleGoogleLogin}>
                <img
                  src="/google.png"
                  alt="google"
                  className="google-icon"
                />{" "}
                Login with Google
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
