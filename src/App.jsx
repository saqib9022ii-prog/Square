import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navigation/NavBar";
import Home from "./components/Home";
import Personal from "./components/authentication/Personal";
import Apps from "./components/Apps";
import ChatRoom from "./components/ChatRoom";
import ProtectedRoute from "./components/authentication/ProtectedRoute";
import Render from "./components/Render";

function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/personal" element={<Personal />} />
        <Route path="/apps" element={<Apps />} />

        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatRoom userEmail={user?.email} />
            </ProtectedRoute>
          }
        />
          <Route path="/render" element={<Render/>}/>
      </Routes>
    </Router>
  );
}

export default App;
