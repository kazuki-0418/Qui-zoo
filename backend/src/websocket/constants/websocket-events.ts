/*
// * - Low-level Socket.IO connection management
// * - Defines only basic Socket.IO events
// * - Used in registerCoreHandlers
*/
export const webSocketCoreEvents = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  ERROR: "error",
  JOIN_ROOM: "joinRoom",
  LEAVE_ROOM: "leaveRoom",
  ROOM_COUNT: "roomParticipantCount",
};

/**
 * webSocketAppEvents
 * - Defines events for application-specific concepts that include business logic
 * - Used in registerNotificationHandlers
 */
export const webSocketAppEvents = {
  // 接続関連
  CONNECT: "connect",
  DISCONNECT: "disconnect",

  // セッション関連
  SESSION_JOIN_REQUEST: "session:join:request",
  SESSION_LEAVE_REQUEST: "session:leave:request",

  SESSION_JOIN_SUCCESS: "session:join:success",
  SESSION_LEAVE_SUCCESS: "session:leave:success",
  SESSION_DATA: "session:data",
  SESSION_DATA_RESPONSE: "session:data:response",

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
