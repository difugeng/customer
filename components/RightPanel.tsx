import React, { useMemo, useState } from 'react';
import { CustomerProfile, SegmentAnalysisDetail as SegmentAnalysisDetailType, SegmentComparisonDetail as SegmentComparisonDetailType, RightPanelType } from '../types';
import { BadgeCheck, X } from 'lucide-react';
import SegmentAnalysisDetail from './SegmentAnalysisDetail';
import SegmentComparisonDetail from './SegmentComparisonDetail';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';

interface RightPanelProps {
  data: CustomerProfile | SegmentAnalysisDetailType | SegmentComparisonDetailType;
  type: RightPanelType;
  onClose: () => void;
  onCustomerClick: (customerId: string) => void;
}

const RightPanel: React.FC<RightPanelProps> = ({ data, type, onClose, onCustomerClick }) => {
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    basic: false,
    financial: false,
    risks: false,
    network: false,
    products: false,
    interaction: false
  });

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const formatCurrency = (value: number): string => {
    if (value >= 100000000) {
      return `${(value / 100000000).toFixed(2)}亿`;
    } else if (value >= 10000) {
      return `${(value / 10000).toFixed(2)}万`;
    }
    return value.toLocaleString();
  };

  const formatPercent = (value: number): string => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const renderCustomerDetail = () => {
    const customerData = data as CustomerProfile;
    const revenueChartData = useMemo(() => ([
      { name: '营收', value: customerData.financial_metrics.metrics.revenue },
      { name: '净利润', value: customerData.financial_metrics.metrics.net_profit },
      { name: '经营性现金流', value: customerData.financial_metrics.metrics.operating_cf },
      { name: '自由现金流', value: customerData.financial_metrics.metrics.free_cf }
    ]), [customerData]);

    const riskLevel = customerData.risk_events.max_risk_level?.toLowerCase() || 'low';
    const riskLevelClass = riskLevel === 'high' ? 'bg-rose-500 text-white' : riskLevel === 'medium' ? 'bg-amber-500 text-white' : 'bg-blue-500 text-white';
    const riskLevelText = riskLevel === 'high' ? '高' : riskLevel === 'medium' ? '中' : '低';

    return (
      <>
        <div className="sticky top-0 bg-white border-b border-slate-100 p-4 flex justify-between items-center z-10">
          <div className="flex items-center gap-2">
            <BadgeCheck className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-slate-800">客户全景视图</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-5 space-y-6 pb-20">
          <section className="space-y-3">
            <button 
              onClick={() => toggleSection('basic')}
              className="w-full flex items-center justify-between text-xs font-bold text-blue-600 uppercase tracking-wider hover:text-blue-700 transition-colors"
            >
              <div className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                基础画像
              </div>
              {collapsedSections.basic ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>}
            </button>
            {!collapsedSections.basic && (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-4">
                <div className="flex flex-wrap justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{customerData.customer_name}</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">客户类型：{customerData.customer_type}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">行业：{customerData.industry.name}（{customerData.industry.code}）</p>
                  </div>
                  <div className="text-right text-[10px] text-slate-400">
                    <p>创建时间：{customerData.created_at}</p>
                    <p>更新时间：{customerData.updated_at}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-white border border-slate-100 rounded-lg p-3">
                    <p className="text-slate-400">客户ID</p>
                    <p className="font-semibold text-slate-800">{customerData.customer_id}</p>
                  </div>
                  <div className="bg-white border border-slate-100 rounded-lg p-3">
                    <p className="text-slate-400">客户经理</p>
                    <p className="font-semibold text-slate-800">{customerData.rm.name}（{customerData.rm.employee_id}）</p>
                  </div>
                  <div className="bg-white border border-slate-100 rounded-lg p-3">
                    <p className="text-slate-400">地区/省份</p>
                    <p className="font-semibold text-slate-800">{customerData.region}</p>
                  </div>
                  <div className="bg-white border border-slate-100 rounded-lg p-3">
                    <p className="text-slate-400">营收规模区间</p>
                    <p className="font-semibold text-slate-800">{customerData.scale.revenue_range}</p>
                  </div>
                  <div className="bg-white border border-slate-100 rounded-lg p-3">
                    <p className="text-slate-400">员工规模区间</p>
                    <p className="font-semibold text-slate-800">{customerData.scale.employees_range}</p>
                  </div>
                  <div className="bg-white border border-slate-100 rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <p className="text-slate-400">关系评级</p>
                      <span className="inline-block px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded font-bold">
                        {customerData.relationship_rating}
                      </span>
                    </div>
                    <div>
                      <p className="text-slate-400">生命周期</p>
                      <p className="font-semibold text-slate-800">{customerData.lifecycle_stage}</p>
                    </div>
                  </div>
                  <div className="bg-white border border-slate-100 rounded-lg p-3">
                    <p className="text-slate-400">集团标识</p>
                    <p className="font-semibold text-slate-800">{customerData.group_flag ? `${customerData.group_name}（${customerData.group_id}）` : '单体客户'}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {customerData.core_tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] text-slate-600">#{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </section>

          <section className="space-y-3">
            <button 
              onClick={() => toggleSection('financial')}
              className="w-full flex items-center justify-between text-xs font-bold text-emerald-600 uppercase tracking-wider hover:text-emerald-700 transition-colors"
            >
              <div className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                财务与授信 ({customerData.financial_metrics.period})
              </div>
              {collapsedSections.financial ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>}
            </button>
            {!collapsedSections.financial && (
              <div className="bg-emerald-50/30 rounded-xl p-4 border border-emerald-100 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-white rounded-lg border border-emerald-100">
                    <p className="text-[10px] text-slate-400 mb-1">营收</p>
                    <p className="text-sm font-bold text-slate-900">{formatCurrency(customerData.financial_metrics.metrics.revenue)}</p>
                    <p className={`text-[10px] font-medium ${customerData.financial_metrics.trend.revenue_yoy >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                      同比 {customerData.financial_metrics.trend.revenue_yoy >= 0 ? '+' : ''}{(customerData.financial_metrics.trend.revenue_yoy * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-emerald-100">
                    <p className="text-[10px] text-slate-400 mb-1">净利润</p>
                    <p className="text-sm font-bold text-slate-900">{formatCurrency(customerData.financial_metrics.metrics.net_profit)}</p>
                    <p className={`text-[10px] font-medium ${customerData.financial_metrics.trend.net_profit_yoy >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                      同比 {customerData.financial_metrics.trend.net_profit_yoy >= 0 ? '+' : ''}{(customerData.financial_metrics.trend.net_profit_yoy * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-emerald-100">
                    <p className="text-[10px] text-slate-400 mb-1">经营现金流</p>
                    <p className={`text-sm font-bold ${customerData.financial_metrics.metrics.operating_cf >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {formatCurrency(customerData.financial_metrics.metrics.operating_cf)}
                    </p>
                    <p className="text-[10px] text-slate-500">趋势：{customerData.financial_metrics.trend.cashflow_trend === 'up' ? '上升' : customerData.financial_metrics.trend.cashflow_trend === 'down' ? '下降' : '持平'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white rounded-lg border border-emerald-100">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">授信额度</span>
                      <span className="font-semibold text-slate-800">{formatCurrency(customerData.financial_metrics.bank_metrics.credit_limit)}</span>
                    </div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">授信已用</span>
                      <span className="font-semibold text-slate-800">{formatCurrency(customerData.financial_metrics.bank_metrics.credit_used)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">授信使用率</span>
                      <span className="font-bold text-slate-800">{formatPercent(customerData.financial_metrics.bank_metrics.credit_utilization)}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-2">
                      <div 
                        className={`h-full ${customerData.financial_metrics.bank_metrics.credit_utilization > 0.8 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                        style={{ width: formatPercent(customerData.financial_metrics.bank_metrics.credit_utilization) }}
                      />
                    </div>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-emerald-100">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">毛利率</span>
                        <span className="font-medium">{formatPercent(customerData.financial_metrics.ratios.gross_margin)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">净利率</span>
                        <span className="font-medium">{formatPercent(customerData.financial_metrics.ratios.net_margin)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">资产负债率</span>
                        <span className="font-medium">{formatPercent(customerData.financial_metrics.ratios.debt_to_asset)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">利息保障倍数</span>
                        <span className="font-medium">{customerData.financial_metrics.ratios.interest_coverage.toFixed(1)}x</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-emerald-100 p-3">
                  <p className="text-[10px] text-slate-400 mb-2">核心科目分布</p>
                  <div className="h-36">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueChartData} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {customerData.financial_metrics.ai_flags.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {customerData.financial_metrics.ai_flags.map((flag, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[10px] text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-100">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        {flag}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>

          <section className="space-y-3">
            <button 
              onClick={() => toggleSection('risks')}
              className="w-full flex items-center justify-between text-xs font-bold text-rose-600 uppercase tracking-wider hover:text-rose-700 transition-colors"
            >
              <div className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                风险预警 ({customerData.risk_events.event_count})
              </div>
              {collapsedSections.risks ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>}
            </button>
            {!collapsedSections.risks && (
              <>
                <div className="bg-rose-50/30 rounded-xl p-4 border border-rose-100">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs text-slate-500">最高风险等级</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${riskLevelClass}`}>{riskLevelText}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mb-2">当月事件数：{customerData.risk_events.event_count}，未关闭：{customerData.risk_events.open_event_count}</p>
                  <p className="text-[10px] text-slate-500 mb-3">来源：{customerData.risk_events.updated_at}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {customerData.risk_events.risk_types.map((type, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded text-[10px]">{type}</span>
                    ))}
                  </div>
                  {customerData.risk_events.events.slice(0, 3).map((event, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-lg border border-rose-100 mb-2">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-xs font-bold text-rose-700">{event.risk_type}</p>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          event.risk_level === 'high' ? 'bg-rose-500 text-white' :
                          event.risk_level === 'medium' ? 'bg-amber-500 text-white' :
                          'bg-blue-500 text-white'
                        }`}>
                          {event.risk_level === 'high' ? '高' :
                           event.risk_level === 'medium' ? '中' : '低'}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-800 mb-1">{event.event}</p>
                      <p className="text-[10px] text-slate-400">{event.detected_at}</p>
                    </div>
                  ))}
                  {customerData.risk_events.ai_flags.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {customerData.risk_events.ai_flags.map((flag, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[10px] text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-100">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                          {flag}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </section>

          <section className="space-y-3">
            <button 
              onClick={() => toggleSection('network')}
              className="w-full flex items-center justify-between text-xs font-bold text-amber-600 uppercase tracking-wider hover:text-amber-700 transition-colors"
            >
              <div className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                关系图谱 ({customerData.relationship_graph.edge_count})
              </div>
              {collapsedSections.network ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>}
            </button>
            {!collapsedSections.network && (
              <div className="bg-amber-50/30 rounded-xl p-4 border border-amber-100 text-xs">
                <div className="flex justify-between mb-3">
                  <span className="text-slate-500">担保链分析</span>
                  <span className={`font-bold ${customerData.relationship_graph.has_guarantee_chain ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {customerData.relationship_graph.has_guarantee_chain ? '存在复杂链条' : '清晰'}
                  </span>
                </div>
                <div className="flex justify-between mb-3">
                  <span className="text-slate-500">风险传播标识</span>
                  <span className={`font-bold ${customerData.relationship_graph.risk_propagation_flag ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {customerData.relationship_graph.risk_propagation_flag ? '存在风险传播' : '无风险传播'}
                  </span>
                </div>
                <div className="space-y-2">
                  {customerData.relationship_graph.edges.slice(0, 5).map((edge, idx) => (
                    <div key={idx} className="bg-white p-2 rounded border border-amber-50 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-slate-800">{edge.to_id}</p>
                        <p className="text-[10px] text-slate-400">{edge.relationship_type}</p>
                      </div>
                      <div className="text-right">
                        {edge.financial_exposure.guarantee_amount > 0 && (
                          <p className="text-[10px] text-amber-600">担保: {formatCurrency(edge.financial_exposure.guarantee_amount)}</p>
                        )}
                        {edge.financial_exposure.credit_linked && (
                          <p className="text-[10px] text-slate-500">授信关联</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {customerData.relationship_graph.ai_flags.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {customerData.relationship_graph.ai_flags.map((flag, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[10px] text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-100">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        {flag}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>

          <section className="space-y-3">
            <button 
              onClick={() => toggleSection('products')}
              className="w-full flex items-center justify-between text-xs font-bold text-indigo-600 uppercase tracking-wider hover:text-indigo-700 transition-colors"
            >
              <div className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                产品覆盖 ({customerData.product_usage.product_count})
              </div>
              {collapsedSections.products ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>}
            </button>
            {!collapsedSections.products && (
              <div className="bg-indigo-50/30 rounded-xl p-4 border border-indigo-100 text-xs">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-slate-500">覆盖率评分</span>
                  <span className={`font-bold ${customerData.product_usage.coverage_score >= 0.7 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {formatPercent(customerData.product_usage.coverage_score)}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-3">
                  <div 
                    className={`h-full ${customerData.product_usage.coverage_score >= 0.7 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                    style={{ width: formatPercent(customerData.product_usage.coverage_score) }}
                  />
                </div>
                {customerData.product_usage.blank_products.length > 0 && (
                  <div className="mb-3">
                    <p className="text-[10px] text-slate-500 mb-1">未覆盖产品：</p>
                    <div className="flex flex-wrap gap-1">
                      {customerData.product_usage.blank_products.map((product, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px]">{product}</span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  {customerData.product_usage.products.slice(0, 5).map((product, idx) => (
                    <div key={idx} className="bg-white p-2 rounded border border-indigo-50 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-slate-800">{product.product_name}</p>
                        <p className="text-[10px] text-slate-400">{product.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-indigo-600">{product.status === 'active' ? '使用中' : '已停用'}</p>
                        {product.usage_metrics && <p className="text-[10px] text-slate-500">{formatCurrency(product.usage_metrics.avg_balance)}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          <section className="space-y-3">
            <button 
              onClick={() => toggleSection('interaction')}
              className="w-full flex items-center justify-between text-xs font-bold text-purple-600 uppercase tracking-wider hover:text-purple-700 transition-colors"
            >
              <div className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                互动轨迹 ({customerData.interactions.interaction_count})
              </div>
              {collapsedSections.interaction ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>}
            </button>
            {!collapsedSections.interaction && (
              <div className="bg-purple-50/30 rounded-xl p-4 border border-purple-100 text-xs">
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {customerData.interactions.month_topics.map((topic, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-[10px]">{topic}</span>
                  ))}
                </div>
                <div className="space-y-2">
                  {customerData.interactions.interactions.slice(0, 5).map((interaction, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-lg border border-purple-50">
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-bold text-slate-800">{interaction.interaction_type}</p>
                        <p className="text-[10px] text-slate-400">{interaction.date}</p>
                      </div>
                      <p className="text-[10px] text-slate-500 mb-1">{interaction.topics.join(', ')}</p>
                      <p className="text-[10px] text-slate-400 italic">{interaction.ai_summary}</p>
                    </div>
                  ))}
                </div>
                {customerData.interactions.ai_flags.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {customerData.interactions.ai_flags.map((flag, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[10px] text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-100">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        {flag}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </>
    );
  };

  /**
   * 渲染客群分析详情
   * @returns 客群分析详情JSX
   */
  const renderSegmentAnalysisDetail = () => {
    const segmentData = data as SegmentAnalysisDetailType;
    return <SegmentAnalysisDetail data={segmentData} onClose={onClose} onCustomerClick={onCustomerClick} />;
  };

  /**
   * 渲染客群对比详情
   * @returns 客群对比详情JSX
   */
  const renderSegmentComparisonDetail = () => {
    const comparisonData = data as SegmentComparisonDetailType;
    return <SegmentComparisonDetail data={comparisonData} onClose={onClose} />;
  };

  /**
   * 组件返回部分
   * 根据不同类型渲染不同的详情内容
   */
  return (
    <div className="h-full flex flex-col bg-white border-l border-slate-200 shadow-2xl overflow-y-auto">
      {/* 根据右侧面板类型渲染对应的内容 */}
      {type === RightPanelType.CUSTOMER_DETAIL && renderCustomerDetail()}
      {type === RightPanelType.SEGMENT_ANALYSIS && renderSegmentAnalysisDetail()}
      {type === RightPanelType.SEGMENT_COMPARISON && renderSegmentComparisonDetail()}
    </div>
  );
};

export default RightPanel;

