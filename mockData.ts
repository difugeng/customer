
import { CustomerProfile, ChatMessage, SegmentComparisonDetail, SegmentAnalysisDetail, SavedSegment, MessageType } from './types';

export const MOCK_CUSTOMER_PROFILES: Record<string, CustomerProfile> = {
  "CUST202500123": {
    customer_id: "CUST202500123",
    customer_name: "宁德时代新能源科技股份有限公司",
    customer_type: "corporate",
    rm: {
      employee_id: "RM092",
      name: "陈经理"
    },
    industry: {
      code: "C38",
      name: "新能源"
    },
    scale: {
      employees_range: "10000+",
      revenue_range: "500-1000亿"
    },
    region: "福建省 宁德市",
    group_flag: true,
    group_id: "GROUP_001",
    group_name: "宁德时代集团",
    lifecycle_stage: "mature",
    relationship_rating: "A",
    core_tags: ["新能源", "重资产", "出口导向", "扩产中"],
    created_at: "2022-01-01",
    updated_at: "2024-03-01",
    financial_metrics: {
      customer_id: "CUST202500123",
      period: "2025-Q3",
      metrics: {
        revenue: 89000000000,
        gross_profit: 17800000000,
        net_profit: 9800000000,
        ebitda: 13000000000,
        cash_inflow: 32000000000,
        cash_outflow: 36000000000,
        operating_cf: -4000000000,
        free_cf: -16000000000,
        tax_payment: 2800000000,
        capex: 12000000000,
        total_assets: 180000000000,
        total_liabilities: 110000000000,
        owner_equity: 70000000000,
        ar: 22000000000,
        ap: 14000000000,
        inventory: 18000000000
      },
      trend: {
        revenue_yoy: 0.12,
        net_profit_yoy: -0.05,
        operating_cf_yoy: -0.25,
        cashflow_trend: "down",
        tax_trend: "up"
      },
      ratios: {
        gross_margin: 0.20,
        net_margin: 0.075,
        current_ratio: 1.35,
        quick_ratio: 0.92,
        debt_to_asset: 0.61,
        interest_coverage: 2.8,
        ar_days: 68,
        inventory_days: 75,
        ap_days: 52
      },
      bank_metrics: {
        credit_limit: 10000000000,
        credit_used: 8500000000,
        credit_utilization: 0.85,
        loan_balance: 12000000000,
        deposit_balance: 3500000000,
        avg_loan_rate: 0.042
      },
      rm_focus_topics: ["授信额度", "利率优化", "回款节奏", "现金流压力"],
      ai_flags: ["现金流承压", "CAPEX快速增长"],
      source: "bank_transaction_system",
      as_of_date: "2025-09-30"
    },
    relationship_graph: {
      customer_id: "CUST202500123",
      month: "2024-02",
      updated_at: "2024-02-29",
      edge_count: 2,
      has_guarantee_chain: true,
      risk_propagation_flag: true,
      edges: [
        {
          from_id: "CUST202500123",
          from_type: "company",
          to_id: "CUST202500456",
          to_type: "company",
          relationship_type: "supplier",
          relationship_strength: 0.72,
          financial_exposure: {
            guarantee_amount: 0,
            credit_linked: false
          },
          control_flag: false,
          last_updated: "2024-02-10"
        },
        {
          from_id: "CUST202500456",
          from_type: "company",
          to_id: "CUST202500789",
          to_type: "company",
          relationship_type: "guarantor",
          relationship_strength: 0.65,
          financial_exposure: {
            guarantee_amount: 500000000,
            credit_linked: true
          },
          control_flag: false,
          last_updated: "2024-02-15"
        }
      ],
      month_summary: "识别到供应链上下游关系与担保敞口，存在担保链与潜在风险传染路径，建议关注关键节点主体的授信与逾期信号。",
      ai_flags: ["担保链存在", "风险传染可能", "供应链金融机会"]
    },
    product_usage: {
      customer_id: "CUST202500123",
      month: "2024-02",
      updated_at: "2024-02-29",
      product_count: 2,
      coverage_score: 0.55,
      blank_products: ["现金管理", "票据池"],
      month_summary: "客户在用融资类与结算类产品，但现金管理与票据类仍有空白，存在覆盖率提升机会。",
      products: [
        {
          product_code: "SCF_001",
          product_name: "供应链金融",
          category: "融资类",
          status: "active",
          start_date: "2022-06-01",
          usage_metrics: {
            avg_balance: 800000000,
            utilization_rate: 0.85
          },
          our_bank_share: 0.45,
          primary_bank_flag: true
        },
        {
          product_code: "SETTLE_001",
          product_name: "对公结算",
          category: "结算类",
          status: "active",
          start_date: "2021-03-15",
          usage_metrics: {
            avg_balance: 120000000,
            utilization_rate: 0.60
          },
          our_bank_share: 0.35,
          primary_bank_flag: true
        }
      ]
    },
    risk_events: {
      customer_id: "CUST202500123",
      month: "2024-02",
      updated_at: "2024-02-29",
      event_count: 2,
      max_risk_level: "HIGH",
      risk_types: ["credit", "compliance"],
      open_event_count: 1,
      month_summary: "当月出现授信使用率高位与合规提示事件，需保守提示客户与内部同步处置进度，并明确来源系统。",
      events: [
        {
          risk_type: "credit",
          risk_level: "HIGH",
          event: "授信额度使用率超过90%",
          trigger_metric: "credit_utilization",
          detected_at: "2024-02-15",
          status: "open",
          source: "internal_risk_system",
          ai_comment: "风险等级为 HIGH，需提示客户额度紧张与可能的授信约束，不能弱化风险表述，并明确来源为内部风险系统。"
        },
        {
          risk_type: "compliance",
          risk_level: "MEDIUM",
          event: "部分贸易背景单据需补充合规材料",
          trigger_metric: "kyc_document_missing",
          detected_at: "2024-02-18",
          status: "closed",
          source: "compliance_case_system",
          ai_comment: "合规事项已闭环，但建议在随访中确认材料归档与后续同类业务的合规要求。"
        }
      ],
      ai_flags: ["授信使用率高", "合规提示"]
    },
    interactions: {
      customer_id: "CUST202500123",
      month: "2024-01",
      updated_at: "2024-01-31",
      interaction_count: 2,
      month_topics: ["授信额度", "利率优化"],
      month_summary: "客户关注授信额度与价格，询问是否可优化贷款利率。",
      interactions: [
        {
          interaction_type: "meeting",
          date: "2024-01-12",
          participants: ["RM_001", "财务总监"],
          topics: ["授信额度", "利率优化"],
          raw_notes: "客户希望在现有授信基础上提升额度，并对我行贷款利率提出对标同业的诉求。",
          pending_actions: ["准备授信提升方案", "梳理同业利率对标材料"],
          ai_summary: "客户对授信与利率敏感，需准备提升方案与定价沟通材料。"
        },
        {
          interaction_type: "call",
          date: "2024-01-26",
          participants: ["RM_001", "财务经理"],
          topics: ["材料补充", "授信流程"],
          raw_notes: "沟通授信材料补充清单与预计审批节奏。",
          pending_actions: ["发送材料清单", "确认内部审批节点"],
          ai_summary: "客户配合补充材料，需给出明确时间表。"
        }
      ],
      ai_flags: ["价格敏感", "授信诉求明确"]
    }
  },
  "CUST202500124": {
    customer_id: "CUST202500124",
    customer_name: "比亚迪股份有限公司",
    customer_type: "corporate",
    rm: {
      employee_id: "RM156",
      name: "李经理"
    },
    industry: {
      code: "C36",
      name: "汽车制造"
    },
    scale: {
      employees_range: "50000+",
      revenue_range: "1000-5000亿"
    },
    region: "广东省 深圳市",
    group_flag: true,
    group_id: "GROUP_002",
    group_name: "比亚迪集团",
    lifecycle_stage: "mature",
    relationship_rating: "A+",
    core_tags: ["新能源汽车", "智能制造", "国际化", "产业链完整"],
    created_at: "2022-01-01",
    updated_at: "2024-03-01",
    financial_metrics: {
      customer_id: "CUST202500124",
      period: "2025-Q3",
      metrics: {
        revenue: 125000000000,
        gross_profit: 25000000000,
        net_profit: 15600000000,
        ebitda: 20000000000,
        cash_inflow: 45000000000,
        cash_outflow: 40000000000,
        operating_cf: 5000000000,
        free_cf: -7000000000,
        tax_payment: 4500000000,
        capex: 12000000000,
        total_assets: 200000000000,
        total_liabilities: 110000000000,
        owner_equity: 90000000000,
        ar: 25000000000,
        ap: 18000000000,
        inventory: 22000000000
      },
      trend: {
        revenue_yoy: 0.18,
        net_profit_yoy: 0.08,
        operating_cf_yoy: 0.15,
        cashflow_trend: "up",
        tax_trend: "up"
      },
      ratios: {
        gross_margin: 0.20,
        net_margin: 0.125,
        current_ratio: 1.45,
        quick_ratio: 1.02,
        debt_to_asset: 0.55,
        interest_coverage: 3.5,
        ar_days: 72,
        inventory_days: 65,
        ap_days: 55
      },
      bank_metrics: {
        credit_limit: 15000000000,
        credit_used: 9000000000,
        credit_utilization: 0.60,
        loan_balance: 10000000000,
        deposit_balance: 5000000000,
        avg_loan_rate: 0.038
      },
      rm_focus_topics: ["授信额度", "利率优化", "海外扩张", "跨境结算"],
      ai_flags: ["现金流健康", "扩张期"],
      source: "bank_transaction_system",
      as_of_date: "2025-09-30"
    },
    relationship_graph: {
      customer_id: "CUST202500124",
      month: "2024-02",
      updated_at: "2024-02-29",
      edge_count: 2,
      has_guarantee_chain: false,
      risk_propagation_flag: false,
      edges: [
        {
          from_id: "CUST202500124",
          from_type: "company",
          to_id: "CUST202500456",
          to_type: "company",
          relationship_type: "supplier",
          relationship_strength: 0.85,
          financial_exposure: {
            guarantee_amount: 0,
            credit_linked: false
          },
          control_flag: false,
          last_updated: "2024-02-10"
        },
        {
          from_id: "CUST202500124",
          from_type: "company",
          to_id: "CUST202500789",
          to_type: "company",
          relationship_type: "shareholder",
          relationship_strength: 0.90,
          financial_exposure: {
            guarantee_amount: 0,
            credit_linked: false
          },
          control_flag: true,
          last_updated: "2024-02-15"
        }
      ],
      month_summary: "产业链地位稳固，合作关系稳定，无担保链风险。",
      ai_flags: ["产业链完整", "合作关系稳定"]
    },
    product_usage: {
      customer_id: "CUST202500124",
      month: "2024-02",
      updated_at: "2024-02-29",
      product_count: 4,
      coverage_score: 0.80,
      blank_products: ["并购贷款", "绿色债券"],
      month_summary: "客户产品覆盖全面，融资类、结算类、现金管理类产品均有使用，存在并购贷款和绿色债券机会。",
      products: [
        {
          product_code: "SCF_001",
          product_name: "供应链金融",
          category: "融资类",
          status: "active",
          start_date: "2022-06-01",
          usage_metrics: {
            avg_balance: 1200000000,
            utilization_rate: 0.75
          },
          our_bank_share: 0.55,
          primary_bank_flag: true
        },
        {
          product_code: "SETTLE_001",
          product_name: "对公结算",
          category: "结算类",
          status: "active",
          start_date: "2021-03-15",
          usage_metrics: {
            avg_balance: 250000000,
            utilization_rate: 0.70
          },
          our_bank_share: 0.45,
          primary_bank_flag: true
        },
        {
          product_code: "CASH_001",
          product_name: "现金管理",
          category: "现金管理类",
          status: "active",
          start_date: "2022-01-01",
          usage_metrics: {
            avg_balance: 800000000,
            utilization_rate: 0.65
          },
          our_bank_share: 0.50,
          primary_bank_flag: true
        },
        {
          product_code: "BILL_001",
          product_name: "票据池",
          category: "结算类",
          status: "active",
          start_date: "2022-08-01",
          usage_metrics: {
            avg_balance: 600000000,
            utilization_rate: 0.80
          },
          our_bank_share: 0.60,
          primary_bank_flag: true
        }
      ]
    },
    risk_events: {
      customer_id: "CUST202500124",
      month: "2024-02",
      updated_at: "2024-02-29",
      event_count: 0,
      max_risk_level: "LOW",
      risk_types: [],
      open_event_count: 0,
      month_summary: "当月无风险事件，客户风险状况良好。",
      events: [],
      ai_flags: []
    },
    interactions: {
      customer_id: "CUST202500124",
      month: "2024-01",
      updated_at: "2024-01-31",
      interaction_count: 2,
      month_topics: ["海外扩张", "跨境结算"],
      month_summary: "客户关注海外扩张和跨境结算业务。",
      interactions: [
        {
          interaction_type: "meeting",
          date: "2024-01-15",
          participants: ["RM_156", "财务总监"],
          topics: ["海外扩张", "跨境结算"],
          raw_notes: "客户计划在欧洲建厂，需要跨境结算和汇率风险管理方案。",
          pending_actions: ["准备跨境结算方案", "提供汇率风险管理建议"],
          ai_summary: "客户海外扩张需求明确，需提供综合金融服务方案。"
        },
        {
          interaction_type: "call",
          date: "2024-01-28",
          participants: ["RM_156", "财务经理"],
          topics: ["授信额度", "利率优化"],
          raw_notes: "沟通授信额度提升和利率优化事宜。",
          pending_actions: ["准备授信提升方案", "梳理利率对标材料"],
          ai_summary: "客户对授信和利率敏感，需准备提升方案和定价沟通材料。"
        }
      ],
      ai_flags: ["海外扩张", "跨境结算"]
    }
  }
};

