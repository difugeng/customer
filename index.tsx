
// 应用入口文件
// 负责将React应用挂载到HTML页面的root元素上

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // 导入主应用组件

// 获取页面中的root元素
const rootElement = document.getElementById('root');

// 确保root元素存在，否则抛出错误
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// 创建React根实例
const root = ReactDOM.createRoot(rootElement);

// 渲染应用
root.render(
  <React.StrictMode>
    {/* 渲染主应用组件 */}
    <App />
  </React.StrictMode>
);
