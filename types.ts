
export enum MessageType {
  USER = 'USER',
  ASSISTANT = 'ASSISTANT',
  SYSTEM = 'SYSTEM'
}

export interface RiskEvent {
  risk_type: string;
  risk_level: string;
  event: string;
  trigger_metric: string;
  detected_at: string;
  status: string;
  source: string;
  ai_comment: string;
}

export interface RelationshipEdge {
  from_id: string;
  from_type: string;
  to_id: string;
  to_type: string;
  relationship_type: string;
  relationship_strength: number;
  financial_exposure: {
    guarantee_amount: number;
    credit_linked: boolean;
  };
  control_flag: boolean;
  last_updated: string;
}

export interface Product {
  product_code: string;
  product_name: string;
  category: string;
  status: string;
  start_date: string;
  usage_metrics: {
    avg_balance: number;
    utilization_rate: number;
  };
  our_bank_share: number;
  primary_bank_flag: boolean;
}

export interface Interaction {
  interaction_type: string;
  date: string;
  participants: string[];
  topics: string[];
  raw_notes: string;
  pending_actions: string[];
  ai_summary: string;
}

export interface CustomerProfile {
  customer_id: string;
  customer_name: string;
  customer_type: string;
  rm: {
    employee_id: string;
    name: string;
  };
  industry: {
    code: string;
    name: string;
  };
  scale: {
    employees_range: string;
    revenue_range: string;
  };
  region: string;
  group_flag: boolean;
  group_id?: string;
  group_name?: string;
  lifecycle_stage: string;
  relationship_rating: string;
  core_tags: string[];
  created_at: string;
  updated_at: string;
  
  financial_metrics: {
    customer_id: string;
    period: string;
    metrics: {
      revenue: number;
      gross_profit: number;
      net_profit: number;
      ebitda: number;
      cash_inflow: number;
      cash_outflow: number;
      operating_cf: number;
      free_cf: number;
      tax_payment: number;
      capex: number;
      total_assets: number;
      total_liabilities: number;
      owner_equity: number;
      ar: number;
      ap: number;
      inventory: number;
    };
    trend: {
      revenue_yoy: number;
      net_profit_yoy: number;
      operating_cf_yoy: number;
      cashflow_trend: string;
      tax_trend: string;
    };
    ratios: {
      gross_margin: number;
      net_margin: number;
      current_ratio: number;
      quick_ratio: number;
      debt_to_asset: number;
      interest_coverage: number;
      ar_days: number;
      inventory_days: number;
      ap_days: number;
    };
    bank_metrics: {
      credit_limit: number;
      credit_used: number;
      credit_utilization: number;
      loan_balance: number;
      deposit_balance: number;
      avg_loan_rate: number;
    };
    rm_focus_topics: string[];
    ai_flags: string[];
    source: string;
    as_of_date: string;
  };
  
  relationship_graph: {
    customer_id: string;
    month: string;
    updated_at: string;
    edge_count: number;
    has_guarantee_chain: boolean;
    risk_propagation_flag: boolean;
    edges: RelationshipEdge[];
    month_summary: string;
    ai_flags: string[];
  };
  
  product_usage: {
    customer_id: string;
    month: string;
    updated_at: string;
    product_count: number;
    coverage_score: number;
    blank_products: string[];
    month_summary: string;
    products: Product[];
  };
  
  risk_events: {
    customer_id: string;
    month: string;
    updated_at: string;
    event_count: number;
    max_risk_level: string;
    risk_types: string[];
    open_event_count: number;
    month_summary: string;
    events: RiskEvent[];
    ai_flags: string[];
  };
  
  interactions: {
    customer_id: string;
    month: string;
    updated_at: string;
    interaction_count: number;
    month_topics: string[];
    month_summary: string;
    interactions: Interaction[];
    ai_flags: string[];
  };
}

export interface SavedSegment {
  id: string;
  name: string;
  customer_count: number;
  dsl: string;
  created_at: string;
}

export interface FilterCondition {
  id: string;
  field: string;
  operator: string;
  value: string;
}

// Added ReasoningStep interface for CustomerCard component
export interface ReasoningStep {
  action: string;
  matchingField: string;
  index: string;
  value: string;
  source: string;
}

// Added Customer interface for CustomerCard and SegmentAnalysis components
export interface Customer {
  id: string;
  name: string;
  industry: string;
  location: string;
  rating: string;
  financials: {
    revenue: string;
    creditLimit: string;
    utilization: string;
    cashFlow: string;
  };
  aiSummary: string;
  risks: Array<{
    type: string;
    date: string;
    description: string;
    sourceSystem: string;
  }>;
}

// Added SegmentAnalysis interface for SegmentAnalysis component
export interface SegmentAnalysis {
  segmentName: string;
  dsl: string;
  customerCount: number;
  avgCreditUtilization: string;
  riskDistribution: Array<{ name: string; value: number }>;
  topCustomers: Customer[];
}

