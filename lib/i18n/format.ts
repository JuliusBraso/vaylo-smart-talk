/**
 * Replace `{name}` placeholders in dictionary strings with values.
 * Framework-agnostic; pairs with the SSR dictionary (`t.*`) pattern.
 *
 * - Keys are `[a-zA-Z0-9_]+` inside braces.
 * - Missing keys in `values` leave the `{key}` token unchanged (helps catch typos).
 * - `null` / `undefined` values become an empty string.
 */
const PLACEHOLDER = /\{([a-zA-Z0-9_]+)\}/g;

export type MessageValues = Record<
  string,
  string | number | boolean | null | undefined
>;

export function formatMessage(
  template: string,
  values: MessageValues
): string {
  return template.replace(PLACEHOLDER, (full, key: string) => {
    if (!Object.prototype.hasOwnProperty.call(values, key)) {
      return full;
    }
    const v = values[key];
    if (v === undefined || v === null) {
      return "";
    }
    return String(v);
  });
}
