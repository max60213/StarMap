
import GalaxyContext from './GalaxyContext';
import { useContext, useEffect } from 'react';
import "../css/window.css";

function Window(props) {
    const { galaxy, itemReady, currentItem } = useContext(GalaxyContext);
    const video = document.querySelector("video");
    const baseUrl = import.meta.env.BASE_URL;

    useEffect(() => {
        if (!galaxy) return;
        video.poster = baseUrl + "/img/" + currentItem + ".png?url";
        video.src = baseUrl + "/video/" + currentItem + ".mp4?url";
        console.log("currentItem: ", currentItem);
    }, [currentItem]);

    useEffect(() => {
        if (itemReady) {
            video.play();
        }
    }, [itemReady])

    return (
        <div className="window">
            <div className={`window-view ${props.className}`}>
                <video loop muted>
                    <source src="" type="video/mp4"></source>
                </video>
            </div>
        </div>
    )
}

export default Window;