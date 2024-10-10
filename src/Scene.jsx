import React, { useEffect, useRef, useContext } from 'react';
import Galaxy from './three-js/Galaxy';
import GalaxyContext from './components/GalaxyContext';

function Scene() {
    const { setGalaxy, setItemReady, setCurrentItem } = useContext(GalaxyContext);
    const galaxyRef = useRef(null);

    useEffect(() => {
        if (!galaxyRef.current) {
            return;
        }

        // 只在組件首次渲染時創建實例
        const newGalaxy = new Galaxy(galaxyRef.current.id, setItemReady, setCurrentItem);
        setGalaxy(newGalaxy);  // 使用 context 提供的 setGalaxy 來更新狀態
        console.log("Scene: Galaxy Instance is set.");

        return () => {
            // 清理資源
            newGalaxy.cleanup && newGalaxy.cleanup();
        };
    }, [setGalaxy, setItemReady, galaxyRef]); // 確保依賴項正確

    return (
        <>
            <div id="scene" className="scene mx-mask-fade" ref={galaxyRef}>
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