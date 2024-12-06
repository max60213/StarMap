import React, { useEffect, useState, Suspense, useTransition } from "react";
import { useParams } from "react-router-dom";
import Aside from "./Aside";
import "./css/article.css";
import ToggleAdvance from "./ToggleAdvance";

/**
 * Article 元件 - 負責文章內容的載入與渲染
 * 支援三種層級的內容：初學者、進階和延伸閱讀
 * 並支援模組內包模組的遞迴渲染
 */
function Article() {
  const { articleId } = useParams();
  const [articleData, setArticleData] = useState(null);
  const [modules, setModules] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // 預定義可用的模組
  const modulesPaths = {
    basic: () => import('./modules/basic'),
    // 未來可以在這裡添加更多模組
    // advanced: () => import('./modules/advanced'),
    // interactive: () => import('./modules/interactive'),
  };

  /**
   * 動態載入模組的函數
   * @param {Object} data - 包含模組設定的文章資料
   * @returns {Object} 載入完成的模組集合
   */
  const loadModules = async (data) => {
    const loadedModules = {};

    try {
      // 從文章數據中獲取所需的模組列表
      const neededModules = new Set();
      Object.values(data.components).forEach(config => {
        // 假設每個元件配置都有一個 module 屬性指定它屬於哪個模組
        neededModules.add(config.moduleType || 'basic'); // 預設使用 basic 模組
      });

      // 載入所需的模組
      await Promise.all(
        Array.from(neededModules).map(async (moduleName) => {
          if (modulesPaths[moduleName]) {
            const moduleExport = await modulesPaths[moduleName]();
            loadedModules[moduleName] = moduleExport;
          } else {
            console.error(`找不到模組: ${moduleName}`);
          }
        })
      );
    } catch (error) {
      console.error('載入模組時發生錯誤:', error);
    }

    return loadedModules;
  };

  // 在元件掛載時載入文章資料
  useEffect(() => {
    fetch(`/articles/${articleId}/${articleId}.json`)
      .then((response) => response.json())
      .then(async (data) => {
        setArticleData(data);
        const loadedModules = await loadModules(data);
        setModules(loadedModules);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("載入文章時發生錯誤:", error);
        setIsLoading(false);
      });
  }, [articleId]);

  /**
   * 渲染內容區塊的輔助函數
   * @param {Array} contentArray - 要渲染的內容陣列
   * @returns {Array|null} 渲染後的 React 元素陣列或 null
   */
  const renderContent = (contentArray) => {
    if (!contentArray) return null;

    return contentArray.map((item, index) => {
      const Component = components[item.module] || DefaultComponent;

      // 檢查是否有內嵌模組，進行遞迴渲染
      if (item.nestedItems) {
        return (
          <Component {...item} key={index}>
            {renderContent(item.nestedItems)} {/* 遞迴渲染內部模組 */}
          </Component>
        );
      }

      // 無內嵌模組則直接渲染
      return <Component {...item} key={index} />;
    });
  };

  // 預設元件 - 用於處理找不到的模組
  const DefaultComponent = ({ module }) => (
    <div className="default-component">
      無法渲染模組 {module}，請確認資料或元件配置是否正確。
    </div>
  );

  return (
    <div className="mx-article">
      <main className="col-9">
        {isLoading ? (
          <div>載入中...</div>
        ) : (
          <Suspense fallback={<div>正在載入內容...</div>}>
            {/* 初學者內容區塊 */}
            <section className="mx-section beginner">
              {renderContent(articleData?.content.beginner)}
            </section>

            {/* 進階內容區塊 */}
            <ToggleAdvance target="advance" />
            <section className="mx-section advance" id="advance">
              <div className="advance-container">
                {renderContent(articleData?.content.advance)}
              </div>
            </section>

            {/* 延伸閱讀區塊 */}
            <section className="mx-section learnMore">
              {renderContent(articleData?.content.learnMore)}
            </section>
          </Suspense>
        )}
      </main>
      {/* 側邊欄只在主要內容載入完成後顯示 */}
      {!isPending && <Aside className="col-3" />}
    </div>
  );
}

export default Article;