/**
 * RTL / direction utilities.
 *
 * Usage:
 *   import { getArrow } from '@/utils/rtl';
 *   <span>{getArrow(lang)}</span>
 */

/**
 * Returns the directional arrow character for the current language.
 * In RTL (Arabic) the arrow points left; in LTR (English) it points right.
 *
 * @param {string} lang - Language code, e.g. 'ar' or 'en'
 * @returns {string} '←' for RTL, '→' for LTR
 */
export function getArrow(lang) {
  return lang === 'ar' ? '←' : '→';
}