export interface ChatMessage {
  id: string;
  type: MessageType;
  timestamp: Date;
  content?: string;
  segment_id?: string;
  segment_name?: string;
  from_saved_segment?: boolean;
  middle_panel?: {
    message_type: 'customer_cards' | 'segment_result' | 'segment_comparison' | 'clarification' | 'system';
    text?: string;
    cards?: Array<{
      customer_id: string;
      display_name: string;
      tags: string[];
      key_metrics: Record<string, string>;
      ai_summary: string;
      cof_expansion: { steps: string[] };
    }>;
    summary?: { total_count: number; insights: string[] };
    customer_list?: Array<{ name: string; region: string; credit_util: string }>;
    comparison_table?: Array<{ dimension: string; group_a: string; group_b: string; significant: boolean; insight?: string }>;
    groups?: Array<{ name: string; count: number; dsl?: string }>;
    data_provenance?: string;
    options?: string[];
    click_action?: string;
    comparison_summary?: string[];
  };
  left_panel_update?: {
    action: 'add_segment';
    segment: SavedSegment;
  } | null;
  right_panel?: CustomerProfile | null;
  comparison_detail?: SegmentComparisonDetail;
  segment_analysis_detail?: SegmentAnalysisDetail;
}

export enum RightPanelType {
  CUSTOMER_DETAIL = 'customer_detail',
  SEGMENT_ANALYSIS = 'segment_analysis',
  SEGMENT_COMPARISON = 'segment_comparison'
}

export interface SegmentAnalysisDetail {
  segment_id: string;
  segment_name: string;
  segment_dsl: string;
  customer_count: number;
  period: string;
  summary: {
    total_count: number;
    avg_relationship_rating: string;
    negative_cashflow_count: number;
    negative_cashflow_ratio: string;
    high_risk_count: number;
    high_risk_ratio: string;
  };
  customer_profile: {
    customer_types: Array<{ name: string; count: number }>;
    industries: Array<{ name: string; count: number }>;
    employee_scales: Array<{ name: string; count: number }>;
    revenue_scales: Array<{ name: string; count: number }>;
    regions: Array<{ name: string; count: number }>;
    group_ratio: string;
    lifecycle_stages: Array<{ name: string; count: number }>;
    relationship_ratings: Array<{ name: string; count: number }>;
    core_tags: Array<{ name: string; count: number }>;
  };
  financial_metrics: {
    avg_revenue: number;
    avg_gross_profit: number;
    avg_net_profit: number;
    avg_ebitda: number;
    avg_cash_inflow: number;
    avg_cash_outflow: number;
    avg_operating_cf: number;
    avg_free_cf: number;
    avg_tax_payment: number;
    avg_capex: number;
    avg_total_assets: number;
    avg_total_liabilities: number;
    avg_owner_equity: number;
    avg_ar: number;
    avg_ap: number;
    avg_inventory: number;
    revenue_yoy: number;
    net_profit_yoy: number;
    operating_cf_yoy: number;
    cashflow_trend: string;
    tax_trend: string;
    avg_gross_margin: number;
    avg_net_margin: number;
    avg_current_ratio: number;
    avg_quick_ratio: number;
    avg_debt_to_asset: number;
    avg_interest_coverage: number;
    avg_ar_days: number;
    avg_inventory_days: number;
    avg_ap_days: number;
    avg_credit_limit: number;
    avg_credit_used: number;
    avg_credit_utilization: number;
    avg_loan_balance: number;
    avg_deposit_balance: number;
    avg_loan_rate: number;
    rm_focus_topics: string[];
    ai_flags: string[];
    source: string;
    as_of_date: string;
  };
  relationship_graph: {
    edge_count: number;
    has_guarantee_chain: boolean;
    risk_propagation_flag: boolean;
    month_summary: string;
    ai_flags: string[];
  };
  product_usage: {
    product_count: number;
    coverage_score: number;
    blank_products: string[];
    month_summary: string;
    products: Array<{ name: string; category: string; status: string }>;
  };
  risk_events: {
    event_count: number;
    max_risk_level: string;
    risk_types: Array<{ name: string; count: number }>;
    open_event_count: number;
    month_summary: string;
    ai_flags: string[];
  };
  interactions: {
    interaction_count: number;
    month_topics: Array<{ name: string; count: number }>;
    month_summary: string;
    ai_flags: string[];
  };
  top_customers: Customer[];
  insights: string[];
  data_provenance: string;
}

