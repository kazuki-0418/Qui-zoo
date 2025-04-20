import { Request, Response } from "express";
import { Socket } from "socket.io";
import { RealtimeQuizModel } from "../models/realtimeQuiz.model";

const realtimeQuizModel = new RealtimeQuizModel();

// ドメインロジックを担当するクラス
class RealtimeQuizDomain {
  // 回答を処理するドメインロジック
  async processAnswer(
    sessionId: string,
    questionId: string,
    participantId: string,
    selectedOption: string,
  ): Promise<{ isCorrect: boolean; pointsEarned: number }> {
    // 1. 回答時間を記録
    await realtimeQuizModel.recordParticipantAnswered(sessionId, questionId, participantId);
    const answeredAt = Date.now();
    const startedAt = await realtimeQuizModel.getQuestionStartTime(sessionId);
    const endAt = await realtimeQuizModel.getQuestionEndTime(sessionId);
    const timeSpent = answeredAt - startedAt;

    // 2. 正誤判定
    const correctAnswer = await realtimeQuizModel.getCorrectAnswer(sessionId, questionId);
    const isCorrect = selectedOption === correctAnswer;

    // 3. ポイント計算
    const points = isCorrect ? this.calculatePoints(100, timeSpent, endAt - startedAt) : 0; // 例：100 は基本ポイント

    // 4. 回答を保存
    await realtimeQuizModel.saveAnswer(
      sessionId,
      questionId,
      participantId,
      selectedOption,
      isCorrect,
      timeSpent,
      points,
    );

    // 5. スコアを更新
    await realtimeQuizModel.updateParticipantScore(sessionId, participantId, points);

    return { isCorrect, pointsEarned: points };
  }

  // 質問完了を処理するドメインロジック
  async processQuestionCompletion(sessionId: string, questionId: string): Promise<void> {
    // 6. 全員が回答したかチェック
    const allAnswered = await realtimeQuizModel.checkIfAllAnswered(sessionId);
    const now = Date.now();
    const endTime = await realtimeQuizModel.getQuestionEndTime(sessionId);

    if (allAnswered || now >= endTime) {
      await realtimeQuizModel.completeQuestion(sessionId);
      await realtimeQuizModel.calculateAndStoreResults(sessionId, questionId);
      // WebSocketの通知はControllerで行う
    }
  }

  // クイズを開始するドメインロジック
  async processQuizStart(
    sessionId: string,
    questionIds: string[],
    timeLimit: number,
  ): Promise<void> {
    const firstQuestionId = questionIds[0];
    await realtimeQuizModel.updateSessionStatus(sessionId, "active");
    await realtimeQuizModel.initializeQuestionProgress(sessionId, firstQuestionId, timeLimit);
    // WebSocketの通知はControllerで行う
  }

  // 次の質問を開始するドメインロジック
  async processNextQuestion(
    sessionId: string,
    nextQuestionId: string,
    timeLimit: number,
  ): Promise<void> {
    await realtimeQuizModel.initializeQuestionProgress(sessionId, nextQuestionId, timeLimit);
    // WebSocketの通知はControllerで行う
  }

  // プレゼンスを処理するドメインロジック
  async processPresence(sessionId: string, participantId: string): Promise<void> {
    await realtimeQuizModel.setPresence(sessionId, participantId);
    // WebSocketの通知はControllerで行う
  }

  // 最終アクティブタイムスタンプを更新するドメインロジック
  async processLastActive(sessionId: string, participantId: string): Promise<void> {
    await realtimeQuizModel.updateLastActive(sessionId, participantId);
    // WebSocketの通知はControllerで行う
  }

  // ポイント計算ロジック (例)
  private calculatePoints(basePoints: number, timeSpent: number, availableTime: number): number {
    // 時間が短いほど高得点
    const timeRatio = Math.max(0, 1 - timeSpent / availableTime);
    return Math.round(basePoints * (0.5 + 0.5 * timeRatio)); // 最低でも半分のポイント
  }
}

const realtimeQuizDomain = new RealtimeQuizDomain();

