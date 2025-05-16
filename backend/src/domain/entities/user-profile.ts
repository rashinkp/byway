
export class UserProfile {
  constructor(
    public id: string,
    public userId: string,
    public createdAt: Date,
    public updatedAt: Date,
    public bio?: string,
    public education?: string,
    public skills?: string,
    public phoneNumber?: string,
    public country?: string,
    public city?: string,
    public address?: string,
    public dateOfBirth?: Date,
    public gender?: "MALE" | "FEMALE" | "OTHER"
  ) {}
}