const MOCK_SEGMENT_RESULTS = {
  "高风险": {
    summary: {
      total_count: 15,
      insights: [
        "授信使用率超过 80% 的客户占比 40%",
        "有 3 家客户存在逾期记录",
        "现金流为负的客户占比 27%"
      ]
    },
    customer_list: [
      { name: "宁德时代新能源科技股份有限公司", region: "福建省 宁德市", credit_util: "85%" },
      { name: "上海华虹半导体有限公司", region: "上海市 浦东新区", credit_util: "92%" },
      { name: "中芯国际集成电路制造有限公司", region: "上海市 浦东新区", credit_util: "88%" },
      { name: "江苏长电科技股份有限公司", region: "江苏省 江阴市", credit_util: "81%" },
      { name: "中微半导体设备（上海）股份有限公司", region: "上海市 浦东新区", credit_util: "79%" }
    ]
  },
  "长三角": {
    summary: {
      total_count: 42,
      insights: [
        "平均授信使用率 65%",
        "新能源行业客户占比 35%",
        "上市公司占比 60%"
      ]
    },
    customer_list: [
      { name: "上海华虹半导体有限公司", region: "上海市 浦东新区", credit_util: "92%" },
      { name: "中芯国际集成电路制造有限公司", region: "上海市 浦东新区", credit_util: "88%" },
      { name: "江苏长电科技股份有限公司", region: "江苏省 江阴市", credit_util: "81%" },
      { name: "中微半导体设备（上海）股份有限公司", region: "上海市 浦东新区", credit_util: "79%" },
      { name: "上海韦尔半导体股份有限公司", region: "上海市 浦东新区", credit_util: "65%" }
    ]
  },
  "新能源": {
    summary: {
      total_count: 28,
      insights: [
        "平均授信使用率 72%",
        "现金流为负的客户占比 32%",
        "扩产中客户占比 50%"
      ]
    },
    customer_list: [
      { name: "宁德时代新能源科技股份有限公司", region: "福建省 宁德市", credit_util: "85%" },
      { name: "比亚迪股份有限公司", region: "广东省 深圳市", credit_util: "60%" },
      { name: "隆基绿能科技股份有限公司", region: "陕西省 西安市", credit_util: "75%" },
      { name: "晶科能源股份有限公司", region: "江西省 上饶市", credit_util: "68%" },
      { name: "天合光能股份有限公司", region: "江苏省 常州市", credit_util: "71%" }
    ]
  }
};

