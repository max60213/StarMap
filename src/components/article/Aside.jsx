import React, { useEffect, useState } from 'react';
import "./css/aside.css";

function Aside({ className }) {
    // 創建一個狀態變量來存儲標題
    const [titles, setTitles] = useState([]);
    const baseURL = import.meta.env.BASE_URL;

    useEffect(() => {
        // 在組件加載後執行
        const titleElements = document.querySelectorAll('.title');  // 獲取所有的 .title 元素
        if(document.querySelector(".block"))
            document.querySelector(".block").id = "overview";  // 為概述添加 id

        // 提取每個標題元素的文本和已有的 id
        const titleData = Array.from(titleElements).map((elem) => {
            const titleText = elem.textContent; // 提取標題的文本
            const titleId = elem.id;  // 直接抓取元素的 id

            return { text: titleText, id: titleId };
        });

        setTitles(titleData);  // 更新狀態
    }, []);  // 空依賴數組表示這個 effect 只在組件首次渲染時執行

    return (
        <aside className={`mx-aside sticky-top ${className}`}>
            <div id="navbar" className="h-100 flex-column">
                <div className="nav flex-column border-start">
                    <a key="overview" className="nav-link" href="#overview">
                        概述
                    </a>
                    {titles.length > 0 && titles.map(({ text, id }) => (
                        <a key={id} className="nav-link" href={`#${id}`}>
                            {text}
                        </a>
                    ))}
                </div>
            </div>
        </aside>
    );
}

export default Aside;