import * as admin from "firebase-admin";
import { ParticipantRanking } from "../controllers/realtimeQuiz.controller";
import { rtdb } from "../infrastructure/firebase_RTDB.config";

export class RealtimeQuizModel {
  private db: admin.database.Database;

  constructor() {
    this.db = rtdb;
  }

  // 参加者が回答した時間を記録
  async recordParticipantAnswered({
    sessionId,
    participantId,
  }: {
    sessionId: string;
    participantId: string;
  }) {
    const now = admin.database.ServerValue.TIMESTAMP;
    await this.db.ref(`questionProgress/${sessionId}/participants/${participantId}`).set({
      hasAnswered: true,
      answeredAt: now,
    });

    const snapshot = await this.db.ref(`questionProgress/${sessionId}/participants`).once("value");
    const participants = snapshot.val();
    const answeredCount = Object.keys(participants).filter(
      (key) => participants[key].hasAnswered,
    ).length;
    await this.db.ref(`questionProgress/${sessionId}`).update({
      answeredCount,
    });
  }

  async getAnsweredParticipants(sessionId: string) {
    const snapshot = await this.db.ref(`questionProgress/${sessionId}/participants`).once("value");

    const participants = snapshot.val();
    if (!participants) {
      return [];
    }
    const answeredParticipants = Object.keys(participants).filter(
      (key) => participants[key].hasAnswered,
    );
    return answeredParticipants;
  }

  // 質問の開始時間を取得
  async getQuestionStartTime(sessionId: string) {
    const snapshot = await this.db.ref(`questionProgress/${sessionId}/startedAt`).once("value");
    return snapshot.val();
  }

  // 質問の終了時間を取得
  async getQuestionEndTime(sessionId: string) {
    const snapshot = await this.db.ref(`questionProgress/${sessionId}/endAt`).once("value");
    return snapshot.val();
  }

  // 質問の一時停止時間を記録
  async recordPause(recordData: {
    sessionId: string;
    questionId: string;
  }) {
    const { sessionId, questionId } = recordData;
    const pausedAt = admin.database.ServerValue.TIMESTAMP;
    await this.db.ref(`questionProgress/${sessionId}`).update({
      pausedAt,
      currentQuestionId: questionId,
    });
  }

  async recordResume(sessionId: string, questionId: string) {
    const now = admin.database.ServerValue.TIMESTAMP;
    await this.db.ref(`questionProgress/${sessionId}`).update({
      resumedAt: now,
      currentQuestionId: questionId,
    });
  }

  // 質問の一時停止時間を取得
  async getPausedTime(sessionId: string) {
    const snapshot = await this.db.ref(`questionProgress/${sessionId}/pausedAt`).once("value");
    return snapshot.val();
  }

  // 質問の経過時間を取得
  async getElapsedTime(sessionId: string) {
    const snapshot = await this.db
      .ref(`questionProgress/${sessionId}/elapsedTimeBeforePause`)
      .once("value");
    return snapshot.val();
  }

  // 正解を取得
  async getCorrectAnswer(sessionId: string, questionId: string) {
    const questionsRef = this.db.ref(`sessions/${sessionId}/questions`);
    const questionsSnapshot = await questionsRef.once("value");
    const questions = questionsSnapshot.val();

    if (!questions) {
      console.error("No questions found for session:", sessionId);
      return null;
    }

    // 質問IDに一致する質問を見つける
    for (const index in questions) {
      if (questions[index].id === questionId) {
        // 正解の選択肢を取得
        return questions[index].correctOption || null;
      }
    }
    return null; // 質問が見つからない場合
  }

  // 回答を保存
  async saveAnswer(
    sessionId: string,
    questionId: string,
    participantId: string,
    selectedOption: string,
    isCorrect: boolean,
    timeSpent: number,
    pointsEarned: number,
  ) {
    const now = admin.database.ServerValue.TIMESTAMP;
    await this.db.ref(`answers/${sessionId}/${questionId}/${participantId}`).set({
      selectedOption,
      isCorrect,
      submittedAt: now,
      timeSpent,
      pointsEarned,
    });
  }

