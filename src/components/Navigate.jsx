import { useEffect, useContext } from 'react';
import GalaxyContext from './GalaxyContext';

function Navigate(props) {
    const { galaxy } = useContext(GalaxyContext);

    useEffect(() => {
        if (!galaxy) return;

        // 處理用戶輸入的函數
        const handleInput = (direction, state) => {
            galaxy.handleInput(direction, state);
        };

        // 獲取控制按鈕元素
        const buttonLeft = document.getElementById('button-left');
        const buttonRight = document.getElementById('button-right');
        const buttonUp = document.getElementById('button-up');
        const buttonDown = document.getElementById('button-down');

        // 設置滑鼠和觸摸事件
        buttonLeft.addEventListener('mousedown', () => handleInput('left', 'down'));
        buttonUp.addEventListener('mousedown', () => handleInput('up', 'down'));
        buttonRight.addEventListener('mousedown', () => handleInput('right', 'down'));
        buttonDown.addEventListener('mousedown', () => handleInput('down', 'down'));

        buttonLeft.addEventListener('mouseup', () => handleInput('left', 'up'));
        buttonUp.addEventListener('mouseup', () => handleInput('up', 'up'));
        buttonRight.addEventListener('mouseup', () => handleInput('right', 'up'));
        buttonDown.addEventListener('mouseup', () => handleInput('down', 'up'));

        // 觸摸事件（確保預防默認行為以避免滾動等問題）
        buttonLeft.addEventListener('touchstart', (e) => { e.preventDefault(); handleInput('left', 'down'); }, { passive: false });
        buttonUp.addEventListener('touchstart', (e) => { e.preventDefault(); handleInput('up', 'down'); }, { passive: false });
        buttonRight.addEventListener('touchstart', (e) => { e.preventDefault(); handleInput('right', 'down'); }, { passive: false });
        buttonDown.addEventListener('touchstart', (e) => { e.preventDefault(); handleInput('down', 'down'); }, { passive: false });

        buttonLeft.addEventListener('touchend', (e) => { e.preventDefault(); handleInput('left', 'up'); }, { passive: false });
        buttonUp.addEventListener('touchend', (e) => { e.preventDefault(); handleInput('up', 'up'); }, { passive: false });
        buttonRight.addEventListener('touchend', (e) => { e.preventDefault(); handleInput('right', 'up'); }, { passive: false });
        buttonDown.addEventListener('touchend', (e) => { e.preventDefault(); handleInput('down', 'up'); }, { passive: false });

        // 清理函數：移除所有事件監聽器
        return () => {
            buttonLeft.removeEventListener('mousedown', () => handleInput('left', 'down'));
            buttonUp.removeEventListener('mousedown', () => handleInput('up', 'down'));
            buttonRight.removeEventListener('mousedown', () => handleInput('right', 'down'));
            buttonDown.removeEventListener('mousedown', () => handleInput('down', 'down'));

            buttonLeft.removeEventListener('mouseup', () => handleInput('left', 'up'));
            buttonUp.removeEventListener('mouseup', () => handleInput('up', 'up'));
            buttonRight.removeEventListener('mouseup', () => handleInput('right', 'up'));
            buttonDown.removeEventListener('mouseup', () => handleInput('down', 'up'));

            buttonLeft.removeEventListener('touchstart', (e) => { e.preventDefault(); handleInput('left', 'down'); });
            buttonUp.removeEventListener('touchstart', (e) => { e.preventDefault(); handleInput('up', 'down'); });
            buttonRight.removeEventListener('touchstart', (e) => { e.preventDefault(); handleInput('right', 'down'); });
            buttonDown.removeEventListener('touchstart', (e) => { e.preventDefault(); handleInput('down', 'down'); });

            buttonLeft.removeEventListener('touchend', (e) => { e.preventDefault(); handleInput('left', 'up'); });
            buttonUp.removeEventListener('touchend', (e) => { e.preventDefault(); handleInput('up', 'up'); });
            buttonRight.removeEventListener('touchend', (e) => { e.preventDefault(); handleInput('right', 'up'); });
            buttonDown.removeEventListener('touchend', (e) => { e.preventDefault(); handleInput('down', 'up'); });
        };
    }, [galaxy]);  // 當 galaxy 更新時重新執行

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