import "./css/mxBasics.css";
// import Swiper core and required modules
import React from 'react';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';


// 標題元件
const Heading1 = ({ id, text, customClass = "" }) => (
  <>
    <h2 id={id} className={`block title mx mx-heading1 ${customClass}`}>{text}</h2>
    <hr />
  </>
);
const small = 600;
const medium = 1200;

const Heading2 = ({ id, text, customClass = "" }) => (
  <h3 id={id} className={`block mx mx-heading2 ${customClass}`}>{text}</h3>
);

const List = ({ ordered, textList, customClass = "" }) => {
  // 根據 ordered 的值來選擇是否使用 <ul> 或 <ol>
  const ListTag = ordered ? 'ol' : 'ul';
  return (
    <div className={`block mx mx-list ${customClass}`}>
      <ListTag>
        {textList.map((text, index) => (
          <li
            key={index}
            dangerouslySetInnerHTML={{ __html: text }}
          />
        ))}
      </ListTag>
    </div>
  );
};

// 內文元件，處理多個段落，支援 HTML 格式的渲染
const Label = ({ text, customClass = "" }) => (
  <div className={`block mx mx-label ${customClass}`}>
    <p>{text}</p>
  </div>
);

// 內文元件，處理多個段落，支援 HTML 格式的渲染
const Text = ({ textList, customClass = "" }) => (
  <div className={`block mx mx-text ${customClass}`}>
    {textList.map((text, index) => (
      <p key={index} dangerouslySetInnerHTML={{ __html: text }} />
    ))}
  </div>
);

const Image = ({ src, alt = "", caption = "", link = "", linkText = "", customClass = "" }) => (
  <div>
    <img src={src} alt={alt} className={`block mx mx-image ${customClass}`} />
    <figcaption>{caption}</figcaption>
  </div>
);

// 圖片元件，處理多張圖片並包含可選的說明和連結
const Images = ({ align = 'center', srcList, customClass = "" }) => {
  const baseUrl = import.meta.env.BASE_URL; // 從環境變數獲取 baseUrl
  const currentUrl = window.location.href;

  // 根據 align 參數決定對應的對齊類別
  const alignClass = `align-items-${align}`;

  return (
    <Swiper
      className={`block mx mx-images ${customClass}`}
      cssMode={true}
      navigation={true}
      spaceBetween={30}
      centeredSlides={true}
      pagination={{
        clickable: true,
      }}
      mousewheel={true}
      keyboard={true}
      breakpoints={{
        640: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 40,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 50,
          centeredSlides: false,
        },
      }}
      modules={[Navigation, Pagination]}
    >
      {srcList.map((image, index) => (
        <SwiperSlide key={index} className={`swiper-wrapper mx mx-images-item d-flex ${alignClass}`}>
          {/* 僅渲染圖片，無論是否有 link */}
          <img src={`${baseUrl}${image.src}`} alt={image.alt} />

          {/* 渲染 caption （如果有） */}
          {image.caption && <figcaption>{image.caption}</figcaption>}

          {/* 如果有 link，則顯示連結 */}
          {image.link && (
            <a href={image.link} className="link" target="_blank">
              {image.linkText}
            </a>
          )}
        </SwiperSlide>
      ))}

    </Swiper>
  );
};


// 新增表格元件，支援從 JSON 動態生成表格
const Table = ({ columns, rows, customClass = "" }) => (
  <div className={`block mx mx-table ${customClass}`}>
    <table className="table table-striped table-hover">
      <thead>
        <tr>
          {columns.map((col, index) => (
            <th scope="col" key={index}>
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Embed = ({ content, customClass = "" }) => (
  <div className={`block mx mx-embed ${customClass}`} dangerouslySetInnerHTML={{ __html: content }}>
  </div>
);

const Columns = ({ breakpoints, children, customClass = "" }) => {
  // 將每個斷點的列數設定轉換為 Bootstrap 的類別
  const breakpointClasses = Object.entries(breakpoints)
    .map(([breakpoint, columns]) => `col-${breakpoint}-${columns}`)
    .join(' ');

  return (
    <div className={`block row ${customClass}`}>
      {React.Children.map(children, (child, index) => (
        <div className={`col-12 ${breakpointClasses}`} key={index}>
          {child}
        </div>
      ))}
    </div>
  );
};



export { Heading1, Heading2, List, Text, Image, Images, Table, Label, Embed, Columns };