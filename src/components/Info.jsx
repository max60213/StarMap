import { itemsData } from '../js/items-data.js';
import GalaxyContext from './GalaxyContext';
import { useContext, useEffect, useState } from 'react';
import { currentPath } from './PathChecker.jsx';
import '../css/info.css';

function Info(props) {
  const { galaxy } = useContext(GalaxyContext);
  const [itemData, setItemData] = useState(null);
  const path = currentPath();

  useEffect(() => {
    if (!galaxy) return;

    // 假設 galaxy.currentItem 是目前選中的項目的鍵名，例如 'sensor'
    galaxy.selector(path);
    const currentItemKey = galaxy.getCurrentItem();
    const currentItemData = itemsData.items[currentItemKey];

    setItemData(currentItemData); // 將目前選中的項目數據保存到狀態中
  }, [galaxy]);

  return (
    <div className={`info d-flex align-items-center full-size ${props.className === undefined ? "" : props.className}`}>
      {itemData ? (
        <div className='info-content'>
          <h1 className='info-content-title pb-1'>{itemData.name.zh} <span>{itemData.name.en}</span></h1>
          <h2>{itemData.description}</h2>
          <hr/>
          <p className='pt-2'>{itemData.content}</p>
        </div>
      ) : (
        <h1>No item selected</h1>
      )}
    </div>
  );
}

export default Info;