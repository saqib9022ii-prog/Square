import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "../style/ChatRoom.css";

const BASE_URL = "https://saqib9022ii.pythonanywhere.com";

export default function ChatRoom() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [sending, setSending] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const lastIdRef = useRef(0);
  const bottomRef = useRef(null);

  // ---------------- Load current user ----------------
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser?.email) setCurrentUser(savedUser.email.split("@")[0]);
  }, []);

  // ---------------- Request Notification Permission ----------------
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // ---------------- Show Notification ----------------
  const showNotification = (msg) => {
    if (Notification.permission === "granted") {
      new Notification(`New message from ${msg.sender}`, {
        body: msg.message,
        icon: "/icon.png" // optional (place in public folder)
      });
    }
  };

  // ---------------- Fetch initial messages ----------------
useEffect(() => {
  if (!currentUser) return;

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

useEffect(() => {
  if (unreadCount > 0) {
    document.title = `(${unreadCount}) Chat Room`;
  } else {
    document.title = "Chat Room";
  }
}, [unreadCount]);

useEffect(() => {
  const handleFocus = () => {
    setUnreadCount(0);
  };
const handleVisibility = () => {
  if(!document.hidden){
    setUnreadCount(0);
  }
}
  window.addEventListener("focus", handleFocus);
  document.addEventListener("visibilitychange", handleVisibility);


  return () =>{
     window.removeEventListener("focus", handleFocus);
    document.removeEventListener("visibilitychange", handleVisibility);
  }
}, []);

  // ---------------- Poll new messages ----------------
   useEffect(() => {
  if (!currentUser) return;

  const interval = setInterval(async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/chat/messages?after=${lastIdRef.current}`,
        { withCredentials: true }
      );

      if (res.data.length > 0) {
        // 🔔 Filter only messages from others
        const newMessages = res.data.filter(
          msg => msg.sender !== currentUser
        );

        // 🔴 Increase unread count if tab is not active
        if (document.hidden && newMessages.length > 0) {
          setUnreadCount(prev => prev + newMessages.length);
        }

        // 🔔 Optional popup notifications
        newMessages.forEach(msg => showNotification(msg));

        setMessages(prev => {
  const existingIds = new Set(prev.map(m => m.id));
  const filtered = res.data.filter(m => !existingIds.has(m.id));
  return [...prev, ...filtered];
    }); 
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
    if (!message.trim() || !currentUser || sending) return;

    setSending(true);

    try {
      await axios.post(
        `${BASE_URL}/chat/send`,
        { sender: currentUser, message },
        { withCredentials: true }
      );

      setMessage("");
    } catch (err) {
      console.error("Send message error", err);
      alert("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp) => {
  const date = new Date(timestamp + "Z");
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12:true,
  });
};

  if (!currentUser) return <p>Loading chat...</p>;

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
            <span className="timestamp">
              {formatTime(m.created_at)}
            </span>
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>

      {/* ✅ Form handles both Enter + Button (no duplicates) */}
      <form
        className="chat-input"
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
      >
        <input
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit" disabled={sending}>
          Send
        </button>
      </form>
    </div>
  );
}