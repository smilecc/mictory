import { SideAvatar } from "@/components/business";
import { Button } from "@/components/ui/button";
import { useCommonStore } from "@/stores";
import React from "react";
// import { useLoaderData } from "react-router-dom";

export const ChannelPage: React.FC = () => {
  // const loaderData = useLoaderData();
  const commonStore = useCommonStore();

  return (
    <main className="h-screen">
      {/* <div>
        <div>Mictory</div>
      </div> */}
      <div className="flex h-full">
        {/* 侧边栏 */}
        <div className="bg-background pr-2 pt-2">
          <SideAvatar />
        </div>
        <div className="flex flex-1 bg-surface2">
          {/* 频道 */}
          <div className="relative w-60 bg-surface1">
            {/* 底部控制面板 */}
            <div className="absolute inset-x-0 bottom-0 bg-background/60 p-2">
              1
            </div>
          </div>
          <div className="flex-1">
            <Button
              variant="secondary"
              onClick={() => {
                commonStore.setThemeDarkMode(
                  commonStore.themeDarkMode === "dark" ? "light" : "dark",
                );
              }}
            >
              切换主题
            </Button>
          </div>
        </div>
        <div>3</div>
      </div>
    </main>
  );
};
