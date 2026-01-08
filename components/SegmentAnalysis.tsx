
// 客群分析组件
// 用于展示客群的详细分析结果，包括基本信息、KPI指标、风险分布和重点客户清单

import React from 'react';
import { SegmentAnalysis as SegmentType } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Users, LayoutDashboard, Search, Save, ListFilter, ShieldAlert } from 'lucide-react';

// 图表颜色常量
const COLORS = ['#ef4444', '#f97316', '#3b82f6', '#10b981'];

// 客群分析组件属性接口
interface SegmentAnalysisProps {
  analysis: SegmentType; // 客群分析数据
  onSave?: () => void; // 保存客群回调函数（可选）
  onViewAll?: () => void; // 查看全部客户回调函数（可选）
}

const SegmentAnalysis: React.FC<SegmentAnalysisProps> = ({ analysis, onSave, onViewAll }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm p-5 space-y-6">
      {/* 组件头部 */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-blue-600" /> 客群洞察: {analysis.segmentName}
          </h2>
          <p className="text-sm text-slate-500">基于定义规则：{analysis.dsl}</p>
        </div>
        {/* 操作按钮 */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onSave} 
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-100"
          >
            <Save className="w-3 h-3" /> 保存客群
          </button>
          <button 
            onClick={onViewAll} 
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800"
          >
            <Search className="w-3 h-3" /> 查看全部
          </button>
        </div>
      </div>

      {/* KPI和风险分布区域 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KPI卡片 */}
        <div className="space-y-4">
          {/* 客户总数卡片 */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
              <Users className="w-3 h-3" /> 客户总数
            </div>
            <p className="text-2xl font-bold text-slate-900">{analysis.customerCount} <span className="text-sm font-normal text-slate-400">家</span></p>
          </div>
          {/* 平均授信使用率卡片 */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
              <ListFilter className="w-3 h-3" /> 平均授信使用率
            </div>
            <p className="text-2xl font-bold text-slate-900">{analysis.avgCreditUtilization}</p>
          </div>
        </div>

        {/* 风险分布饼图 */}
        <div className="h-[180px] flex flex-col items-center">
          <p className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3" /> 风险分布
          </p>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={analysis.riskDistribution}
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {analysis.riskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 风险分布图例 */}
        <div className="flex flex-col justify-center gap-2">
          {analysis.riskDistribution.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
              <span className="text-slate-600 font-medium">{entry.name}:</span>
              <span className="text-slate-900 font-bold">{entry.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* 重点客户清单 */}
      <div className="mt-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">重点客户清单 (前10)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-xs text-slate-500 border-b border-slate-100">
                <th className="pb-2 font-medium">客户名称</th>
                <th className="pb-2 font-medium">所属地区</th>
                <th className="pb-2 font-medium text-right">营收规模</th>
                <th className="pb-2 font-medium text-right">授信余额</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {/* 客户列表 */}
              {analysis.topCustomers.map((cust) => (
                <tr key={cust.id} className="group hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 font-bold text-slate-900 group-hover:text-blue-600 cursor-pointer">{cust.name}</td>
                  <td className="py-2.5 text-slate-500">{cust.location}</td>
                  <td className="py-2.5 text-right font-medium text-slate-700">{cust.financials.revenue}</td>
                  <td className="py-2.5 text-right font-medium text-slate-700">{cust.financials.creditLimit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 数据说明 */}
      <div className="pt-4 border-t border-slate-100 bg-slate-50 -mx-5 -mb-5 p-5 text-[10px] text-slate-400">
        <p className="font-bold mb-1">【数据说明】</p>
        <ul className="list-disc list-inside space-y-0.5">
          <li>基础信息来源于 [crm_customer_profile]</li>
          <li>风险数据经 [crm_risk_events] 实时聚合</li>
          <li>规则引擎逻辑：{analysis.dsl}</li>
        </ul>
      </div>
    </div>
  );
};

export default SegmentAnalysis;
