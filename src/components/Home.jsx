import React from "react";
import HomeDashBoard from "./HomeDashBoard";
import "../style/Home.css";

function Home() {
  return (
    <>
      <div className="home-wrapper">
        <div className="home-grid">
          <div className="home-card1"></div>
          <div className="home-card2"></div>
          <div className="home-card3"></div>
          <div className="home-card4"></div>
        </div>
      </div>
    </>
  );
}

export default Home;
