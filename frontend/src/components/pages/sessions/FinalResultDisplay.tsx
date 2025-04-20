"use client";
import { RankingList } from "@/components/pages/sessions/RankingList";
import type { ParticipantRanking, Result } from "@/types/Result";

type FinalResultPageProps = {
  results: Result;
  myResult: ParticipantRanking | null;
};

export function FinalResultDisplay({ results, myResult }: FinalResultPageProps) {
  return (
    <div className="h-full w-full flex flex-col justify-around">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold mb-2">Final Result</h2>
        {myResult && (
          <span>
            You scored <span className="font-bold">{myResult.score} points</span> and{" "}
            <span className="font-bold">ranked {myResult.rank}</span> 🎉
          </span>
        )}
      </div>
      <RankingList participantRanking={results.participantRanking} />
    </div>
  );
}
