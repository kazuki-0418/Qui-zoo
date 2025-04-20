"use client";
import { PushButton } from "@/components/ui/PushButton";
import type { CreateRoom } from "@/types/Room";
import { createRoom } from "@/usecases/room/createRoomUsecase";
import { Label, Modal, RangeSlider, Select, ToggleSwitch } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type CreateRoomModalProps = {
  isOpen: boolean;
  onClose: () => void;
  createRoom: (roomData: CreateRoom) => void;
  availableQuizzes?: Array<{ id: string; title: string }>;
  selectedQuizId?: string | null;
};

// type RoomData = {
//   allowGuests: boolean;
//   selectedQuizId: string;
//   timeLimit: number;
//   participantLimit: number;
// };

export function CreateRoomModal({
  isOpen,
  onClose,
  // onCreateRoom_
  availableQuizzes,
  selectedQuizId,
}: CreateRoomModalProps) {
  const router = useRouter();

  const [roomData, setRoomData] = useState<CreateRoom>({
    allowGuests: true,
    selectedQuizId: selectedQuizId ? selectedQuizId : "",
    timeLimit: 30,
    participantLimit: 10,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await createRoom(roomData);
      const roomCode = response.data.roomCode;
      router.push(`/rooms/${roomCode}/host/`);
    } catch (err) {
      console.error("Failed to create the room:", err);
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="lg">
      <div className="p-5 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Quiz選択 */}
          {availableQuizzes && !selectedQuizId ? (
            <div>
              <Label htmlFor="quizSelect" className="block mb-2 text-sm font-medium text-gray-500">
                Select a Quiz
              </Label>
              <Select
                id="quizSelect"
                required
                value={roomData.selectedQuizId}
                onChange={(e) => setRoomData({ ...roomData, selectedQuizId: e.target.value })}
                className="bg-white"
              >
                <option value="">Please select a quiz</option>
                {availableQuizzes.map((quiz) => (
                  <option key={quiz.id} value={quiz.id}>
                    {quiz.title}
                  </option>
                ))}
              </Select>
            </div>
          ) : availableQuizzes ? (
            <h2 className="text-lg font-bold">
              {availableQuizzes.find((quiz) => quiz.id === selectedQuizId)?.title}
            </h2>
          ) : null}

          {/* 参加人数制限 */}
          <div>
            <Label
              htmlFor="participantLimit"
              className="block mb-2 text-sm font-medium text-gray-500"
            >
              Participant Limit
            </Label>
            <Select
              id="participantLimit"
              value={roomData.participantLimit}
              onChange={(e) =>
                setRoomData({
                  ...roomData,
                  participantLimit: Number(e.target.value),
                })
              }
            >
              <option value="5">Up to 5</option>
              <option value="10">Up to 10</option>
              <option value="20">Up to 20</option>
              <option value="30">Up to 30</option>
              <option value="50">Up to 50</option>
            </Select>
          </div>

          {/* 時間制限 */}
          <div>
            <Label htmlFor="timeLimit" className="block mb-2 text-sm font-medium text-gray-500">
              Time Per Question
            </Label>
            <div className="w-full text-center text-xs text-gray-500 font-bold">
              {roomData.timeLimit}min
            </div>
            <div className="flex justify-between gap-3 text-xs text-gray-500 mt-1">
              <span>10</span>
              <RangeSlider
                id="timeLimit"
                className="w-full mb-4"
                min={10}
                max={180}
                step={5}
                value={roomData.timeLimit}
                onChange={(e) => setRoomData({ ...roomData, timeLimit: Number(e.target.value) })}
              />
              <span>180</span>
            </div>
          </div>

          {/* ゲスト参加 */}
          <div>
            <Label htmlFor="allowGuests" className="block mb-2 text-sm font-medium text-gray-500">
              Allow Guest Participation
            </Label>
            <ToggleSwitch
              className="mt-3"
              checked={roomData.allowGuests}
              onChange={(checked) => setRoomData({ ...roomData, allowGuests: checked })}
            />
          </div>

          {/* アクションボタン */}
          <div className="flex justify-end gap-4 mt-10">
            <PushButton onClick={onClose} width="full" color="cancel">
              Cancel
            </PushButton>
            <PushButton onClick={() => createRoom(roomData)} width="full">
              Create Room
            </PushButton>
          </div>
        </form>
      </div>
    </Modal>
  );
}
