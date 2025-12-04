import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./ChatRoom.css";

const BASE_URL = "https://saqib9022ii.pythonanywhere.com";

export default function ChatRoom({ userEmail }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const lastIdRef = useRef(0); // useRef instead of state
  const bottomRef = useRef(null);

  // ✅ Fetch initial messages once
  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/chat/messages?after=0`);
        if (res.data.length > 0) {
          setMessages(res.data);
          lastIdRef.current = res.data[res.data.length - 1].id;
        }
      } catch (err) {
        console.error("Initial fetch error", err);
      }
    };
    fetchInitial();
  }, []);

  // ✅ Poll messages every 2 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/chat/messages?after=${lastIdRef.current}`
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
  }, []); // no dependency, safe now

  // ✅ Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Send message
  const sendMessage = async () => {
    if (!message.trim()) return;

    const payload = {
      sender: userEmail,
      message
    };

    setMessage(""); // optimistic UI

    try {
      await axios.post(`${BASE_URL}/chat/send`, payload, { withCredentials: true });
      console.log("Message sent");
    } catch (error) {
      console.error("Send message error", error);
    }
  };

  return (
    <div className="chat-container">
      <h2>Chat Room</h2>
      <div className="chat-box">
        {messages.map(m => (
          <div key={m.id} className={`chat-message ${m.sender === userEmail ? "mine" : "theirs"}`}>
            <strong>{m.sender}</strong>
            <p>{m.message}</p>
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>
      <div className="chat-input">
        <input value={message} onChange={e => setMessage(e.target.value)} placeholder="Type a message..." />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
