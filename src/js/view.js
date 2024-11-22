export function sliderInit() {
    const video = document.getElementById('view-player');  // 獲取視頻元素
    const slider = document.getElementById('slider');       // 獲取滑桿元素
    const thumb = document.getElementById('slider-thumb');  // 獲取滑桿上的拇指元素
    const state = document.getElementById('slider-thumb-state');  // 獲取用於顯示狀態的元素
    const highlight = document.getElementById('slider-thumb-highlight');  // 獲取用於顯示狀態的元素
    const array = JSON.parse(slider.getAttribute('data-states')); // 從HTML屬性中解析出數組
    const init = slider.getAttribute('data-init');  // 從HTML屬性中獲取初始值

    const totalSteps = array.length - 1;  // 根據數組長度確定總步數
    const stepPixel = (slider.offsetWidth - thumb.offsetWidth) / totalSteps; // 根據總步數計算每步的像素

    // 用於對應每一塊區域的translate值
    const transforms = [
        'translate(0%, 0%)',
        `translate(0%, -${100 / 3}%)`,
        `translate(0%, -${(100 * 2) / 3}%)`,
        'translate(-50%, 0%)',
        `translate(-50%, -${100 / 3}%)`,
        `translate(-50%, -${(100 * 2) / 3}%)`
    ];

    // 初始化函式，根據初始值設定滑塊及影片位置
    console.log("View JS init");
    const initPosition = init * stepPixel; // 根據初始步數計算滑塊的初始位置
    thumb.style.left = initPosition + 'px'; // 設定滑塊的初始位置
    state.innerHTML = array[init]; // 顯示初始狀態
    video.style.transform = transforms[init]; // 根據初始步進設定影片的位移

    // 點擊 slider 以移動 thumb 到點擊位置
    slider.onclick = function (event) {
        let clickPosition = event.clientX - slider.getBoundingClientRect().left;
        let newLeft = Math.round(clickPosition / stepPixel) * stepPixel;

        if (newLeft < 0) {
            newLeft = 0;
        } else if (newLeft > slider.offsetWidth - thumb.offsetWidth) {
            newLeft = slider.offsetWidth - thumb.offsetWidth;
        }

        const currentStep = Math.min(Math.floor(newLeft / stepPixel), totalSteps);
        state.innerHTML = array[currentStep];
        thumb.style.left = newLeft + 'px';
        video.style.transform = transforms[currentStep];
    };

    thumb.onmousedown = function (event) {
        event.preventDefault();
        highlight.style.display = 'none';

        let shiftX = event.clientX - thumb.getBoundingClientRect().left;

        document.onmousemove = function (event) {
            let newLeft = event.clientX - shiftX - slider.getBoundingClientRect().left;
            newLeft = Math.round(newLeft / stepPixel) * stepPixel;

            if (newLeft < 0) {
                newLeft = 0;
            } else if (newLeft > slider.offsetWidth - thumb.offsetWidth) {
                newLeft = slider.offsetWidth - thumb.offsetWidth;
            }

            const currentStep = Math.min(Math.floor(newLeft / stepPixel), totalSteps);
            state.innerHTML = array[currentStep];
            thumb.style.left = newLeft + 'px';
            video.style.transform = transforms[currentStep];
        };

        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
        };
    };

    thumb.ondragstart = function () {
        return false;
    };

    console.log("View JS initialized");
}