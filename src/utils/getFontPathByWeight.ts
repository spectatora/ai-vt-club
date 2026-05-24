import type { FontData } from "astro:assets";

/**
 * Finds the URL for a font file by weight, style, and format.
 *
 * Astro may emit multiple entries with the same weight+style — one per subset
 * or one per format (e.g. a woff2 entry and a separate truetype/ttf entry).
 * The original `find()` approach stopped at the first weight+style match, which
 * could be the wrong format.  This version searches for the entry whose `src`
 * array actually contains the requested format.
 */
export function getFontPathByWeight(
  fonts: FontData[],
  weight: number,
  options?: {
    style?: "normal" | "italic";
    format?: string;
  }
): string | undefined {
  const style = options?.style ?? "normal";
  const format = options?.format ?? "truetype";

  return fonts
    .find(
      font =>
        font.weight === String(weight) &&
        font.style === style &&
        font.src?.some(file => file.format === format)
    )
    ?.src.find(file => file.format === format)?.url;
}
