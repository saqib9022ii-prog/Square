import React from "react";
import { useNavigate } from "react-router-dom";

function Render(){
    const navigate = useNavigate();

    return(
        <div className="testcontainer">
            <h2>Login to get started</h2>
            <button
                className="get-started-btn"
                onClick={() => navigate('/personal')}
            >
                Get Started
            </button>
        </div>
    )
}
export default Render;