import "./css/mxBasics.css";
import React, { useEffect } from "react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

/**
 * 渲染嵌套模組的輔助函數
 * @param {Array} nestedItems - 子模組的結構
 * @param {Object} components - 可用的元件集合
 */
const renderNestedModules = (nestedItems, components) => {
  if (!nestedItems || !Array.isArray(nestedItems)) return null;
  return nestedItems.map((item, index) => {
    const Component = components[item.module] || DefaultComponent;
    return (
      <Component key={index} {...item}>
        {item.nestedItems && renderNestedModules(item.nestedItems, components)}
      </Component>
    );
  });
};

// 預設元件 - 用於處理找不到的模組
const DefaultComponent = ({ module }) => (
  <div className="default-component">
    無法渲染模組 {module}，請確認資料或元件配置是否正確。
  </div>
);

// 內文元件，處理多個段落，支援 HTML 格式的渲染
const Label = ({ text, customClass = "" }) => (
  <div className={`block mx mx-label ${customClass}`}>
    <p>{text}</p>
  </div>
);

// 標題元件
const Heading1 = ({ id, text, customClass = "", nestedItems }) => (
  <>
    <h2 id={id} className={`block title mx mx-heading1 ${customClass}`}>{text}</h2>
    <hr />
    {nestedItems && renderNestedModules(nestedItems, exportedComponents)}
  </>
);

const Heading2 = ({ id, text, customClass = "", nestedItems }) => (
  <div className={`block mx mx-heading2 ${customClass}`}>
    <h3 id={id}>{text}</h3>
    {nestedItems && renderNestedModules(nestedItems, exportedComponents)}
  </div>
);

const List = ({ ordered, textList, customClass = "", nestedItems }) => {
  const ListTag = ordered ? "ol" : "ul";
  return (
    <div className={`block mx mx-list ${customClass}`}>
      <ListTag>
        {textList.map((text, index) => (
          <li key={index} dangerouslySetInnerHTML={{ __html: text }} />
        ))}
      </ListTag>
      {nestedItems && renderNestedModules(nestedItems, exportedComponents)}
    </div>
  );
};

// 內文元件
const Text = ({ textList, customClass = "", nestedItems }) => (
  <div className={`block mx mx-text ${customClass}`}>
    {textList.map((text, index) => (
      <p key={index} dangerouslySetInnerHTML={{ __html: text }} />
    ))}
    {nestedItems && renderNestedModules(nestedItems, exportedComponents)}
  </div>
);

const Image = ({
  src,
  alt = "",
  caption = "",
  link = "",
  linkText = "",
  customClass = "",
  nestedItems,
}) => (
  <div className={`block mx mx-image ${customClass}`}>
    <img src={src} alt={alt} />
    {caption && <figcaption className="text-center mt-2">{caption}</figcaption>}
    {link && (
      <a href={link} target="_blank" rel="noopener noreferrer">
        {linkText || "More Info"}
      </a>
    )}
    {nestedItems && renderNestedModules(nestedItems, exportedComponents)}
  </div>
);

// 圖片元件，處理多張圖片並包含可選的說明和連結
const Images = ({ align = "center" ,srcList, customClass = "", nestedItems }) => {
  const baseUrl = import.meta.env.BASE_URL; // 從環境變數獲取 baseUrl

  const alignClass = `align-items-${align}`;

  return (
    <Swiper
      className={`block mx mx-images ${customClass}`}
      cssMode={true}
      navigation={true}
      spaceBetween={20}
      centeredSlides={false}
      pagination={{
        clickable: true,
      }}
      mousewheel={true}
      keyboard={true}
      breakpoints={{
        640: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      }}
      modules={[Navigation, Pagination]}
    >
      {srcList.map((image, index) => (
        <SwiperSlide key={index} className={`swiper-wrapper mx mx-images-item d-flex ${alignClass}`}>
          <img src={`${image.src}`} alt={image.alt} />
          {image.caption && <figcaption>{image.caption}</figcaption>}
          {image.link && (
            <a href={image.link} className="link" target="_blank" rel="noopener noreferrer">
              {image.linkText}
            </a>
          )}
        </SwiperSlide>
      ))}
      {nestedItems && renderNestedModules(nestedItems, exportedComponents)}
    </Swiper>
  );
};

// 表格元件
const Table = ({ columns, rows, customClass = "", nestedItems }) => (
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
    {nestedItems && renderNestedModules(nestedItems, exportedComponents)}
  </div>
);

const Embed = ({ content, customClass = "", nestedItems }) => (
  <div
    className={`block mx mx-embed ${customClass}`}
    dangerouslySetInnerHTML={{ __html: content }}
  >
    {nestedItems && renderNestedModules(nestedItems, exportedComponents)}
  </div>
);

const Columns = ({ breakpoints, customClass = "", nestedItems }) => {
  // 將每個斷點的列數設定轉換為 Bootstrap 的類別
  const breakpointClasses = Object.entries(breakpoints)
    .map(([breakpoint, columns]) => `col-${breakpoint}-${columns}`)
    .join(" ");

  return (
    <div className={`block row row-gap-4 ${customClass}`}>
      {nestedItems &&
        nestedItems.map((item, index) => (
          <div className={`d-flex justify-content-center align-items-center col-12 ${breakpointClasses}`} key={index}>
            {renderNestedModules([item], exportedComponents)}
          </div>
        ))}
    </div>
  );
};

// 匯出所有元件，方便在 renderNestedModules 中使用
const exportedComponents = {
  Heading1,
  Heading2,
  List,
  Text,
  Image,
  Images,
  Table,
  Label,
  Embed,
  Columns,
};

export { Heading1, Heading2, List, Text, Image, Images, Table, Label, Embed, Columns };