import { useEffect, useContext } from "react";
import GalaxyContext from '../GalaxyContext.jsx';
import { itemsData } from '../../js/items-data.js';
import "./css/slider.css";

function Slider() {
    // Extract variables from context
    const { currentItem } = useContext(GalaxyContext);

    // 根據 currentItem 從 itemsData 中取得相對應的資料
    const currentItemData = itemsData.items[currentItem]; // 從 itemsData 中提取當前項目的資料
    const states = currentItemData ? currentItemData.states : []; // 安全地取得 states，若無則返回空陣列
    const initState = currentItemData ? currentItemData.initState : 0; // 默認值為 0
    console.log(initState);

    useEffect(() => {
        // Dynamic import of the JS file (only if needed dynamically)
        import("../../js/view.js").then(({ sliderInit }) => {
            sliderInit(); // Call the initialization function
        }).catch(err => console.error("Error loading view.js", err));
    });

    return (
        <div id='slider' className="slider" data-init={initState} data-states={JSON.stringify(states)}>
            <div id='slider-bar' className="slider-bar"></div>
            <div id='slider-thumb' className="slider-thumb">
                <div className="slider-thumb-btn"></div>
                <div id="slider-thumb-highlight" className="slider-thumb-highlight"></div>
                <h3 id='slider-thumb-state' className="slider-thumb-state"></h3>
            </div>
        </div>
    );
}

export default Slider;