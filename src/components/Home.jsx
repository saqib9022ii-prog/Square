import React from "react";
import HomeDashBoard from "./HomeDashBoard";
import "../style/Home.css";

function Home() {
  return (
    <>
      <div className="home-wrapper">
        <div className="home-grid">
          <div className="home-card">home card</div>
          <div className="home-card"></div>
          <div className="home-card"></div>
          <div className="home-card"></div>
        </div>
      </div>
    </>
  );
}

export default Home;
