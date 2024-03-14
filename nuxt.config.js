const axios = require("axios");
const stringToSlug = require("./utils/stringToSlug");

// const loadLanguages = async () => {
//   return await axios()
//     .get("v1/language/list")
//     .then((response) => {
//       const a = response.data.data;
//       const b = a.map(({ locale }) => locale);
//       return b;
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// };

export default defineNuxtConfig({
  devtools: { enabled: false },
  //debug: true,
  // sourcemap: {
  //   server: true,
  //   client: true,
  // },
  runtimeConfig: {
    public: {
      NUXT_DEFAULT_CURRENCE_CODE:
        process.env.NUXT_DEFAULT_CURRENCE_CODE || "USD",
      NUXT_PUBLIC_SITE_URL:
        process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3030",
      NUXT_API_URL: process.env.NUXT_API_URL || "http://localhost/api/",
      NUXT_SITE_NAME: process.env.NUXT_SITE_NAME || "Gatsby.kz",
    },
  },
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
    },
    //pageTransition: { name: "page", mode: "out-in" },
    //work but with bugs
  },
  routeRules: {
    "/": { redirect: "/rent/" },
  },
  modules: [
    "@pinia/nuxt",
    "nuxt-windicss",
    "@nuxtjs/i18n",
    "nuxt-simple-robots",
    "nuxt-gtag",
    "@nuxt/image",
    "@nuxtjs/sitemap",
  ],
  alias: {
    pinia: "/node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs",
  },
  i18n: {
    lazy: true,
    langDir: "locales",
    locales: [
      {
        code: "en",
        file: "en.json",
      },
      {
        code: "ru",
        file: "ru.json",
      },
      {
        code: "kk",
        file: "kk.json",
      },
    ],
    defaultLocale: process.env.NUXT_DEFAULT_LOCALE || "en",
    strategy: "prefix",
    vueI18n: "./i18n.config.ts",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n",
      redirectOn: "root",
    },
  },
  // imports: {
  //   presets: [
  //     {
  //       from: "vue-i18n",
  //       imports: ["useI18n"],
  //     },
  //   ],
  // },
  windicss: {
    preflight: {
      alias: {
        "nuxt-link": "a",
        "nuxt-img": "img",
      },
    },
  },
  ssr: true,
  sitemap: {
    enabled: true,
    autoI18n: false,
    xsl: false,
    urls: async () => {
      const categoryMap = [];
      const defaultLang = process.env.NUXT_DEFAULT_LOCALE || "en";
      const { data: dataCategories } = await axios.get(
        (process.env.NUXT_API_URL ?? "http://localhost/api/") +
          "v1/client/rent/category/list?with_translations=1&lang=" +
          defaultLang
      );

      //["en", "ru", "kk", "x-default"].map((lang) => ({

      dataCategories.data.forEach((category) => {
        categoryMap.push({
          loc: `/${defaultLang}/rent/c/${stringToSlug(category.title)}`,
          alternatives: category.translations.map((item) => ({
            hreflang: item.language,
            href: `/${item.language}/rent/c/${stringToSlug(item.title)}`,
          })),
          image: category.photos.map((photo) => {
            return { loc: photo.image };
          }),
          priority: 1.0,
          changefreq: "weekly",
        });
      });

      const { data: data2 } = await axios.get(
        (process.env.NUXT_API_URL ?? "http://localhost/api/") +
          "v1/client/rent/dress/list?per_page=100&lang=" +
          defaultLang
      );

      const dressMap = [];
      data2.data.forEach((dress) => {
        dressMap.push({
          loc: `/${defaultLang}/rent/dress/${dress.dress_id}`,
          alternatives: ["en", "ru", "kk", "x-default"].map((lang) => ({
            hreflang: lang,
            href: `/${lang == "x-default" ? defaultLang : lang}/rent/dress/${
              dress.dress_id
            }`,
          })),
          lastmod: dress.updated_at,
          changefreq: "monthly",
          priority: 1.0,
          image: dress.photos.map((photo) => {
            return { loc: photo.image };
          }),
        });
      });

      return [...categoryMap, ...dressMap];
    },
  },
  gtag: {
    id: process.env.NUXT_GTAG ?? "",
  },
  // yandexMetrika: {
  //   id: process.env.NUXT_YANDEX_METRIKA_ID ?? "",
  // },
});
