import { en, zhHans } from 'vuetify/locale'
import enLabels from './en'
import zhLabels from './zh'
import { createI18n } from 'vue-i18n'
export default createI18n({
    legacy: false, // Vuetify does not support the legacy mode of vue-i18n
    locale: 'zhHans',
    fallbackLocale: 'en',
    messages: {
        en: {
          $vuetify: {
            ...en,
            label: enLabels,
          },
        },
        zhHans: {
          $vuetify: {
            ...zhHans,
            label: zhLabels,
          },
        },
    },
  })