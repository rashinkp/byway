import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { GetRevenueAnalyticsUseCase } from "../../../../src/app/usecases/revenue/implementations/get-revenue-analytics.usecase";
import { IRevenueRepository } from "../../../../src/app/repositories/revenue.repository";
import { RevenueMetrics, RevenueByInstructor } from "../../../../src/domain/entities/revenue.entity";

describe("GetRevenueAnalyticsUseCase", () => {
  let useCase: GetRevenueAnalyticsUseCase;
  let mockRevenueRepository: jest.Mocked<IRevenueRepository>;

  beforeEach(() => {
    mockRevenueRepository = {
      getRevenueMetrics: jest.fn(),
      getRevenueByCourse: jest.fn(),
      getRevenueByInstructor: jest.fn(),
      getTransactionStats: jest.fn(),
    } as any;

    useCase = new GetRevenueAnalyticsUseCase(mockRevenueRepository);
  });

  it("should return revenue analytics data", async () => {
    // Mock data
    const mockMetrics = new RevenueMetrics(
      1000, // totalRevenue
      200,  // adminShare
      800,  // netRevenue
      50,   // refundedAmount
      750,  // netRevenueAfterRefunds
      {     // period
        start: new Date("2024-01-01"),
        end: new Date("2024-01-31")
      }
    );

    const mockCourseRevenues = [{
      courseId: "course1",
      courseTitle: "Test Course",
      totalRevenue: 500,
      adminShare: 100,
      netRevenue: 400,
      enrollmentCount: 5
    }];

    const mockInstructorRevenues = [
      new RevenueByInstructor(
        "instructor1",
        "Test Instructor",
        500,  // totalRevenue
        100,  // adminShare
        400,  // netRevenue
        1     // courseCount
      )
    ];

    const mockTransactionStats = {
      totalTransactions: 10,
      successfulTransactions: 8,
      failedTransactions: 1,
      refundedTransactions: 1,
      averageTransactionAmount: 125
    };

    // Setup mocks
    mockRevenueRepository.getRevenueMetrics.mockResolvedValue(mockMetrics);
    mockRevenueRepository.getRevenueByCourse.mockResolvedValue(mockCourseRevenues);
    mockRevenueRepository.getRevenueByInstructor.mockResolvedValue(mockInstructorRevenues);
    mockRevenueRepository.getTransactionStats.mockResolvedValue(mockTransactionStats);

    // Execute
    const result = await useCase.execute({
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-01-31"),
      adminSharePercentage: 20
    });

    // Assert
    expect(result.metrics).toEqual(mockMetrics);
    expect(result.courseRevenues).toEqual([{
      courseId: "course1",
      title: "Test Course",
      totalRevenue: 500,
      adminShare: 100,
      netRevenue: 400,
      transactionCount: 5
    }]);
    expect(result.instructorRevenues).toEqual([{
      instructorId: "instructor1",
      name: "Test Instructor",
      totalRevenue: 500,
      adminShare: 100,
      netRevenue: 400,
      courseCount: 1
    }]);
    expect(result.transactionStats).toEqual(mockTransactionStats);

    // Verify repository calls
    expect(mockRevenueRepository.getRevenueMetrics).toHaveBeenCalledWith({
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-01-31"),
      adminSharePercentage: 20
    });
    expect(mockRevenueRepository.getRevenueByCourse).toHaveBeenCalledWith({
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-01-31"),
      adminSharePercentage: 20
    });
    expect(mockRevenueRepository.getRevenueByInstructor).toHaveBeenCalledWith({
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-01-31"),
      adminSharePercentage: 20
    });
    expect(mockRevenueRepository.getTransactionStats).toHaveBeenCalledWith({
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-01-31")
    });
  });
}); 