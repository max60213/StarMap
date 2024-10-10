import MainContent from "./components/MainContent";
import Navigate from './components/Navigate';
import Window from "./components/Window";
import { useIsHome } from './components/PathChecker';
import Info from "./components/Info";

function Landing() {
    const isHome = useIsHome(); 

    return (
        <div className="mx-container">
            <div className="mx-first">
                <Window className={isHome ? "" : "active"} />
                {isHome && <Navigate className="fade-in" />}
            </div>
            <div className="mx-last">
                <MainContent className={isHome ? "fade-in" : "fade-out"} />
                {isHome ? null: <Info/> }
            </div>
        </div>
    );
}

export default Landing;