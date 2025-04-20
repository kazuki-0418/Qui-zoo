import { CopyRoomCode } from "@/components/ui/CopyRoomCode";

type WaitingRoomHeaderProps = {
  participantsCount: number;
  participantsLimit: number;
  isHost?: boolean;
  roomUrl?: string;
};

export function WaitingRoomHeader({
  participantsCount,
  participantsLimit,
  isHost = false,
  roomUrl = "",
}: WaitingRoomHeaderProps) {
  return (
    <>
      <div className="flex items-center justify-center gap-2">
        <h2 className="text-2xl font-bold">Ready to Start the Quiz</h2>
        <div className="flex items-center gap-1 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          <span className="font-medium">{participantsCount}</span>
          <span>/</span>
          <span>{participantsLimit}</span>
        </div>
      </div>
      {isHost && <CopyRoomCode roomUrl={roomUrl} />}
    </>
  );
}
