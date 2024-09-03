
import GalaxyContext from './GalaxyContext';
import { useContext, useEffect } from 'react';
import "../css/window.css";

function Window(props) {
    const { galaxy } = useContext(GalaxyContext);
    var currentItem = "";
    const video = document.querySelector("video");
    const baseUrl = import.meta.env.BASE_URL;

    useEffect(() => {
        if (!galaxy) return;
        currentItem = galaxy.getCurrentItem();
        video.poster = baseUrl + "/img/" + currentItem + ".png?url";
        video.src = baseUrl + "/video/" + currentItem + ".mp4?url";
        console.log("currentItem: ", currentItem);
    }, [galaxy]);

    return (
        <div className="window">
            <div className={`window-view ${props.className}`}>
                {currentItem != undefined ? (
                    <video controls loop autoPlay muted>
                        <source src="" type="video/mp4"></source>
                    </video>) : (
                    <h1>No item</h1>
                )
                }
            </div>
        </div>
    )
}

export default Window;