document.addEventListener("DOMContentLoaded", () => {
    colorMode();
});

function colorMode() {
    const colorMode = document.querySelector('#color-mode');
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    function setColorMode(isDark) {
        colorMode.setAttribute('data-bs-theme', isDark ? 'dark' : 'dark');
    }

    const handleChange = ({ matches }) => {
        setColorMode(matches);
    };

    // 設置初始色彩模式
    setColorMode(darkModeMediaQuery.matches);

    // 添加事件監聽器
    darkModeMediaQuery.addEventListener('change', handleChange);

    // 提供清理方法
    return () => {
        darkModeMediaQuery.removeEventListener('change', handleChange);
    };
}