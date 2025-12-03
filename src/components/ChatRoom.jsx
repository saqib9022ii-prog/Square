import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./ChatRoom.css";

// ✅ BACKEND URL (Socket.IO server)
const socket = io("https://saqib9022ii.pythonanywhere.com", {
  transports: ["websocket"],
  withCredentials: true,
});

export default function ChatRoom({ userEmail }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // ✅ SOCKET CONNECTION + LISTENER
  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("receive_message", (data) => {
      console.log("📥 Received:", data);
      setMessages((prev) => [...prev, data]);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    return () => {
      socket.off("receive_message");
      socket.disconnect();
    };
  }, []);

  // ✅ SEND MESSAGE
  const sendMessage = () => {
    if (!message.trim()) return;

    console.log("📤 Sending:", message);

    socket.emit("send_message", {
      sender: userEmail,
      message: message,
    });

    setMessage("");
  };

  return (
    <div className="chat-container">
      <h2>Chat Room</h2>

      <div className="messages-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${
              msg.sender === userEmail ? "own" : "other"
            }`}
          >
            <strong>{msg.sender}</strong>
            <p>{msg.message}</p>
          </div>
        ))}
      </div>

      <div className="input-area">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
