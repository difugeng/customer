import React, { useState } from 'react';
import { SegmentComparisonDetail as SegmentComparisonDetailType } from '../types';
import { 
  Users2, Sparkles, ChevronDown, ChevronUp, ArrowLeftRight,
  TrendingUp, TrendingDown, Minus, BarChart3, ShieldAlert, Building2,
  DollarSign, Network, Package, AlertTriangle, MessageSquare, Calendar
} from 'lucide-react';

interface SegmentComparisonDetailProps {
  data: SegmentComparisonDetailType;
  onClose: () => void;
}

const SegmentComparisonDetail: React.FC<SegmentComparisonDetailProps> = ({ data, onClose }) => {
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    overview: false,
    customer_profile: false,
    financial_metrics: false,
    relationship: false,
    products: false,
    risks: false,
    interactions: false,
    insights: false
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

  const getTrendIcon = (significant: boolean) => {
    if (significant) {
      return <TrendingUp className="w-4 h-4 text-amber-500" />;
    }
    return <Minus className="w-4 h-4 text-slate-400" />;
  };

  const getComparisonValue = (groupA: number, groupB: number): string => {
    const diff = ((groupA - groupB) / Math.abs(groupB || 1)) * 100;
    if (Math.abs(diff) < 0.1) return '持平';
    return diff > 0 ? `+${diff.toFixed(1)}%` : `${diff.toFixed(1)}%`;
  };

  return (
    <div className="h-full flex flex-col bg-white border-l border-slate-200 shadow-2xl overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-slate-100 p-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <ArrowLeftRight className="w-5 h-5 text-blue-600" />
          <h2 className="font-bold text-slate-800">客群对比详情</h2>
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
            onClick={() => toggleSection('overview')}
            className="w-full flex items-center justify-between text-xs font-bold text-blue-600 uppercase tracking-wider hover:text-blue-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Users2 className="w-3.5 h-3.5" /> 客群概览
            </div>
            {collapsedSections.overview ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          {!collapsedSections.overview && (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="grid grid-cols-2 gap-4">
                {data.groups.map((group, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border ${idx === 0 ? 'bg-blue-50 border-blue-200' : 'bg-emerald-50 border-emerald-200'}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-blue-600' : 'bg-emerald-600'}`} />
                      <h3 className="text-sm font-bold text-slate-900">{group.name}</h3>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div>
                        <p className="text-slate-400">客户数量</p>
                        <p className="font-bold text-slate-700">{group.customer_count} 家</p>
                      </div>
                      <div>
                        <p className="text-slate-400">客群ID</p>
                        <p className="font-medium text-slate-700">{group.id}</p>
                      </div>
                    </div>
                    <div className="mt-3 p-2 bg-white/50 rounded-lg">
                      <p className="text-[10px] text-slate-500 mb-1">客群定义（DSL）</p>
                      <p className="text-[10px] font-medium text-slate-800 font-mono truncate">{group.dsl}</p>
                    </div>
                  </div>
                ))}
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
              <Building2 className="w-3.5 h-3.5" /> 客户画像对比
            </div>
            {collapsedSections.customer_profile ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          {!collapsedSections.customer_profile && (
            <div className="bg-blue-50/30 rounded-xl p-4 border border-blue-100 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-[10px] text-slate-400 mb-2">客户类型</p>
                  <div className="space-y-1">
                    {data.customer_profile_comparison.customer_types.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="text-slate-600">{item.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-blue-700">{item.group_a_count}家 ({item.group_a_ratio})</span>
                          <span className="text-slate-300">|</span>
                          <span className="font-medium text-emerald-700">{item.group_b_count}家 ({item.group_b_ratio})</span>
                          {item.significant && <TrendingUp className="w-3 h-3 text-amber-500" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 mb-2">行业分布</p>
                  <div className="space-y-1">
                    {data.customer_profile_comparison.industries.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="text-slate-600">{item.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-blue-700">{item.group_a_count}家 ({item.group_a_ratio})</span>
                          <span className="text-slate-300">|</span>
                          <span className="font-medium text-emerald-700">{item.group_b_count}家 ({item.group_b_ratio})</span>
                          {item.significant && <TrendingUp className="w-3 h-3 text-amber-500" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 mb-2">员工规模</p>
                  <div className="space-y-1">
                    {data.customer_profile_comparison.employee_scales.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="text-slate-600">{item.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-blue-700">{item.group_a_count}家 ({item.group_a_ratio})</span>
                          <span className="text-slate-300">|</span>
                          <span className="font-medium text-emerald-700">{item.group_b_count}家 ({item.group_b_ratio})</span>
                          {item.significant && <TrendingUp className="w-3 h-3 text-amber-500" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 mb-2">营收规模</p>
                  <div className="space-y-1">
                    {data.customer_profile_comparison.revenue_scales.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="text-slate-600">{item.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-blue-700">{item.group_a_count}家 ({item.group_a_ratio})</span>
                          <span className="text-slate-300">|</span>
                          <span className="font-medium text-emerald-700">{item.group_b_count}家 ({item.group_b_ratio})</span>
                          {item.significant && <TrendingUp className="w-3 h-3 text-amber-500" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 mb-2">地区分布</p>
                  <div className="space-y-1">
                    {data.customer_profile_comparison.regions.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="text-slate-600">{item.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-blue-700">{item.group_a_count}家 ({item.group_a_ratio})</span>
                          <span className="text-slate-300">|</span>
                          <span className="font-medium text-emerald-700">{item.group_b_count}家 ({item.group_b_ratio})</span>
                          {item.significant && <TrendingUp className="w-3 h-3 text-amber-500" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 mb-2">生命周期</p>
                  <div className="space-y-1">
                    {data.customer_profile_comparison.lifecycle_stages.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="text-slate-600">{item.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-blue-700">{item.group_a_count}家 ({item.group_a_ratio})</span>
                          <span className="text-slate-300">|</span>
                          <span className="font-medium text-emerald-700">{item.group_b_count}家 ({item.group_b_ratio})</span>
                          {item.significant && <TrendingUp className="w-3 h-3 text-amber-500" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="pt-3 border-t border-blue-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">集团客户占比</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-blue-700">{data.customer_profile_comparison.group_ratio.group_a}</span>
                    <span className="text-slate-300">|</span>
                    <span className="font-medium text-emerald-700">{data.customer_profile_comparison.group_ratio.group_b}</span>
                    {data.customer_profile_comparison.group_ratio.significant && <TrendingUp className="w-3 h-3 text-amber-500" />}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="space-y-3">
          <button 
            onClick={() => toggleSection('financial_metrics')}
            className="w-full flex items-center justify-between text-xs font-bold text-emerald-600 uppercase tracking-wider hover:text-emerald-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              <DollarSign className="w-3.5 h-3.5" /> 财务指标对比
            </div>
            {collapsedSections.financial_metrics ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          {!collapsedSections.financial_metrics && (
            <div className="bg-emerald-50/30 rounded-xl p-4 border border-emerald-100 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-[10px] text-slate-400 mb-2">营收</p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-blue-700">{formatCurrency(data.financial_metrics_comparison.group_a.avg_revenue)}</span>
                    <span className="font-medium text-emerald-700">{formatCurrency(data.financial_metrics_comparison.group_b.avg_revenue)}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 mb-2">毛利润</p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-blue-700">{formatCurrency(data.financial_metrics_comparison.group_a.avg_gross_profit)}</span>
                    <span className="font-medium text-emerald-700">{formatCurrency(data.financial_metrics_comparison.group_b.avg_gross_profit)}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 mb-2">净利润</p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-blue-700">{formatCurrency(data.financial_metrics_comparison.group_a.avg_net_profit)}</span>
                    <span className="font-medium text-emerald-700">{formatCurrency(data.financial_metrics_comparison.group_b.avg_net_profit)}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 mb-2">EBITDA</p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-blue-700">{formatCurrency(data.financial_metrics_comparison.group_a.avg_ebitda)}</span>
                    <span className="font-medium text-emerald-700">{formatCurrency(data.financial_metrics_comparison.group_b.avg_ebitda)}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 mb-2">经营性现金流</p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-blue-700">{formatCurrency(data.financial_metrics_comparison.group_a.avg_operating_cf)}</span>
                    <span className="font-medium text-emerald-700">{formatCurrency(data.financial_metrics_comparison.group_b.avg_operating_cf)}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 mb-2">自由现金流</p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-blue-700">{formatCurrency(data.financial_metrics_comparison.group_a.avg_free_cf)}</span>
                    <span className="font-medium text-emerald-700">{formatCurrency(data.financial_metrics_comparison.group_b.avg_free_cf)}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 mb-2">总资产</p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-blue-700">{formatCurrency(data.financial_metrics_comparison.group_a.avg_total_assets)}</span>
                    <span className="font-medium text-emerald-700">{formatCurrency(data.financial_metrics_comparison.group_b.avg_total_assets)}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 mb-2">总负债</p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-blue-700">{formatCurrency(data.financial_metrics_comparison.group_a.avg_total_liabilities)}</span>
                    <span className="font-medium text-emerald-700">{formatCurrency(data.financial_metrics_comparison.group_b.avg_total_liabilities)}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 mb-2">毛利率</p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-blue-700">{formatPercent(data.financial_metrics_comparison.group_a.avg_gross_margin)}</span>
                    <span className="font-medium text-emerald-700">{formatPercent(data.financial_metrics_comparison.group_b.avg_gross_margin)}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 mb-2">净利率</p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-blue-700">{formatPercent(data.financial_metrics_comparison.group_a.avg_net_margin)}</span>
                    <span className="font-medium text-emerald-700">{formatPercent(data.financial_metrics_comparison.group_b.avg_net_margin)}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 mb-2">流动比率</p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-blue-700">{data.financial_metrics_comparison.group_a.avg_current_ratio.toFixed(2)}</span>
                    <span className="font-medium text-emerald-700">{data.financial_metrics_comparison.group_b.avg_current_ratio.toFixed(2)}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 mb-2">资产负债率</p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-blue-700">{formatPercent(data.financial_metrics_comparison.group_a.avg_debt_to_asset)}</span>
                    <span className="font-medium text-emerald-700">{formatPercent(data.financial_metrics_comparison.group_b.avg_debt_to_asset)}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 mb-2">授信额度</p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-blue-700">{formatCurrency(data.financial_metrics_comparison.group_a.avg_credit_limit)}</span>
                    <span className="font-medium text-emerald-700">{formatCurrency(data.financial_metrics_comparison.group_b.avg_credit_limit)}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 mb-2">授信使用率</p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-blue-700">{formatPercent(data.financial_metrics_comparison.group_a.avg_credit_utilization)}</span>
                    <span className="font-medium text-emerald-700">{formatPercent(data.financial_metrics_comparison.group_b.avg_credit_utilization)}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 mb-2">贷款余额</p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-blue-700">{formatCurrency(data.financial_metrics_comparison.group_a.avg_loan_balance)}</span>
                    <span className="font-medium text-emerald-700">{formatCurrency(data.financial_metrics_comparison.group_b.avg_loan_balance)}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 mb-2">存款余额</p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-blue-700">{formatCurrency(data.financial_metrics_comparison.group_a.avg_deposit_balance)}</span>
                    <span className="font-medium text-emerald-700">{formatCurrency(data.financial_metrics_comparison.group_b.avg_deposit_balance)}</span>
                  </div>
                </div>
              </div>
              {data.financial_metrics_comparison.significant_metrics.length > 0 && (
                <div className="pt-3 border-t border-emerald-100">
                  <p className="text-xs font-bold text-emerald-900 mb-2">显著差异</p>
                  <div className="space-y-2">
                    {data.financial_metrics_comparison.significant_metrics.map((item, idx) => (
                      <div key={idx} className="flex gap-2 items-start text-xs bg-white/50 p-2 rounded-lg">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-bold text-slate-800">{item.metric}:</span>
                          <span className="text-blue-700 ml-1">{item.group_a_value}</span>
                          <span className="text-slate-400 mx-1">vs</span>
                          <span className="text-emerald-700">{item.group_b_value}</span>
                          <span className="text-slate-500 ml-1">({item.difference})</span>
                          <p className="text-slate-600 mt-1">{item.insight}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        <section className="space-y-3">
          <button 
            onClick={() => toggleSection('relationship')}
            className="w-full flex items-center justify-between text-xs font-bold text-purple-600 uppercase tracking-wider hover:text-purple-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Network className="w-3.5 h-3.5" /> 关系网络对比
            </div>
            {collapsedSections.relationship ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          {!collapsedSections.relationship && (
            <div className="bg-purple-50/30 rounded-xl p-4 border border-purple-100 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-[10px] text-slate-400 mb-2">平均关系边数量</p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-blue-700">{data.relationship_comparison.group_a.avg_edge_count}</span>
                    <span className="font-medium text-emerald-700">{data.relationship_comparison.group_b.avg_edge_count}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 mb-2">存在担保链占比</p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-blue-700">{data.relationship_comparison.group_a.has_guarantee_chain_ratio}</span>
                    <span className="font-medium text-emerald-700">{data.relationship_comparison.group_b.has_guarantee_chain_ratio}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 mb-2">风险传染可能占比</p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-blue-700">{data.relationship_comparison.group_a.risk_propagation_ratio}</span>
                    <span className="font-medium text-emerald-700">{data.relationship_comparison.group_b.risk_propagation_ratio}</span>
                  </div>
                </div>
              </div>
              {data.relationship_comparison.significant_differences.length > 0 && (
                <div className="pt-3 border-t border-purple-100">
                  <p className="text-xs font-bold text-purple-900 mb-2">显著差异</p>
                  <div className="space-y-2">
                    {data.relationship_comparison.significant_differences.map((item, idx) => (
                      <div key={idx} className="flex gap-2 items-start text-xs bg-white/50 p-2 rounded-lg">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-bold text-slate-800">{item.metric}:</span>
                          <span className="text-blue-700 ml-1">{item.group_a_value}</span>
                          <span className="text-slate-400 mx-1">vs</span>
                          <span className="text-emerald-700">{item.group_b_value}</span>
                          <p className="text-slate-600 mt-1">{item.insight}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        <section className="space-y-3">
          <button 
            onClick={() => toggleSection('products')}
            className="w-full flex items-center justify-between text-xs font-bold text-orange-600 uppercase tracking-wider hover:text-orange-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Package className="w-3.5 h-3.5" /> 产品使用对比
            </div>
            {collapsedSections.products ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          {!collapsedSections.products && (
            <div className="bg-orange-50/30 rounded-xl p-4 border border-orange-100 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-[10px] text-slate-400 mb-2">平均在用产品数</p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-blue-700">{data.product_comparison.group_a.avg_product_count}</span>
                    <span className="font-medium text-emerald-700">{data.product_comparison.group_b.avg_product_count}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 mb-2">平均覆盖率得分</p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-blue-700">{formatPercent(data.product_comparison.group_a.avg_coverage_score)}</span>
                    <span className="font-medium text-emerald-700">{formatPercent(data.product_comparison.group_b.avg_coverage_score)}</span>
                  </div>
                </div>
              </div>
              {data.product_comparison.significant_differences.length > 0 && (
                <div className="pt-3 border-t border-orange-100">
                  <p className="text-xs font-bold text-orange-900 mb-2">显著差异</p>
                  <div className="space-y-2">
                    {data.product_comparison.significant_differences.map((item, idx) => (
                      <div key={idx} className="flex gap-2 items-start text-xs bg-white/50 p-2 rounded-lg">
                        <Sparkles className="w-3.5 h-3.5 text-orange-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-bold text-slate-800">{item.metric}:</span>
                          <span className="text-blue-700 ml-1">{item.group_a_value}</span>
                          <span className="text-slate-400 mx-1">vs</span>
                          <span className="text-emerald-700">{item.group_b_value}</span>
                          <p className="text-slate-600 mt-1">{item.insight}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        <section className="space-y-3">
          <button 
            onClick={() => toggleSection('risks')}
            className="w-full flex items-center justify-between text-xs font-bold text-red-600 uppercase tracking-wider hover:text-red-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-3.5 h-3.5" /> 风险事件对比
            </div>
            {collapsedSections.risks ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          {!collapsedSections.risks && (
            <div className="bg-red-50/30 rounded-xl p-4 border border-red-100 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-[10px] text-slate-400 mb-2">平均事件数</p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-blue-700">{data.risk_comparison.group_a.avg_event_count}</span>
                    <span className="font-medium text-emerald-700">{data.risk_comparison.group_b.avg_event_count}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 mb-2">平均未关闭事件数</p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-blue-700">{data.risk_comparison.group_a.avg_open_event_count}</span>
                    <span className="font-medium text-emerald-700">{data.risk_comparison.group_b.avg_open_event_count}</span>
                  </div>
                </div>
              </div>
              {data.risk_comparison.significant_differences.length > 0 && (
                <div className="pt-3 border-t border-red-100">
                  <p className="text-xs font-bold text-red-900 mb-2">显著差异</p>
                  <div className="space-y-2">
                    {data.risk_comparison.significant_differences.map((item, idx) => (
                      <div key={idx} className="flex gap-2 items-start text-xs bg-white/50 p-2 rounded-lg">
                        <Sparkles className="w-3.5 h-3.5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-bold text-slate-800">{item.metric}:</span>
                          <span className="text-blue-700 ml-1">{item.group_a_value}</span>
                          <span className="text-slate-400 mx-1">vs</span>
                          <span className="text-emerald-700">{item.group_b_value}</span>
                          <p className="text-slate-600 mt-1">{item.insight}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        <section className="space-y-3">
          <button 
            onClick={() => toggleSection('interactions')}
            className="w-full flex items-center justify-between text-xs font-bold text-cyan-600 uppercase tracking-wider hover:text-cyan-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5" /> 客户互动对比
            </div>
            {collapsedSections.interactions ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          {!collapsedSections.interactions && (
            <div className="bg-cyan-50/30 rounded-xl p-4 border border-cyan-100 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-[10px] text-slate-400 mb-2">平均互动次数</p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-blue-700">{data.interactions_comparison.group_a.avg_interaction_count}</span>
                    <span className="font-medium text-emerald-700">{data.interactions_comparison.group_b.avg_interaction_count}</span>
                  </div>
                </div>
              </div>
              {data.interactions_comparison.significant_differences.length > 0 && (
                <div className="pt-3 border-t border-cyan-100">
                  <p className="text-xs font-bold text-cyan-900 mb-2">显著差异</p>
                  <div className="space-y-2">
                    {data.interactions_comparison.significant_differences.map((item, idx) => (
                      <div key={idx} className="flex gap-2 items-start text-xs bg-white/50 p-2 rounded-lg">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-bold text-slate-800">{item.metric}:</span>
                          <span className="text-blue-700 ml-1">{item.group_a_value}</span>
                          <span className="text-slate-400 mx-1">vs</span>
                          <span className="text-emerald-700">{item.group_b_value}</span>
                          <p className="text-slate-600 mt-1">{item.insight}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        <section className="space-y-3">
          <button 
            onClick={() => toggleSection('insights')}
            className="w-full flex items-center justify-between text-xs font-bold text-indigo-600 uppercase tracking-wider hover:text-indigo-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" /> 核心洞察
            </div>
            {collapsedSections.insights ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          {!collapsedSections.insights && (
            <div className="bg-indigo-50/30 rounded-xl p-4 border border-indigo-100 text-xs">
              <div className="space-y-2">
                {data.comparison_summary.map((summary, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600 mt-0.5 flex-shrink-0" />
                    <p className="text-slate-700">{summary}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-indigo-100">
                <p className="text-[10px] text-slate-400">{data.data_provenance}</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default SegmentComparisonDetail;
