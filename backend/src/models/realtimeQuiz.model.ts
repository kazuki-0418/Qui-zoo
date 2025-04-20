import * as admin from "firebase-admin";
import { rtdb } from "../infrastructure/firebase_RTDB.config";

export class RealtimeQuizModel {
  private db: admin.database.Database;

  constructor() {
    this.db = rtdb;
  }

  // 参加者が回答した時間を記録
  // biome-ignore lint/correctness/noUnusedVariables: <explanation>
  // biome-ignore lint/correctness/noUnusedFunctionParameters: <explanation>
  async recordParticipantAnswered(sessionId: string, questionId: string, participantId: string) {
    const now = admin.database.ServerValue.TIMESTAMP;
    await this.db.ref(`questionProgress/${sessionId}/participants/${participantId}`).set({
      hasAnswered: true,
      answeredAt: now,
    });
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

  // 正解を取得
  async getCorrectAnswer(sessionId: string, questionId: string) {
    const snapshot = await this.db
      .ref(`questions/${sessionId}/${questionId}/correctOption`)
      .once("value");
    return snapshot.val();
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

  // 中間結果を計算して保存（簡略化）
  async calculateAndStoreResults(sessionId: string, questionId: string) {
    // ここで中間結果の計算ロジックを実装し、Firebase に保存
    // biome-ignore lint/suspicious/noConsoleLog: <explanation>
    console.log(
      `Intermediate results calculated and stored for session ${sessionId}, question ${questionId}`,
    );
    // 例：await this.db.ref(`sessionResults/${sessionId}/${questionId}`).set({...});
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
  // biome-ignore lint/correctness/noUnusedVariables: <explanation>
  // biome-ignore lint/correctness/noUnusedFunctionParameters: <explanation>
  async initializeQuestionProgress(sessionId: string, questionId: string, timeLimit: number) {
    await this.db.ref(`questionProgress/${sessionId}`).set({
      currentQuestionId: questionId,
      startedAt: admin.database.ServerValue.TIMESTAMP,
      //   endAt: admin.database.ServerValue.TIMESTAMP + timeLimit * 1000,
      status: "active",
      participants: {},
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
}
