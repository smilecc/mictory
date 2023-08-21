import React from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { cn } from "@/lib/utils";

export interface ISiderAvatarProps {
  active?: boolean;
}

export const SideAvatar: React.FC<ISiderAvatarProps> = (props) => {
  return (
    <div className="group mb-2 flex cursor-pointer">
      <div className="flex w-2 items-center">
        <div
          className={cn([
            "relative -left-1 h-0 w-full rounded-r-md bg-foreground transition-all group-hover:h-8",
            props.active ? "h-8" : "",
          ])}
        />
      </div>
      <div>
        <Avatar className="h-12 w-12 select-none rounded-full">
          <AvatarFallback>璨</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};
