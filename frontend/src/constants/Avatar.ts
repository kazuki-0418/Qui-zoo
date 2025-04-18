export const avatarOptions = [
  "penguin-1",
  "penguin-2",
  "owl-1",
  "owl-2",
  "koala",
  "hippopotamus",
  "gorilla",
  "frog",
  "cat",
] as const;

export type AvatarOption = (typeof avatarOptions)[number];
