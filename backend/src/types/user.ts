export enum Role {
  TEACHER = "TEACHER",
  STUDENT = "STUDENT",
  ADMIN = "ADMIN",
}

export type User = {
  id: string;
  username: string;
  email: string;
  password: string;
  role: Role;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
  correctAnswers: number;
  wrongAnswers: number;
  totalParticipations: number;
};

export type CreateUser = {
  username: string;
  email: string;
  password: string;
  role: Role;
  avatar: string;
};

export type UpdateUser = {
  username?: string;
  email?: string;
  password?: string;
  role?: Role;
  avatar?: string | null;
};
