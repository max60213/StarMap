import React, { useEffect, useState } from 'react';
import Aside from '../components/Aside'

function Aperture() {
    // 創建一個狀態變量來存儲標題
    const [titles, setTitles] = useState([]);

    useEffect(() => {
        // 在組件加載後執行
        const titleElements = document.querySelectorAll('.title');  // 獲取所有的 .title 元素
        const titleTexts = Array.from(titleElements).map(elem => elem.textContent);  // 提取文本內容
        setTitles(titleTexts);  // 更新狀態
    }, []);  // 空依賴數組表示這個 effect 只在組件首次渲染時執行

    return (
        <div className="container mt-5">
            <div className="row">
                <main className="col-12 col-md-9 col-xl-10">
                    <div
                        data-bs-spy="scroll"
                        data-bs-target="#navbar"
                        data-bs-smooth-scroll="true"
                        className="scrollspy-example-2 section container"
                        tabIndex={0}
                    >
                        <h2 className="title" id="感光元件的種類">光圈的作用</h2>
                        <div className="content">
                            <p>
                                感光元件相當於人眼的視網膜，吸收光線，並轉換成數位訊號輸入機器。
                            </p>
                            <p>
                                一般來說，上面有RGB( 紅綠藍
                                )三種顏色的陣列，這種排列方式叫「拜耳濾色鏡」( Bayer filter
                                )，其中綠色的面積是紅、藍的兩倍( 所以也會說是RGGB感光元件
                                )，這也是模擬人眼視覺細胞的顏色、比例
                                ，記錄這三種顏色的訊息後再經過一堆神秘複雜我也不太懂的算法後，Boom!
                                彩色的影像就出來了。
                            </p>
                        </div>
                        <div className="row row-gap-4 justify-content-around">
                            <div className="col-10 col-sm-6 col-md-3">
                                <div className="row  justify-content-center position-relative">
                                    <div className="img-container">
                                        <img
                                            className="mb-3 img-focusable"
                                            src="/img/sensor/Bayer_matrix.png"
                                            alt=""
                                        />
                                    </div>
                                    <p className="text-center">​常見的RGGB陣列</p>
                                    <a
                                        className="text-center link link-secondary"
                                        href="https://wikiwand.com/zh-tw/布萊斯·拜爾"
                                    >
                                        wikiwand.com/zh-tw/布萊斯·拜爾
                                    </a>
                                </div>
                            </div>
                            <div className="col-10 col-sm-6 col-md-3">
                                <div className="row justify-content-center position-relative">
                                    <div className="img-container">
                                        <img
                                            className="mb-3 img-focusable"
                                            src="/img/sensor/RYYB_sensor.png"
                                            alt=""
                                        />
                                    </div>
                                    <p className="text-center">​常見的RGGB陣列</p>
                                    <a
                                        className="text-center link link-secondary"
                                        href="https://wikiwand.com/zh-tw/布萊斯·拜爾"
                                    >
                                        wikiwand.com/zh-tw/布萊斯·拜爾
                                    </a>
                                </div>
                            </div>
                            <div className="col-10 col-sm-6 col-md-3">
                                <div className="row justify-content-center position-relative">
                                    <div className="img-container">
                                        <img
                                            className="mb-3 img-focusable"
                                            src="/img/sensor/Xtranscolourfilter.png"
                                            alt=""
                                        />
                                    </div>
                                    <p className="text-center">​常見的RGGB陣列</p>
                                    <a
                                        className="text-center link link-secondary"
                                        href="https://wikiwand.com/zh-tw/布萊斯·拜爾"
                                    >
                                        wikiwand.com/zh-tw/布萊斯·拜爾
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="section container">
                        <h2 className="title" id="對畫質的影響">對畫質的影響</h2>
                        <p>
                            感光元件的尺寸( 每個像素的面積
                            )與品質將大大的影響畫質。尺寸越大，理論上雜點也會越少(
                            在夜間、室內等較暗處會更明顯
                            )，但也要它的看品質，有品質好小尺寸的感光元件( 高階手機
                            )，也有大尺寸但品質較差的感光元件( 低階攝錄影機
                            )。現在的手機靠著演算法，和一堆超屌的技術，甚至可以拍出超越單眼的畫質。
                        </p>
                    </div>
                </main>
                <Aside titles={titles}></Aside>
            </div>
        </div>
    )
}

export default Aperture