import React from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";

export const SideAvatar: React.FC = () => {
  return (
    <div className="group flex cursor-pointer">
      <div className="flex w-2 items-center">
        <div className="relative -left-1 h-0 w-full rounded-r-md bg-white transition-all group-hover:h-8" />
      </div>
      <div>
        <Avatar className="h-12 w-12 select-none">
          <AvatarFallback>璨</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};