// WebSocketイベントを使ってコントローラー層を呼び出す
export const setupRealtimeQuizSocketHandlers = (io: Socket) => {
  io.on("connection", (socket) => {
    socket.on("joinRoom", (sessionId: string) => {
      socket.join(sessionId);
      // biome-ignore lint/suspicious/noConsoleLog: <explanation>
      console.log(`User joined room: ${sessionId}, socket ID: ${socket.id}`);

      // クライアントからのイベントリスナー
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      socket.on("submitAnswer", async (data: any) => {
        try {
          const { questionId, selectedOption } = data;
          const participantId = socket.id; // 例として socket.id を participantId とする

          const { isCorrect, pointsEarned } = await realtimeQuizDomain.processAnswer(
            sessionId,
            questionId,
            participantId,
            selectedOption,
          );

          // クライアントに結果を通知
          socket.emit("answerResult", { isCorrect, pointsEarned });

          // 質問完了をチェックし、必要なら通知
          await realtimeQuizDomain.processQuestionCompletion(sessionId, questionId);
          io.to(sessionId).emit("questionCompleted", { questionId });
        } catch (error) {
          console.error("Error handling submitAnswer:", error);
          socket.emit("error", { message: "Failed to submit answer" });
        }
      });

      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      socket.on("setPresence", async (data: any) => {
        try {
          const { participantId } = data;
          await realtimeQuizDomain.processPresence(sessionId, participantId);
          io.to(sessionId).emit("participantJoined", { participantId });
        } catch (error) {
          console.error("Error handling setPresence:", error);
          socket.emit("error", { message: "Failed to set presence" });
        }
      });

      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      socket.on("updateLastActive", async (data: any) => {
        try {
          const { participantId } = data;
          await realtimeQuizDomain.processLastActive(sessionId, participantId);
        } catch (error) {
          console.error("Error handling updateLastActive:", error);
          socket.emit("error", { message: "Failed to update last active" });
        }
      });

      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      socket.on("startQuiz", async (data: any) => {
        try {
          const { questionIds, timeLimit } = data;
          await realtimeQuizDomain.processQuizStart(sessionId, questionIds, timeLimit);
          io.to(sessionId).emit("quizStarted");
        } catch (error) {
          console.error("Error handling startQuiz:", error);
          socket.emit("error", { message: "Failed to start quiz" });
        }
      });

      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      socket.on("nextQuestion", async (data: any) => {
        try {
          const { nextQuestionId, timeLimit } = data;
          await realtimeQuizDomain.processNextQuestion(sessionId, nextQuestionId, timeLimit);
          io.to(sessionId).emit("nextQuestion", { questionId: nextQuestionId, timeLimit });
        } catch (error) {
          console.error("Error handling nextQuestion:", error);
          socket.emit("error", { message: "Failed to start next question" });
        }
      });

      socket.on("disconnect", () => {
        // biome-ignore lint/suspicious/noConsoleLog: <explanation>
        console.log(`User disconnected from room: ${sessionId}, socket ID: ${socket.id}`);
        // プレゼンスを更新 (オフラインにする)
        realtimeQuizDomain.processPresence(sessionId, socket.id); // socket.id を participantId として使用している場合
      });
    });
  });
};

// REST API 用の Controller (必要に応じて)
class RealtimeQuizController {
  async submitAnswer(req: Request, res: Response) {
    try {
      const { sessionId, questionId, selectedOption } = req.body;
      const participantId = req.params.participantId;

      const { isCorrect, pointsEarned } = await realtimeQuizDomain.processAnswer(
        sessionId,
        questionId,
        participantId,
        selectedOption,
      );

      res.status(200).json({ message: "Answer submitted successfully", isCorrect, pointsEarned });
    } catch (error) {
      console.error("Error submitting answer:", error);
      res.status(500).json({ error: "Failed to submit answer" });
    }
  }

  async startQuiz(req: Request, res: Response) {
    try {
      const { sessionId, questionIds, timeLimit } = req.body;
      await realtimeQuizDomain.processQuizStart(sessionId, questionIds, timeLimit);
      res.status(200).json({ message: "Quiz started" });
    } catch (error) {
      console.error("Error starting quiz:", error);
      res.status(500).json({ error: "Failed to start quiz" });
    }
  }

  async setPresence(req: Request, res: Response) {
    try {
      const { sessionId, participantId } = req.params;
      await realtimeQuizDomain.processPresence(sessionId, participantId);
      res.status(200).json({ message: "Presence set" });
    } catch (error) {
      console.error("Error setting presence:", error);
      res.status(500).json({ error: "Failed to set presence" });
    }
  }

  async updateLastActive(req: Request, res: Response) {
    try {
      const { sessionId, participantId } = req.params;
      await realtimeQuizDomain.processLastActive(sessionId, participantId);
      res.status(200).json({ message: "Last active updated" });
    } catch (error) {
      console.error("Error updating last active:", error);
      res.status(500).json({ error: "Failed to update last active" });
    }
  }

  async nextQuestion(req: Request, res: Response) {
    try {
      const { sessionId, nextQuestionId, timeLimit } = req.body;
      await realtimeQuizDomain.processNextQuestion(sessionId, nextQuestionId, timeLimit);
      res.status(200).json({ message: "Next question started" });
    } catch (error) {
      console.error("Error starting next question:", error);
      res.status(500).json({ error: "Failed to start next question" });
    }
  }
}

export const realtimeQuizController = new RealtimeQuizController();
