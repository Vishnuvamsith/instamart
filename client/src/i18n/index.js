// src/i18n/index.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./en.json";
import hi from "./hi.json";
import mr from "./mr.json";
import bn from "./bn.json";
import te from "./te.json";
import kn from "./kn.json";
import ta from "./ta.json";
import ml from "./ml.json";

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  mr: { translation: mr },
  bn: { translation: bn },
  te: { translation: te },
  kn: { translation: kn },
  ta: { translation: ta },
  ml: { translation: ml },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage'], // store selected language in localStorage
    },
  });


export default i18n;
