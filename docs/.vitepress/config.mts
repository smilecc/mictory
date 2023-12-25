import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  ignoreDeadLinks: "localhostLinks",
  locales: {
    root: {
      title: "Mictory",
      description: "跨平台私有开黑语音服务",
      label: "简体中文",
      lang: "cn",
      themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
          { text: "主页", link: "/" },
          { text: "文档", link: "/guide/intro", activeMatch: "/guide/" },
        ],

        sidebar: [
          {
            text: "文档",
            items: [
              { text: "介绍", link: "/guide/intro" },
              { text: "快速开始", link: "/guide/get-start" },
            ],
          },
        ],

        socialLinks: [
          { icon: "github", link: "https://github.com/smilecc/mictory" },
        ],
      },
    },
  },
});
