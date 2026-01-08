import { RightPanelType } from '../types';

// 默认客户ID
export const DEFAULT_CUSTOMER_ID = "CUST202500123";

// 右侧面板相关配置
export const RIGHT_PANEL_CONFIG = {
  DEFAULT_WIDTH: 420,
  MIN_WIDTH: 300,
  MAX_WIDTH: 800
};

// 模糊查询正则表达式模式
export const VAGUE_QUERY_PATTERNS = [
  /找一些.*客户/,
  /找.*好客户/,
  /筛选.*客户/,
  /查找.*客户/,
  /推荐.*客户/,
  /优质客户/,
  /潜力客户/,
  /重点客户/
];

// 客户ID映射表
export const CUSTOMER_ID_MAP: Record<string, string> = {
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

// 默认右侧面板类型
export const DEFAULT_RIGHT_PANEL_TYPE = RightPanelType.CUSTOMER_DETAIL;

// 样本过小阈值
export const SMALL_SAMPLE_THRESHOLD = 5;
