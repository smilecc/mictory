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
        <div className="bg-background pr-2 pt-2">
          <SideAvatar />
        </div>
        <div className="bg-surface2 flex flex-1">
          <div className="bg-surface1 relative w-60">
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
