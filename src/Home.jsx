import React, { Suspense, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Scene from "./Scene";
import Landing from "./Landing";
import useIsHome from "./components/PathChecker";
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/init.css';
import './css/main.css';
import './css/article.css';
import GalaxyContext from './components/GalaxyContext';

const baseUrl = import.meta.env.BASE_URL;
const LazySensor = React.lazy(() => import('./articles/Sensor'));
const LazyAperture = React.lazy(() => import('./articles/Aperture'));

function Home() {
    const isHome = useIsHome();
    const [galaxy, setGalaxy] = useState(null);  // 初始化為 null，提供設置方法

    return (
        <GalaxyContext.Provider value={{ galaxy, setGalaxy }}>
            <div id="visual" className={isHome ? "" : "shrink"}>
                <Scene />
                <Landing />
            </div>
            <div id="content">
                <Suspense fallback={<div>Loading...</div>}>
                    <Routes>
                        <Route path={baseUrl + "/"} element={""} />
                        <Route path={baseUrl} element={""} />
                        <Route path={baseUrl + "/sensor"} element={<LazySensor />} />
                        <Route path={baseUrl + "/aperture"} element={<LazyAperture />} />
                    </Routes>
                </Suspense>
            </div>
        </GalaxyContext.Provider>
    );
}

export default Home;