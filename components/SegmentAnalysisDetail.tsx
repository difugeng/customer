import React, { useState } from 'react';
import { SegmentAnalysisDetail as SegmentAnalysisDetailType } from '../types';
import { 
  Building2, ShieldAlert, BarChart3, 
  Users2, Package, Sparkles, ChevronDown, ChevronUp,
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle,
  Network, MessageSquare, Activity
} from 'lucide-react';

interface SegmentAnalysisDetailProps {
  data: SegmentAnalysisDetailType;
  onClose: () => void;
  onCustomerClick: (customerId: string) => void;
}

const SegmentAnalysisDetail: React.FC<SegmentAnalysisDetailProps> = ({ data, onClose, onCustomerClick }) => {
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    basic: false,
    customer_profile: false,
    financial: false,
    relationship: false,
    products: false,
    risks: false,
    interactions: false,
    customers: false,
    insights: false
  });

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const formatCurrency = (value: number | undefined | null): string => {
    if (value === undefined || value === null) {
      return '0';
    }
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

  const safeSummary = data.summary || {
    total_count: 0,
    avg_relationship_rating: '-',
    negative_cashflow_count: 0,
    negative_cashflow_ratio: '0%',
    high_risk_count: 0,
    high_risk_ratio: '0%'
  };

  const safeCustomerProfile = data.customer_profile || {
    customer_types: [],
    industries: [],
    employee_scales: [],
    revenue_scales: [],
    regions: [],
    group_ratio: '0%',
    lifecycle_stages: [],
    relationship_ratings: [],
    core_tags: []
  };

  return (
    <div className="h-full flex flex-col bg-white border-l border-slate-200 shadow-2xl overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-slate-100 p-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <Users2 className="w-5 h-5 text-blue-600" />
          <h2 className="font-bold text-slate-800">客群分析详情</h2>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
          <span className="sr-only">关闭</span>
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="p-5 space-y-6 pb-20">
        <section className="space-y-3">
          <button 
            onClick={() => toggleSection('basic')}
            className="w-full flex items-center justify-between text-xs font-bold text-blue-600 uppercase tracking-wider hover:text-blue-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5" /> 基础画像
            </div>
            {collapsedSections.basic ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          {!collapsedSections.basic && (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <h3 className="text-base font-bold text-slate-900 mb-3">{data.segment_name}</h3>
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
                <div>
                  <p className="text-slate-400">客群ID</p>
                  <p className="font-medium text-slate-700">{data.segment_id}</p>
                </div>
                <div>
                  <p className="text-slate-400">客户数量</p>
                  <p className="font-medium text-slate-700">{data.customer_count} 家</p>
                </div>
                <div>
                  <p className="text-slate-400">统计周期</p>
                  <p className="font-medium text-slate-700">{data.period}</p>
                </div>
                <div>
                  <p className="text-slate-400">平均关系评级</p>
                  <span className="inline-block px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded font-bold">
                    {safeSummary.avg_relationship_rating}
                  </span>
                </div>
              </div>
              <div className="mt-3 p-3 bg-slate-100 rounded-lg">
                <p className="text-[10px] text-slate-500 mb-1">客群定义（DSL）</p>
                <p className="text-xs font-medium text-slate-800 font-mono">{data.segment_dsl}</p>
              </div>
            </div>
          )}
        </section>

        <section className="space-y-3">
          <button 
            onClick={() => toggleSection('customer_profile')}
            className="w-full flex items-center justify-between text-xs font-bold text-blue-600 uppercase tracking-wider hover:text-blue-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5" /> 客户画像分布
            </div>
            {collapsedSections.customer_profile ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          {!collapsedSections.customer_profile && (
            <div className="bg-blue-50/30 rounded-xl p-4 border border-blue-100">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-[10px] text-slate-400 mb-2">客户类型</p>
                  <div className="space-y-1">
                    {safeCustomerProfile.customer_types.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span className="text-slate-600">{item.name}</span>
                        <span className="font-medium text-slate-800">{item.count}家</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 mb-2">行业分布</p>
                  <div className="space-y-1">
                    {safeCustomerProfile.industries.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span className="text-slate-600">{item.name}</span>
                        <span className="font-medium text-slate-800">{item.count}家</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 mb-2">员工规模</p>
                  <div className="space-y-1">
                    {safeCustomerProfile.employee_scales.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span className="text-slate-600">{item.name}</span>
                        <span className="font-medium text-slate-800">{item.count}家</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 mb-2">营收规模</p>
                  <div className="space-y-1">
                    {safeCustomerProfile.revenue_scales.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span className="text-slate-600">{item.name}</span>
                        <span className="font-medium text-slate-800">{item.count}家</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 mb-2">地区分布</p>
                  <div className="space-y-1">
                    {safeCustomerProfile.regions.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span className="text-slate-600">{item.name}</span>
                        <span className="font-medium text-slate-800">{item.count}家</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 mb-2">集团客户占比</p>
                  <p className="font-medium text-slate-800">{safeCustomerProfile.group_ratio}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 mb-2">生命周期阶段</p>
                  <div className="space-y-1">
                    {safeCustomerProfile.lifecycle_stages.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span className="text-slate-600">{item.name}</span>
                        <span className="font-medium text-slate-800">{item.count}家</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 mb-2">关系评级</p>
                  <div className="space-y-1">
                    {safeCustomerProfile.relationship_ratings.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span className="text-slate-600">{item.name}</span>
                        <span className="font-medium text-slate-800">{item.count}家</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] text-slate-400 mb-2">核心标签</p>
                  <div className="flex flex-wrap gap-1.5">
                    {safeCustomerProfile.core_tags.map((item, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-white border border-blue-100 rounded text-[10px] text-slate-600">
                        {item.name} ({item.count})
                      </span>
                    ))}
                  </div>
                </div>
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
              <BarChart3 className="w-3.5 h-3.5" /> 财务指标
            </div>
            {collapsedSections.financial ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          {!collapsedSections.financial && (
            <div className="bg-emerald-50/30 rounded-xl p-4 border border-emerald-100">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 bg-white rounded-lg border border-emerald-100">
                  <p className="text-[10px] text-slate-400 mb-1">平均营收</p>
                  <p className="text-sm font-bold text-slate-900">{formatCurrency(data.financial_metrics.avg_revenue)}</p>
                  <p className="text-[10px] text-slate-500 mt-1">同比 {data.financial_metrics.revenue_yoy > 0 ? '+' : ''}{(data.financial_metrics.revenue_yoy * 100).toFixed(1)}%</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-emerald-100">
                  <p className="text-[10px] text-slate-400 mb-1">平均净利润</p>
                  <p className="text-sm font-bold text-slate-900">{formatCurrency(data.financial_metrics.avg_net_profit)}</p>
                  <p className="text-[10px] text-slate-500 mt-1">同比 {data.financial_metrics.net_profit_yoy > 0 ? '+' : ''}{(data.financial_metrics.net_profit_yoy * 100).toFixed(1)}%</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-emerald-100">
                  <p className="text-[10px] text-slate-400 mb-1">平均经营性现金流</p>
                  <p className={`text-sm font-bold ${data.financial_metrics.avg_operating_cf >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {formatCurrency(data.financial_metrics.avg_operating_cf)}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">同比 {data.financial_metrics.operating_cf_yoy > 0 ? '+' : ''}{(data.financial_metrics.operating_cf_yoy * 100).toFixed(1)}%</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-emerald-100">
                  <p className="text-[10px] text-slate-400 mb-1">平均EBITDA</p>
                  <p className="text-sm font-bold text-slate-900">{formatCurrency(data.financial_metrics.avg_ebitda)}</p>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <p className="text-[10px] text-slate-400 font-bold uppercase">现金流分析</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">平均现金流入</span>
                    <span className="font-medium text-slate-700">{formatCurrency(data.financial_metrics.avg_cash_inflow)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">平均现金流出</span>
                    <span className="font-medium text-slate-700">{formatCurrency(data.financial_metrics.avg_cash_outflow)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">平均自由现金流</span>
                    <span className="font-medium text-slate-700">{formatCurrency(data.financial_metrics.avg_free_cf)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">现金流趋势</span>
                    <span className={`font-medium ${data.financial_metrics.cashflow_trend === 'up' ? 'text-emerald-600' : data.financial_metrics.cashflow_trend === 'down' ? 'text-rose-500' : 'text-slate-700'}`}>
                      {data.financial_metrics.cashflow_trend === 'up' ? '上升' : data.financial_metrics.cashflow_trend === 'down' ? '下降' : '持平'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-[10px] text-slate-400 font-bold uppercase">盈利能力</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">平均毛利率</span>
                    <span className="font-medium text-slate-700">{formatPercent(data.financial_metrics.avg_gross_margin)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">平均净利率</span>
                    <span className="font-medium text-slate-700">{formatPercent(data.financial_metrics.avg_net_margin)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">平均纳税额</span>
                    <span className="font-medium text-slate-700">{formatCurrency(data.financial_metrics.avg_tax_payment)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">税负趋势</span>
                    <span className="font-medium text-slate-700">{data.financial_metrics.tax_trend}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-[10px] text-slate-400 font-bold uppercase">偿债能力</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">平均流动比率</span>
                    <span className="font-medium text-slate-700">{data.financial_metrics.avg_current_ratio.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">平均速动比率</span>
                    <span className="font-medium text-slate-700">{data.financial_metrics.avg_quick_ratio.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">平均资产负债率</span>
                    <span className="font-medium text-slate-700">{formatPercent(data.financial_metrics.avg_debt_to_asset)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">平均利息保障倍数</span>
                    <span className="font-medium text-slate-700">{data.financial_metrics.avg_interest_coverage.toFixed(1)}x</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-[10px] text-slate-400 font-bold uppercase">运营效率</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">平均应收周转天数</span>
                    <span className="font-medium text-slate-700">{data.financial_metrics.avg_ar_days.toFixed(0)}天</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">平均存货周转天数</span>
                    <span className="font-medium text-slate-700">{data.financial_metrics.avg_inventory_days.toFixed(0)}天</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">平均应付周转天数</span>
                    <span className="font-medium text-slate-700">{data.financial_metrics.avg_ap_days.toFixed(0)}天</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">平均资本开支</span>
                    <span className="font-medium text-slate-700">{formatCurrency(data.financial_metrics.avg_capex)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] text-slate-400 font-bold uppercase">我行业务</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">平均授信额度</span>
                    <span className="font-medium text-slate-700">{formatCurrency(data.financial_metrics.avg_credit_limit)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">平均授信已用</span>
                    <span className="font-medium text-slate-700">{formatCurrency(data.financial_metrics.avg_credit_used)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">平均授信使用率</span>
                    <span className="font-medium text-slate-700">{formatPercent(data.financial_metrics.avg_credit_utilization)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">平均贷款余额</span>
                    <span className="font-medium text-slate-700">{formatCurrency(data.financial_metrics.avg_loan_balance)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">平均存款余额</span>
                    <span className="font-medium text-slate-700">{formatCurrency(data.financial_metrics.avg_deposit_balance)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">平均贷款利率</span>
                    <span className="font-medium text-slate-700">{(data.financial_metrics.avg_loan_rate * 100).toFixed(2)}%</span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-2">
                  <div 
                    className={`h-full ${data.financial_metrics.avg_credit_utilization > 0.8 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                    style={{ width: formatPercent(data.financial_metrics.avg_credit_utilization) }}
                  />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-emerald-100">
                <p className="text-[10px] text-slate-400 mb-2">客户经理关注点</p>
                <div className="flex flex-wrap gap-1.5">
                  {data.financial_metrics.rm_focus_topics.map((topic, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px]">
                      {topic}
                    </span>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 mb-2 mt-3">AI关键标记</p>
                <div className="flex flex-wrap gap-1.5">
                  {data.financial_metrics.ai_flags.map((flag, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-[10px]">
                      {flag}
                    </span>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 mt-3">数据来源: {data.financial_metrics.source} · 截至: {data.financial_metrics.as_of_date}</p>
              </div>
            </div>
          )}
        </section>

        {/* 关系网络区块 */}
        <section className="space-y-3">
          <button 
            onClick={() => toggleSection('relationship')}
            className="w-full flex items-center justify-between text-xs font-bold text-indigo-600 uppercase tracking-wider hover:text-indigo-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Network className="w-3.5 h-3.5" /> 关系网络
            </div>
            {collapsedSections.relationship ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          {!collapsedSections.relationship && (
            <div className="bg-indigo-50/30 rounded-xl p-4 border border-indigo-100 text-xs">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="p-3 bg-white rounded-lg border border-indigo-100">
                  <p className="text-[10px] text-slate-400 mb-1">关系边数量</p>
                  <p className="text-lg font-bold text-slate-900">{data.relationship_graph.edge_count}</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-indigo-100">
                  <p className="text-[10px] text-slate-400 mb-1">担保链存在</p>
                  <p className={`text-lg font-bold ${data.relationship_graph.has_guarantee_chain ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {data.relationship_graph.has_guarantee_chain ? '是' : '否'}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">风险传染可能</span>
                  <span className={`font-bold ${data.relationship_graph.risk_propagation_flag ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {data.relationship_graph.risk_propagation_flag ? '存在' : '不存在'}
                  </span>
                </div>
                <div className="p-3 bg-white rounded-lg border border-indigo-100">
                  <p className="text-[10px] text-slate-400 mb-1">关系网络摘要</p>
                  <p className="text-slate-700">{data.relationship_graph.month_summary}</p>
                </div>
                <p className="text-[10px] text-slate-400 mb-2">AI关键标记</p>
                <div className="flex flex-wrap gap-1.5">
                  {data.relationship_graph.ai_flags.map((flag, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-[10px]">
                      {flag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 产品使用与覆盖率区块 */}
        <section className="space-y-3">
          <button 
            onClick={() => toggleSection('products')}
            className="w-full flex items-center justify-between text-xs font-bold text-purple-600 uppercase tracking-wider hover:text-purple-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Package className="w-3.5 h-3.5" /> 产品使用与覆盖率
            </div>
            {collapsedSections.products ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          {!collapsedSections.products && (
            <div className="bg-purple-50/30 rounded-xl p-4 border border-purple-100 text-xs">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="p-3 bg-white rounded-lg border border-purple-100">
                  <p className="text-[10px] text-slate-400 mb-1">在用产品数</p>
                  <p className="text-lg font-bold text-slate-900">{data.product_usage.product_count}</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-purple-100">
                  <p className="text-[10px] text-slate-400 mb-1">覆盖率得分</p>
                  <p className="text-lg font-bold text-slate-900">{(data.product_usage.coverage_score * 100).toFixed(0)}%</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="p-3 bg-white rounded-lg border border-purple-100">
                  <p className="text-[10px] text-slate-400 mb-1">产品使用摘要</p>
                  <p className="text-slate-700">{data.product_usage.month_summary}</p>
                </div>
                <p className="text-[10px] text-slate-400 mb-2">空白产品推荐</p>
                <div className="flex flex-wrap gap-1.5">
                  {data.product_usage.blank_products.map((product, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-white border border-purple-100 rounded text-[10px] text-slate-600">
                      {product}
                    </span>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 mb-2 mt-3">在用产品</p>
                <div className="space-y-1">
                  {data.product_usage.products.slice(0, 5).map((product, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-white rounded border border-purple-50">
                      <div>
                        <p className="font-medium text-slate-700">{product.name}</p>
                        <p className="text-[10px] text-slate-500">{product.category}</p>
                      </div>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${product.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {product.status === 'active' ? '在用' : '停用'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 风险与合规事件区块 */}
        <section className="space-y-3">
          <button 
            onClick={() => toggleSection('risks')}
            className="w-full flex items-center justify-between text-xs font-bold text-rose-600 uppercase tracking-wider hover:text-rose-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-3.5 h-3.5" /> 风险与合规事件
            </div>
            {collapsedSections.risks ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          {!collapsedSections.risks && (
            <div className="bg-rose-50/30 rounded-xl p-4 border border-rose-100 text-xs">
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="p-3 bg-white rounded-lg border border-rose-100 text-center">
                  <p className="text-[10px] text-slate-400 mb-1">事件数</p>
                  <p className="text-lg font-bold text-slate-900">{data.risk_events.event_count}</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-rose-100 text-center">
                  <p className="text-[10px] text-slate-400 mb-1">最高风险等级</p>
                  <p className={`text-lg font-bold ${data.risk_events.max_risk_level === 'HIGH' ? 'text-rose-600' : data.risk_events.max_risk_level === 'MEDIUM' ? 'text-amber-600' : 'text-slate-700'}`}>
                    {data.risk_events.max_risk_level}
                  </p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-rose-100 text-center">
                  <p className="text-[10px] text-slate-400 mb-1">未关闭事件</p>
                  <p className="text-lg font-bold text-slate-900">{data.risk_events.open_event_count}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="p-3 bg-white rounded-lg border border-rose-100">
                  <p className="text-[10px] text-slate-400 mb-1">风险摘要</p>
                  <p className="text-slate-700">{data.risk_events.month_summary}</p>
                </div>
                <p className="text-[10px] text-slate-400 mb-2">风险类型分布</p>
                <div className="space-y-1">
                  {data.risk_events.risk_types.map((risk, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-white rounded border border-rose-50">
                      <span className="text-slate-600">{risk.name}</span>
                      <span className="font-bold text-slate-800">{risk.count}家</span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 mb-2 mt-3">AI关键标记</p>
                <div className="flex flex-wrap gap-1.5">
                  {data.risk_events.ai_flags.map((flag, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-[10px]">
                      {flag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 客户互动历史区块 */}
        <section className="space-y-3">
          <button 
            onClick={() => toggleSection('interactions')}
            className="w-full flex items-center justify-between text-xs font-bold text-cyan-600 uppercase tracking-wider hover:text-cyan-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5" /> 客户互动历史
            </div>
            {collapsedSections.interactions ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          {!collapsedSections.interactions && (
            <div className="bg-cyan-50/30 rounded-xl p-4 border border-cyan-100 text-xs">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="p-3 bg-white rounded-lg border border-cyan-100">
                  <p className="text-[10px] text-slate-400 mb-1">互动次数</p>
                  <p className="text-lg font-bold text-slate-900">{data.interactions.interaction_count}</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-cyan-100">
                  <p className="text-[10px] text-slate-400 mb-1">互动频率</p>
                  <p className="text-lg font-bold text-slate-900">{(data.interactions.interaction_count / data.customer_count).toFixed(1)}次/客户</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="p-3 bg-white rounded-lg border border-cyan-100">
                  <p className="text-[10px] text-slate-400 mb-1">互动摘要</p>
                  <p className="text-slate-700">{data.interactions.month_summary}</p>
                </div>
                <p className="text-[10px] text-slate-400 mb-2">话题聚合</p>
                <div className="flex flex-wrap gap-1.5">
                  {data.interactions.month_topics.map((topic, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-white border border-cyan-100 rounded text-[10px] text-slate-600">
                      {topic.name} ({topic.count})
                    </span>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 mb-2 mt-3">AI关键标记</p>
                <div className="flex flex-wrap gap-1.5">
                  {data.interactions.ai_flags.map((flag, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-[10px]">
                      {flag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 优质客户区块 */}
        <section className="space-y-3">
          <button 
            onClick={() => toggleSection('customers')}
            className="w-full flex items-center justify-between text-xs font-bold text-amber-600 uppercase tracking-wider hover:text-amber-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Users2 className="w-3.5 h-3.5" /> 优质客户
            </div>
            {collapsedSections.customers ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          {!collapsedSections.customers && (
            <div className="bg-amber-50/30 rounded-xl p-4 border border-amber-100 text-xs">
              <div className="space-y-2">
                {data.top_customers.map((customer, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-lg border border-amber-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                      <p className="font-bold text-slate-800 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => onCustomerClick(customer.id)}>{customer.name}</p>
                      <p className="text-[10px] text-slate-500">{customer.industry} · {customer.location}</p>
                    </div>
                      <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-bold">
                        {customer.rating}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div>
                        <p className="text-slate-400">营收</p>
                        <p className="font-medium text-slate-700">{customer.financials.revenue}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">授信使用率</p>
                        <p className="font-medium text-slate-700">{customer.financials.utilization}</p>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-100">
                      <p className="text-[10px] text-slate-500 italic">{customer.aiSummary}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 核心洞察区块 */}
        <section className="space-y-3">
          <button 
            onClick={() => toggleSection('insights')}
            className="w-full flex items-center justify-between text-xs font-bold text-purple-600 uppercase tracking-wider hover:text-purple-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" /> 核心洞察
            </div>
            {collapsedSections.insights ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          {!collapsedSections.insights && (
            <div className="bg-purple-50/30 rounded-xl p-4 border border-purple-100 text-xs">
              <div className="space-y-2">
                {data.insights.map((insight, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <p className="text-slate-700">{insight}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-purple-100">
                <p className="text-[10px] text-slate-400">{data.data_provenance}</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default SegmentAnalysisDetail;