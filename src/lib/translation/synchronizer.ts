import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  TranslationDictionary,
  LanguageCode,
  TranslationConfig,
} from "../../types/translation";
import { SYNCHRONIZATION_PROMPT } from "../../constants/prompts";
import { LANGUAGES } from "@/constants/language";

export class Synchronizer {
  private model: any;
  private maxRetries: number;
  private retryDelay: number;

  constructor(config: TranslationConfig) {
    const genAI = new GoogleGenerativeAI(config.apiKey);
    this.model = genAI.getGenerativeModel({
      model: config.model || "gemini-pro",
    });
    this.maxRetries = config.maxRetries || 3;
    this.retryDelay = config.retryDelay || 1000;
  }

  public async syncDictionary(
    dict: TranslationDictionary
  ): Promise<TranslationDictionary> {
    const synced = { ...dict };
    const languages = Object.keys(synced).filter(
      (lang) => lang !== "en"
    ) as LanguageCode[];

    await Promise.all(
      languages.map(async (lang) => {
        synced[lang] = await this.syncLanguage(
          synced.en,
          synced[lang] || {},
          lang
        );
      })
    );

    return synced;
  }

  private async syncLanguage(
    source: any,
    target: any,
    language: LanguageCode
  ): Promise<any> {
    const result = { ...target };

    async function traverse(
      this: any,
      src: any,
      tgt: any,
      currentPath: string = ""
    ) {
      for (const key in src) {
        const newPath = currentPath ? `${currentPath}.${key}` : key;

        if (typeof src[key] === "object" && src[key] !== null) {
          tgt[key] = tgt[key] || {};
          await traverse(src[key], tgt[key], newPath);
        } else if (!tgt[key] || tgt[key] === key) {
          tgt[key] = await this.syncKey(src[key], tgt[key], language, newPath);
        }
      }
    }

    await traverse.call(this, source, result);
    return result;
  }

  private async syncKey(
    reference: string,
    existing: string | undefined,
    language: LanguageCode,
    keyPath: string
  ): Promise<string> {
    if (existing && existing !== keyPath) return existing;

    const prompt = SYNCHRONIZATION_PROMPT.replace(
      "{LANGUAGE}",
      LANGUAGES[language]
    )
      .replace("{EXISTING}", existing || "")
      .replace("{REFERENCE}", reference);

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const result = await this.model.generateContent(prompt);
        return result.response.text().trim();
      } catch (error) {
        console.error(`Sync failed for ${keyPath} in ${language}:`, error);
        if (attempt === this.maxRetries) return reference; // Fallback
        await new Promise((r) => setTimeout(r, this.retryDelay * attempt));
      }
    }
    return reference;
  }
}
