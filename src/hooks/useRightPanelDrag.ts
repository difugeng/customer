// 右侧面板拖拽钩子
// 用于管理右侧面板的宽度和拖拽调整功能

import { useState, useCallback } from 'react';
import { RIGHT_PANEL_CONFIG } from '../constants';

/**
 * 右侧面板拖拽调整自定义钩子
 * @returns 包含右侧面板宽度、宽度设置函数和鼠标按下事件处理函数的对象
 */
export const useRightPanelDrag = () => {
  // 右侧面板宽度状态，初始值为默认宽度
  const [rightPanelWidth, setRightPanelWidth] = useState<number>(RIGHT_PANEL_CONFIG.DEFAULT_WIDTH);

  /**
   * 鼠标按下事件处理函数，用于开始拖拽调整宽度
   * @param e 鼠标事件对象
   */
  const handleMouseDown = useCallback((e: MouseEvent) => {
    e.preventDefault();
    
    // 记录初始鼠标位置和面板宽度
    const startX = e.clientX;
    const startWidth = rightPanelWidth;
    
    /**
     * 鼠标移动事件处理函数，用于调整面板宽度
     * @param moveEvent 鼠标移动事件对象
     */
    const handleMouseMove = (moveEvent: MouseEvent) => {
      // 计算鼠标移动距离，调整面板宽度
      const diff = moveEvent.clientX - startX;
      const newWidth = startWidth - diff;
      
      // 确保宽度在允许的范围内
      if (newWidth >= RIGHT_PANEL_CONFIG.MIN_WIDTH && newWidth <= RIGHT_PANEL_CONFIG.MAX_WIDTH) {
        setRightPanelWidth(newWidth);
      }
    };
    
    /**
     * 鼠标释放事件处理函数，用于结束拖拽
     */
    const handleMouseUp = () => {
      // 移除鼠标移动和释放事件监听器
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    // 添加鼠标移动和释放事件监听器
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [rightPanelWidth]);

  // 返回右侧面板宽度、宽度设置函数和鼠标按下事件处理函数
  return {
    rightPanelWidth,
    setRightPanelWidth,
    handleMouseDown
  };
};
