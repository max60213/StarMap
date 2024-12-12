import { CSSTransition } from 'react-transition-group';
import { useContext, useEffect, useRef, useState } from 'react';
import GalaxyContext from '../GalaxyContext';
import "./css/window.css";
import View from './View';
import Slider from './Slider';
import { useIsHome } from "../PathChecker";

function Window(props) {
    const { galaxy, itemReady, currentItem } = useContext(GalaxyContext);
    const isHome = useIsHome();
    const iconVideo = useRef(null);

    // 狀態管理
    const [currentStep, setCurrentStep] = useState(0);
    const [articleData, setArticleData] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // 抓取 JSON 資料
    useEffect(() => {
        async function fetchData() {
            if (!currentItem) return;
            try {
                const response = await fetch(`/articles/${currentItem}/${currentItem}.json`);
                const data = await response.json();
                setArticleData(data); // 將資料存入狀態
            } catch (error) {
                console.error("讀取 JSON 資料時發生錯誤:", error);
            }
        }
        fetchData();
    }, [currentItem]);

    // 設置標資源
    useEffect(() => {
        if (!galaxy || !currentItem || !iconVideo.current) return;
        iconVideo.current.poster = `/img/icons/${currentItem}.png`;
        iconVideo.current.src = `/video/icons/${currentItem}.mp4`;
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
                <CSSTransition
                    in={!isHome}
                    timeout={300}
                    classNames="fade"
                    unmountOnExit
                >
                    <View 
                        currentStep={currentStep} 
                        articleData={articleData}
                        currentImageIndex={currentImageIndex}
                    />
                </CSSTransition>
            </div>
            <CSSTransition
                in={!isHome}
                timeout={300}
                classNames="fade"
                unmountOnExit
            >
                <Slider
                    currentStep={currentStep}
                    setCurrentStep={setCurrentStep}
                    articleData={articleData}
                    currentImageIndex={currentImageIndex}
                    setCurrentImageIndex={setCurrentImageIndex}
                />
            </CSSTransition>
        </div>
    );
}

export default Window;