export class DataService {
  private useMock: boolean = true;

  constructor() {
    this.useMock = true;
  }

  async processRequest(input: string, context?: any): Promise<Partial<ChatMessage>> {
    if (this.useMock) {
      return this.getMockResponse(input, context);
    }

    return this.getRealAPIResponse(input, context);
  }

  private getMockResponse(input: string, context?: any): Partial<ChatMessage> {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('宁德时代')) {
      return {
        middle_panel: {
          message_type: 'customer_cards',
          cards: [{
            customer_id: "CUST202500123",
            display_name: "宁德时代新能源科技股份有限公司",
            tags: ["新能源", "重资产", "出口导向", "扩产中"],
            key_metrics: {
              "授信使用率": "85%",
              "风险事件": "1 HIGH"
            },
            ai_summary: "客户计划新建电池产线，需30亿融资，对我行利率敏感",
            cof_expansion: {
              steps: [
                "1️⃣ 匹配字段 [crm_customer_profile.name] → ID: CUST202500123",
                "2️⃣ 从 [crm_financial_metrics] 获取 [credit_utilization]",
                "3️⃣ 触发 [信用风险预警模型] (来源: 信贷管理系统)"
              ]
            }
          }]
        },
        right_panel: MOCK_CUSTOMER_PROFILES["CUST202500123"]
      };
    }

