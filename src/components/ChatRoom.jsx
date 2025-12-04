import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./ChatRoom.css";

const BASE_URL = "https://saqib9022ii.pythonanywhere.com";

export default function ChatRoom({ userEmail }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const lastIdRef = useRef(0);
  const bottomRef = useRef(null);

  // ✅ Fetch messages once user is READY
  useEffect(() => {
    if (!userEmail) return;

    const fetchInitial = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/chat/messages?after=0`);
        setMessages(res.data);
        if (res.data.length > 0) {
          lastIdRef.current = res.data[res.data.length - 1].id;
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchInitial();
  }, [userEmail]);

  // ✅ Poll messages
  useEffect(() => {
    if (!userEmail) return;

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
        console.error(err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [userEmail]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Send message (SAFE)
  const sendMessage = async () => {
    if (!message.trim()) return;

    if (!userEmail) {
      alert("User not ready yet, please wait...");
      return;
    }

    const payload = { sender: userEmail, message };
    setMessage("");

    try {
      await axios.post(`${BASE_URL}/chat/send`, payload, {
        withCredentials: true
      });
    } catch (err) {
      console.error("Send failed", err);
    }
  };

  // ✅ Prevent clicking too early
  if (!userEmail) {
    return <p>Loading chat...</p>;
  }

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
        <div ref={bottomRef} />
      </div>

      <div className="chat-input">
        <input
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Type message..."
        />
        <button onClick={sendMessage} disabled={!userEmail}>
          Send
        </button>
      </div>
    </div>
  );
}
