import "./css/mxBasics.css";
import React, { useState } from "react";
import { Navigation, Pagination, FreeMode } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { createPortal } from 'react-dom';

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

// ImageViewer 組件（新增）
const ImageViewer = ({ media, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  // 找到 main 元素作為 portal 的目標
  const mainElement = document.querySelector('main');

  if (!media || !mainElement) return null;

  return createPortal(
    <div className={`mx-image-viewer ${isVisible ? 'visible' : ''}`}>
      <div className="overlay" onClick={handleClose}>
        <div className="content" onClick={e => e.stopPropagation()}>
          {media.src.endsWith('.mp4') ? (
            <video src={media.src} controls autoPlay />
          ) : (
            <img src={media.src} alt={media.alt} />
          )}
          <button className='mx_btn close-btn' onClick={handleClose}>
            <img src={`./close.svg`} alt="" />
          </button>
        </div>
      </div>
    </div>,
    mainElement // Portal 的目標元素
  );
};

// Image 組件
const Image = ({
  src,
  alt = "",
  caption = "",
  link = "",
  linkText = "",
  customClass = "",
  nestedItems
}) => {
  const [selectedMedia, setSelectedMedia] = useState(null);

  const getThumbPath = (imagePath) => {
    const lastDotIndex = imagePath.lastIndexOf('.');
    if (lastDotIndex === -1) return `${imagePath}_thumb`;
    return `${imagePath.substring(0, lastDotIndex)}_thumb${imagePath.substring(lastDotIndex)}`;
  };

  return (
    <>
      <div className={`block mx mx-image ${customClass}`}>
        <img
          src={getThumbPath(src)}
          alt={alt}
          onClick={() => setSelectedMedia({ src, alt })}
        />
        {caption && <figcaption>{caption}</figcaption>}
        {linkText && (
          link ? (
            <a
              href={link}
              className="link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {linkText}
            </a>
          ) : (
            <span className="link">{linkText}</span>
          )
        )}
        {nestedItems && renderNestedModules(nestedItems, exportedComponents)}
      </div>

      {selectedMedia && (
        <ImageViewer
          media={selectedMedia}
          onClose={() => setSelectedMedia(null)}
        />
      )}
    </>
  );
};

// Images 組件
const Images = ({ align = "center", srcList, customClass = "", nestedItems }) => {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const alignClass = `align-items-${align}`;

  const getThumbPath = (imagePath) => {
    const lastDotIndex = imagePath.lastIndexOf('.');
    if (lastDotIndex === -1) return `${imagePath}_thumb`;
    return `${imagePath.substring(0, lastDotIndex)}_thumb${imagePath.substring(lastDotIndex)}`;
  };

  return (
    <>
      <Swiper
        className={`block mx mx-images ${customClass}`}
        navigation={true}
        spaceBetween={20}
        centeredSlides={false}
        pagination={{
          clickable: true,
        }}
        cssMode={true}
        mousewheel={true}
        keyboard={true}
        freeMode={true}
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
        modules={[Navigation, Pagination, FreeMode]}
      >
        {srcList.map((media, index) => {
          const isVideo = media.src.endsWith(".mp4") || media.src.endsWith(".webm");
          return (
            <SwiperSlide
              key={index}
              className={`swiper-wrapper mx mx-images-item d-flex align-content-start ${alignClass}`}
            >
              {isVideo ? (
                <video
                  src={media.src}
                  onClick={() =>
                    setSelectedMedia({
                      src: media.src,
                      alt: media.alt,
                    })
                  }
                  controls
                  preload="metadata"
                />
              ) : (
                <img
                  src={getThumbPath(media.src)}
                  alt={media.alt}
                  onClick={() =>
                    setSelectedMedia({
                      src: media.src,
                      alt: media.alt,
                    })
                  }
                />
              )}
              {media.caption && <figcaption>{media.caption}</figcaption>}
              {media.linkText && (
                media.link ? (
                  <a
                    href={media.link}
                    className="link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {media.linkText}
                  </a>
                ) : (
                  <span className="link">{media.linkText}</span>
                )
              )}
            </SwiperSlide>
          );
        })}
        {nestedItems && renderNestedModules(nestedItems, exportedComponents)}
      </Swiper>

      {selectedMedia && (
        <ImageViewer
          media={selectedMedia}
          onClose={() => setSelectedMedia(null)}
        />
      )}
    </>
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

const Column = ({ breakpoints, gap = 4, customClass = "", nestedItems }) => {
  // 將每個斷點的列數設定轉換為 Bootstrap 的類別
  const breakpointClasses = Object.entries(breakpoints)
    .map(([breakpoint, columns]) => `col-${breakpoint}-${columns}`)
    .join(" ");

  // 將 gap 轉換為 Bootstrap 的類別
  const gapClass = gap ? `row-gap-${gap}` : "";

  return (
    <div className={`block row ${gapClass} ${customClass}`}>
      {nestedItems &&
        nestedItems.map((item, index) => (
          <div className={`d-flex justify-content-center align-items-center col-12 ${breakpointClasses}`} key={index}>
            {renderNestedModules([item], exportedComponents)}
          </div>
        ))}
    </div>
  );
};

const Row = ({ customClass = "", gap = 4, nestedItems }) => {
  // 將 gap 轉換為 Bootstrap 的類別
  const gapClass = gap ? `g-${gap}` : "";

  return (
    <div className={`flex-column ${gapClass} ${customClass}`}>
      {nestedItems &&
        nestedItems.map((item, index) => (
          <div
            className="d-flex"
            key={index}
          >
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
  Column,
  Row
};

export { Heading1, Heading2, List, Text, Image, Images, Table, Label, Embed, Column, Row };