  // 参加者のスコアを更新
  async updateParticipantScore(sessionId: string, participantId: string, points: number) {
    await this.db
      .ref(`sessions/${sessionId}/participants/${participantId}/score`)
      .transaction((currentScore = 0) => {
        return currentScore + points;
      });
  }

  // 全参加者が回答したかチェック
  async checkIfAllAnswered(sessionId: string): Promise<boolean> {
    const participants = await this.getParticipantsInSession(sessionId);
    if (!participants) {
      return true; // 参加者がいなければ完了とみなす
    }
    const participantCount = Object.keys(participants).length;

    const answeredSnapshot = await this.db
      .ref(`questionProgress/${sessionId}/participants`)
      .once("value");
    const answeredParticipants = answeredSnapshot.val() || {};
    const answeredCount = Object.keys(answeredParticipants).length;

    return answeredCount >= participantCount;
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  private async getParticipantsInSession(sessionId: string): Promise<Record<string, any> | null> {
    const snapshot = await this.db.ref(`sessions/${sessionId}/participants`).once("value");
    return snapshot.val();
  }

  // 質問を完了としてマーク
  async completeQuestion(sessionId: string) {
    await this.db.ref(`questionProgress/${sessionId}`).update({
      status: "completed",
    });
  }

  // 中間結果を計算して保存
  async calculateAndStoreResults(sessionId: string, questionId: string) {
    try {
      // 1. この質問に対する全ての回答を取得
      const answersSnapshot = await this.db.ref(`answers/${sessionId}/${questionId}`).once("value");
      const answers = answersSnapshot.val() || {};

      // 2. 正解の選択肢を取得
      const correctAnswer = await this.getCorrectAnswer(sessionId, questionId);

      if (!correctAnswer) {
        throw new Error(`Correct answer not found for question ${questionId}`);
      }

      // 3. 統計を計算
      const stats = {
        totalAnswers: Object.keys(answers).length,
        correctAnswers: 0,
        wrongAnswers: 0,
        notAnswered: 0, // 後で計算
        averageTime: 0,
        optionDistribution: {} as Record<string, number>,
        highestScore: 0,
        lowestScore: Number.POSITIVE_INFINITY,
      };

      // 回答の集計
      let totalTime = 0;
      let totalScore = 0;

      for (const participantId in answers) {
        const answer = answers[participantId];
        // 選択肢の分布を更新
        const option = answer.selectedOption;
        stats.optionDistribution[option] = (stats.optionDistribution[option] || 0) + 1;

        // 正解・不正解をカウント
        if (answer.isCorrect) {
          stats.correctAnswers++;
        } else {
          stats.wrongAnswers++;
        }

        // 最高・最低スコアを更新
        stats.highestScore = Math.max(stats.highestScore, answer.pointsEarned || 0);
        if (answer.pointsEarned !== undefined) {
          stats.lowestScore = Math.min(stats.lowestScore, answer.pointsEarned);
        }

        // 時間の集計
        totalTime += answer.timeSpent || 0;
        totalScore += answer.pointsEarned || 0;
      }

      // 平均回答時間
      stats.averageTime = stats.totalAnswers > 0 ? Math.round(totalTime / stats.totalAnswers) : 0;

      // 4. 参加者数を取得して未回答者数を計算
      const participantsSnapshot = await this.db
        .ref(`sessions/${sessionId}/participants`)
        .once("value");
      const participants = participantsSnapshot.val() || {};
      const participantCount = Object.keys(participants).length;
      stats.notAnswered = participantCount - stats.totalAnswers;

      // 5. 平均スコア
      const averageScore = stats.totalAnswers > 0 ? Math.round(totalScore / stats.totalAnswers) : 0;

      // 6. 結果をFirebaseに保存
      await this.db.ref(`sessionResults/${sessionId}/questionResults/${questionId}`).set({
        ...stats,
        averageScore,
        questionId,
        completedAt: Date.now(),
      });

      // 7. セッション全体の統計も更新
      const sessionStatsRef = this.db.ref(`sessionResults/${sessionId}`);
      const sessionStatsSnapshot = await sessionStatsRef.once("value");
      const sessionStats = sessionStatsSnapshot.val() || {};

      // セッション全体の統計を計算して更新
      await sessionStatsRef.update({
        totalParticipants: participantCount,
        averageScore: sessionStats.averageScore
          ? Math.round((sessionStats.averageScore + averageScore) / 2)
          : averageScore,
        lastUpdated: Date.now(),
      });

      return true;
    } catch (error) {
      console.error("Error calculating and storing results:", error);
      return false;
    }
  }

  // プレゼンス情報を設定
  async setPresence(sessionId: string, participantId: string) {
    const presenceRef = this.db.ref(`presence/${sessionId}/${participantId}`);
    await presenceRef.set({
      online: true,
      lastActive: admin.database.ServerValue.TIMESTAMP,
    });
    presenceRef.onDisconnect().update({
      online: false,
      lastActive: admin.database.ServerValue.TIMESTAMP,
    });
  }

  // 最終アクティブタイムスタンプを更新
  async updateLastActive(sessionId: string, participantId: string) {
    await this.db
      .ref(`presence/${sessionId}/${participantId}/lastActive`)
      .set(admin.database.ServerValue.TIMESTAMP);
  }

  // セッションステータスを更新
  async updateSessionStatus(sessionId: string, status: string) {
    await this.db.ref(`sessions/${sessionId}/status`).update({ status });
    if (status === "active") {
      await this.db
        .ref(`sessions/${sessionId}`)
        .update({ startedAt: admin.database.ServerValue.TIMESTAMP });
    }
  }

  // questionProgress を初期化
  async initializeQuestionProgress(initQuizData: {
    sessionId: string;
    questionId: string;
    timeLimit: number;
  }) {
    const { sessionId, questionId, timeLimit } = initQuizData;
    await this.db.ref(`questionProgress/${sessionId}`).set({
      currentQuestionId: questionId,
      participants: {},
      startedAt: admin.database.ServerValue.TIMESTAMP,
      pausedAt: null,
      elapsedTimeBeforePause: 0,
      timeLimit: timeLimit * 1000, // ミリ秒単位で保存
      status: "active",
    });

    // トランザクションを使って開始時間を取得し、その値に基づいてendAtを設定
    const progressRef = this.db.ref(`questionProgress/${sessionId}`);
    progressRef.once("value", (snapshot) => {
      const data = snapshot.val();
      if (data?.startedAt) {
        // 開始時間 + 制限時間 = 終了時間
        const calculatedEndAt = data.startedAt + timeLimit * 1000;
        progressRef.child("endAt").set(calculatedEndAt);
      }
    });
  }

  // 質問進行状況を取得
  async getQuestionProgress(sessionId: string) {
    const snapshot = await this.db.ref(`questionProgress/${sessionId}`).once("value");
    return snapshot.val();
  }

  // セッションステータスを取得
  async getSessionStatus(sessionId: string) {
    const snapshot = await this.db.ref(`sessions/${sessionId}/status`).once("value");
    return snapshot.val();
  }

  // 中間結果を取得
  async getSessionResults(sessionId: string) {
    const snapshot = await this.db.ref(`sessionResults/${sessionId}`).once("value");
    return snapshot.val();
  }

  async storeRanking(
    sessionId: string,
    questionId: string,
    ranking: ParticipantRanking[],
  ): Promise<void> {
    await this.db
      .ref(`sessionResults/${sessionId}/questionResults/${questionId}/ranking`)
      .set(ranking);

    // 現在の全体ランキングも更新
    await this.db.ref(`sessionResults/${sessionId}/participantRanking`).set(ranking);
  }

  async getQuestionResults(sessionId: string, questionId: string) {
    const snapshot = await this.db
      .ref(`sessionResults/${sessionId}/questionResults/${questionId}`)
      .once("value");
    const questionResults = snapshot.val();
    if (!questionResults) {
      console.error("No question results found for session:", sessionId);
      return null;
    }
    return questionResults;
  }
}
