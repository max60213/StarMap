import React, { useEffect } from 'react';

function Scene() {
    useEffect(() => {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = "../src/js/selector.js";
        script.async = true;

        document.body.appendChild(script);

        // 清理函數
        return () => {
            document.body.removeChild(script);
        };
    }, []);
    return (
        <>
            <div id="scene" className="scene mx-mask-fade"></div>
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