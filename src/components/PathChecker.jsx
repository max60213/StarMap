// PathChecker.jsx
import { useLocation } from 'react-router-dom';

export const useIsHome = () => {
    const location = useLocation();
    return location.pathname === '/' || location.pathname === '';
}

export const currentPath = () => {
    const location = useLocation();
    return location.pathname.replace(/^\//, '');
}