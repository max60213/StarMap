// PathChecker.jsx
import { useLocation } from 'react-router-dom';

function useIsHome() {
    const location = useLocation();
    // 檢查路徑是否為 "/" 或空字符串 ""
    return location.pathname === '/' || location.pathname === '' || location.pathname === '/home' || location.pathname === '/home/' || location.pathname === '/starmap' || location.pathname === '/starmap/';
}

function currentPath() {    
    const location = useLocation();
    return location.pathname;
}

export default useIsHome;
export { currentPath };