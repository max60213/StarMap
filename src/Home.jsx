// Home.jsx
import React, { Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/init.css';
import './css/daylight.css';
import './css/main.css';
import Scene from "./Scene";
import Landing from "./Landing";
import Loading from './Loading';
import Article from './components/article/Article';
import { useIsHome } from "./components/PathChecker";
import { GalaxyProvider } from './components/GalaxyContext';

function Home() {
    const isHome = useIsHome();  // 使用自定義 Hook 判斷當前是否位於首頁
    const [isLoading, setIsLoading] = useState(true);
    const baseUrl = import.meta.env.BASE_URL;

    useEffect(() => {
        const assets = [
            `${baseUrl}/img/icons/aperture.png`,
            `${baseUrl}/img/icons/depth-of-field.png`,
            `${baseUrl}/img/icons/dynamic-range.png`,
            `${baseUrl}/img/icons/exposure-value.png`,
            `${baseUrl}/img/icons/focal-length.png`,
            `${baseUrl}/img/icons/focus.png`,
            `${baseUrl}/img/icons/format.png`,
            `${baseUrl}/img/icons/frame-rate.png`,
            `${baseUrl}/img/icons/iso.png`,
            `${baseUrl}/img/icons/metering-mode.png`,
            `${baseUrl}/img/icons/sensor.png`,
            `${baseUrl}/img/icons/shutter.png`,
            `${baseUrl}/img/icons/white-balance.png`,
            `${baseUrl}/video/aperture.mp4`

        ].map(asset => fetch(asset));  // 載入 public 目錄下的資源

        // 合併所有資源的 Promise
        Promise.all(assets)
            .then(() => setIsLoading(false))
            .catch(error => {
                console.error('Error loading assets:', error);
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return <Loading />;
    }
    else {
        return (
            <GalaxyProvider> {/* 使用 GalaxyProvider 包裹整個應用部分，提供 context */}
                <div id="visual" className={isHome ? "" : "shrink"}>
                    <Scene />
                    <Landing />
                </div>
                <>
                    <Suspense fallback={<div>Loading...</div>}> {/* 為懶加載組件提供 fallback */}
                        <Routes>
                            <Route path={`${baseUrl}/`} element={""} />
                            {/* 使用 articleId 來動態載入不同的文章*/}
                            <Route path={`${baseUrl}/:articleId`} element={<Article />} />
                        </Routes>
                    </Suspense>
                </>
            </GalaxyProvider>
        );
    }
}

export default Home;