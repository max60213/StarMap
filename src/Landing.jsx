import React, { useState, useEffect } from 'react';
import MainContent from "./components/MainContent";
import Navigate from './components/Navigate';
import { useLocation } from 'react-router-dom';
import './css/main.css';

function Landing() {
    const location = useLocation();
    const [showNavigate, setShowNavigate] = useState(location.pathname === '/');

    useEffect(() => {
        // When location changes, update the state to true or false
        if (location.pathname === '/') {
            setShowNavigate(true);
        } else {
            // Delay the hiding to allow for fade-out effect
            const timer = setTimeout(() => {
                setShowNavigate(false);
            }, 300); // 300ms is the duration of the fade-out effect
            return () => clearTimeout(timer);
        }
    }, [location.pathname]);
    return (
        <div className="mx-container">
            <div className="mx-first">
                <Navigate className={showNavigate ? "fadeIn" : "fadeOut"} />
            </div>

            <div className="mx-last">
                <MainContent />
            </div>
        </div>
    );
}

export default Landing;