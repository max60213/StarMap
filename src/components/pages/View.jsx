import GalaxyContext from '../GalaxyContext.jsx';
import { useContext, useEffect, useRef } from 'react';
import { itemsData } from '../../js/items-data.js';

function View() {
    // Extract variables from context
    const { currentItem } = useContext(GalaxyContext);
    const viewVideo = useRef(null);

    // 根據 currentItem 從 itemsData 中取得相對應的資料
    const currentItemData = itemsData.items[currentItem]; // 從 itemsData 中提取當前項目的資料
    const states = currentItemData ? currentItemData.states : []; // 安全地取得 states，若無則返回空陣列
    const initState = currentItemData ? currentItemData.initState : 0; // 默認值為 0
    console.log(initState);

    // Update the video source when currentItem changes
    useEffect(() => {
        if (viewVideo.current && currentItem) {
            viewVideo.current.src = `/articles/${currentItem}/${currentItem}.mp4`;
            console.log("View updated");
        }

    }, []); // Added dependencies

    return (
        <div className="view player">
            <div className='view_data'>
                <div className="view_data-top">
                    <div id="lens">
                        <p>Lens</p>
                        <h3>28MM</h3>
                    </div>
                    <div className='view_data-right ms-auto' id="WB">
                        <p>WB</p>
                        <h3>6500K</h3>
                    </div>
                </div>
                <div className="view_data-bottom">
                    <div id="shutter">
                        <p>Shutter</p>
                        <h3>1/60</h3>
                    </div>
                    <div id="aperture">
                        <p>Aperture</p>
                        <h3>3.5</h3>
                    </div>
                    <div id="iso">
                        <p>ISO</p>
                        <h3>12800</h3>
                    </div>
                    <div className='view_data-right ms-auto' id="EV">
                        <p>EV</p>
                        <h3>±0</h3>
                    </div>
                </div>
            </div>
            <video ref={viewVideo} autoPlay preload="auto" muted loop id="view-player" src={`/articles/${currentItem}/${currentItem}.mp4`}></video>
        </div>
    );
}

export default View;