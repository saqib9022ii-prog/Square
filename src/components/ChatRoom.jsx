import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "../style/ChatRoom.css";

const BASE_URL = "https://saqib9022ii.pythonanywhere.com";

export default function ChatRoom() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const lastIdRef = useRef(0); // track last fetched message id
  const bottomRef = useRef(null);

  // ---------------- Load current user from localStorage ----------------
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser?.email) {
      setCurrentUser(savedUser.email);
    }
  }, []);

  // ---------------- Fetch initial messages once ----------------
  useEffect(() => {
    if (!currentUser) return; // wait until user is loaded

    const fetchInitial = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/chat/messages?after=0`, {
          withCredentials: true
        });
        if (res.data.length > 0) {
          setMessages(res.data);
          lastIdRef.current = res.data[res.data.length - 1].id;
        }
      } catch (err) {
        console.error("Initial fetch error", err);
      }
    };
    fetchInitial();
  }, [currentUser]);

  // ---------------- Poll new messages every 2 seconds ----------------
  useEffect(() => {
    if (!currentUser) return;

    const interval = setInterval(async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/chat/messages?after=${lastIdRef.current}`,
          { withCredentials: true }
        );
        if (res.data.length > 0) {
          setMessages(prev => [...prev, ...res.data]);
          lastIdRef.current = res.data[res.data.length - 1].id;
        }
      } catch (err) {
        console.error("Polling error", err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [currentUser]);

  // ---------------- Auto-scroll ----------------
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ---------------- Send message ----------------
  const sendMessage = async () => {
    if (!message.trim() || !currentUser) return;

    const payload = {
      sender: currentUser,
      message
    };

    setMessage(""); // optimistic UI

    try {
      await axios.post(`${BASE_URL}/chat/send`, payload, {
        withCredentials: true
      });
    } catch (err) {
      console.error("Send message error", err);
      alert("Failed to send message. Try again.");
    }
  };

  if (!currentUser) {
    return <p>Loading chat...</p>;
  }

  return (
    <div className="chat-container">
      <h2>Chat Room</h2>

      <div className="chat-box">
        {messages.map(m => (
          <div
            key={m.id}
            className={`chat-message ${
              m.sender === currentUser ? "mine" : "theirs"
            }`}
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
          onKeyDown={e => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
