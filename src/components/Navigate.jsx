import { useEffect, useContext } from 'react';
import GalaxyContext from './GalaxyContext';

function Navigate(props) {
    const { galaxy } = useContext(GalaxyContext);

    useEffect(() => {
        if (!galaxy) return;

        const handleInput = (direction, state) => {
            galaxy.handleInput(direction, state);
        };

        const buttonLeft = document.getElementById('button-left');
        const buttonRight = document.getElementById('button-right');
        const buttonUp = document.getElementById('button-up');
        const buttonDown = document.getElementById('button-down');

        // 添加事件監聽器
        const events = [
            [buttonLeft, 'mousedown', () => handleInput('left', 'down')],
            [buttonLeft, 'mouseup', () => handleInput('left', 'up')],
            [buttonUp, 'mousedown', () => handleInput('up', 'down')],
            [buttonUp, 'mouseup', () => handleInput('up', 'up')],
            [buttonRight, 'mousedown', () => handleInput('right', 'down')],
            [buttonRight, 'mouseup', () => handleInput('right', 'up')],
            [buttonDown, 'mousedown', () => handleInput('down', 'down')],
            [buttonDown, 'mouseup', () => handleInput('down', 'up')]
        ];

        events.forEach(([element, event, handler]) => {
            element.addEventListener(event, handler);
        });

        // 清理函數
        return () => {
            events.forEach(([element, event, handler]) => {
                element.removeEventListener(event, handler);
            });
        };
    }, [galaxy]);

    return (
        <div id="navigate" className={`arrows-container ${props.className || ""}`}>
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