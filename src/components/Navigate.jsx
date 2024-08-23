import { useEffect } from 'react';

function Navigate(props) {

    useEffect(() => {
        // 設置按鈕
        const buttonLeft = document.getElementById('button-left');
        const buttonRight = document.getElementById('button-right');
        const buttonUp = document.getElementById('button-up');
        const buttonDown = document.getElementById('button-down');

        // Mouse events
        buttonLeft.addEventListener('mousedown', () => window.handleInput('left', 'down'));
        buttonUp.addEventListener('mousedown', () => window.handleInput('up', 'down'));
        buttonRight.addEventListener('mousedown', () => window.handleInput('right', 'down'));
        buttonDown.addEventListener('mousedown', () => window.handleInput('down', 'down'));

        buttonLeft.addEventListener('mouseup', () => window.handleInput('left', 'up'));
        buttonUp.addEventListener('mouseup', () => window.handleInput('up', 'up'));
        buttonRight.addEventListener('mouseup', () => window.handleInput('right', 'up'));
        buttonDown.addEventListener('mouseup', () => window.handleInput('down', 'up'));

        // Touch events
        buttonLeft.addEventListener('touchstart', (e) => { e.preventDefault(); handleInput('left', 'down'); }, { passive: true });
        buttonUp.addEventListener('touchstart', (e) => { e.preventDefault(); handleInput('up', 'down'); }, { passive: true });
        buttonRight.addEventListener('touchstart', (e) => { e.preventDefault(); dleInput('right', 'down'); }, { passive: true });
        buttonDown.addEventListener('touchstart', (e) => { e.preventDefault(); ndleInput('down', 'down'); }, { passive: true });

        buttonLeft.addEventListener('touchend', (e) => { e.preventDefault(); handleInput('left', 'up'); }, { passive: true });
        buttonUp.addEventListener('touchend', (e) => { e.preventDefault(); handleInput('up', 'up'); }, { passive: true });
        buttonRight.addEventListener('touchend', (e) => { e.preventDefault(); andleInput('right', 'up'); }, { passive: true });
        buttonDown.addEventListener('touchend', (e) => { e.preventDefault(); handleInput('down', 'up'); }, { passive: true });
        // 清理函数：移除事件监听器
        return () => {
            // Mouse events
            buttonLeft.removeEventListener('mousedown', () => window.handleInput('left', 'down'));
            buttonUp.removeEventListener('mousedown', () => window.handleInput('up', 'down'));
            buttonRight.removeEventListener('mousedown', () => window.handleInput('right', 'down'));
            buttonDown.removeEventListener('mousedown', () => window.handleInput('down', 'down'));

            buttonLeft.removeEventListener('mouseup', () => window.handleInput('left', 'up'));
            buttonUp.removeEventListener('mouseup', () => window.handleInput('up', 'up'));
            buttonRight.removeEventListener('mouseup', () => window.handleInput('right', 'up'));
            buttonDown.removeEventListener('mouseup', () => window.handleInput('down', 'up'));

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
    }, []);

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