import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/api/analytics';
import { GetOverallRevenueParams, GetCourseRevenueParams } from '@/types/analytics';

export const useOverallRevenue = (params: GetOverallRevenueParams) => {
  return useQuery({
    queryKey: ['overallRevenue', params],
    queryFn: () => analyticsApi.getOverallRevenue(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCourseRevenue = (params: GetCourseRevenueParams) => {
  return useQuery({
    queryKey: ['courseRevenue', params],
    queryFn: () => analyticsApi.getCourseRevenue(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  });
}; 