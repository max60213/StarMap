import Scene from "./Scene";
import Landing from "./Landing";
import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const LazySensor = React.lazy(() => import('./articles/Sensor'));
const LazyAperture = React.lazy(() => import('./articles/Aperture'));

function Home() {
    return (
        <Router>
            <div id="visual">
                <Landing />
                <Scene />
            </div>
            <div id="content">
                <Suspense fallback={<div>Loading...</div>}>
                    <Routes>
                        <Route path="/" element="" />
                        <Route path="sensor" element={<LazySensor />} />
                        <Route path="aperture" element={<LazyAperture />} />
                    </Routes>
                </Suspense>
            </div>
        </Router>
    );
}

export default Home;