import fs from "fs";
import path from "path";
import { watch } from "fs/promises";
import { LanguageCode, TranslationDictionary } from "../../types/translation";
import { Translator } from "./translator";
import { loadDictionary, saveDictionary } from "./loader";

const JSX_PATTERN = /\.(jsx?|tsx?)$/;

export class TranslationWatcher {
  private translator: Translator;
  private watchDirectory: string;

  constructor(translator: Translator, watchDirectory: string = "./src") {
    this.translator = translator;
    this.watchDirectory = watchDirectory;
  }

  public async watch(): Promise<void> {
    try {
      const watcher = watch(this.watchDirectory, { recursive: true });
      console.log(`Watching ${this.watchDirectory} for changes...`);

      for await (const event of watcher) {
        if (!event.filename || !JSX_PATTERN.test(event.filename)) continue;

        await this.processFile(path.join(this.watchDirectory, event.filename));
      }
    } catch (error) {
      console.error("Watcher error:", error);
      throw error;
    }
  }

  private async processFile(filePath: string): Promise<void> {
    try {
      const content = fs.readFileSync(filePath, "utf8");
      const textRefs = this.extractTextReferences(content);

      if (textRefs.size === 0) return;

      const currentDict = loadDictionary();
      const languages = Object.keys(currentDict) as LanguageCode[];

      // Filter out keys that already exist in the English dictionary
      const newKeys = [...textRefs].filter((key) => {
        const parts = key.split('.');
        let current: { [key: string]: string | TranslationDictionary } = currentDict.en;
        
        // Traverse the dictionary structure
        for (const part of parts) {
          if (!current || typeof current !== 'object' || !(part in current)) {
            return true;
          }
          current = current[part] as { [key: string]: string | TranslationDictionary };
        }
        
        // If we got here, the key exists
        return false;
      });

      if (newKeys.length === 0) {
        console.log(`No new keys found in ${filePath}`);
        return;
      }

      console.log(`Found ${newKeys.length} new keys in ${filePath}:`, newKeys);
      await this.updateDictionary(currentDict, newKeys, languages);
      saveDictionary(currentDict);
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error);
    }
  }

  private extractTextReferences(content: string): Set<string> {
    const pattern = /(?<![a-zA-Z0-9_])text\.([a-zA-Z][\w.]*)(?=\s|$|[,;\)])/g;
    const matches = [...content.matchAll(pattern)];
    return new Set(matches.map(match => match[1]));
  }

  private async updateDictionary(
    dict: TranslationDictionary,
    newKeys: string[],
    languages: LanguageCode[]
  ): Promise<void> {
    for (const key of newKeys) {
      const keys = key.split(".");
      let current = dict.en;

      // Ensure the nested structure exists in English
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]] as { [key: string]: string | TranslationDictionary };
      }

      // Set the key as default value if not exists
      const finalKey = keys[keys.length - 1];
      if (!current[finalKey]) {
        current[finalKey] = finalKey;
      }

      // Translate to other languages
      for (const lang of languages) {
        if (lang === "en") continue;

        let target = dict[lang] || {};
        dict[lang] = target;

        for (let i = 0; i < keys.length - 1; i++) {
          if (!target[keys[i]]) {
            target[keys[i]] = {};
          }
          target = target[keys[i]] as { [key: string]: string | TranslationDictionary };
        }

        if (!target[finalKey]) {
          const sourceValue = current[finalKey];
          if (typeof sourceValue === "string") {
            target[finalKey] = await this.translator.translateKey(
              sourceValue,
              lang
            );
          }
        }
      }
    }
  }
}
