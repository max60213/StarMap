// Home.jsx
import React, { Suspense, useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom'; // 移除 BrowserRouter
import { CSSTransition, TransitionGroup } from 'react-transition-group';
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
    const isHome = useIsHome();
    const [isLoading, setIsLoading] = useState(true);
    const baseUrl = import.meta.env.BASE_URL;
    const location = useLocation(); // 使用 useLocation 取得當前路由位置

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
        ].map(asset => fetch(asset));

        Promise.all(assets)
            .then(() => setIsLoading(false))
            .catch(error => {
                console.error('Error loading assets:', error);
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return <Loading />;
    } else {
        return (
            <GalaxyProvider> {/* 包裹整個應用部分，提供 context */}
                <div id="visual" className={isHome ? "" : "shrink"}>
                    <Scene />
                    <Landing />
                </div>
                <TransitionGroup>
                    <CSSTransition
                        key={location.key}
                        classNames="slideUp"
                        timeout={300}
                    >
                        <Suspense fallback={<div>Loading...</div>}>
                            <Routes location={location}> {/* 使用 Routes 而非多層 Router */}
                                <Route path={`${baseUrl}/`} element={""} />
                                <Route path={`${baseUrl}/:articleId`} element={<Article />} />
                            </Routes>
                        </Suspense>
                    </CSSTransition>
                </TransitionGroup>
            </GalaxyProvider>
        );
    }
}

export default Home;