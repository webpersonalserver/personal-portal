import { defineConfig } from "vitepress";

// https://vitepress.vuejs.org/config/app-configs
export default defineConfig({
  lang: "en-US",
  title: "Documents",
  description: "Study the document",
  srcDir: "./src/Markdown",
  themeConfig: {
    siteTitle: "Documents",
    nav: [{ text: "Home", link: "/" }],
    sidebar: [
      {
        text: "AI",
        link: "/AI",
      },
    ],
  },
});
