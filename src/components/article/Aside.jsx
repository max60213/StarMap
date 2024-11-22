import React, { useEffect, useState, useCallback, useMemo } from 'react';
import "./css/aside.css";

function Aside({ className }) {
    const [titles, setTitles] = useState([]);

    // 使用 useCallback 記憶化處理標題的函數
    const processTitles = useCallback(() => {
        const titleElements = document.querySelectorAll('.title');

        // 為概述添加 id
        const overviewBlock = document.querySelector(".block");
        if (overviewBlock && !overviewBlock.id) {
            overviewBlock.id = "overview";
        }

        // 只在標題列表為空或有變化時更新
        const newTitleData = Array.from(titleElements).map((elem) => ({
            text: elem.textContent,
            id: elem.id
        }));

        // 比較新舊標題是否相同，避免不必要的更新
        setTitles(prev => {
            const isDifferent = prev.length !== newTitleData.length ||
                prev.some((item, index) => 
                    item.text !== newTitleData[index]?.text || 
                    item.id !== newTitleData[index]?.id
                );
            
            return isDifferent ? newTitleData : prev;
        });
    }, []);

    // 處理點擊事件
    const handleClick = useCallback((e) => {
        e.preventDefault();
        const href = e.currentTarget.getAttribute('href');
        const element = document.querySelector(href);
        if (element) {
            element.scrollIntoView();
        }
    }, []);

    // 初始化時處理標題
    useEffect(() => {
        processTitles();
    }, [processTitles]);

    // 使用 useMemo 記憶化導航列表
    const navLinks = useMemo(() => (
        <>
            <a 
                key="overview" 
                className="nav-link" 
                href="#overview"
                onClick={handleClick}
            >
                概述
            </a>
            {titles.map(({ text, id }) => (
                <a 
                    key={id} 
                    className="nav-link" 
                    href={`#${id}`}
                    onClick={handleClick}
                >
                    {text}
                </a>
            ))}
        </>
    ), [titles, handleClick]);

    return (
        <aside className={`mx-aside ${className}`}>
            <div id="navbar" className="sticky-top flex-column">
                <div className="nav flex-column border-start">
                    {navLinks}
                </div>
            </div>
        </aside>
    );
}

export default React.memo(Aside);