export interface SegmentComparisonDetail {
  comparison_id: string;
  groups: Array<{
    id: string;
    name: string;
    dsl: string;
    customer_count: number;
  }>;
  comparison_summary: string[];
  customer_profile_comparison: {
    customer_types: Array<{ name: string; group_a_count: number; group_b_count: number; group_a_ratio: string; group_b_ratio: string; significant: boolean }>;
    industries: Array<{ name: string; group_a_count: number; group_b_count: number; group_a_ratio: string; group_b_ratio: string; significant: boolean }>;
    employee_scales: Array<{ name: string; group_a_count: number; group_b_count: number; group_a_ratio: string; group_b_ratio: string; significant: boolean }>;
    revenue_scales: Array<{ name: string; group_a_count: number; group_b_count: number; group_a_ratio: string; group_b_ratio: string; significant: boolean }>;
    regions: Array<{ name: string; group_a_count: number; group_b_count: number; group_a_ratio: string; group_b_ratio: string; significant: boolean }>;
    lifecycle_stages: Array<{ name: string; group_a_count: number; group_b_count: number; group_a_ratio: string; group_b_ratio: string; significant: boolean }>;
    relationship_ratings: Array<{ name: string; group_a_count: number; group_b_count: number; group_a_ratio: string; group_b_ratio: string; significant: boolean }>;
    group_ratio: { group_a: string; group_b: string; significant: boolean };
  };
  financial_metrics_comparison: {
    group_a: {
      avg_revenue: number;
      avg_gross_profit: number;
      avg_net_profit: number;
      avg_ebitda: number;
      avg_cash_inflow: number;
      avg_cash_outflow: number;
      avg_operating_cf: number;
      avg_free_cf: number;
      avg_tax_payment: number;
      avg_capex: number;
      avg_total_assets: number;
      avg_total_liabilities: number;
      avg_owner_equity: number;
      avg_ar: number;
      avg_ap: number;
      avg_inventory: number;
      revenue_yoy: number;
      net_profit_yoy: number;
      operating_cf_yoy: number;
      cashflow_trend: string;
      tax_trend: string;
      avg_gross_margin: number;
      avg_net_margin: number;
      avg_current_ratio: number;
      avg_quick_ratio: number;
      avg_debt_to_asset: number;
      avg_interest_coverage: number;
      avg_ar_days: number;
      avg_inventory_days: number;
      avg_ap_days: number;
      avg_credit_limit: number;
      avg_credit_used: number;
      avg_credit_utilization: number;
      avg_loan_balance: number;
      avg_deposit_balance: number;
      avg_loan_rate: number;
    };
    group_b: {
      avg_revenue: number;
      avg_gross_profit: number;
      avg_net_profit: number;
      avg_ebitda: number;
      avg_cash_inflow: number;
      avg_cash_outflow: number;
      avg_operating_cf: number;
      avg_free_cf: number;
      avg_tax_payment: number;
      avg_capex: number;
      avg_total_assets: number;
      avg_total_liabilities: number;
      avg_owner_equity: number;
      avg_ar: number;
      avg_ap: number;
      avg_inventory: number;
      revenue_yoy: number;
      net_profit_yoy: number;
      operating_cf_yoy: number;
      cashflow_trend: string;
      tax_trend: string;
      avg_gross_margin: number;
      avg_net_margin: number;
      avg_current_ratio: number;
      avg_quick_ratio: number;
      avg_debt_to_asset: number;
      avg_interest_coverage: number;
      avg_ar_days: number;
      avg_inventory_days: number;
      avg_ap_days: number;
      avg_credit_limit: number;
      avg_credit_used: number;
      avg_credit_utilization: number;
      avg_loan_balance: number;
      avg_deposit_balance: number;
      avg_loan_rate: number;
    };
    significant_metrics: Array<{ metric: string; group_a_value: string; group_b_value: string; difference: string; insight: string }>;
  };
  relationship_comparison: {
    group_a: {
      avg_edge_count: number;
      has_guarantee_chain_ratio: string;
      risk_propagation_ratio: string;
      month_summary: string;
    };
    group_b: {
      avg_edge_count: number;
      has_guarantee_chain_ratio: string;
      risk_propagation_ratio: string;
      month_summary: string;
    };
    significant_differences: Array<{ metric: string; group_a_value: string; group_b_value: string; insight: string }>;
  };
  product_comparison: {
    group_a: {
      avg_product_count: number;
      avg_coverage_score: number;
      blank_products: string[];
      month_summary: string;
    };
    group_b: {
      avg_product_count: number;
      avg_coverage_score: number;
      blank_products: string[];
      month_summary: string;
    };
    significant_differences: Array<{ metric: string; group_a_value: string; group_b_value: string; insight: string }>;
  };
  risk_comparison: {
    group_a: {
      avg_event_count: number;
      avg_open_event_count: number;
      risk_type_distribution: Array<{ name: string; count: number; ratio: string }>;
      month_summary: string;
    };
    group_b: {
      avg_event_count: number;
      avg_open_event_count: number;
      risk_type_distribution: Array<{ name: string; count: number; ratio: string }>;
      month_summary: string;
    };
    significant_differences: Array<{ metric: string; group_a_value: string; group_b_value: string; insight: string }>;
  };
  interactions_comparison: {
    group_a: {
      avg_interaction_count: number;
      month_topics: Array<{ name: string; count: number; ratio: string }>;
      month_summary: string;
    };
    group_b: {
      avg_interaction_count: number;
      month_topics: Array<{ name: string; count: number; ratio: string }>;
      month_summary: string;
    };
    significant_differences: Array<{ metric: string; group_a_value: string; group_b_value: string; insight: string }>;
  };
  data_provenance: string;
}
