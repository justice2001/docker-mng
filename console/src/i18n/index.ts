import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enUs from './en-us.json';
import zhCn from './zh-cn.json';

export const SUPPORTED_LANG = [
    {language: "zh-CN", name: "中文（简体）"},
    {language: "en-US", name: "English"}
];

const option = {
    fallbackLng: 'zh-CN',
    debug: process.env.NODE_ENV !== 'production',
    resources: {
        "en-US": {
            translation: enUs,
        },
        "zh-CN": {
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