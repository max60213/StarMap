import { createContext, useContext, useState, useEffect } from 'react';

// 創建一個 context，預設值可以根據實際需要設置
const GalaxyContext = createContext();

// 自訂 hook 用於在組件中方便使用該 context
export const useGalaxy = () => useContext(GalaxyContext);

// 提供者組件，管理 galaxy 和 itemReady 的狀態，並通過 context 提供給所有子組件
export const GalaxyProvider = ({ children }) => {
  const [galaxy, setGalaxy] = useState(null);
  const [itemReady, setItemReady] = useState(false);
  useEffect(() => {
    console.log("GalaxyProvider: galaxy has been set", galaxy);
  }, [galaxy]);

  useEffect(() => {
    console.log("GalaxyProvider: itemReady has been set", itemReady);
  }, [itemReady]);

  return (
    <GalaxyContext.Provider value={{ galaxy, setGalaxy, itemReady, setItemReady }}>
      {children}
    </GalaxyContext.Provider>
  );
};

export default GalaxyContext;