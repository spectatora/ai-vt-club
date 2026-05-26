import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://ai-vt.club/",
    title: "AI-VT Club",
    description:
      "Независимата общност за изкуствен интелект и хроника на събитията във Велико Търново.",
    author: "AI-VT Club",
    profile: "https://ai-vt.club",
    ogImage: "AI-VT-CLUB_og-image.jpg",
    lang: "bg",           /* Astro i18n routing locale */
    timezone: "Europe/Sofia",
    dir: "ltr",
  },
  posts: {
    perPage: 6,
    perIndex: 6,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: false,
    showArchives: true,
    showBackButton: true,
    editPost: {
      enabled: false,
    },
    search: "pagefind",
  },
  socials: [
    { name: "facebook", url: "https://www.facebook.com/people/AI-VT-Club/61590132702877/" },
    { name: "linkedin", url: "https://www.linkedin.com/groups/19489003/" },
    { name: "mail",     url: "mailto:hello@ai-vt.club" },
  ],
  shareLinks: [
    { name: "facebook", url: "https://www.facebook.com/sharer.php?u=" },
    { name: "x",        url: "https://x.com/intent/post?url=" },
    { name: "telegram", url: "https://t.me/share/url?url=" },
    { name: "mail",     url: "mailto:?subject=Виж%20тази%20статия&body=" },
  ],
});
