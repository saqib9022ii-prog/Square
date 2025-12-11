import React from "react";
import { NavLink } from "react-router-dom";
import "../../style/NavBar.css";

function Navbar() {
  return (
    <nav className="navbar">
      {/* Left navigation: Home + Lock + App */}
      <ul className="nav-left">
        <li className="nav-item">
          <NavLink to="/" end className="nav-link">
            <img src="/home.png" alt="Home" className="home-icon" />
          </NavLink>
        </li>
        <li className="nav-item personal">
          <NavLink to="/personal" className="nav-link">
            <img src="/lock.png" alt="Lock" className="lock-icon" />
          </NavLink>
        </li>
        <li className="nav-item apps">
          <NavLink to="/apps" className="nav-link">
            <img src="/apps.png" alt="App" className="app-icon" />
          </NavLink>
        </li>
        <li className="nav-item chat">
          <NavLink to="/chat" className="nav-link">
            <img src="/chat.png" alt="Chat" className="chat-icon"/>
          </NavLink>
        </li>
        <li>
          <NavLink to="/drive-upload" className="nav-link">
          <img src="/drive.png" alt="Drive" className="drive-icon"/>
          </NavLink>
        </li>
      </ul>

      {/* Right navigation */}
      <ul className="nav-links">
      </ul>
    </nav>
  );
}

export default Navbar;
