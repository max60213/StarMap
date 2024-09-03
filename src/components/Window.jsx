
import GalaxyContext from './GalaxyContext';
import { useContext, useEffect } from 'react';
import "../css/window.css";

function Window(props) {
    const { galaxy, itemReady } = useContext(GalaxyContext);
    var currentItem = "";
    const video = document.querySelector("video");
    const baseUrl = import.meta.env.BASE_URL;

    useEffect(() => {
        if (!galaxy) return;
        currentItem = galaxy.getCurrentItem();
        video.poster = baseUrl + "/img/" + currentItem + ".png?url";
        video.src = baseUrl + "/video/" + currentItem + ".mp4?url";
        console.log("currentItem: ", currentItem);
    }, [itemReady]);

    return (
        <div className="window">
            <div className={`window-view ${props.className}`}>
                <video loop autoPlay muted>
                    <source src="" type="video/mp4"></source>
                </video>
            </div>
        </div>
    )
}

export default Window;