    if (lowerInput.includes('比亚迪')) {
      return {
        middle_panel: {
          message_type: 'customer_cards',
          cards: [{
            customer_id: "CUST202500124",
            display_name: "比亚迪股份有限公司",
            tags: ["新能源汽车", "智能制造", "国际化", "产业链完整"],
            key_metrics: {
              "授信使用率": "60%",
              "风险事件": "0"
            },
            ai_summary: "客户计划在欧洲建厂，需要跨境结算和汇率风险管理方案",
            cof_expansion: {
              steps: [
                "1️⃣ 匹配字段 [crm_customer_profile.name] → ID: CUST202500124",
                "2️⃣ 从 [crm_financial_metrics] 获取 [credit_utilization]",
                "3️⃣ 从 [crm_interactions] 获取最近互动记录"
              ]
            }
          }]
        },
        right_panel: MOCK_CUSTOMER_PROFILES["CUST202500124"]
      };
    }

    if (lowerInput.includes('高风险')) {
      return {
        middle_panel: {
          message_type: 'segment_result',
          ...MOCK_SEGMENT_RESULTS["高风险"]
        }
      };
    }

    if (lowerInput.includes('长三角')) {
      return {
        middle_panel: {
          message_type: 'segment_result',
          ...MOCK_SEGMENT_RESULTS["长三角"]
        }
      };
    }

    if (lowerInput.includes('新能源')) {
      return {
        middle_panel: {
          message_type: 'segment_result',
          ...MOCK_SEGMENT_RESULTS["新能源"]
        }
      };
    }

    if (lowerInput.includes('对比') || lowerInput.includes('比较')) {
      return {
        middle_panel: {
          message_type: 'segment_comparison',
          comparison_table: [
            { dimension: "平均授信使用率", group_a: "85%", group_b: "60%", significant: true, insight: "高风险客群授信使用率显著高于新能源客群" },
            { dimension: "现金流为负占比", group_a: "32%", group_b: "18%", significant: true, insight: "高风险客群现金流压力更大" },
            { dimension: "平均营收增长率", group_a: "+12%", group_b: "+18%", significant: false, insight: "新能源客群增长势头更好" },
            { dimension: "风险事件数", group_a: "1", group_b: "0", significant: true, insight: "高风险客群存在更多风险事件" },
            { dimension: "产品覆盖率", group_a: "55%", group_b: "72%", significant: true, insight: "新能源客群产品覆盖更全面" },
            { dimension: "平均关系评级", group_a: "B+", group_b: "A", significant: true, insight: "新能源客群关系评级更高" }
          ],
          groups: [
            { name: "高风险客户", count: 15, dsl: "授信使用率 > 80% 或 存在逾期记录" },
            { name: "新能源行业", count: 28, dsl: "行业包含'新能源'或'光伏'或'风电'" }
          ],
          data_provenance: "数据来源：crm_financial_metrics, crm_risk_events, crm_product_usage",
          comparison_summary: [
            "高风险客群授信使用率高出 25 个百分点，需关注还款能力",
            "新能源客群产品覆盖率更高，存在交叉销售机会",
            "建议对高风险客群加强贷后管理，对新能源客群推广综合金融服务"
          ]
        }
      };
    }

    if (lowerInput.includes('筛选客户')) {
      return {
        middle_panel: {
          message_type: 'segment_result',
          summary: {
            total_count: 12,
            insights: [
              `根据筛选条件找到 ${12} 家客户`,
              "授信使用率较高的客户占比 65%",
              "建议优先关注现金流为负的客户"
            ]
          },
          customer_list: [
            { name: "宁德时代新能源科技股份有限公司", region: "福建省", credit_util: "85%" },
            { name: "比亚迪股份有限公司", region: "广东省", credit_util: "60%" },
            { name: "隆基绿能科技股份有限公司", region: "陕西省", credit_util: "78%" },
            { name: "通威股份有限公司", region: "四川省", credit_util: "82%" },
            { name: "晶澳太阳能科技股份有限公司", region: "河北省", credit_util: "75%" },
            { name: "天合光能股份有限公司", region: "江苏省", credit_util: "70%" },
            { name: "晶科能源股份有限公司", region: "江西省", credit_util: "68%" },
            { name: "阳光电源股份有限公司", region: "安徽省", credit_util: "72%" },
            { name: "阿特斯阳光电力集团", region: "江苏省", credit_util: "65%" },
            { name: "东方日升新能源股份有限公司", region: "浙江省", credit_util: "80%" },
            { name: "正泰电器股份有限公司", region: "浙江省", credit_util: "55%" },
            { name: "固德威技术股份有限公司", region: "江苏省", credit_util: "88%" }
          ]
        }
      };
    }

