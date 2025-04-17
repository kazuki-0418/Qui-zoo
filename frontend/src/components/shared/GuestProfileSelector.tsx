import { AvatarIcon } from "@/components/ui/AvatarIcon";
import { TextInput } from "flowbite-react";

const avatarOptions = [
  "penguin-1",
  "penguin-2",
  "owl-1",
  "owl-2",
  "koala",
  "hippopotamus",
  "gorilla",
  "frog",
  "cat",
];

interface GuestProfileSelectorProps {
  avatarImage: string;
  guestName: string;
  onAvatarChange: (avatarId: string) => void;
  onNameChange: (name: string) => void;
}

export function GuestProfileSelector({
  avatarImage,
  guestName,
  onAvatarChange,
  onNameChange,
}: GuestProfileSelectorProps) {
  const handleAvatarClick = (id: string) => {
    onAvatarChange(id);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* Avatar Selection */}
      <div className="flex flex-wrap justify-center gap-2">
        {avatarOptions.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => handleAvatarClick(id)}
            className={`p-1 rounded-full border-2 transition-all ${
              avatarImage === id ? "border-blue-500" : "border-transparent"
            } hover:border-blue-300`}
          >
            <AvatarIcon avatarImage={id} avatarSize="md" />
          </button>
        ))}
      </div>

      {/* Name Input */}
      <div>
        <TextInput
          id="nickname"
          placeholder="Enter your name"
          value={guestName}
          onChange={(e) => onNameChange(e.target.value)}
          maxLength={20}
          required
        />
      </div>
    </div>
  );
}
