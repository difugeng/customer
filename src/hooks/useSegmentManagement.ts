// 客群管理自定义钩子
// 用于管理客群的对比、删除、选择和保存等操作
// 
// 功能说明：
// - 保存的客群列表管理
// - 客群对比功能（支持多客群对比）
// - 客群删除功能
// - 客群选择和查看功能
// - 客群保存功能（保存新客群）
// - 保存客群模态框状态管理
// 
// 使用场景：
// - 用户需要对比多个客群的指标差异
// - 用户需要删除不再需要的客群
// - 用户需要查看特定客群的详细信息
// - 用户需要将查询结果保存为新客群

import React, { useState, useEffect } from 'react';
import { SavedSegment, ChatMessage, MessageType } from '../../types';
import { apiService } from '../../api';

/**
 * 客群管理自定义钩子
 * 
 * @param setMessages 更新消息列表的函数（可选）
 *                   用于在客群操作时向聊天界面添加消息
 * 
 * @returns 客群管理相关的状态和函数
 *          - savedSegments: 保存的客群列表
 *          - setSavedSegments: 更新客群列表的函数
 *          - showSaveSegmentModal: 是否显示保存客群模态框
 *          - setShowSaveSegmentModal: 控制模态框显示/隐藏
 *          - newSegmentName: 新客群名称
 *          - setNewSegmentName: 更新新客群名称
 *          - currentQueryDSL: 当前查询的DSL（领域特定语言）
 *          - setCurrentQueryDSL: 更新当前查询DSL
 *          - handleCompareSegments: 对比客群的处理函数
 *          - handleDeleteSegment: 删除客群的处理函数
 *          - handleSelectSegment: 选择客群的处理函数
 *          - handleSaveSegment: 保存客群的处理函数
 */
