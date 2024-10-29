import React, { useEffect, useState, Suspense, useTransition } from 'react';
import { useParams } from 'react-router-dom';
import Aside from './Aside';
import './css/article.css';
function Article() {
  const { articleId } = useParams();
  const [articleData, setArticleData] = useState(null);
  const [components, setComponents] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const baseUrl = import.meta.env.BASE_URL;

  const loadComponents = async (data) => {
    const loadedComponents = {};
    for (const key in data.components) {
      const componentConfig = data.components[key];
      try {
        const moduleExports = await import(/* @vite-ignore */ `${componentConfig.path}`);
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
    fetch(`${baseUrl}/articles/${articleId}.json`)
      .then(response => response.json())
      .then(async data => {
        setArticleData(data);
        const loadedComponents = await loadComponents(data);
        setComponents(loadedComponents);
        setIsLoading(false);
        // 使用 startTransition 來延遲顯示 Aside
        startTransition(() => {
          // 確保所有組件都已加載完成後再顯示 Aside
          Promise.all(
            data.content.map(async (item) => {
              if (loadedComponents[item.module]) {
                // 等待組件加載完成
                await new Promise(resolve => setTimeout(resolve, 0));
              }
            })
          )
        });
      })
      .catch(error => {
        console.error('Error loading article:', error);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="mx-article">
      <main className="col-9">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          articleData?.content.map((item, index) => {
            const Component = components[item.module];
            if (!Component) {
              return <div key={index}>Component {item.module} not found</div>;
            }
            return (
              <Suspense fallback={<div>Loading component...</div>} key={index}>
                <Component {...item} />
              </Suspense>
            );
          })
        )}
      </main>
      {!isPending && <Aside className="col-3" />}
    </div>
  );
}

export default Article; 