/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
// Composables
import { createVuetify } from "vuetify";

// i18n
import { createVueI18nAdapter } from "vuetify/locale/adapters/vue-i18n";
import { useI18n } from "vue-i18n";
import i18n from "@/i18n/labels";

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  locale: {
    adapter: createVueI18nAdapter({ i18n, useI18n }),
  },
  defaults: {
    global: {
      ripple: false,
      "hide-details": "auto",
      flat: true,
    },
    VTextField: {
      variant: "outlined",
      color: "primary",
      density: "compact",
      clearable : true
    },
  },
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        // colors: {
        //   background: "#ffffff",
        //   primary: "#140a9a",
        //   secondary: '#4c4eca',
        //   error: '#C62828',
        // },
        colors: {
          background: '#ffffff',
          outline: '#2b2b38',
          'outline-variant': '#1b159e',
          primary: '#140a9a',
          'on-primary': '#ffffff',
          secondary: '#1b159e'
        },
      },
    },
  },
});
