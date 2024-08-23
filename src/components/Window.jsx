import "../css/window.css";
import { useState } from "react";

function Window(props){
    return (
        <div className="window">
            <div className={`window-view ${props.className}`}></div>
        </div>
    )
}

export default Window;