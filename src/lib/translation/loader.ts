import fs from "fs";
import path from "path";
import { TranslationDictionary } from "../../types/translation";

const DICT_PATH = path.resolve("./src/lib/translation/dict.ts");

export function loadDictionary(): TranslationDictionary {
  if (!fs.existsSync(DICT_PATH)) return { en: {} };

  try {
    const content = fs.readFileSync(DICT_PATH, "utf8");
    const match = content.match(/export const dict = (.*);/);
    if (!match) return { en: {} };

    // Safely evaluate the dictionary content
    return Function(`return ${match[1]}`)();
  } catch (error) {
    console.error("Error loading dictionary:", error);
    return { en: {} };
  }
}

export function saveDictionary(dict: TranslationDictionary): void {
  const content = `export const dict = ${JSON.stringify(
    dict,
    null,
    2
  )} as const;`;
  fs.writeFileSync(DICT_PATH, content, "utf8");
}

export function flattenDictionary(
  dict: TranslationDictionary,
  prefix = ""
): Set<string> {
  const keys = new Set<string>();

  function traverse(obj: any, currentPath: string) {
    for (const key in obj) {
      const newPath = currentPath ? `${currentPath}.${key}` : key;

      if (typeof obj[key] === "object" && obj[key] !== null) {
        traverse(obj[key], newPath);
      } else {
        keys.add(newPath);
      }
    }
  }

  traverse(dict.en || {}, "");
  return keys;
}
