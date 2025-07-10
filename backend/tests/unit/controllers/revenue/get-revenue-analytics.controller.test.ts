// import { describe, it, expect, beforeEach, jest } from "@jest/globals";
// import { GetRevenuerevenueController } from "../../../../src/presentation/http/controllers/revenue.controller";
// import { IGetRevenueAnalyticsUseCase } from "../../../../src/app/usecases/revenue/interfaces/get-revenue-analytics.usecase";
// import { RevenueMetrics } from "../../../../src/domain/entities/revenue.entity";
// import { IHttpRequest } from "../../../../src/presentation/http/interfaces/http-request.interface";
// import { ZodError } from "zod";

// describe("GetRevenuerevenueController", () => {
//   let controller: GetRevenuerevenueController;
//   let mockGetRevenueAnalyticsUseCase: jest.Mocked<IGetRevenueAnalyticsUseCase>;
//   let mockHttpErrors: any;
//   let mockHttpSuccess: any;

//   beforeEach(() => {
//     mockGetRevenueAnalyticsUseCase = {
//       execute: jest.fn(),
//     } as any;

//     mockHttpErrors = {
//       error_400: jest.fn(),
//       error_401: jest.fn(),
//       error_403: jest.fn(),
//       error_404: jest.fn(),
//       error_422: jest.fn(),
//       error_500: jest.fn(),
//     };

//     mockHttpSuccess = {
//       success_200: jest.fn(),
//       success_201: jest.fn(),
//       success_204: jest.fn(),
//     };

//     controller = new GetRevenuerevenueController(
//       mockGetRevenueAnalyticsUseCase,
//       mockHttpErrors,
//       mockHttpSuccess
//     );
//   });

//   it("should return revenue analytics data successfully", async () => {
//     // Mock data
//     const mockMetrics = new RevenueMetrics(
//       1000, // totalRevenue
//       200, // adminShare
//       800, // netRevenue
//       50, // refundedAmount
//       750, // netRevenueAfterRefunds
//       {
//         // period
//         start: new Date("2024-01-01"),
//         end: new Date("2024-01-31"),
//       }
//     );

//     const mockResult = {
//       metrics: mockMetrics,
//       courseRevenues: [
//         {
//           courseId: "course1",
//           title: "Test Course",
//           totalRevenue: 500,
//           adminShare: 100,
//           netRevenue: 400,
//           transactionCount: 5,
//         },
//       ],
//       instructorRevenues: [
//         {
//           instructorId: "instructor1",
//           name: "Test Instructor",
//           totalRevenue: 500,
//           adminShare: 100,
//           netRevenue: 400,
//           courseCount: 1,
//         },
//       ],
//       transactionStats: {
//         totalTransactions: 10,
//         successfulTransactions: 8,
//         failedTransactions: 1,
//         refundedTransactions: 1,
//         averageTransactionAmount: 125,
//       },
//     };

//     mockGetRevenueAnalyticsUseCase.execute.mockResolvedValue(mockResult);
//     mockHttpSuccess.success_200.mockReturnValue({
//       statusCode: 200,
//       body: {
//         data: mockResult,
//         message: "Revenue analytics retrieved successfully",
//       },
//     });

//     const httpRequest: IHttpRequest = {
//       params: {},
//       query: {
//         startDate: "2024-01-01",
//         endDate: "2024-01-31",
//         adminSharePercentage: "20",
//       },
//     };

//     const result = await controller.handle(httpRequest);

//     expect(result.statusCode).toBe(200);
//     expect(result.body.data).toEqual(mockResult);
//     expect(result.body.message).toBe(
//       "Revenue analytics retrieved successfully"
//     );
//     expect(mockGetRevenueAnalyticsUseCase.execute).toHaveBeenCalledWith({
//       startDate: new Date("2024-01-01"),
//       endDate: new Date("2024-01-31"),
//       adminSharePercentage: 20,
//     });
//   });

//   it("should handle missing query parameters", async () => {
//     const zodError = new ZodError([]);
//     mockGetRevenueAnalyticsUseCase.execute.mockRejectedValue(zodError);
//     mockHttpErrors.error_422.mockReturnValue({
//       statusCode: 422,
//       body: {
//         statusCode: 422,
//         success: false,
//         message: "Invalid request parameters",
//         data: null,
//       },
//     });

//     const httpRequest: IHttpRequest = {
//       params: {},
//       query: {},
//     };

//     const result = await controller.handle(httpRequest);

//     expect(result.statusCode).toBe(422);
//     expect(result.body.message).toBe("Invalid request parameters");
//   });

//   it("should handle invalid date format", async () => {
//     const zodError = new ZodError([]);
//     mockGetRevenueAnalyticsUseCase.execute.mockRejectedValue(zodError);
//     mockHttpErrors.error_422.mockReturnValue({
//       statusCode: 422,
//       body: {
//         statusCode: 422,
//         success: false,
//         message: "Invalid date format",
//         data: null,
//       },
//     });

//     const httpRequest: IHttpRequest = {
//       params: {},
//       query: {
//         startDate: "invalid-date",
//         endDate: "2024-01-31",
//       },
//     };

//     const result = await controller.handle(httpRequest);

//     expect(result.statusCode).toBe(422);
//     expect(result.body.message).toBe("Invalid date format");
//   });

//   it("should handle invalid admin share percentage", async () => {
//     const zodError = new ZodError([]);
//     mockGetRevenueAnalyticsUseCase.execute.mockRejectedValue(zodError);
//     mockHttpErrors.error_422.mockReturnValue({
//       statusCode: 422,
//       body: {
//         statusCode: 422,
//         success: false,
//         message: "Invalid admin share percentage",
//         data: null,
//       },
//     });

//     const httpRequest: IHttpRequest = {
//       params: {},
//       query: {
//         startDate: "2024-01-01",
//         endDate: "2024-01-31",
//         adminSharePercentage: "150", // Invalid percentage
//       },
//     };

//     const result = await controller.handle(httpRequest);

//     expect(result.statusCode).toBe(422);
//     expect(result.body.message).toBe("Invalid admin share percentage");
//   });
// });
