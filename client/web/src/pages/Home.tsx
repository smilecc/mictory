import { useCommonStore } from "@/stores";
import React from "react";

export const HomePage: React.FC = () => {
  const commonStore = useCommonStore();
  return (
    <div
      onClick={() => {
        commonStore.setThemeDarkMode(
          commonStore.themeDarkMode === "dark" ? "light" : "dark"
        );
      }}
    >
      hello
    </div>
  );
};
