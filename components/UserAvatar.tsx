"use client";

import { UserCircle } from "lucide-react";
import Image from "next/image";

type User = {
  id: number;
  email: string;
  username: string | null;
  avatar_url: string | null;
};

type UserAvatarProps = {
  user: User | null;
  className?: string;
};

const getInitials = (username: string): string => {
  return username
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

const UserAvatar = ({ user, className = "" }: UserAvatarProps) => {
  const baseClasses = "w-7 h-7 md:w-8 md:h-8 rounded-full cursor-pointer";

  if (!user) {
    return (
      <UserCircle
        className={`${baseClasses} text-white ${className}`}
        strokeWidth={1.5}
      />
    );
  }

  if (user.avatar_url) {
    return (
      <div
        className={`${baseClasses} overflow-hidden border border-white/20 ${className}`}
      >
        <Image
          src={user.avatar_url}
          alt={user.username || user.email}
          width={28}
          height={28}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  if (user.username) {
    return (
      <div
        className={`${baseClasses} bg-red flex items-center justify-center text-white text-xs md:text-md font-extrabold ${className}`}
      >
        {getInitials(user.username)}
      </div>
    );
  }

  const emailInitial = user.email[0].toUpperCase();
  return (
    <div
      className={`${baseClasses} bg-red flex items-center justify-center text-white text-xs md:text-md font-extrabold ${className}`}
    >
      {emailInitial}
    </div>
  );
};

export default UserAvatar;
