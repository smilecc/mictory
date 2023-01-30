import React, { useEffect, useRef, useState } from "react";
import { IconX } from "@tabler/icons-react";
import { ActionIcon } from "@mantine/core";

export const BaseLayout: React.FC<{
  children: React.ReactNode;
}> = (props) => {
  const touchBarRef = useRef<HTMLDivElement>(null);
  const [touchBarHeight, setTouchBarHeight] = useState(90);

  // 动态设置内容部分的高度
  useEffect(() => {
    if (touchBarRef.current) {
      setTouchBarHeight(touchBarRef.current.clientHeight);
    }
  }, [touchBarRef.current]);

  return (
    <div className="h-screen w-screen overflow-hidden rounded-md bg-app-bg">
      <div className="app-drag-bar flex w-screen justify-between bg-app-dark text-sm text-gray-300" ref={touchBarRef}>
        <div className="py-1 pl-3">Mictory</div>
        <div className="app-drag-bar-no">
          <ActionIcon
            radius="xs"
            className="hover:bg-red-500"
            onClick={() => {
              window.electron.ipcRenderer.send("app:close");
            }}
          >
            <IconX size={18} />
          </ActionIcon>
        </div>
      </div>
      <div className="max-h-full overflow-auto" style={{ height: `calc(100vh - ${touchBarHeight}px)` }}>
        {props.children}
      </div>
    </div>
  );
};