    return {
      middle_panel: {
        message_type: 'clarification',
        text: '您可以查询以下内容：',
        options: [
          "宁德时代怎么样",
          "比亚迪怎么样",
          "查看高风险客群",
          "查看长三角客群",
          "查看新能源客群",
          "宁德时代和比亚迪对比"
        ]
      }
    };
  }

  private async getRealAPIResponse(input: string, context?: any): Promise<Partial<ChatMessage>> {
    console.log('API 调用接口已预留，当前使用 mock 数据模式');
    return this.getMockResponse(input, context);
  }

  setUseMock(useMock: boolean) {
    this.useMock = useMock;
  }
}

// 导出特定客户资料供 App.tsx 使用
export const getMockCustomerProfile = (id: string): CustomerProfile | undefined => {
  // Return the matching profile if found, otherwise return the default profile
  return MOCK_CUSTOMER_PROFILES[id] || MOCK_CUSTOMER_PROFILES["CUST202500123"];
};

const MOCK_SEGMENT_RESULT_BY_ID: Record<string, { segment_id: string; segment_name: string; segment_dsl: string; summary: { total_count: number; insights: string[] }; customer_list: Array<{ name: string; region: string; credit_util: string }> }> = {
  '1': {
    segment_id: 'segment_high_risk',
    segment_name: '高风险客户',
    segment_dsl: '授信使用率 > 80% 或 存在逾期记录',
    ...MOCK_SEGMENT_RESULTS["高风险"]
  },
  '2': {
    segment_id: 'segment_yangtze_river_delta',
    segment_name: '长三角客群',
    segment_dsl: '地区 = 上海/江苏/浙江/安徽',
    ...MOCK_SEGMENT_RESULTS["长三角"]
  },
  '3': {
    segment_id: 'segment_new_energy',
    segment_name: '新能源行业',
    segment_dsl: '行业包含"新能源"或"光伏"或"风电"',
    ...MOCK_SEGMENT_RESULTS["新能源"]
  }
};

export const getMockSegmentResultById = (id: string): Partial<ChatMessage> | null => {
  const result = MOCK_SEGMENT_RESULT_BY_ID[id];
  if (!result) return null;

  return {
    content: result.segment_dsl,
    segment_id: result.segment_id,
    segment_name: result.segment_name,
    from_saved_segment: true,
    middle_panel: {
      message_type: 'segment_result',
      summary: result.summary,
      customer_list: result.customer_list,
      data_provenance: '数据来源：crm_customer_profile, crm_financial_metrics, crm_risk_events'
    }
  };
};

