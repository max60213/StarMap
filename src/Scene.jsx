import React, { useEffect, useRef, useContext } from 'react';
import './css/daylight.css';
import Galaxy from './three-js/Galaxy';
import GalaxyContext from './components/GalaxyContext';

function Scene() {
    const galaxyRef = useRef(null);
    const { setGalaxy } = useContext(GalaxyContext);

    useEffect(() => {
        if (galaxyRef.current) {
            const galaxyInstance = new Galaxy(galaxyRef.current.id);
            setGalaxy(galaxyInstance);
            {console.log("Scene useEffect")}
            return () => {
                //galaxyInstance.cleanup();  // 假設 Galaxy 有 cleanup 方法
            };
        }
    }, []);

    return (
        <>
            <div id="scene" className="scene mx-mask-fade" ref={galaxyRef}>
                {/* 場景內容 */}
                {console.log("Scene")}
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