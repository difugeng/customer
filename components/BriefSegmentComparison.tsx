import React from 'react';
import { TrendingUp, TrendingDown, Minus, Sparkles, ChevronRight } from 'lucide-react';

/**
 * 简要客群对比组件属性接口
 */
interface BriefSegmentComparisonProps {
  groups: Array<{ name: string; count: number; dsl?: string }>; // 客群组列表
  comparison_summary: string[]; // 对比总结列表
  comparison_table: Array<{ dimension: string; group_a: string; group_b: string; significant: boolean; insight?: string }>; // 对比详情表
  onViewDetail: () => void; // 查看详情的回调
  dataProvenance?: string; // 数据来源
}

/**
 * 简要客群对比组件
 * 功能：展示两个或多个客群的对比分析结果，包括核心洞察和对比详情
 */
const BriefSegmentComparison: React.FC<BriefSegmentComparisonProps> = ({
  groups,
  comparison_summary,
  comparison_table,
  onViewDetail,
  dataProvenance
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
      {/* 标题和基本信息 */}
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-bold text-slate-900">客群对比分析</h4>
          <p className="text-xs text-slate-500 mt-1">
            {groups.map((g, i) => (
              <span key={i} className="inline-flex items-center gap-1 mr-3">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                {g.name} ({g.count}家)
              </span>
            ))}
          </p>
          <div className="mt-2 space-y-1">
            {groups.map((g, i) => (
              <p key={`dsl-${i}`} className="text-[10px] text-slate-500 font-mono bg-slate-50 border border-slate-100 rounded px-2 py-1">
                DSL：{g.dsl || '暂无定义'}
              </p>
            ))}
          </div>
        </div>
        <button
          onClick={onViewDetail}
          className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
        >
          查看详情
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* 核心洞察 */}
      {comparison_summary && comparison_summary.length > 0 && (
        <div className="bg-blue-50 rounded-xl p-4 space-y-2">
          <p className="text-xs font-bold text-blue-900 mb-2">核心洞察</p>
          {comparison_summary.map((summary, idx) => (
            <div key={idx} className="flex gap-2 items-start text-xs text-blue-800">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
              {summary}
            </div>
          ))}
        </div>
      )}

      {/* 对比表格 */}
      <div className="border-t border-slate-100 pt-4">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="text-slate-400 border-b border-slate-50">
              <th className="pb-2 font-medium">对比维度</th>
              <th className="pb-2 font-medium text-right">
                {groups[0]?.name || '客群A'}
              </th>
              <th className="pb-2 font-medium text-right">
                {groups[1]?.name || '客群B'}
              </th>
              <th className="pb-2 font-medium text-center">差异</th>
            </tr>
          </thead>
          <tbody>
            {comparison_table.slice(0, 5).map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50 border-b border-slate-50 last:border-0">
                <td className="py-3 font-medium text-slate-800">
                  {row.dimension}
                  {row.significant && (
                    <span className="ml-1 px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-[10px]">显著</span>
                  )}
                </td>
                <td className="py-3 text-right font-bold text-slate-700">{row.group_a}</td>
                <td className="py-3 text-right font-bold text-slate-700">{row.group_b}</td>
                <td className="py-3 text-center">
                  {row.significant ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mx-auto" />
                  ) : (
                    <Minus className="w-4 h-4 text-slate-400 mx-auto" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 数据来源 */}
      {dataProvenance && (
        <p className="text-[10px] text-slate-500 italic border-t border-slate-100 pt-3">
          {dataProvenance}
        </p>
      )}
    </div>
  );
};

export default BriefSegmentComparison;
