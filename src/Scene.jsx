import React, { useEffect } from 'react';
import './css/daylight.css';

function Scene() {
    useEffect(() => {
        import('./js/selector').then(({ default: init }) => {
            init();
        });
    }, []);
    return (
        <>
            <div id="scene" className="scene mx-mask-fade">
            </div>
            <div className="daylight">
                <div className="grad background-1"></div>
                <div className="grad background-2"></div>
                <div className="grad background-3"></div>
                <div className="grad background-4"></div>
                <div className="grad background-5"></div>
                <div className="grad background-6"></div>
                <div className="grad background-7"></div>
                <div className="grad background-8"></div>
                <div className="grad background-9"></div>
            </div>
        </>
    );
}

export default Scene;