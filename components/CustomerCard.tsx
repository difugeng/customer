
import React, { useState } from 'react';
import { Customer, ReasoningStep } from '../types';
import { ChevronDown, ChevronUp, AlertCircle, TrendingUp, Building2, MapPin, Database } from 'lucide-react';

interface CustomerCardProps {
  customer: Customer;
  reasoningSteps?: ReasoningStep[];
}

const CustomerCard: React.FC<CustomerCardProps> = ({ customer, reasoningSteps }) => {
  const [showSteps, setShowSteps] = useState(false);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">{customer.name}</h3>
            <p className="text-xs text-slate-500">{customer.industry} | {customer.location}</p>
          </div>
        </div>
        <div className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
          评级: {customer.rating}
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 text-sm">
        <div>
          <p className="text-slate-500 mb-1">年营收 (2025E)</p>
          <p className="font-semibold text-slate-900">{customer.financials.revenue}</p>
        </div>
        <div>
          <p className="text-slate-500 mb-1">授信限额</p>
          <p className="font-semibold text-slate-900">{customer.financials.creditLimit}</p>
        </div>
        <div>
          <p className="text-slate-500 mb-1">授信使用率</p>
          <div className="flex items-center gap-2">
            <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${parseInt(customer.financials.utilization) > 80 ? 'bg-red-500' : 'bg-blue-500'}`}
                style={{ width: customer.financials.utilization }}
              ></div>
            </div>
            <span className="font-semibold">{customer.financials.utilization}</span>
          </div>
        </div>
        <div>
          <p className="text-slate-500 mb-1">现金流状态</p>
          <p className="font-semibold text-green-600">{customer.financials.cashFlow}</p>
        </div>
      </div>

      {/* AI Summary */}
      <div className="px-4 py-3 bg-blue-50/50 border-t border-b border-slate-100 italic text-sm text-slate-700">
        <span className="font-bold text-blue-700 not-italic mr-2">AI 摘要:</span>
        {customer.aiSummary}
      </div>

      {/* Risks */}
      {customer.risks.length > 0 && (
        <div className="p-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-red-500" /> 关键风险事件
          </h4>
          <div className="space-y-2">
            {customer.risks.map((risk, idx) => (
              <div key={idx} className="bg-red-50 p-3 rounded-lg border-l-4 border-red-500 text-sm">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-red-700">{risk.type}</span>
                  <span className="text-[10px] text-red-400">{risk.date}</span>
                </div>
                <p className="text-slate-700 mb-1">{risk.description}</p>
                <p className="text-[10px] text-slate-400 text-right">来源系统：{risk.sourceSystem}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reasoning Steps */}
      {reasoningSteps && (
        <div className="border-t border-slate-100">
          <button 
            onClick={() => setShowSteps(!showSteps)}
            className="w-full px-4 py-2 flex items-center justify-between text-xs font-medium text-slate-500 hover:bg-slate-50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Database className="w-3 h-3" /> 【AI 推理步骤】
            </span>
            {showSteps ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {showSteps && (
            <div className="px-4 pb-4 space-y-3 pt-2">
              {reasoningSteps.map((step, idx) => (
                <div key={idx} className="flex gap-3 text-xs border-l-2 border-slate-200 pl-4 py-1">
                  <span className="font-bold text-slate-400">{idx + 1}️⃣</span>
                  <div className="space-y-1">
                    <p className="font-medium text-slate-700">{step.action}</p>
                    <p className="text-slate-500">
                      匹配字段 <code className="bg-slate-100 px-1 rounded">[{step.matchingField}]</code> 
                      → 索引: <code className="bg-slate-100 px-1 rounded">{step.index}</code>
                    </p>
                    <p className="text-slate-400 italic">值: {step.value} (来源: {step.source})</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerCard;
