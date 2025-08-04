# Byway API Endpoints Documentation

This document provides a comprehensive overview of all API endpoints that the frontend application calls, including their HTTP methods, input data types, response types, and descriptions.

## Table of Contents

- [Authentication Endpoints](#authentication-endpoints)
- [User Endpoints](#user-endpoints)
- [Instructor Endpoints](#instructor-endpoints)
- [Course Endpoints](#course-endpoints)
- [Lesson Endpoints](#lesson-endpoints)
- [Content Endpoints](#content-endpoints)
- [Category Endpoints](#category-endpoints)
- [Cart Endpoints](#cart-endpoints)
- [Order Endpoints](#order-endpoints)
- [Transaction Endpoints](#transaction-endpoints)
- [Wallet Endpoints](#wallet-endpoints)
- [Progress Endpoints](#progress-endpoints)
- [Certificate Endpoints](#certificate-endpoints)
- [Course Review Endpoints](#course-review-endpoints)
- [Dashboard Endpoints](#dashboard-endpoints)
- [Revenue Endpoints](#revenue-endpoints)
- [File Endpoints](#file-endpoints)
- [Search Endpoints](#search-endpoints)
- [Stripe Endpoints](#stripe-endpoints)
- [PayPal Endpoints](#paypal-endpoints)
- [Common Response Structure](#common-response-structure)
- [Authentication](#authentication)

---

## Authentication Endpoints (`/auth`)

| Endpoint | Method | Input Type | Response Type | Description |
|----------|--------|------------|---------------|-------------|
| `/auth/register` | POST | `SignupData` | `ApiResponse<User>` | User registration |
| `/auth/login` | POST | `{email: string, password: string}` | `ApiResponse<User>` | User login |
| `/auth/google` | POST | `{accessToken: string}` | `ApiResponse<User>` | Google OAuth |
| `/auth/facebook` | POST | `FacebookAuthRequest` | `ApiResponse<User>` | Facebook OAuth |
| `/auth/verify-otp` | POST | `{otp: string, email: string, type: string}` | `ApiResponse<any>` | OTP verification |
| `/auth/resend-otp` | POST | `{email: string}` | `ApiResponse<unknown>` | Resend OTP |
| `/auth/forgot-password` | POST | `{email: string}` | `ApiResponse<unknown>` | Forgot password |
| `/auth/reset-password` | POST | `{resetToken: string, newPassword: string}` | `ApiResponse<unknown>` | Reset password |
| `/auth/logout` | POST | - | `ApiResponse<unknown>` | User logout |
| `/auth/verification-status` | GET | Query: `{email: string}` | `{cooldownTime: number, isExpired: boolean}` | Get verification status |

### Input Types for Auth Endpoints

```typescript
interface SignupData {
  email: string;
  password: string;
  name: string;
}

interface FacebookAuthRequest {
  accessToken: string;
  userId: string;
  name: string;
  email?: string;
  picture?: string;
}
```

---

## User Endpoints (`/user`)

| Endpoint | Method | Input Type | Response Type | Description |
|----------|--------|------------|---------------|-------------|
| `/user/me` | GET | - | `ApiResponse<User>` | Get current user |
| `/user/users` | PUT | `UserUpdateData` | `ApiResponse<User>` | Update user profile |
| `/user/:userId` | GET | - | `ApiResponse<User>` | Get user by ID |
| `/user/:userId/public` | GET | - | `ApiResponse<PublicUser>` | Get public user data |
| `/user/admin/users` | GET | Query params | `ApiResponse<IPaginatedResponse<User>>` | Admin: Get all users |
| `/user/admin/:userId` | GET | - | `ApiResponse<User & {instructor}>` | Admin: Get user details |
| `/user/softDelete/:id` | PATCH | - | `ApiResponse<void>` | Admin: Toggle user deletion |

### Input Types for User Endpoints

```typescript
interface UserUpdateData {
  name?: string;
  avatar?: string;
  bio?: string;
  education?: string;
  skills?: string;
  phoneNumber?: string;
  country?: string;
  city?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
}
```

---

## Instructor Endpoints (`/instructor`)

| Endpoint | Method | Input Type | Response Type | Description |
|----------|--------|------------|---------------|-------------|
| `/instructor/create` | POST | `InstructorFormData` | `ApiResponse<User>` | Create instructor application |
| `/instructor/approve` | POST | `{instructorId: string}` | `ApiResponse<{id: string, status: string}>` | Admin: Approve instructor |
| `/instructor/decline` | POST | `{instructorId: string}` | `ApiResponse<{id: string, status: string}>` | Admin: Decline instructor |
| `/instructor/instructors` | GET | Query params | `ApiResponse<{items: IInstructorWithUserDetails[], total: number, totalPages: number}>` | Get all instructors |
| `/instructor/public/instructors` | GET | Query params | `ApiResponse<{items: IInstructorWithUserDetails[], total: number, totalPages: number}>` | Get public instructors |
| `/instructor/me` | GET | - | `ApiResponse<IInstructorWithUserDetails \| null>` | Get current instructor |
| `/instructor/:userId` | GET | - | `ApiResponse<IInstructorDetails>` | Get instructor details |

### Query Parameters for Instructor Endpoints

```typescript
interface InstructorQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filterBy?: "All" | "Pending" | "Approved" | "Declined";
  includeDeleted?: boolean;
}
```

---

## Course Endpoints (`/courses`)

| Endpoint | Method | Input Type | Response Type | Description |
|----------|--------|------------|---------------|-------------|
| `/courses/` | GET | Query params | `ApiResponse<CourseApiResponse>` | Get all courses |
| `/courses/` | POST | `AddCourseParams` | `ApiResponse<Course>` | Create course |
| `/courses/:id` | GET | - | `ApiResponse<Course>` | Get course by ID |
| `/courses/:id` | PUT | `CourseEditFormData` | `ApiResponse<Course>` | Update course |
| `/courses/:id` | DELETE | - | `ApiResponse<void>` | Delete course |
| `/courses/enrolled` | GET | Query params | `ApiResponse<CourseApiResponse>` | Get enrolled courses |
| `/courses/approve` | POST | `{courseId: string}` | `ApiResponse<Course>` | Admin: Approve course |
| `/courses/decline` | POST | `{courseId: string}` | `ApiResponse<Course>` | Admin: Decline course |
| `/courses/stats` | GET | - | `ApiResponse<CourseStats>` | Get course statistics |

### Input Types for Course Endpoints

```typescript
interface AddCourseParams {
  title: string;
  description?: string | null;
  categoryId: string;
  price?: number | null;
  duration?: number | null;
  level: "BEGINNER" | "MEDIUM" | "ADVANCED";
  thumbnail?: string | null;
  offer?: number | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  adminSharePercentage: number;
  details?: {
    prerequisites?: string | null;
    longDescription?: string | null;
    objectives?: string | null;
    targetAudience?: string | null;
  } | null;
}

interface IGetAllCoursesInput {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "title" | "price" | "createdAt";
  sortOrder?: "asc" | "desc";
  includeDeleted?: boolean;
  filterBy?: "All" | "Active" | "Inactive" | "Approved" | "Declined" | "Pending" | "Published" | "Draft" | "Archived";
  userId?: string;
  myCourses?: boolean;
  role?: "USER" | "INSTRUCTOR" | "ADMIN";
  level?: "All" | "BEGINNER" | "MEDIUM" | "ADVANCED";
  duration?: "All" | "Under5" | "5to10" | "Over10";
  price?: "All" | "Free" | "Paid";
  categoryId?: string;
}
```

---

## Lesson Endpoints (`/lessons`)

| Endpoint | Method | Input Type | Response Type | Description |
|----------|--------|------------|---------------|-------------|
| `/lessons/` | POST | `{courseId: string, title: string, description?: string, order: number, duration?: number}` | `ApiResponse<ILesson>` | Create lesson |
| `/lessons/:lessonId` | GET | - | `ApiResponse<ILesson>` | Get lesson by ID |
| `/lessons/:lessonId` | PUT | `{title?: string, description?: string, order?: number, thumbnail?: string, duration?: number}` | `ApiResponse<ILesson>` | Update lesson |
| `/lessons/:lessonId` | DELETE | - | `ApiResponse<ILesson>` | Delete lesson |
| `/lessons/:courseId/lessons` | GET | Query params | `ApiResponse<GetAllLessonsResponse>` | Get all lessons in course |
| `/lessons/:courseId/public-lessons` | GET | Query params | `ApiResponse<GetPublicLessonsResponse>` | Get public lessons |

### Query Parameters for Lesson Endpoints

```typescript
interface GetAllLessonsParams {
  courseId: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  filterBy?: string;
  includeDeleted?: boolean;
}
```

---

## Content Endpoints (`/content`)

| Endpoint | Method | Input Type | Response Type | Description |
|----------|--------|------------|---------------|-------------|
| `/content/` | POST | `CreateLessonContentInput` | `ApiResponse<LessonContent>` | Create lesson content |
| `/content/:contentId` | PUT | `UpdateLessonContentInput` | `ApiResponse<LessonContent>` | Update lesson content |
| `/content/:contentId` | DELETE | - | `ApiResponse<void>` | Delete lesson content |
| `/content/:lessonId` | GET | - | `ApiResponse<LessonContent \| null>` | Get content by lesson ID |

### Input Types for Content Endpoints

```typescript
interface CreateLessonContentInput {
  lessonId: string;
  content: string;
  contentType: "VIDEO" | "DOCUMENT" | "TEXT";
  resources?: string[];
}

interface UpdateLessonContentInput {
  id: string;
  content?: string;
  contentType?: "VIDEO" | "DOCUMENT" | "TEXT";
  resources?: string[];
}
```

---

## Category Endpoints (`/category`)

| Endpoint | Method | Input Type | Response Type | Description |
|----------|--------|------------|---------------|-------------|
| `/category/` | GET | Query params | `ApiResponse<IGetAllCategoryResponse>` | Get all categories |
| `/category/` | POST | `CategoryFormData` | `ApiResponse<Category>` | Create category |
| `/category/:id` | GET | - | `ApiResponse<Category>` | Get category by ID |
| `/category/:categoryId` | PUT | `CategoryFormData` | `ApiResponse<Category>` | Update category |
| `/category/:categoryId` | DELETE | - | `ApiResponse<Category>` | Delete category |
| `/category/:categoryId/recover` | PATCH | - | `ApiResponse<Category>` | Recover category |

### Input Types for Category Endpoints

```typescript
interface CategoryFormData {
  name: string;
  description?: string;
  icon?: string;
}
```

---

## Cart Endpoints (`/cart`)

| Endpoint | Method | Input Type | Response Type | Description |
|----------|--------|------------|---------------|-------------|
| `/cart` | GET | Query params | `ApiResponse<IGetCartResponse>` | Get cart items |
| `/cart` | POST | `ICartFormData` | `ApiResponse<ICart>` | Add item to cart |
| `/cart` | DELETE | - | `ApiResponse<void>` | Clear cart |
| `/cart/:courseId` | DELETE | - | `ApiResponse<void>` | Remove item from cart |
| `/cart/apply-coupon` | POST | - | `ApiResponse<any>` | Apply coupon |

### Input Types for Cart Endpoints

```typescript
interface ICartFormData {
  courseId: string;
}
```

---

## Order Endpoints (`/orders`)

| Endpoint | Method | Input Type | Response Type | Description |
|----------|--------|------------|---------------|-------------|
| `/orders` | GET | Query params | `ApiResponse<OrdersResponse>` | Get all orders |
| `/orders` | POST | `CreateOrderRequest` | `ApiResponse<OrderResponse>` | Create order |
| `/orders/:orderId/retry` | POST | - | `ApiResponse<{session: {url: string}}>` | Retry failed order |

### Input Types for Order Endpoints

```typescript
interface CreateOrderRequest {
  courseIds: string[];
  paymentMethod: "WALLET" | "STRIPE" | "PAYPAL" | "RAZORPAY";
  couponCode?: string;
}

interface GetOrdersParams {
  page?: number;
  limit?: number;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
```

---

## Transaction Endpoints (`/transactions`)

| Endpoint | Method | Input Type | Response Type | Description |
|----------|--------|------------|---------------|-------------|
| `/transactions` | POST | `{orderId: string, userId: string, courseId?: string, amount: number, type: string, status?: string, paymentGateway?: string, transactionId?: string}` | `ApiResponse<Transaction>` | Create transaction |
| `/transactions/:id` | GET | - | `ApiResponse<Transaction>` | Get transaction by ID |
| `/transactions/order/:orderId` | GET | - | `ApiResponse<Transaction[]>` | Get transactions by order |
| `/transactions/user` | GET | Query params | `ApiResponse<any>` | Get user transactions |
| `/transactions/status` | PATCH | `{transactionId: string, status: string, paymentGateway?: string}` | `ApiResponse<Transaction>` | Update transaction status |

---

## Wallet Endpoints (`/wallet`)

| Endpoint | Method | Input Type | Response Type | Description |
|----------|--------|------------|---------------|-------------|
| `/wallet` | GET | - | `ApiResponse<IWallet>` | Get wallet |
| `/wallet/add` | POST | - | `ApiResponse<any>` | Add money to wallet |
| `/wallet/reduce` | POST | - | `ApiResponse<any>` | Reduce money from wallet |
| `/wallet/top-up` | POST | `CreateWalletTopUpRequest` | `ApiResponse<WalletTopUpResponse>` | Top up wallet |

### Input Types for Wallet Endpoints

```typescript
interface CreateWalletTopUpRequest {
  amount: number;
  paymentMethod: "STRIPE" | "PAYPAL" | "RAZORPAY";
}
```

---

## Progress Endpoints (`/progress`)

| Endpoint | Method | Input Type | Response Type | Description |
|----------|--------|------------|---------------|-------------|
| `/progress/:courseId/progress` | GET | - | `ApiResponse<IProgress>` | Get course progress |
| `/progress/:courseId/progress` | PATCH | `IUpdateProgressInput` | `ApiResponse<IProgress>` | Update course progress |

### Input Types for Progress Endpoints

```typescript
interface IUpdateProgressInput {
  courseId: string;
  lessonId: string;
  completed: boolean;
  quizAnswers?: IQuizAnswer[];
  score?: number;
  totalQuestions?: number;
}
```

---

## Certificate Endpoints (`/certificates`)

| Endpoint | Method | Input Type | Response Type | Description |
|----------|--------|------------|---------------|-------------|
| `/certificates` | GET | Query: `{courseId: string}` | `ApiResponse<CertificateDTO \| null>` | Get certificate |
| `/certificates/generate` | POST | `{courseId: string}` | `ApiResponse<CertificateDTO>` | Generate certificate |
| `/certificates/list` | GET | Query params | `ApiResponse<{items: CertificateDTO[], total: number, page: number, totalPages: number, hasMore: boolean, nextPage?: number}>` | List user certificates |

### Query Parameters for Certificate Endpoints

```typescript
interface CertificateListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
  search?: string;
}
```

---

## Course Review Endpoints (`/reviews`)

| Endpoint | Method | Input Type | Response Type | Description |
|----------|--------|------------|---------------|-------------|
| `/reviews/` | POST | `CreateCourseReviewParams` | `ApiResponse<CourseReview>` | Create review |
| `/reviews/:id` | PUT | `UpdateCourseReviewParams` | `ApiResponse<CourseReview>` | Update review |
| `/reviews/:id` | DELETE | - | `ApiResponse<void>` | Delete review |
| `/reviews/:id/disable` | PATCH | - | `ApiResponse<DisableReviewResponse>` | Admin: Disable review |
| `/reviews/my-reviews` | GET | Query params | `ApiResponse<GetUserReviewsResponse>` | Get user reviews |
| `/reviews/course/:courseId` | GET | Query params | `ApiResponse<CourseReviewApiResponse>` | Get course reviews |
| `/reviews/course/:courseId/stats` | GET | - | `ApiResponse<CourseReviewStats>` | Get course review stats |

### Input Types for Review Endpoints

```typescript
interface CreateCourseReviewParams {
  courseId: string;
  rating: number;
  comment: string;
}

interface UpdateCourseReviewParams {
  rating?: number;
  comment?: string;
}

interface QueryCourseReviewParams {
  page?: number;
  limit?: number;
  rating?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  isMyReviews?: boolean;
  includeDisabled?: boolean;
}
```

---

## Dashboard Endpoints (`/dashboard`)

| Endpoint | Method | Input Type | Response Type | Description |
|----------|--------|------------|---------------|-------------|
| `/dashboard/admin` | GET | - | `ApiResponse<DashboardResponse>` | Get admin dashboard |
| `/dashboard/instructor` | GET | - | `ApiResponse<InstructorDashboardResponse>` | Get instructor dashboard |

---

## Revenue Endpoints (`/revenue`)

| Endpoint | Method | Input Type | Response Type | Description |
|----------|--------|------------|---------------|-------------|
| `/revenue/overall` | GET | Query params | `OverallRevenueResponse` | Get overall revenue |
| `/revenue/courses` | GET | Query params | `CourseRevenueResponse` | Get course revenue |
| `/revenue/latest` | GET | Query params | `LatestRevenueResponse` | Get latest revenue |

### Query Parameters for Revenue Endpoints

```typescript
interface GetOverallRevenueParams {
  startDate?: string;
  endDate?: string;
  period?: "daily" | "weekly" | "monthly" | "yearly";
}

interface GetCourseRevenueParams {
  courseId?: string;
  startDate?: string;
  endDate?: string;
  period?: "daily" | "weekly" | "monthly" | "yearly";
}

interface GetLatestRevenueParams {
  limit?: number;
  period?: "daily" | "weekly" | "monthly" | "yearly";
}
```

---

## File Endpoints (`/files`)

| Endpoint | Method | Input Type | Response Type | Description |
|----------|--------|------------|---------------|-------------|
| `/files/generate-presigned-url` | POST | `GeneratePresignedUrlParams` | `ApiResponse<PresignedUrlResponse>` | Generate presigned URL for file upload |

### Input Types for File Endpoints

```typescript
interface GeneratePresignedUrlParams {
  fileName: string;
  fileType: string;
  uploadType: 'course' | 'profile' | 'certificate';
  metadata: {
    courseId?: string;
    contentType?: string;
    userId?: string;
    certificateId?: string;
  };
}

interface PresignedUrlResponse {
  presignedUrl: string;
  fileUrl: string;
  fields: Record<string, string>;
}
```

---

## Search Endpoints (`/search`)

| Endpoint | Method | Input Type | Response Type | Description |
|----------|--------|------------|---------------|-------------|
| `/search` | GET | Query params | `ApiResponse<ISearchResult>` | Global search |

### Query Parameters for Search Endpoints

```typescript
interface SearchParams {
  q: string;
  type?: "courses" | "instructors" | "categories" | "all";
  page?: number;
  limit?: number;
}
```

---

## Stripe Endpoints (`/stripe`)

| Endpoint | Method | Input Type | Response Type | Description |
|----------|--------|------------|---------------|-------------|
| `/stripe/create-checkout-session` | POST | - | `ApiResponse<any>` | Create Stripe checkout session |

---

## PayPal Endpoints (`/paypal`)

| Endpoint | Method | Input Type | Response Type | Description |
|----------|--------|------------|---------------|-------------|
| `/paypal/createorder` | POST | `ICreatePaypalOrderInput` | `ApiResponse<IPaypalOrder>` | Create PayPal order |
| `/paypal/captureorder` | POST | `ICapturePaypalOrderInput` | `ApiResponse<IPaypalWallet>` | Capture PayPal order |

### Input Types for PayPal Endpoints

```typescript
interface ICreatePaypalOrderInput {
  courseIds: string[];
  amount: number;
  currency: string;
}

interface ICapturePaypalOrderInput {
  orderID: string;
}
```

---

## Common Response Structure

All endpoints return responses in this format:

```typescript
interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  error?: string;
}

interface IPaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

---

## Authentication

### Authentication Requirements

Most endpoints require authentication via HTTP-only cookies. The authentication flow works as follows:

1. **Login/Register**: Sets `access_token` and `refresh_token` cookies
2. **Protected Routes**: Require valid `access_token` cookie
3. **Token Refresh**: Uses `refresh_token` to get new `access_token`

### Guest-Accessible Endpoints

The following endpoints are accessible without authentication:

- `GET /courses/` - Course listings
- `GET /instructor/public/instructors` - Public instructor profiles
- `GET /category/` - Category listings
- `GET /reviews/course/:courseId` - Course reviews (read-only)
- `GET /search` - Search functionality
- `GET /lessons/:courseId/public-lessons` - Public lesson listings

### Role-Based Access

The API implements role-based access control with the following roles:

- **USER**: Regular user with course enrollment and review capabilities
- **INSTRUCTOR**: Course creator with content management capabilities
- **ADMIN**: Full system access with user and content moderation

### Error Handling

The API uses standard HTTP status codes:

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

### Rate Limiting

Some endpoints (like OTP verification) implement rate limiting to prevent abuse.

---

## Base URL

The API base URL is configured via the `NEXT_PUBLIC_API_URL` environment variable in the frontend.

## CORS Configuration

The API is configured to accept requests from the frontend domain with credentials enabled.

---

*This documentation covers all endpoints that the frontend application calls. For detailed implementation specifics, refer to the individual controller files in the backend codebase.* 