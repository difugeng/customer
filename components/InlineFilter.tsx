import React, { useState } from 'react';
import { Plus, Trash2, SlidersHorizontal } from 'lucide-react';

/**
 * 筛选条件接口
 */
interface FilterCondition {
  id: string; // 条件ID
  field: string; // 筛选字段
  operator: string; // 操作符
  value: string; // 筛选值
}

/**
 * 内联筛选组件属性接口
 */
interface InlineFilterProps {
  onApply: (filters: FilterCondition[]) => void; // 应用筛选的回调
  onCancel: () => void; // 取消筛选的回调
}

// 字段选项列表
const FIELD_OPTIONS = [
  { value: 'credit_utilization', label: '授信使用率' },
  { value: 'industry', label: '所属行业' },
  { value: 'region', label: '所属地区' },
  { value: 'revenue_growth', label: '营收增长率' },
  { value: 'cash_flow', label: '现金流状态' },
  { value: 'risk_level', label: '风险等级' },
  { value: 'relationship_rating', label: '关系评级' }
];

// 操作符选项列表
const OPERATOR_OPTIONS = [
  { value: '>', label: '大于' },
  { value: '>=', label: '大于等于' },
  { value: '=', label: '等于' },
  { value: '<=', label: '小于等于' },
  { value: '<', label: '小于' },
  { value: 'contains', label: '包含' },
  { value: 'not_contains', label: '不包含' }
];

// 行业选项列表
const INDUSTRY_OPTIONS = ['新能源', '汽车制造', '半导体', '生物医药', '化工', '机械制造', '电子信息'];
// 地区选项列表
const REGION_OPTIONS = ['上海', '江苏', '浙江', '安徽', '广东', '福建', '北京', '天津'];
// 现金流状态选项列表
const CASH_FLOW_OPTIONS = ['正值', '负值', '持平'];
// 风险等级选项列表
const RISK_LEVEL_OPTIONS = ['高', '中', '低'];
// 关系评级选项列表
const RATING_OPTIONS = ['A+', 'A', 'B+', 'B', 'C'];

/**
 * 内联筛选组件
 * 功能：提供多条件筛选功能，支持添加、删除和修改筛选条件
 */
const InlineFilter: React.FC<InlineFilterProps> = ({ onApply, onCancel }) => {
  // 筛选条件列表状态
  const [conditions, setConditions] = useState<FilterCondition[]>([
    { id: '1', field: 'credit_utilization', operator: '>', value: '80' } // 默认条件
  ]);

  /**
   * 添加筛选条件
   */
  const addCondition = () => {
    const newId = Date.now().toString();
    setConditions([...conditions, { id: newId, field: 'credit_utilization', operator: '>', value: '' }]);
  };

  /**
   * 删除筛选条件
   * @param id 要删除的条件ID
   */
  const removeCondition = (id: string) => {
    setConditions(conditions.filter(c => c.id !== id));
  };

  /**
   * 更新筛选条件
   * @param id 条件ID
   * @param field 要更新的字段名
   * @param value 更新后的值
   */
  const updateCondition = (id: string, field: keyof FilterCondition, value: string) => {
    setConditions(conditions.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  /**
   * 处理应用筛选
   */
  const handleApply = () => {
    // 过滤掉值为空的无效条件
    const validConditions = conditions.filter(c => c.value.trim() !== '');
    onApply(validConditions);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
      {/* 筛选标题 */}
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <SlidersHorizontal className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900">高级筛选</h4>
          <p className="text-[10px] text-slate-500">设置筛选条件以精准定位客户</p>
        </div>
      </div>

      {/* 筛选条件列表 */}
      <div className="space-y-3">
        {conditions.map((condition, index) => (
          <div key={condition.id} className="bg-slate-50 rounded-xl p-3 border border-slate-200">
            {/* 条件标题和删除按钮 */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">条件 {index + 1}</span>
              {/* 只有一个条件时不显示删除按钮 */}
              {conditions.length > 1 && (
                <button
                  onClick={() => removeCondition(condition.id)}
                  className="p-1 hover:bg-red-100 rounded transition-colors"
                >
                  <Trash2 className="w-3 h-3 text-rose-500" />
                </button>
              )}
            </div>
            {/* 条件编辑表单 */}
            <div className="grid grid-cols-3 gap-2">
              {/* 字段选择 */}
              <div>
                <label className="block text-[10px] font-medium text-slate-700 mb-1">字段</label>
                <select
                  value={condition.field}
                  onChange={(e) => updateCondition(condition.id, 'field', e.target.value)}
                  className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {FIELD_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              {/* 操作符选择 */}
              <div>
                <label className="block text-[10px] font-medium text-slate-700 mb-1">操作符</label>
                <select
                  value={condition.operator}
                  onChange={(e) => updateCondition(condition.id, 'operator', e.target.value)}
                  className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {OPERATOR_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              {/* 值输入 - 根据字段类型显示不同的输入控件 */}
              <div>
                <label className="block text-[10px] font-medium text-slate-700 mb-1">值</label>
                {/* 根据字段类型渲染不同的输入控件 */}
                {(() => {
                  if (condition.field === 'industry') {
                    // 行业字段 - 下拉选择
                    return (
                      <select
                        value={condition.value}
                        onChange={(e) => updateCondition(condition.id, 'value', e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">请选择</option>
                        {INDUSTRY_OPTIONS.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    );
                  } else if (condition.field === 'region') {
                    // 地区字段 - 下拉选择
                    return (
                      <select
                        value={condition.value}
                        onChange={(e) => updateCondition(condition.id, 'value', e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">请选择</option>
                        {REGION_OPTIONS.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    );
                  } else if (condition.field === 'cash_flow') {
                    // 现金流状态 - 下拉选择
                    return (
                      <select
                        value={condition.value}
                        onChange={(e) => updateCondition(condition.id, 'value', e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">请选择</option>
                        {CASH_FLOW_OPTIONS.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    );
                  } else if (condition.field === 'risk_level') {
                    // 风险等级 - 下拉选择
                    return (
                      <select
                        value={condition.value}
                        onChange={(e) => updateCondition(condition.id, 'value', e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">请选择</option>
                        {RISK_LEVEL_OPTIONS.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    );
                  } else if (condition.field === 'relationship_rating') {
                    // 关系评级 - 下拉选择
                    return (
                      <select
                        value={condition.value}
                        onChange={(e) => updateCondition(condition.id, 'value', e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">请选择</option>
                        {RATING_OPTIONS.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    );
                  } else {
                    // 其他字段 - 文本输入
                    return (
                      <input
                        type="text"
                        value={condition.value}
                        onChange={(e) => updateCondition(condition.id, 'value', e.target.value)}
                        placeholder="输入值"
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    );
                  }
                })()}
              </div>
            </div>
          </div>
        ))}

        {/* 添加筛选条件按钮 */}
        <button
          onClick={addCondition}
          className="w-full py-2 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2 text-xs font-medium"
        >
          <Plus className="w-3 h-3" />
          添加筛选条件
        </button>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-2 pt-2 border-t border-slate-100">
        <button
          onClick={onCancel}
          className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors text-xs"
        >
          取消
        </button>
        <button
          onClick={handleApply}
          className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-100 text-xs"
        >
          应用筛选
        </button>
      </div>
    </div>
  );
};

export default InlineFilter;
