import Vue from 'vue';
import VueI18n from 'vue-i18n';

import { getBrowserLocales } from './js/i18n/utils';

Vue.use(VueI18n);

/**
 * @typedef {{ [key: string]: LocaleEntry | string }} LocaleEntry
 */

function loadLocaleMessages() {
  const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i)
  /** @type {Record<string, LocaleEntry>} */
  const messages = {}
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);

    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key);
    }
  });

  return messages;
}

const messages = loadLocaleMessages();
const supportedLocales = Object.keys(messages);
const defaultLocale = process.env.VUE_APP_I18N_LOCALE || 'en';

/**
 * @returns {string} the user's locale choice or the default.
 */
function detectLocale() {
  const browserLocales = getBrowserLocales();

  if (!browserLocales) {
    return defaultLocale;
  }

  const fullMatch = browserLocales.find((tag) => supportedLocales.includes(tag));

  if (fullMatch) {
    return fullMatch;
  }

  return defaultLocale;
}

const locale = detectLocale();

if (locale !== defaultLocale) {
  console.log(`Detected locale: ${locale}.`);
}

export default new VueI18n({
  locale,
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages,
  silentTranslationWarn: true
})
