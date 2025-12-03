import React, { useState } from "react";
import axios from "axios";
import "./ChatRoom.css";

const BASE_URL = "https://saqib9022ii.pythonanywhere.com";

export default function ChatRoom({ userEmail }) {
  const [started, setStarted] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  const searchUsers = async () => {
    if (!search) return;

    try {
      const res = await axios.get(`${BASE_URL}/auth/search-users`, {
        params: { email: search }
      });
      setResults(res.data.users);
    } catch (err) {
      console.error(err);
      alert("Search failed");
    }
  };

  return (
    <div className="chatroom-container">
      <h2>ChatRoom</h2>

      {!started ? (
        <button className="get-started-btn" onClick={() => setStarted(true)}>
          Get Started
        </button>
      ) : (
        <>
          <input
            className="search-input"
            type="email"
            placeholder="Search by email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button onClick={searchUsers}>Search</button>

          <div className="search-results">
            {results.map((user) => (
              <div key={user.email} className="user-card">
                <p>{user.email}</p>
                <button>Start Chat</button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
