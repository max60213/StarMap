import React, { useRef } from 'react';

function ToggleAdvance({ target }) {
  const imgRef = useRef(null); // 用 useRef 建立一個 img 的參考
  const handleToggle = () => {
    const targetElement = document.getElementById(target);
    const toggleAdvance = document.getElementById("toggle_advance");
    if (targetElement) {
      targetElement.classList.toggle('expand');
      if (targetElement.classList.contains('expand')) {
        setTimeout(() => {
          toggleAdvance.scrollIntoView({
            behavior: "smooth", // 平滑滾動
            block: "start",    // 將目標對齊到頂部
          });
        }, 300);
      }
      else {
        toggleAdvance.scrollIntoView({
          behavior: "smooth", // 平滑滾動
          block: "end",    // 將目標對齊到底部
        });
      }
    }

    // 使用 imgRef.current 操作 <img> 元素
    imgRef.current.classList.toggle('rotate');
  };

  return (
    <div className="toggle_advance" id='toggle_advance'>
      <div className='toggle_advance-container'>
        <h1>進階內容</h1>
        <p className="mt-2">為避免學習負擔，將部分深度內容隱藏，點擊右側以展開或收合。</p>
      </div>
      <button className="mx_btn mx_btn-lg mx_btn-collapse" onClick={handleToggle}>
        <img className='' ref={imgRef} src="./drop_down.svg" alt="" />
      </button>
    </div>
  );
}

export default ToggleAdvance;