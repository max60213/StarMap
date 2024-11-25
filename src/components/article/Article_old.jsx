import React, { useEffect, useState, Suspense, useTransition } from 'react';
import { useParams } from 'react-router-dom';
import Aside from './Aside';
import './css/article.css';
import ToggleAdvance from './ToggleAdvance';

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

  /**
   * 動態載入元件的函數
   * @param {Object} data - 包含元件設定的文章資料
   * @returns {Object} 載入完成的元件集合
   */
  const loadComponents = async (data) => {
    const loadedComponents = {};
    await Promise.all(
      Object.entries(data.components).map(async ([key, componentConfig]) => {
        try {
          const moduleExports = await import(/* @vite-ignore */ `${componentConfig.path}`);
          componentConfig.modules.forEach((module) => {
            if (moduleExports[module]) {
              loadedComponents[module] = moduleExports[module];
            } else {
              console.error(`元件 ${module} 在 ${componentConfig.path} 中未找到`);
            }
          });
        } catch (error) {
          console.error(`從 ${componentConfig.path} 載入元件失敗:`, error);
        }
      })
    );
    return loadedComponents;
  };

  // 在元件掛載時載入文章資料
  useEffect(() => {
    fetch(`${baseUrl}/articles/${articleId}/${articleId}.json`)
      .then((response) => response.json())
      .then(async (data) => {
        setArticleData(data);
        const loadedComponents = await loadComponents(data);
        setComponents(loadedComponents);
        setIsLoading(false);

        // 使用 startTransition 處理轉場
        startTransition(() => {
          // 此處可放置需要延遲執行的副作用
        });
      })
      .catch((error) => {
        console.error('載入文章時發生錯誤:', error);
        setIsLoading(false);
      });
  }, [articleId, baseUrl]);

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
      if (item.modules) {
        return (
          <Component {...item} key={index}>
            {renderContent(item.modules)} {/* 遞迴渲染內部模組 */}
            {console.log(item)}
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