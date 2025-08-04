
export class RevenueMetrics {
  private readonly _totalRevenue: number;
  private readonly _adminShare: number;
  private readonly _netRevenue: number;
  private readonly _refundedAmount: number;
  private readonly _netRevenueAfterRefunds: number;
  private readonly _period: {
    start: Date;
    end: Date;
  };

  constructor(props: {
    totalRevenue: number;
    adminShare: number;
    netRevenue: number;
    refundedAmount: number;
    netRevenueAfterRefunds: number;
    period: {
      start: Date;
      end: Date;
    };
  }) {
    this.validateRevenueMetrics(props);
    
    this._totalRevenue = props.totalRevenue;
    this._adminShare = props.adminShare;
    this._netRevenue = props.netRevenue;
    this._refundedAmount = props.refundedAmount;
    this._netRevenueAfterRefunds = props.netRevenueAfterRefunds;
    this._period = props.period;
  }

  private validateRevenueMetrics(props: any): void {
    if (props.totalRevenue < 0) {
      throw new Error("Total revenue cannot be negative");
    }

    if (props.adminShare < 0) {
      throw new Error("Admin share cannot be negative");
    }

    if (props.netRevenue < 0) {
      throw new Error("Net revenue cannot be negative");
    }

    if (props.refundedAmount < 0) {
      throw new Error("Refunded amount cannot be negative");
    }

    if (props.netRevenueAfterRefunds < 0) {
      throw new Error("Net revenue after refunds cannot be negative");
    }

    if (props.period.start >= props.period.end) {
      throw new Error("Period start must be before period end");
    }
  }

  // Getters
  get totalRevenue(): number {
    return this._totalRevenue;
  }

  get adminShare(): number {
    return this._adminShare;
  }

  get netRevenue(): number {
    return this._netRevenue;
  }

  get refundedAmount(): number {
    return this._refundedAmount;
  }

  get netRevenueAfterRefunds(): number {
    return this._netRevenueAfterRefunds;
  }

  get period(): { start: Date; end: Date } {
    return this._period;
  }

  // Business logic methods
  getAdminSharePercentage(): number {
    if (this._totalRevenue === 0) return 0;
    return (this._adminShare / this._totalRevenue) * 100;
  }

  getRefundRate(): number {
    if (this._netRevenue === 0) return 0;
    return (this._refundedAmount / this._netRevenue) * 100;
  }

  getPeriodDuration(): number {
    const diffTime = this._period.end.getTime() - this._period.start.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}

export class RevenueByCourse {
  private readonly _courseId: string;
  private readonly _courseTitle: string;
  private readonly _totalRevenue: number;
  private readonly _adminShare: number;
  private readonly _netRevenue: number;
  private readonly _enrollmentCount: number;

  constructor(props: {
    courseId: string;
    courseTitle: string;
    totalRevenue: number;
    adminShare: number;
    netRevenue: number;
    enrollmentCount: number;
  }) {
    this.validateRevenueByCourse(props);
    
    this._courseId = props.courseId;
    this._courseTitle = props.courseTitle;
    this._totalRevenue = props.totalRevenue;
    this._adminShare = props.adminShare;
    this._netRevenue = props.netRevenue;
    this._enrollmentCount = props.enrollmentCount;
  }

  private validateRevenueByCourse(props: any): void {
    if (!props.courseId) {
      throw new Error("Course ID is required");
    }

    if (!props.courseTitle || props.courseTitle.trim() === "") {
      throw new Error("Course title is required");
    }

    if (props.totalRevenue < 0) {
      throw new Error("Total revenue cannot be negative");
    }

    if (props.adminShare < 0) {
      throw new Error("Admin share cannot be negative");
    }

    if (props.netRevenue < 0) {
      throw new Error("Net revenue cannot be negative");
    }

    if (props.enrollmentCount < 0) {
      throw new Error("Enrollment count cannot be negative");
    }
  }

  // Getters
  get courseId(): string {
    return this._courseId;
  }

  get courseTitle(): string {
    return this._courseTitle;
  }

  get totalRevenue(): number {
    return this._totalRevenue;
  }

  get adminShare(): number {
    return this._adminShare;
  }

  get netRevenue(): number {
    return this._netRevenue;
  }

  get enrollmentCount(): number {
    return this._enrollmentCount;
  }

  // Business logic methods
  getAverageRevenuePerEnrollment(): number {
    if (this._enrollmentCount === 0) return 0;
    return this._totalRevenue / this._enrollmentCount;
  }

  getAdminSharePercentage(): number {
    if (this._totalRevenue === 0) return 0;
    return (this._adminShare / this._totalRevenue) * 100;
  }
}

export class RevenueByInstructor {
  private readonly _instructorId: string;
  private readonly _instructorName: string;
  private _totalRevenue: number;
  private _adminShare: number;
  private _netRevenue: number;
  private _courseCount: number;

  constructor(props: {
    instructorId: string;
    instructorName: string;
    totalRevenue: number;
    adminShare: number;
    netRevenue: number;
    courseCount: number;
  }) {
    this.validateRevenueByInstructor(props);
    
    this._instructorId = props.instructorId;
    this._instructorName = props.instructorName;
    this._totalRevenue = props.totalRevenue;
    this._adminShare = props.adminShare;
    this._netRevenue = props.netRevenue;
    this._courseCount = props.courseCount;
  }

  private validateRevenueByInstructor(props: any): void {
    if (!props.instructorId) {
      throw new Error("Instructor ID is required");
    }

    if (!props.instructorName || props.instructorName.trim() === "") {
      throw new Error("Instructor name is required");
    }

    if (props.totalRevenue < 0) {
      throw new Error("Total revenue cannot be negative");
    }

    if (props.adminShare < 0) {
      throw new Error("Admin share cannot be negative");
    }

    if (props.netRevenue < 0) {
      throw new Error("Net revenue cannot be negative");
    }

    if (props.courseCount < 0) {
      throw new Error("Course count cannot be negative");
    }
  }

  // Getters
  get instructorId(): string {
    return this._instructorId;
  }

  get instructorName(): string {
    return this._instructorName;
  }

  get totalRevenue(): number {
    return this._totalRevenue;
  }

  get adminShare(): number {
    return this._adminShare;
  }

  get netRevenue(): number {
    return this._netRevenue;
  }

  get courseCount(): number {
    return this._courseCount;
  }

  // Business logic methods
  updateRevenue(totalRevenue: number, adminShare: number, netRevenue: number): void {
    if (totalRevenue < 0) {
      throw new Error("Total revenue cannot be negative");
    }

    if (adminShare < 0) {
      throw new Error("Admin share cannot be negative");
    }

    if (netRevenue < 0) {
      throw new Error("Net revenue cannot be negative");
    }

    this._totalRevenue = totalRevenue;
    this._adminShare = adminShare;
    this._netRevenue = netRevenue;
  }

  updateCourseCount(courseCount: number): void {
    if (courseCount < 0) {
      throw new Error("Course count cannot be negative");
    }
    this._courseCount = courseCount;
  }

  getAverageRevenuePerCourse(): number {
    if (this._courseCount === 0) return 0;
    return this._totalRevenue / this._courseCount;
  }

  getAdminSharePercentage(): number {
    if (this._totalRevenue === 0) return 0;
    return (this._adminShare / this._totalRevenue) * 100;
  }
} 