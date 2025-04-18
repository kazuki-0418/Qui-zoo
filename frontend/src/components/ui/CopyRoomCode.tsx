import Image from "next/image";
import { useState } from "react";

interface CopyRoomCodeProps {
  roomUrl: string;
}

export function CopyRoomCode({ roomUrl }: CopyRoomCodeProps) {
  const [isCopied, setIsCopied] = useState(false);
  const onCopyRoomCode = () => {
    navigator.clipboard.writeText(roomUrl as string);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex align-center items-center justify-center relative space-x-2">
      <p className="text-gray-600">Room URL: {roomUrl}</p>
      <button
        onClick={onCopyRoomCode}
        className="flex gap-1 align-center text-gray-500 hover:text-gray-700 transition-all duration-300 p-1 rounded-full"
        title="Copy room code"
      >
        <Image
          src={isCopied ? "/assets/icons/check.svg" : "/assets/icons/link.svg"}
          alt={isCopied ? "copied" : "copy"}
          width={20}
          height={20}
          className={`transition-all duration-300 ${isCopied ? "text-green-500" : ""}`}
        />
        <span className="text-sm font-bold">Copy Link</span>
      </button>
    </div>
  );
}
