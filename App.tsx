
import React, { useState, useEffect, useRef } from 'react';
import { MessageType, ChatMessage, SavedSegment, CustomerProfile, SegmentAnalysisDetail, SegmentComparisonDetail, RightPanelType } from './types';
import { apiService } from './api';
import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';
import InlineFilter from './components/InlineFilter';
import BriefSegmentComparison from './components/BriefSegmentComparison';
import { 
  Send, Bot, User, Loader2, 
  ArrowRight, ShieldAlert, Sparkles, Database
} from 'lucide-react';

// 从 API 服务获取宁德时代客户资料作为默认展示
const MOCK_PROFILE: CustomerProfile = apiService.getMockCustomerProfileDirectSync("CUST202500123")!;

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [savedSegments, setSavedSegments] = useState<SavedSegment[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<CustomerProfile | SegmentAnalysisDetail | SegmentComparisonDetail | null>(null);
  const [rightPanelType, setRightPanelType] = useState<RightPanelType>(RightPanelType.CUSTOMER_DETAIL);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [rightPanelWidth, setRightPanelWidth] = useState<number>(420);
  const [showSaveSegmentModal, setShowSaveSegmentModal] = useState(false);
  const [newSegmentName, setNewSegmentName] = useState('');
  const [currentQueryDSL, setCurrentQueryDSL] = useState('');
  const [showInlineFilter, setShowInlineFilter] = useState(false);
  const [pendingQuery, setPendingQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeData = async () => {
      try {
        const [initialMessages, initialSegments] = await Promise.all([
          apiService.getInitialMessages(),
          apiService.getSavedSegments()
        ]);
        setMessages(initialMessages);
        setSavedSegments(initialSegments);
      } catch (error) {
        console.error('Failed to initialize data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    initializeData();
  }, []);
  
  // 拖拽处理函数 - 只在右侧详情面板显示时启用
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!selectedProfile) return; // 只有在详情面板显示时才启用拖拽
    
    e.preventDefault();
    
    const startX = e.clientX;
    const startWidth = rightPanelWidth;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const diff = moveEvent.clientX - startX; // 鼠标向右移动，面板变宽；鼠标向左移动，面板变窄
      const newWidth = startWidth - diff;
      
      // 限制面板宽度在合理范围内
      if (newWidth >= 300 && newWidth <= 800) {
        setRightPanelWidth(newWidth);
      }
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleCompareSegments = async (segmentIds: string[]) => {
    const segments = savedSegments.filter(s => segmentIds.includes(s.id));
    if (segments.length < 2) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      type: MessageType.USER,
      timestamp: new Date(),
      content: `对比客群：${segments.map(s => s.name).join(' vs ')}`
    };

    const { comparison, detail } = await apiService.getSegmentComparisonByIds({ segmentIds, savedSegments });

    const assistantMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: MessageType.ASSISTANT,
      timestamp: new Date(),
      ...comparison,
      comparison_detail: detail
    };

    setMessages(prev => [...prev, userMsg, assistantMsg]);
  };

  const handleRefreshSegment = (segmentId: string) => {
    const segment = savedSegments.find(s => s.id === segmentId);
    if (segment) {
      handleSend(`刷新客群：${segment.name}`);
    }
  };

  const handleDeleteSegment = (segmentId: string) => {
    setSavedSegments(prev => prev.filter(s => s.id !== segmentId));
  };

  const handleCustomerClick = async (customerId: string) => {
    console.log('Customer clicked with ID:', customerId);
    
    const customerProfile = await apiService.getCustomerProfile({ customerId });
    if (customerProfile) {
      setSelectedProfile(customerProfile);
      setRightPanelType(RightPanelType.CUSTOMER_DETAIL);
    } else {
      const fallbackProfile = await apiService.getMockCustomerProfileDirect("CUST202500123");
      if (fallbackProfile) {
        setSelectedProfile(fallbackProfile);
        setRightPanelType(RightPanelType.CUSTOMER_DETAIL);
      }
    }
  };

  const handleDeleteHistory = (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  const isVagueQuery = (query: string): boolean => {
    const vaguePatterns = [
      /找一些.*客户/,
      /找.*好客户/,
      /筛选.*客户/,
      /查找.*客户/,
      /推荐.*客户/,
      /优质客户/,
      /潜力客户/,
      /重点客户/
    ];
    return vaguePatterns.some(pattern => pattern.test(query));
  };

  const handleInlineFilterApply = (conditions: any[]) => {
    const conditionsText = conditions.map(c => `${c.field} ${c.operator} ${c.value}`).join(' 且 ');
    setShowInlineFilter(false);
    handleSend(`${pendingQuery}（筛选条件：${conditionsText}）`);
  };

  const handleInlineFilterCancel = () => {
    setShowInlineFilter(false);
    setPendingQuery('');
  };

  const handleSaveSegment = () => {
    if (newSegmentName.trim()) {
      const newSegment: SavedSegment = {
        id: Date.now().toString(),
        name: newSegmentName,
        customer_count: messages[messages.length - 1].middle_panel?.summary?.total_count || 0,
        dsl: currentQueryDSL,
        created_at: new Date().toISOString().split('T')[0]
      };
      setSavedSegments(prev => [newSegment, ...prev]);
      setShowSaveSegmentModal(false);
      setNewSegmentName('');
    }
  };

  const handleSend = async (text?: string) => {
    const query = text || inputValue;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      type: MessageType.USER,
      timestamp: new Date(),
      content: query
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    if (isVagueQuery(query)) {
      setPendingQuery(query);
      setShowInlineFilter(true);
      return;
    }

    setIsTyping(true);

    try {
      const result = await apiService.processRequest({
        query,
        context: {
          saved_segments: savedSegments,
          current_selected_customer: selectedProfile?.customer_id
        }
      });

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

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: MessageType.ASSISTANT,
        timestamp: new Date(),
        ...result
      };

      setMessages(prev => [...prev, assistantMsg]);
      
      if (result.left_panel_update?.action === 'add_segment') {
        setSavedSegments(prev => [...prev, result.left_panel_update.segment]);
      }

      if (result.right_panel) {
        setSelectedProfile(result.right_panel);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  const handleShowCustomerDetail = async (customerId: string) => {
    const profile = await apiService.getCustomerProfile({ customerId });
    if (profile) {
      setSelectedProfile(profile);
      setRightPanelType(RightPanelType.CUSTOMER_DETAIL);
    }
  };

  const handleShowSegmentAnalysis = async (msg: ChatMessage) => {
    const mockData = await apiService.getSegmentAnalysisDetail();
    const segmentAnalysisDetail: SegmentAnalysisDetail = {
      ...mockData,
      segment_id: msg.segment_id || mockData.segment_id,
      segment_name: msg.segment_name || mockData.segment_name,
      segment_dsl: msg.content || mockData.segment_dsl,
      customer_count: msg.middle_panel?.summary?.total_count || mockData.customer_count,
      summary: {
        ...mockData.summary,
        total_count: msg.middle_panel?.summary?.total_count ?? mockData.summary.total_count
      },
      top_customers: msg.middle_panel?.customer_list?.slice(0, 3).map(c => {
        // Map customer names to proper IDs that exist in MOCK_CUSTOMER_PROFILES
        const customerIdMap: Record<string, string> = {
          "宁德时代新能源科技股份有限公司": "CUST202500123",
          "比亚迪股份有限公司": "CUST202500124",
          "上海华虹半导体有限公司": "CUST202500456",
          "中芯国际集成电路制造有限公司": "CUST202500457",
          "江苏长电科技股份有限公司": "CUST202500458",
          "中微半导体设备（上海）股份有限公司": "CUST202500459",
          "上海韦尔半导体股份有限公司": "CUST202500460",
          "隆基绿能科技股份有限公司": "CUST202500461",
          "晶科能源股份有限公司": "CUST202500462",
          "天合光能股份有限公司": "CUST202500463"
        };
        return {
          id: customerIdMap[c.name] || `CUST_${c.name.replace(/\s+/g, '_')}`,
          name: c.name,
          industry: '制造业',
          location: c.region,
          rating: 'BBB',
          financials: {
            revenue: '5000万',
            creditLimit: '3000万',
            utilization: c.credit_util,
            cashFlow: '1200万'
          },
          aiSummary: '客户经营稳定，授信使用率适中',
          risks: []
        };
      }) || mockData.top_customers,
      insights: msg.middle_panel?.summary?.insights || mockData.insights,
      data_provenance: msg.middle_panel?.data_provenance || mockData.data_provenance
    };
    setSelectedProfile(segmentAnalysisDetail);
    setRightPanelType(RightPanelType.SEGMENT_ANALYSIS);
  };

  const handleShowSegmentComparisonDetail = async (msg: ChatMessage) => {
    const mockData = msg.comparison_detail || await apiService.getSegmentComparisonDetail({});
    const segmentComparisonDetail: SegmentComparisonDetail = { ...mockData };
    setSelectedProfile(segmentComparisonDetail);
    setRightPanelType(RightPanelType.SEGMENT_COMPARISON);
  };

  const handleSelectSegment = async (segment: SavedSegment) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      type: MessageType.USER,
      timestamp: new Date(),
      content: `查看客群：${segment.name}`
    };

    const segmentResult = await apiService.getSegmentResultById({ segmentId: segment.id });
    if (!segmentResult) return;

    const assistantMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: MessageType.ASSISTANT,
      timestamp: new Date(),
      ...segmentResult
    };

    setMessages(prev => [...prev, userMsg, assistantMsg]);
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      {/* Column 1: Left Navigation */}
      <aside className="w-72 flex-shrink-0 bg-slate-100">
        <LeftPanel 
          savedSegments={savedSegments}
          history={messages}
          onSelectSegment={(segment) => handleSelectSegment(segment)}
          onSelectHistory={(id) => {/* Potential scroll logic */}}
          onCompareSegments={handleCompareSegments}
          onRefreshSegment={handleRefreshSegment}
          onDeleteSegment={handleDeleteSegment}
          onDeleteHistory={handleDeleteHistory}
        />
      </aside>

      {/* Column 2: Chat Interface */}
      <main 
        className="flex flex flex-col bg-slate-50 relative min-w-0" 
        style={{ 
          width: selectedProfile ? `calc(100% - ${rightPanelWidth + 8}px)` : '100%' 
        }}
      >
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span className="font-bold text-slate-800 text-sm">对话分析工作台</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-500">
            <Database className="w-3 h-3" />
            已连接：信贷管理 / 企查查 / 风险预警
          </div>
        </header>

        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6"
        >
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.type === MessageType.USER ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-[90%] ${msg.type === MessageType.USER ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 ${
                  msg.type === MessageType.USER ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-blue-600'
                }`}>
                  {msg.type === MessageType.USER ? <User className="w-4 h-4" /> : <Bot className="w-5 h-5" />}
                </div>

                <div className="space-y-3 flex-1 min-w-0">
                  {msg.content && (
                    <div className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                      msg.type === MessageType.USER ? 'bg-blue-600 text-white' : 'bg-white text-slate-800 border border-slate-200'
                    }`}>
                      {msg.content}
                    </div>
                  )}

                  {msg.middle_panel?.text && (
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 text-sm shadow-sm">
                      {msg.middle_panel.text}
                    </div>
                  )}

                  {msg.middle_panel?.message_type === 'customer_cards' && msg.middle_panel.cards?.map((card, i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleShowCustomerDetail(card.customer_id)}>
                      <div className="p-4 border-b border-slate-50 bg-slate-50 flex justify-between items-center">
                        <div className="flex-1">
                          <p className="text-xs font-bold text-slate-400 uppercase">客户摘要</p>
                          <h4 className="font-bold text-slate-900">{card.display_name}</h4>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {card.tags.map((t, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full">{t}</span>
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShowCustomerDetail(card.customer_id);
                          }}
                          className="ml-3 px-3 py-1.5 bg-blue-600 text-white text-[10px] font-bold rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-100"
                        >
                          查看详情
                        </button>
                      </div>
                      <div className="p-4 grid grid-cols-2 gap-4 text-xs">
                        {Object.entries(card.key_metrics).map(([k, v]) => (
                          <div key={k}>
                            <p className="text-slate-400 mb-0.5">{k}</p>
                            <p className="font-bold text-slate-800">{v}</p>
                          </div>
                        ))}
                      </div>
                      <div className="px-4 py-3 bg-blue-50/30 italic text-xs text-slate-600 border-t border-slate-50">
                        <span className="font-bold not-italic text-blue-700 mr-2">洞察:</span>
                        {card.ai_summary}
                      </div>
                      <details className="border-t border-slate-50">
                        <summary 
                          className="px-4 py-2 text-[10px] text-slate-400 font-bold"
                          onClick={(e) => e.stopPropagation()}
                        >
                          【查看 AI 推理步骤】
                        </summary>
                        <div className="px-4 pb-3 space-y-1 text-[10px] text-slate-500 font-mono">
                          {card.cof_expansion.steps.map((s, idx) => <p key={idx}>{s}</p>)}
                        </div>
                      </details>
                    </div>
                  ))}

                  {msg.middle_panel?.message_type === 'segment_result' && (
                    <div 
                      className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleShowSegmentAnalysis(msg)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-slate-900">{msg.from_saved_segment ? msg.segment_name : '客群查询结果'}</h4>
                          <p className="text-xs text-slate-500">找到符合条件的客户 {msg.middle_panel.summary?.total_count} 家</p>
                        </div>
                        {!msg.from_saved_segment && (
                          <button 
                            onClick={() => {
                              setCurrentQueryDSL(msg.content || '');
                              setShowSaveSegmentModal(true);
                            }}
                            className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-100"
                          >
                            保存为客群
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShowSegmentAnalysis(msg);
                          }}
                          className="ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 shadow-lg shadow-blue-100"
                        >
                          查看详情
                        </button>
                      </div>
                      {msg.middle_panel.summary?.total_count && msg.middle_panel.summary.total_count < 5 && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
                          <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-amber-700 font-medium">样本过小（{msg.middle_panel.summary.total_count} 家），结论谨慎参考</p>
                        </div>
                      )}
                      <div className="space-y-2">
                        {msg.middle_panel.summary?.insights.map((insight, idx) => (
                          <div key={idx} className="flex gap-2 items-start text-xs text-slate-700">
                            <ShieldAlert className="w-3.5 h-3.5 text-rose-500 mt-0.5 flex-shrink-0" />
                            {insight}
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-slate-100 pt-3">
                        <table className="w-full text-xs text-left">
                          <thead>
                            <tr className="text-slate-400 border-b border-slate-50">
                              <th className="pb-2 font-medium">客户名称</th>
                              <th className="pb-2 font-medium">地区</th>
                              <th className="pb-2 font-medium text-right">授信使用率</th>
                            </tr>
                          </thead>
                          <tbody>
                            {msg.middle_panel.customer_list?.map((c, idx) => (
                              <tr key={idx} className="hover:bg-slate-50 cursor-pointer" onClick={(e) => {
                                e.stopPropagation();
                                handleShowCustomerDetail('CUST202500123');
                              }}>
                                <td className="py-2 font-bold text-slate-800">{c.name}</td>
                                <td className="py-2 text-slate-500">{c.region}</td>
                                <td className={`py-2 text-right font-bold ${parseInt(c.credit_util) > 80 ? 'text-rose-500' : 'text-slate-700'}`}>{c.credit_util}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {msg.middle_panel?.message_type === 'segment_comparison' && (
                    <BriefSegmentComparison
                      groups={msg.middle_panel.groups || []}
                      comparison_summary={msg.middle_panel.comparison_summary || []}
                      comparison_table={msg.middle_panel.comparison_table || []}
                      dataProvenance={msg.middle_panel.data_provenance}
                      onViewDetail={() => handleShowSegmentComparisonDetail(msg)}
                    />
                  )}

                  {msg.middle_panel?.options && (
                    <div className="flex flex-wrap gap-2">
                      {msg.middle_panel.options.map((opt, i) => (
                        <button 
                          key={i}
                          onClick={() => handleSend(opt)}
                          className="px-4 py-2 bg-white border border-slate-200 rounded-full text-xs text-slate-700 hover:border-blue-500 hover:text-blue-600 transition-all flex items-center gap-2 shadow-sm"
                        >
                          {opt}
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {showInlineFilter && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[90%]">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 bg-white border border-slate-200 text-blue-600">
                  <Bot className="w-5 h-5" />
                </div>
                <InlineFilter 
                  onApply={handleInlineFilterApply}
                  onCancel={handleInlineFilterCancel}
                />
              </div>
            </div>
          )}

          {isTyping && (
            <div className="flex gap-3 items-center text-slate-400 text-xs font-medium">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              正在检索全行数据并生成合规分析底稿...
            </div>
          )}
        </div>

        <footer className="p-6 bg-white border-t border-slate-200">
          <div className="max-w-4xl mx-auto flex gap-4">
            <div className="flex-1 relative">
              <input 
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="尝试输入“宁德时代怎么样”或“查看高风险客群对比”"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm shadow-inner"
              />
              <button 
                onClick={() => handleSend()}
                className="absolute right-3 top-3 bottom-3 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </footer>
      </main>

      {/* 拖拽分隔条 - 只在右侧客户详情面板显示时出现 */}
      {selectedProfile && (
        <div 
          className="w-2 bg-slate-200 cursor-col-resize hover:bg-slate-300 transition-colors flex items-center justify-center relative group"
          onMouseDown={handleMouseDown}
        >
          <div className="absolute w-0.5 h-12 bg-slate-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
      )}

      {/* Column 3: Right Profile Panel */}
      <aside 
        className={`transition-all duration-300 ease-in-out border-l border-slate-200 bg-white overflow-hidden flex-shrink-0 ${
          selectedProfile ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{ width: selectedProfile ? `${rightPanelWidth}px` : '0px' }}
      >
        {selectedProfile && (
          <RightPanel 
            data={selectedProfile} 
            type={rightPanelType}
            onClose={() => setSelectedProfile(null)} 
            onCustomerClick={handleCustomerClick}
          />
        )}
      </aside>

      {showSaveSegmentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-96 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4">保存为客群</h3>
            <input
              type="text"
              value={newSegmentName}
              onChange={(e) => setNewSegmentName(e.target.value)}
              placeholder="请输入客群名称"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowSaveSegmentModal(false);
                  setNewSegmentName('');
                }}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSaveSegment}
                className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
