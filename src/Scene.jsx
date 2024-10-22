import React, { useEffect, useRef, useContext } from 'react';
import Galaxy from './three-js/Galaxy';
import GalaxyContext from './components/GalaxyContext';
import { useIsHome } from './components/PathChecker';  // 引入路徑檢查工具
import { CSSTransition } from 'react-transition-group';

function Scene() {
    const { galaxy, setGalaxy, setItemReady, setCurrentItem } = useContext(GalaxyContext);
    const galaxyRef = useRef(null);  // 用於儲存 DOM 元素的引用
    const isHome = useIsHome();  // 判斷是否在首頁

    // 初始化 Galaxy，並在組件卸載時進行清理
    useEffect(() => {
        if (!galaxyRef.current) return;

        const newGalaxy = new Galaxy(galaxyRef.current.id, setItemReady, setCurrentItem);
        setGalaxy(newGalaxy);
        console.log('Scene: Galaxy instance created.');

        return () => {
            // 清理資源：停止渲染
            newGalaxy.pauseRendering();
            console.log('Scene: Galaxy instance cleaned up.');
        };
    }, [setGalaxy, setItemReady, setCurrentItem]);

    useEffect(() => {
        if (galaxy) {
            if (isHome) {
                galaxy.resumeRendering();
                galaxyRef.current.classList.remove('opacity-0');

            } else {
                galaxy.pauseRendering();
            }
        }
    }, [isHome, galaxy]);


    return (
        <>
            <CSSTransition
                in={isHome}
                timeout={300}
                classNames="fade"
            >
                <div id="scene" className="scene opacity-0" ref={galaxyRef}></div>
            </CSSTransition>
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