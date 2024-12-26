// MainContent.jsx

import { useEffect, useContext, useRef } from 'react';
import { itemsData, listGroup } from '../js/items-data.js';
import { useNavigate } from 'react-router-dom';
import GalaxyContext from '../components/GalaxyContext';
import "../css/transitions.scss";

function MainContent(props) {
    const navigate = useNavigate();
    const { galaxy } = useContext(GalaxyContext);
    const isMobile = window.innerWidth <= 768; // 判斷是否為手機版

    const handleNavigation = (path, isHidden) => {
        if (isHidden) return;
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

        // 設置 Intersection Observer
        if (isMobile) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    // 取得 .mx-list 的位置
                    const mxList = document.querySelector('.mx-list');
                    const mxListRect = mxList.getBoundingClientRect();
                    const triggerLine = mxListRect.top + 50; // 加上 10px 的向下偏移

                    // 計算元素中心點在視窗中的相對位置
                    const elementRect = entry.boundingClientRect;
                    const elementCenter = elementRect.top + elementRect.height / 2;
                    const offset = Math.abs(elementCenter - triggerLine);

                    // 當元素接近觸發線且可見時觸發
                    if (entry.isIntersecting && offset < elementRect.height / 2) {
                        // 移除其他項目的 hover 效果
                        listItems.forEach(item => item.classList.remove('hover'));
                        // 添加當前項目的 hover 效果
                        entry.target.classList.add('hover');
                        // 更新 galaxy 選擇器
                        galaxy.selector(entry.target.id);
                    }
                });
            }, {
                threshold: [0, 0.25, 0.5, 0.75, 1],
                rootMargin: "-45% 0px -45% 0px" // 調整觀察範圍
            });

            // 觀察所有列表項目
            listItems.forEach(item => {
                observer.observe(item);
            });

            // 清理函數
            cleanupFunctions.push(() => observer.disconnect());
        } else {
            // 桌面版的原有邏輯
            listItems.forEach(item => {
                const handleMouseOver = () => {
                    let onHover = document.querySelector('.mx-list-item.hover');
                    if (onHover) {
                        onHover.classList.remove('hover');
                    }
                    timer = setTimeout(() => {
                        galaxy.selector(item.id);
                    }, 100);
                };

                const handleMouseOut = () => {
                    clearTimeout(timer);
                    galaxy.selector(null);
                };

                const handleClick = () => {
                    if (item.classList.contains('hide')) return;
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
        }

        return () => {
            cleanupFunctions.forEach(cleanup => cleanup());
        };
    }, [galaxy, isMobile]);

    const itemGroup = (groupIndex) => {
        let startIndex = groupIndex === 0 ? 0 : listGroup.slice(0, groupIndex).reduce((a, b) => a + b, 0);
        let endIndex = startIndex + listGroup[groupIndex];

        return Object.entries(itemsData.items).slice(startIndex, endIndex).map(([key, itemData]) => {
            return (
                <div key={key} id={key} className={`mx-list-item ${groupIndex === 2 && "hide"}`} onClick={() => handleNavigation(`/${key}`, groupIndex === 2)}>
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