export const useSegmentManagement = (setMessages?: React.Dispatch<React.SetStateAction<ChatMessage[]>>) => {
  // ==================== 状态定义 ====================
  
  // 保存的客群列表
  // 存储用户保存的所有客群信息，包括客群ID、名称、客户数量、DSL等
  const [savedSegments, setSavedSegments] = useState<SavedSegment[]>([]);

  // 初始化客群数据
  useEffect(() => {
    const initializeSegments = async () => {
      try {
        const initialSegments = await apiService.getSavedSegments();
        setSavedSegments(initialSegments);
      } catch (error) {
        console.error('初始化客群数据失败:', error);
      }
    };
    initializeSegments();
  }, []);
  
  // 是否显示保存客群模态框
  // 控制保存客群弹窗的显示状态
  const [showSaveSegmentModal, setShowSaveSegmentModal] = useState(false);
  
  // 新客群名称
  // 用户在保存客群时输入的客群名称
  const [newSegmentName, setNewSegmentName] = useState('');
  
  // 当前查询的DSL（领域特定语言）
  // 存储当前查询的DSL表达式，用于保存客群时使用
  const [currentQueryDSL, setCurrentQueryDSL] = useState('');

  // ==================== 客群对比功能 ====================
  
  /**
   * 对比客群
   * 
   * 功能说明：
   * - 支持对比多个客群（至少2个）
   * - 获取客群对比结果和详细信息
   * - 返回消息对象，由调用者添加到聊天界面
   * 
   * @param segmentIds 要对比的客群ID数组
   *                   必须包含至少2个客群ID
   * 
   * @returns 消息对象数组，包含用户消息和助手消息
   * 
   * 工作流程：
   * 1. 根据客群ID过滤出要对比的客群
   * 2. 检查客群数量是否满足对比要求（至少2个）
   * 3. 创建用户消息，记录对比操作
   * 4. 调用API获取客群对比结果
   * 5. 创建助手消息，包含对比详情
   * 6. 返回消息对象数组
   */
  const handleCompareSegments = async (segmentIds: string[]): Promise<ChatMessage[] | null> => {
    // 过滤出要对比的客群
    const segments = savedSegments.filter(s => segmentIds.includes(s.id));
    
    // 需要至少两个客群才能对比
    if (segments.length < 2) return null;

    // 创建用户消息，记录用户的对比操作
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      type: MessageType.USER,
      timestamp: new Date(),
      content: `对比客群：${segments.map(s => s.name).join(' vs ')}`
    };

    // 获取客群对比结果
    // API返回对比摘要和详细信息
    const { comparison, detail } = await apiService.getSegmentComparisonByIds({ segmentIds, savedSegments });

    // 创建助手消息，包含对比结果
    const assistantMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: MessageType.ASSISTANT,
      timestamp: new Date(),
      ...comparison,
      comparison_detail: detail
    };

    // 返回消息对象数组
    return [userMsg, assistantMsg];
  };

  // ==================== 客群删除功能 ====================
  
  /**
   * 删除客群
   * 
   * 功能说明：
   * - 从保存的客群列表中删除指定客群
   * - 直接更新客群列表，无需API调用
   * 
   * @param segmentId 要删除的客群ID
   * 
   * 工作流程：
   * 1. 根据客群ID过滤客群列表
   * 2. 排除要删除的客群
   * 3. 更新客群列表
   */
  const handleDeleteSegment = (segmentId: string) => {
    setSavedSegments(prev => prev.filter(s => s.id !== segmentId));
  };

  // ==================== 客群选择功能 ====================
  
  /**
   * 选择客群
   * 
   * 功能说明：
   * - 查看指定客群的详细信息
   * - 获取客群结果并返回消息对象
   * 
   * @param segment 要查看的客群对象
   *                包含客群ID、名称、DSL等信息
   * 
   * @returns 消息对象数组，包含用户消息和助手消息
   * 
   * 工作流程：
   * 1. 创建用户消息，记录查看客群操作
   * 2. 调用API获取客群结果
   * 3. 检查结果是否有效
   * 4. 创建助手消息，包含客群详情
   * 5. 返回消息对象数组
   */
  const handleSelectSegment = async (segment: SavedSegment): Promise<ChatMessage[] | null> => {
    // 创建用户消息，记录用户的查看操作
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      type: MessageType.USER,
      timestamp: new Date(),
      content: `查看客群：${segment.name}`
    };

    // 获取客群结果
    // 根据客群ID查询客群的详细数据
    const segmentResult = await apiService.getSegmentResultById({ segmentId: segment.id });
    if (!segmentResult) return null;

    // 创建助手消息，包含客群详情
    const assistantMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: MessageType.ASSISTANT,
      timestamp: new Date(),
      ...segmentResult
    };

    // 返回消息对象数组
    return [userMsg, assistantMsg];
  };

  // ==================== 客群保存功能 ====================
  
  /**
   * 保存客群
   * 
   * 功能说明：
   * - 将当前查询结果保存为新客群
   * - 使用用户输入的客群名称
   * - 使用当前查询的DSL表达式
   * 
   * 工作流程：
   * 1. 检查客群名称是否为空
   * 2. 创建新客群对象
   * 3. 将新客群添加到客群列表开头
   * 4. 关闭保存客群模态框
   * 5. 清空客群名称输入框
   * 
   * 注意事项：
   * - 客群名称不能为空
   * - 客群ID使用时间戳生成
   * - 客群创建时间使用当前日期
   * - 客户数量暂时设为0，实际应从消息中获取
   */
  const handleSaveSegment = () => {
    // 检查客群名称是否为空
    if (newSegmentName.trim()) {
      // 创建新客群对象
      const newSegment: SavedSegment = {
        id: Date.now().toString(),           // 使用时间戳作为客群ID
        name: newSegmentName,                // 客群名称
        customer_count: 0,                    // 客户数量（暂时设为0）
        dsl: currentQueryDSL,                // 查询DSL表达式
        created_at: new Date().toISOString().split('T')[0]  // 创建日期
      };
      
      // 添加到客群列表开头（最新的客群显示在前面）
      setSavedSegments(prev => [newSegment, ...prev]);
      
      // 关闭模态框并清空输入
      setShowSaveSegmentModal(false);
      setNewSegmentName('');
    }
  };

  // ==================== 返回值 ====================
  
  // 返回客群管理相关的状态和函数
  return {
    // 状态
    savedSegments,              // 保存的客群列表
    setSavedSegments,           // 更新客群列表的函数
    showSaveSegmentModal,       // 是否显示保存客群模态框
    newSegmentName,             // 新客群名称
    currentQueryDSL,            // 当前查询的DSL
    
    // 状态更新函数
    setShowSaveSegmentModal,    // 控制模态框显示/隐藏
    setNewSegmentName,          // 更新新客群名称
    setCurrentQueryDSL,         // 更新当前查询DSL
    
    // 处理函数
    handleCompareSegments,      // 对比客群的处理函数
    handleDeleteSegment,        // 删除客群的处理函数
    handleSelectSegment,        // 选择客群的处理函数
    handleSaveSegment           // 保存客群的处理函数
  };
};
