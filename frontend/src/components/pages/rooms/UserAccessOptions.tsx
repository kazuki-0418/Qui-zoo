import { GuestProfileSelector } from "@/components/shared/GuestProfileSelector";
import { PushButton } from "@/components/ui/PushButton";
import { avatarOptions } from "@/constants/Avatar";
import Image from "next/image";
import { useEffect, useState } from "react";

interface UserAccessOptionsProps {
  allowGuests: boolean;
}

export function UserAccessOptions({ allowGuests }: UserAccessOptionsProps) {
  const [avatar, setAvatar] = useState("");
  const [name, setName] = useState("");
  const handleLogin = () => {
    // Add your login logic here
  };

  const handleGuest = () => {
    // Add your guest logic here
  };

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * avatarOptions.length);
    setAvatar(avatarOptions[randomIndex]);
  }, []);

  return (
    <div className="h-full flex flex-col justify-center text-center gap-2">
      {!allowGuests ? (
        <div className="flex flex-col items-center gap-2 mt-4">
          <h1 className="text-xl md:text-2xl font-bold mb-3">This is a private room</h1>
          <Image src="/assets/images/lock.png" width={200} height={200} alt={"lock"} />
          <PushButton onClick={handleLogin}>Login to Join the Room</PushButton>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-xl md:text-2xl font-bold">Welcome to the Room</h1>
          <p className="text-sm md:text-base">Please select an option to join room</p>
          <div className="mt-2 mb-8">
            <PushButton onClick={handleLogin}>Login to Join the Room</PushButton>
          </div>
          <GuestProfileSelector
            avatarImage={avatar}
            guestName={name}
            onAvatarChange={setAvatar}
            onNameChange={setName}
          />
          <div className="mt-2">
            <PushButton onClick={handleGuest}>Join as Guest</PushButton>
          </div>
        </div>
      )}
    </div>
  );
}
