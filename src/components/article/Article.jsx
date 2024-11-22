import React, { useEffect, useState, Suspense, useTransition } from 'react';
import { useParams } from 'react-router-dom';
import Aside from './Aside';
import './css/article.css';
import ToggleAdvance from './ToggleAdvance';

/**
 * Article 元件 - 負責文章內容的載入與渲染
 * 支援三種層級的內容：初學者、進階和延伸閱讀
 */
function Article() {
  // 從 URL 參數取得文章 ID
  const { articleId } = useParams();
  // 儲存文章資料的狀態
  const [articleData, setArticleData] = useState(null);
  // 儲存動態載入的元件
  const [components, setComponents] = useState({});
  // 載入狀態管理
  const [isLoading, setIsLoading] = useState(true);
  // 用於延遲渲染 Aside 的轉場狀態
  const [isPending, startTransition] = useTransition();

  const baseUrl = import.meta.env.BASE_URL;

  /**
   * 動態載入元件的函數
   * @param {Object} data - 包含元件設定的文章資料
   * @returns {Object} 載入完成的元件集合
   */
  const loadComponents = async (data) => {
    const loadedComponents = {};
    for (const key in data.components) {
      const componentConfig = data.components[key];
      try {
        // 動態引入元件
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
    }
    return loadedComponents;
  };

  // 在元件掛載時載入文章資料
  useEffect(() => {
    fetch(`${baseUrl}/articles/${articleId}/${articleId}.json`)
      .then(response => response.json())
      .then(async data => {
        setArticleData(data);
        const loadedComponents = await loadComponents(data);
        setComponents(loadedComponents);
        setIsLoading(false);

        // 使用 startTransition 來延遲顯示 Aside
        startTransition(() => {
          // 將所有區塊的內容合併為一個陣列，用於檢查載入狀態
          const allContent = [
            ...(data.content.beginner || []),
            ...(data.content.advance || []),
            ...(data.content.learnMore || [])
          ];

          // 確保所有元件都已完成載入
          Promise.all(
            allContent.map(async (item) => {
              if (loadedComponents[item.module]) {
                await new Promise(resolve => setTimeout(resolve, 0));
              }
            })
          );
        });
      })
      .catch(error => {
        console.error('載入文章時發生錯誤:', error);
        setIsLoading(false);
      });
  }, []);

  /**
   * 渲染內容區塊的輔助函數
   * @param {Array} contentArray - 要渲染的內容陣列
   * @returns {Array|null} 渲染後的 React 元素陣列或 null
   */
  const renderContent = (contentArray) => {
    if (!contentArray) return null;

    return contentArray.map((item, index) => {
      const Component = components[item.module];
      if (!Component) {
        return <div key={index}>找不到元件 {item.module}</div>;
      }
      return (
        <Suspense fallback={<div>正在載入元件...</div>} key={index}>
          <Component {...item} />
        </Suspense>
      );
    });
  };

  return (
    <div className="mx-article">
      <main className="col-9">
        {isLoading ? (
          <div>載入中...</div>
        ) : (
          <>
            {/* 初學者內容區塊 */}
            <section className="mx-section beginner">
              {renderContent(articleData?.content.beginner)}
            </section>

            {/* 進階內容區塊 */}
            <ToggleAdvance target="advance" />

            <section className="mx-section advance" id='advance'>
              <div className="advance-container">
                {renderContent(articleData?.content.advance)}
              </div>
            </section>


            {/* 延伸閱讀區塊 */}
            <section className="mx-section learnMore">
              {renderContent(articleData?.content.learnMore)}
            </section>
          </>
        )}
      </main>
      {/* 側邊欄只在主要內容載入完成後顯示 */}
      {!isPending && <Aside className="col-3" />}
    </div>
  );
}

export default Article;