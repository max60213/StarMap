import MainContent from "./components/MainContent";
import Navigate from './components/Navigate';
import Window from "./components/Window";
import useIsHome from './components/PathChecker';
import Info from "./components/Info";

function Landing() {
    const isHome = useIsHome(); 

    return (
        <div className="mx-container">
            <div className="mx-first">
                <Navigate className={isHome ? "fade-in" : "fade-out"} />
                <Window className={isHome ? "window-close" : "window-open"} />
            </div>

            <div className="mx-last">
                <MainContent className={isHome ? "fade-in" : "fade-out"} />
                <Info className={isHome ? "fade-out" : "fade-in"} />
            </div>
        </div>
    );
}

export default Landing;