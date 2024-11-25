import { itemsData } from '../../js/items-data.js';
import GalaxyContext from '../GalaxyContext.jsx';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { currentPath } from '../PathChecker.jsx';

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

  let navigate = useNavigate();
  const toHome = () => {
    let path = `../`;
    scrollTo(0, 0);
    navigate(path);
  }

  return (
    <div className={`info px-3 pe-xl-5 d-flex align-items-center full-size ${props.className === undefined ? "" : props.className}`}>
      {itemData ? (
        <div className='info-content'>
          <div className='info-content-title d-flex align-items-center'>
            <div className="d-flex flex-wrap align-items-baseline">
              <h1 className='pe-2'>{itemData.name.zh}</h1>
              <h2 className='en'>{itemData.name.en}</h2>
            </div>

            <button className='ms-auto mx_btn' onClick={toHome}>
              <img src="./close.svg" alt="" />
            </button>
          </div>
          <hr />
          <div className='position-relative'>
            <p>{itemData.content}</p>
            <p className='second'>{itemData.content}</p>
          </div>
        </div>
      ) : (
        <h1>No item selected</h1>
      )}
    </div>
  );
}

export default Info;