// MainContent.jsx

import { useEffect, useContext } from 'react';
import { itemsData, listGroup } from '../js/items-data.js';
import { useNavigate } from 'react-router-dom';
import GalaxyContext from '../components/GalaxyContext';
import "../css/transitions.css";

function MainContent(props) {
    const navigate = useNavigate();
    const { galaxy } = useContext(GalaxyContext); // 獲取 Galaxy 實例

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
        if (!galaxy) return;

        const listItems = document.querySelectorAll('.mx-list-item');
        const cleanupFunctions = [];
        let timer;

        listItems.forEach(item => {
            const handleMouseOver = () => {
                let onHover = document.querySelector('.mx-list-item.hover');
                if (onHover) {
                    onHover.classList.remove('hover');
                }
                timer = setTimeout(() => {
                    galaxy.selector(item.id);
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

            item.addEventListener('mouseover', handleMouseOver);
            item.addEventListener('mouseout', handleMouseOut);
            item.addEventListener('click', handleClick);

            cleanupFunctions.push(() => {
                item.removeEventListener('mouseover', handleMouseOver);
                item.removeEventListener('mouseout', handleMouseOut);
                item.removeEventListener('click', handleClick);
            });
        });

        return () => {
            cleanupFunctions.forEach(cleanup => cleanup());
        };
    }, [galaxy]);

    const itemGroup = (groupIndex) => {
        let startIndex = groupIndex === 0 ? 0 : listGroup.slice(0, groupIndex).reduce((a, b) => a + b, 0);
        let endIndex = startIndex + listGroup[groupIndex];

        return Object.entries(itemsData.items).slice(startIndex, endIndex).map(([key, itemData]) => {
            return (
                <div key={key} id={key} className="mx-list-item" onClick={() => handleNavigation(`/${key}`)}>
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
            <h1 className='mb-1 mainTitle'>Try, Learn, Explore</h1>
            <p className="mb-2 subTitle">
                這是為攝影新手打造的教學網站，透過動態圖示、與簡單的互動設計，搭配詳細的圖例說明，涵蓋常用名詞與基礎觀念。如果不知道從哪開始，可以按照順序逐步探索，輕鬆入門攝影！
            </p>

            {itemGroup(0)}
            <hr />

            {itemGroup(1)}
            <hr />

            {itemGroup(2)}
        </div>
    );
}

export default MainContent;