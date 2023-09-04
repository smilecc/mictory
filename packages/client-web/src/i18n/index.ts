import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { zh_CN } from "./langs/zh-cn";
import { MictoryTranslation } from "./langs/type";

declare module "i18next" {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    // custom namespace type, if you changed it
    defaultNS: "translation";
    // custom resources type
    resources: {
      translation: MictoryTranslation;
    };
    // other
  }
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    defaultNS: "translation",
    resources: {
      "zh-CN": {
        translation: zh_CN,
      },
    },
    lng: "zh-CN",

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export { i18n };
