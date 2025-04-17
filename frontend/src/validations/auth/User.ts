export const accountTypes = ["TEACHER", "STUDENT"] as const;

export type Role = (typeof accountTypes)[number];

export type CreateUser = {
  username: string;
  email: string;
  password: string;
  role: Role;
  avatar: string;
};

export type LoginData = {
  email: string;
  password: string;
};
