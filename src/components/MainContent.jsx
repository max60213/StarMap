import { Link } from 'react-router-dom';
import { itemsData, group } from '../js/items-data.js';

function MainContent(props) {
    // 定義一個函數來渲染特定群組的項目
    const itemGroup = (groupIndex) => {
        // 計算當前群組的起始索引
        let startIndex = groupIndex === 0 ? 0 : group.slice(0, groupIndex).reduce((a, b) => a + b, 0);
        // 計算當前群組的結束索引
        let endIndex = startIndex + group[groupIndex];

        // 從 itemsData.items 對象中獲取特定範圍的項目並映射為 Link 元素
        return Object.entries(itemsData.items).slice(startIndex, endIndex).map(([key, itemData]) => {
            return (
                <Link key={key} to={`./${key}`} id={key} className="mx-list-item">
                    <h3>
                        {itemData.name.zh}<span className="subTitle">{itemData.name.en}</span>
                    </h3>
                    <p>{itemData.description}</p>
                </Link>
            );
        });
    };

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