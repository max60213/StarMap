// MainContent.jsx

import { useEffect, useContext } from 'react';
import { itemsData, group } from '../js/items-data.js';
import { useNavigate } from 'react-router-dom';
import GalaxyContext from '../components/GalaxyContext';
import "../css/transitions.css";

function MainContent(props) {
    const navigate = useNavigate();
    const { galaxy } = useContext(GalaxyContext); // 獲取 Galaxy 實例
    const baseUrl = import.meta.env.BASE_URL;

    const handleNavigation = (path) => {
        if (window.itemReady) {
            navigate(path);
        } else {
            const interval = setInterval(() => {
                if (window.itemReady) {
                    clearInterval(interval);
                    navigate(path);
                }
            }, 100);
        }
    };

    useEffect(() => {
        // 確保 galaxy 存在
        if (!galaxy) return;

        const listItems = document.querySelectorAll('.mx-list-item');
        let timer;

        listItems.forEach(item => {
            const handleMouseOver = () => {
                let onHover = document.querySelector('.mx-list-item.hover');
                if (onHover) {
                    onHover.classList.remove('hover');
                }
                timer = setTimeout(() => {
                    galaxy.selector(item.id); // 使用 galaxy 實例方法
                    console.log(item.id);
                }, 100);
            };

            const handleMouseOut = () => {
                clearTimeout(timer);
                galaxy.selector(null);
            };

            const handleClick = () => {
                galaxy.selector(item.id);

                document.querySelector('.mx-list').classList.add('fade-out');
                const interval = setInterval(() => {
                    if (window.itemReady) {
                        document.getElementById('visual').classList.add('shrink');
                        clearInterval(interval);
                    }
                }, 100);
            };

            // 綁定事件監聽器
            item.addEventListener('mouseover', handleMouseOver);
            item.addEventListener('mouseout', handleMouseOut);
            item.addEventListener('click', handleClick);

            // 清理函數
            return () => {
                item.removeEventListener('mouseover', handleMouseOver);
                item.removeEventListener('mouseout', handleMouseOut);
                item.removeEventListener('click', handleClick);
            };
        });

    }, [galaxy]); // 當 galaxy 實例改變時重新執行
    const itemGroup = (groupIndex) => {
        let startIndex = groupIndex === 0 ? 0 : group.slice(0, groupIndex).reduce((a, b) => a + b, 0);
        let endIndex = startIndex + group[groupIndex];

        return Object.entries(itemsData.items).slice(startIndex, endIndex).map(([key, itemData]) => {
            return (
                <div key={key} id={key} className="mx-list-item" onClick={() => handleNavigation(`.${baseUrl + "/" + key}`)}>
                    <h3>
                        {itemData.name.zh}<span className="subTitle">{itemData.name.en}</span>
                    </h3>
                    <p>{itemData.description}</p>
                </div>
            );
        });
    };

    return (
        <div className="mx-list px-3 pe-xl-5">
            <h1>Lorem ipsum dolor sit amet consectetur.</h1>
            <p className="mb-1 opacity-100">
                這是為攝影新手打造的教學網站，透過動態圖示、與簡單的互動設計，搭配詳細的圖例說明，涵蓋常用名詞與基礎觀念。如果不知道從哪開始，可以按照順序逐步探索，輕鬆入門攝影！
            </p>

            {itemGroup(0)}
            <hr />

            {itemGroup(1)}
            <hr />

            {itemGroup(2)}
            <div></div>
        </div>
    );
}

export default MainContent;