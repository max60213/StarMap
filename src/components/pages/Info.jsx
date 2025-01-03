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

    galaxy.selector(path);
    const currentItemKey = galaxy.getCurrentItem();
    const currentItemData = itemsData.items[currentItemKey];

    setItemData(currentItemData);
  }, [galaxy, path]);

  let navigate = useNavigate();
  const toHome = () => {
    let path = `../`;
    scrollTo(0, 0);
    navigate(path);
  }

  return (
    <div className={`info px-3 pe-xl-5 d-flex full-size ${props.className === undefined ? "" : props.className}`}>
      {itemData ? (
        <div className='info-content'>
          <div className='info-content-title d-flex align-items-center'>
            <div className="d-flex flex-wrap align-items-baseline">
              <h1 className='pe-2'>{itemData.name.zh}</h1>
              <h2 className='en'>{itemData.name.en}</h2>
            </div>

            <button className='ms-auto mx_btn' onClick={toHome}>
              <img src="/close.svg" alt="" />
            </button>
          </div>
          <hr />
          <div className='position-relative'>
            <p>{itemData.content}</p>
          </div>
        </div>
      ) : (
        <h1>No item selected</h1>
      )}
    </div>
  );
}

export default Info;