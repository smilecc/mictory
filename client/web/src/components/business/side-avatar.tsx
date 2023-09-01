import React from "react";
import { cn } from "@/lib/utils";
import { Avatar, Tooltip } from "@mantine/core";

export interface ISiderAvatarProps {
  active?: boolean;
  name?: string;
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
        <Tooltip label={props.name} position="right" color="dark">
          <Avatar color="cyan" size="3rem" className="rounded-full group-hover:rounded-md">
            {props.name?.at(0)?.toUpperCase()}
          </Avatar>
        </Tooltip>
      </div>
    </div>
  );
};
