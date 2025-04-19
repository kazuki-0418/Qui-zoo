"use client";
import { HostWaitingRoom } from "@/components/pages/rooms/host/HostWaitingRoom";
import { ParticipantWaitingRoom } from "@/components/pages/sessions/ParticipantWaitingRoom";
import { FullHeightCardLayout } from "@/components/ui/FullHeightCardLayout";
import { useQuiz } from "@/contexts/QuizContext";

export default function SessionPage() {
  const {
    quizState,
    currentQuestion,
    timeRemaining,
    submitAnswer,
    hasAnswered,
    selectedAnswer,
    questionResults,
  } = useQuiz();

  const isHost = false; // TODO: fetch from server

  if (isHost) {
    return (
      <FullHeightCardLayout>
        <HostWaitingRoom />
      </FullHeightCardLayout>
    );
  }

  return (
    <FullHeightCardLayout useWithHeader={false}>
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        {quizState === "waiting" && <ParticipantWaitingRoom />}

        {quizState === "ready" && (
          <div className="text-center max-w-md mx-auto">
            <h1 className="text-3xl font-bold mb-6">クイズを開始します</h1>
            <p className="text-lg mb-8">準備はよろしいですか？</p>

            <div className="animate-pulse">
              <p className="text-lg text-gray-600">ホストがクイズを開始するのを待っています...</p>
            </div>
          </div>
        )}

        {quizState === "active" && currentQuestion && (
          <div className="w-full max-w-2xl">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">残り時間: {timeRemaining}秒</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full">
                {/* <div
                  className={`h-2 rounded-full transition-all duration-1000 ease-linear ${
                    timeRemaining > 5 ? "bg-green-500" : "bg-red-500"
                  }`}
                  style={{ width: `${(timeRemaining / 10) * 100}%` }} // 10秒を想定
                ></div> */}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">{currentQuestion.text}</h2>
              {currentQuestion.picture && (
                <img
                  src={currentQuestion.picture}
                  alt="Question illustration"
                  className="w-full max-h-64 object-contain mb-4 rounded-md"
                />
              )}
            </div>

            <div className="grid gap-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={option[index]}
                  onClick={() => submitAnswer(option)}
                  disabled={hasAnswered}
                  className={`p-4 text-left rounded-lg transition ${
                    selectedAnswer === option
                      ? "bg-blue-100 border-2 border-blue-500"
                      : "bg-white border border-gray-300 hover:bg-gray-50"
                  } ${hasAnswered && selectedAnswer !== option ? "opacity-50" : ""}`}
                >
                  <span className="inline-block w-7 h-7 rounded-full bg-gray-100 text-center mr-3">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </button>
              ))}
            </div>

            {hasAnswered && (
              <div className="mt-6 text-center text-green-600 font-medium">
                回答を受け付けました。他の参加者の回答を待っています...
              </div>
            )}
          </div>
        )}

        {quizState === "answering" && currentQuestion && (
          <div className="w-full max-w-2xl text-center">
            <h2 className="text-2xl font-bold mb-6">回答を選択してください</h2>
            <p className="text-lg mb-8">{currentQuestion.text}</p>

            <div className="grid gap-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={option[index]}
                  onClick={() => submitAnswer(option)}
                  disabled={hasAnswered}
                  className={`p-4 text-left rounded-lg transition ${
                    selectedAnswer === option
                      ? "bg-blue-100 border-2 border-blue-500"
                      : "bg-white border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <span className="inline-block w-7 h-7 rounded-full bg-gray-100 text-center mr-3">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </button>
              ))}
            </div>

            {hasAnswered && (
              <div className="mt-6 text-green-600 font-medium">回答を受け付けました</div>
            )}

            {timeRemaining === 0 && !hasAnswered && (
              <div className="mt-6 text-red-600 font-medium">時間切れです！</div>
            )}
          </div>
        )}

        {quizState === "results" && currentQuestion && questionResults && (
          <div className="w-full max-w-2xl">
            <h2 className="text-2xl font-bold text-center mb-6">質問結果</h2>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-xl font-medium mb-4">{currentQuestion.text}</h3>

              <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
                <p className="font-medium text-green-800">正解: {currentQuestion.correctOption}</p>
              </div>

              {questionResults.map((result) => (
                <div key={result.questionId} className="mb-4">
                  {result.questionId === currentQuestion.id && (
                    <div
                      className={`p-4 rounded-md ${
                        result.selectedAnswer === result.correctAnswer
                          ? "bg-green-50 border border-green-200"
                          : "bg-red-50 border border-red-200"
                      }`}
                    >
                      <p className="font-medium">
                        あなたの回答: {result.selectedAnswer || "未回答"}
                      </p>
                      <p
                        className={
                          result.selectedAnswer === result.correctAnswer
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {result.selectedAnswer === result.correctAnswer
                          ? `+${result.points}ポイント獲得！`
                          : "不正解"}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="text-center text-gray-600">次の質問が始まるまでお待ちください...</div>
          </div>
        )}

        {quizState === "completed" && (
          <div className="w-full max-w-2xl text-center">
            <h2 className="text-3xl font-bold mb-6">クイズ終了！</h2>

            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-xl font-medium mb-6">最終結果</h3>

              <div className="mb-8">
                {questionResults && questionResults.length > 0 ? (
                  <div>
                    <p className="text-2xl font-bold mb-2">
                      {questionResults.reduce((total, result) => total + result.points, 0)}ポイント
                    </p>
                    <p className="text-gray-600">
                      正解数:{" "}
                      {questionResults.filter((r) => r.selectedAnswer === r.correctAnswer).length} /
                      {questionResults.length}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-600">結果を集計中...</p>
                )}
              </div>

              {/* <div className="space-y-4">
                <h4 className="font-medium">参加者ランキング</h4>
                {participants.length > 0 ? (
                  <div className="space-y-2">
                    {participants
                      .sort((a, b) => b.score - a.score)
                      .map((participant, index) => (
                        <div
                          key={participant.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                        >
                          <div className="flex items-center">
                            <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 font-medium">
                              {index + 1}
                            </span>
                            <span>{participant.name || `参加者 ${index + 1}`}</span>
                          </div>
                          <span className="font-medium">{participant.score || 0}ポイント</span>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-600">参加者データを読み込み中...</p>
                )}
              </div> */}
            </div>

            <button
              onClick={() => {
                window.location.href = "/";
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              ホームに戻る
            </button>
          </div>
        )}
      </div>
    </FullHeightCardLayout>
  );
}
