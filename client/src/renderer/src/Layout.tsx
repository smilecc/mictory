import React from "react";
import { IconX } from "@tabler/icons-react";
import { ActionIcon } from "@mantine/core";

export const BaseLayout: React.FC<{
  children: React.ReactNode;
}> = (props) => {
  return (
    <div className="h-screen w-screen bg-slate-900/75">
      <div className="app-drag-bar flex w-screen justify-between bg-slate-900 text-sm text-gray-300">
        <div className="py-1 pl-2">Mictory</div>
        <div className="app-drag-bar-no">
          <ActionIcon
            radius="xs"
            className="hover:bg-red-500"
            onClick={() => {
              console.log(233);
              window.electron.ipcRenderer.send("app:close");
            }}
          >
            <IconX size={18} />
          </ActionIcon>
        </div>
      </div>
      <div>{props.children}</div>
    </div>
  );
};
