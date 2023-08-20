import { SideAvatar } from "@/components/business";
import React from "react";
// import { useLoaderData } from "react-router-dom";

export const ChannelPage: React.FC = () => {
  // const loaderData = useLoaderData();
  return (
    <main className="h-screen">
      {/* <div>
        <div>Mictory</div>
      </div> */}
      <div className="flex h-full">
        <div className="bg-zinc-800">
          <SideAvatar />
        </div>
        <div className="flex-1 bg-zinc-700">2</div>
        <div>3</div>
      </div>
    </main>
  );
};
