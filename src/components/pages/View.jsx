import GalaxyContext from '../GalaxyContext.jsx';
import { useContext, useEffect, useState } from 'react';
import { itemsData } from '../../js/items-data.js';

function View({ currentStep, articleData, currentImageIndex }) {
    const mediaSrc = articleData?.landing.src?.[currentImageIndex] || "";

    // Transform values
    const transforms = [
        'translateX(0%)',
        'translateX(-20%)',
        'translateX(-40%)',
        'translateX(-60%)',
        'translateX(-80%)',
    ];

    // 更新圖片位移效果
    useEffect(() => {
        const media = document.getElementById('view-player');
        if (media) {
            media.style.transform = transforms[currentStep];
        }
    }, [currentStep]);

    // 建立一個輔助函數來處理資料讀取邏輯
    const getData = (field) => {
        const data = articleData?.landing?.data?.[field];
        if (!data) return "";

        // 嘗試讀取當前圖片索引的資料
        const currentImageData = data[currentImageIndex] || data[0];
        if (!currentImageData) return "";

        // 嘗試讀取當前步驟的資料
        return currentImageData[currentStep] || currentImageData[0];
    };

    return (
        <div className="view player">
            <div className='view_data'>
                <div className="view_data-top">
                    <div id="lens">
                        <p>Lens</p>
                        <h3>{getData('lens')}</h3>
                    </div>
                    <div className='view_data-right ms-auto' id="WB">
                        <p>WB</p>
                        <h3>{getData('WB')}</h3>
                    </div>
                </div>
                <div className="view_data-bottom">
                    <div id="shutter">
                        <p>Shutter</p>
                        <h3>{getData('shutter')}</h3>
                    </div>
                    <div id="aperture">
                        <p>Aperture</p>
                        <h3>{getData('aperture')}</h3>
                    </div>
                    <div id="iso">
                        <p>ISO</p>
                        <h3>{getData('iso')}</h3>
                    </div>
                    <div className='view_data-right ms-auto' id="EV">
                        <p>EV</p>
                        <h3>{getData('EV')}</h3>
                    </div>
                </div>
            </div>
            <img
                id="view-player"
                src={mediaSrc}
                alt="View Content"
                className="view-image"
            />
        </div>
    );
}

export default View;