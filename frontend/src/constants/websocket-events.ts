// 全てのWebSocketイベント名を定義
export const WebSocketEvents = {
  // 接続関連
  CONNECT: "connect",
  DISCONNECT: "disconnect",

  // セッション関連
  SESSION_JOIN: "session:join",
  SESSION_LEAVE: "session:leave",
  SESSION_DATA: "session:data",

  // 参加者関連
  PARTICIPANT_JOINED: "participant:joined",
  PARTICIPANT_LEFT: "participant:left",
  PARTICIPANT_UPDATE: "participant:update",

  // クイズ進行関連
  QUIZ_START: "quiz:start",
  QUIZ_NEXT_QUESTION: "quiz:next",
  QUIZ_SUBMIT_ANSWER: "quiz:submit",
  QUIZ_QUESTION_RESULT: "quiz:result",
  QUIZ_END: "quiz:end",

  // プレゼンス関連
  PRESENCE_UPDATE: "presence:update",
  PRESENCE_STATUS: "presence:status",

  // タイムアウト関連
  TIMEOUT_START: "timeout:start",
  TIMEOUT_END: "timeout:end",

  // ルーム関連
  ROOM_JOIN: "room:join",
  ROOM_LEAVE: "room:leave",

  // エラー
  ERROR: "error",
};