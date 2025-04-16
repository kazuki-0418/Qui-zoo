import { z } from "zod";

export const accountTypes = ["teacher", "student", "administrator"] as const;

export const avatarNames = [
  "cat",
  "frog",
  "gorilla",
  "hippopotamus",
  "koala",
  "owl-1",
  "owl-2",
  "penguin-1",
  "penguin-2",
] as const;

export const accountTypeSchema = z.object({
  accountType: z.enum(accountTypes, {
    errorMap: () => ({ message: "Choose an account type" }),
  }),
});

export const basicInfoSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const accountUserInfoSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  avatar: z
    .string()
    .nullable()
    .refine((val) => avatarNames.includes(val as (typeof avatarNames)[number]), {
      message: "Please select an avatar",
    }),
});
