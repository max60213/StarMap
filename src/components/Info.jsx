import { itemsData } from '../js/items-data.js';
import GalaxyContext from './GalaxyContext';
import { useContext, useEffect, useState } from 'react';

function Info(props) {
  const { galaxy } = useContext(GalaxyContext);
  const [itemData, setItemData] = useState(null);

  useEffect(() => {
    if (!galaxy) return;

    // 假設 galaxy.currentItem 是目前選中的項目的鍵名，例如 'sensor'
    const currentItemKey = galaxy.getCurrentItem();
    const currentItemData = itemsData.items[currentItemKey];

    setItemData(currentItemData); // 將目前選中的項目數據保存到狀態中
  }, [galaxy]);

  return (
    <div className={`info d-flex align-items-center px-4 pe-lg-5 full-size ${props.className === undefined ? "" : props.className}`}>
      {itemData ? (
        <div className='info-content'>
          <h1>{itemData.name.zh} ({itemData.name.en})</h1>
          <h2>{itemData.description}</h2>
          <p>{itemData.content}</p>
        </div>
      ) : (
        <h1>No item selected</h1>
      )}
    </div>
  );
}

export default Info;