import { CustomerProfile, SegmentAnalysisDetail, SegmentComparisonDetail, SavedSegment, ChatMessage } from '../types';

export interface ProcessRequestParams {
  query: string;
  context?: {
    saved_segments?: SavedSegment[];
    current_selected_customer?: string;
  };
}

export interface ProcessRequestResponse {
  middle_panel?: ChatMessage['middle_panel'];
  right_panel?: CustomerProfile;
  left_panel_update?: ChatMessage['left_panel_update'];
  comparison_detail?: SegmentComparisonDetail;
}

export interface GetCustomerProfileParams {
  customerId: string;
}

export interface GetSegmentComparisonDetailParams {
  segmentIds?: string[];
  savedSegments?: SavedSegment[];
}

export interface GetSegmentAnalysisDetailParams {
  segmentId?: string;
  segmentName?: string;
  segmentDsl?: string;
  customerCount?: number;
}

export interface GetSegmentResultByIdParams {
  segmentId: string;
}

export interface GetSegmentComparisonByIdsParams {
  segmentIds: string[];
  savedSegments: SavedSegment[];
}

export interface GetInitialMessagesResponse {
  messages: ChatMessage[];
}

export interface GetSavedSegmentsResponse {
  segments: SavedSegment[];
}
