// 消息处理自定义钩子
// 用于管理聊天消息的发送、接收、显示和相关交互

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, MessageType, SavedSegment, CustomerProfile, SegmentAnalysisDetail, SegmentComparisonDetail, RightPanelType } from '../../types';
import { apiService } from '../../api';
import { VAGUE_QUERY_PATTERNS, DEFAULT_CUSTOMER_ID } from '../constants';

/**
 * 消息处理自定义钩子
 * @param savedSegments 保存的客群列表（可选）
 * @param setSavedSegments 更新保存的客群列表的函数（可选）
 * @returns 消息处理相关的状态和函数
 */
export const useMessageHandler = (savedSegments?: SavedSegment[], setSavedSegments?: React.Dispatch<React.SetStateAction<SavedSegment[]>>) => {
  // 聊天消息列表
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  // 输入框值
  const [inputValue, setInputValue] = useState('');
  // 是否正在输入状态
  const [isTyping, setIsTyping] = useState(false);
  // 是否显示内联筛选器
  const [showInlineFilter, setShowInlineFilter] = useState(false);
  // 待处理的查询
  const [pendingQuery, setPendingQuery] = useState('');
  // 是否正在加载数据
  const [isLoading, setIsLoading] = useState(true);
  // 用于自动滚动到底部的ref
  const scrollRef = useRef<HTMLDivElement>(null);

  /**
   * 初始化数据
   * 加载初始消息
   */
  useEffect(() => {
    const initializeData = async () => {
      try {
        const initialMessages = await apiService.getInitialMessages();
        setMessages(initialMessages);
      } catch (error) {
        console.error('初始化数据失败:', error);
      } finally {
        setIsLoading(false);
      }
    };
    initializeData();
  }, []);

  /**
   * 自动滚动到底部
   * 当消息列表或输入状态变化时，自动滚动到底部
   */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  /**
   * 判断是否为模糊查询
   * @param query 查询字符串
   * @returns 是否为模糊查询
   */
  const isVagueQuery = (query: string): boolean => {
    return VAGUE_QUERY_PATTERNS.some(pattern => pattern.test(query));
  };

  /**
   * 发送消息
   * @param text 可选的消息文本，如果不提供则使用输入框的值
   */
  const handleSend = async (text?: string) => {
    const query = text || inputValue;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      type: MessageType.USER,
      timestamp: new Date(),
      content: query
    };

    // 添加用户消息到列表并清空输入框
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // 如果是模糊查询，显示内联筛选器
    if (isVagueQuery(query)) {
      setPendingQuery(query);
      setShowInlineFilter(true);
      return;
    }

    // 设置正在输入状态
    setIsTyping(true);

    try {
      // 发送请求到API处理查询
      const result = await apiService.processRequest({
        query,
        context: {
          saved_segments: savedSegments || [],
          current_selected_customer: DEFAULT_CUSTOMER_ID
        }
      });

      // 从API服务获取默认客户资料
      const MOCK_PROFILE: CustomerProfile = apiService.getMockCustomerProfileDirectSync(DEFAULT_CUSTOMER_ID)!;

      // 如果返回的是客户卡片类型，处理客户资料和卡片数据
      if (result.middle_panel?.message_type === 'customer_cards') {
        result.right_panel = MOCK_PROFILE;
        result.middle_panel = {
          message_type: 'customer_cards',
          cards: [{
            customer_id: MOCK_PROFILE.customer_id,
            display_name: MOCK_PROFILE.customer_name,
            tags: MOCK_PROFILE.core_tags,
            key_metrics: {
              "授信使用率": `${(MOCK_PROFILE.financial_metrics.bank_metrics.credit_utilization * 100).toFixed(0)}%`,
              "风险事件": `${MOCK_PROFILE.risk_events.event_count} ${MOCK_PROFILE.risk_events.max_risk_level === 'high' ? 'HIGH' : 'MEDIUM'}`
            },
            ai_summary: MOCK_PROFILE.interactions.interactions[0]?.ai_summary || '暂无互动记录',
            cof_expansion: {
              steps: [
                "1️⃣ 匹配字段 [crm_customer_profile.name] → ID: CUST202500123",
                "2️⃣ 从 [crm_financial_metrics] 获取 [credit_utilization]",
                "3️⃣ 触发 [信用风险预警模型] (来源: 信贷管理系统)"
              ]
            }
          }]
        };
      }

      // 创建助手消息
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: MessageType.ASSISTANT,
        timestamp: new Date(),
        ...result
      };

      // 添加助手消息到列表
      setMessages(prev => [...prev, assistantMsg]);
      
      // 如果返回结果包含左侧面板更新且是添加客群操作，更新保存的客群列表
      if (result.left_panel_update?.action === 'add_segment') {
        setSavedSegments?.(prev => [...prev, result.left_panel_update.segment]);
      }
    } catch (e) {
      console.error('处理请求失败:', e);
    } finally {
      // 结束正在输入状态
      setIsTyping(false);
    }
  };

  /**
   * 刷新客群
   * @param segmentId 客群ID
   */
  const handleRefreshSegment = (segmentId: string) => {
    const segment = savedSegments?.find(s => s.id === segmentId);
    if (segment) {
      handleSend(`刷新客群：${segment.name}`);
    }
  };

  /**
   * 删除历史记录
   * @param id 要删除的消息ID
   */
  const handleDeleteHistory = (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  /**
   * 应用内联筛选
   * @param conditions 筛选条件数组
   */
  const handleInlineFilterApply = (conditions: any[]) => {
    const conditionsText = conditions.map(c => `${c.field} ${c.operator} ${c.value}`).join(' 且 ');
    setShowInlineFilter(false);
    handleSend(`${pendingQuery}（筛选条件：${conditionsText}）`);
  };

  /**
   * 取消内联筛选
   */
  const handleInlineFilterCancel = () => {
    setShowInlineFilter(false);
    setPendingQuery('');
  };

  // 返回消息处理相关的状态和函数
  return {
    messages,
    setMessages,
    inputValue,
    isTyping,
    showInlineFilter,
    pendingQuery,
    isLoading,
    scrollRef,
    setInputValue,
    handleSend,
    handleRefreshSegment,
    handleDeleteHistory,
    handleInlineFilterApply,
    handleInlineFilterCancel
  };
};
