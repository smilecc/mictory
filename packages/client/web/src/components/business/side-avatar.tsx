import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Avatar, Tooltip } from "@mantine/core";

export interface ISiderAvatarProps {
  active?: boolean;
  name?: string;
  avatar?: string | null;
  icon?: ReactNode;
  onClick?: () => void;
}

export const SideAvatar: React.FC<ISiderAvatarProps> = (props) => {
  return (
    <div className="group mb-2 flex cursor-pointer" onClick={props.onClick}>
      <div className="flex w-2 items-center">
        <div
          className={cn([
            "relative -left-1 h-0 w-full rounded-r-md bg-foreground transition-all group-hover:h-8",
            props.active ? "h-5" : "",
          ])}
        />
      </div>
      <div className="flex h-14 w-14 items-center justify-center">
        <Tooltip label={props.name} position="right" color="dark">
          <Avatar
            color="cyan"
            size="3rem"
            className="overflow-hidden rounded-2xl transition-all group-hover:h-14 group-hover:w-14 group-hover:rounded-md"
            src={props.avatar}
          >
            {props.icon ? props.icon : props.name?.at(0)?.toUpperCase()}
          </Avatar>
        </Tooltip>
      </div>
    </div>
  );
};
