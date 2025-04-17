import { Avatar } from "flowbite-react";

interface AvatarIconProps {
  avatarImage: string;
  avatarSize?: "xs" | "sm" | "md" | "lg";
}

const images = [
  { id: "penguin-1", path: "/assets/avatars/penguin-1.png" },
  { id: "penguin-2", path: "/assets/avatars/penguin-2.png" },
  { id: "owl-1", path: "/assets/avatars/owl-1.png" },
  { id: "owl-2", path: "/assets/avatars/owl-2.png" },
  { id: "koala", path: "/assets/avatars/koala.png" },
  { id: "hippopotamus", path: "/assets/avatars/hippopotamus.png" },
  { id: "gorilla", path: "/assets/avatars/gorilla.png" },
  { id: "frog", path: "/assets/avatars/frog.png" },
  { id: "cat", path: "/assets/avatars/cat.png" },
];

const getImagePath = (imageId: string) => {
  const image = images.find((img) => img.id === imageId);
  return image?.path || images[0].path;
};

const sizeClasses = {
  xs: "w-6 h-6",
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
};

export function AvatarIcon({ avatarImage, avatarSize = "sm" }: AvatarIconProps) {
  return (
    <div className="flex flex-wrap items-center">
      <Avatar
        img={getImagePath(avatarImage)}
        size={avatarSize}
        rounded
        className={sizeClasses[avatarSize]}
      />
    </div>
  );
}
