


interface Course {
    id: string;
    title: string;
    price: number;
    originalPrice: number;
  description: string;
  thumbnail?: string;
    duration: string;
    creator: {
      name: string;
    };
}

export interface ICart {
  id: string;
  userId: string;
  courseId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}


export interface ICartWithCourse {
  id: string;
  userId: string;
  courseId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  course?: Course
}


export interface ICreateCartInput {
  courseId: string;
  userId: string;
}

export interface IGetCartInput {
  userId: string;
  page?: number;
  limit?: number;
  includeDeleted?: boolean;
}

export interface IRemoveCartItemInput {
  userId: string;
  courseId: string;
}

export interface IClearCartInput {
  userId: string;
}
