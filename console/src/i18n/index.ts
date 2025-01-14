import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enUs from './en-us.json';
import zhCn from './zh-cn.json';

export const SUPPORTED_LANG = [
    'zh-cn',
    'en-us',
];

const option = {
    fallbackLng: 'zh',
    debug: process.env.NODE_ENV !== 'production',
    resources: {
        en: {
            translation: enUs,
        },
        zh: {
            translation: zhCn,
        },
    },
    interpolation: {
        escapeValue: false,
    },
};

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init(option);

export default i18n;