const MOCK_SEGMENT_COMPARISON_DETAIL: SegmentComparisonDetail = {
  comparison_id: 'comparison_001',
  groups: [
    { id: 'high_risk', name: '高风险客户', dsl: '授信使用率 > 80% 或 存在逾期记录', customer_count: 15 },
    { id: 'new_energy', name: '新能源行业', dsl: '行业包含"新能源"或"光伏"或"风电"', customer_count: 28 }
  ],
  comparison_summary: [
    '高风险客群授信使用率高出 25 个百分点，需关注还款能力',
    '新能源客群产品覆盖率更高，存在交叉销售机会',
    '建议对高风险客群加强贷后管理，对新能源客群推广综合金融服务'
  ],
  customer_profile_comparison: {
    customer_types: [
      { name: '企业客户', group_a_count: 15, group_b_count: 10, group_a_ratio: '75%', group_b_ratio: '50%', significant: true },
      { name: '个体工商户', group_a_count: 5, group_b_count: 10, group_a_ratio: '25%', group_b_ratio: '50%', significant: true }
    ],
    industries: [
      { name: '制造业', group_a_count: 12, group_b_count: 8, group_a_ratio: '60%', group_b_ratio: '40%', significant: false },
      { name: '批发零售', group_a_count: 6, group_b_count: 7, group_a_ratio: '30%', group_b_ratio: '35%', significant: false },
      { name: '服务业', group_a_count: 2, group_b_count: 5, group_a_ratio: '10%', group_b_ratio: '25%', significant: true }
    ],
    employee_scales: [
      { name: '10-50人', group_a_count: 8, group_b_count: 10, group_a_ratio: '40%', group_b_ratio: '50%', significant: false },
      { name: '50-200人', group_a_count: 10, group_b_count: 7, group_a_ratio: '50%', group_b_ratio: '35%', significant: false },
      { name: '200人以上', group_a_count: 2, group_b_count: 3, group_a_ratio: '10%', group_b_ratio: '15%', significant: false }
    ],
    revenue_scales: [
      { name: '1000万以下', group_a_count: 5, group_b_count: 8, group_a_ratio: '25%', group_b_ratio: '40%', significant: false },
      { name: '1000万-5000万', group_a_count: 10, group_b_count: 8, group_a_ratio: '50%', group_b_ratio: '40%', significant: false },
      { name: '5000万以上', group_a_count: 5, group_b_count: 4, group_a_ratio: '25%', group_b_ratio: '20%', significant: false }
    ],
    regions: [
      { name: '上海', group_a_count: 8, group_b_count: 6, group_a_ratio: '40%', group_b_ratio: '30%', significant: false },
      { name: '江苏', group_a_count: 7, group_b_count: 8, group_a_ratio: '35%', group_b_ratio: '40%', significant: false },
      { name: '浙江', group_a_count: 5, group_b_count: 6, group_a_ratio: '25%', group_b_ratio: '30%', significant: false }
    ],
    lifecycle_stages: [
      { name: '成长期', group_a_count: 8, group_b_count: 7, group_a_ratio: '40%', group_b_ratio: '35%', significant: false },
      { name: '成熟期', group_a_count: 10, group_b_count: 9, group_a_ratio: '50%', group_b_ratio: '45%', significant: false },
      { name: '衰退期', group_a_count: 2, group_b_count: 4, group_a_ratio: '10%', group_b_ratio: '20%', significant: false }
    ],
    relationship_ratings: [
      { name: 'AAA', group_a_count: 3, group_b_count: 2, group_a_ratio: '15%', group_b_ratio: '10%', significant: false },
      { name: 'AA', group_a_count: 7, group_b_count: 6, group_a_ratio: '35%', group_b_ratio: '30%', significant: false },
      { name: 'A', group_a_count: 8, group_b_count: 9, group_a_ratio: '40%', group_b_ratio: '45%', significant: false },
      { name: 'BBB', group_a_count: 2, group_b_count: 3, group_a_ratio: '10%', group_b_ratio: '15%', significant: false }
    ],
    group_ratio: { group_a: '20%', group_b: '15%', significant: false }
  },
  financial_metrics_comparison: {
    group_a: {
      avg_revenue: 50000000,
      avg_gross_profit: 15000000,
      avg_net_profit: 8000000,
      avg_ebitda: 12000000,
      avg_cash_inflow: 55000000,
      avg_cash_outflow: 48000000,
      avg_operating_cf: 12000000,
      avg_free_cf: 8000000,
      avg_tax_payment: 5000000,
      avg_capex: 3000000,
      avg_total_assets: 100000000,
      avg_total_liabilities: 55000000,
      avg_owner_equity: 45000000,
      avg_ar: 15000000,
      avg_ap: 12000000,
      avg_inventory: 20000000,
      revenue_yoy: 0.15,
      net_profit_yoy: 0.12,
      operating_cf_yoy: 0.10,
      cashflow_trend: '增长',
      tax_trend: '稳定',
      avg_gross_margin: 0.30,
      avg_net_margin: 0.16,
      avg_current_ratio: 1.8,
      avg_quick_ratio: 1.2,
      avg_debt_to_asset: 0.55,
      avg_interest_coverage: 3.5,
      avg_ar_days: 45,
      avg_inventory_days: 60,
      avg_ap_days: 50,
      avg_credit_limit: 30000000,
      avg_credit_used: 19500000,
      avg_credit_utilization: 0.65,
      avg_loan_balance: 15000000,
      avg_deposit_balance: 8000000,
      avg_loan_rate: 0.045
    },
    group_b: {
      avg_revenue: 45000000,
      avg_gross_profit: 12000000,
      avg_net_profit: 6000000,
      avg_ebitda: 10000000,
      avg_cash_inflow: 48000000,
      avg_cash_outflow: 42000000,
      avg_operating_cf: 10000000,
      avg_free_cf: 6000000,
      avg_tax_payment: 4000000,
      avg_capex: 2500000,
      avg_total_assets: 90000000,
      avg_total_liabilities: 50000000,
      avg_owner_equity: 40000000,
      avg_ar: 13000000,
      avg_ap: 11000000,
      avg_inventory: 18000000,
      revenue_yoy: 0.12,
      net_profit_yoy: 0.10,
      operating_cf_yoy: 0.08,
      cashflow_trend: '稳定',
      tax_trend: '下降',
      avg_gross_margin: 0.27,
      avg_net_margin: 0.13,
      avg_current_ratio: 1.6,
      avg_quick_ratio: 1.1,
      avg_debt_to_asset: 0.56,
      avg_interest_coverage: 3.2,
      avg_ar_days: 50,
      avg_inventory_days: 65,
      avg_ap_days: 55,
      avg_credit_limit: 25000000,
      avg_credit_used: 15000000,
      avg_credit_utilization: 0.60,
      avg_loan_balance: 12000000,
      avg_deposit_balance: 6000000,
      avg_loan_rate: 0.046
    },
    significant_metrics: [
      { metric: '营业收入', group_a_value: '5000万', group_b_value: '4500万', difference: '+11.1%', insight: '客群A营业收入显著高于客群B' },
      { metric: '净利润', group_a_value: '800万', group_b_value: '600万', difference: '+33.3%', insight: '客群A盈利能力更强' },
      { metric: '授信使用率', group_a_value: '65%', group_b_value: '60%', difference: '+5%', insight: '客群A授信使用率略高' },
      { metric: '毛利率', group_a_value: '30%', group_b_value: '27%', difference: '+3%', insight: '客群A毛利率略高' }
    ]
  },
  relationship_comparison: {
    group_a: {
      avg_edge_count: 45,
      has_guarantee_chain_ratio: '20%',
      risk_propagation_ratio: '15%',
      month_summary: '本月新增关联关系5条，发现担保链风险'
    },
    group_b: {
      avg_edge_count: 38,
      has_guarantee_chain_ratio: '15%',
      risk_propagation_ratio: '10%',
      month_summary: '本月新增关联关系3条，担保链风险较低'
    },
    significant_differences: [
      { metric: '平均关联关系数', group_a_value: '45', group_b_value: '38', insight: '客群A关联关系更复杂' },
      { metric: '担保链比例', group_a_value: '20%', group_b_value: '15%', insight: '客群A担保链风险更高' }
    ]
  },
  product_comparison: {
    group_a: {
      avg_product_count: 8,
      avg_coverage_score: 0.75,
      blank_products: ['贸易融资', '供应链金融'],
      month_summary: '本月新增产品使用3户，覆盖率提升5%'
    },
    group_b: {
      avg_product_count: 10,
      avg_coverage_score: 0.85,
      blank_products: ['并购贷款', '绿色债券'],
      month_summary: '本月新增产品使用5户，覆盖率提升8%'
    },
    significant_differences: [
      { metric: '平均产品数', group_a_value: '8', group_b_value: '10', insight: '客群B产品覆盖更全面' },
      { metric: '覆盖率', group_a_value: '75%', group_b_value: '85%', insight: '客群B产品覆盖率更高' }
    ]
  },
  risk_comparison: {
    group_a: {
      avg_event_count: 15,
      avg_open_event_count: 5,
      risk_type_distribution: [
        { name: '信用风险', count: 8, ratio: '53%' },
        { name: '操作风险', count: 4, ratio: '27%' },
        { name: '市场风险', count: 3, ratio: '20%' }
      ],
      month_summary: '本月新增风险事件3起，其中高风险1起'
    },
    group_b: {
      avg_event_count: 8,
      avg_open_event_count: 2,
      risk_type_distribution: [
        { name: '信用风险', count: 5, ratio: '63%' },
        { name: '操作风险', count: 2, ratio: '25%' },
        { name: '市场风险', count: 1, ratio: '12%' }
      ],
      month_summary: '本月新增风险事件1起，风险水平较低'
    },
    significant_differences: [
      { metric: '平均风险事件数', group_a_value: '15', group_b_value: '8', insight: '客群A风险事件更多' },
      { metric: '未结事件数', group_a_value: '5', group_b_value: '2', insight: '客群A未结风险事件更多' }
    ]
  },
  interactions_comparison: {
    group_a: {
      avg_interaction_count: 120,
      month_topics: [
        { name: '授信审批', count: 45, ratio: '38%' },
        { name: '产品咨询', count: 35, ratio: '29%' },
        { name: '风险预警', count: 25, ratio: '21%' },
        { name: '其他', count: 15, ratio: '12%' }
      ],
      month_summary: '本月互动次数增加20%，主要围绕授信审批'
    },
    group_b: {
      avg_interaction_count: 150,
      month_topics: [
        { name: '产品咨询', count: 60, ratio: '40%' },
        { name: '授信审批', count: 50, ratio: '33%' },
        { name: '风险预警', count: 25, ratio: '17%' },
        { name: '其他', count: 15, ratio: '10%' }
      ],
      month_summary: '本月互动次数增加15%，主要围绕产品咨询'
    },
    significant_differences: [
      { metric: '平均互动次数', group_a_value: '120', group_b_value: '150', insight: '客群B互动更频繁' },
      { metric: '产品咨询占比', group_a_value: '29%', group_b_value: '40%', insight: '客群B对产品更感兴趣' }
    ]
  },
  data_provenance: '数据来源：crm_financial_metrics, crm_risk_events, crm_product_usage, crm_relationship_graph, crm_interactions'
};

