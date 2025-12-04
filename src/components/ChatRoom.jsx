import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./ChatRoom.css";

const BASE_URL = "https://saqib9022ii.pythonanywhere.com";

export default function ChatRoom() {
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const lastIdRef = useRef(0);
  const bottomRef = useRef(null);

  // ✅ GET LOGGED-IN USER FROM BACKEND SESSION
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/auth/me`, {
          withCredentials: true,
        });
        setUserEmail(res.data.email);
      } catch {
        setUserEmail(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // ✅ FETCH MESSAGES ONLY AFTER USER EXISTS
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
    if (!message.trim()) return;

    await axios.post(
      `${BASE_URL}/chat/send`,
      { message },
      { withCredentials: true }
    );
    setMessage("");
  };

  if (loading) return <p>Loading chat...</p>;
  if (!userEmail) return <p>Please login first</p>;

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
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
