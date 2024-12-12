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
  const { articleId } = useParams(); // 從 URL 參數取得文章 ID
  const [articleData, setArticleData] = useState(null); // 儲存文章資料的狀態
  const [components, setComponents] = useState({}); // 儲存動態載入的元件
  const [isLoading, setIsLoading] = useState(true); // 載入狀態管理
  const [isPending, startTransition] = useTransition(); // 管理轉場狀態

  const baseUrl = import.meta.env.BASE_URL; // 基本路徑

  // 預定義所有組件的導入，指向同一個檔案
  const componentsPaths = {
    Text: () => import('./MxBasics.jsx').then(module => ({ default: module.Text })),
    Heading1: () => import('./MxBasics.jsx').then(module => ({ default: module.Heading1 })),
    Heading2: () => import('./MxBasics.jsx').then(module => ({ default: module.Heading2 })),
    Image: () => import('./MxBasics.jsx').then(module => ({ default: module.Image })),
    Images: () => import('./MxBasics.jsx').then(module => ({ default: module.Images })),
    Label: () => import('./MxBasics.jsx').then(module => ({ default: module.Label })),
    List: () => import('./MxBasics.jsx').then(module => ({ default: module.List })),
    Table: () => import('./MxBasics.jsx').then(module => ({ default: module.Table })),
    Embed: () => import('./MxBasics.jsx').then(module => ({ default: module.Embed })),
    Column: () => import('./MxBasics.jsx').then(module => ({ default: module.Column })),
    Row: () => import('./MxBasics.jsx').then(module => ({ default: module.Row })),
  };

  /**
   * 動態載入元件的函數
   * @param {Object} data - 包含元件設定的文章資料
   * @returns {Object} 載入完成的元件集合
   */
  const loadComponents = async (data) => {
    const loadedComponents = {};

    try {
      // 從文章數據中獲取所需的組件列表
      const neededComponents = new Set();
      Object.values(data.components).forEach(config => {
        config.modules.forEach(module => neededComponents.add(module));
      });

      // 載入所需的組件
      await Promise.all(
        Array.from(neededComponents).map(async (moduleName) => {
          if (componentsPaths[moduleName]) {
            const moduleExport = await componentsPaths[moduleName]();
            loadedComponents[moduleName] = moduleExport.default;
          } else {
            console.error(`找不到組件: ${moduleName}`);
          }
        })
      );
    } catch (error) {
      console.error('載入組件時發生錯誤:', error);
    }

    return loadedComponents;
  };

  // 在元件掛載時載入文章資料
  useEffect(() => {
    // 從指定的路徑抓取文章資料檔案 (JSON 格式)
    fetch(`/articles/${articleId}/${articleId}.json`)
      .then((response) => response.json()) // 將回應轉換為 JSON 格式
      .then(async (data) => {
        setArticleData(data); // 將文章資料存入狀態
        const loadedComponents = await loadComponents(data); // 動態載入需要的元件
        setComponents(loadedComponents); // 將載入完成的元件存入狀態
        setIsLoading(false); // 更新載入狀態為完成

        // 使用 startTransition 處理轉場狀態，避免主執行緒被阻塞
        startTransition(() => {
          // 此處可放置需要延遲執行的副作用，如預載入資料等
        });
      })
      .catch((error) => {
        // 在資料載入過程中發生錯誤時，顯示錯誤訊息並結束載入狀態
        console.error("載入文章時發生錯誤:", error);
        setIsLoading(false);
      });
  }, [articleId, baseUrl]); // 當 articleId 或 baseUrl 改變時重新執行該效果

  /**
   * 渲染內容區塊的輔助函數，支援遞迴模組渲染
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