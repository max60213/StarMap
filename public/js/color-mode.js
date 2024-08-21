document.addEventListener("DOMContentLoaded", () => {
    colorMode();
});

function colorMode() {
    const colorMode = document.querySelector('#color-mode');
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // 設置初始色彩模式
    setColorMode(darkModeMediaQuery.matches);

    // 監聽色彩模式變化
    darkModeMediaQuery.addEventListener('change', ({ matches }) => {
        setColorMode(matches);
    });

    // 輔助函數來設置色彩模式
    function setColorMode(isDark) {
        colorMode.setAttribute('data-bs-theme', isDark ? 'dark' : 'dark');
    }
}