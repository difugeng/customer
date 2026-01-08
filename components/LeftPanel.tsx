
import React, { useState } from 'react';
import { SavedSegment, ChatMessage } from '../types';
import { 
  Users, History, Plus, 
  FolderSearch, Star, Clock, 
  Eye, RefreshCw, Trash2, GitCompare
} from 'lucide-react';

// 左侧面板组件属性接口
interface LeftPanelProps {
  savedSegments: SavedSegment[]; // 保存的客群列表
  history: ChatMessage[]; // 历史对话记录
  onSelectSegment: (segment: SavedSegment) => void; // 选择客群的回调
  onSelectHistory: (id: string) => void; // 选择历史对话的回调
  onCompareSegments?: (segmentIds: string[]) => void; // 对比客群的回调（可选）
  onRefreshSegment?: (segmentId: string) => void; // 刷新客群的回调（可选）
  onDeleteSegment?: (segmentId: string) => void; // 删除客群的回调（可选）
  onDeleteHistory?: (id: string) => void; // 删除历史对话的回调（可选）
}

/**
 * 左侧导航面板组件
 * 功能：展示我的客群、历史对话，提供客群对比、刷新、删除等操作
 */
const LeftPanel: React.FC<LeftPanelProps> = ({ 
  savedSegments, 
  history, 
  onSelectSegment, 
  onSelectHistory,
  onCompareSegments,
  onRefreshSegment,
  onDeleteSegment,
  onDeleteHistory
}) => {
  // 选中的客群ID集合，用于客群对比功能
  const [selectedSegments, setSelectedSegments] = useState<Set<string>>(new Set());

  /**
   * 处理客群选择（用于对比）
   * @param segmentId 客群ID
   */
  const handleSegmentSelect = (segmentId: string) => {
    const newSelected = new Set(selectedSegments);
    if (newSelected.has(segmentId)) {
      newSelected.delete(segmentId); // 取消选择
    } else if (newSelected.size < 3) {
      newSelected.add(segmentId); // 最多选择3个客群进行对比
    }
    setSelectedSegments(newSelected);
  };

  /**
   * 处理客群对比
   */
  const handleCompare = () => {
    if (selectedSegments.size >= 2 && onCompareSegments) {
      onCompareSegments(Array.from(selectedSegments));
    }
  };

  /**
   * 处理客群刷新
   * @param e 鼠标事件
   * @param segmentId 客群ID
   */
  const handleRefresh = (e: React.MouseEvent, segmentId: string) => {
    e.stopPropagation(); // 阻止事件冒泡
    if (onRefreshSegment) {
      onRefreshSegment(segmentId);
    }
  };

  /**
   * 处理客群删除
   * @param e 鼠标事件
   * @param segmentId 客群ID
   */
  const handleDelete = (e: React.MouseEvent, segmentId: string) => {
    e.stopPropagation(); // 阻止事件冒泡
    if (onDeleteSegment) {
      onDeleteSegment(segmentId);
      // 从选中集合中移除已删除的客群
      const newSelected = new Set(selectedSegments);
      newSelected.delete(segmentId);
      setSelectedSegments(newSelected);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0f172a] text-slate-300 w-full overflow-hidden">
      <div className="p-6">
        {/* 头部标题 */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <LANDMARK className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-bold text-white tracking-tight">智能客群分析助手</h1>
        </div>

        {/* 新建分析任务按钮 */}
        <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-medium transition-colors mb-3">
          <Plus className="w-4 h-4" />
          新建分析任务
        </button>

        {/* 导航菜单 */}
        <nav className="space-y-6">
          {/* 我的客群部分 */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Users className="w-3 h-3" /> 我的客群
              </h3>
              {/* 客群对比按钮，当选中2个或以上客群时显示 */}
              {selectedSegments.size >= 2 && (
                <button 
                  onClick={handleCompare}
                  className="flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-medium transition-colors"
                >
                  <GitCompare className="w-3 h-3" />
                  对比 ({selectedSegments.size})
                </button>
              )}
            </div>
            <div className="space-y-1">
              {/* 客群列表 */}
              {savedSegments.map((seg, idx) => (
                <div 
                  key={idx}
                  className={`group relative rounded-lg transition-colors ${selectedSegments.has(seg.id) ? 'bg-slate-800' : 'hover:bg-slate-800'}`}
                >
                  {/* 客群项按钮 */}
                  <button 
                    onClick={() => onSelectSegment(seg)}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {/* 客群选择复选框（用于对比） */}
                      <input
                        type="checkbox"
                        checked={selectedSegments.has(seg.id)}
                        onChange={() => handleSegmentSelect(seg.id)}
                        className="w-3.5 h-3.5 rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      />
                      {/* 客群收藏标记 */}
                      <Star className={`w-3.5 h-3.5 flex-shrink-0 ${selectedSegments.has(seg.id) ? 'text-amber-500' : 'text-amber-500 opacity-50 group-hover:opacity-100'}`} />
                      {/* 客群名称 */}
                      <span className="truncate">{seg.name}</span>
                    </div>
                    {/* 客群客户数量 */}
                    <span className="text-[10px] bg-slate-700 px-1.5 py-0.5 rounded text-slate-400 flex-shrink-0 ml-2">{seg.customer_count}</span>
                  </button>
                  {/* 客群操作按钮（悬浮显示） */}
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 rounded-lg px-1 py-0.5">
                    {/* 刷新客群按钮 */}
                    <button
                      onClick={(e) => handleRefresh(e, seg.id)}
                      className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"
                      title="刷新"
                    >
                      <RefreshCw className="w-3 h-3" />
                    </button>
                    {/* 删除客群按钮 */}
                    <button
                      onClick={(e) => handleDelete(e, seg.id)}
                      className="p-1 hover:bg-red-900/50 rounded text-slate-400 hover:text-red-400 transition-colors"
                      title="删除"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
              {/* 无客群时的提示 */}
              {savedSegments.length === 0 && <p className="text-[10px] text-slate-600 px-3 italic">暂无保存客群</p>}
            </div>
            {/* 客群对比提示 */}
            {selectedSegments.size > 0 && selectedSegments.size < 2 && (
              <p className="text-[10px] text-slate-600 px-3 mt-2 italic">再选择 {2 - selectedSegments.size} 个客群即可对比</p>
            )}
          </section>

          {/* 历史对话部分 */}
          <section>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <History className="w-3 h-3" /> 历史对话
            </h3>
            <div className="space-y-1">
              {/* 历史对话列表，只显示最近5条用户消息 */}
              {history.filter(m => m.type === 'USER').slice(-5).reverse().map((msg, idx) => (
                <div 
                  key={idx}
                  className="group relative rounded-lg transition-colors hover:bg-slate-800"
                >
                  {/* 历史对话项按钮 */}
                  <button 
                    onClick={() => onSelectHistory(msg.id)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-left"
                  >
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {/* 显示对话内容或中间面板文本 */}
                    <span className="truncate flex-1">{msg.middle_panel?.text || msg.content || '未命名查询'}</span>
                  </button>
                  {/* 删除历史对话按钮（悬浮显示） */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onDeleteHistory) {
                        onDeleteHistory(msg.id);
                      }
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-red-900/50 rounded text-slate-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    title="删除"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </nav>
      </div>

      {/* 底部用户信息 */}
      <div className="mt-auto p-6 bg-slate-900/50 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs">
            RM
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold text-white truncate">陈经理</p>
            <p className="text-[10px] text-slate-500 truncate">陆家嘴支行</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 自定义地标图标组件
 */
const LANDMARK = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

export default LeftPanel;
