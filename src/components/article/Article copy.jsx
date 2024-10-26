import React, { useEffect, useState, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import Aside from './Aside';
import './css/article.css';

function Article() {
  const { articleId } = useParams(); // 從 URL 中取得 articleId
  const [articleData, setArticleData] = useState(null); // 儲存文章的 JSON 數據
  const [components, setComponents] = useState({}); // 儲存已加載的組件
  const [isLoading, setIsLoading] = useState(true);
  const baseUrl = import.meta.env.BASE_URL; // 獲取 baseUrl

  // 動態加載組件的函數
  const loadComponents = async (data) => {
    const loadedComponents = {};
    // 循環遍歷所有組件配置
    for (const key in data.components) {
      const componentConfig = data.components[key];

      try {
        const moduleExports = await import(`${componentConfig.path}`);
        console.log('Loaded module:', moduleExports);

        componentConfig.modules.forEach((module) => {
          if (moduleExports[module]) {
            loadedComponents[module] = moduleExports[module];
          } else {
            console.error(`Component ${module} not found in ${componentConfig.path}`);
          }
        });
      } catch (error) {
        console.error(`Failed to load component from ${componentConfig.path}:`, error);
      }
    }

    return loadedComponents;
  };

  useEffect(() => {
    // 使用 baseUrl 動態加載 JSON 文件
    fetch(`${baseUrl}/articles/${articleId}.json`)  // 如果 JSON 文件放在 public 文件夾中
      .then(response => response.json())
      .then(async data => {
        setArticleData(data);

        // 動態加載所需的組件
        const loadedComponents = await loadComponents(data);
        setComponents(loadedComponents);
        console.log("ArticleData:", articleData);

        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error loading article:', error);
        setIsLoading(false);
      });
  }, [articleId, baseUrl]);

  return (
    <div className="mx-article">
      <main className="col-9">
        {articleData && articleData.content.map((item, index) => {
          const Component = components[item.module]; // 獲取相應的組件

          if (!Component) {
            return <div key={index}>Component {item.module} not found</div>;
          }

          // 使用動態加載的組件來渲染內容
          return (
            <Suspense fallback={<div>Loading component...</div>} key={index}>
              <Component {...item} />
            </Suspense>
          );
        })}
      </main>
      <Aside className="col-3" />
    </div>
  );
};

export default Article;