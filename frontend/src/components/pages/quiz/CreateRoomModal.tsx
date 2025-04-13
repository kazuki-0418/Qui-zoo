import { useState } from 'react';
import { Modal, Label, TextInput, ToggleSwitch, Button, Select } from 'flowbite-react';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRoom: (roomData: RoomData) => void;
  availableQuizzes: Array<{ id: string; title: string }>;
}

interface RoomData {
  allowGuests: boolean;
  selectedQuizId: string;
}

export const CreateRoomModal = ({
  isOpen,
  onClose,
  onCreateRoom,
  availableQuizzes,
}: CreateRoomModalProps) => {
  const [roomData, setRoomData] = useState<RoomData>({
    allowGuests: true,
    selectedQuizId: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateRoom(roomData);
    onClose();
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="lg" className="rounded-xl shadow-lg">
      <h2 className="text-xl font-bold">Create Room</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* guest */}
        <div className="flex items-center gap-4">
          <ToggleSwitch
            checked={roomData.allowGuests}
            onChange={(checked) => setRoomData({ ...roomData, allowGuests: checked })}
          />
          <Label htmlFor="allowGuests" className="text-sm font-medium text-gray-700">
            Allow Guest Participation
          </Label>
        </div>

        {/* quiz */}
        <div>
          <Label htmlFor="quizSelect" className="block mb-2 text-sm font-medium text-gray-700">
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

        {/* action */}
        <div className="flex justify-end gap-4">
          <Button color="gray" onClick={onClose} className="px-6 py-2">
            Cancel
          </Button>
          <Button type="submit" color="blue" className="px-6 py-2">
            Create Room
          </Button>
        </div>
      </form>
    </Modal>
  );
};