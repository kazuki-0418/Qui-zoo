// 全てのWebSocketイベント名を定義
export const WebSocketEvents = {
  // 接続関連
  CONNECT: "connect",
  DISCONNECT: "disconnect",

  // セッション関連
  SESSION_JOIN: "session:join",
  SESSION_LEAVE: "session:leave",

  // 参加者関連
  PARTICIPANT_JOINED: "participantJoined",
  PARTICIPANT_LEFT: "participantLeft",
  PARTICIPANT_UPDATE: "participantUpdate",

  // クイズ進行関連
  QUIZ_START: "quiz:start",
  QUIZ_NEXT_QUESTION: "quiz:nextQuestion",
  QUIZ_SUBMIT_ANSWER: "quiz:submitAnswer",
  QUIZ_QUESTION_RESULT: "quiz:questionResult",
  QUIZ_END: "quiz:end",

  // エラー
  ERROR: "error",
};
