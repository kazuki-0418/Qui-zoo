import { Server, Socket } from "socket.io";
import { realtimeQuizController } from "../../controllers/realtimeQuiz.controller";
import { websocketController } from "../../controllers/websocket.controller";
import { webSocketAppEvents } from "../constants/websocket-events";
// ソケット拡張型を定義
// interface AuthenticatedSocket extends Socket {
//   userId: string;
// }

// データ型定義
interface SessionJoinData {
  userId: string;
  roomCode: string;
  sessionId: string;
  name: string;
  avatar: string;
  isGuest: boolean;
}

interface SessionLeaveData {
  sessionId: string;
  participantId: string;
  isHost: boolean;
}

export function registerNotificationHandlers(io: Server): void {
  io.on(webSocketAppEvents.CONNECT, (socket: Socket) => {
    // 接続時の処理
    socket.on(webSocketAppEvents.SESSION_DATA, async (data: { sessionId: string }) => {
      try {
        const { sessionId } = data;

        // セッション内の全参加者情報を取得
        const participantsList = await websocketController.getParticipants(sessionId);

        if (sessionId) {
          // セッション情報と現在の参加者リストをクライアントに送信
          socket.emit(webSocketAppEvents.SESSION_DATA_RESPONSE, {
            participants: participantsList,
            sessionId,
            // 必要に応じて他のセッション情報も追加
            currentState: await websocketController.getSessionState(sessionId),
          });

          // セッションルームに参加
          socket.join(sessionId);
          // biome-ignore lint/suspicious/noConsoleLog: <explanation>
          console.log(`Client ${socket.id} joined room ${sessionId} via SESSION_DATA`);
        }
      } catch (error) {
        console.error("Error fetching session data:", error);
        socket.emit(webSocketAppEvents.ERROR, {
          message: `Failed to fetch session data: ${error instanceof Error ? error.message : String(error)}`,
        });
      }
    });

    // ホスト部屋入室ハンドラー
    socket.on(
      webSocketAppEvents.HOST_JOINED,
      async (data: { roomCode: string; sessionId: string }) => {
        try {
          const { sessionId } = data;

          websocketController.saveHostSocketId(sessionId, socket.id);
        } catch (error) {
          console.error("Error creating session:", error);
          const errorMessage = error instanceof Error ? error.message : String(error);
          socket.emit(webSocketAppEvents.ERROR, {
            message: `Failed to create session: ${errorMessage}`,
          });
        }
      },
    );

    // セッション参加ハンドラー
    socket.on(webSocketAppEvents.SESSION_JOIN_REQUEST, async (data: SessionJoinData) => {
      try {
        const { userId, name, avatar, isGuest } = data;

        const participant = await websocketController.joinRoom({
          ...data,
          socketId: socket.id,
        });
        const sessionId = data.sessionId ? data.sessionId : participant.sessionId;
        const participantId = participant.participantId;

        // 自分自身をセッションルームに参加させる
        socket.join(sessionId);

        const allParticipants = await websocketController.getParticipants(sessionId);

        // 他の参加者に通知（自分以外）
        io.to(sessionId).emit(webSocketAppEvents.PARTICIPANT_JOINED, {
          participantId,
          name,
          avatar,
          isGuest,
          allParticipants,
        });

        // 参加成功を自分に通知（全参加者リストを含める）
        socket.emit(webSocketAppEvents.SESSION_JOIN_SUCCESS, {
          success: true,
          participantId,
          sessionId,
        });

        // biome-ignore lint/suspicious/noConsoleLog: <explanation>
        console.log(`User ${userId} joined session ${sessionId} as participant ${participantId}`);
      } catch (error) {
        console.error("Error joining session:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        socket.emit(webSocketAppEvents.ERROR, {
          message: `Failed to join session: ${errorMessage}`,
        });
      }
    });

    // セッション退出ハンドラー
    socket.on(webSocketAppEvents.SESSION_LEAVE_REQUEST, async (data: SessionLeaveData) => {
      try {
        const { sessionId, participantId, isHost } = data;

        // セッションルームから退出
        if (isHost) {
          const participant = await websocketController.getParticipantById({
            sessionId,
            participantId,
          });

          await websocketController.leaveRoom({
            sessionId,
            participantId,
          });

          io.to(participant.socketId).emit(webSocketAppEvents.PARTICIPANT_KICKED, {
            success: true,
            isHost,
          });
          io.to(sessionId).emit(webSocketAppEvents.PARTICIPANT_LEFT, { participantId });

          socket.emit(webSocketAppEvents.SESSION_LEAVE_SUCCESS, {
            success: true,
            participantId,
            isHost,
          });

          const targetSocket = io.sockets.sockets.get(participant.socketId);
          if (targetSocket) {
            targetSocket.leave(sessionId);
          }
          return;
        }

        // 参加者データをオフラインに更新
        await websocketController.leaveRoom({
          sessionId,
          participantId,
        });

        io.to(sessionId).emit(webSocketAppEvents.PARTICIPANT_LEFT, { participantId });

        socket.emit(webSocketAppEvents.SESSION_LEAVE_SUCCESS, {
          success: true,
          participantId,
          isHost,
        });

        if (!isHost) {
          socket.leave(sessionId);
          return;
        }
      } catch (error) {
        console.error("Error leaving session:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        socket.emit(webSocketAppEvents.ERROR, {
          message: `Failed to leave session: ${errorMessage}`,
        });
      }
    });

    // セッション終了ハンドラー
    socket.on(
      webSocketAppEvents.SESSION_CLOSE_REQUEST,
      async (data: { sessionId: string; isHost: boolean }) => {
        try {
          const { sessionId, isHost } = data;

          // セッションを終了
          await websocketController.closeSession(sessionId);

          // 参加者全員にセッション終了通知
          io.to(sessionId).emit(webSocketAppEvents.SESSION_CLOSE_SUCCESS, {
            success: true,
            sessionId,
            isHost,
          });

          // ルームを削除
          socket.leave(sessionId);

          // biome-ignore lint/suspicious/noConsoleLog: <explanation>
          console.log(`Session ${sessionId} closed by host ${isHost}`);
        } catch (error) {
          console.error("Error closing session:", error);
          const errorMessage = error instanceof Error ? error.message : String(error);
          socket.emit(webSocketAppEvents.ERROR, {
            message: `Failed to close session: ${errorMessage}`,
          });
        }
      },
    );

    // クイズ開始ハンドラー
    socket.on(webSocketAppEvents.QUIZ_START_REQUEST, async (data: { sessionId: string }) => {
      try {
        const { sessionId } = data;
        // クイズ開始
        const session = await websocketController.getSessionById(sessionId);
        if (!session) {
          throw new Error("Session not found");
        }

        const questionIds = await websocketController.getQuestionIds(sessionId);
        if (!questionIds || questionIds.length === 0) {
          throw new Error("No questions available for the quiz");
        }

        await realtimeQuizController.startQuiz({
          sessionId,
          questionIds,
        });

        const questionId = questionIds[0]; // 最初のクエスチョンIDを取得

        const firstQuestion = Object.values(session.questions).find(
          (question) => question.id === questionId,
        );
        if (!firstQuestion) {
          throw new Error("First question not found");
        }

        // 参加者全員にクイズ開始通知
        io.to(sessionId).emit(webSocketAppEvents.QUIZ_STARTED, {
          currentQuestion: firstQuestion,
          questionTotal: questionIds.length,
          timeLimit: 10,
        });
      } catch (error) {
        console.error("Error starting quiz:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        socket.emit(webSocketAppEvents.ERROR, {
          message: `Failed to start quiz: ${errorMessage}`,
        });
      }
    });

    socket.on(
      webSocketAppEvents.QUIZ_SUBMIT_ANSWER,
      async (data: {
        sessionId: string;
        questionId: string;
        answer: string;
        participantId: string;
      }) => {
        try {
          const { sessionId, questionId, answer, participantId } = data;

          // 回答を送信
          const response = await realtimeQuizController.submitAnswer({
            sessionId,
            questionId,
            selectedOption: answer,
            participantId,
          });

          if (!response) {
            throw new Error("No data returned from submitAnswer");
          }

          const { isCorrect, answeredParticipantCount } = response;

          const hostId = await websocketController.getHostSocketId(sessionId);
          io.to(hostId).emit(webSocketAppEvents.ANSWER_RESULT_TO_HOST, {
            participantId,
            questionId,
            answer,
            isCorrect,
            answeredParticipantCount,
          });

          // 参加者全員に回答結果を通知
          io.to(sessionId).emit(webSocketAppEvents.ANSWER_RESULT_TO_PARTICIPANTS, {
            answeredParticipantCount,
          });
        } catch (error) {
          console.error("Error submitting answer:", error);
          const errorMessage = error instanceof Error ? error.message : String(error);
          socket.emit(webSocketAppEvents.ERROR, {
            message: `Failed to submit answer: ${errorMessage}`,
          });
        }
      },
    );

    // クイズ結果表示ハンドラー
    socket.on(
      webSocketAppEvents.QUIZ_SHOW_RESULTS,
      async (data: { showResults: boolean; sessionId: string; questionId: string }) => {
        try {
          const { showResults, sessionId } = data;
          if (!showResults) {
            throw new Error("Show results flag is false");
          }

          const sessionResults = await realtimeQuizController.getSessionResults(sessionId);

          if (!sessionResults) {
            throw new Error("No session results available");
          }

          // questionResultsがオブジェクトであることを確認
          const questionResultsEntries =
            sessionResults.questionResults && typeof sessionResults.questionResults === "object"
              ? Object.entries(sessionResults.questionResults)
              : [];

          const questionResult = questionResultsEntries.map(([questionId, result]) => ({
            questionId,
            ...(result as object), // resultをオブジェクトとして扱う
          }))[0];
          // questionResultがnullまたはundefinedでないことを確認
          if (!questionResult) {
            throw new Error("Question result not found");
          }

          // participantRankingを安全に取得
          const participantRanking = sessionResults.participantRanking || [];

          // 参加者全員に結果表示通知
          io.to(sessionId).emit(webSocketAppEvents.QUIZ_QUESTION_RESULT, {
            questionResult,
            participantRanking,
          });
        } catch (error) {
          console.error("Error showing results:", error);
          const errorMessage = error instanceof Error ? error.message : String(error);
          socket.emit(webSocketAppEvents.ERROR, {
            message: `Failed to show results: ${errorMessage}`,
          });
        }
      },
    );
  });
}
