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

function App() {
    const isHome = useIsHome();
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation(); // 使用 useLocation 取得當前路由位置

    useEffect(() => {
        const assets = Object.values(import.meta.glob('/img/icons/*.png', { eager: true })).map(module => fetch(module.default));
    
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
                                <Route path="/" element={""} />
                                <Route path="/:articleId" element={<Article />} />
                            </Routes>
                        </Suspense>
                    </CSSTransition>
                </TransitionGroup>
            </GalaxyProvider>
        );
    }
}

export default App;