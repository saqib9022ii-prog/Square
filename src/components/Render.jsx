import React from "react";
import { useNavigate } from "react-router-dom";
import "./Render.css";

function Render(){
    const navigate = useNavigate();

    return(
        <div className="testcontainer">
            <img src="/mint.png" alt="Mint" className="mint-icon"/>
            <div className="glass-card">
                <h2>Login to get started</h2>
                <button
                    className="get-started-btn"
                    onClick={() => navigate('/personal')}
                >
                    Login
                </button>
            </div>
        </div>
    )
}
export default Render;