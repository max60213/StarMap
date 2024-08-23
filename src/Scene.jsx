import React, { useEffect } from 'react';
import './css/daylight.css';

function Scene() {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = '../src/three-js/galaxy.js';  // 確保路徑正確，通常應該基於public目錄
        script.type = 'module';
        document.body.appendChild(script);

        return () => {
            // 在組件卸載時移除腳本
            document.body.removeChild(script);
        };
    }, []);  // 包含onLoaded以保證回調始終是最新的

    return (
        <>
            <div id="scene" className="scene mx-mask-fade">
                {/* 場景內容 */}
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