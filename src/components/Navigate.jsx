import { useEffect, useContext } from 'react';
import GalaxyContext from './GalaxyContext';

function Navigate(props) {
    const { galaxy } = useContext(GalaxyContext);

    useEffect(() => {
        if(!galaxy) return;

        const handleInput = (direction, state) => {
            galaxy.handleInput(direction, state);
        };
        // 設置按鈕
        const buttonLeft = document.getElementById('button-left');
        const buttonRight = document.getElementById('button-right');
        const buttonUp = document.getElementById('button-up');
        const buttonDown = document.getElementById('button-down');

        // Mouse events
        buttonLeft.addEventListener('mousedown', () => handleInput('left', 'down'));
        buttonUp.addEventListener('mousedown', () => handleInput('up', 'down'));
        buttonRight.addEventListener('mousedown', () => handleInput('right', 'down'));
        buttonDown.addEventListener('mousedown', () => handleInput('down', 'down'));

        buttonLeft.addEventListener('mouseup', () => handleInput('left', 'up'));
        buttonUp.addEventListener('mouseup', () => handleInput('up', 'up'));
        buttonRight.addEventListener('mouseup', () => handleInput('right', 'up'));
        buttonDown.addEventListener('mouseup', () => handleInput('down', 'up'));

        // Touch events
        buttonLeft.addEventListener('touchstart', (e) => { e.preventDefault(); handleInput('left', 'down'); }, { passive: true });
        buttonUp.addEventListener('touchstart', (e) => { e.preventDefault(); handleInput('up', 'down'); }, { passive: true });
        buttonRight.addEventListener('touchstart', (e) => { e.preventDefault(); handleInput('right', 'down'); }, { passive: true });
        buttonDown.addEventListener('touchstart', (e) => { e.preventDefault(); handleInput('down', 'down'); }, { passive: true });

        buttonLeft.addEventListener('touchend', (e) => { e.preventDefault(); handleInput('left', 'up'); }, { passive: true });
        buttonUp.addEventListener('touchend', (e) => { e.preventDefault(); handleInput('up', 'up'); }, { passive: true });
        buttonRight.addEventListener('touchend', (e) => { e.preventDefault(); andleInput('right', 'up'); }, { passive: true });
        buttonDown.addEventListener('touchend', (e) => { e.preventDefault(); handleInput('down', 'up'); }, { passive: true });
        // 清理函数：移除事件监听器
        return () => {
            // Mouse events
            buttonLeft.removeEventListener('mousedown', () => handleInput('left', 'down'));
            buttonUp.removeEventListener('mousedown', () => handleInput('up', 'down'));
            buttonRight.removeEventListener('mousedown', () => handleInput('right', 'down'));
            buttonDown.removeEventListener('mousedown', () => handleInput('down', 'down'));

            buttonLeft.removeEventListener('mouseup', () => handleInput('left', 'up'));
            buttonUp.removeEventListener('mouseup', () => handleInput('up', 'up'));
            buttonRight.removeEventListener('mouseup', () => handleInput('right', 'up'));
            buttonDown.removeEventListener('mouseup', () => handleInput('down', 'up'));

            // Touch events
            buttonLeft.removeEventListener('touchstart', (e) => { e.preventDefault(); handleInput('left', 'down'); });
            buttonUp.removeEventListener('touchstart', (e) => { e.preventDefault(); handleInput('up', 'down'); });
            buttonRight.removeEventListener('touchstart', (e) => { e.preventDefault(); dleInput('right', 'down'); });
            buttonDown.removeEventListener('touchstart', (e) => { e.preventDefault(); ndleInput('down', 'down'); });

            buttonLeft.removeEventListener('touchend', (e) => { e.preventDefault(); handleInput('left', 'up'); });
            buttonUp.removeEventListener('touchend', (e) => { e.preventDefault(); handleInput('up', 'up'); });
            buttonRight.removeEventListener('touchend', (e) => { e.preventDefault(); andleInput('right', 'up'); });
            buttonDown.removeEventListener('touchend', (e) => { e.preventDefault(); handleInput('down', 'up'); });
        };
    }, [galaxy]);

    return (
        <div id="navigate" className={`arrows-container ${props.className == undefined ? "" : props.className}`}>
            <div className="arrows">
                <div className="mx-button" id="button-left"></div>
                <div className="mx-button" id="button-right"></div>
                <div className="mx-button" id="button-up"></div>
                <div className="mx-button" id="button-down"></div>
            </div>
        </div>
    );
}

export default Navigate;