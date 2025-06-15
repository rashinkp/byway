
export class RevenueMetrics {
  constructor(
    public readonly totalRevenue: number,
    public readonly adminShare: number,
    public readonly netRevenue: number,
    public readonly refundedAmount: number,
    public readonly netRevenueAfterRefunds: number,
    public readonly period: {
      start: Date;
      end: Date;
    }
  ) {}

  static create(params: {
    totalRevenue: number;
    adminSharePercentage: number;
    refundedAmount: number;
    period: {
      start: Date;
      end: Date;
    };
  }): RevenueMetrics {
    const adminShare = params.totalRevenue * (params.adminSharePercentage / 100);
    const netRevenue = params.totalRevenue - adminShare;
    const netRevenueAfterRefunds = netRevenue - params.refundedAmount;

    return new RevenueMetrics(
      params.totalRevenue,
      adminShare,
      netRevenue,
      params.refundedAmount,
      netRevenueAfterRefunds,
      params.period
    );
  }
}

export class RevenueByCourse {
  constructor(
    public readonly courseId: string,
    public readonly courseTitle: string,
    public readonly totalRevenue: number,
    public readonly adminShare: number,
    public readonly netRevenue: number,
    public readonly enrollmentCount: number
  ) {}
}

export class RevenueByInstructor {
  private _totalRevenue: number;
  private _adminShare: number;
  private _netRevenue: number;
  private _courseCount: number;

  constructor(
    public readonly instructorId: string,
    public readonly instructorName: string,
    totalRevenue: number,
    adminShare: number,
    netRevenue: number,
    courseCount: number
  ) {
    this._totalRevenue = totalRevenue;
    this._adminShare = adminShare;
    this._netRevenue = netRevenue;
    this._courseCount = courseCount;
  }

  get totalRevenue() { return this._totalRevenue; }
  set totalRevenue(value: number) { this._totalRevenue = value; }

  get adminShare() { return this._adminShare; }
  set adminShare(value: number) { this._adminShare = value; }

  get netRevenue() { return this._netRevenue; }
  set netRevenue(value: number) { this._netRevenue = value; }

  get courseCount() { return this._courseCount; }
  set courseCount(value: number) { this._courseCount = value; }
} 