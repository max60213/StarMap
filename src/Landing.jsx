import MainContent from "./components/MainContent";
import Navigate from './components/Navigate';
import Window from "./components/pages/Window";
import { CSSTransition } from 'react-transition-group';
import { useIsHome } from './components/PathChecker';
import Info from "./components/pages/Info";
import "./css/transitions.css";

function Landing() {
    const isHome = useIsHome();

    return (
        <div className="mx-container">
            <div className="mx-first">
                <Window className={isHome ? "" : "active"} />
                {/* <CSSTransition
                    in={isHome}
                    timeout={300}
                    classNames="fade"
                    unmountOnExit
                >
                    <Navigate/>
                </CSSTransition> */}
            </div>
            <div className="mx-last">
                <CSSTransition
                    in={isHome}
                    timeout={600}
                    classNames="slideRight"
                    unmountOnExit
                >
                     <MainContent />
                </CSSTransition>
                <CSSTransition
                    in={!isHome}
                    timeout={600}
                    classNames="slideLeft"
                    unmountOnExit
                >
                    <Info />
                </CSSTransition>
            </div>
        </div>
    );
}

export default Landing;