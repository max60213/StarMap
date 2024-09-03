// Home.jsx
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Scene from "./Scene";
import Landing from "./Landing";
import useIsHome from "./components/PathChecker";
import { GalaxyProvider } from './components/GalaxyContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/init.css';
import './css/main.css';
import './css/article.css';

const baseUrl = import.meta.env.BASE_URL;
const LazySensor = React.lazy(() => import('./articles/Sensor'));
const LazyAperture = React.lazy(() => import('./articles/Aperture'));

function Home() {
    const isHome = useIsHome();  // 使用自定義 Hook 判斷當前是否位於首頁

    return (
        <GalaxyProvider> {/* 使用 GalaxyProvider 包裹整個應用部分，提供 context */}
            <div id="visual" className={isHome ? "" : "shrink"}>
                <Scene />
                <Landing />
            </div>
            <div id="content">
                <Suspense fallback={<div>Loading...</div>}> {/* 為懶加載組件提供 fallback */}
                    <Routes>
                        <Route path={`${baseUrl}/`} element={<div>Home Page</div>} />
                        <Route path={`${baseUrl}/sensor`} element={<LazySensor />} />
                        <Route path={`${baseUrl}/aperture`} element={<LazyAperture />} />
                    </Routes>
                </Suspense>
            </div>
        </GalaxyProvider>
    );
}

export default Home;