import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enGuide from '@/locales/en/guide.json';
import enHome from '@/locales/en/home.json';
import enConnect from '@/locales/en/connect.json';
import enPayment from '@/locales/en/payment.json';
import enStatus from '@/locales/en/status.json';
import enToast from '@/locales/en/toast.json';

import viGuide from '@/locales/vi/guide.json';
import viHome from '@/locales/vi/home.json';
import viConnect from '@/locales/vi/connect.json';
import viPayment from '@/locales/vi/payment.json';
import viStatus from '@/locales/vi/status.json';
import viToast from '@/locales/vi/toast.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'vi',
    debug: false,
    resources: {
      en: {
        guide: enGuide,
        home: enHome,
        connect: enConnect,
        payment: enPayment,
        status: enStatus,
        toast: enToast,
      },
      vi: {
        guide: viGuide,
        home: viHome,
        connect: viConnect,
        payment: viPayment,
        status: viStatus,
        toast: viToast,
      },
    },
    ns: ['guide', 'home', 'connect', 'payment', 'status', 'toast'], 
    defaultNS: 'home',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });
