import GalaxyContext from '../GalaxyContext.jsx';
import { useContext, useEffect, useState } from 'react';
import { itemsData } from '../../js/items-data.js';

function View({ currentStep, articleData }) {
    const mediaSrc = articleData?.landing.src?.[0] || "";

    // Transform values
    const transforms = [
        'translateX(0%)',
        `translateX(-20%)`,
        `translateX(-40%)`,
        'translateX(-60%)',
        `translateX(-80%)`,
    ];

    // 更新圖片位移效果
    useEffect(() => {
        const media = document.getElementById('view-player');
        if (media) {
            media.style.transform = transforms[currentStep];
        }
    }, [currentStep]);

    return (
        <div className="view player">
            <div className='view_data'>
                <div className="view_data-top">
                    <div id="lens">
                        <p>Lens</p>
                        <h3>{articleData?.landing.data.lens[currentStep] || articleData?.landing.data.lens[0]}</h3>
                    </div>
                    <div className='view_data-right ms-auto' id="WB">
                        <p>WB</p>
                        <h3>{articleData?.landing.data.WB[currentStep] || articleData?.landing.data.WB[0]}</h3>
                    </div>
                </div>
                <div className="view_data-bottom">
                    <div id="shutter">
                        <p>Shutter</p>
                        <h3>{articleData?.landing.data.shutter[currentStep] || articleData?.landing.data.shutter[0]}</h3>
                    </div>
                    <div id="aperture">
                        <p>Aperture</p>
                        <h3>{articleData?.landing.data.aperture[currentStep] || articleData?.landing.data.aperture[0]}</h3>
                    </div>
                    <div id="iso">
                        <p>ISO</p>
                        <h3>{articleData?.landing.data.iso[currentStep] || articleData?.landing.data.iso[0]}</h3>
                    </div>
                    <div className='view_data-right ms-auto' id="EV">
                        <p>EV</p>
                        <h3>{articleData?.landing.data.EV[currentStep] || articleData?.landing.data.EV[0]}</h3>
                    </div>
                </div>
            </div>
            {/* 使用圖片標籤，來自 JSON 中的 mediaSrc */}
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