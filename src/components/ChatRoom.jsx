import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "https://saqib9022ii.pythonanywhere.com"; 
// ✅ backend base URL (NO /auth)

let socket;

export default function ChatRoom({ userEmail }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // 🔌 Connect to socket once
  useEffect(() => {
    socket = io(SOCKET_URL, {
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("✅ Connected to socket:", socket.id);
    });

    // ✅ Listen for messages
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // 📩 Send message
  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("send_message", {
      sender: userEmail,
      message,
    });

    setMessage("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Chat Room</h2>

      <div style={{ border: "1px solid #ccc", height: "300px", overflowY: "auto" }}>
        {messages.map((m, i) => (
          <div key={i}>
            <strong>{m.sender}:</strong> {m.message}
          </div>
        ))}
      </div>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
