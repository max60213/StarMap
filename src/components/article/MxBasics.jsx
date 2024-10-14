import "./css/mxBasics.css";
// import Swiper core and required modules
import { Navigation, Pagination} from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';


// 標題元件
const Title = ({ id, text }) => <h3 id={id} className="block title mx-title">{text}</h3>;
const small = 600;
const medium = 1200;


// 內文元件，處理多個段落
const Paragraphs = ({ textList }) => (
  <div className="block mx-paragraphs">
    {textList.map((text, index) => (
      <p key={index}>{text}</p>
    ))}
  </div>
);

// 圖片元件，處理多張圖片並包含可選的說明和連結
const Images = ({ srcList }) => {
  const baseUrl = import.meta.env.BASE_URL; // 從環境變數獲取 baseUrl

  return (
    <Swiper
      className="block mx-images"
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
        <SwiperSlide key={index} className="swiper-wrapper mx-images-item d-flex align-items-center">
          {/* 僅渲染圖片，無論是否有 link */}
          <img src={`${baseUrl}${image.src}`} alt={image.alt} />

          {/* 渲染 caption （如果有） */}
          {image.caption && <figcaption>{image.caption}</figcaption>}

          {/* 如果有 link，則顯示連結 */}
          {image.link && (
            <a href={image.link} className="link-secondary" target="_blank" rel="noopener noreferrer">
              {image.linkText}
            </a>
          )}
        </SwiperSlide>
      ))}

    </Swiper>
  );
};

export { Title, Paragraphs, Images };