import React from "react";
import HomeDashBoard from "./HomeDashBoard";
import "../style/Home.css";

function Home() {
  return (
    <>
      <div className="home-wrapper">
        <div className="home-grid">
          <div className="home-card">Hello world</div>
          <div className="home-card">Hello world 2</div>
          <div className="home-card">Experimental Features</div>
          <div className="home-card"></div>
        </div>
      </div>
    </>
  );
}

export default Home;
