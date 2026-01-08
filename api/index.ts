import {
  ProcessRequestParams,
  ProcessRequestResponse,
  GetCustomerProfileParams,
  GetSegmentComparisonDetailParams,
  GetSegmentAnalysisDetailParams,
  GetSegmentResultByIdParams,
  GetSegmentComparisonByIdsParams,
  GetInitialMessagesResponse,
  GetSavedSegmentsResponse
} from './types';
import {
  MOCK_CUSTOMER_PROFILES,
  getMockCustomerProfile,
  getMockSegmentComparisonDetail,
  getMockSegmentComparisonByIds,
  getMockSegmentAnalysisDetail,
  getMockSavedSegments,
  getMockInitialMessages,
  getMockSegmentResultById,
  mockData
} from '../mockData';
import { CustomerProfile, SegmentAnalysisDetail, SegmentComparisonDetail, SavedSegment, ChatMessage } from '../types';

class ApiService {
  private useMock: boolean = true;

  constructor() {
    this.useMock = true;
  }

  async processRequest(params: ProcessRequestParams): Promise<ProcessRequestResponse> {
    if (this.useMock) {
      return this.mockProcessRequest(params);
    }
    return this.realProcessRequest(params);
  }

  private async mockProcessRequest(params: ProcessRequestParams): Promise<ProcessRequestResponse> {
    const { query, context } = params;
    const result = await mockData.processRequest(query, context);
    return {
      middle_panel: result.middle_panel,
      right_panel: result.right_panel,
      left_panel_update: result.left_panel_update,
      comparison_detail: result.comparison_detail
    };
  }

  private async realProcessRequest(params: ProcessRequestParams): Promise<ProcessRequestResponse> {
    const { query, context } = params;
    const response = await fetch('/api/process-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query, context })
    });
    if (!response.ok) {
      throw new Error('Failed to process request');
    }
    return response.json();
  }

  async getCustomerProfile(params: GetCustomerProfileParams): Promise<CustomerProfile | undefined> {
    if (this.useMock) {
      return getMockCustomerProfile(params.customerId);
    }
    return this.realGetCustomerProfile(params);
  }

  private async realGetCustomerProfile(params: GetCustomerProfileParams): Promise<CustomerProfile> {
    const response = await fetch(`/api/customers/${params.customerId}`);
    if (!response.ok) {
      throw new Error('Failed to get customer profile');
    }
    return response.json();
  }

  async getSegmentComparisonDetail(params: GetSegmentComparisonDetailParams): Promise<SegmentComparisonDetail> {
    if (this.useMock) {
      return getMockSegmentComparisonDetail();
    }
    return this.realGetSegmentComparisonDetail(params);
  }

  private async realGetSegmentComparisonDetail(params: GetSegmentComparisonDetailParams): Promise<SegmentComparisonDetail> {
    const response = await fetch('/api/segments/comparison-detail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });
    if (!response.ok) {
      throw new Error('Failed to get segment comparison detail');
    }
    return response.json();
  }

  async getSegmentComparisonByIds(params: GetSegmentComparisonByIdsParams): Promise<{ comparison: Partial<ChatMessage>; detail: SegmentComparisonDetail }> {
    if (this.useMock) {
      return getMockSegmentComparisonByIds(params.segmentIds, params.savedSegments);
    }
    return this.realGetSegmentComparisonByIds(params);
  }

  private async realGetSegmentComparisonByIds(params: GetSegmentComparisonByIdsParams): Promise<{ comparison: Partial<ChatMessage>; detail: SegmentComparisonDetail }> {
    const response = await fetch('/api/segments/comparison-by-ids', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });
    if (!response.ok) {
      throw new Error('Failed to get segment comparison by ids');
    }
    return response.json();
  }

  async getSegmentAnalysisDetail(params?: GetSegmentAnalysisDetailParams): Promise<SegmentAnalysisDetail> {
    if (this.useMock) {
      return getMockSegmentAnalysisDetail();
    }
    return this.realGetSegmentAnalysisDetail(params);
  }

  private async realGetSegmentAnalysisDetail(params?: GetSegmentAnalysisDetailParams): Promise<SegmentAnalysisDetail> {
    const response = await fetch('/api/segments/analysis-detail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params || {})
    });
    if (!response.ok) {
      throw new Error('Failed to get segment analysis detail');
    }
    return response.json();
  }

  async getSegmentResultById(params: GetSegmentResultByIdParams): Promise<Partial<ChatMessage> | null> {
    if (this.useMock) {
      return getMockSegmentResultById(params.segmentId);
    }
    return this.realGetSegmentResultById(params);
  }

  private async realGetSegmentResultById(params: GetSegmentResultByIdParams): Promise<Partial<ChatMessage> | null> {
    const response = await fetch(`/api/segments/${params.segmentId}`);
    if (!response.ok) {
      throw new Error('Failed to get segment result by id');
    }
    return response.json();
  }

  async getSavedSegments(): Promise<SavedSegment[]> {
    if (this.useMock) {
      return getMockSavedSegments();
    }
    return this.realGetSavedSegments();
  }

  private async realGetSavedSegments(): Promise<SavedSegment[]> {
    const response = await fetch('/api/segments/saved');
    if (!response.ok) {
      throw new Error('Failed to get saved segments');
    }
    return response.json();
  }

  async getInitialMessages(): Promise<ChatMessage[]> {
    if (this.useMock) {
      return getMockInitialMessages();
    }
    return this.realGetInitialMessages();
  }

  private async realGetInitialMessages(): Promise<ChatMessage[]> {
    const response = await fetch('/api/messages/initial');
    if (!response.ok) {
      throw new Error('Failed to get initial messages');
    }
    return response.json();
  }

  async getMockCustomerProfileDirect(customerId: string): Promise<CustomerProfile | undefined> {
    return MOCK_CUSTOMER_PROFILES[customerId];
  }

  getMockCustomerProfileDirectSync(customerId: string): CustomerProfile | undefined {
    return MOCK_CUSTOMER_PROFILES[customerId];
  }

  setUseMock(useMock: boolean) {
    this.useMock = useMock;
  }

  isUsingMock(): boolean {
    return this.useMock;
  }
}

export const apiService = new ApiService();
