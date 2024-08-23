let list_items;
let visual = document.getElementById('visual');

list_items = document.querySelectorAll('.mx-list-item');
list_items.forEach(item => {
    let timer; // 用來儲存 setTimeout 的返回值

    item.addEventListener('mouseover', function () {
        let onHover = document.querySelector('.mx-list-item.hover');
        if (onHover) {
            onHover.classList.remove('hover');
        }
        // 設置延遲 0.5 秒後執行
        timer = setTimeout(() => {
            window.selector(item.id); // 假設 selector 是你想要執行的函數
            console.log(item.id);
        }, 100);
    });

    item.addEventListener('mouseout', function () {
        // 如果鼠標離開，取消未執行的 setTimeout
        clearTimeout(timer);
        window.selector(null);
    });

    item.addEventListener('click', function () {
        console.log(item);
        window.selector(item);
        document.querySelector('.mx-list').classList.add('fade-out');
        visual.classList.add('shrink');
    });
});