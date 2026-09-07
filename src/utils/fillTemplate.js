/**
 * Replaces {{key}} placeholders in a template string with values from a data object.
 *
 * @param {string} template - The template string with {{key}} placeholders
 * @param {Record<string, any>} data - Object mapping keys to values
 * @returns {string} The interpolated template string
 */
export function fillTemplate(template, data = {}) {
  if (!template) return '';
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => {
    return data[key] !== undefined && data[key] !== null ? String(data[key]) : `[${key}]`;
  });
}
