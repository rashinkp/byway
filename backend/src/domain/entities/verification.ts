export class UserVerification {
  constructor(
    public id: string,
    public userId: string,
    public email: string,
    public otp: string,
    public expiresAt: Date,
    public attemptCount: number = 0,
    public isUsed: boolean = false,
    public createdAt: Date = new Date()
  ) {}
}
