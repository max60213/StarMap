import Scene from "./Scene";
import Landing from "./Landing";
import React, { Suspense, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import useIsHome from "./components/PathChecker";
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/init.css';
import './css/main.css';
import './css/article.css';

const LazySensor = React.lazy(() => import('./articles/Sensor'));
const LazyAperture = React.lazy(() => import('./articles/Aperture'));

function Home() {
    const isHome = useIsHome();

    return (
        <>
            <div id="visual" className={isHome ? "" : "shrink"}>
                <Landing />
                <Scene />
            </div>
            <div id="content">
                <Suspense fallback={<div>Loading...</div>}>
                    <Routes>
                        <Route path="/" element="" />
                        <Route path="/sensor" element={<LazySensor />} />
                        <Route path="/aperture" element={<LazyAperture />} />
                    </Routes>
                </Suspense>
            </div>
        </>
    );
}

export default Home;