// 右侧面板自定义钩子
// 用于管理右侧面板的内容和类型切换，包括客户详情、客群分析和客群对比详情

import { useState } from 'react';
import { CustomerProfile, SegmentAnalysisDetail, SegmentComparisonDetail, RightPanelType } from '../../types';
import { DEFAULT_RIGHT_PANEL_TYPE, DEFAULT_CUSTOMER_ID } from '../constants';
import { apiService } from '../../api';

/**
 * 右侧面板自定义钩子
 * @returns 右侧面板相关的状态和函数
 */
export const useRightPanel = () => {
  // 选中的资料，可以是客户资料、客群分析或客群对比详情
  const [selectedProfile, setSelectedProfile] = useState<CustomerProfile | SegmentAnalysisDetail | SegmentComparisonDetail | null>(null);
  // 右侧面板类型
  const [rightPanelType, setRightPanelType] = useState<RightPanelType>(DEFAULT_RIGHT_PANEL_TYPE);

  // 从 API 服务获取默认客户资料作为默认展示
  const MOCK_PROFILE: CustomerProfile = apiService.getMockCustomerProfileDirectSync(DEFAULT_CUSTOMER_ID)!;

  /**
   * 处理客户点击事件
   * @param customerId 客户ID
   */
  const handleCustomerClick = async (customerId: string) => {
    console.log('Customer clicked with ID:', customerId);
    
    // 获取客户资料
    const customerProfile = await apiService.getCustomerProfile({ customerId });
    if (customerProfile) {
      setSelectedProfile(customerProfile);
      setRightPanelType(RightPanelType.CUSTOMER_DETAIL);
    } else {
      // 如果获取失败，使用默认客户资料
      const fallbackProfile = await apiService.getMockCustomerProfileDirect(DEFAULT_CUSTOMER_ID);
      if (fallbackProfile) {
        setSelectedProfile(fallbackProfile);
        setRightPanelType(RightPanelType.CUSTOMER_DETAIL);
      }
    }
  };

  /**
   * 显示客户详情
   * @param customerId 客户ID
   */
  const handleShowCustomerDetail = async (customerId: string) => {
    const profile = await apiService.getCustomerProfile({ customerId });
    if (profile) {
      setSelectedProfile(profile);
      setRightPanelType(RightPanelType.CUSTOMER_DETAIL);
    }
  };

  /**
   * 显示客群分析
   * @param msg 消息对象
   */
  const handleShowSegmentAnalysis = async (msg: any) => {
    const mockData = await apiService.getSegmentAnalysisDetail();
    // 这里可以添加具体的处理逻辑，暂时保留原有的实现结构
    setSelectedProfile(mockData);
    setRightPanelType(RightPanelType.SEGMENT_ANALYSIS);
  };

  /**
   * 显示客群对比详情
   * @param msg 消息对象，包含对比详情数据
   */
  const handleShowSegmentComparisonDetail = async (msg: any) => {
    const mockData = msg.comparison_detail || await apiService.getSegmentComparisonDetail({});
    setSelectedProfile(mockData);
    setRightPanelType(RightPanelType.SEGMENT_COMPARISON);
  };

  // 返回右侧面板相关的状态和函数
  return {
    selectedProfile,
    rightPanelType,
    setSelectedProfile,
    setRightPanelType,
    handleCustomerClick,
    handleShowCustomerDetail,
    handleShowSegmentAnalysis,
    handleShowSegmentComparisonDetail,
    MOCK_PROFILE
  };
};
