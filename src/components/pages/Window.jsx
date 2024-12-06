import { CSSTransition } from 'react-transition-group';
import { useContext, useEffect, useRef, useState } from 'react'; // 添加 useState
import GalaxyContext from '../GalaxyContext';
import "./css/window.css";
import View from './View';
import Slider from './Slider';
import { useIsHome } from "../PathChecker";

function Window(props) {
    const { galaxy, itemReady, currentItem } = useContext(GalaxyContext);
    const isHome = useIsHome();
    const iconVideo = useRef(null);
    // 新增：管理 currentStep 狀態
    const [currentStep, setCurrentStep] = useState(0);

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
                    <View currentStep={currentStep}/>
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
                />
            </CSSTransition>
        </div>
    );
}

export default Window;