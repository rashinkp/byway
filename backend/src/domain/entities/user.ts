import { Role } from "../enum/role.enum";


export class User {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public password?: string,
    public googleId?: string,
    public facebookId?: string,
    public role: Role = Role.LEARNER,
    public isVerified: boolean = false,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
    public avatar?:string
  ) {}
}
