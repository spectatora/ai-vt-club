import type { UIStrings } from "../types";

export default {
  nav: {
    home: "Начало",
    posts: "Блог",
    tags: "Тагове",
    about: "За нас",
    archives: "Архив",
    search: "Търсене",
  },
  post: {
    publishedAt: "Публикувано на",
    updatedAt: "Обновено",
    sharePostIntro: "Сподели публикацията:",
    sharePostOn: "Сподели публикацията в {{platform}}",
    sharePostViaEmail: "Сподели публикацията по имейл",
    tagLabel: "Тагове",
    backToTop: "Нагоре",
    goBack: "Назад",
    editPage: "Редактирай страницата",
    previousPost: "Предишна публикация",
    nextPost: "Следваща публикация",
    copyCode: "Копирай",
    codeCopied: "Копирано",
  },
  pagination: {
    prev: "Назад",
    next: "Напред",
    page: "Страница",
  },
  home: {
    socialLinks: "Социални мрежи",
    featured: "Препоръчани",
    recentPosts: "Последни публикации",
    allPosts: "Всички публикации",
  },
  footer: {
    copyright: "Авторски права",
    allRightsReserved: "Всички права запазени.",
  },
  pages: {
    tagTitle: "Таг",
    tagDesc: "Всички статии с тага",

    tagsTitle: "Тагове",
    tagsDesc: "Всички тагове, използвани в публикациите.",

    postsTitle: "Публикации",
    postsDesc: "Всички статии, които съм публикувал.",

    archivesTitle: "Архив",
    archivesDesc: "Всички архивирани статии.",

    searchTitle: "Търсене",
    searchDesc: "Търси статия ...",
  },
  a11y: {
    skipToContent: "Към съдържанието",
    openMenu: "Отвори менюто",
    closeMenu: "Затвори менюто",
    toggleTheme: "Смени темата",
    searchPlaceholder: "Търси в публикациите...",
    noResults: "Няма намерени резултати",
    goToPreviousPage: "Към предишната страница",
    goToNextPage: "Към следващата страница",
    breadcrumb: "път до страницата",
    paginationNav: "Странициране",
    footerNav: "Подвал",
    search: "Търсене",
    socials: "Социални мрежи",
  },
  notFound: {
    title: "404 Не е намерено",
    message: "Страницата не е намерена",
    goHome: "Към началната страница",
  },
} satisfies UIStrings;
