import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./ChatRoom.css";

const BASE_URL = "https://saqib9022ii.pythonanywhere.com";

export default function ChatRoom() {
  const [userEmail, setUserEmail] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const lastIdRef = useRef(0);
  const bottomRef = useRef(null);

  // ✅ GET EMAIL DIRECTLY FROM URL (CRITICAL FIX)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const email = params.get("email");

    if (email) {
      setUserEmail(email);
      localStorage.setItem("user_email", email);
    } else {
      // fallback for refresh
      const saved = localStorage.getItem("user_email");
      if (saved) setUserEmail(saved);
    }
  }, []);

  // ✅ INITIAL FETCH
  useEffect(() => {
    if (!userEmail) return;

    const fetchInitial = async () => {
      const res = await axios.get(`${BASE_URL}/chat/messages?after=0`);
      setMessages(res.data);
      if (res.data.length > 0) {
        lastIdRef.current = res.data[res.data.length - 1].id;
      }
    };

    fetchInitial();
  }, [userEmail]);

  // ✅ POLLING
  useEffect(() => {
    if (!userEmail) return;

    const interval = setInterval(async () => {
      const res = await axios.get(
        `${BASE_URL}/chat/messages?after=${lastIdRef.current}`
      );

      if (res.data.length > 0) {
        setMessages(prev => [...prev, ...res.data]);
        lastIdRef.current = res.data[res.data.length - 1].id;
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [userEmail]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim() || !userEmail) return;

    await axios.post(
      `${BASE_URL}/chat/send`,
      { sender: userEmail, message },
      { withCredentials: true }
    );

    setMessage("");
  };

  if (!userEmail) return <p>Loading chat...</p>;

  return (
    <div className="chat-container">
      <h2>Chat Room</h2>

      <div className="chat-box">
        {messages.map(m => (
          <div
            key={m.id}
            className={`chat-message ${m.sender === userEmail ? "mine" : "theirs"}`}
          >
            <strong>{m.sender}</strong>
            <p>{m.message}</p>
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>

      <div className="chat-input">
        <input
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
