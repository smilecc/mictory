/* eslint-disable react-hooks/exhaustive-deps */
import { useCommonStore } from "@/stores";
import { ThemeDarkMode } from "@/types";
import { reaction } from "mobx";
import * as React from "react";

export const ThemeWrapper: React.FC<React.PropsWithChildren<unknown>> = (
  props
) => {
  const commonStore = useCommonStore();
  const handleDarkModeChange = React.useCallback(() => {
    console.log("commonStore.themeDarkMode", commonStore.themeDarkMode);
    let theme: ThemeDarkMode = commonStore.themeDarkMode;

    // 匹配系统深色模式
    if (commonStore.themeDarkMode === "system") {
      theme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    // 设置到页面根节点
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, []);

  React.useEffect(() => {
    handleDarkModeChange();
    return reaction(
      () => commonStore.themeDarkMode,
      () => {
        handleDarkModeChange();
      }
    );
  }, []);

  return (
    <>
      <div>{props.children}</div>
    </>
  );
};
