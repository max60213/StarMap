import GalaxyContext from './GalaxyContext';
import { useContext, useEffect, useRef } from 'react';
import { itemsData } from '../js/items-data.js';

function View() {
    // Extract variables from context
    const { currentItem } = useContext(GalaxyContext);
    const viewVideo = useRef(null);
    const baseUrl = import.meta.env.BASE_URL;

    // 根據 currentItem 從 itemsData 中取得相對應的資料
    const currentItemData = itemsData.items[currentItem]; // 從 itemsData 中提取當前項目的資料
    const states = currentItemData ? currentItemData.states : []; // 安全地取得 states，若無則返回空陣列
    const initState = currentItemData ? currentItemData.initState : 0; // 默認值為 0
    console.log(initState);

    // Update the video source when currentItem changes
    useEffect(() => {
        if (viewVideo.current && currentItem) {
            viewVideo.current.src = `${baseUrl}/video/${currentItem}.mp4`;
            console.log("View updated");
        }

        // Dynamic import of the JS file (only if needed dynamically)
        import("../js/view.js").then(({ sliderInit }) => {
            sliderInit(); // Call the initialization function
        }).catch(err => console.error("Error loading view.js", err));

    }, [baseUrl]); // Added dependencies

    return (
        <div className="player">
            <video ref={viewVideo} autoPlay preload="auto" muted loop id="view-player" src={baseUrl + `/video/${currentItem}.mp4`}></video>
            <div id='slider' className="slider" data-init={initState} data-states={JSON.stringify(states)}>
                <div id='slider-bar' className="slider-bar"></div>
                <div id='slider-thumb' className="slider-thumb">
                    <div className="slider-thumb-btn"></div>
                    <div id="slider-thumb-highlight" className="slider-thumb-highlight"></div>
                    <h3 id='slider-thumb-state' className="slider-thumb-state"></h3>
                </div>
            </div>
        </div>
    );
}

export default View;