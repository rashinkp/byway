import { api } from './api';
import { 
  GetOverallRevenueParams,
  GetCourseRevenueParams,
  OverallRevenueResponse,
  CourseRevenueResponse
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
};
