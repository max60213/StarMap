import { useEffect } from 'react';
import { itemsData, group } from '../js/items-data.js';
import { useNavigate } from 'react-router-dom';

function MainContent(props) {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        if (window.itemReady) {
            navigate(path);
        } else {
            // 可以設置一個間聽器來監聽 itemReady 變為 true
            const interval = setInterval(() => {
                if (window.itemReady) {
                    clearInterval(interval);
                    navigate(path);
                }
            }, 100); // 每 100 毫秒檢查一次
        }
    };

    // 定義一個函數來渲染特定群組的項目
    const itemGroup = (groupIndex) => {
        // 計算當前群組的起始索引
        let startIndex = groupIndex === 0 ? 0 : group.slice(0, groupIndex).reduce((a, b) => a + b, 0);
        // 計算當前群組的結束索引
        let endIndex = startIndex + group[groupIndex];

        // 從 itemsData.items 對象中獲取特定範圍的項目並映射為 Link 元素
        return Object.entries(itemsData.items).slice(startIndex, endIndex).map(([key, itemData]) => {
            return (
                <div key={key} id={key} className="mx-list-item" onClick={() => handleNavigation(`./starmap/${key}`)}>
                    <h3>
                        {itemData.name.zh}<span className="subTitle">{itemData.name.en}</span>
                    </h3>
                    <p>{itemData.description}</p>
                </div>
            );
        });
    };
    useEffect(() => {
        const script = document.createElement('script');
        script.src = '../src/js/selector.js';
        script.type = 'module';
        document.body.appendChild(script);
    
        return () => {
            // Ensure the script is removed when the component unmounts
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []); 

    // 渲染主要內容
    return (
        <>
            <div className={`mx-list ${props.className == undefined ? "" : props.className}`}>
                {/* 頁面標題 */}
                <h1>Lorem ipsum dolor sit amet consectetur.</h1>
                <p className="mb-1">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit
                    provident sequi est dolores neque corporis sunt nihil aspernatur nulla
                    hic?
                </p>

                {/* 渲染第一個群組（單個項目） */}
                {itemGroup(0)}
                <hr />

                {/* 渲染第二個群組（曝光三要素） */}
                <h2>曝光三要素</h2>
                {itemGroup(1)}
                <hr />

                {/* 渲染第三個群組（其他項目） */}
                <h2>其他</h2>
                {itemGroup(2)}
                <div></div>
            </div>
        </>
    );
}

export default MainContent;