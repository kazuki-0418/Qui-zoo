export enum Category {
  GENERAL = "GENERAL",
  SCIENCE = "SCIENCE",
  HISTORY = "HISTORY",
  GEOGRAPHY = "GEOGRAPHY",
  ENTERTAINMENT = "ENTERTAINMENT",
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

export type CreateQuiz = {
  title: string;
  category: Category;
  creatorId: string;
  timeLimit: number;
};

export type UpdateQuiz = {
  title?: string;
  category?: Category;
  creatorId?: string;
  timeLimit?: number;
};
