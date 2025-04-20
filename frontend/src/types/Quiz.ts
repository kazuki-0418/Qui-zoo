export enum Category {
  // biome-ignore lint/style/useNamingConvention: <explanation>
  GENERAL = "GENERAL",
  // biome-ignore lint/style/useNamingConvention: <explanation>
  SCIENCE = "SCIENCE",
  // biome-ignore lint/style/useNamingConvention: <explanation>
  HISTORY = "HISTORY",
  // biome-ignore lint/style/useNamingConvention: <explanation>
  GEOGRAPHY = "GEOGRAPHY",
  // biome-ignore lint/style/useNamingConvention: <explanation>
  ENTERTAINMENT = "ENTERTAINMENT",
  // biome-ignore lint/style/useNamingConvention: <explanation>
  SPORTS = "SPORTS",
}

export type Quiz = {
  id: string;
  title: string;
  category: Category;
  creatorId: string;
  timeLimit: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};