export const getMockSegmentComparisonDetail = (): SegmentComparisonDetail => {
  return MOCK_SEGMENT_COMPARISON_DETAIL;
};

export const getMockSegmentComparisonByIds = (segmentIds: string[], savedSegments: SavedSegment[]): { comparison: Partial<ChatMessage>; detail: SegmentComparisonDetail } => {
  const detail = { ...getMockSegmentComparisonDetail() };
  const selectedSegments = savedSegments.filter(seg => segmentIds.includes(seg.id));

  if (selectedSegments.length >= 2) {
    detail.groups = selectedSegments.slice(0, 2).map((seg, idx) => ({
      id: seg.id,
      name: seg.name,
      dsl: seg.dsl,
      customer_count: seg.customer_count
    }));
  }

  const comparison: Partial<ChatMessage> = {
    middle_panel: {
      message_type: 'segment_comparison',
      groups: detail.groups,
      comparison_summary: detail.comparison_summary,
      comparison_table: detail.financial_metrics_comparison.significant_metrics.map(item => ({
        dimension: item.metric,
        group_a: item.group_a_value,
        group_b: item.group_b_value,
        significant: true,
        insight: item.insight
      })),
      data_provenance: detail.data_provenance
    }
  };

  return { comparison, detail };
};

const MOCK_SEGMENT_ANALYSIS_DETAIL: SegmentAnalysisDetail = {
  segment_id: 'segment_001',
  segment_name: '客群分析',
  segment_dsl: '授信使用率 > 80% 或 存在逾期记录',
  customer_count: 20,
  period: '2026-01',
  summary: {
    total_count: 20,
    avg_relationship_rating: 'BBB',
    negative_cashflow_count: 2,
    negative_cashflow_ratio: '10%',
    high_risk_count: 3,
    high_risk_ratio: '15%'
  },
  customer_profile: {
    customer_types: [
      { name: '企业客户', count: 15 },
      { name: '个体工商户', count: 5 }
    ],
    industries: [
      { name: '制造业', count: 12 },
      { name: '批发零售', count: 6 },
      { name: '服务业', count: 2 }
    ],
    employee_scales: [
      { name: '10-50人', count: 8 },
      { name: '50-200人', count: 10 },
      { name: '200人以上', count: 2 }
    ],
    revenue_scales: [
      { name: '1000万以下', count: 5 },
      { name: '1000万-5000万', count: 10 },
      { name: '5000万以上', count: 5 }
    ],
    regions: [
      { name: '上海', count: 8 },
      { name: '江苏', count: 7 },
      { name: '浙江', count: 5 }
    ],
    group_ratio: '20%',
    lifecycle_stages: [
      { name: '成长期', count: 8 },
      { name: '成熟期', count: 10 },
      { name: '衰退期', count: 2 }
    ],
    relationship_ratings: [
      { name: 'AAA', count: 3 },
      { name: 'AA', count: 7 },
      { name: 'A', count: 8 },
      { name: 'BBB', count: 2 }
    ],
    core_tags: [
      { name: '高价值', count: 5 },
      { name: '潜力客户', count: 8 },
      { name: '风险关注', count: 7 }
    ]
  },
  financial_metrics: {
    avg_revenue: 50000000,
    avg_gross_profit: 15000000,
    avg_net_profit: 8000000,
    avg_ebitda: 12000000,
    avg_cash_inflow: 55000000,
    avg_cash_outflow: 48000000,
    avg_operating_cf: 12000000,
    avg_free_cf: 8000000,
    avg_tax_payment: 5000000,
    avg_capex: 3000000,
    avg_total_assets: 100000000,
    avg_total_liabilities: 55000000,
    avg_owner_equity: 45000000,
    avg_ar: 15000000,
    avg_ap: 12000000,
    avg_inventory: 20000000,
    revenue_yoy: 0.15,
    net_profit_yoy: 0.12,
    operating_cf_yoy: 0.10,
    cashflow_trend: '增长',
    tax_trend: '稳定',
    avg_gross_margin: 0.30,
    avg_net_margin: 0.16,
    avg_current_ratio: 1.8,
    avg_quick_ratio: 1.2,
    avg_debt_to_asset: 0.55,
    avg_interest_coverage: 3.5,
    avg_ar_days: 45,
    avg_inventory_days: 60,
    avg_ap_days: 50,
    avg_credit_limit: 30000000,
    avg_credit_used: 19500000,
    avg_credit_utilization: 0.65,
    avg_loan_balance: 15000000,
    avg_deposit_balance: 8000000,
    avg_loan_rate: 0.045,
    rm_focus_topics: ['授信额度调整', '产品交叉销售'],
    ai_flags: ['现金流改善', '授信使用率偏高'],
    source: '信贷管理系统',
    as_of_date: '2026-01-01'
  },
  relationship_graph: {
    edge_count: 45,
    has_guarantee_chain: true,
    risk_propagation_flag: true,
    month_summary: '本月新增关联关系5条，发现担保链风险',
    ai_flags: ['担保链风险', '关联交易异常']
  },
  product_usage: {
    product_count: 8,
    coverage_score: 0.75,
    blank_products: ['贸易融资', '供应链金融'],
    month_summary: '本月新增产品使用3户，覆盖率提升5%',
    products: [
      { name: '流动资金贷款', category: '贷款', status: '使用中' },
      { name: '银行承兑汇票', category: '票据', status: '使用中' },
      { name: '国内信用证', category: '贸易融资', status: '未使用' }
    ]
  },
  risk_events: {
    event_count: 15,
    max_risk_level: 'high',
    risk_types: [
      { name: '信用风险', count: 8 },
      { name: '操作风险', count: 4 },
      { name: '市场风险', count: 3 }
    ],
    open_event_count: 5,
    month_summary: '本月新增风险事件3起，其中高风险1起',
    ai_flags: ['授信使用率偏高', '现金流紧张']
  },
  interactions: {
    interaction_count: 120,
    month_topics: [
      { name: '授信审批', count: 45 },
      { name: '产品咨询', count: 35 },
      { name: '风险预警', count: 25 },
      { name: '其他', count: 15 }
    ],
    month_summary: '本月互动次数增加20%，主要围绕授信审批',
    ai_flags: ['客户关注度提升', '风险咨询增多']
  },
  top_customers: [],
  insights: [],
  data_provenance: '数据来源：信贷管理系统'
};

