export const accountTypes = ["teacher", "student", "administrator"] as const;

export type Role = (typeof accountTypes)[number];

export type CreateUser = {
  username: string;
  email: string;
  password: string;
  role: Role;
  avatar: string;
};
