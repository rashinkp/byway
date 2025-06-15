import { api } from './api';
import { 
  GetOverallRevenueParams,
  GetCourseRevenueParams,
  GetLatestRevenueParams,
  OverallRevenueResponse,
  CourseRevenueResponse,
  LatestRevenueResponse
} from '@/types/analytics';

export const analyticsApi = {
  getOverallRevenue: async (params: GetOverallRevenueParams): Promise<OverallRevenueResponse> => {
    const response = await api.get('/revenue/overall', { params });
    return response.data;
  },

  getCourseRevenue: async (params: GetCourseRevenueParams): Promise<CourseRevenueResponse> => {
    const response = await api.get('/revenue/courses', { params });
    return response.data;
  },

  getLatestRevenue: async (params: GetLatestRevenueParams): Promise<LatestRevenueResponse> => {
    const response = await api.get('/revenue/latest', { params });
    return response.data;
  }
};