export const getMockSegmentAnalysisDetail = (): SegmentAnalysisDetail => {
  return MOCK_SEGMENT_ANALYSIS_DETAIL;
};

const MOCK_SAVED_SEGMENTS: SavedSegment[] = [
  {
    id: '1',
    name: '高风险客户',
    customer_count: 15,
    dsl: '授信使用率 > 80% 或 存在逾期记录',
    created_at: '2026-01-05'
  },
  {
    id: '2',
    name: '长三角客群',
    customer_count: 42,
    dsl: '地区 = 上海/江苏/浙江/安徽',
    created_at: '2026-01-04'
  },
  {
    id: '3',
    name: '新能源行业',
    customer_count: 28,
    dsl: '行业包含"新能源"或"光伏"或"风电"',
    created_at: '2026-01-03'
  }
];

const MOCK_INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    type: MessageType.ASSISTANT,
    timestamp: new Date(),
    middle_panel: {
      message_type: 'system',
      text: '您好，陈经理。我是您的对公客群分析引擎。您可以查询客户详情（如"宁德时代怎么样"）或定义客群（如"长三角新能源客户"）。'
    }
  }
];

export const getMockSavedSegments = (): SavedSegment[] => {
  return MOCK_SAVED_SEGMENTS;
};

export const getMockInitialMessages = (): ChatMessage[] => {
  return MOCK_INITIAL_MESSAGES;
};

export const mockData = new DataService();
