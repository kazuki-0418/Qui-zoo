export type Result = {
  participantRanking: ParticipantRanking[];
  questionResults: QuestionResult;
};

export type ParticipantRanking = {
  id: string;
  name: string;
  score: number;
  rank: number;
  avatar: string;
};

export type QuestionResult = {
  correctAnswers: number;
  wrongAnswers: number;
  optionDistribution: Record<string, number>;
};
