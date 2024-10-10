import GalaxyContext from './GalaxyContext';
import { useContext, useEffect, useRef, useState } from 'react';
import "../css/window.css";
import "../css/article.css";
import View from './View';
import { useIsHome,  } from "./PathChecker";


function Window(props) {
    const { galaxy, itemReady, currentItem } = useContext(GalaxyContext);
    const isHome = useIsHome();  
    const iconVideo = useRef(null);
    const baseUrl = import.meta.env.BASE_URL;

    // 新增 state 來控制 View 的顯示狀態
    const [showView, setShowView] = useState(false);

    // 延遲顯示 View 的效果，這裡使用了 2 秒的延遲
    useEffect(() => {
        if (!isHome) {
            const timer = setTimeout(() => {
                setShowView(true);
            }, 500); // 延遲 2 秒

            // 在 component unmount 時清除 timer
            return () => clearTimeout(timer);
        } else {
            // 如果是在首頁，則不顯示 View
            setShowView(false);
        }
    }, [isHome]);

    useEffect(() => {
        if (!galaxy || !currentItem || !iconVideo.current) return;
        iconVideo.current.poster = `${baseUrl}/img/icons/${currentItem}.png`;
        iconVideo.current.src = `${baseUrl}/video/icons/${currentItem}.mp4`;
        console.log("currentItem: ", currentItem);
    }, [currentItem]);

    useEffect(() => {
        if (itemReady && iconVideo.current) {
            iconVideo.current.play();
        }
    }, [itemReady]);

    return (
        <div className="window">
            <div className={`window-frame ${props.className}`}>
                <div className="player">
                    <video ref={iconVideo} id='icon-player' loop muted></video>
                </div>
                
                {/* 使用 showView 來控制 View 的顯示 */}
                {!isHome && showView && <View></View>}
            </div>
        </div>
    );
}

export default Window;