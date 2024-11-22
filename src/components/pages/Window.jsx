import GalaxyContext from '../GalaxyContext';
import { CSSTransition } from 'react-transition-group';
import { useContext, useEffect, useRef } from 'react';
import "./css/window.css";
import View from './View';
import Slider from './Slider';
import { useIsHome } from "../PathChecker";


function Window(props) {
    const { galaxy, itemReady, currentItem } = useContext(GalaxyContext);
    const isHome = useIsHome();
    const iconVideo = useRef(null);
    const baseUrl = import.meta.env.BASE_URL;


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
                <CSSTransition
                    in={!isHome}
                    timeout={300}
                    classNames="fade"
                    unmountOnExit
                >
                    <View />
                </CSSTransition>

            </div>
            <CSSTransition
                    in={!isHome}
                    timeout={300}
                    classNames="fade"
                    unmountOnExit
                >
                    <Slider />
                </CSSTransition>
        </div>
    );
}

export default Window;